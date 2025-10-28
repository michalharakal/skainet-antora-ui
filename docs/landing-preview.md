# Landing Preview & QA Plan

## Preview Content Updates

- Add `preview-src/landing.adoc` featuring the `:landing-page:` attribute, hero metadata (`:page-subtitle:`, `:page-summary:`, `:page-cta-label:` ...), value proposition card attributes (`:page-value1-*` … `:page-value6-*`), and closing CTA fields (`:page-cta-bottom-*`).
- Link the landing page in `preview-src/ui-model.yml` so the preview navigation exposes it alongside the existing sample pages.
- Ensure preview assets (e.g., hero imagery) are placed under `preview-src` and referenced with relative paths compatible with the preview build pipeline.

## Verification Workflow

1. Run `npx gulp preview` and inspect `http://localhost:5252/landing.html` (expected landing URL) to validate:
   - Hero layout renders correctly on landing pages.
   - Value proposition grid displays the configured cards with accurate copy and links.
   - Closing CTA card appears when `:page-cta-bottom-*` attributes are provided and supports both buttons.
   - Standard `index.html` and 404 pages remain unaffected.
2. Perform responsive checks via browser dev tools at desktop, tablet, and mobile breakpoints.
3. Confirm keyboard navigation, focus outlines, and screen reader semantics remain intact (header/nav/footer, CTA buttons).
4. Capture screenshots or short loom-style recordings for stakeholder review.

## Build & Lint Validation

- Execute `npx gulp lint` to ensure CSS/JS additions comply with existing linting rules.
- Build the bundle using `npx gulp bundle` and verify `build/ui-bundle.zip` includes the landing templates, partials, and CSS.
- Optionally test Antora integration with `npx antora --clean --fetch antora-playbook.yml` (from a consuming site) pointing to the new bundle.

## Regression Boundaries

- Confirm supplemental UI overrides continue to work by testing a sample override on top of the customized bundle.
- Monitor browser console for errors or warnings introduced by the landing enhancements.
- Ensure there are no regressions in search, pagination, or version selector behaviors when navigating between landing and standard pages.
