#!/usr/bin/env node

/**
 * Mycelium CLI — unified interface over any capability.
 *
 * Usage:
 *   mycelium [--store folder|file] [--file <path>] <command> [args]
 *
 * Commands:
 *   ls <path>                 List context contents
 *   read <path>               Read record content
 *   flat <path>               Flatten context recursively
 *   create <path> [content]   Create record (text → file, no text → context)
 *     --stdin                 Read content from stdin
 *   delete <path>             Delete record or context
 *   roundtrip <src> <dest>    Copy folder structure into file store (interop proof)
 *   help                      Show this help
 */

import { Capability } from './types.js';
import { FolderCapability } from './folder.js';
import { FileCapability } from './file.js';
import { resolve } from 'node:path';

function parseArgs(argv: string[]) {
  let store = 'folder';
  let file = 'mycelium.json';
  const rest: string[] = [];
  let stdin = false;

  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === '--store' && argv[i + 1]) {
      store = argv[++i];
    } else if (argv[i] === '--file' && argv[i + 1]) {
      file = argv[++i];
    } else if (argv[i] === '--stdin') {
      stdin = true;
    } else {
      rest.push(argv[i]);
    }
  }

  return { store, file, stdin, command: rest[0], args: rest.slice(1) };
}

function makeCapability(store: string, file: string): Capability {
  if (store === 'file') {
    return new FileCapability(resolve(file));
  }
  return new FolderCapability(resolve('.'));
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

async function roundtrip(src: Capability, dest: Capability, path: string): Promise<number> {
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
  const { store, file, stdin, command, args } = parseArgs(process.argv.slice(2));
  const cap = makeCapability(store, file);

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

    case 'delete': {
      if (!args[0]) { console.error('Usage: mycelium delete <path>'); process.exit(1); }
      await cap.deleteRecord(args[0]);
      console.log(`Deleted: ${args[0]}`);
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

      // Verify: flatten both and compare
      const folderFlat = await folderCap.flatten('');
      const fileFlat = await fileCap.flatten('');

      if (folderFlat.length !== fileFlat.length) {
        console.error(`Mismatch: folder has ${folderFlat.length} records, file has ${fileFlat.length}`);
        process.exit(1);
      }

      let match = true;
      for (let i = 0; i < folderFlat.length; i++) {
        if (folderFlat[i].key !== fileFlat[i].key) {
          console.error(`Key mismatch: ${folderFlat[i].key} vs ${fileFlat[i].key}`);
          match = false;
        }
        if (folderFlat[i].size !== fileFlat[i].size) {
          console.error(`Size mismatch for ${folderFlat[i].key}: ${folderFlat[i].size} vs ${fileFlat[i].size}`);
          match = false;
        }
      }

      if (match) {
        console.log(`Verified: all ${folderFlat.length} records match.`);
      } else {
        process.exit(1);
      }
      break;
    }

    case 'help':
    default:
      console.log(`Mycelium — logical data model with pluggable capabilities

Usage: mycelium [options] <command> [args]

Options:
  --store folder|file   Select capability (default: folder)
  --file <path>         JSON file path for file-based store (default: mycelium.json)

Commands:
  ls <path>                 List context contents
  read <path>               Read record content
  flat <path>               Flatten context recursively
  create <path> [content]   Create record (text = file, no text = context)
    --stdin                 Read content from stdin
  delete <path>             Delete record or context
  roundtrip <folder> <json> Copy folder → file store, verify match
  help                      Show this help`);
  }
}

main().catch(err => {
  console.error(err.message);
  process.exit(1);
});
