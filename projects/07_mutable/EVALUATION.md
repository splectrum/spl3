# 07_mutable — Evaluation

## What Was Built

Immutable/mutable API split with changelog tracking. The
capability interface splits into ImmutableCapability (read,
create, flatten) and MutableCapability (adds write, delete).
A TrackedCapability wrapper adds changelog as a sibling
record (`{key}.changelog`), with two causality modes
(log-first, resource-first). Cascading changelog read
aggregates across children. Both folder-based and file-based
capabilities implement the mutable interface. CLI extended
with write, log, and mode selection.

## What We Learned

### 1. The API is actually two concerns mixed together

Record operations (create, read, write, delete) are key-value
operations on individual entries. Context operations (list,
flatten, move) are about the container. We're currently mixing
both in one interface. This doesn't need refactoring yet but
is a cleaner conceptual split for when the context becomes a
first-class mutable resource.

### 2. Bin is a data structure, not a core API concern

Initial implementation embedded bin-aware soft delete in the
tracked wrapper. This was wrong — the bin is a higher-level
pattern composed from primitives (create in bin context,
delete from source). The core mutable API just deletes.
Structure determines behavior; the API doesn't need to
know about it.

### 3. Move is a context operation

Move changes where a record lives in the containment
hierarchy. It's a compound operation (read + create + delete
across contexts) that only makes sense when operating on
contexts as first-class mutable resources. It belongs in
a future context API, not the key-value API.

### 4. Mutability is state, not type

The same context switches from mutable to immutable (e.g.
a project completes). You can't express this with separate
interfaces because the interface would have to change at
runtime. This points toward a flat API where all operations
exist on one surface, and the context's metadata determines
what's permitted. The behavior comes from data, not the
type system.

### 5. The flat API and context traversal

The right design is: one flat Capability interface with all
operations. An API call on a record traverses the context
path and accumulates metadata along the way. Each context
contributes state (mutability, mode, permissions). The local
operation executes with the accumulated metadata. Traversal
is separated from the local call — the metadata accompanies
the API call as a parameter.

This means the API signature becomes something like
`write(key, content, metadata)` where metadata is the
accumulated state from the context path. No context needs
to know about its parents — the metadata carries that.

### 6. Metadata is key-value

The metadata bucket is itself key-value — records in a
context carrying meaning about the context rather than
content. Same primitive, different purpose.

### 7. Don't refactor to flat API yet

The flat API earns its keep when context traversal and
metadata exist. Refactoring now would add "not implemented"
throws without the machinery that makes them meaningful.
The current split works for what exists. The refactor is
the natural first step of the project that introduces
context traversal.

### 8. Changelog mode persistence is deferred

The causality mode (log-first vs resource-first) is currently
a wrapper construction parameter. When API access runs
through contexts, mode becomes a metadata record in the
context — picked up during traversal, not configured per
call or per wrapper.

## Changes Outside This Project

None.

## Carry Forward

Immutable/mutable split works with changelog tracking on
both substrates. The API mixes two concerns (record vs
context operations) that will separate when context becomes
first-class. The right architecture: flat API, context
traversal accumulating metadata, local operation receiving
metadata as parameter. Mutability is state (from context
metadata), not type. Bin, move, and mode persistence all
belong to the context layer. Next project should introduce
context traversal with metadata — that's when the flat API,
bin, move, and state-based mutability all become real.
