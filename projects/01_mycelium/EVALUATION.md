# 01_mycelium — Evaluation

## What Was Built

A CLI tool implementing immutable lists with typed records,
cascading references, and content-addressed hashing. TypeScript,
zero runtime dependencies, file-based storage (.mycelium/).

## What We Learned

### 1. References are meaning, not substrate

References say "this relates to that" — an act of interpretation.
Mycelium is the meaningless persistence layer. References belong
to Splectrum (expression), not Mycelium (storage). They can be
explicit (in record data) or implicit (discovered through
processing). Within an active context, the reference graph is
inevitably mutable — it's derived state, not immutable record.

### 2. Content is opaque

Content should be raw bytes (Buffer/unknown), not string.
Mycelium stores, it doesn't interpret. Type information
("this is JSON", "this is PNG") is meaning — it belongs
above this layer, potentially at the reference level.

### 3. Hash is derived, not stored

Content-addressed integrity can be computed on read or
maintained as a view. Baking it into the record mixes a
verification concern into the primitive. Principle 4.3:
indexes are views, not data.

### 4. A record is a key-value pair

Strip everything else away and a record is: unique key +
content. That's the primitive. Timestamp belongs to temporal
structure (when was it stored in this list), not to the
record itself.

### 5. Lists are contingent, not absolute

A list is any structure that holds records — a folder, a git
history, a database table. The `projects/` folder in this
repo is a list where subfolder names are keys and zipped
contents are values. Mycelium shouldn't create a proprietary
storage format for something that already exists everywhere.

### 6. Keys are context-bound

A key like `01_mycelium` only means something within
`projects/` within this repo. Even a GUID is only
near-absolute. There is no escape from context — only more
or less explicit context. Context itself is meaning, which
lives above the primitive.

### 7. Projects are immutable records

Each project in the sequence is itself an immutable record.
We don't go back and rewrite 01 — we carry the skill forward
into 02. The project sequence is an immutable list. Principle
4.2: what was said stays said. Principle 4.8: memory loss,
skill retained.

### 8. Logical vs physical are separable but not prematurely

The logical model (lists, records, key-value pairs) and the
physical model (folders, files, databases) are independent.
But: build hardcoded onto one physical substrate first.
Refactor into explicit logical/physical separation only when
a second substrate demands it. Don't build the abstraction
before the need.

### 9. The filesystem already is the structure

A folder is a list. A file is a record. A subfolder is both
a record and a list. The tool shouldn't create proprietary
storage — it should be a lens on what already exists. Any
folder is navigable as a list of keyed records.

### 10. Meaning is inescapable when navigating

Choosing to flatten a folder into relative-path keys vs
showing nested structure is interpretation. Choosing what
counts as a record is interpretation. The primitive (key →
content) is meaningless, but any operation on it carries
meaning. Mycelium and Splectrum co-arise — yin and yang.

### 11. The wrapper is a context

A list/wrapper should be called a **context**. A context
contains keyed items. Items can themselves be contexts.
References between items are relative to the containing
context. This is recursive — contexts nest, and reference
scope is always local.

This connects everything: keys are context-bound (point 6),
lists are contingent (point 5), and meaning requires context
(point 10). The primitive isn't just key → content — it's
**context containing keyed items, where items can themselves
be contexts**.

## The Primitive (revised)

A **record** is: key → content (opaque bytes).

A **context** contains records. Records can themselves be
contexts. References are relative to the containing context.

Everything else — time, hashing, typing, meaning,
interpretation — is layered above.
