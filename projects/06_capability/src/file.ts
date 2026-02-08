/**
 * File-based capability.
 *
 * Binds the logical model to a single JSON file:
 *   context = nested object, file record = base64 entry.
 *
 * Structure:
 * {
 *   "children": {
 *     "readme.md": { "type": "file", "content": "<base64>" },
 *     "src": {
 *       "type": "context",
 *       "children": { ... }
 *     }
 *   }
 * }
 */

import { readFile, writeFile } from 'node:fs/promises';
import type { Capability, Context, FlatRecord, Record } from './types.js';

interface FileNode {
  type: 'file';
  content: string; // base64
}

interface ContextNode {
  type: 'context';
  children: { [key: string]: FileNode | ContextNode };
}

interface StoreRoot {
  children: { [key: string]: FileNode | ContextNode };
}

export class FileCapability implements Capability {
  constructor(private filePath: string) {}

  private async load(): Promise<StoreRoot> {
    try {
      const raw = await readFile(this.filePath, 'utf-8');
      return JSON.parse(raw) as StoreRoot;
    } catch {
      return { children: {} };
    }
  }

  private async save(root: StoreRoot): Promise<void> {
    await writeFile(this.filePath, JSON.stringify(root, null, 2));
  }

  private navigate(root: StoreRoot, path: string): StoreRoot | ContextNode | FileNode | null {
    if (path === '' || path === '.') return root;
    const parts = path.split('/').filter(Boolean);
    let current: StoreRoot | ContextNode = root;
    for (const part of parts) {
      const children: { [key: string]: FileNode | ContextNode } = current.children;
      if (!(part in children)) return null;
      const node: FileNode | ContextNode = children[part];
      if (node.type === 'file') {
        return part === parts[parts.length - 1] ? node : null;
      }
      current = node;
    }
    return current;
  }

  private parentAndKey(path: string): { parentPath: string; key: string } {
    const parts = path.split('/').filter(Boolean);
    const key = parts.pop()!;
    return { parentPath: parts.join('/'), key };
  }

  async readContext(path: string): Promise<Context> {
    const root = await this.load();
    const node = this.navigate(root, path);
    if (!node || !('children' in node)) {
      throw new Error(`Not a context: ${path}`);
    }

    const records: Record[] = [];
    for (const [key, child] of Object.entries(node.children)) {
      if (child.type === 'file') {
        const size = Buffer.from(child.content, 'base64').length;
        records.push({ key, type: 'file', size });
      } else {
        records.push({ key, type: 'context', size: Object.keys(child.children).length });
      }
    }

    return { path, records };
  }

  async readRecord(path: string): Promise<Buffer> {
    const root = await this.load();
    const node = this.navigate(root, path);
    if (!node || !('content' in node)) {
      throw new Error(`Not a file record: ${path}`);
    }
    return Buffer.from(node.content, 'base64');
  }

  async flatten(path: string): Promise<FlatRecord[]> {
    const root = await this.load();
    const node = this.navigate(root, path);
    if (!node || !('children' in node)) {
      throw new Error(`Not a context: ${path}`);
    }

    const result: FlatRecord[] = [];

    function walk(n: StoreRoot | ContextNode, prefix: string) {
      for (const [key, child] of Object.entries(n.children)) {
        const full = prefix ? `${prefix}/${key}` : key;
        if (child.type === 'file') {
          result.push({ key: full, size: Buffer.from(child.content, 'base64').length });
        } else {
          walk(child, full);
        }
      }
    }

    walk(node, '');
    return result.sort((a, b) => a.key.localeCompare(b.key));
  }

  async createRecord(path: string, content?: Buffer): Promise<void> {
    const root = await this.load();
    const { parentPath, key } = this.parentAndKey(path);

    // Ensure parent exists
    const parts = parentPath.split('/').filter(Boolean);
    let current: StoreRoot | ContextNode = root;
    for (const part of parts) {
      if (!current.children[part]) {
        current.children[part] = { type: 'context', children: {} };
      }
      const node: FileNode | ContextNode = current.children[part];
      if (node.type === 'file') throw new Error(`Path conflict: ${part} is a file`);
      current = node;
    }

    if (content !== undefined) {
      current.children[key] = { type: 'file', content: content.toString('base64') };
    } else {
      current.children[key] = { type: 'context', children: {} };
    }

    await this.save(root);
  }

  async deleteRecord(path: string): Promise<void> {
    const root = await this.load();
    const { parentPath, key } = this.parentAndKey(path);

    const parent = this.navigate(root, parentPath);
    if (!parent || !('children' in parent)) {
      throw new Error(`Parent not found: ${parentPath}`);
    }

    delete parent.children[key];
    await this.save(root);
  }
}
