#!/usr/bin/env node

import { readContext, readRecord, flatten, createRecord, deleteRecord } from './fs.js';
import { resolve } from 'path';
import { statSync } from 'fs';

const [,, command, ...args] = process.argv;

function help() {
  console.log(`mycelium — filesystem as context/record primitive

Commands:
  ls <key>              List records in a context
  read <key>            Read a record (file content or context listing)
  flat <key>            Flatten a context — all files with relative path keys
  create <key> [text]   Create a record (text → file, no text → context)
  delete <key>          Delete a record
  help                  Show this help

Content from stdin:  echo "data" | mycelium create <key> --stdin`);
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes}B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}K`;
  return `${(bytes / (1024 * 1024)).toFixed(1)}M`;
}

async function main() {
  switch (command) {
    case 'ls': {
      const target = args[0] || '.';
      const ctx = readContext(target);
      if (!ctx.records.length) { console.log('(empty context)'); break; }
      for (const r of ctx.records) {
        const sizeLabel = r.type === 'context' ? `${r.size} items` : formatSize(r.size);
        const marker = r.type === 'context' ? '/' : '';
        console.log(`  ${r.key}${marker}  (${sizeLabel})`);
      }
      break;
    }

    case 'read': {
      if (!args[0]) { console.error('Usage: mycelium read <path>'); process.exit(1); }
      const target = resolve(args[0]);
      const stat = statSync(target);

      if (stat.isDirectory()) {
        const keys = readRecord(target) as string[];
        for (const k of keys) console.log(`  ${k}`);
      } else {
        const content = readRecord(target) as Buffer;
        process.stdout.write(content);
      }
      break;
    }

    case 'flat': {
      const target = args[0] || '.';
      const records = flatten(target);
      if (!records.length) { console.log('(empty)'); break; }
      for (const r of records) {
        console.log(`  ${r.key}  (${formatSize(r.size)})`);
      }
      console.log(`\n  ${records.length} records`);
      break;
    }

    case 'create': {
      if (!args[0]) { console.error('Usage: mycelium create <key> [text]'); process.exit(1); }
      const key = args[0];
      if (args.includes('--stdin')) {
        const chunks: Buffer[] = [];
        for await (const chunk of process.stdin) chunks.push(chunk);
        createRecord(key, Buffer.concat(chunks));
      } else if (args.length > 1 && args[1] !== '--stdin') {
        createRecord(key, Buffer.from(args.slice(1).join(' ')));
      } else {
        createRecord(key);
        console.log(`Created context: ${key}`);
        break;
      }
      console.log(`Created record: ${key}`);
      break;
    }

    case 'delete': {
      if (!args[0]) { console.error('Usage: mycelium delete <key>'); process.exit(1); }
      deleteRecord(args[0]);
      console.log(`Deleted: ${args[0]}`);
      break;
    }

    case 'help':
    case undefined:
      help();
      break;

    default:
      console.error(`Unknown command: ${command}`);
      help();
      process.exit(1);
  }
}

main().catch((err: any) => {
  console.error(err.message);
  process.exit(1);
});
