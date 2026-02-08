# 08_context — Evaluation

## What Was Built

The context layer: a flat API surface with traversal that
accumulates metadata along the context path. One interface
with all operations (create, read, write, delete, list,
flatten, move). Metadata is transient (supplied at
invocation as context definitions). The context layer wraps
a storage capability, enforces rules from accumulated
metadata, and drives changelog behavior based on mode.
Both folder-based and file-based storage work identically
underneath.

## What We Learned

### 1. The flat API works

One interface, all operations. No type hierarchy to manage.
Metadata determines what's permitted — an immutable context
rejects writes at runtime, not at compile time. This matches
reality: mutability is state that changes over time, not a
type that's fixed at construction.

### 2. Traversal is simple

Walk the path segments, check each for metadata definitions,
merge into accumulator (nearest distance wins). Most contexts
contribute nothing — pass-through. The flat flag stops
accumulation early. The algorithm is ~30 lines.

### 3. Flat contexts model natural hops

A project context with `flat: true` means "my interior is
content — don't look for sub-contexts." Traversal hops from
the project directly to the resource, regardless of how
many subdirectories exist physically. The context controls
how its own interior is navigated.

### 4. Three changelog modes are correct

- **none**: mutable, no tracking. Right for transient work
  (project source code heading toward immutability)
- **resource-first**: resource is truth, changelog is audit.
  Right for long-lived mutable resources
- **log-first**: changelog is truth, resource is derived.
  Right for event-sourced contexts

Default is none — most resources don't need tracking.

### 5. Transient metadata proves the mechanics

Context definitions supplied at invocation prove traversal,
accumulation, enforcement, and changelog behavior all work.
Stateful metadata (read from stored records) is a future
extension that adds a second source to the same merge
algorithm. External (transient) and internal (stored)
metadata will need a merge mode to determine precedence —
deferred.

### 6. The context layer absorbs TrackedCapability

07's TrackedCapability was a standalone wrapper. In 08,
changelog behavior is driven by metadata — no separate
wrapper needed. The context layer checks mode from
accumulated metadata and handles changelog inline. This
is cleaner: one layer, one decision point.

### 7. Storage is truly dumb

The StorageCapability interface has no knowledge of metadata,
mutability, modes, or changelogs. It just stores and
retrieves bytes. All intelligence lives in the context layer
above. This separation is clean — the storage capability
is trivially swappable.

### 8. Nearest distance principle in action

Metadata at inner contexts overrides outer. Root says
immutable, project says mutable — the project wins for its
contents. This is nearest distance: the context closest to
the resource has the final say. The traversal implements
this mechanically.

### 9. Move is a compound operation

Move = read source + create destination + delete source,
with metadata checks on both paths. Changelog moves with
the record. This confirms move belongs at the context
layer, not the storage layer — it requires metadata
awareness for both endpoints.

## Changes Outside This Project

None.

## Carry Forward

The core architecture is complete: storage layer (bytes),
context layer (traversal, metadata, enforcement, changelog),
flat API surface. Metadata is transient — stateful metadata
extends the same merge with a stored source and a merge
mode for external/internal precedence. Bin is a data
structure pattern on the context layer. The evaluator (09)
is the next major step — first Splectrum-layer tool, using
natural language requirements as quality gates.
