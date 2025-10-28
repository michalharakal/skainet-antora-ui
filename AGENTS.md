1) Project Overview

What it is.
This repository produces the default UI bundle for sites generated with Antora. It contains Handlebars templates (layouts & partials), CSS, JavaScript, images, and a Gulp build that packages these assets into a distributable UI bundle ZIP. Antora’s UI loader fetches that bundle and renders your site by weaving Antora’s content model into the templates.
about.gitlab.com
+1

Architecture at a glance.

UI source (src/): Handlebars layouts/partials, helpers (*.js), modular CSS, JS, fonts, images. Built into _/ assets and then bundled.
about.gitlab.com
+6
about.gitlab.com
+6
about.gitlab.com
+6

Build system: Gulp 4 tasks stitch CSS with PostCSS (imports, custom properties, autoprefix), bundle JS via Browserify, minify, copy fonts/images, and pack build/ui-bundle.zip.
about.gitlab.com

Preview (gulp preview): builds to public/, runs a local server with live reload.
about.gitlab.com

Tech stack.

Node engine: >= 8.0.0 (project metadata). The README examples reference Node 10 LTS for development environment setup.
about.gitlab.com
+1

Gulp 4, PostCSS toolchain, Browserify + browser-pack-flat, Stylelint, ESLint (Standard), Highlight.js, Handlebars.
about.gitlab.com

Primary consumption model.
Consume this project as a UI bundle from your Antora playbook (YAML) using ui.bundle.url (remote artifact or local filesystem path). The package’s index.js is a placeholder only; it’s not meant to be require()’d as an API.
about.gitlab.com
+2
docs.antora.org
+2

2) Setup for Consumption

Your goal is to reference a UI bundle from your Antora playbook, not to import JavaScript APIs.

Option A — Use the official prebuilt bundle (recommended quick start)

Add to your antora-playbook.yml:

ui:
  bundle:
    url: https://gitlab.com/antora/antora-ui-default/-/jobs/artifacts/HEAD/raw/build/ui-bundle.zip?job=bundle-stable
    snapshot: true


snapshot: true tells Antora to refetch when using --fetch even though the URL is stable.
about.gitlab.com

Generate the site:

npx antora antora-playbook.yml


Antora will fetch and apply the UI bundle automatically.
docs.antora.org

Option B — Build the bundle locally (to pin or customize)
git clone https://gitlab.com/antora/antora-ui-default.git
cd antora-ui-default
npm install
npx gulp bundle   # outputs build/ui-bundle.zip


Point your playbook at the local bundle:

ui:
  bundle:
    url: ./build/ui-bundle.zip


Build steps, preview server (gulp preview), and output path are defined by the project’s Gulp tasks and README.
about.gitlab.com
+1

Requirements

Node.js and npm installed; the README examples use Node 10 LTS (nvm instructions included). Install the Gulp CLI (or use npx gulp).
about.gitlab.com

Note: Antora itself is a separate dependency/CLI in your site project; this UI repo only builds the UI bundle consumed by Antora.
docs.antora.org

3) Architecture and Structure
Directory layout (key folders)

src/ – UI sources

layouts/ → page layouts; required: default.hbs, optional 404.hbs.
about.gitlab.com
+2
about.gitlab.com
+2

partials/ → composable fragments (e.g., head, header, body, footer, nav, main, etc.).
about.gitlab.com
+5
about.gitlab.com
+5
about.gitlab.com
+5

helpers/ → Handlebars helpers (e.g., and.js, or.js, eq.js, relativize.js, detag.js).
about.gitlab.com
+4
about.gitlab.com
+4
about.gitlab.com
+4

css/ → modular CSS combined into site.css (imports include typography, nav, doc, highlight, etc.).
about.gitlab.com

img/, font/, js/ → static assets and client scripts (bundled & minified into js/site.js).
about.gitlab.com

preview-src/ – sample content for offline preview build.
about.gitlab.com

public/ – output of preview server; _ subdir contains staged UI assets.
about.gitlab.com

build/ – distribution artifacts (not checked in), notably ui-bundle.zip.
about.gitlab.com

