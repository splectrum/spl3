# Context

## What Is This

Splectrum is a living meaning system where entities collaborate
to create. Three pillars: Mycelium (repository), Splectrum
(expression), HAICC (creation). See PRINCIPLES.md.

**Mission:** spl3 is the Mycelium boot process. Its mission is to reach a state where defining meaning (requirements, quality gates), created meaning (content), and capabilities (implementations) can be disentangled into separate, independent units. On completion, spl3 triggers repo diversification — like cell diversification — with each new repository carrying its own Mycelium envelope: self-describing, self-contained, composable across boundaries.

## Vocabulary

- **Entity** — Any participant: human, AI, process, sensor, capability
- **Record** — Key → content (opaque bytes). The primitive
- **Context** — Container of records. Records can be contexts. Recursive
- **Mycelium** — Meaningless persistence layer. Stores, does not interpret
- **Splectrum** — Expression layer. Meaning, references, quality gates
- **HAICC** — Creation layer. Entity collaboration, autonomy, evaluation
- **TDC** — Test-Driven Creation. Intent → requirements → build → verify

## Current State

Where we are:
Change tracking of mutable resources via immutable logs.
Content as opaque bytes with encoding field. Requirements
before code going forward. Next step (05): split the
Mycelium API into logical and physical layers, with
folder-based and file-based as the first two physical
implementations.

Current project: **05_context_fix**
An improved version of the context-view tool (from 03). The
`context-view sync` command now generates a CONTEXT.md that
works as a cold-start orientation document. Additions over 03:
introduction from CLAUDE.md, vocabulary glossary, current
conceptual state (carry-forward), reading order, magnifying
glass on current project (requirements surfaced inline),
compact timeline entries with cascading references to detail.

See `projects/05_context_fix/` for source and requirements.

Documents:
- CLAUDE.md — # CLAUDE.md - Splectrum (spl3)
- CONTEXT.md — # Context
- ORIGINS.md — # Origins
- POSITIONING.md — # 15 - Positioning Refined: Mycelium vs Log-Centric Systems
- PRINCIPLES.md — # 14 - Principles (Complete, Three Pillars)

## Reading Order

1. This file — orientation and current state
2. PRINCIPLES.md — three-pillar conceptual model
3. CLAUDE.md — working norms and build cycle
4. EVALUATION.md files in projects/ — intellectual history

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
<!-- ENTRY:04_changelog:START -->
### 04_changelog

Files: .gitignore, EVALUATION.md, REQUIREMENTS.md, package-lock.json, package.json, src/cli.ts, src/store.ts, tsconfig.json

Learnings:
- Content is opaque bytes in practice
- A timestamped changelog replaces a daily log
- Mutable resources gain immutable history
- The changelog is not yet a true Mycelium artefact
- Requirements should be written before building
- A changelog file is a list incarnation
- Two physical substrates now exist — time to split

Change tracking of mutable resources via immutable logs.
Content as opaque bytes with encoding field. Requirements
before code going forward. Next step (05): split the
Mycelium API into logical and physical layers, with
folder-based and file-based as the first two physical
implementations.
<!-- ENTRY:04_changelog:END -->

<!-- TIMELINE:END -->
