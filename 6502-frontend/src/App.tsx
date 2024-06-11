import React, { useEffect, useState } from 'react';
import { useWasm } from './useWasm';
import Editor from './Components/Editor/Editor';
import RegisterView from './Components/RegisterView/RegisterView';
import './App.css';

const App: React.FC = () => {
  const wasmResults = useWasm();
  const [bus, setBus] = useState<any>(null);
  const [cpu, setCpu] = useState<any>(null);
  const [wasmModule, setWasmModule] = useState<any>(null);
  const [registers, setRegisters] = useState<any>(null);

  useEffect(() => {
    if (wasmResults.isReady && !cpu) {
      try {
        const bus = new wasmResults.wasmModule.Bus();
        const cpuInstance = new wasmResults.wasmModule.CPU(bus);
        setBus(bus);
        setCpu(cpuInstance);

        // Fetch CPU registers
        const registers = cpuInstance.getRegisters();
        setRegisters(registers);
        console.log(registers);
        setWasmModule(wasmResults.wasmModule);
      } catch (error) {
        console.error("Error creating Bus or CPU instance:", error);
      }
    }
  }, [wasmResults, cpu]);

  const runCpu = () => {
    if (cpu) {
      cpu.run(); // Run for 1000 cycles
      setRegisters(cpu.getRegisters());
    }
  };

  const resetCpu = () => {
    if (cpu) {
      cpu.reset();
      setRegisters(cpu.getRegisters());
    }
  };



  return (
    <div className="App">
      <h1>React and WebAssembly Emulator</h1>
      {wasmResults.isReady && <Editor bus={bus} wasmModule={wasmModule} />}
      <RegisterView registers={registers} />
      <button onClick={runCpu}>Run CPU</button>
      <button onClick={resetCpu}>Reset CPU</button>
      {/* <button onClick={getRegisters}>Get Registers</button> */}
    </div>
  );
};

export default App;
