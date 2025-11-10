import { describe, test, expect } from "vitest";
import { SimpleTagScanner } from "../../src/infra/SimpleTagScanner.js";
import type { TagToken } from "../../src/core/ITagScanner.js";

function getTokens(text: string): TagToken[] {
  return Array.from(new SimpleTagScanner().scan(text));
}

describe("SimpleTagScanner tokenisation", () => {
  test("yields only exact <X> and </X> getTokens", () => {
    expect(getTokens("<A><AB></AB></A>")).toEqual([
      { kind: "open", tag: "A" },
      { kind: "close", tag: "A" },
    ]);
  });

  test("dangling '<' stops scanning safely", () => {
    expect(getTokens("<B>text<")).toEqual([{ kind: "open", tag: "B" }]);
  });

  test("empty tag '<>' yields nothing", () => {
    expect(getTokens("x<>y")).toEqual([]);
  });
});