gulp.d/ – build task definitions; used by gulpfile.js.
about.gitlab.com
+1

Build/data flow (high-level)

Gulp build reads src/:

PostCSS resolves imports, CSS variables, URLs; autoprefix & minify for production.

JS bundles from js/+([0-9])-*.js (and vendor bundles) via Browserify → js/site.js.

Fonts/images copied (images optimized outside preview).

Handlebars assets (layouts, partials, helpers) are staged for bundling.
about.gitlab.com

Bundle step packs staged assets into build/ui-bundle.zip. Antora fetches this bundle and renders the site using your content model.
about.gitlab.com
+1

Extension points

Handlebars helpers: add JS files in helpers/ (name becomes helper name). Example helpers available: and, or, eq, relativize, detag.
about.gitlab.com
+4
about.gitlab.com
+4
about.gitlab.com
+4

Supplemental UI (playbook overlay): extend/override layouts/partials/helpers/CSS/JS without forking by providing ui.supplemental_files.
docs.antora.org

UI descriptor (src/ui.yml, optional): declare promoted static files (e.g., favicon.ico) to copy to site root.
docs.antora.org

4) API and Usage Guide

There’s no runtime JavaScript API exported for Node; the “API” here is the UI bundle (templates, helpers, assets) Antora consumes. Use cases below are expressed as playbook YAML and template snippets.

4.1 Use the Default UI in a site
# antora-playbook.yml
ui:
  bundle:
    url: https://gitlab.com/antora/antora-ui-default/-/jobs/artifacts/HEAD/raw/build/ui-bundle.zip?job=bundle-stable
    snapshot: true


Run: npx antora antora-playbook.yml.
about.gitlab.com
+1

4.2 Extend UI with the Supplemental UI

Overlay custom files from your site repo:

# antora-playbook.yml
ui:
  bundle:
    url: ./build/ui-bundle.zip
  supplemental_files: ./supplemental-ui


Use this to override a partial (e.g., replace partials/edit-this-page.hbs) or add CSS/JS. See UI Keys and Supplemental UI docs for full options.
docs.antora.org
+1

Tip: When adding CSS via supplemental UI, register your stylesheet in a head partial (e.g., customize head-styles.hbs) so it’s loaded.
Stack Overflow

4.3 Promote static files from the UI

Add src/ui.yml to your UI project to promote static files to the site root:

# src/ui.yml
static_files:
  - favicon.ico


Build & bundle; Antora will copy favicon.ico to the site root.
docs.antora.org

4.4 Handlebars helpers and templates

Helpers (selected examples in this repo):

