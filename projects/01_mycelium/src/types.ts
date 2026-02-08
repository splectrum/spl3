export interface Reference {
  list: string;
  seq: number;
}

export interface Record {
  list: string;
  seq: number;
  hash: string;
  timestamp: string;
  content: string;
  refs: Reference[];
}

export interface ListMeta {
  name: string;
  created: string;
  count: number;
}
