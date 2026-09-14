# Parneet Soni - Product & Strategy

[View the portfolio](https://parneet-soni-portfolio.vercel.app/)

Personal portfolio presenting product leadership across AI, fintech, edtech, and marketplaces. Four employer project overviews and two independent case studies connect product scope, contribution, and outcomes. Employer interfaces and functional reconstructed prototypes are not included.

## Local setup

Use Node.js 24 LTS and npm. The app uses Next.js App Router, TypeScript, React, Tailwind CSS, and a locally bundled Manrope font.

```sh
npm ci
npm run dev
```

Open http://127.0.0.1:3000. No database, API credentials, or external services are required to run the portfolio.

```sh
npm run lint
npm run typecheck
npm run test:content
npm run build
npm test
npm run start
```

Browser tests use an installed Google Chrome. They start a production-mode local server on port 3000, or reuse one already running. Use `PORT=3001 npm test` to check an isolated checkout without touching a preview on port 3000. Test only a current build; do not rebuild into a directory that an active production server is serving. The default test suite expects a non-indexable review build with publication variables unset.

## Content and images

- `src/content/profile.ts`: identity, roles, experience, About, contact, and the single external résumé URL. The résumé opens its approved viewer in a new tab; the source document is not hosted here.
- `src/content/projects.ts`: employer overviews and the shared typed project/image model.
- `src/content/builds.ts`: independent case studies, source/live/example links, and media.
- `src/components/project.tsx`: shared rows, project pages, outcomes, and actions.
- `src/components/project-figure.tsx`: proportional images and accessible enlargement.

Add reviewed images only under `public/projects/<slug>/`. Supply a stable ID, local path, intrinsic width/height, alt text, caption, order, and truthful provenance in the content record. An optional preview can have its own path and dimensions. Set `cover`, add/reorder/remove `gallery` entries, or attach `images` to a narrative section without changing routes or templates. Empty galleries are omitted. Repository, live-product, example, and future prototype URLs are independent fields; planned prototypes remain hidden.

Read [design principles](docs/design/DESIGN_PRINCIPLES.md) and [component contracts](docs/design/DESIGN_SYSTEM.md) before UI or public-copy changes. Preserve metric units, timeframes, attribution, and owner-approved wording. Company-specific dates and unsupported decision stories must not be inferred.

## Publication and deployment

Review builds default to `noindex`. In the dedicated Vercel project's **Production environment only**, configure:

- `PUBLICATION_APPROVED=true`
- `PRODUCTION_ORIGIN=https://parneet-soni-portfolio.vercel.app`

Leave these variables unset in Preview and Development. Preview builds also enforce non-indexing when `VERCEL_ENV=preview`. Canonical links, social imagery, sitemap, and robots use the explicit production origin. Noindex is not access control.

The external résumé is enabled in profile data and needs no local PDF. Optional local-PDF support requires both an owner-approved `public/resume/parneet-soni-resume.pdf` and `RESUME_APPROVED=true`; never copy a private CV there by default.

The dedicated project is `pss15/parneet-soni-portfolio`. Deployment currently uses the Vercel CLI; automatic GitHub deployments are not connected because the account's Vercel GitHub App is not installed. A Git push alone does not deploy this site.

For future updates, create a branch, run the checks above, commit and push only reviewed files, then create a non-indexable preview:

```sh
npx vercel@59.16.0 link --project parneet-soni-portfolio --scope pss15
npx vercel@59.16.0 deploy --dry --json --scope pss15
npx vercel@59.16.0 deploy --scope pss15
```

Inspect the preview, including desktop/mobile routes and image interactions. Keep preview protection enabled; `vercel curl / --deployment <preview-url>` provides authenticated diagnostic access. Merge approved changes to `main`, ensure the checkout is clean and pushed, and build a fresh production deployment using Production settings:

```sh
npx vercel@59.16.0 deploy --prod --scope pss15
```

Do not promote a review build directly: its build-time metadata is deliberately non-indexable. Verify the stable public URL and exact deployed commit before creating a version tag and GitHub Release. Native branch deployments can be enabled later by granting the Vercel GitHub App access to this repository and running `vercel git connect`; no custom CI service is required.

Do not publish raw images, private source materials, credentials, browser state, or review archives. `.gitignore` and `.vercelignore` are safeguards, not substitutes for inspecting staged files, upload payloads, and reachable history.

To roll back, use the dedicated project's Vercel deployment history to restore a previously verified production deployment, then revert the faulty commit through a reviewed branch so Git and production agree. Do not overwrite release tags. This portfolio needs no purchased domain or paid service integration.

## Rights and attribution

Public source access does not grant a reuse license. No new project-wide license has been selected. Employer names and project materials retain their respective rights; case-study outcomes are owner-provided claims, not independently audited results. The AI interview workflow credits Ben Erez and Lenny’s Newsletter on its case study. Manrope is distributed under the [SIL Open Font License](public/licenses/manrope-OFL.txt); its notice is preserved.
