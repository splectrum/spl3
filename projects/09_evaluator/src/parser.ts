/**
 * Requirements parser — extracts Requirement objects
 * from a REQUIREMENTS.md file.
 */

import { Requirement } from './types.js';

/**
 * Parse a REQUIREMENTS.md file into Requirement objects.
 *
 * Requirements: ### R{n}: {title} headings
 * Quality gates: ## Quality Gates section, bulleted list
 */
export function parseRequirements(markdown: string): Requirement[] {
  const requirements: Requirement[] = [];
  const lines = markdown.split('\n');

  // Extract requirements (### R{n}: {title})
  let current: { id: string; title: string; textLines: string[] } | null = null;

  for (const line of lines) {
    const reqMatch = line.match(/^### (R\d+):\s*(.+)/);
    if (reqMatch) {
      if (current) {
        requirements.push({
          id: current.id,
          title: current.title,
          text: current.textLines.join('\n').trim(),
          gates: [],
        });
      }
      current = { id: reqMatch[1], title: reqMatch[2].trim(), textLines: [] };
      continue;
    }

    // Stop current requirement at next ## heading
    if (line.match(/^## /)) {
      if (current) {
        requirements.push({
          id: current.id,
          title: current.title,
          text: current.textLines.join('\n').trim(),
          gates: [],
        });
        current = null;
      }
    }

    if (current) {
      current.textLines.push(line);
    }
  }

  if (current) {
    requirements.push({
      id: current.id,
      title: current.title,
      text: current.textLines.join('\n').trim(),
      gates: [],
    });
  }

  // Extract quality gates (## Quality Gates section)
  const gates = parseGates(lines);

  // Associate gates with requirements by matching
  for (const gate of gates) {
    const matched = matchGateToRequirement(gate, requirements);
    if (matched) {
      matched.gates.push(gate);
    } else {
      // Unmatched gates go to the first requirement as fallback
      if (requirements.length > 0) {
        requirements[0].gates.push(gate);
      }
    }
  }

  return requirements;
}

function parseGates(lines: string[]): string[] {
  const gates: string[] = [];
  let inGates = false;

  for (const line of lines) {
    if (line.match(/^## Quality Gates/)) {
      inGates = true;
      continue;
    }
    if (inGates && line.match(/^## /)) {
      break;
    }
    if (inGates) {
      const bulletMatch = line.match(/^- (.+)/);
      if (bulletMatch) {
        gates.push(bulletMatch[1].trim());
      }
    }
  }

  return gates;
}

function matchGateToRequirement(
  gate: string,
  requirements: Requirement[]
): Requirement | null {
  const gateLower = gate.toLowerCase();

  // Try to match by keywords from requirement title or id
  for (const req of requirements) {
    const titleWords = req.title.toLowerCase().split(/\s+/);
    // Match if multiple title words appear in the gate
    const matches = titleWords.filter(
      (w) => w.length > 3 && gateLower.includes(w)
    );
    if (matches.length >= 2) {
      return req;
    }
  }

  // Try single significant keyword match
  for (const req of requirements) {
    const titleWords = req.title.toLowerCase().split(/\s+/);
    const significantWords = titleWords.filter((w) => w.length > 4);
    for (const word of significantWords) {
      if (gateLower.includes(word)) {
        return req;
      }
    }
  }

  return null;
}
