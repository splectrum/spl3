# 03_context_view — Requirements

## show

1. Lists all root-level .md documents with their first
   non-empty line as description.
2. Every project folder in projects/ appears in the output.
3. Completed projects (with EVALUATION.md) show all ###
   learnings as bullet points.
4. Completed projects show their summary (from "The Primitive"
   or "Carry Forward" evaluation sections).
5. External changes listed when present and non-trivial.
6. In-progress projects (no EVALUATION.md) clearly marked.

## sync

7. Creates CONTEXT.md at repo root if it doesn't exist.
8. State section regenerated on every run (mutable).
9. Completed projects appended to timeline once, never
   modified on subsequent runs (immutable).
10. Running sync twice produces the same file.
11. New completed projects detected and appended in order.
12. Each timeline entry includes: files, learnings, summary,
    and external changes where applicable.

## General

13. Runs without error on the current repo.
14. No proprietary storage or init step required.
15. Output is readable natural language.
