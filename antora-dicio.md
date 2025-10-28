# Antora Landing UI PRD (Divio-aligned)

This PRD follows the Divio documentation system structure to describe the customization of the Antora default UI for a dedicated landing page experience while preserving existing capabilities.

## Tutorials

### Tutorial: Build and Preview the Customized UI

1. **Clone and install**: Obtain the Antora default UI repository, run `npm install`, and ensure Gulp CLI access via `npx` or global install.
2. **Add landing assets**: Create the landing-specific templates/partials, companion CSS module, and register the new stylesheet via a single import addition (see Reference).
3. **Run preview**: Execute `npx gulp preview` to validate the landing page rendering against sample content featuring the `landing-page` attribute.
4. **Bundle for Antora**: Build `build/ui-bundle.zip` using `npx gulp bundle` and reference it in the target Antora playbook via `ui.bundle.url`.
5. **Deploy and verify**: Integrate the bundle with the content site, confirm both landing and standard documentation pages render correctly, and share verification notes with stakeholders.

### Tutorial Outcome

- A working UI bundle that detects `landing-page` AsciiDoc pages, renders a hero-focused layout, and continues to serve all default UI flows.
- Preview artifacts demonstrating the landing layout and traditional documentation layout side by side.

## How-to Guides

### How-to: Author a Landing Page in AsciiDoc

1. **Mark the page**: In the AsciiDoc header, add `:landing-page:` to set the attribute consumed by the UI.
2. **Define hero content**: Provide title, subtitle, and optional call-to-action data using page-scoped AsciiDoc attributes (`:page-subtitle:`, `:page-cta-label:`, `:page-cta-url:`).
3. **Populate value propositions**: Supply up to six highlight cards using attribute sets such as `:page-value1-title:`, `:page-value1-summary:`, `:page-value1-icon:`.
4. **Configure CTA card**: Provide closing call-to-action copy via attributes like `:page-cta-bottom-title:`, `:page-cta-bottom-summary:`, `:page-cta-bottom-label:`, and `:page-cta-bottom-url:`.
5. **Preview locally**: Use the preview server to confirm the hero, value proposition grid, and closing CTA card render with the supplied metadata and gracefully handle missing optional fields.

### How-to: Configure the Landing Layout

1. **Template hook-up**: Create/extend a `landing.hbs` layout (or conditional block in `default.hbs`) that checks `page.attributes['landing-page']`.
2. **Partial composition**: Reuse existing header, navigation, footer, and toolbar partials; inject a hero partial ahead of the main body when the landing attribute is present.
3. **Style import**: Append a single `@import './landing.css';` (or equivalent) in `src/css/site.css` to load the new hero styling module while keeping the PostCSS pipeline intact.
4. **Accessibility QA**: Verify heading hierarchy, color contrast, keyboard navigation, and focus states within the landing hero components.

## Explanation

### Product Context

- The existing default Antora UI offers robust documentation navigation, search integration, version switching, edit links, and responsive layout. All of these must remain unaffected by the customization.
- Marketing and docs stakeholders require a distinctive landing experience to introduce the documentation set with rich hero visuals without forking or replacing the entire UI.

### Goals

- **Primary**: Detect pages marked with the `landing-page` attribute and render them using a dedicated hero-forward layout while preserving standard navigation and content structure.
- **Secondary**: Minimize divergence from upstream by confining changes to isolated templates/partials, a single CSS module import, and optional helper tweaks.
- **Tertiary**: Ensure maintainability by keeping Gulp tasks, asset pipelines, and supplemental UI compatibility unchanged.

### Non-Goals

- Providing a generic theme overhaul across all pages.
- Introducing additional build tooling beyond the existing Gulp/PostCSS/Browserify stack.
- Replacing search, navigation, or other default UI behaviors.

### Risks & Mitigations

- **Risk**: Landing-specific CSS might leak styles into documentation pages. **Mitigation**: Scope selectors under a `.landing-page` body class and validate during preview.
- **Risk**: Attribute detection fails for supplemental content. **Mitigation**: Add unit smoke tests or preview fixtures with/without the attribute; gracefully fallback to default layout if absent.
- **Risk**: Hero imagery affects load performance. **Mitigation**: Optimize assets (lazy-loading, responsive sizes) and document expected asset handling in the How-to section.

## Reference

### Functional Requirements

- **Landing detection**: Pages with `page.attributes['landing-page']` (or equivalent front-matter flag) render the landing layout; other pages continue using the default layout unaffected.
- **Hero composition**: Landing layout supports hero title, subtitle, description, CTA button/link, optional background media, and secondary highlight cards sourced from `:page-*` attributes. Missing data must not break layout.
- **Value proposition grid**: Support up to six promotional cards with icon, heading, summary, and link metadata, rendered in a responsive grid that degrades gracefully when fewer cards are provided.
- **Closing CTA card**: Include a bottom-of-page emphasis panel with headline, supporting paragraph, and dual CTA buttons mirroring the brand style.
- **Navigation parity**: Global navigation, breadcrumbs, content toolbar, version switcher, and footer remain identical between landing and standard pages.
- **Supplemental UI compatibility**: Existing supplemental override mechanisms (partials/helpers/css/js) continue to function, including on landing pages.

### Implementation Constraints

- **Import addition**: Introduce exactly one new import—`@import './landing.css';`—within `src/css/site.css` (or equivalent) to register landing-specific styles through PostCSS.
- **Template reuse**: Prefer conditional logic in `default.hbs` or a derived layout extending it, instead of duplicating large template fragments.
- **Helper usage**: Leverage existing helpers (`and`, `or`, `eq`, `relativize`, `detag`) before adding new helpers; any new helper must be justified and documented.
- **Responsive behavior**: Maintain responsiveness across breakpoints utilized by the default UI.

### Acceptance Criteria

- ✅ Landing attribute present → hero layout renders, hero CTA functional, navigation intact.
- ✅ Value proposition grid displays supplied cards in 1–3 column layout depending on viewport.
- ✅ Closing CTA card appears when configured and inherits button theming consistent with hero actions.
- ✅ Landing attribute absent → page renders identically to unmodified default UI.
- ✅ Preview build demonstrates both landing and non-landing pages without console errors or style regressions.
- ✅ Bundle build succeeds with no changes required to existing Gulp tasks or build pipeline.
- ✅ Documentation (this PRD) referenced in project README or internal playbook for future maintainers.

### Dependencies & Deliverables

- **Dependencies**: Antora default UI repository, Node.js (≥10 recommended), existing Gulp/PostCSS toolchain, sample landing content.
- **Deliverables**: Updated Handlebars templates/partials, new landing CSS module, preview fixtures illustrating hero layout, revised documentation referencing attribute usage, and release notes for the bundle.
