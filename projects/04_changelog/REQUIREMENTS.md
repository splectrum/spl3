# 04_changelog — Requirements

## apply

1. Writes content to the target file, replacing existing content.
2. Records the change as an immutable entry in the changelog.
3. Accepts content from arguments or stdin (--stdin).
4. Handles both text and binary content.

## append

5. Appends content to the target file.
6. Records the appended content as an immutable entry.
7. Creates the file if it doesn't exist.

## log

8. Shows all change entries for a file in sequence order.
9. Displays text content as preview, binary as byte count.
10. Each entry shows sequence number, timestamp, and operation.

## Storage

11. Changelog entries are immutable — append-only, never modified.
12. Content stored as utf-8 when text, base64 when binary.
13. Works without git or any other external tool.
