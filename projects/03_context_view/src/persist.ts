import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';
import { RepoContext, ProjectInfo } from './scan.js';
import { extractSection } from './markdown.js';

const CONTEXT_FILE = 'CONTEXT.md';
const TIMELINE_START = '<!-- TIMELINE:START -->';
const TIMELINE_END = '<!-- TIMELINE:END -->';
const ENTRY_START = (key: string) => `<!-- ENTRY:${key}:START -->`;
const ENTRY_END = (key: string) => `<!-- ENTRY:${key}:END -->`;

/** Render an immutable project entry */
function renderProjectEntry(project: ProjectInfo): string {
  const lines: string[] = [];
  lines.push(`### ${project.key}`);
  lines.push('');

  const sourceFiles = project.files.filter(f =>
    !f.startsWith('.') || f === '.gitignore'
  );
  lines.push(`Files: ${sourceFiles.join(', ')}`);
  lines.push('');

  if (project.evaluation) {
    const learned = extractSection(project.evaluation, 'What We Learned')
      || extractSection(project.evaluation, 'What We Confirmed');
    if (learned) {
      lines.push('Learnings:');
      for (const line of learned.split('\n')) {
        if (line.startsWith('### ')) {
          lines.push(`- ${line.replace('### ', '').replace(/^\d+\.\s*/, '')}`);
        }
      }
      lines.push('');
    }

    const primitive = extractSection(project.evaluation, 'The Primitive');
    const carry = extractSection(project.evaluation, 'Carry Forward');
    const summary = primitive || carry;
    if (summary) {
      for (const line of summary.split('\n')) {
        if (line.trim()) lines.push(line.trim());
      }
      lines.push('');
    }

    const external = extractSection(project.evaluation, 'Changes Outside');
    if (external && !external.includes('None')) {
      lines.push('External changes:');
      for (const line of external.split('\n')) {
        if (line.trim().startsWith('-')) lines.push(line.trim());
      }
      lines.push('');
    }
  }

  return lines.join('\n').trimEnd();
}

/** Render the mutable state section */
function renderState(ctx: RepoContext): string {
  const lines: string[] = [];

  lines.push('## State');
  lines.push('');

  // Root docs
  lines.push('Documents:');
  for (const doc of ctx.rootDocs) {
    lines.push(`- ${doc.key} — ${doc.firstLine}`);
  }
  lines.push('');

  // In-progress projects (no evaluation)
  const inProgress = ctx.projects.filter(p => !p.evaluation);
  if (inProgress.length) {
    lines.push('In progress:');
    for (const p of inProgress) {
      const sourceFiles = p.files.filter(f =>
        !f.startsWith('.') || f === '.gitignore'
      );
      lines.push(`- ${p.key} (${sourceFiles.length} files)`);
    }
    lines.push('');
  }

  return lines.join('\n').trimEnd();
}

/** Parse existing CONTEXT.md to find which projects are already recorded */
function parseExistingEntries(content: string): Set<string> {
  const keys = new Set<string>();
  const pattern = /<!-- ENTRY:(.+?):START -->/g;
  let match;
  while ((match = pattern.exec(content)) !== null) {
    keys.add(match[1]);
  }
  return keys;
}

/** Extract the immutable timeline section from existing file */
function extractTimeline(content: string): string {
  const startIdx = content.indexOf(TIMELINE_START);
  const endIdx = content.indexOf(TIMELINE_END);
  if (startIdx === -1 || endIdx === -1) return '';
  return content.slice(
    startIdx + TIMELINE_START.length,
    endIdx
  ).trimEnd();
}

/** Generate or update CONTEXT.md */
export function persist(ctx: RepoContext): { path: string; added: string[] } {
  const contextPath = join(ctx.root, CONTEXT_FILE);
  const completedProjects = ctx.projects.filter(p => p.evaluation);
  const added: string[] = [];

  // Build the existing timeline or start fresh
  let timeline = '';
  let existingKeys = new Set<string>();

  if (existsSync(contextPath)) {
    const existing = readFileSync(contextPath, 'utf-8');
    existingKeys = parseExistingEntries(existing);
    timeline = extractTimeline(existing);
  }

  // Append new completed projects
  for (const project of completedProjects) {
    if (!existingKeys.has(project.key)) {
      const entry = [
        '',
        ENTRY_START(project.key),
        renderProjectEntry(project),
        ENTRY_END(project.key),
      ].join('\n');
      timeline += entry;
      added.push(project.key);
    }
  }

  // Assemble the full file: mutable state + immutable timeline
  const output = [
    '# Context',
    '',
    renderState(ctx),
    '',
    '## Timeline',
    '',
    TIMELINE_START,
    timeline,
    '',
    TIMELINE_END,
    '',
  ].join('\n');

  writeFileSync(contextPath, output);
  return { path: contextPath, added };
}
