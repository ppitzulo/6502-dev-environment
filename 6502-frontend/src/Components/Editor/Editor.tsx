import { useState, ChangeEvent } from 'react';
import './Editor.css';

const Editor = ( { bus, wasmModule }: { bus: any, wasmModule: any } ) => {
  const [assemblyCode, setAssemblyCode] = useState<string>(`    .org $0800
  ldx #0
start:
  stx $0200
  inx
  stx $0201
  brk`);
  const [error, setError] = useState<string>('');
  const [isAssembled, setIsAssembled] = useState<boolean>(false);

  const handleAssemblyChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setAssemblyCode(e.target.value);
    setIsAssembled(false);
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
      setIsAssembled(true);
      
      setError('');
    } catch (err) {
        console.error(err);
      setError('Failed to assemble the code. Please try again.');
    }
  };

  return (
    <div className="editor">
      <textarea
        className="editor"
        value={assemblyCode}
        onChange={handleAssemblyChange}
        placeholder="Enter your assembly code here..."
      ></textarea>
      <br />
      <div className="assemble-button-container">
        <button onClick={handleSubmit}>Assemble</button>
        {isAssembled && <p style={{ color: 'green' }}>Code assembled successfully!</p>}
        {!isAssembled && <p style={{ color: 'red' }}>Not yet assembled</p>}
      </div>
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
