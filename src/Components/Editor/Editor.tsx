import React, { useState, useEffect } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { AssemblyState } from '../../Interfaces/AssemblyStateInterfaces';
import './Editor.css';
import { mos6502 } from '../../mos6502-mode';

// Themes
import { dracula } from '@uiw/codemirror-theme-dracula';
import { monokai } from '@uiw/codemirror-theme-monokai';
import { solarizedDark } from '@uiw/codemirror-theme-solarized';
import { tokyoNight } from '@uiw/codemirror-theme-tokyo-night';
import { tokyoNightStorm } from '@uiw/codemirror-theme-tokyo-night-storm';
import { vscodeDark } from '@uiw/codemirror-theme-vscode';
import { darcula } from '@uiw/codemirror-theme-darcula';

// Vim mode
import { vim } from "@replit/codemirror-vim"

// Font Awesome imports
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCog } from '@fortawesome/free-solid-svg-icons';

type ThemeKey = keyof typeof themes;

const themes = {
  'dracula': dracula,
  'monokai': monokai,
  'solarized-dark': solarizedDark,
  'tokyo-night': tokyoNight,
  'tokyo-night-storm': tokyoNightStorm,
  'vscode-dark': vscodeDark,
  'darcula': darcula,
};

const Editor = ({ bus, wasmModule, assemblyState, setAssemblyState, setMessage }: { bus: any, wasmModule: any, assemblyState: AssemblyState, setAssemblyState: React.Dispatch<React.SetStateAction<AssemblyState>>, setMessage: React.Dispatch<React.SetStateAction<string | null>> }) => {
  const initialAssemblyCode = `.org $0800
ldx #0
start:
  stx $0200
  inx
  stx $0201
  brk`;

  const [assemblyCode, setAssemblyCode] = useState<string>(initialAssemblyCode);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [settings, setSettings] = useState<{ theme: ThemeKey, vimMode: boolean }>(() => {
    const savedTheme = (localStorage.getItem('theme') as ThemeKey) || 'vscode-dark';
    const savedVimMode = localStorage.getItem('vimMode') === 'true'; // Retrieve Vim mode
    return { theme: savedTheme, vimMode: savedVimMode };
  });

  const handleChange = (value: string) => {
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
          // <div className="settings-menu">
          <>
            <div className="settings-menu-item">
              <label>Theme: </label>
              <select
                onChange={(e) => {
                  const selectedTheme:ThemeKey = e.target.value as ThemeKey;

                  // Save theme to local storage
                  localStorage.setItem('theme', selectedTheme);

                  // Update the state
                  setSettings((prevSettings) => {
                    const newSettings = { ...prevSettings, theme: selectedTheme };
                    localStorage.setItem('theme', newSettings.theme); // Save theme to local storage
                    return newSettings;
                  })
                }}
                value={settings.theme}
              >
                {Object.keys(themes).map((themeKey) => (
                  <option key={themeKey} value={themeKey}>
                    {themeKey.charAt(0).toUpperCase() + themeKey.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            <div className="settings-menu-item">
              <label>Vim Mode: </label>
              <input
                type="checkbox"
                checked={settings.vimMode}
                onChange={() => {
                  setSettings((prevSettings) => {
                    const newSettings = { ...prevSettings, vimMode: !prevSettings.vimMode };
                    localStorage.setItem('vimMode', String(newSettings.vimMode)); // Save Vim mode to local storage
                    return newSettings;
                  });
                }}
              />
            </div>
            </>
          // </div>
        )}
      </div>
      <CodeMirror value={assemblyCode} theme={themes[settings.theme]} extensions={ [settings.vimMode ? vim() : [], mos6502()]}  onChange={handleChange} height="100%"/>
    </div>
  );
};

export default Editor;
