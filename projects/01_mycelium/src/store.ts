import { createHash } from 'crypto';
import { existsSync, mkdirSync, writeFileSync, readFileSync, readdirSync } from 'fs';
import { join, resolve } from 'path';
import { Record, Reference, ListMeta } from './types.js';

const STORE_DIR = '.mycelium';

export function findRoot(from: string = process.cwd()): string | null {
  let dir = resolve(from);
  while (true) {
    if (existsSync(join(dir, STORE_DIR))) return dir;
    const parent = resolve(dir, '..');
    if (parent === dir) return null;
    dir = parent;
  }
}

function storePath(root: string): string {
  return join(root, STORE_DIR);
}

function requireRoot(): string {
  const root = findRoot();
  if (!root) throw new Error('Not initialized. Run: mycelium init');
  return root;
}

export function init(dir: string = process.cwd()): string {
  const store = join(dir, STORE_DIR);
  if (existsSync(store)) throw new Error('Already initialized');
  mkdirSync(join(store, 'lists'), { recursive: true });
  return store;
}

export function createList(name: string): ListMeta {
  const root = requireRoot();
  const listDir = join(storePath(root), 'lists', name);
  if (existsSync(listDir)) throw new Error(`List "${name}" already exists`);
  mkdirSync(join(listDir, 'records'), { recursive: true });
  const meta: ListMeta = { name, created: new Date().toISOString(), count: 0 };
  writeFileSync(join(listDir, 'meta.json'), JSON.stringify(meta, null, 2));
  return meta;
}

export function getLists(): ListMeta[] {
  const root = requireRoot();
  const listsDir = join(storePath(root), 'lists');
  if (!existsSync(listsDir)) return [];
  return readdirSync(listsDir)
    .filter(name => existsSync(join(listsDir, name, 'meta.json')))
    .sort()
    .map(name => JSON.parse(readFileSync(join(listsDir, name, 'meta.json'), 'utf-8')));
}

function computeHash(list: string, seq: number, timestamp: string, content: string, refs: Reference[]): string {
  const data = JSON.stringify({ list, seq, timestamp, content, refs });
  return createHash('sha256').update(data).digest('hex');
}

export function append(listName: string, content: string, refs: Reference[] = []): Record {
  const root = requireRoot();
  const listDir = join(storePath(root), 'lists', listName);
  if (!existsSync(listDir)) throw new Error(`List "${listName}" does not exist`);

  const metaPath = join(listDir, 'meta.json');
  const meta: ListMeta = JSON.parse(readFileSync(metaPath, 'utf-8'));
  const seq = meta.count + 1;
  const timestamp = new Date().toISOString();
  const hash = computeHash(listName, seq, timestamp, content, refs);

  const record: Record = { list: listName, seq, hash, timestamp, content, refs };
  const filename = String(seq).padStart(6, '0') + '.json';
  writeFileSync(join(listDir, 'records', filename), JSON.stringify(record, null, 2));

  meta.count = seq;
  writeFileSync(metaPath, JSON.stringify(meta, null, 2));

  return record;
}

export function readRecord(listName: string, seq: number): Record {
  const root = requireRoot();
  const filename = String(seq).padStart(6, '0') + '.json';
  const recordPath = join(storePath(root), 'lists', listName, 'records', filename);
  if (!existsSync(recordPath)) throw new Error(`Record ${listName}:${seq} not found`);
  return JSON.parse(readFileSync(recordPath, 'utf-8'));
}

export function readList(listName: string): Record[] {
  const root = requireRoot();
  const recordsDir = join(storePath(root), 'lists', listName, 'records');
  if (!existsSync(recordsDir)) throw new Error(`List "${listName}" does not exist`);
  return readdirSync(recordsDir)
    .filter(f => f.endsWith('.json'))
    .sort()
    .map(f => JSON.parse(readFileSync(join(recordsDir, f), 'utf-8')));
}

export function follow(listName: string, seq: number, depth: number = 5): Record[] {
  const visited = new Set<string>();
  const result: Record[] = [];

  function walk(list: string, s: number, d: number) {
    const key = `${list}:${s}`;
    if (visited.has(key) || d < 0) return;
    visited.add(key);
    try {
      const record = readRecord(list, s);
      result.push(record);
      for (const ref of record.refs) {
        walk(ref.list, ref.seq, d - 1);
      }
    } catch {
      // referenced record doesn't exist, skip
    }
  }

  walk(listName, seq, depth);
  return result;
}