{{#if (and condA condB)}}...{{/if}}     {{!-- src/helpers/and.js --}}
{{#if (or condA condB)}}...{{/if}}      {{!-- src/helpers/or.js --}}
{{#if (eq page.layout '404')}}...{{/if}} {{!-- src/helpers/eq.js --}}
{{relativize '/docs/guide/'}}            {{!-- src/helpers/relativize.js --}}
{{{detag page.title}}}                   {{!-- src/helpers/detag.js --}}


These helpers are loaded automatically from helpers/*.js in the UI bundle.
about.gitlab.com
+4
about.gitlab.com
+4
about.gitlab.com
+4

Layouts & partials (composition example):

{{!-- src/layouts/default.hbs --}}
{{> head defaultPageTitle='Untitled'}}
{{> header}}
{{> body}}
{{> footer}}


body includes the toolbar, toc, and article; 404 layout switches to an error article.
about.gitlab.com
+1

Relative linking from templates using the default relativize helper: see the “Work with the Handlebars Templates” doc for usage patterns.
docs.antora.org

4.5 CSS strategy

src/css/site.css imports modular styles (base.css, nav.css, doc.css, highlight.css, etc.). PostCSS resolves imports and variables; the build outputs a single site.css. Use CSS custom properties (vars.css) to theme.
about.gitlab.com
+1

4.6 Advanced playbook keys

ui.bundle.start_path: use a subfolder inside a bundle (e.g., “dark” theme).

ui.default_layout: force a default layout when pages don’t specify one.

ui.output_dir: change the target directory name for UI assets.
See UI Keys for full details.
docs.antora.org

5) Testing and Validation

Lint & format the UI sources (helpful when you maintain a fork/custom bundle):

npx gulp lint       # stylelint (CSS) + eslint (JS)
npx gulp format     # prettier-eslint for JS sources


See task names in gulpfile.js.
about.gitlab.com

Preview the UI locally (offline sample content):

npx gulp preview           # live reload at http://localhost:5252
# or one-off build:
npx gulp preview:build     # outputs to public/


The preview uses preview-src/ sample pages to let you inspect the UI without generating a full Antora site.
about.gitlab.com

Validate integration from your site project:

npx antora --clean --fetch antora-playbook.yml
# then open: build/site/index.html (path may vary by playbook)


Antora fetches the bundle and merges it with the content model.
docs.antora.org

Debugging tips

In preview, source maps are enabled automatically. To include them in a production bundle: SOURCEMAPS=true npx gulp bundle.
about.gitlab.com

When publishing to GitHub Pages, ensure a .nojekyll file is present so the _ directories used for UI assets aren’t stripped.
docs.antora.org

6) Best Practices and Conventions

Code style: ESLint Standard for JS; Stylelint standard for CSS. Follow the repo’s linting to keep future merges smooth.
about.gitlab.com

CSS theming: Prefer CSS variables in vars.css and additive overrides via supplemental UI over modifying compiled files.
docs.antora.org

Customization strategy: Start with supplemental UI for small/medium tweaks; fork or build your own bundle only for deeper changes.
docs.antora.org

Compatibility: The project metadata lists Node >=8. For modern environments, align with the Node LTS used in your CI; the README examples reference Node 10 via nvm.
about.gitlab.com
+1

Security: When pinning dependencies in a fork, run your CI’s advisory scanning (e.g., npm audit) and lockfile updates. (The repo ships versions such as Highlight.js 9.18.3—plan upgrades in your fork as needed.)
about.gitlab.com

7) Troubleshooting and Limitations

“My custom CSS doesn’t load via supplemental UI.” Make sure you register it in a head partial (e.g., override head-styles.hbs) so the page includes it.
Stack Overflow

“Where are my UI assets after publish?” GitHub Pages may strip _ directories unless .nojekyll exists at the site root.
docs.antora.org

When not to use this repo as-is. If you need a drastically different layout or corporate theme, fork this repo (or start a new UI project) and publish your own bundle; use the supplemental UI for small overlays only.
docs.antora.org

8) Additional Resources

Project README (quickstart, build & preview, artifact URL).
about.gitlab.com

Antora Default UI docs (overall guide).
docs.antora.org

Build preview UI (preview tasks).
docs.antora.org

Work with templates (helpers, model, edit URL, etc.).
docs.antora.org

Work with stylesheets (CSS modules, variables).
docs.antora.org

UI Keys (all playbook keys for UI).
docs.antora.org

UI Bundle URL (how Antora fetches UI bundles).
docs.antora.org

Supplemental UI (overlay/override mechanism).
docs.antora.org

Appendix: Notable Files & What They Do (for agents)

src/layouts/default.hbs, src/layouts/404.hbs — required layouts.
about.gitlab.com
+1

src/partials/* — structural composition: head, header, body → nav + main → toolbar, toc, article, footer.
about.gitlab.com
+4
about.gitlab.com
+4
about.gitlab.com
+4

src/helpers/and.js, or.js, eq.js, relativize.js, detag.js — helper examples used across templates.
about.gitlab.com
+4
about.gitlab.com
+4
about.gitlab.com
+4

src/css/site.css — aggregator that imports module CSS (vars.css, base.css, nav.css, doc.css, highlight.css, etc.).
about.gitlab.com

gulpfile.js, gulp.d/tasks/*.js — build/preview/bundle tasks (lint, format, bundle packing to build/ui-bundle.zip; preview server on :5252).
about.gitlab.com
+1

index.js — placeholder so the package can be discoverable via require.resolve (no public runtime API).
about.gitlab.com
