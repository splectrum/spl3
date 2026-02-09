# Gap Analysis

What stands between spl3's current state and the mission:
disentanglement of defining meaning, created meaning, and
capabilities into separate, independent units — triggering
repo diversification.

## The Three Concerns Today

**Defining meaning** (requirements, quality gates, schemas)
— Lives as REQUIREMENTS.md files in project folders. The
evaluator reads them. They are not Mycelium records with
metadata and schema — they are markdown files.

**Created meaning** (code, evaluations, content) — Lives as
source files and EVALUATION.md in the same project folders.
Indistinguishable from defining meaning at the structural
level. Both are files in the same directory.

**Capabilities** (tools, API implementations) — Live as
TypeScript source in project folders. The API (08) and
tools (03/05, 09) don't connect. Each is a standalone
Node.js project.

All three share the same physical structure (project folder)
and have no Mycelium-level mechanism to distinguish them.
The disentanglement is conceptual — describable, identifiable
— but not structural.

## Gap 1: Tools Do Not Consume the API

**What exists:** The context layer (08) provides a working
flat API with traversal and metadata. The tools (05, 09) do
the same work by reading the filesystem directly.

**Why it matters:** If tools don't use the API, the API is
unvalidated as a foundation. The context layer was tested
within its own project but never consumed by an external
client. We don't know if the API is actually usable as an
integration point.

**What's needed:** At minimum, one tool consuming the context
layer to prove it works as an integration surface. This is
the single most important gap — it connects the two halves
of what spl3 built.

**Difficulty:** Medium. The tools already do what the API
does, just with direct filesystem calls. The refactor is
conceptually straightforward but touches every file operation
in both tools.

## Gap 2: No Stored Metadata

**What exists:** Transient metadata supplied at invocation.
Proves traversal and enforcement work. But context definitions
vanish when the process ends.

**Why it matters:** Without stored metadata, contexts cannot
describe themselves. The flat context flag, mutability state,
changelog mode — all must be externally provided every time.
There is no self-describing structure.

**What's needed:** Context definitions persisted as records
within contexts (e.g., a `.meta` record or similar
convention). Read during traversal alongside transient
metadata. Merge mode (external vs stored precedence) for
conflict resolution.

**Difficulty:** Low-medium. The accumulation algorithm already
exists. Adding a stored source is an additional read at each
path segment. The merge mode decision is the harder design
question.

## Gap 3: No Schema System

**What exists:** Emergent patterns (TOOL.md, config.md,
CONTEXT.md) that describe what a project is. These are
conventions, not enforced schemas.

**Why it matters:** Without schema, there is no formal
definition of what a context should contain, what records
are valid, or what metadata is expected. The three concerns
(defining meaning, created meaning, capabilities) cannot be
structurally distinguished without some form of schema.

**What's needed:** At minimum, a way to declare "this context
expects these records with these properties." Not necessarily
a schema language — could be metadata records that declare
expectations, validated by an operator (like the evaluator
validates requirements).

**Difficulty:** Medium. The real question is how formal.
Natural language declarations (like REQUIREMENTS.md) are one
end. Formal schemas (JSON Schema, etc.) are the other. The
resolution spectrum applies here — start natural, formalize
when needed.

## Gap 4: No Structural Separation of the Three Concerns

**What exists:** All three concerns live in the same project
folder. They are identifiable by human convention (REQUIREMENTS.md
= defining meaning, src/ = capabilities, EVALUATION.md =
created meaning) but not by structure.

**Why it matters:** This is the mission. If the concerns
cannot be separated, the mission is incomplete.

**What's needed:** A structural convention — enforced or at
least Mycelium-recognizable — that marks which records belong
to which concern. This could be:
- Separate sub-contexts (defining/, created/, capability/)
- Metadata on records (concern: "defining")
- Schema-based classification
- Naming conventions recognized by traversal

**Difficulty:** Medium. The design question is whether
separation is physical (different contexts) or logical
(metadata/schema on records in the same context). The nearest
distance principle suggests physical — each concern has its
own context with its own metadata.

## Gap 5: No Multi-Repo Envelope

**What exists:** One repository with everything. The mission
states each new repo should carry "its own Mycelium envelope:
self-describing, self-contained, composable across boundaries."

**Why it matters:** This is the mission completion trigger.
Without it, spl3 remains a monolith.

**What's needed:**
- A definition of what a Mycelium envelope IS (which records,
  which metadata, which schema)
- A mechanism for cross-repo references (or a decision to
  not have them)
- Enough structural convention that a new repo can be
  recognized as Mycelium-structured
- The self-containment assets (TOOL.md, config.md, CONTEXT.md)
  formalized as envelope components

**Difficulty:** High. This depends on gaps 2, 3, and 4.
It requires stored metadata, some form of schema, and
structural separation to be meaningful.

## Gap 6: Positioning vs Reality

**What exists:** POSITIONING.md describes Mycelium as
bridging two industry camps with polymorphic views, semantic
navigation, P2P, and compaction.

**What was built:** A context-centric hierarchical store with
metadata traversal.

**Why it matters:** Not as a technical gap but as a credibility
gap. If the next phase continues building on the positioning
claims without proving them, the gap widens. If the positioning
is revised to match reality, the project can build on solid
ground.

**What's needed:** Either:
- Revise positioning to describe what Mycelium actually is
  (context-centric, metadata-driven, flat API) rather than
  what it aspires to be
- Or prioritize building toward the positioned capabilities
  (views, references, P2P)

The first is honest. The second is ambitious. They are not
mutually exclusive but should be sequenced — honest
positioning first, ambitious building second.

## Prioritized Gap List

| Priority | Gap | Depends On | Rationale |
|---|---|---|---|
| 1 | Tools consume API | — | Validates the API, connects the two halves |
| 2 | Stored metadata | — | Enables self-describing contexts |
| 3 | Positioning reconciliation | — | Credibility foundation |
| 4 | Structural separation | 1, 2 | The mission itself |
| 5 | Schema (minimal) | 2 | Enables formal concern identification |
| 6 | Multi-repo envelope | 2, 4, 5 | Mission completion trigger |

Gaps 1–3 are independent and foundational. Gap 4 requires 1
and 2. Gap 5 benefits from 2. Gap 6 requires most of the
others.

## Critical Path

The minimum path to mission completion:

1. Connect tools to API (proves the API works as integration surface)
2. Add stored metadata (enables self-describing contexts)
3. Define structural separation (three concerns in distinct
   sub-contexts or with distinguishing metadata)
4. Define the envelope (which records + metadata constitute
   a Mycelium-structured repo)
5. Split into multiple repos

Steps 1–2 are code. Step 3 is design + code. Step 4 is
design. Step 5 is execution.

The missing ingredient is not more exploration or more
patterns — it's connection and formalization of what
already exists.

## What NOT to Build

Based on spl3's history of ambitious claims outrunning
implementation:

- **Don't build polymorphic views.** They are the hardest
  feature and the least validated need. The current API works.
- **Don't build P2P.** It's a positioning claim, not a
  current requirement. Multi-repo with git as transport
  is sufficient.
- **Don't build formal schema validation.** Convention-based
  schema (like the self-containment assets) is enough for
  structural separation. Formal validation can come later.
- **Don't build compaction.** Interesting but not on the
  critical path to mission completion.
- **Don't build cascading references.** The context traversal
  path is sufficient for structural navigation. Cross-context
  reference graphs are a future concern.

Focus on connection and separation. The model is sufficient.
The implementation needs to become coherent.
