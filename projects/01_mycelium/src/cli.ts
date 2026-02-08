#!/usr/bin/env node

import { init, createList, getLists, append, readRecord, readList, follow } from './store.js';
import { Reference } from './types.js';

const [,, command, ...args] = process.argv;

function parseRefs(args: string[]): { content: string; refs: Reference[] } {
  const refs: Reference[] = [];
  const contentParts: string[] = [];
  let i = 0;
  while (i < args.length) {
    if (args[i] === '--ref' && args[i + 1]) {
      const parts = args[i + 1].split(':');
      if (parts.length !== 2) {
        console.error(`Invalid ref format: ${args[i + 1]} (expected list:seq)`);
        process.exit(1);
      }
      refs.push({ list: parts[0], seq: parseInt(parts[1], 10) });
      i += 2;
    } else {
      contentParts.push(args[i]);
      i++;
    }
  }
  return { content: contentParts.join(' '), refs };
}

function help() {
  console.log(`mycelium — immutable list primitive

Commands:
  init                          Initialize a new store
  create <list>                 Create a new list
  append <list> <content...>    Append a record (--ref list:seq for references)
  read <list> [seq]             Read records (all or specific)
  lists                         Show all lists
  follow <list> <seq>           Follow cascading references
  help                          Show this help`);
}

try {
  switch (command) {
    case 'init':
      init();
      console.log('Initialized .mycelium store');
      break;

    case 'create':
      if (!args[0]) { console.error('Usage: mycelium create <list>'); process.exit(1); }
      createList(args[0]);
      console.log(`Created list: ${args[0]}`);
      break;

    case 'append': {
      if (!args[0] || !args[1]) {
        console.error('Usage: mycelium append <list> <content...> [--ref list:seq]');
        process.exit(1);
      }
      const listName = args[0];
      const { content, refs } = parseRefs(args.slice(1));
      const record = append(listName, content, refs);
      console.log(`${record.list}:${record.seq} [${record.hash.slice(0, 8)}]`);
      if (refs.length) {
        console.log(`  refs: ${refs.map(r => `${r.list}:${r.seq}`).join(', ')}`);
      }
      break;
    }

    case 'read':
      if (!args[0]) { console.error('Usage: mycelium read <list> [seq]'); process.exit(1); }
      if (args[1]) {
        const record = readRecord(args[0], parseInt(args[1], 10));
        console.log(`${record.list}:${record.seq} [${record.hash.slice(0, 8)}] ${record.timestamp}`);
        console.log(record.content);
        if (record.refs.length) {
          console.log(`  refs: ${record.refs.map(r => `${r.list}:${r.seq}`).join(', ')}`);
        }
      } else {
        const records = readList(args[0]);
        if (!records.length) { console.log('(empty list)'); break; }
        for (const r of records) {
          const preview = r.content.length > 72 ? r.content.slice(0, 72) + '...' : r.content;
          console.log(`  ${r.seq} [${r.hash.slice(0, 8)}] ${preview}`);
          if (r.refs.length) {
            console.log(`    refs: ${r.refs.map(ref => `${ref.list}:${ref.seq}`).join(', ')}`);
          }
        }
      }
      break;

    case 'lists': {
      const lists = getLists();
      if (!lists.length) { console.log('No lists'); break; }
      for (const l of lists) {
        console.log(`  ${l.name} (${l.count} records)`);
      }
      break;
    }

    case 'follow': {
      if (!args[0] || !args[1]) {
        console.error('Usage: mycelium follow <list> <seq>');
        process.exit(1);
      }
      const records = follow(args[0], parseInt(args[1], 10));
      for (const r of records) {
        const preview = r.content.length > 72 ? r.content.slice(0, 72) + '...' : r.content;
        console.log(`  ${r.list}:${r.seq} [${r.hash.slice(0, 8)}] ${preview}`);
        if (r.refs.length) {
          console.log(`    refs: ${r.refs.map(ref => `${ref.list}:${ref.seq}`).join(', ')}`);
        }
      }
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
} catch (err: any) {
  console.error(err.message);
  process.exit(1);
}
