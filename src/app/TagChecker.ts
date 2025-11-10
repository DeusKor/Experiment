import { IStack } from "../core/IStack.js";
import { ITagChecker } from "../core/ITagChecker.js";
import { ITagScanner } from "../core/ITagScanner.js";

export class TagChecker implements ITagChecker {
  constructor(
    private readonly stack: IStack<string>,
    private readonly scanner: ITagScanner
  ) {}

  checkParagraph(paragraph: string): string {
    this.stack.clear();

    for (const token of this.scanner.scan(paragraph)) {
      if (token.kind === "open") {
        this.stack.push(token.tag);
        continue;
      }

      const top = this.stack.pop();
      if (!top) return `Expected # found </${token.tag}>`;
      if (top !== token.tag) return `Expected </${top}> found </${token.tag}>`;
    }

    if (!this.stack.isEmpty()) {
      const top = this.stack.peek()!;
      return `Expected </${top}> found #`;
    }

    return "Correctly tagged paragraph";
  }
}

