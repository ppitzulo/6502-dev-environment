import React, { useState, ChangeEvent, useEffect } from 'react';
import './Editor.css';
import { AssemblyState } from '../../Interfaces/AssemblyStateInterfaces';

const Editor = ( { bus, wasmModule, assemblyState, setAssemblyState }: { bus: any, wasmModule: any, assemblyState: AssemblyState, setAssemblyState: React.Dispatch<React.SetStateAction<AssemblyState>>} ) => {
  const [assemblyCode, setAssemblyCode] = useState<string>(`    .org $0800
  ldx #0
start:
  stx $0200
  inx
  stx $0201
  brk`);
  const [error, setError] = useState<string>('');

  const toggleBooleanState = (key: string) => {
    setAssemblyState((prevState: any) => ({
      ...prevState,
      [key]: !prevState[key]
    }));
  };

  const handleAssemblyChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setAssemblyCode(e.target.value);
  };

  useEffect(() => {
    const handleSubmit = async () => {
      if (assemblyState.isSubmitted) {
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
          toggleBooleanState('isAssembled');
          toggleBooleanState('isSubmitted');
          
          
          setError('');
        } catch (err) {
          console.error(err);
          setError('Failed to assemble the code. Please try again.');
        }
      }
    };

    handleSubmit();
  }, [assemblyState.isSubmitted]);

  return (
    <div className="editor">
      <textarea
        className="editor"
        value={assemblyCode}
        onChange={handleAssemblyChange}
        placeholder="Enter your assembly code here..."
      ></textarea>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default Editor;
