# Documentation & Handoff Plan

## README / Guide Updates

- Add a “Landing Page Experience” section to the project README explaining:
  - Purpose of the landing enhancement and reference to the PRD (`antora-dicio.md`).
  - How to enable the feature using the `:landing-page:` attribute and optional metadata for hero (`:page-subtitle:`, `:page-cta-label:` ...), value propositions (`:page-value1-title:` ... `:page-value6-summary:`), and closing CTA card (`:page-cta-bottom-title:` ...).
  - Locations of new templates (`landing-body.hbs`, `landing-value-prop.hbs`, `landing-cta-card.hbs`), styles (`landing.css`), and preview sample content.
  - Reminder that the rest of the UI behaves as the default bundle.
- Link to supplemental documentation for teams adopting the landing layout (e.g., attribute cheat sheet).

## Changelog / Release Notes

- Introduce a changelog entry describing the new landing page capability, listing:
  - Attribute trigger (`:landing-page:`) and supported metadata fields (all prefixed with `:page-` for UI consumption).
  - Newly available components: value proposition grid (`landing-value-prop`) and closing CTA card (`landing-cta-card`).
  - Reassurance that default documentation pages remain unchanged.
  - Guidance to rebuild or fetch the updated UI bundle.
- If the project uses Git tags/releases, include upgrade steps and compatibility notes.

## Verification Checklist & Handoff

- Document the verification steps (preview URL, lint/build commands) and store alongside QA notes (`docs/landing-preview.md`).
- Provide stakeholders with:
  - Screenshots/demos of the landing page.
  - Instructions for creating new landing pages via AsciiDoc attributes.
  - Contact/ownership info for continued maintenance and future iterations.
- Schedule a brief walkthrough with documentation/marketing stakeholders to confirm acceptance before release.
