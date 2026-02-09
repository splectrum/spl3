# Context Package — spl4 Seed Documents

## Purpose

spl4 starts with three seed documents, same structure as
spl3. Each is evolved to reflect what spl3 proved, changed,
and left open. Together they give a new session everything
needed to orient and begin building.

## Document 1: PRINCIPLES.md

### What changes from spl3 version

The spl2 PRINCIPLES.md described an aspirational system.
spl3 proved some parts, evolved others, and left many
unbuilt. The spl4 version should describe what is proven
and what is open — clearly separated.

### Structure

**Three pillars remain.** Mycelium, Splectrum, HAICC. The
structure works. The content within each pillar needs
updating.

**Mycelium — rewrite the core structure section:**

- Primitive is record (key → content) in context (container
  of records). Records can be contexts. Content is opaque
  bytes.
- Three layers: logical (structures, operations), capability
  (binds logical to physical), physical (substrate).
- Flat API: one surface, all operations, metadata determines
  behavior.
- Context traversal: walk path, accumulate metadata, nearest
  distance wins.
- Changelog as sibling record with three causality modes.
- Mutability is state (metadata-driven), not type.
- Atomic tool principle: tools may use proprietary internal
  access; Mycelium compatibility is at the boundary.

Remove or clearly mark as vision:
- "Immutable lists as sole primitive" → replaced by
  record/context
- Polymorphic views → vision, not proven
- Location-transparent references → vision
- Content-addressed integrity → dropped from primitive
- P2P → vision

**Behavioral principles — keep what's proven, mark what's open:**

| Principle | Status | Action |
|---|---|---|
| Panta Rhei | Proven | Keep |
| Immutability with evolution | Proven | Keep |
| Indexes are views | Open | Mark as vision |
| Self-describing navigation | Partially proven | Keep, note stored metadata needed |
| Location-transparent refs | Open | Mark as vision |
| Content-addressed integrity | Dropped | Remove or mark as optional |
| Schema evolution | Open | Mark as vision |
| Compaction | Open | Mark as vision |
| Friction as signal | Proven | Keep |

Add new proven principles:
- Structure is behavior (no flags, no configuration)
- Nearest distance (definitions reside closest to realization)
- KISS (simplicity in realization; tweak principles to stay
  simple)
- Data-triggered processing (data state drives progression)
- Resolution spectrum (same meaning at different granularity)

**Splectrum — update TDC:**

- Requirements as natural language quality gates: proven
- AI evaluating AI output: proven
- Crystallization: not yet proven, keep as direction
- Add: data-triggered pipeline pattern (stateless steps,
  presence-driven progression)
- Add: transient process contexts with lifecycle

**HAICC — minimal changes:**

- Entity-neutral: proven as stated
- Maximum autonomy: proven as stated
- Add: the build cycle as a proven HAICC process (decide,
  build, evaluate, evolve)

**Virtuous cycle — keep as is.** Still correct.

### Tone

Describe what IS, not what COULD BE. Where the vision extends
beyond what's proven, say so explicitly. The document should
be buildable-on — a reader should know what they can rely on
and what's still open.

## Document 2: POSITIONING.md

### What changes from spl3 version

The spl2 positioning claimed differentiators that don't
exist in code (polymorphic views, P2P, semantic navigation,
compaction). The spl4 version should position honestly.

### Structure

**Keep the intellectual lineage.** Kreps, Kleppmann, Hickey —
this is real and accurate. The convergence on immutable log →
derived everything is where Mycelium's roots are.

**Reframe the positioning:**

What Mycelium actually is today:
- Context-centric data model (not log-centric, not
  graph-centric)
- Flat API with metadata-driven behavior
- Three-layer architecture with swappable substrates
- Data-triggered processing for meaning operations
- Entity-neutral collaboration model

What makes this different (proven, not aspirational):
- Context traversal with nearest distance — structure IS
  behavior
- Metadata-driven mutability — same context changes state
  over time
- Atomic tools with boundary compatibility — proprietary
  internals, compatible outputs
- Natural language quality gates evaluated by AI

What remains as vision (clearly labeled):
- Polymorphic views
- Cascading cross-context references
- P2P / federation
- Capability-preserving compaction

**Remove overclaims.** The spl2 positioning said Mycelium
"bridges two camps" and adds things "nobody does." That's
premature. The honest position: Mycelium is a context-centric
data interaction model that emerged from the immutable-log
tradition but diverged into metadata-driven behavior. Whether
it bridges camps or adds unique capability is for future work
to prove.

## Document 3: ORIGINS.md

### What changes from spl3 version

Add spl3's contribution. The current ORIGINS.md covers spl0–
spl2 and describes spl3 as "the transition." Update to
reflect what spl3 actually produced.

### Structure

Keep existing spl0–spl2 sections. Add:

**What spl3 achieved:**
- 9 projects, progressive build cycle
- Proved the record/context primitive across storage,
  changelog, traversal, and evaluation
- Three-layer architecture with two substrate capabilities
- Flat API with context traversal and metadata enforcement
- Two Splectrum tools: context-view (cold-start orientation)
  and evaluator (requirements-based quality gates)
- Data-triggered processing as a general pattern
- Self-containment assets as emergent schema candidates

**What spl3 taught:**
- Build incrementally — each iteration moves some steps,
  not the whole distance
- The primitive is sufficient — no new primitives across
  9 projects
- Atomic tools produce value independently before
  integration
- Simplicity wins — flat API over type hierarchy, transient
  metadata over premature persistence
- Vision and implementation are different — principles
  need reconciliation with what was actually built

**The transition to spl4:**
- spl3 defined the model; spl4 connects it through use
- The three concerns (defining meaning, created meaning,
  capabilities) are identifiable but not yet structurally
  separable
- Tools and API exist independently; integration is the
  next step

## Additional File: CLAUDE.md

spl4 needs a CLAUDE.md — the working instructions for any
entity entering the repo. Evolve from spl3's version:

- Update mission to spl4's mission statement
- Keep "How We Work" section (entity, autonomy, tech
  decisions, build don't plan, meaning first)
- Add KISS explicitly
- Update "The Build Cycle" if process changes
- Update "Key Documents" to reference spl4's seed documents

## What This Package Provides

A new session entering spl4 gets:

1. **PRINCIPLES.md** — what the model IS (proven) and where
   it COULD GO (vision), clearly separated
2. **POSITIONING.md** — honest landscape position based on
   what exists, not what's imagined
3. **ORIGINS.md** — full lineage including spl3's
   contribution
4. **CLAUDE.md** — working instructions and mission

Together these are sufficient for cold-start orientation and
for building the first spl4 project. The analysis documents
(01–06) in this folder are reference material — available
for deep context but not required for starting work.
