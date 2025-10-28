'use strict'

const Handlebars = require('handlebars')

module.exports = function landingPage (page) {
  if (!page || !page.contents) return {}

  let html = page.contents
  if (Buffer.isBuffer(html)) html = html.toString()
  const result = {}

  const heroSection = takeSection(html, 'hero-section')
  if (heroSection) {
    result.hero = buildHero(heroSection.html, page)
    html = heroSection.remainder
  }

  const valuesSection = takeSection(html, 'value-proposition-grid')
  if (valuesSection) {
    result.values = buildValues(valuesSection.html, page)
    html = valuesSection.remainder
  }

  const ctaSection = takeSection(html, 'call-to-action')
  if (ctaSection) {
    result.cta = buildCta(ctaSection.html, page)
    html = ctaSection.remainder
  }

  const remainder = normalizeHtml(html)
  if (remainder) {
    result.body = new Handlebars.SafeString(remainder)
  }

  return result
}

function buildHero (sectionHtml, page) {
  const hero = {}
  const attrs = page && page.attributes ? page.attributes : {}

  hero.heading = textFromTag(sectionHtml, 'h2') || decodeEntities(page && page.title)

  const bodyBlock = takeDiv(sectionHtml, 'sectionbody')
  let bodyHtml = bodyBlock ? stripOuterDiv(bodyBlock) : ''

  const imagePattern = /<img[^>]*src="([^"]+)"[^>]*>/i
  const altPattern = /<img[^>]*alt="([^"]*)"[^>]*>/i
  const imageMatch = sectionHtml.match(imagePattern)
  const altMatch = sectionHtml.match(altPattern)
  const heroImage = imageMatch ? imageMatch[1] : (attrs['hero-image'] || attrs.hero_image)
  if (heroImage) {
    hero.image = {
      src: heroImage,
      alt: decodeEntities(altMatch ? altMatch[1] : (attrs['hero-alt'] || attrs.hero_alt || hero.heading)),
    }
  }

  if (bodyHtml) {
    bodyHtml = bodyHtml.replace(/<div class="imageblock[\s\S]*?<\/div>\s*<\/div>/gi, '')
    const normalised = normalizeContent(bodyHtml)
    if (normalised) hero.body = new Handlebars.SafeString(normalised)
  } else if (attrs['meta-description'] || attrs.meta_description) {
    const description = attrs['meta-description'] || attrs.meta_description
    hero.body = new Handlebars.SafeString(
      '<p>' + Handlebars.Utils.escapeExpression(description) + '</p>'
    )
  }

  const primaryUrl = attrs['cta-url'] || attrs.cta_url || null
  const primaryLabel = attrs['cta-label'] || attrs.cta_label || hero.heading || 'Learn more'
  if (primaryUrl) {
    hero.cta = {
      url: primaryUrl,
      label: decodeEntities(primaryLabel),
    }
  }

  return hero
}

function buildValues (sectionHtml, page) {
  const values = {}
  const headingMatch = sectionHtml.match(/<h2[^>]*>([\s\S]*?)<\/h2>/i)
  if (headingMatch) {
    values.heading = decodeEntities(stripTags(headingMatch[1]).trim())
  } else if (page && page.title) {
    values.heading = `Why Choose ${decodeEntities(page.title)}?`
  }

  const bodyBlock = takeDiv(sectionHtml, 'sectionbody')
  if (!bodyBlock) return values
  const bodyInner = stripOuterDiv(bodyBlock)
  if (!bodyInner) return values

  const firstCardIndex = bodyInner.indexOf('<div class="sect2 value-card')
  if (firstCardIndex > 0) {
    const intro = normalizeContent(bodyInner.slice(0, firstCardIndex))
    if (intro) values.summary = new Handlebars.SafeString(intro)
  }

  const cards = []
  let cursor = 0
  while (cursor < bodyInner.length) {
    const start = bodyInner.indexOf('<div class="sect2 value-card', cursor)
    if (start === -1) break
    const cardHtml = sliceDiv(bodyInner, start)
    if (!cardHtml) break
    cards.push(buildValueCard(cardHtml))
    cursor = start + cardHtml.length
  }
  if (cards.length) values.cards = cards

  return values
}

function buildValueCard (cardHtml) {
  const card = {}
  const classMatch = cardHtml.match(/class="([^"]*)"/)
  const classes = classMatch ? classMatch[1].split(/\s+/) : []

  const iconClass = findClass(classes, 'icon-')
  if (iconClass) {
    const iconName = iconClass.slice(5)
    card.icon = formatLabel(iconName)
    card.badge = initialsFromSlug(iconName)
  }

  let accent = findClass(classes, 'accent-')
  if (!accent) accent = 'accent-indigo'
  card.accent = accent.replace(/^accent-/, '')

  const titleMatch = cardHtml.match(/<h3[^>]*>([\s\S]*?)<\/h3>/i)
  if (titleMatch) {
    card.title = decodeEntities(stripTags(titleMatch[1]).trim())
  }

  const bodyMatch = collectParagraphs(cardHtml)
  if (bodyMatch) card.body = new Handlebars.SafeString(bodyMatch)

  return card
}

