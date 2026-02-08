# 05_context_fix — Evaluation

## What Was Built

An improved version of the context-view tool (from 03). The
`context-view sync` command now generates a CONTEXT.md that
works as a cold-start orientation document. Additions over 03:
introduction from CLAUDE.md, vocabulary glossary, current
conceptual state (carry-forward), reading order, magnifying
glass on current project (requirements surfaced inline),
compact timeline entries with cascading references to detail.

## What We Learned

### 1. Cold-start orientation is measurable

Testing CONTEXT.md with a fresh agent gives a repeatable
quality signal. First test (03 output): "least useful
document." Second test (05, pre-improvements): 6/10.
Third test (05, with cascading references and magnifying
glass): 7/10. The improvements are traceable to specific
requirements. Natural language requirements work as
quality gates when paired with entity-neutral evaluation.

### 2. Cascading references beat inline verbosity

Old timeline entries had verbose inline learnings, summaries,
and external changes. Compact entries with a one-line summary
plus a reference (`See projects/XX/EVALUATION.md`) serve
orientation better — the map should be a map, not the
territory. The EVALUATION.md files are the territory.

### 3. The magnifying glass pattern

Current (latest) project gets expanded inline detail in the
mutable section. Older projects get compact references.
This matches how attention works — recent context matters
most, historical context is available on demand.

### 4. Requirements and quality gates attach at every context level

A context can have requirements. A project is a context with
a REQUIREMENTS.md. The repo is a context that could have
requirements. The projects folder is a context that could
have requirements. This pattern — attaching reqs and quality
gates to the most elementary unit in Mycelium — means every
context carries its own definition of "good enough."

### 5. Remaining gaps are content gaps, not tool gaps

The agent's remaining complaints (compressed intro, HAICC
unexplained, five operations unnamed, no spl2 relationship)
are about content depth in source documents (CLAUDE.md,
individual EVALUATIONs), not about the tool. The tool
correctly surfaces what exists and references where to find
more. Better inputs produce better output.

### 6. Versioning is implicit but needs to become explicit

05 is a new version of 03's tool. Same package name, evolved
source. Currently this relationship is implicit (human knows,
code doesn't). Versioning of tools across projects is a gap
that will need addressing.

### 7. Three layers: logical, capability, physical

The Mycelium model has three layers, not two. Logical defines
what structures exist (record, context, operations). Physical
is the substrate (folders, files, future). Capability is the
implementation that binds logical to physical — it makes the
logical real in the physical. Without capability, the logical
is just description and the physical is just storage. 06 is
the first project to produce capabilities explicitly: two
implementations (folder-based, file-based) binding the same
logical model to different substrates.

### 8. Everything we build is modeled in Mycelium

The logical patterns, the capability bindings, the tools
themselves — all are data modeled using Mycelium primitives.
Key-value information in a context, with requirements and
quality gates attached. The logical model is a context. Each
pattern is a record. Requirements define what "correct" means
for that context. This is self-describing: Mycelium models
itself using its own primitives.

### 9. Nearest distance principle

Requirements reside at the closest distance to their
realisation. A project's requirements live in the project
context, not in a central registry. A context's quality
gates live with that context. This is why reqs attach at
every level (learning 4) — each context owns the definition
of what it means for that context to be correct, at the
point where it is realised.

### 10. Defining meaning vs created meaning

A context holds two kinds of meaning: formal metadata
(requirements, quality gates, structure definitions) and
content (what has actually been created). Defining meaning
says what should be; created meaning says what is. Both
reside in the same context (nearest distance), but they
are fundamentally different. The evaluator bridges them —
it reads the defining meaning and checks it against the
created meaning.

### 11. spl3 is the Mycelium boot process

spl3 is not a product being developed — it is Mycelium
bootstrapping itself into existence. Each project is a step
in the boot sequence. The build cycle (AI decides, builds,
evaluates with human) is HAICC operating during creation.
When defining meaning, created meaning, and capabilities can
live independently across repositories, the boot completes
and Mycelium is running.

### 12. The evaluator is natural language at the logical level

On the logical side, the requirements/quality gates
evaluator lives entirely within natural language. No
schemas, no formal validation. The capability matrix then
fills in with implementations: an AI agent reading natural
language against content, a code checker for formal
properties, etc. This separation means the logical model
is universal — any entity that understands natural language
can evaluate — while implementations specialise.

## Changes Outside This Project

- **CONTEXT.md** — Regenerated with improved format (intro,
  vocabulary, magnifying glass on current project, reading order).

## Carry Forward

CONTEXT.md works as a cold-start orientation document (7/10).
Cascading references and magnifying glass established as
patterns. Requirements/quality gates attach at every context
level (nearest distance principle). Three layers: logical
(structures), capability (implementation binding logical to
physical), physical (substrate). Defining meaning (reqs, QGs)
and created meaning (content) coexist in each context — the
evaluator bridges them. The evaluator is natural language at
the logical level; the capability matrix provides implementations.
Next (06): logical/physical API split, first two capabilities.
Then (07): natural language requirements/quality gates evaluator
— first Splectrum-layer tool, bridging formal metadata and
content, filling remaining CONTEXT.md gaps.
