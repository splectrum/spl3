#!/usr/bin/env node

/**
 * Mycelium CLI — immutable and mutable operations with tracking.
 *
 * Usage:
 *   mycelium [options] <command> [args]
 *
 * Options:
 *   --store folder|file       Select capability (default: folder)
 *   --file <path>             JSON file for file-based store
 *   --mode log-first|resource-first  Changelog causality (default: resource-first)
 *
 * Commands:
 *   ls <path>                 List context contents
 *   read <path>               Read record content
 *   flat <path>               Flatten context recursively
 *   create <path> [content]   Create record (tracked if content provided)
 *     --stdin                 Read content from stdin
 *   write <path> <content>    Overwrite record (tracked)
 *     --stdin                 Read content from stdin
 *   delete <path>             Delete record (bin or permanent)
 *   log <path>                Show changelog for a record or context
 *   roundtrip <src> <dest>    Copy folder → file store, verify match
 *   help                      Show this help
 */

import type { MutableCapability } from './types.js';
import { FolderCapability } from './folder.js';
import { FileCapability } from './file.js';
import { TrackedCapability, type CausalityMode } from './tracked.js';
import { resolve } from 'node:path';

function parseArgs(argv: string[]) {
  let store = 'folder';
  let file = 'mycelium.json';
  let mode: CausalityMode = 'resource-first';
  const rest: string[] = [];
  let stdin = false;

  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === '--store' && argv[i + 1]) {
      store = argv[++i];
    } else if (argv[i] === '--file' && argv[i + 1]) {
      file = argv[++i];
    } else if (argv[i] === '--mode' && argv[i + 1]) {
      mode = argv[++i] as CausalityMode;
    } else if (argv[i] === '--stdin') {
      stdin = true;
    } else {
      rest.push(argv[i]);
    }
  }

  return { store, file, mode, stdin, command: rest[0], args: rest.slice(1) };
}

function makeCapability(store: string, file: string, mode: CausalityMode): TrackedCapability {
  const inner: MutableCapability = store === 'file'
    ? new FileCapability(resolve(file))
    : new FolderCapability(resolve('.'));
  return new TrackedCapability(inner, mode);
}

function formatSize(size: number, type: string): string {
  if (type === 'context') return `${size} items`;
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}

async function readStdin(): Promise<Buffer> {
  const chunks: Buffer[] = [];
  for await (const chunk of process.stdin) {
    chunks.push(chunk);
  }
  return Buffer.concat(chunks);
}

async function roundtrip(
  src: MutableCapability,
  dest: MutableCapability,
  path: string,
): Promise<number> {
  const ctx = await src.readContext(path);
  let count = 0;

  for (const rec of ctx.records) {
    const recPath = path ? `${path}/${rec.key}` : rec.key;
    if (rec.type === 'file') {
      const content = await src.readRecord(recPath);
      await dest.createRecord(recPath, content);
      count++;
    } else {
      await dest.createRecord(recPath);
      count += await roundtrip(src, dest, recPath);
    }
  }

  return count;
}

