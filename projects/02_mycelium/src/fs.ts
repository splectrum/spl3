import { readdirSync, statSync, readFileSync, writeFileSync, mkdirSync, rmSync, existsSync } from 'fs';
import { join, resolve, relative } from 'path';
import { Record, Context } from './types.js';

/** Read a context (folder) and return its records. */
export function readContext(dirPath: string): Context {
  const abs = resolve(dirPath);
  const entries = readdirSync(abs);
  const records: Record[] = [];

  for (const entry of entries) {
    const full = join(abs, entry);
    const stat = statSync(full);
    records.push({
      key: entry,
      type: stat.isDirectory() ? 'context' : 'file',
      size: stat.isDirectory() ? readdirSync(full).length : stat.size,
    });
  }

  return { path: abs, records };
}

/** Read a record's content (file → bytes, context → list of keys). */
export function readRecord(recordPath: string): Buffer | string[] {
  const abs = resolve(recordPath);
  const stat = statSync(abs);

  if (stat.isDirectory()) {
    return readdirSync(abs);
  }
  return readFileSync(abs);
}

/** Flatten a context recursively — all files as records with relative path keys. */
export function flatten(dirPath: string): { key: string; size: number }[] {
  const abs = resolve(dirPath);
  const results: { key: string; size: number }[] = [];

  function walk(dir: string) {
    const entries = readdirSync(dir);
    for (const entry of entries) {
      const full = join(dir, entry);
      const stat = statSync(full);
      if (stat.isDirectory()) {
        walk(full);
      } else {
        results.push({
          key: relative(abs, full),
          size: stat.size,
        });
      }
    }
  }

  walk(abs);
  return results;
}

/** Create a record. Content → file record. No content → context (folder). */
export function createRecord(recordPath: string, content?: Buffer): void {
  const abs = resolve(recordPath);
  if (existsSync(abs)) throw new Error(`Already exists: ${recordPath}`);
  if (content) {
    writeFileSync(abs, content);
  } else {
    mkdirSync(abs);
  }
}

/** Delete a record (file or context). */
export function deleteRecord(recordPath: string): void {
  const abs = resolve(recordPath);
  if (!existsSync(abs)) throw new Error(`Not found: ${recordPath}`);
  rmSync(abs, { recursive: true });
}
