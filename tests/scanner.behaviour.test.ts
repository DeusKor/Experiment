import { describe, test, expect } from "vitest";
import { TagChecker } from "../src/app/TagChecker.js";
import { ArrayStack } from "../src/infra/ArrayStack.js";
import { SimpleTagScanner } from "../src/infra/SimpleTagScanner.js";

function mkChecker() {
  return new TagChecker(new ArrayStack<string>(), new SimpleTagScanner());
}

describe("SimpleTagScanner and TagChecker edge-cases", () => {
  test("dangling '<' at end -> reports missing closer", () => {
    const checker = mkChecker();
    expect(checker.checkParagraph("<B>text<")).toBe("Expected </B> found #");
  });

  test("empty tag '<>' is ignored", () => {
    const checker = mkChecker();
    expect(checker.checkParagraph("a<>b")).toBe("Correctly tagged paragraph");
  });

  test("multi-letter opener '<AB>' is NOT a valid tag", () => {
    const checker = mkChecker();
    expect(checker.checkParagraph("<AB>y</AB>")).toBe("Correctly tagged paragraph");
  });

  test("'<AB></B>' should *not* treat '<AB>' as <A>", () => {
    const checker = mkChecker();
    expect(checker.checkParagraph("<AB></B>")).toBe("Expected # found </B>");
  });

  test("multi-letter closer '</AB>' is NOT a valid closing tag", () => {
    const checker = mkChecker();
    expect(checker.checkParagraph("<A>x</AB>")).toBe("Expected </A> found #");
  });

  test("random slash tag '<A/B>' is ignored (not a closer)", () => {
    const checker = mkChecker();
    expect(checker.checkParagraph("<A>x<A/B>")).toBe("Expected </A> found #");
  });

  test("valid tags among noise remain valid", () => {
    const checker = mkChecker();
    expect(checker.checkParagraph("x<<*><A>ok</A><\\g>y")).toBe("Correctly tagged paragraph");
  });
});
