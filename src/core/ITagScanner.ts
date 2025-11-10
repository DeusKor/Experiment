export type TagToken =
  | { kind: "open"; tag: string }
  | { kind: "close"; tag: string };

export interface ITagScanner {
  scan(paragraph: string): Iterable<TagToken>;
}
