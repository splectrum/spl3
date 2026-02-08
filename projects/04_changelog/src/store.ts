import { existsSync, mkdirSync, writeFileSync, readFileSync, readdirSync } from 'fs';
import { join, dirname, basename, resolve } from 'path';

export interface ChangeEntry {
  seq: number;
  timestamp: string;
  operation: 'write' | 'append';
  encoding: 'utf-8' | 'base64';
  content: string;
}

/** Get the changelog directory for a given file */
export function changelogDir(filePath: string): string {
  const abs = resolve(filePath);
  return join(dirname(abs), '.changelog', basename(abs));
}

/** Ensure the changelog directory exists */
function ensureDir(dir: string): void {
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
}

/** Get the next sequence number */
function nextSeq(dir: string): number {
  if (!existsSync(dir)) return 1;
  const entries = readdirSync(dir).filter(f => f.endsWith('.json'));
  return entries.length + 1;
}

/** Check if a buffer is valid UTF-8 text */
function isText(buf: Buffer): boolean {
  const str = buf.toString('utf-8');
  return Buffer.from(str, 'utf-8').equals(buf) && !/[\x00-\x08\x0E-\x1F]/.test(str);
}

/** Record a change entry */
export function record(filePath: string, operation: 'write' | 'append', buf: Buffer): ChangeEntry {
  const dir = changelogDir(filePath);
  ensureDir(dir);

  const seq = nextSeq(dir);
  const encoding = isText(buf) ? 'utf-8' as const : 'base64' as const;
  const entry: ChangeEntry = {
    seq,
    timestamp: new Date().toISOString(),
    operation,
    encoding,
    content: encoding === 'utf-8' ? buf.toString('utf-8') : buf.toString('base64'),
  };

  const filename = String(seq).padStart(6, '0') + '.json';
  writeFileSync(join(dir, filename), JSON.stringify(entry, null, 2));
  return entry;
}

/** Apply a write: replace file content and record the change */
export function applyWrite(filePath: string, buf: Buffer): ChangeEntry {
  const abs = resolve(filePath);
  writeFileSync(abs, buf);
  return record(abs, 'write', buf);
}

/** Apply an append: append to file and record the change */
export function applyAppend(filePath: string, buf: Buffer): ChangeEntry {
  const abs = resolve(filePath);
  const existing = existsSync(abs) ? readFileSync(abs) : Buffer.alloc(0);
  writeFileSync(abs, Buffer.concat([existing, buf]));
  return record(abs, 'append', buf);
}

/** Read all change entries for a file */
export function readLog(filePath: string): ChangeEntry[] {
  const dir = changelogDir(resolve(filePath));
  if (!existsSync(dir)) return [];
  return readdirSync(dir)
    .filter(f => f.endsWith('.json'))
    .sort()
    .map(f => JSON.parse(readFileSync(join(dir, f), 'utf-8')));
}