function buildCta (sectionHtml, page) {
  const attrs = page && page.attributes ? page.attributes : {}
  const cta = {}

  const heading = textFromTag(sectionHtml, 'h2')
  const fallbackLabel = attrs['cta-label'] || attrs.cta_label || 'Get started'
  cta.heading = heading || decodeEntities(fallbackLabel)

  const bodyBlock = takeDiv(sectionHtml, 'sectionbody')
  let bodyHtml = bodyBlock ? stripOuterDiv(bodyBlock) : ''

  let url
  let label
  if (bodyHtml) {
    const linkMatch = bodyHtml.match(/<a[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/i)
    if (linkMatch) {
      url = linkMatch[1]
      label = decodeEntities(stripTags(linkMatch[2]).trim())
      bodyHtml = bodyHtml.replace(linkMatch[0], '')
    }
  }

  if (!url) url = attrs['cta-url'] || attrs.cta_url || null
  if (url) {
    const buttonLabel = label && label !== url ? label : (cta.heading || decodeEntities(fallbackLabel))
    cta.button = {
      url,
      label: buttonLabel,
    }
  }

  const summary = normalizeContent(bodyHtml)
  if (summary) cta.summary = new Handlebars.SafeString(summary)

  return cta
}

function takeSection (html, role) {
  let cursor = 0
  while (cursor < html.length) {
    const start = html.indexOf('<div', cursor)
    if (start === -1) return null
    const tagEnd = html.indexOf('>', start)
    if (tagEnd === -1) return null
    const tag = html.slice(start, tagEnd + 1)
    const classMatch = tag.match(/class="([^"]*)"/)
    cursor = tagEnd + 1
    if (!classMatch) continue
    const classes = classMatch[1].split(/\s+/)
    if (classes.includes('sect1') && classes.includes(role)) {
      const block = sliceDiv(html, start)
      if (!block) return null
      return {
        html: block,
        remainder: html.slice(0, start) + html.slice(start + block.length),
      }
    }
  }
  return null
}

function takeDiv (html, className) {
  const pattern = new RegExp('<div class="([^"]*\\b' + escapeForRegExp(className) + '\\b[^"]*)"[^>]*>', 'i')
  const match = pattern.exec(html)
  if (!match) return null
  return sliceDiv(html, match.index)
}

function sliceDiv (html, start) {
  let depth = 0
  let i = start
  while (i < html.length) {
    if (html.slice(i, i + 4) === '<div') {
      depth++
      i = html.indexOf('>', i)
      if (i === -1) return null
      i++
      continue
    }
    if (html.slice(i, i + 6) === '</div>') {
      depth--
      i += 6
      if (depth === 0) return html.slice(start, i)
      continue
    }
    i++
  }
  return null
}

function stripOuterDiv (html) {
  if (!html) return ''
  const firstClose = html.indexOf('>')
  if (firstClose === -1) return ''
  const inner = html.slice(firstClose + 1)
  return inner.replace(/<\/div>\s*$/, '')
}

function collectParagraphs (html) {
  const fragments = []
  let cursor = 0
  while (cursor < html.length) {
    const start = html.indexOf('<div class="paragraph', cursor)
    if (start === -1) break
    const block = sliceDiv(html, start)
    if (!block) break
    let content = stripOuterDiv(block)
    content = normalizeContent(content)
    if (content) fragments.push(content)
    cursor = start + block.length
  }
  return fragments.join('')
}

function normalizeContent (html) {
  if (!html) return ''
  let output = html
  output = output.replace(/<div class="title">[\s\S]*?<\/div>/gi, '')
  output = output.replace(/<div class="paragraph">\s*<p>\s*<\/p>\s*<\/div>/gi, '')
  output = output.replace(/<div class="paragraph">([\s\S]*?)<\/div>/gi, '$1')
  output = output.trim()
  return output
}

function normalizeHtml (html) {
  if (!html) return ''
  const trimmed = html.trim()
  return trimmed
}

function textFromTag (html, tag) {
  const pattern = new RegExp(String.raw`<${tag}[^>]*>([\s\S]*?)</${tag}>`, 'i')
  const match = pattern.exec(html)
  return match ? decodeEntities(stripTags(match[1]).trim()) : ''
}

function findClass (classes, prefix) {
  for (const cls of classes) {
    if (cls && cls.indexOf(prefix) === 0) return cls
  }
  return null
}

function formatLabel (value) {
  if (!value) return ''
  return decodeEntities(value.replace(/[-_]+/g, ' ')).replace(/\b\w/g, (match) => match.toUpperCase())
}

function initialsFromSlug (value) {
  if (!value) return ''
  const words = value.split(/[-_]+/).filter(Boolean)
  if (!words.length) return ''
  const letters = words.slice(0, 2).map((word) => word[0]).join('')
  return letters.toUpperCase()
}

function stripTags (html) {
  return html.replace(/<[^>]*>/g, '')
}

function decodeEntities (value) {
  if (!value) return ''
  return value
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#(?:x)?([0-9a-fA-F]+);/g, (_, code) => {
      const num = /^x/i.test(code) ? parseInt(code.slice(1), 16) : parseInt(code, 10)
      return Number.isNaN(num) ? _ : String.fromCharCode(num)
    })
}

function escapeForRegExp (value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}
