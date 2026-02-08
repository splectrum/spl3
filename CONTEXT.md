# Context

## State

Documents:
- CLAUDE.md — # CLAUDE.md - Splectrum (spl3)
- CONTEXT.md — # Context
- ORIGINS.md — # Origins
- POSITIONING.md — # 15 - Positioning Refined: Mycelium vs Log-Centric Systems
- PRINCIPLES.md — # 14 - Principles (Complete, Three Pillars)

In progress:
- 04_changelog (8 files)

## Timeline

<!-- TIMELINE:START -->



<!-- ENTRY:01_mycelium:START -->
### 01_mycelium

Files: .gitignore, EVALUATION.md, package-lock.json, package.json, src/cli.ts, src/store.ts, src/types.ts, tsconfig.json

Learnings:
- References are meaning, not substrate
- Content is opaque
- Hash is derived, not stored
- A record is a key-value pair
- Lists are contingent, not absolute
- Keys are context-bound
- Projects are immutable records
- Logical vs physical are separable but not prematurely
- The filesystem already is the structure
- Meaning is inescapable when navigating
- The wrapper is a context

A **record** is: key → content (opaque bytes).
A **context** contains records. Records can themselves be
contexts. References are relative to the containing context.
Everything else — time, hashing, typing, meaning,
interpretation — is layered above.

External changes:
- **CLAUDE.md** — Added "The Build Cycle" section: AI decides
- **projects/** — Created as top-level context for all builds.
- **GitHub** — Created repo under splectrum org (splectrum/spl3),
<!-- ENTRY:01_mycelium:END -->
<!-- ENTRY:02_mycelium:START -->
### 02_mycelium

Files: .gitignore, EVALUATION.md, package-lock.json, package.json, src/cli.ts, src/fs.ts, src/types.ts, tsconfig.json

Learnings:
- The primitive is sufficient
- Key is logical, path is physical
- Logical layer is less data-rich than physical
- Compound operations emerge from primitives
- The interface is buildable-on

The logical model: contexts contain keyed records, records
can be contexts. Five operations. Hardcoded on filesystem.
Ready for the next layer.
<!-- ENTRY:02_mycelium:END -->
<!-- ENTRY:03_context_view:START -->
### 03_context_view

Files: .gitignore, EVALUATION.md, REQUIREMENTS.md, package-lock.json, package.json, src/cli.ts, src/markdown.ts, src/persist.ts, src/render.ts, src/scan.ts, tsconfig.json

Learnings:
- AI can evaluate AI output
- Requirements and quality gates are different views of the same meaning
- Requirements are the document, gates are derived
- Immutable and mutable coexist in one artifact
- Projects should document their requirements
- Immutability is retrospective, not declared
- The project timeline is itself a change log

First Splectrum view built. Established patterns: immutable
timeline with mutable state, requirements as natural language
quality gates, entity-neutral evaluation. CONTEXT.md is
the repo's self-describing summary — cold start tool for
any entity entering the project.

External changes:
- **CONTEXT.md** — Created at repo root by the sync command.
<!-- ENTRY:03_context_view:END -->

<!-- TIMELINE:END -->
