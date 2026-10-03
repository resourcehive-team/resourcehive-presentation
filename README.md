# ResourceHive technical-evaluation presentation

A standalone 16-slide Slidev deck for a 12–15 minute talk, excluding the live demo and questions. The deck uses black-and-white styling, locally bundled Roboto fonts, Carbon icons, and Mermaid diagrams. The existing logo retains its original colors.

## Open and present

Requirements: Node.js 22.12 or newer and pnpm 10.34.5.

```powershell
cd C:\Users\malindu\repos\resourcehive-presentation
pnpm install --frozen-lockfile
pnpm dev
```

Open <http://localhost:3030>. Use arrow keys or Space to move through slides. Presenter mode is available at <http://localhost:3030/presenter/1> and includes the speaking notes. Press `O` for the slide overview.

The live application demo is separate: <https://app.resourcehive.thisismalindu.com>. Prepare member/admin accounts, a future slot, and sufficient points ahead of time. The presentation does not claim a Windows executable exists.

## Edit

- `slides.md`: all content, Mermaid diagrams, speaking notes, and source references.
- `style.css`: typography, spacing, and minimal slide layouts.
- `setup/mermaid.ts`: shared monochrome diagram styling.
- `public/resourcehive-mark.svg`: copied existing application logo.

The parser and tooltip-helper compatibility pins in `pnpm-workspace.yaml` are intentional for Slidev 53. Preserve them and the lockfile when reinstalling.

Six dedicated slides cover booking concurrency, the points ledger, Kafka, reliable notification processing, university isolation, and session refresh. Redis, live updates, data loading, UI states, and gateway/health checks share one slide.

## Build and export

```powershell
pnpm check
pnpm build
pnpm export
pnpm export:png
```

The static presentation is written to `dist/`. Serve it through an HTTP server; do not open its HTML directly using `file://`.

Run `pnpm preview` to serve the built deck at <http://127.0.0.1:3031> without starting the Slidev development server.

## Host on Vercel

Import this presentation repository as a Vercel project. Keep the project root at the repository root and use Node.js 24.x in the Vercel project settings. `vercel.json` sets the frozen pnpm install, Slidev build, `dist/` output, and a fallback route so direct slide and presenter links load after a refresh. The `packageManager` field pins the pnpm version.

The site is an interactive Slidev presentation: arrow keys and Space navigate slides, and `/presenter/1` opens presenter mode with speaking notes. These notes are included in the public build, so review them before sharing the Vercel URL. No environment variables or server functions are required for the presentation itself.

After deployment, open `/1`, refresh a direct link such as `/14`, navigate between slides, and open `/presenter/1` to check the presenter view. The Vercel build serves the Slidev site; the separate ResourceHive application linked in the slides keeps its own hosting.

The PDF fallback is `output/resourcehive-technical-evaluation.pdf`. PNG slide images are written under `output/slides/`.

PDF and PNG export use Playwright Chromium. If its browser is missing, run:

```powershell
pnpm exec playwright install chromium
```

The built deck bundles its fonts, icons, and logo; viewing slide content does not require a font CDN or icon service. The application link still requires network access. No hosting or application deployment is included.

## Evidence and qualifications

Technical claims were checked against the ResourceHive workspace on 3 October 2026. Speaker notes identify repository-relative evidence paths. Those references are documentation for the presenter, not runtime imports, so this project remains independent of the application repository.

Slide 14 separates selected **historical automated checks** from project-reported local load results. The automated checks come from the **27 September 2026** execution against revision `bcc0bd962d2ff7a151d88d2b7b485d01d89905d2`, as recorded in `internal-documentation/test-results/2026-09-27-bcc0bd9/findings.md`. The subsequent current-setup execution is a separate evidence set. No application tests were rerun to update this deck, and test counts are not code-coverage percentages.

The project owner supplied these local load-testing success rates: **above 90% for up to 20 virtual users**, **75% for 30**, and **49% for 50**. Their run date, revision, duration, and exact success-rate definition were not supplied, so they are not attributed to the archived execution. The older archived load test failed its functional gate. Lighthouse runs had qualifications. Clean before/after performance measurements are pending; this deck claims no measured speedup or production capacity.

The notes distinguish current techniques from future improvements: there is no transactional outbox, cache invalidation needs fuller coverage, socket-room subscription authorization needs hardening, and the backend services share a database. The architecture diagram represents configured Redis usage without asserting every Identity endpoint is cached.

## Timing

Each slide contains a target speaking time and a short explanation. `pnpm check` validates the slide count and that total speaking time is within 12–15 minutes. Use the notes as prompts rather than reading them verbatim; source references and evaluation questions are optional preparation material.

## Validation

See `output/validation.md` for the final build, export, and visual verification results.

To repeat the browser checks, start `pnpm preview` after a build, then run `node scripts/verify-rendering.mjs` in another terminal. It checks all 16 slides, keyboard navigation, presenter notes, font loading, diagram presence, overflow, and local-only assets. Inspection images and a JSON report are written to `output/qa/`.
