# Spawn Protocol

How a repository spawns a new repository. This protocol
was developed during spl3's critical analysis to create
spl4. It applies to any form of repo creation from an
origin: iteration (spl3→spl4), branching (extracting a
tool), separation (disentangling a concern), or forking
(exploring a different direction).

The analysis and mission differ per case. The mechanics
are the same.

## Overview

Four phases:

1. **Analysis** — critically examine the origin
2. **Seed** — assemble information for the target
3. **Prepare** — create the target directory with seed
4. **Initialize** — unpack the seed into a working repo

The seed contains data. The protocol contains process.
They evolve independently — an old seed can be unpacked
by an evolved protocol.

## Phase 1: Analysis

Performed in the origin repo under `analysis/`.

**Input:** The origin repo's full content — documents,
code, evaluations, working memory.

**Process:** Critical examination. The depth scales to
the situation — a major iteration needs thorough analysis;
a tool extraction might need a single page. At minimum:

- What was proven and what wasn't (honest assessment)
- What the model actually is (not what was planned)
- What exists as working code vs concept
- What gaps matter for the next step
- A mission statement for the target
- A description of what the seed should contain

**Output:** Analysis documents in `analysis/`. These are
records in the origin repo. They become immutable when
the origin is sealed.

## Phase 2: Seed

Assembled in the origin repo under `analysis/seed/`.

**Input:** The analysis outputs plus source materials
from the origin repo.

**Contents:** Everything the target needs to start
working, organized for clarity:

- **Documents** — principles, positioning, origins, working
  instructions, mission. Written to reflect the analysis
  conclusions, not copied verbatim from the origin.
- **Reference code** — working code from the origin that
  the target may use as starting point or reference.
  Included as-is from the origin projects.
- **Working memory** — distilled memory for the AI entity
  that will work in the target. Captures key model
  knowledge, process notes, and constraints.

The seed is not a template. It does not mirror the target
repo structure. It is a package of information that the
initialization process interprets. The target structure
is an output of initialization, not a copy of the seed.

## Phase 3: Prepare

Performed by the origin entity (the session doing the
analysis). Minimal — just create the handoff point.

**Steps:**
1. Create the target directory
2. Copy the seed directory into it
3. Add a CLAUDE.md with instructions for the initializing
   entity: what the seed contains, how to proceed

That's it. No git init, no GitHub repo, no structure
creation. The target directory is a package ready for
a new session to pick up.

**Output:** A directory containing `seed/` and a
`CLAUDE.md` that tells the next entity what to do.

## Phase 4: Initialize

Performed as the first action in the target directory,
by the entity that will do the work (typically a new
session).

**Input:** The seed directory and the CLAUDE.md
instructions.

**Process:**
- Read the seed contents and CLAUDE.md
- Create the git repository and remote
- Create the working repo structure from the seed
- Place documents at their proper locations
- Set up the projects directory
- Install working memory
- Decide what to do with reference code (use as-is,
  rebuild, or keep as reference)
- Create any tooling configuration needed
- Commit and push the initialized structure

**Output:** A working repo ready for its first project.

The initialization is itself the first project — it
produces a working environment and documents what
decisions were made during setup.

## Why This Separation

**Seed ≠ structure.** The seed is information. The repo
structure is a product of the initialization process.
The process can evolve. A future protocol might organize
repos differently while accepting the same seed format.

**Prepare is minimal.** The origin entity creates the
handoff point. The target entity makes all structural
decisions. This keeps the origin from imposing structure
on the target.

**Analysis stays in the origin.** The origin repo holds
the full analysis trail. The target gets only what it
needs to start. If deep context is needed, the origin
is always available as reference.

**Each phase is a clean handoff.** Analysis → seed is
extraction. Seed → prepare is packaging. Prepare →
initialize is creation. Each phase can be done by a
different entity or at a different time.

## Scaling

The protocol scales to the situation:

| Spawn type | Analysis depth | Seed contents |
|---|---|---|
| Major iteration (spl3→spl4) | Full critical analysis | Documents, code, memory |
| Tool extraction | Focused scope analysis | Tool code, relevant principles |
| Concern separation | Boundary analysis | Separated concern's assets |
| Experimental fork | Lightweight assessment | Starting point + hypothesis |

The phases are the same. The weight differs.

## This Version

First version, written during spl3 analysis. To be
tested by spl4's initialization. The protocol itself
evolves — each use may refine the phases, the seed
format, or the initialization process.
