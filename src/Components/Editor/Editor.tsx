import React, { useState, useRef, useEffect } from 'react';
import { Controlled as CodeMirror } from 'react-codemirror2';
import { AssemblyState } from '../../Interfaces/AssemblyStateInterfaces';
import './Editor.css';
import '../../mos6502-mode';
import 'codemirror/lib/codemirror.css';
import { Editor as CodeMirrorEditor } from 'codemirror';

// Themes
import 'codemirror/theme/dracula.css'
import 'codemirror/theme/monokai.css'
import 'codemirror/theme/icecoder.css'
import 'codemirror/theme/ambiance.css'
import 'codemirror/theme/solarized.css'
import 'codemirror/theme/material-darker.css'
import 'codemirror/theme/tomorrow-night-bright.css'
import 'codemirror/theme/twilight.css'
import 'codemirror/theme/night.css'
import 'codemirror/theme/ayu-dark.css'
import 'codemirror/theme/darcula.css'






// Font Awesome imports
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCog } from '@fortawesome/free-solid-svg-icons';

const Editor = ({ bus, wasmModule, assemblyState, setAssemblyState, setMessage }: { bus: any, wasmModule: any, assemblyState: AssemblyState, setAssemblyState: React.Dispatch<React.SetStateAction<AssemblyState>>, setMessage: React.Dispatch<React.SetStateAction<string | null>> }) => {
  const initialAssemblyCode = `    .org $0800
  ldx #0
  start:
  stx $0200
  inx
  stx $0201
  brk`;

  const [assemblyCode, setAssemblyCode] = useState<string>(initialAssemblyCode);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [theme, setTheme] = useState<string>('icecoder');

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

  const toggleSettingsMenu = () => {
    setIsSettingsOpen(prevState => !prevState);
  }

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

          // Clear memory before writing in new instructions
          bus.clearMemory();

          for (let i = 0; i < compiledCode.length; i++) {
            codeArray.push_back(compiledCode[i]);
          }

          bus.loadProgram(codeArray, 0x8000);

          setAssemblyState((prevState: AssemblyState) => ({
            ...prevState,
            isSubmitted: false,
            isAssembled: true
          }));
          setMessage("Code assembled successfully");

        } catch (err) {
          console.error(err);
          console.error(err);
          setMessage("Error assembling code");
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
    <div className="editor-container">
      <div className={`settings ${isSettingsOpen ? 'settings-open' : ''}`}>
        <FontAwesomeIcon className="settings-icon" icon={faCog} onClick={toggleSettingsMenu} />
        {isSettingsOpen && (
          <div className="settings-menu">
            <div className="settings-menu-item">
              <label>Theme: </label>
              <select
                onChange={(e) => {
                  const theme = e.target.value;
                  editorRef.current.setOption('theme', theme);

                  // Save theme to local storage
                  localStorage.setItem('theme', theme);

                  // Update the state
                  setTheme(theme);
                }}
                defaultValue={localStorage.getItem('theme') || 'Ayu Dark'}
              >
                <option value="icecoder">Icecoder</option>
                <option value="monokai">Monokai</option>
                <option value="dracula">Dracula</option>
                <option value="ambiance">Ambiance</option>
                <option value="solarized">Solarized</option>
                <option value="material-darker">Material Darker</option>
                <option value="tomorrow-night-bright">Tomorrow Night Bright</option>
                <option value="twilight">Twilight</option>
                <option value="night">Night</option>
                <option value="ayu-dark">Ayu Dark</option>
                <option value="darcula">Darcula</option>
              </select>
            </div>
          </div>
        )}
      </div>
      <CodeMirror
        value={assemblyCode}
        options={{
          mode: 'mos6502',
          theme: theme,
          lineNumbers: true,
        }}
        onBeforeChange={handleChange}
        editorDidMount={editorElement => {
          (editorRef as React.MutableRefObject<CodeMirrorEditor>).current = editorElement;

          // Load theme from local storage
          const theme = localStorage.getItem('theme') || 'icecoder';
          setTheme(theme);
        }}
        editorWillUnmount={() => {
          const editorWrapper = (editorRef as React.MutableRefObject<CodeMirrorEditor>).current.getWrapperElement();
          if (editorWrapper) editorWrapper.remove();
          if (wrapperRef.current) {
            (wrapperRef.current as { hydrated: boolean }).hydrated = false;
          }
        }}
      />
    </div>
  );
};

export default Editor;
