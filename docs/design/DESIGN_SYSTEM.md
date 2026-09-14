# Portfolio design system

Read alongside DESIGN_PRINCIPLES.md. This document owns the portfolio's current component and presentation contracts.

## Tokens and sources

`src/app/globals.css` owns semantic tokens. Manrope variable 200–800 is bundled locally through `next/font/local`; Arial/Helvetica/sans-serif fallback. Main body 17px/1.75 desktop, 16px/1.75 at <=768px. Supporting roles/actions 15px. Caption 14px/1.65. Body/secondary weights 400, headings/actions 600, identity 700. No new font or dependency.

Colors: paper `#f7f7f0`, ink `#202923`, muted `#505d53`, green `#234f40`, line `#d7dbd1`, soft `#e9ede3`; keyboard outline `#327655`. Shell maximum 1120px; gutters 40px desktop and 20px <=768px. These are portfolio choices, not portable principles.

Work tokens: `--work-title-size` 28px desktop/26px <=768px, `--work-title-leading` 1.25, `--work-title-tracking` -.035em; Manrope/600 for all four project titles AND their company names. Titles are ink; companies are green. `--work-company-size` 20px now applies to Experience only, not WorkRow. `--work-metric-size` 32px desktop/30px mobile; values use 600/green and -.025em tracking. Shared `--work-row-gap` 16px, `--work-column-gap` 40px (28px <=1100px), row padding 32px (28px mobile). Secondary outcome sentences use supporting text size, not a second display metric.

## Brand and actions — D02/D03/D05

`BrandMark` is lowercase upright `ps`, no period, in a 36px circle; line-height 1, central alignment and descender clearance, 10px identity gap. Favicon shares circle/lowercase treatment. Identity alone suppresses hover underline; focus remains visible. No glyph rotation or breakpoint nudges.

Filled `.button` primary and `.button-secondary` outlined anchor share 48px minimum height, 15px/600 type, 8px icon gap and 16px decorative arrows. Header/hero résumé uses the same secondary variant; mobile menu retains it. Contact résumé/social and project-story links are text actions (44px targets). Header has no duplicate vertical separator. External résumé URL exists once in profile configuration; new-tab information and noopener/noreferrer are mandatory.

## WorkRow — D01/D02/D03/D04/D07

One WorkRow for every employer. Desktop: company/role, title/summary, outcomes/action; column widths 190px / flexible / 280px. Context and narrative use the same two grid rows via subgrid: first-baseline alignment for company/title; role and summary share the next content start. The second track absorbs remaining space from a taller outcomes block, never an arbitrary fixed heading height. Outcome area spans tracks and aligns at the top. Wrapped titles expand the first track for both text columns. No extra Uber title/summary/value scale; order and actual evidence provide prominence.

At <=900px, rows stack in logical DOM order before columns crowd. No ellipses, fixed heights, empty spacer elements or row-specific nudges. One shared horizontal rule and stable padding separate projects. Actions remain within each row, following their associated evidence—not forced to a global bottom coordinate. Full corrected roles come from one `roles` record. Native first-line baseline probes and role/summary track measurements must differ by <=1 CSS px on desktop, including wrapped titles and long roles; container tops alone are insufficient.

`WorkOutcome` accepts only `value`, `label`, `supportingPoint`, `action`. It renders one prominent value, one attached label, exactly one normal hanging bullet and the overview link. Shared tokens: `--outcome-label-gap` 6px, `--outcome-support-gap` 14px, `--outcome-action-gap` 18px. Labels and bullets are 15px/1.65; actions retain 44px targets. `homepageOutcome` in project content supplies a supporting point and optional homepage label; the value comes from the canonical primary outcome. No catch-all notes or duplicate scope paragraphs on the homepage. `ProjectOutcomes` remains the detail renderer with optional context; real geographic/measurement scope stays there. The detail grid auto-fits its actual item count.

## Independent work and media — D04/D06/D08/D09

Sequence: name, purpose, source image, one compact format/credit/context block, primary story action, secondary external actions. Above 800px, the two articles share six content-sized rows via CSS subgrid, including the nested identity and action groups. Both outer media frames are equal-width 16:9, with contained, proportion-preserving source pixels and restrained neutral padding. Title/description starts, frame tops/bottoms, metadata starts and both action starts must match within 1 CSS px. No fixed article heights or filler. At <=800px each article becomes its own normal vertical flow; cross-column spacing disappears and images retain native proportions.

The static supplied Practice snapshot remains the primary visual, not a replacement prose panel. It is a document overview at thumbnail size, not a claim that all text is readable there; click/keyboard opens the complete safe image, with actual-size panning. No new animation or generated content. Narrow detail User scope text remains an explicitly labeled excerpt for accessible inline reading, not a complete screenshot.

`ProjectFigure` preserves asset dimensions, alt text, captions, order/provenance and optional preview variants. Only reviewed files under public/projects; private originals remain excluded. Compact format/attribution lives with the project; detailed provenance remains in the detail figure/viewer. Never mislabel an image crop or attach unrelated delivery/servicing/onboarding imagery.

The image itself is a semantic button with an accessible open-image name, visible keyboard outline and zoom-in cursor. No plus control, replacement enlargement icon, separate Enlarge link or nested controls. The native dialog has a sticky top-left Back to portfolio/project button, Fit/Actual size and keyboard-pannable region. Fit contains the full image within available width and 65dvh; actual size preserves native pixels and permits panning. Back/Escape closes locally, restores original scroll/focus and never calls history.back(). No-JavaScript fallback opens the asset via an anchor. Print keeps images/captions but removes interactive controls. Compact prototype/design-exploration labels remain visible even without a custom format sentence.

## Content and experience — D06/D07

`profile.ts`, `projects.ts`, `builds.ts` are active public sources. Dollar amounts use `$` consistently; preserve approximate marks only where supplied. Do not add a public currency notice. Owner corrections dated 14 September 2026 supersede specified CV-derived values/roles; no calculated FX conversion or independent validation is implied. Private notes retain superseded values and possible résumé mismatches. Do not infer chronology or measurement definitions.

Experience and About use the same `.shell.section-grid`: 1120px maximum shell, 40px side gutters (20px <=768px), columns `minmax(0,1fr) minmax(0,1.6fr)`, 64px gap and top alignment. Content starts/right edges and heading starts must match within 1 CSS px. Both collapse to one column at <=768px with a 24px gap. No Experience-specific column override or equal section height. Experience retains corrected full roles and one broader-context sentence per company; About copy is unchanged. Contact/footer retain their existing anchors. Public material limits and framework credit remain; no decision stories are invented.

## Acceptance and exceptions — D10

Check all current routes at 1440×900/390×844 and homepage 375/768/1024. Inspect default, hover, focus and selection separately. Use computed style tuples for equivalent roles and browser baseline probes (not box-top claims) for WorkRow. Test wrapped/long content, image opening/back/Escape/focus/scroll, reduced motion, résumé, noindex, unknown routes and print controls. Record actual loaded fonts using browser platform-font evidence when available. Label simulated reflow separately from native zoom. Run existing checks; screenshots must be opened, not merely saved.

No new architectural framework or optional theme is justified. Future exceptions require a documented user/task reason and fresh rendered evidence. Review-only sessions do not implement exceptions or alter application code. Builder evidence does not resolve an independent review's statuses.
