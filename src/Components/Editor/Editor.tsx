import React, { useState, useRef, useEffect } from 'react';
import { Controlled as CodeMirror } from 'react-codemirror2';
import { AssemblyState } from '../../Interfaces/AssemblyStateInterfaces';
import './Editor.css';
import '../../mos6502-mode';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/dracula.css'
import 'codemirror/theme/monokai.css'
import { Editor as CodeMirrorEditor } from 'codemirror';

const Editor = ({ bus, wasmModule, assemblyState, setAssemblyState }: { bus: any, wasmModule: any, assemblyState: AssemblyState, setAssemblyState: React.Dispatch<React.SetStateAction<AssemblyState>> }) => {
  const initialAssemblyCode = `    .org $0800
  ldx #0
  start:
  stx $0200
  inx
  stx $0201
  brk`;

  const [assemblyCode, setAssemblyCode] = useState<string>(initialAssemblyCode);
  const editorRef = useRef<CodeMirrorEditor | null>(null);
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  const handleChange = (editor: any, data: any, value: string) => {
    setAssemblyCode(value);
    setAssemblyState((prevState: AssemblyState) => ({
      ...prevState,
      isSubmitted: false,
      isAssembled: false,
      isError: false
    }));
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
          
          setAssemblyState((prevState: AssemblyState) => ({
            ...prevState,
            isSubmitted: false,
            isAssembled: true
          }));

        } catch (err) {
          console.error(err);
          setAssemblyState((prevState: AssemblyState) => ({
            ...prevState,
            isSubmitted: false,
            isError: true
          }));
        }
      }
    };

    handleSubmit();
  }, [assemblyState.isSubmitted, assemblyCode, bus, wasmModule, setAssemblyState]);


  return (
    <CodeMirror
      value={assemblyCode}
      options={{
        mode: 'mos6502',
        theme: 'dracula',
        lineNumbers: true,
      }}
      onBeforeChange={handleChange}
      editorDidMount={editorElement => {
        (editorRef as React.MutableRefObject<CodeMirrorEditor>).current = editorElement;
      }}
      editorWillUnmount={() => {
        const editorWrapper = (editorRef as React.MutableRefObject<CodeMirrorEditor>).current.getWrapperElement();
        if (editorWrapper) editorWrapper.remove();
        if (wrapperRef.current) {
          (wrapperRef.current as { hydrated: boolean }).hydrated = false;
        }
      }}
    />
  );
};

export default Editor;
