# Capability Inventory

What exists as working code, what is conceptual, and what is
claimed but absent. Honest status for each.

## Working Code

### Mycelium API (projects 06–08)

**Location:** `projects/08_context/src/`

| Component | Files | What It Does |
|---|---|---|
| types.ts | Logical types | Record, Context, operations — zero imports |
| folder.ts | Folder capability | Directories as contexts, files as records |
| file.ts | File capability | Single JSON file with base64 content |
| context.ts | Context layer | Flat API wrapping storage with metadata enforcement |
| traverse.ts | Traversal | Walk path, accumulate metadata, nearest distance |
| changelog.ts | Changelog | Sibling record tracking with three modes |
| cli.ts | CLI | Command-line interface to all operations |

**Status:** Complete and tested within its project scope.
Handles create, read, write, delete, list, flatten, move.
Two interchangeable storage capabilities (folder, file) with
byte-level round-trip verified. Context traversal with
transient metadata. Changelog with three modes.

**Not consumed by anything.** No tool, script, or process
outside project 08 imports or calls this API.

### Context-View Tool (projects 03/05)

**Location:** `projects/05_context_fix/src/` (latest version)

| Component | What It Does |
|---|---|
| scan.ts | Scans repo directory structure |
| render.ts | Renders timeline entries and state sections |
| markdown.ts | Markdown utilities |
| persist.ts | Reads/writes CONTEXT.md |
| cli.ts | CLI: `show` (stdout) and `sync` (write file) |

**Status:** Working. Generates CONTEXT.md at repo root.
Maintains immutable timeline of completed projects with
mutable state section. Self-contained with TOOL.md, config.md,
CONTEXT.md.

**Uses raw filesystem.** Does not call the Mycelium API.
Reads directories and files directly.

### Evaluator Tool (project 09)

**Location:** `projects/09_evaluator/src/`

| Component | What It Does |
|---|---|
| parser.ts | Parses REQUIREMENTS.md into individual requirements |
| pipeline.ts | Four-step data-triggered pipeline |
| execute.ts | Executes evaluation prompts via Claude CLI |
| types.ts | Pipeline types |
| cli.ts | CLI: `evaluate` command |

**Status:** Working. Translates natural language requirements
into evaluation prompts, runs them against project artifacts,
assembles results into reports. Self-evaluated successfully.
Retroactively evaluated projects 03–08.

**Uses raw filesystem.** Does not call the Mycelium API.
Reads and writes files directly in a `.eval/` transient
context.

### Earlier Iterations (projects 01–04)

These are superseded by later projects:

| Project | What It Built | Superseded By |
|---|---|---|
| 01_mycelium | CLI with hash-based immutable lists | 02 |
| 02_mycelium | CLI with filesystem-as-context | 06/08 |
| 03_context_view | First context-view tool | 05 |
| 04_changelog | Standalone changelog CLI | 07/08 |

The code in these projects is historical. The learnings
carried forward; the implementations did not.

## Proven Patterns (Not Reusable Code)

These patterns were demonstrated in working code but are
embedded in specific projects, not extracted as reusable
components:

| Pattern | Where Demonstrated | Reusable? |
|---|---|---|
| Data-triggered processing | 09 evaluator | No — hardcoded pipeline |
| Transient process context | 09 .eval/ directory | No — convention, not mechanism |
| Self-containment assets | 03/09 TOOL.md, config.md | No — manually created files |
| Horizontal slicing | 09 per-requirement evaluation | No — evaluator-specific |
| Prompts as data | 09 translated prompts | No — evaluator-specific |
| Cascading references | 05 compact timeline entries | No — markdown convention |
| Magnifying glass | 05 expanded current project | No — context-view specific |

## Conceptual (Described, Never Implemented)

| Concept | Where Described | What's Missing |
|---|---|---|
| Stored metadata | 08 evaluation | No persistence mechanism for context definitions |
| Schema system | Evaluation (root), insights | No validation, no schema language, no enforcement |
| Compaction | PRINCIPLES.md, 09 lifecycle | No compaction operator or algorithm |
| Multi-repo envelope | Mission statement | No envelope definition, no cross-repo protocol |
| Namespaced metadata | Insights, 09 evaluation | No namespace mechanism |
| Merge mode (external vs stored) | 08 evaluation | No precedence rules |
| Issue resolution protocol | Insights roadmap | No protocol, no process |
| Result enrichment / audit | Insights roadmap | No metadata enrichment on outputs |
| Bin pattern | 06/07 evaluation | Described but not in 08's context layer |

## Claimed but Absent

These appear in PRINCIPLES.md and/or POSITIONING.md as
defining characteristics of Mycelium but have no code,
no prototype, and no concrete design:

| Claim | Source | Reality |
|---|---|---|
| Polymorphic views | PRINCIPLES 3.4, POSITIONING | No view layer at all |
| Cascading references | PRINCIPLES 3.2 | No reference resolution |
| Location-transparent references | PRINCIPLES 4.5 | All keys are path-bound |
| Content-addressed integrity | PRINCIPLES 4.6 | Dropped from primitive in 01 |
| P2P distribution | POSITIONING | Not approached |
| Semantic navigation | POSITIONING | No semantic layer |
| Capability-preserving compaction | POSITIONING | No compaction |
| Agent-neutral interface | POSITIONING | No interface designed for this |

## Connection Map

```
Tools                        API
─────                        ───
context-view (05) ──→ raw filesystem
evaluator (09) ──────→ raw filesystem
                             │
                        (no connection)
                             │
                        context layer (08)
                             │
                        storage capability
                             │
                    ┌────────┴────────┐
                    │                 │
               folder (06)       file (06)
```

The tools and the API were developed independently and
never connected. Both work. Neither uses the other.

## Assessment

**What's real:** A clean three-layer API with two storage
capabilities and a context layer that does traversal,
metadata enforcement, and changelog management. Two
operational tools that generate real value (cold-start
orientation and requirements evaluation).

**What's disconnected:** The API and the tools. They
share concepts but not code. The tools prove Splectrum
patterns (data-triggered processing, natural language
evaluation). The API proves Mycelium patterns (logical/
physical split, context traversal). They could work
together but don't.

**What's missing:** Everything above the context layer.
No views, no references, no schemas, no compaction, no
multi-repo. The model has a strong foundation and an
empty upper story.

**What's overclaimed:** The positioning document describes
a system that would bridge two industry camps (immutable-
log-first and multi-model databases) with P2P, semantic
navigation, and compaction. None of this was built. The
gap between the positioning and the implementation is the
largest risk — it creates expectations that the codebase
cannot support.
