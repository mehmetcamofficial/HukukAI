# AI Memory

HukukAI improves through explicit, lawyer-specific retrieval memory rather than uncontrolled foundation-model retraining.

Approved drafts, lawyer edits, case notes, closed-case outcomes, source metadata, and feedback can become chunks in named collections:

- `case_documents`
- `approved_drafts`
- `precedents`
- `legislation`
- `lawyer_notes`
- `closed_cases`

Each chunk should carry organization, user, case, document, source type, date, tags, and verification metadata. Retrieval should prefer the current case and approved lawyer material, show why a result is similar, and preserve the original source status.

Outcomes are historical examples only. The system must not claim that an argument caused a result. All generated analysis and drafts remain editable and require human approval.