import React, { useEffect, useState } from 'react';
import { useWasm } from './useWasm';
import Editor from './Components/Editor/Editor';
import RegisterView from './Components/RegisterView/RegisterView';
import Trace from './Components/Trace/Trace';
import './App.css';
import { AssemblyState } from './Interfaces/AssemblyStateInterfaces';
import StackView from './Components/StackView/StackView';

const App: React.FC = () => {
  const wasmResults = useWasm();
  const [bus, setBus] = useState<any>(null);
  const [cpu, setCpu] = useState<any>(null);
  const [wasmModule, setWasmModule] = useState<any>(null);
  const [registers, setRegisters] = useState<any>(null);
  const [assemblyState, setAssemblyState] = useState<AssemblyState>({
    isSubmitted: false,
    isAssembled: false,
  })

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
      cpu.run(); // run next instruction (TODO: rename this to step and create a different run method that runs continuously)
      setRegisters(cpu.getRegisters());
    }
  };

  const resetCpu = () => {
    if (cpu) {
      cpu.reset();
      setRegisters(cpu.getRegisters());
    }
  };


  const toggleSubmitted = () => {
    setAssemblyState(prevState => ({
      ...prevState,
      isSubmitted: !prevState.isSubmitted
    }));
  };

  return (
    <div className="App">
      <RegisterView registers={registers} />
      <div className="emulator">
        <h1 className="emulator-header">6502 Emulator</h1>
        {wasmResults.isReady && <Editor bus={bus} wasmModule={wasmModule} assemblyState={assemblyState} setAssemblyState={setAssemblyState}/>}
        <div className="emulator-controls">
          <button onClick={runCpu}>Run CPU</button>
          <button onClick={resetCpu}>Reset CPU</button>
          <button onClick={toggleSubmitted}>Assemble</button>
          {assemblyState.isAssembled && <p style={{ color: 'green' }}>Code assembled successfully!</p>}
          {!assemblyState.isAssembled && <p style={{ color: 'red' }}>Not yet assembled</p>}
        </div>
      </div>
      {registers && <Trace  cpu={cpu} bus={bus} PC={registers.PC} />}
      {bus && <StackView bus={bus} SP={registers.SP} />}
    </div>
  );
};

export default App;
