# 15 - Positioning Refined: Mycelium vs Log-Centric Systems

## Why This Second Pass

The first positioning survey (doc 13) was done before we clarified
Mycelium's core structure: immutable lists as sole primitive,
cascading references, derived mutable state, polymorphic views.

This second pass targets systems specifically built on that pattern.

## The Intellectual Lineage

Mycelium's core idea has clear roots:

- **Jay Kreps (2013):** "The log is the fundamental data structure."
  All databases are caches of subsets of the log.
- **Martin Kleppmann (2014):** "Turn the database inside out."
  The write-ahead log should be the primary external interface.
- **Rich Hickey (2012):** "The database as an immutable value."
  Facts are immutable. State is derived.

These three converge on: **immutable log → derived everything.**
Mycelium builds on this convergence and extends it.

## Closest Relatives (ranked)

### 1. Fluree — Immutable semantic graph
- Immutable ledger (append-only, cryptographically chained)
- RDF-based cascading references (triples form a web)
- OWL2RL reasoning (genuine semantic navigation)
- Derived state from ledger
- Partial polymorphism (SPARQL, GraphQL, FlureeQL)
- Federated deployment

**What it shares with Mycelium:** Immutability, cascading references,
semantic capability, derived state.

**What Mycelium adds:** Truly polymorphic views (not just graph query
languages), P2P (not just federation), capability-preserving
compaction, agent-neutrality, freedom from W3C semantic web standards.

### 2. Datomic — Immutable facts, everything derived
- Datoms (entity-attribute-value-time) as sole primitive
- Append-only transaction log
- Four derived indexes (EAVT, AEVT, AVET, VAET)
- Database-as-value (immutable at any point in time)
- Internal consistency via single transactor

**What it shares:** Purest "immutable primitive, derive everything."
Closest to Mycelium's core architecture.

**What Mycelium adds:** Typed lists (not flat datom space),
polymorphic views (not fixed index orderings), P2P, semantic
navigation, compaction, agent-neutrality.

### 3. TerminusDB — Immutable layers, graph database
- Immutable delta-encoded layers (genuinely never modified)
- Current state = composed layers
- Git-like distribution (branch, merge, push, pull)
- JSON + RDF support (some polymorphism)
- Some semantic capability (OWL)
- "Squash" operation (partial compaction)

**What it shares:** Immutable layers, derived state, Git-like
distribution, some semantics and compaction.

**What Mycelium adds:** Typed lists (not graph-only), truly
polymorphic views, true P2P, full agent-neutrality.

### 4. Irmin/Noms — Content-addressed P2P storage
- Content-addressed Merkle trees (genuinely immutable)
- Hash-based cascading references
- P2P sync built in
- Irmin: OCaml library; Noms: evolved into Dolt

**What they share:** Immutability, cascading references, P2P.

**What Mycelium adds:** Polymorphic views, internal consistency
processing, semantic navigation, compaction, agent-neutrality.
These are building blocks, not complete systems.

### 5. Kurrent (EventStoreDB) — Pure event sourcing
- Append-only event streams
- Projections (derived views from events)
- Internal consistency
- Most production-ready event sourcing database

**What it shares:** Immutable streams, derived state, projections.

**What Mycelium adds:** Cascading cross-stream references,
polymorphic views, P2P, semantic navigation, compaction.

## The Two Camps Mycelium Bridges

The field splits into two camps:

**Camp A: Immutable-log-first** (Datomic, XTDB, Kurrent, Kafka)
Strong on immutability and derived state.
Weak on polymorphic views, P2P, semantics.

**Camp B: Multi-model databases** (SurrealDB, ArangoDB)
Strong on polymorphic views and cross-entity references.
Built on conventional mutable storage. No immutable foundation.

Nobody has unified these. Mycelium's insight: immutable log AND
polymorphic views belong in the same system.

## What Mycelium Describes That Nobody Does

1. **Typed immutable lists as organising principle**
   Not a flat log (Kafka), not a graph (Neo4j), not datoms
   (Datomic). Structured, typed lists whose records reference
   records in other lists. Unique structural concept.

2. **Truly polymorphic views from immutable foundation**
   Present the same immutable data as relational, document,
   graph, key-value, or patterns not yet invented. SurrealDB
   does multi-model over mutable storage. Nobody does it over
   immutable lists.

3. **Capability-preserving compaction**
   No system has this. All existing compaction is mechanical
   (Kafka: latest per key) or destructive (Datomic excision,
   TerminusDB squash). "Forget details, retain understanding"
   is novel.

4. **Agent-neutral design from the ground up**
   No existing system was designed to serve human and AI
   agents equally. Some retrofit AI access. None are
   architecturally agent-neutral.

5. **The full combination**
   Immutability + polymorphic views + semantic navigation +
   P2P + compaction + agent-neutrality. Each exists somewhere.
   Nobody combines them.

## Positioning Statement

Mycelium is the synthesis that the database field has been
converging toward but nobody has built:

- The immutable log of Kreps/Kleppmann/Hickey
- The polymorphic views of SurrealDB/ArangoDB
- The semantic awareness of Fluree/RDF
- The P2P capability of Hypercore/IPFS
- The agent-neutrality the AI era demands
- The cognitive compaction that no system offers

Unified in a single coherent design where typed immutable lists
are the sole primitive and everything else is derived.
