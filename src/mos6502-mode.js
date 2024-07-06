import CodeMirror from 'codemirror';

CodeMirror.defineMode('mos6502', function() {
  return {
    startState: function() {
      return { inComment: false };
    },
    token: function(stream, state) {
      if (stream.eatSpace()) return null;

      const sol = stream.sol();
      const ch = stream.next();

      if (ch === ';') {
        stream.skipToEnd();
        return 'comment';
      }

      if (sol && ch === '.') {
        stream.eatWhile(/\w/);
        return 'meta'; // assembler directives
      }

      if (/[a-zA-Z]/.test(ch)) {
        stream.eatWhile(/\w/);
        return 'keyword'; // opcodes
      }

      if (/\d/.test(ch)) {
        stream.eatWhile(/\d/);
        return 'number';
      }

      return null;
    }
  };
});
