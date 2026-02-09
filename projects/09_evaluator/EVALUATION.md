# 09_evaluator — Evaluation

## What Was Built

The first Splectrum-layer tool. A data-triggered pipeline
that takes natural language requirements, translates them
into evaluation prompts, and assembles results into a
report. Four stateless steps (prepare, translate, evaluate,
report) driven by data state — presence/absence of files
in a transient context (.eval/) determines what happens
next.

The tool evaluated itself against its own requirements.
All six gates passed.

## What We Learned

### 1. Mycelium is a data interaction model

Not a storage system. Storage was the first physical
binding. But record/context/operations can model any
data flow — persisted files, LLM interactions, API calls,
entity communication. The evaluator proved this: the
Claude CLI call is a capability-encapsulated interaction,
invisible above the capability boundary. From the logical
layer's perspective, it's all records.

### 2. Data-triggered processing

Data state replaces session state. Each step reads inputs
from files, writes outputs to files. Progression is
determined by what exists, not by what's in memory. Kill
and restart at any point — the data state is the
checkpoint. Delete a file to re-run its step. This is
build-system logic applied to meaning operations.

### 3. Transient process contexts

Short-lived data contexts linked via reference to the
main context. They have a lifecycle: spawn, process
(data-driven), compact (extract final result), detach
(archive or discard). The main historical state only
accumulates compacted results. The working mess stays
separate.

### 4. The explicit/implicit boundary

Everything is always linked in. We choose how far to
unpack into Mycelium-structured data. Resolution
spectrum: natural language (most encapsulated) →
structured file (partially explicit) → individual
records in contexts/tables (fully explicit). The
evaluator itself is an unpacking operator —
transforming implicit meaning in prose into explicit
structured gate results.

### 5. Tailored data environments

The transient context isn't a generic structure. It's
shaped to match processing needs — a mutable data
structure expression on top of immutable data, optimised
for a specific context. Not one way for all. Each
process creates the data environment it needs.
Artifacts loaded once, lightweight prompts per
requirement, per-requirement results — this shape exists
because the evaluation process needs it. A different
process would create a different shape from the same
underlying data.

### 6. Horizontal slicing with checkpoints

One evaluation per requirement, one output file each.
Each slice is independently restartable. Transient files
have diagnostic value — when something goes wrong, the
raw output for that specific requirement is there.
Consecutive execution avoids bottlenecks.

### 7. Prompts are data

The translated prompts are records in the transient
context — inspectable, storable, portable. They're
both the executor's input and a standalone artifact.
Separating prompts from artifacts (load once, reference
at execution) avoids duplication while keeping each
prompt self-describing.

### 8. The evaluator works

Self-evaluation found real discrepancies — the
requirements described the old self-contained prompt
design while the code implemented the new data-triggered
architecture. Requirements were updated, re-evaluation
passed. The tool catches requirement-vs-implementation
mismatches, which is its purpose.

## Changes Outside This Project

None.

## Carry Forward

The evaluation pipeline is the first Splectrum tool.
The patterns it established — data-triggered processing,
transient contexts, explicit/implicit boundaries,
tailored data environments — are general. They apply to
any multi-step process where meaning operates on data
state.

Next directions:
- Unpacking further: requirements and results as records
  in Mycelium contexts (tables), not just files
- Stored metadata: transient context definitions persisted
  as records, not just supplied at invocation
- Additional capability bindings: API, local model,
  structured human review alongside the claude CLI
- The compaction step: transient context → final result
  absorbed into project, working state archived/discarded
