# Skainet Docs Preview

To rebuild the updated landing experience with the refreshed UI bundle:

1. From the repository root run `npx gulp bundle` to emit `build/ui-bundle.zip`.
2. Enter `skainet-docs` and run `npx antora antora-playbook.yml` (add `--fetch` if the bundle path changes).
3. Open `build/site/index.html` and navigate to `/landing.html` to verify the new hero, value grid, and CTA flow.

Restart `npx gulp preview` after helper or partial changes so the landing layout renders the latest assets.
