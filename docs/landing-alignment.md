# Landing UI Planning & Alignment Notes

## 1. Attribute Schema Validation

- AsciiDoc attribute names regularly include hyphenated tokens (e.g., `:page-layout:`, `:page-role:`) and are surfaced in Antora as `page.attributes['page-layout']`.
- Retrieving `page.attributes['landing-page']` fits the existing Antora rendering model and does not collide with built-in keys.
- Decision: proceed with the `:landing-page:` document attribute to toggle the landing experience.

## 2. Landing Content Requirements Inventory

- **Hero title and subtitle** sourced from page title and optional `:page-subtitle:` attribute.
- **Lead copy** leveraging the AsciiDoc lead paragraph or a dedicated `:page-summary:` attribute.
- **Primary CTA** configured via `:cta-label:` and `:cta-url:` attributes; optional second CTA may be handled through `:cta2-label:`/`:cta2-url:`.
- **Media** allowing optional hero illustration specified with `:hero-image:` (path or URL) plus alternative text attribute `:hero-alt:`.
- **Highlight tiles** (optional) represented by repeated attribute blocks (`:highlight1-title:`, `:highlight1-link:`, etc.) with graceful fallback when omitted.

## 3. Supplemental UI Compatibility & Regression Boundaries

- Core navigation, toolbar, breadcrumbs, search, and footer partials remain unchanged and continue to accept overrides through supplemental UI.
- Landing-specific layout logic will be confined to a conditional branch/partial injection to avoid duplicating existing templates.
- Styling is isolated inside a `.landing-page` body class to prevent bleed-over into documentation pages, enabling supplemental CSS overrides to coexist.
- Build pipeline (Gulp, PostCSS, Browserify) remains untouched aside from the single CSS module import, preserving downstream automation and release processes.
