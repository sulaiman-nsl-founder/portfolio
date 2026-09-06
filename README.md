# Sulaiman Portfolio

Hardware & Product Development Engineer portfolio.

## Current implementation

- React and Vite foundation
- Monochrome editorial design system
- Responsive homepage, work index, and hash-routed project detail pages
- Public GitHub repository discovery for `sulaiman-nsl-founder`
- `portfolio/hero.*` image preference with graceful fallback
- Featured projects via the `portfolio-featured` GitHub topic
- Natural-aspect-ratio masonry gallery
- No private GitHub credentials required or exposed

## Run locally

```bash
npm install
npm run dev
```

## Portfolio-ready repository convention

Add a `portfolio/hero.jpg` file and additional gallery images under `portfolio/`. Add the `portfolio-featured` topic when a project should be eligible for the homepage. Use the README to document the problem, requirements, architecture, hardware, firmware, debugging, testing, results, and lessons learned.

## Next implementation checkpoints

1. Add project-specific metadata for optional year, status, LinkedIn URL, and richer case-study sections.
2. Replace the placeholder email with the real public contact address.
3. Add production image optimization and deployment-specific caching/revalidation.
4. Add automated tests and accessibility/performance checks.
