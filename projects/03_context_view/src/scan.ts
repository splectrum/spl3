import { readdirSync, statSync, readFileSync, existsSync } from 'fs';
import { join, resolve } from 'path';

export interface ProjectInfo {
  key: string;
  files: string[];
  evaluation: string | null;
}

export interface RepoContext {
  root: string;
  rootDocs: { key: string; firstLine: string }[];
  projects: ProjectInfo[];
}

/** Find repo root by walking up looking for CLAUDE.md */
function findRoot(from: string): string {
  let dir = resolve(from);
  while (true) {
    if (existsSync(join(dir, 'CLAUDE.md'))) return dir;
    const parent = resolve(dir, '..');
    if (parent === dir) throw new Error('Not in a splectrum repo (no CLAUDE.md found)');
    dir = parent;
  }
}

/** Get first non-empty line of a file */
function firstLine(filePath: string): string {
  const content = readFileSync(filePath, 'utf-8');
  for (const line of content.split('\n')) {
    const trimmed = line.trim();
    if (trimmed) return trimmed;
  }
  return '(empty)';
}

/** List source files in a project (excludes node_modules, dist, .git) */
function listSourceFiles(dir: string): string[] {
  const skip = new Set(['node_modules', 'dist', '.git']);
  const results: string[] = [];

  function walk(d: string, prefix: string) {
    for (const entry of readdirSync(d)) {
      if (skip.has(entry)) continue;
      const full = join(d, entry);
      const rel = prefix ? `${prefix}/${entry}` : entry;
      if (statSync(full).isDirectory()) {
        walk(full, rel);
      } else {
        results.push(rel);
      }
    }
  }

  walk(dir, '');
  return results;
}

/** Scan the repo and build a context summary */
export function scan(from: string = process.cwd()): RepoContext {
  const root = findRoot(from);

  // Root-level docs
  const rootEntries = readdirSync(root).filter(e => e.endsWith('.md'));
  const rootDocs = rootEntries.map(key => ({
    key,
    firstLine: firstLine(join(root, key)),
  }));

  // Projects
  const projectsDir = join(root, 'projects');
  const projects: ProjectInfo[] = [];

  if (existsSync(projectsDir)) {
    const entries = readdirSync(projectsDir).sort();
    for (const entry of entries) {
      const projectDir = join(projectsDir, entry);
      if (!statSync(projectDir).isDirectory()) continue;

      const evalPath = join(projectDir, 'EVALUATION.md');
      projects.push({
        key: entry,
        files: listSourceFiles(projectDir),
        evaluation: existsSync(evalPath)
          ? readFileSync(evalPath, 'utf-8')
          : null,
      });
    }
  }

  return { root, rootDocs, projects };
}
