import { TagChecker } from "../src/app/TagChecker.js";
import { ArrayStack } from "../src/infra/ArrayStack.js";
import { SimpleTagScanner } from "../src/infra/SimpleTagScanner.js";
import { describe, test, expect, beforeEach } from "vitest"

const checker = new TagChecker(new ArrayStack<string>(), new SimpleTagScanner());

describe("TagChecker", () => {
  test("correctly tagged simple paragraph", () => {
    expect(checker.checkParagraph("The following text<C><B>is centred and bold</B></C>"))
      .toBe("Correctly tagged paragraph");
  });

  test("nested tags different order still valid", () => {
    expect(checker.checkParagraph("<A><B>nested</B></A>"))
      .toBe("Correctly tagged paragraph");
  });

  test("wrongly nested tags", () => {
    expect(checker.checkParagraph("<B><C>wrong nesting</B></C>"))
      .toBe("Expected </C> found </B>");
  });

  test("missing closing tag at paragraph end", () => {
    expect(checker.checkParagraph("<B><C>missing</C>"))
      .toBe("Expected </B> found #");
  });

  test("extra closing tag", () => {
    expect(checker.checkParagraph("<B>extra</B></C>"))
      .toBe("Expected # found </C>");
  });

  test("ignores malformed tags and still valid", () => {
    expect(checker.checkParagraph("Hello <\\g><A>text</A> <abc>"))
      .toBe("Correctly tagged paragraph");
  });

  test("closing tag before any opener", () => {
    expect(checker.checkParagraph("</A>Text<A>more</A>"))
      .toBe("Expected # found </A>");
  });

  test("multiple independent pairs", () => {
    expect(checker.checkParagraph("<A>one</A><B>two</B><C>three</C>"))
      .toBe("Correctly tagged paragraph");
  });

  test("no tags at all", () => {
    expect(checker.checkParagraph("Just plain text."))
      .toBe("Correctly tagged paragraph");
  });

  test("deep missing closing", () => {
    expect(checker.checkParagraph("<A><B><C>oops</B></A>"))
      .toBe("Expected </C> found </B>");
  });

  test("nested valid with random text", () => {
    expect(checker.checkParagraph("This <B>text <C>is valid</C></B> and fine"))
      .toBe("Correctly tagged paragraph");
  });

  test("two extra closing tags at end", () => {
    expect(checker.checkParagraph("<A>ok</A></B></C>"))
      .toBe("Expected # found </B>");
  });

  test("valid tags among angle brackets noise", () => {
    expect(checker.checkParagraph("<<noise>><A>ok</A>"))
      .toBe("Correctly tagged paragraph");
  });
});
