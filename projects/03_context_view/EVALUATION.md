# 03_context_view — Evaluation

## What Was Built

A CLI tool that produces a context summary of the repo.
Two commands: show (stdout) and sync (persistent CONTEXT.md).
Sync maintains an immutable timeline of completed projects
and regenerates mutable state on each run. Zero runtime
dependencies, TypeScript.

## What We Learned

### 1. AI can evaluate AI output

The bugs in this project (missing learnings from extractSection,
duplicated function) were found by AI evaluating AI output.
Quality gates don't require a human in the loop — they need
a different perspective on the same output. Entity-neutral
evaluation works.

### 2. Requirements and quality gates are different views of the same meaning

Requirements express intent concisely, relying on shared
understanding. Quality gates expand that into explicit,
testable checks. They derive from the same meaning but serve
different purposes. Requirements trust context; gates make
it explicit.

### 3. Requirements are the document, gates are derived

One document captures requirements. Quality gates are a
view — potentially generated, potentially requiring entity
interpretation. The translation from requirement to gate is
a Splectrum operation (meaning → formal verification).

### 4. Immutable and mutable coexist in one artifact

CONTEXT.md has an append-only timeline (immutable project
entries) and a regenerated state section (mutable). This
pattern — immutable history plus derived current state in
the same file — is Mycelium's core model expressed as a
document.

### 5. Projects should document their requirements

Natural language requirements that double as quality gates.
Each requirement states what the tool should do in terms
that allow verification. This is TDC (principle 5.1-5.4)
in practice.

### 6. The project timeline is itself a change log

Each project folder is the full record of that iteration's
impact — including changes made outside the project. The
projects/ folder is an immutable list where the sequence
tells the story.

## Changes Outside This Project

- **CONTEXT.md** — Created at repo root by the sync command.
  Immutable timeline of completed projects plus regenerated
  state section.

## Carry Forward

First Splectrum view built. Established patterns: immutable
timeline with mutable state, requirements as natural language
quality gates, entity-neutral evaluation. CONTEXT.md is
the repo's self-describing summary — cold start tool for
any entity entering the project.
