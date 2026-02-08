#!/usr/bin/env node

import { applyWrite, applyAppend, readLog } from './store.js';

const [,, command, ...args] = process.argv;

function help() {
  console.log(`change — file change tracking

Commands:
  apply <file> <content>     Write content to file, record the change
  append <file> <content>    Append content to file, record the change
  log <file>                 Show change history

Content from stdin:  echo "data" | change apply <file> --stdin`);
}

async function main() {
  switch (command) {
    case 'apply': {
      if (!args[0]) { console.error('Usage: change apply <file> <content>'); process.exit(1); }
      const file = args[0];
      let buf: Buffer;
      if (args.includes('--stdin')) {
        const chunks: Buffer[] = [];
        for await (const chunk of process.stdin) chunks.push(chunk);
        buf = Buffer.concat(chunks);
      } else {
        const text = args.slice(1).join(' ');
        if (!text) { console.error('No content provided'); process.exit(1); }
        buf = Buffer.from(text);
      }
      const entry = applyWrite(file, buf);
      console.log(`${entry.seq} [${entry.timestamp}] write ${file} (${entry.encoding})`);
      break;
    }

    case 'append': {
      if (!args[0]) { console.error('Usage: change append <file> <content>'); process.exit(1); }
      const file = args[0];
      let buf: Buffer;
      if (args.includes('--stdin')) {
        const chunks: Buffer[] = [];
        for await (const chunk of process.stdin) chunks.push(chunk);
        buf = Buffer.concat(chunks);
      } else {
        const text = args.slice(1).join(' ');
        if (!text) { console.error('No content provided'); process.exit(1); }
        buf = Buffer.from(text);
      }
      const entry = applyAppend(file, buf);
      console.log(`${entry.seq} [${entry.timestamp}] append ${file} (${entry.encoding})`);
      break;
    }

    case 'log': {
      if (!args[0]) { console.error('Usage: change log <file>'); process.exit(1); }
      const entries = readLog(args[0]);
      if (!entries.length) { console.log('No changes recorded'); break; }
      for (const e of entries) {
        const preview = e.encoding === 'utf-8'
          ? (e.content.length > 60 ? e.content.slice(0, 60) + '...' : e.content)
          : `(binary, ${Buffer.from(e.content, 'base64').length} bytes)`;
        console.log(`  ${e.seq} [${e.timestamp}] ${e.operation}: ${preview}`);
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
}

main().catch((err: any) => {
  console.error(err.message);
  process.exit(1);
});
