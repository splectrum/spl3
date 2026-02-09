# Mission Statement — spl4

## What spl3 Achieved

spl3 booted the Mycelium model from principles to working
code. The primitive (record/context) is proven and sufficient.
The three-layer architecture (logical, capability, physical)
works with two interchangeable storage substrates. A flat API
with metadata-driven behavior and context traversal provides
the integration surface. Two Splectrum tools (context-view,
evaluator) do useful work in the build cycle.

The three concerns (defining meaning, created meaning,
capabilities) are identifiable in every project. They are
not yet structurally separable.

## What spl4 Should Do

**Advance the model through practical tool building.**

spl3 proved the primitive and created the base API. spl4
connects them — tools consume the model, and the model
evolves to serve the tools. The test is practical: does the
workflow get better?

Each iteration moves some steps forward, not the whole
distance. spl4 is not expected to complete the full
Mycelium vision. It is expected to make the model real
through use, produce tools that help with the work, and
leave a cleaner foundation for what follows.

## Mission

spl4 is the integration iteration. Its mission is to connect
the Mycelium model to practical tool use, advancing both
through dogfooding. On completion, tools consume the context
layer, contexts describe themselves through stored metadata,
and the three concerns are structurally distinguishable — not
yet fully separated, but recognizable by the system rather
than only by humans.

## Scope

### In scope

**1. Tools consume the context layer.**
At least one tool (evaluator or context-view) operates through
the Mycelium API rather than raw filesystem. This validates
the API as an integration surface and reveals what's missing
or overcomplicated.

Atomic tools may use proprietary internal access — Mycelium
compatibility is at the boundary (input/output), not
internally. A tool becomes Mycelium-integrated when it can
be invoked through Mycelium and its results land as Mycelium
records.

**2. Stored metadata.**
Context definitions persisted as records, read during
traversal alongside transient metadata. The simplest
mechanism that makes contexts self-describing. This is the
minimum needed for structural awareness — contexts that
know what they are without external configuration.

**3. Practical tooling.**
Build what helps with the work we do. If a new tool earns
its way in during integration (because the workflow demands
it), build it. If an existing tool needs rework to become
useful through the API, rework it. Don't build speculatively.

**4. Evolve all components.**
Principles, positioning, model, tools — all are living
documents. spl4 should refine them based on what the work
reveals. The seed documents are starting points, not
contracts.

### Out of scope

- Polymorphic views
- P2P / federation
- Cascading cross-context references
- Formal schema validation language
- Compaction
- Full structural separation of the three concerns
- Multi-repo diversification

These remain in the broader vision. They earn their way into
a future iteration when practical need demands them.

## Constraints

**KISS.** Simplicity in realization. If a principle creates
implementation complexity, tweak the principle. The simplest
mechanism that serves the purpose wins. Three lines of code
that work beats an elegant abstraction that's premature.

**Small but meaningful iterations.** Each project within spl4
advances something concrete. Don't plan the whole distance —
build, evaluate, evolve.

**Technology decisions are AI's domain.** Human steers
principles and logical meaning. AI sets the implementation
path.

**Build tools that help with the work.** Self-sufficiency
first. The workflow (orient, decide, require, build, evaluate,
capture) is the practical test.

## Success Criteria

spl4 succeeds if:

1. At least one tool consumes the Mycelium context layer
   for its core operations
2. Contexts have stored metadata that makes them
   self-describing
3. The work produced useful tools or meaningful improvements
   to existing ones
4. The seed documents (PRINCIPLES.md, POSITIONING.md,
   ORIGINS.md) are updated to reflect reality
5. The next iteration has a cleaner, more honest foundation
   to build on

## What This Enables

If spl4 achieves its mission, the path to structural
separation becomes concrete: contexts that describe themselves
can declare what kind of content they hold (defining meaning,
created meaning, capabilities). Tools that consume the API
can respect those declarations. The envelope question (what
constitutes a self-contained Mycelium unit) becomes answerable
by looking at what a working context actually contains.

The diversification trigger (multi-repo) is not spl4's job.
But spl4 should leave the model in a state where someone
could define the envelope without guessing.
