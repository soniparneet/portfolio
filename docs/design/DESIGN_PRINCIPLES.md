# Portable design principles

These are transferable defaults, not a prescribed brand, layout or permission to change scope. Document a justified exception with its reason, affected component and review evidence in the local design system.

## D01 — Hierarchy follows the user's task

Prioritise identity, relevant work, evidence and clear next actions. Give every section a purpose. Remove repetition before adding decoration. Sparse is not automatically sophisticated.

## D02 — Equivalent roles share a visual rule

Equivalent titles, roles, summaries, metrics, captions and actions use shared semantic tokens/components. Different roles may differ. Exceptions need a real hierarchy reason, not one-off CSS. Verify loaded fonts and weights.

## D03 — Align relationships, not just boxes

Choose the appropriate anchor: text baseline, shared content start or optical centring. Matching box tops is insufficient for differently sized text. Fix grids/components, not individual margins or transforms.

## D04 — Separation starts with grouping and space

Use proximity, stable anchors and consistent gutters before borders. Dividers must clarify structure. Avoid unnecessary boxes, equal-height whitespace and arbitrary fixed heights. Reflow preserves reading order.

## D05 — Actions are recognisable and reversible

Use intentional primary, secondary and text-action variants. Navigation is an anchor; state changes use buttons. Keep icons subordinate, actions near their subject, focus visible and exits predictable. Never nest interactive elements.

## D06 — Write as a person explaining real work

Use concrete language, direct sentences and consistent terminology. Remove slogans, jargon, duplication and reviewer narration. Consolidate meaningful limitations and attribution rather than scattering them across disconnected lines.

## D07 — Preserve the meaning of facts

Keep value, unit, timeframe, scope and attribution together. Explicit owner corrections supersede older copy but are not independently verified results. Update active surfaces consistently. Never invent baselines, conversion rates, causal claims or decision stories. Preserve historical sources/reports.

## D08 — Media must explain, not decorate

Use relevant, readable, faithful visuals. Preserve originals, protect sensitive content and label provenance honestly. Do not manufacture screens or rewrite source material for appearance. Motion requires a purpose, controls and a useful static alternative.

## D09 — Accessibility and responsiveness are part of the design

Support semantic interaction, readable contrast, keyboard focus, reflow, reduced motion and accessible modal exits. Never remove accessibility to simplify visible controls. Distinguish real zoom checks from simulations.

## D10 — Judge the rendered result

Inspect current-source desktop/mobile pages at native scale. Use screenshots and measurements, not test scores alone. Separate measured defects from preferences. Builders implement and self-check; independent reviewers verify without editing the application.
