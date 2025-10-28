# Landing Template & Helper Planning

## Layout Strategy

- **Conditional rendering**: Extend `src/layouts/default.hbs` with a conditional branch that loads a dedicated landing layout partial when `page.attributes['landing-page']` is truthy. Fallback continues to the standard `body` partial.
- **Landing partials**: Introduce `src/partials/landing-body.hbs` (hero + promotional sections) that internally reuses existing header/footer partials and augments the main content area while optionally invoking `article.hbs` for additional sections.
- **Class scoping**: Add a `landing-page` class to `<body>` when the attribute is present; combine with the `.article` class for styling compatibility.
- **Content blocks**: Landing body composes hero (title, subtitle, CTAs, media), value proposition grid (`landing-value-prop`), documentation article wrapper, and a closing CTA card (`landing-cta-card`).

## Helper Usage

- **Attribute access**: Use built-in Handlebars to read `page.attributes['landing-page']`, `page.attributes['page-subtitle']`, `page.attributes['page-summary']`, `page.attributes['value-grid-title']`, `page.attributes['value1-title']`…`value6-*`, `page.attributes['cta-bottom-title']`, etc., all sourced from AsciiDoc attributes prefixed with `:page-`.
- **Existing helpers**: Utilize `or`, `and`, `eq`, and `relativize` as needed for conditional rendering and URL handling. No new helpers required initially.
- **Data defaults**: Fallback to page title (`page.title`) and lead paragraph when optional attributes are missing; ensure `detag` cleans HTML for hero text as necessary.

## Implementation Notes

- **File additions**: Create `landing.hbs` (optional) if branching in `default.hbs` becomes unwieldy, but prefer minimal changes by inserting a conditional around the `body` partial call. Add `landing-main.hbs`, `landing-hero.hbs`, `landing-value-prop.hbs`, and `landing-cta-card.hbs` to assemble each block.
- **JS impact**: No JavaScript changes anticipated since hero interactivity remains simple (links/buttons). Consider progressive enhancement later if needed.
- **Preview content**: Add landing fixture to `preview-src` referencing the new attributes to facilitate QA and stakeholder demos.
