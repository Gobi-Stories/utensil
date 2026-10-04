# Audit Checklist Addendum

Rules that apply only to components in this repository. A Utensil component is audited against
`packages/vue/docs/audit-checklist.md` and these. Both lists share one numbering: a new rule, in either, takes the next
free number.

| #   | Pattern                                                                                                                   | Type | Domain        |
| --- | ------------------------------------------------------------------------------------------------------------------------- | ---- | ------------- |
| 8   | Reference examples added in `apps/reference/src/features`                                                                 | Rule | Documentation |
| 32  | File located at `packages/vue/src/components/<feature>/Utensil<Name>.vue`                                                 | Rule | Structure     |
| 52  | Reference examples (in `apps/reference/src/features`) use Reference-typed components (`ReferenceIcon`, not `UtensilIcon`) | Rule | Documentation |
| 53  | Reference examples never use browser native `alert` or `confirm`                                                          | Rule | Documentation |
| 65  | Utensil modules imported relatively inside `packages/vue/src` (never through `utensil-vue/...`)                           | Rule | Structure     |
