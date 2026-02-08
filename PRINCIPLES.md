# 14 - Principles (Complete, Three Pillars)

The system comprises three pillars: Mycelium (data), Splectrum
(expression), HAICC (creation). Each has principles. Together
they form a virtuous cycle.

The fundamental participant is the ENTITY. An entity is anything
that participates in the structure - externally or internally.
A human, an AI, a process, a sensor, a quality gate, a capability,
a device. No special cases. The same principles apply to all.

The aim is to remove entity involvement to the maximum beneficial
extent. If the system can do it autonomously, it should. Entities
step in where they add genuine value.

---

## Pillar 1: Mycelium (The Repository)

### Definition

Mycelium is a persistent substrate where meaning accumulates
and connects between entities across time.

### Repository Fundamentals

Properties any repository needs:

1. **Persistence** - what's stored doesn't vanish
2. **Retrieval** - what's stored can be found
3. **Connection** - things relate to other things
4. **Ingestion** - new things can enter
5. **Integrity** - what's stored is trustworthy
6. **Growth** - no fixed capacity or rigid structure

### Core Structure

The structural model that makes Mycelium different:

**3.1 The Primitive: Immutable Lists**
The sole building block. All data enters as records appended to
immutable lists. Once written, records don't change. Everything
else is derived from this single primitive.

**3.2 Cascading References**
Records reference records in other lists. References cascade,
forming a connected web. This is the mycelium network - threads
linking meaning across the repository.

**3.3 Derived Mutable Structure**
From immutable lists, a mutable structure is mounted. Still part
of the core - materialises lists into current state. Mutable
state is never primary; always a projection of immutable data.

**3.4 Views**
The repository is accessed through views. Views can implement
any repository pattern: relational, document, graph, key-value,
streaming, or patterns not yet invented. The repository maintains
internal processing to keep views consistent.

### Behavioural Principles

**4.1 Everything flows (Panta Rhei)**
Stateless processes, flowing state through immutable records.
Event sourcing emerges naturally.

**4.2 Immutability with evolution**
What was said stays said. New understanding appends, doesn't
rewrite. History accumulates.

**4.3 Indexes are views, not data**
Same lists, many access patterns. New views without restructuring.
No migration headaches.

**4.4 Self-describing navigation**
No global map needed. Start anywhere, follow cascading references,
discover what's relevant. Low orientation cost.

**4.5 Location-transparent references**
Things referenced by what they are, not where they live. Works
across filesystem, network, P2P.

**4.6 Content-addressed integrity**
Records verifiable by hash. Enables trust without central authority.

**4.7 Schema evolution without coordination**
Old records always valid. New records backward compatible by default.
Entities evolve independently.

**4.8 Compaction preserves capability**
Lists can be compacted without losing skills. History compresses,
understanding is retained. Memory loss without skill loss.

**4.9 Friction as signal**
Low friction = flowing naturally. High friction = fighting the
design. Continuous navigation, not fixed rules.

---

## Pillar 2: Splectrum (Expression)

How meaning gets expressed, formalized, and crystallized.

### Test-Driven Creation (TDC)

**5.1 Meaning carries quality**
"Make a brick for a house" - the quality gates are inherent in
the meaning. Fitness-for-purpose is derivable from intent and
context, not separately specified.

**5.2 Natural language → formal requirements**
Conversation produces meaning. Meaning gets formalized into
precise requirements. The formalization is a natural process,
not a bureaucratic one.

**5.3 Quality gates derived from meaning**
Requirements carry their own verification criteria. Gates are
derived from the accumulated meaning context - not just the
immediate request, but everything it connects to through
cascading references.

**5.4 Intent → gates → build → verify → crystallize**
The TDC cycle: entity states intent, quality gates are derived,
work proceeds autonomously within those gates, verification
confirms fitness, successful outcomes crystallize as capability.

**5.5 Layered know-how**
Quality gates compound from simple to complex. Each layer's
gates inform the next. A house-level gate cascades to brick-level
gates. Understanding builds in layers.

### API Crystallization

**5.6 Solved problems become capabilities**
When understanding solidifies, it crystallizes into an invocable
capability (API) with attached meaning: what, why, when, success
criteria.

**5.7 Capabilities compose**
APIs combine into higher-level capabilities. "Comfort" composes
from "temperature" + "lighting" + "presence". Composition is
meaning-driven.

**5.8 Internals evolve, interfaces endure**
A crystallized capability can be reimplemented without breaking
what depends on it. The meaning contract holds; the internals
are free to change.

---

## Pillar 3: HAICC (Creation)

How entities collaborate to create.

### Collaboration Principles

**6.1 Entity-neutral**
The system treats all entities equally. No privileged entity type.
The same meaning substrate serves all participants in their
natural mode.

**6.2 Maximise autonomy**
Remove entity involvement to the maximum beneficial extent.
If the system can act autonomously, it should. Entities
participate where they add genuine value.

**6.3 Dynamic boundary**
The boundary between autonomous and collaborative shifts as
capabilities evolve. The system accommodates this shift without
restructuring.

**6.4 Shared limitations, shared solutions**
All entities have persistence, memory, and continuity limitations.
The infrastructure (Mycelium) solves these for all entities
equally, not for any one type preferentially.

**6.5 Vision and evaluation are entity contributions**
Direction-setting and fitness evaluation are where entity
involvement adds most value. Everything between intent and
evaluation is a candidate for autonomy.

**6.6 Evidence-based evolution**
Decisions are grounded in evidence from the repository, not
speculation. The immutable history provides the evidence base.

---

## The Virtuous Cycle

    HAICC: entities collaborate, produce meaning
        ↓
    Splectrum: meaning formalizes into requirements and gates
        ↓
    Mycelium: formalized meaning persists, connects, compounds
        ↓
    Splectrum: capabilities crystallize from verified understanding
        ↓
    Mycelium: evidence accumulates in the repository
        ↓
    HAICC: evidence informs the next cycle of creation
        ↓
    (cycle compounds)
