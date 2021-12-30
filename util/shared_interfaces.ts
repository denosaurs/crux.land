export type Tags = Record<string, string>;

export interface Alias {
  alias: string;
  owner: number;
  tags: Tags;
}

export type Requests = Alias[];
