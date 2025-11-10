import { ArrayStack } from "./infra/ArrayStack.js";
import { SimpleTagScanner } from "./infra/SimpleTagScanner.js";
import { TagChecker } from "./app/TagChecker.js";

const checker = new TagChecker(new ArrayStack<string>(), new SimpleTagScanner());

const inputs = [
  "The following text<C><B>is centred and in boldface</B></C>",
  "<B>This <\\g>is <B>boldface</B> in <<*> a</B> <\\6> <<d>sentence",
  "<B><C> This should be centred and in boldface, but the tags are wrongly nested </B></C>",
  "<B>This should be in boldface, but there is an extra closing tag</B></C>",
  "<B><C>This should be centred and in boldface, but there is a missing closing tag</C>",
];

for (const s of inputs) console.log(checker.checkParagraph(s));

