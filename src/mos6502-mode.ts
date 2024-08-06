import { StreamParser, StreamLanguage } from '@codemirror/language';
import { LanguageSupport, syntaxHighlighting, HighlightStyle } from '@codemirror/language';
import {tags as t } from '@lezer/highlight';

// Define a StreamParser for mos6502
const mos6502Parser: StreamParser<unknown> = {
  startState() {
    return {};
  },
  token(stream): string | null { // Specify the return type
    if (stream.eatSpace()) return null;

    const sol = stream.sol();
    const ch = stream.next();

    if (ch === undefined) {
      return null;
    }

    if (ch === ';') {
      stream.skipToEnd();
      return 'comment';
    }

    if (sol && ch === '.') {
      stream.eatWhile(/\w/);
      return 'meta'; // assembler directives
    }



    if (/[a-zA-Z]/.test(ch)) {
      stream.eatWhile(/\w/); // Continue eating word characters
      return 'keyword'; // opcodes
    }

    if (/\d/.test(ch)) {
      stream.eatWhile(/\d/); // Continue eating digits
      return 'number';
    }

    stream.next(); // Consume any unmatched character
    return null; // Ensure null is handled
  },
};

// Define a StreamLanguage
export const mos6502Language = StreamLanguage.define(mos6502Parser);

// Define highlighting style
const mos6502Highlighting = HighlightStyle.define([
  { tag: t.comment, color: '#888' },
  { tag: t.meta, color: '#080' },
  { tag: t.keyword, color: '#00f' },
  { tag: t.number, color: '#f00' },
]);

// Language support function
export function mos6502() {
  return new LanguageSupport(
    mos6502Language,
    [syntaxHighlighting(mos6502Highlighting)]
  );
}
