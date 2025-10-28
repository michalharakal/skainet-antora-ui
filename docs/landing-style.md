# Landing Styling & Asset Plan

## CSS Structure

- **Module file**: Add `src/css/landing.css` to house hero and landing-specific styles.
- **Scoped selectors**: Prefix all rules with `.landing-page` to avoid affecting standard documentation views.
- **Import**: Register the module via a single addition in `src/css/site.css` — `@import './landing.css';` — preserving build constraints.

## Layout & Responsiveness

- **Hero section**: Use CSS grid or flexbox to align title, subtitle, CTA group, and illustration; ensure graceful stacking below tablet width (<768px).
- **Value proposition grid**: Present up to six cards in a responsive grid (1 column mobile, 3 columns tablet+), each card with icon container, heading, summary, and link styling consistent with the brand.
- **Closing CTA card**: Center a high-contrast panel with dual buttons styled similarly to the hero actions, including hover/focus elevation.
- **Typography**: Reuse existing CSS custom properties (e.g., `--font-size-xl`) for consistent scaling with default UI.
- **Breakpoints**: Support existing breakpoints (large ≥1200px, medium 768–1199px, small <768px) with responsive adjustments for hero media.
- **Spacing**: Align margins and padding with established rhythm (e.g., multiples of `var(--space-lg)`), ensuring transition between hero and main content is smooth.

## Asset Optimization

- **Images**: Encourage SVG or optimized WebP/PNG hero imagery. Document expected asset paths (e.g., `_/img/landing/hero.svg`) and implement lazy loading where appropriate; icon glyphs may be delivered via emoji or inline SVG in card metadata.
- **Fallbacks**: Provide background color gradients or solid color fallback when media is absent.
- **Accessibility**: Maintain sufficient contrast for text overlaid on imagery; rely on `.landing-page` theme tokens where necessary.

## QA Considerations

- Verify cross-browser rendering in evergreen browsers plus baseline Safari/Firefox.
- Confirm keyboard focus outlines remain visible on CTA buttons.
- Ensure CSS addition compiles cleanly through PostCSS and respects existing linting rules.
