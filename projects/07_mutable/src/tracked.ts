/**
 * Tracked capability wrapper.
 *
 * Wraps any MutableCapability and adds:
 * - Changelog as sibling record ({key}.changelog)
 * - Two causality modes (log-first, resource-first)
 * - Cascading changelog read
 */

import { createHash } from 'node:crypto';
import type { MutableCapability, Context, FlatRecord, ChangelogEntry } from './types.js';

export type CausalityMode = 'log-first' | 'resource-first';

function fingerprint(content: Buffer): string {
  return createHash('sha256').update(content).digest('hex').slice(0, 8);
}

function formatEntry(timestamp: string, operation: string, fp: string): string {
  return `${timestamp}\t${operation}\t${fp}\n`;
}

export function parseChangelog(raw: string, key: string): ChangelogEntry[] {
  return raw.split('\n').filter(Boolean).map(line => {
    const [timestamp, operation, fp] = line.split('\t');
    return {
      timestamp,
      operation: operation as ChangelogEntry['operation'],
      fingerprint: fp,
      key,
    };
  });
}

function changelogKey(path: string): string {
  return `${path}.changelog`;
}

function keyFromPath(path: string): string {
  const parts = path.split('/').filter(Boolean);
  return parts[parts.length - 1];
}

export class TrackedCapability implements MutableCapability {
  constructor(
    private inner: MutableCapability,
    private mode: CausalityMode = 'resource-first',
  ) {}

  // --- Pass-through immutable operations ---

  readContext(path: string): Promise<Context> {
    return this.inner.readContext(path);
  }

  readRecord(path: string): Promise<Buffer> {
    return this.inner.readRecord(path);
  }

  flatten(path: string): Promise<FlatRecord[]> {
    return this.inner.flatten(path);
  }

  // --- Tracked operations ---

  async createRecord(path: string, content?: Buffer): Promise<void> {
    if (content !== undefined) {
      const fp = fingerprint(content);
      const clPath = changelogKey(path);
      const entry = formatEntry(new Date().toISOString(), 'created', fp);

      if (this.mode === 'log-first') {
        await this.inner.createRecord(clPath, Buffer.from(entry));
        await this.inner.createRecord(path, content);
      } else {
        await this.inner.createRecord(path, content);
        await this.inner.createRecord(clPath, Buffer.from(entry));
      }
    } else {
      // Context creation — no changelog
      await this.inner.createRecord(path);
    }
  }

  async writeRecord(path: string, content: Buffer): Promise<void> {
    const fp = fingerprint(content);
    const clPath = changelogKey(path);
    const entry = formatEntry(new Date().toISOString(), 'written', fp);

    // Append to existing changelog or create new one
    let existing = '';
    try {
      existing = (await this.inner.readRecord(clPath)).toString('utf-8');
    } catch {
      // No changelog yet — will create
    }
    const newLog = existing + entry;

    if (this.mode === 'log-first') {
      await this.writeOrCreate(clPath, Buffer.from(newLog));
      await this.inner.writeRecord(path, content);
    } else {
      await this.inner.writeRecord(path, content);
      await this.writeOrCreate(clPath, Buffer.from(newLog));
    }
  }

  async deleteRecord(path: string): Promise<void> {
    const clPath = changelogKey(path);

    // Delete record + its changelog
    await this.inner.deleteRecord(path);
    try {
      await this.inner.readRecord(clPath);
      await this.inner.deleteRecord(clPath);
    } catch {
      // No changelog
    }
  }

  // --- Changelog operations ---

  /** Read changelog for a single record. */
  async readLog(path: string): Promise<ChangelogEntry[]> {
    const clPath = changelogKey(path);
    const raw = (await this.inner.readRecord(clPath)).toString('utf-8');
    return parseChangelog(raw, keyFromPath(path));
  }

  /** Cascading changelog read — aggregate all changelogs in a context. */
  async readContextLog(path: string): Promise<ChangelogEntry[]> {
    const ctx = await this.inner.readContext(path);
    const entries: ChangelogEntry[] = [];
    const base = (path && path !== '.') ? path : '';

    for (const rec of ctx.records) {
      if (rec.type === 'file' && rec.key.endsWith('.changelog')) {
        const recPath = base ? `${base}/${rec.key}` : rec.key;
        const raw = (await this.inner.readRecord(recPath)).toString('utf-8');
        const ownerKey = rec.key.slice(0, -'.changelog'.length);
        entries.push(...parseChangelog(raw, ownerKey));
      }
    }

    return entries.sort((a, b) => a.timestamp.localeCompare(b.timestamp));
  }

  // --- Helpers ---

  private async writeOrCreate(path: string, content: Buffer): Promise<void> {
    try {
      await this.inner.writeRecord(path, content);
    } catch {
      await this.inner.createRecord(path, content);
    }
  }
}
