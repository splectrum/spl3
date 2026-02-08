/**
 * Mycelium logical layer — immutable and mutable interfaces.
 *
 * ImmutableCapability: operations that cannot destroy information.
 * MutableCapability: extends immutable with write and delete.
 */

/** A record is an entry in a context. */
export interface Record {
  key: string;
  type: 'file' | 'context';
  size: number; // bytes for file, item count for context
}

/** A context is a container of records. */
export interface Context {
  path: string;
  records: Record[];
}

/** A flattened record includes its full logical path. */
export interface FlatRecord {
  key: string;
  size: number;
}

/** A changelog entry records a single change to a record. */
export interface ChangelogEntry {
  timestamp: string; // ISO 8601
  operation: 'created' | 'written' | 'deleted';
  fingerprint: string; // first 8 chars of SHA-256
  key: string; // which record this entry belongs to
}

/**
 * Immutable capability — the foundation.
 * Cannot destroy or overwrite information.
 */
export interface ImmutableCapability {
  readContext(path: string): Promise<Context>;
  readRecord(path: string): Promise<Buffer>;
  flatten(path: string): Promise<FlatRecord[]>;
  createRecord(path: string, content?: Buffer): Promise<void>;
}

/**
 * Mutable capability — extends immutable.
 * Adds operations that can change or remove information.
 */
export interface MutableCapability extends ImmutableCapability {
  writeRecord(path: string, content: Buffer): Promise<void>;
  deleteRecord(path: string): Promise<void>;
}
