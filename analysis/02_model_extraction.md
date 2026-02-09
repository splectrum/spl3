# Model Extraction

The Mycelium model as it actually exists after spl3 — not as
it was specified before spl3. This describes what was built
and proven in code, what was demonstrated conceptually, and
where the boundary between proven and aspirational lies.

## The Primitive

**Record** = key → content (opaque bytes)

A record is the atomic unit. Key is a string, meaningful only
within its containing context. Content is raw bytes — the
store does not interpret it. Encoding (utf-8, base64) is a
transport concern, not a structural one.

**Context** = container of records

A context holds records. Records can themselves be contexts
(recursion). The containment relationship is the only
structural relationship. There are no cross-context references
at the structural level.

This is proven in code across projects 01–08. The primitive
did not require extension across 9 projects spanning storage,
changelog, traversal, and evaluation.

## Operations

Seven operations, proven in 08:

| Operation | Type | Description |
|---|---|---|
| list | read | List record keys in a context |
| read | read | Read a record's content |
| flatten | read | Recursively list all records as relative-path keys |
| create | write | Create a new record |
| write | write | Overwrite an existing record |
| delete | write | Remove a record |
| move | compound | Read + create + delete across contexts |

Move is a context-layer compound operation requiring metadata
awareness of both source and destination paths.

## Three Layers

Proven in code (06–08):

**Logical layer** — Defines structures (record, context) and
operations. Zero imports, zero dependencies on storage. This
is types.ts from 06: pure interface.

**Capability layer** — Implementation that binds logical to
physical. Two capabilities proven: folder-based (directories
and files) and file-based (single JSON file with base64
content). Capabilities are interchangeable — same output, same
behavior, different substrates. Round-trip verified at byte
level including binary content.

**Physical layer** — The substrate itself. Folders, files.
Future substrates (database, API, network) are capability
bindings, not model changes.

The storage capability has zero knowledge of metadata,
mutability, modes, or changelogs. It stores and retrieves
bytes. All intelligence lives in the context layer above.

## Context Layer

Proven in 08. This is the highest-level working code:

**Flat API** — One interface, all operations. No type hierarchy.
Metadata determines what's permitted at runtime. An immutable
context rejects writes via accumulated metadata, not via
separate interfaces.

**Context traversal** — Walk the path segments from root to
target. At each segment, check for context definitions
(metadata). Merge into accumulator. Nearest distance wins —
inner context overrides outer. Algorithm is ~30 lines.

**Flat contexts** — A context marked `flat: true` means "my
interior is content, not sub-contexts." Traversal hops from
the context directly to the resource, skipping physical
subdirectories. This models natural boundaries — a project
is a flat context; its source files are records, not
sub-contexts.

**Metadata-driven behavior** — Mutability, changelog mode,
and enforcement are all driven by metadata accumulated during
traversal. No flags, no configuration objects. Structure
determines behavior.

**Transient metadata** — Context definitions are supplied at
invocation time (not stored). This proves the accumulation
and enforcement mechanics work. Stored metadata (persisted as
records in contexts) is identified as the next step but never
built.

## Changelog

Proven in 06–08:

**Sibling record** — Changelog for `foo.txt` is
`foo.txt.changelog` — a record in the same context, not
metadata in a side channel. Visible, readable, flattenable.

**Three modes:**
- **none** — mutable, no tracking (default; most records)
- **resource-first** — resource is truth, changelog is audit
- **log-first** — changelog is truth, resource is derived
  (event sourcing)

**Cascading changelog** — A context's changelog is a cascading
read across all children's changelogs. Derived, not stored.
The record is the unit of change tracking; the context
aggregates.

**Delete behavior** — Depends on where the changelog attaches.
Record-attached: die together. Context-attached: persist beyond
the record. Bin is a sub-context pattern — if it exists,
delete moves there; if not, delete is permanent.

## Data-Triggered Processing

Proven in 09:

**Stateless steps** — Each step reads inputs from records,
writes outputs as records. No session state. Data state is
the checkpoint. Kill and restart at any point.

**Presence-driven progression** — What files/records exist
determines what happens next. Delete an output to re-run its
step. Build-system logic applied to meaning operations.

**Transient process contexts** — Short-lived data contexts
with a lifecycle: spawn → process → compact → detach.
Linked to the main context via reference. Main context only
accumulates compacted results.

**Horizontal slicing** — One evaluation per requirement, one
output each. Each slice independently restartable.

## Emergent Patterns (Demonstrated, Not Codified)

These patterns emerged during the work and are described in
evaluations but are not implemented as reusable mechanisms:

**Self-containment assets** — TOOL.md (identity/purpose),
config.md (configuration), CONTEXT.md (relationships). These
describe what a Mycelium project IS. They are logical schema
candidates but are currently just markdown files.

**Resolution spectrum** — The same meaning at different
levels of explicitness: natural language (encapsulated) →
structured file (partially explicit) → individual records
in contexts (fully explicit). All the same primitive at
different granularity.

**Namespaced metadata** — Each operator/context contributes
metadata under its own namespace, preventing collision.
Discussed, never implemented.

**Nearest distance principle** — Requirements, metadata,
and definitions reside at the closest point to their
realization. Practiced (REQUIREMENTS.md in project folders)
but not enforced by any mechanism.

## The "Data Interaction Model" Claim

The 09 evaluation concludes that Mycelium is "a data
interaction model, not a storage system" — that the
record/context/operations primitive can model any data flow
(LLM calls, APIs, communication), not just persistence.

**What supports this:** The evaluator's LLM capability call
is encapsulated behind the capability boundary. From the
logical layer, it looks like any other record operation.

**What undermines this:** Only one non-storage interaction
was built (the Claude CLI call), and it was a single function
inside one tool. The claim extrapolates from one capability
binding to "any data flow." The generalization is plausible
but unproven.

## What Is NOT in the Model (Despite Being in Principles/Positioning)

| Claimed | Status |
|---|---|
| Immutable lists as sole primitive | Replaced by record/context |
| Cascading references | Not built |
| Polymorphic views | Not built |
| Location-transparent references | Not built |
| Content-addressed integrity | Dropped from primitive |
| Schema system | Patterns identified, not built |
| Compaction | Not built |
| P2P / federation | Not built |
| Agent-neutral interface | Practiced (HAICC) but not in the data model |

## Honest Assessment

The model that emerged from spl3 is coherent and internally
consistent. Record/context with a flat API, metadata-driven
behavior, and context traversal is a clean design. Data-
triggered processing with transient process contexts is a
genuine pattern.

But the model is also modest. It is a hierarchical key-value
store with metadata accumulation along paths. The positioning
claims (polymorphic views, semantic navigation, P2P,
capability-preserving compaction) are not in the model — they
are in the vision. The gap between the two is significant.

The strongest contribution is the context layer design: flat
API, traversal with nearest distance, metadata-driven
enforcement, changelog as sibling records. This is the actual
model. Everything above it (views, references, schemas,
compaction) is future work, not proven architecture.
