/**
 * Mycelium logical layer.
 *
 * Defines what exists — records, contexts, operations —
 * without any reference to how or where they are stored.
 */

/** A record is an entry in a context. */
export interface Record {
  key: string;
  type: 'file' | 'context';
  size: number; // bytes for file, item count for context
}

/** A context is a container of records. */
export interface Context {
  path: string; // logical path (e.g. "a/b/c")
  records: Record[];
}

/** A flattened record includes its full logical path. */
export interface FlatRecord {
  key: string; // relative path from the root of the flatten
  size: number; // bytes
}

/**
 * The capability interface.
 *
 * Any implementation that satisfies this interface binds the
 * logical model to a physical substrate. The logical layer
 * never knows which capability is active.
 */
export interface Capability {
  /** Read a context — return its immediate records. */
  readContext(path: string): Promise<Context>;

  /** Read a record's content as opaque bytes. */
  readRecord(path: string): Promise<Buffer>;

  /** List all file records recursively (flatten). */
  flatten(path: string): Promise<FlatRecord[]>;

  /** Create a record. If content is provided, it's a file; otherwise a context. */
  createRecord(path: string, content?: Buffer): Promise<void>;

  /** Delete a record (or context, recursively). */
  deleteRecord(path: string): Promise<void>;
}
