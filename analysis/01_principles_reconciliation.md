# Principles Reconciliation

PRINCIPLES.md was written during spl2, before any code existed.
spl3 produced 9 projects over which the model evolved
significantly. This document reconciles what the principles
claim with what the work actually proved, changed, or
contradicted.

## Pillar 1: Mycelium

### The Primitive — Rewritten

**Principles say:** "The sole building block. All data enters
as records appended to immutable lists. Once written, records
don't change. Everything else is derived from this single
primitive." (3.1)

**spl3 proved:** The primitive is record (key → content) inside
context (container of records). Records can be contexts. Five
operations (list, read, flatten, create, delete) extended to
seven (add write, move). Content is opaque bytes. Lists are
not the organizing unit — contexts are. And records are not
inherently immutable — mutability is state driven by metadata,
not type.

**Verdict:** The primitive evolved substantially. The shift
from "immutable lists" to "record/context with metadata-driven
mutability" is not a refinement — it's a different model. The
principles describe a log-centric system. What was built is a
context-centric system. These are architecturally distinct.

The immutable list concept didn't disappear — changelogs are
immutable append-only records, and project history is an
immutable sequence. But immutability is no longer the
foundation. It's a behavior that emerges from metadata on
contexts that happen to be configured as immutable.

### Cascading References — Unbuilt

**Principles say:** "Records reference records in other lists.
References cascade, forming a connected web. This is the
mycelium network." (3.2)

**spl3 built:** Keys within contexts. Context traversal walks
paths and accumulates metadata. But references between records
across contexts are not a first-class concept. They exist only
implicitly — as strings inside content that a human or tool
interprets. No reference resolution, no reference graph, no
cascading.

The context-view tool uses "cascading references" as a
documentation pattern (compact summary + link to detail), but
this is markdown convention, not Mycelium structure.

**Verdict:** Unproven. The "mycelium network" described in the
principles does not exist in any code. References remain
implicit content, not structural primitives.

### Derived Mutable Structure — Partially Redefined

**Principles say:** "Mutable state is never primary; always a
projection of immutable data." (3.3)

**spl3 built:** Three changelog modes — none (pure mutable),
resource-first (resource is truth, log is audit), log-first
(log is truth, resource is derived). Only log-first matches
the principle. Resource-first inverts it. Mode "none" ignores
it entirely.

**Verdict:** The principle was too absolute. spl3 discovered
that both causality directions exist and both are valid. The
principle should be: "Immutable history and mutable state
coexist. Which is primary depends on the context's changelog
mode — a data choice, not an architectural mandate."

### Views — Unbuilt

**Principles say:** "The repository is accessed through views.
Views can implement any repository pattern: relational,
document, graph, key-value, streaming." (3.4)

**spl3 built:** Direct API access. No view layer. No view
abstraction. The flat API gives raw access to records in
contexts — there is no intermediate layer that projects data
into different access patterns.

The context-view tool and CONTEXT.md could be called a "view"
in the loosest sense, but they are standalone tools that read
files, not a view layer on the API.

