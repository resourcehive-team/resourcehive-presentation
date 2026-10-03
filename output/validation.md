# Presentation validation

Validated on 3 October 2026 (Asia/Colombo). This is validation of the presentation, not a new test execution of the ResourceHive application.

## Structure and timing

- Exactly 16 slides.
- Six dedicated feature slides (5–10), one combined techniques slide (11), and supporting product/evaluation slides.
- Target speaking notes total **13 minutes 55 seconds**, excluding the live demo, optional evaluation questions, and source-reference reading.
- No invented code-coverage, measured speedup, production-capacity, or Windows executable claims.
- Slide 14 identifies its historical test date and revision; notes preserve the recorded limitations.

## Build and browser

- Dependency installation with the frozen pnpm lockfile succeeded.
- `pnpm check` passed.
- `pnpm build` succeeded with Slidev 53.0.0.
- The built deck loaded all 16 slides in Chromium at 1600 × 900.
- The development preview at `http://localhost:3030` also passed the full 16-slide browser check.
- Arrow-key navigation and presenter notes passed.
- Roboto loaded locally; all supporting paragraphs have full opacity.
- Eight Mermaid diagrams rendered, and Carbon icons appeared on the expected slides.
- No text blocks or code overflowed the checked slide boundaries.
- No browser runtime errors, failed local asset responses, or external asset requests occurred in the built-deck check. External HTTP asset requests were actively blocked during the check.
- The headless inspection disables only the browser's display wake-lock setting, which is not relevant to rendering or presenting the slides.

## Exports and visual review

- `pnpm export` produced `resourcehive-technical-evaluation.pdf` with **16 nonempty pages**.
- The cover omits the footer; pages 2–16 show the correct individual slide numbers.
- `pnpm export:png` produced **16 PNG slide images** under `output/slides/`.
- The final PDF was independently rendered with Poppler and all 16 pages inspected.
- All slide layouts were visually inspected, with full-size checks for the architecture, booking/conflict, notification-state, combined-techniques, and code-excerpt slides.
- Supporting text and the code excerpt were strengthened after the first inspection; the final build and exports include those adjustments.
- No clipping, missing diagrams/icons, or unreadable glyphs were observed in the final PDF review.

## Reproducibility notes

The project is independent of the application repository. Fonts, icons, diagrams, and the logo are bundled locally. Application/source references in speaker notes are explanatory references, not runtime imports.

Slidev 53's Comark adapter requires the Markdown-it 14 token API, and its code-helper integration expects the earlier FloatingVue component shape. The compatible versions are pinned in `pnpm-workspace.yaml` and locked in `pnpm-lock.yaml`.

Fresh machines need a Playwright Chromium browser for exporting; install it with `pnpm exec playwright install chromium` if absent. Source instructions are in the project README.

## Local load-results update
Slide 14 now separates the archived automated checks from project-owner-reported local success rates: above 90% for up to 20 virtual users, 75% for 30, and 49% for 50. No application load tests were rerun. Static build, all 16 browser checks, PDF and PNG exports passed. The updated PDF page was visually inspected and its values verified; the deck retains 16 pages and 16 slide images.

