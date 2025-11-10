// src/infra/SimpleTagScanner.ts
import { ITagScanner, TagToken } from "../core/ITagScanner.js";

export class SimpleTagScanner implements ITagScanner {
  *scan(paragraph: string): Iterable<TagToken> {
    for (let i = 0; i < paragraph.length; i++) {
      if (paragraph[i] !== "<") continue;

      const j = paragraph.indexOf(">", i + 1);
      if (j === -1) break;

      const inside = paragraph.slice(i + 1, j);

      if (inside.length === 0) { i = j; continue; }

      const isOpen = /^[A-Z]$/.test(inside);
      const isClose = /^\/[A-Z]$/.test(inside);
      if (!isOpen && !isClose) { i = j; continue; }

      if (isOpen) {
        yield { kind: "open", tag: inside };
        i = j;
        continue;
        }

        const tag = inside[1];
        if (!tag) { i = j; continue; }
        yield { kind: "close", tag };

        i = j;
    }
  }
}