**Verdict:** Unproven. Views were the claimed differentiator
in the positioning ("polymorphic views from immutable
foundation"). No code exists for this.

### Behavioral Principles — Mixed

| Principle | Status |
|---|---|
| 4.1 Panta Rhei (stateless, flowing) | Proven in 09 (data-triggered stateless steps) |
| 4.2 Immutability with evolution | Proven (project sequence, changelogs) |
| 4.3 Indexes are views, not data | Stated but unbuilt (no indexes, no views) |
| 4.4 Self-describing navigation | Partially proven (CONTEXT.md, TOOL.md, config.md) |
| 4.5 Location-transparent references | Unbuilt (all keys are path-bound) |
| 4.6 Content-addressed integrity | Dropped in 01 (hash is derived, removed from primitive) |
| 4.7 Schema evolution | Unbuilt (no schema system exists) |
| 4.8 Compaction preserves capability | Unbuilt (concept discussed, never implemented) |
| 4.9 Friction as signal | Practiced (implicit in build cycle) |

Five of nine behavioral principles are unbuilt or dropped.

## Pillar 2: Splectrum

### TDC — Partially Practiced

**Principles say:** Intent → gates → build → verify →
crystallize. (5.4)

**spl3 did:** From project 04 onward, requirements were
written before code. The evaluator (09) translates
requirements into prompts and evaluates code against them.
The cycle works but is manual (CLI invocations) and
disconnected from the API.

"Crystallize" (5.6: solved problems become capabilities) did
not happen in any formal sense. Tools exist but are not
registered, discoverable, or composable capabilities — they're
TypeScript projects in folders.

**Verdict:** The first two phases (intent → gates → build →
verify) are proven. Crystallization is not.

### Quality Gates — Proven with Caveats

Requirements-as-quality-gates works. AI evaluating AI output
catches real discrepancies. But the evaluation is LLM-based
natural language assessment, which means:

- Results are non-deterministic
- There is no formal verification
- The quality signal is directional, not absolute
- Self-evaluation succeeded but was not independently validated

The evaluator is a genuine Splectrum tool. Whether it
constitutes "quality gates derived from meaning" (5.3) in a
rigorous sense is debatable — it's closer to "AI opinion
derived from requirements."

### API Crystallization — Not Achieved

**Principles say:** "Solved problems become capabilities" with
"attached meaning: what, why, when, success criteria." (5.6)

**spl3 built:** Two tools (context-view, evaluator) and an API
(context layer from 08). None are discoverable, composable,
or self-describing in the way the principles envision.
TOOL.md and config.md were added late as self-containment
assets — steps toward crystallization but not the thing itself.

## Pillar 3: HAICC

### Entity-Neutral — Demonstrated

AI decided what to build. AI built it. AI evaluated it. Human
steered and validated. The build cycle worked as described.
This is the strongest pillar — not because the principle is
ambitious but because it was straightforwardly practiced.

### Maximum Autonomy — Demonstrated with a Blind Spot

AI operated with high autonomy throughout. But the
evaluations were written by the same AI that built the code,
in the same session. The evaluation cycle has no structural
independence — it's the builder assessing its own work.
Project 09's self-evaluation caught a real discrepancy
(requirements described old design), which is genuine. But
the overall pattern of optimistic framing across all
evaluations suggests the AI perspective was not sufficiently
challenged.

### Dynamic Boundary — Observed

The boundary between autonomous work and human involvement
did shift. Early projects had more human steering; later
projects were more AI-driven. The principle describes this
correctly. But whether this shift was beneficial or whether
it reduced critical challenge is an open question.

## Summary

### What spl3 proved that the principles got right

- Entity-neutral collaboration works
- Maximum beneficial autonomy is practical
- Immutability with evolution is correct (append, don't rewrite)
- Stateless data-triggered processing works
- Natural language requirements function as quality gates
- The primitive is sufficient (no new primitives across 9 projects)

### What spl3 changed from the principles

- Primitive is record/context, not immutable lists
- Mutability is metadata-driven state, not derived from immutable data
- Changelog causality is bidirectional (log-first AND resource-first)
- Content-addressed integrity was dropped from the primitive
- Three layers (logical, capability, physical) replaced the two-layer model

### What the principles claim that spl3 never built

- Cascading references as structural primitive
- Polymorphic views
- Location-transparent references
- Schema evolution
- Compaction
- API crystallization (capabilities with attached meaning)
- Any form of P2P or federation

### What spl3 discovered that the principles don't mention

- Flat API with metadata-driven behavior
- Context traversal with nearest distance
- Transient process contexts with lifecycle
- Data-triggered processing (presence/absence drives progression)
- Resolution spectrum (prose → file → records)
- Mycelium as data interaction model (not just storage)
- Namespaced metadata
- Self-containment assets as emergent schema

## Recommendation

PRINCIPLES.md needs rewriting, not updating. The document
describes a log-centric, immutable-first system with
polymorphic views and cascading references. spl3 built a
context-centric, metadata-driven system with a flat API and
data-triggered processing. These overlap but are not the same
architecture.

The three-pillar structure (Mycelium, Splectrum, HAICC) holds.
HAICC is essentially proven as stated. Splectrum is partially
proven (TDC minus crystallization). Mycelium's principles need
the most significant revision — the core structure section
(3.1–3.4) describes a system that was never built.
