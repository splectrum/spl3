/** A record is a key-value pair. Content is opaque. */
export interface Record {
  key: string;
  type: 'file' | 'context';
  size: number;
}

/** A context contains keyed records. Records can be contexts. */
export interface Context {
  path: string;
  records: Record[];
}