async function main() {
  const { store, file, mode, stdin, command, args } = parseArgs(process.argv.slice(2));
  const cap = makeCapability(store, file, mode);

  switch (command) {
    case 'ls': {
      const path = args[0] || '.';
      const ctx = await cap.readContext(path);
      for (const r of ctx.records) {
        const suffix = r.type === 'context' ? '/' : '';
        console.log(`${r.key}${suffix}  (${formatSize(r.size, r.type)})`);
      }
      break;
    }

    case 'read': {
      if (!args[0]) { console.error('Usage: mycelium read <path>'); process.exit(1); }
      const buf = await cap.readRecord(args[0]);
      process.stdout.write(buf);
      break;
    }

    case 'flat': {
      const path = args[0] || '.';
      const records = await cap.flatten(path);
      for (const r of records) {
        console.log(`${r.key}  (${formatSize(r.size, 'file')})`);
      }
      break;
    }

    case 'create': {
      if (!args[0]) { console.error('Usage: mycelium create <path> [content]'); process.exit(1); }
      let content: Buffer | undefined;
      if (stdin) {
        content = await readStdin();
      } else if (args[1]) {
        content = Buffer.from(args.slice(1).join(' '));
      }
      await cap.createRecord(args[0], content);
      console.log(content !== undefined ? `Created file: ${args[0]}` : `Created context: ${args[0]}`);
      break;
    }

    case 'write': {
      if (!args[0]) { console.error('Usage: mycelium write <path> <content>'); process.exit(1); }
      let content: Buffer;
      if (stdin) {
        content = await readStdin();
      } else if (args[1]) {
        content = Buffer.from(args.slice(1).join(' '));
      } else {
        console.error('Usage: mycelium write <path> <content>');
        process.exit(1);
      }
      await cap.writeRecord(args[0], content);
      console.log(`Written: ${args[0]}`);
      break;
    }

    case 'delete': {
      if (!args[0]) { console.error('Usage: mycelium delete <path>'); process.exit(1); }
      await cap.deleteRecord(args[0]);
      console.log(`Deleted: ${args[0]}`);
      break;
    }

    case 'log': {
      if (!args[0]) { console.error('Usage: mycelium log <path>'); process.exit(1); }
      // Try as record first, fall back to context
      try {
        const entries = await cap.readLog(args[0]);
        for (const e of entries) {
          console.log(`${e.timestamp}\t${e.operation}\t${e.fingerprint}`);
        }
      } catch {
        // Try as context (cascading read)
        const entries = await cap.readContextLog(args[0]);
        for (const e of entries) {
          console.log(`${e.timestamp}\t${e.key}\t${e.operation}\t${e.fingerprint}`);
        }
      }
      break;
    }

    case 'roundtrip': {
      if (!args[0] || !args[1]) {
        console.error('Usage: mycelium roundtrip <folder-path> <json-file>');
        process.exit(1);
      }
      const folderCap = new FolderCapability(resolve(args[0]));
      const fileCap = new FileCapability(resolve(args[1]));

      const count = await roundtrip(folderCap, fileCap, '');
      console.log(`Copied ${count} records from folder to file store.`);

      const folderFlat = await folderCap.flatten('');
      const fileFlat = await fileCap.flatten('');

      if (folderFlat.length !== fileFlat.length) {
        console.error(`Mismatch: folder has ${folderFlat.length}, file has ${fileFlat.length}`);
        process.exit(1);
      }

      let match = true;
      for (let i = 0; i < folderFlat.length; i++) {
        if (folderFlat[i].key !== fileFlat[i].key || folderFlat[i].size !== fileFlat[i].size) {
          console.error(`Mismatch at ${folderFlat[i].key}`);
          match = false;
        }
      }

      console.log(match
        ? `Verified: all ${folderFlat.length} records match.`
        : 'Verification failed.');
      if (!match) process.exit(1);
      break;
    }

    case 'help':
    default:
      console.log(`Mycelium — immutable and mutable operations with change tracking

Usage: mycelium [options] <command> [args]

Options:
  --store folder|file              Select capability (default: folder)
  --file <path>                    JSON file for file-based store
  --mode log-first|resource-first  Changelog causality (default: resource-first)

Commands:
  ls <path>                 List context contents
  read <path>               Read record content
  flat <path>               Flatten context recursively
  create <path> [content]   Create record (tracked if file)
    --stdin                 Read content from stdin
  write <path> <content>    Overwrite record (tracked)
    --stdin                 Read content from stdin
  delete <path>             Delete record (and its changelog)
  log <path>                Show changelog (record or context)
  roundtrip <folder> <json> Copy folder → file store, verify match
  help                      Show this help`);
  }
}

main().catch(err => {
  console.error(err.message);
  process.exit(1);
});
