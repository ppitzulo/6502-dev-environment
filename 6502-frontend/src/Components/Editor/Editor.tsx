import { useState, ChangeEvent } from 'react';

const Editor = ( { bus, wasmModule }: { bus: any, wasmModule: any } ) => {
  const [assemblyCode, setAssemblyCode] = useState<string>(`    .org $0800
  ldx #0
start:
  stx $0200
  inx
  stx $0201
  brk`);
  const [error, setError] = useState<string>('');

  const handleAssemblyChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setAssemblyCode(e.target.value);
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch('http://localhost:3001/assemble', {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain',
        },
        body: assemblyCode,
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const arrayBuffer = await response.arrayBuffer();
      const compiledCode = new Uint8Array(arrayBuffer);

      const codeArray = new wasmModule.VectorUint8();

      for (let i = 0; i < compiledCode.length; i++) {
          codeArray.push_back(compiledCode[i]);
        }

      bus.loadProgram(codeArray, 0x8000);
      
      setError('');
    } catch (err) {
        console.error(err);
      setError('Failed to assemble the code. Please try again.');
    }
  };

  return (
    <div>
      <h1>6502 Assembler</h1>
      <textarea
        value={assemblyCode}
        onChange={handleAssemblyChange}
        rows={10}
        cols={50}
        placeholder="Enter your assembly code here..."
      ></textarea>
      <br />
      <button onClick={handleSubmit}>Assemble</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {/* {machineCode && (
        <div>
          <h2>Machine Code</h2>
          <pre>{Array.from(machineCode).map(byte => byte.toString(16).padStart(2, '0')).join(' ')}</pre>
        </div>
      )} */}
    </div>
  );
};

export default Editor;
