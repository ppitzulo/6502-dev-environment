import React, { useEffect, useState } from 'react';
import { useWasm } from './useWasm';
import Editor from './Components/Editor/Editor';
import RegisterView from './Components/RegisterView/RegisterView';
import Trace from './Components/Trace/Trace';
import './App.css';
import { AssemblyState, Operation } from './Interfaces/AssemblyStateInterfaces';
import StackView from './Components/StackView/StackView';
import Spinner from './Components/Spinner/Spinner';


const App: React.FC = () => {
  const wasmResults = useWasm();
  const [bus, setBus] = useState<any>(null);
  const [cpu, setCpu] = useState<any>(null);
  const [traceLog, setTraceLog] = useState<Operation[]>([]);
  const [wasmModule, setWasmModule] = useState<any>(null);
  const [registers, setRegisters] = useState<any>(null);
  const [assemblyState, setAssemblyState] = useState<AssemblyState>({
    isSubmitted: false,
    isAssembled: false,
    isError: false,
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
      setTraceLog([]);
    }
  };


  const toggleSubmitted = () => {
    setAssemblyState(prevState => ({
      ...prevState,
      isSubmitted: !prevState.isSubmitted
    }));
  };

  const renderAssemblyMessage = () => {
    if (assemblyState.isAssembled) {
      return <div className="success-message">Code assembled successfully</div>;
    }

    if (assemblyState.isSubmitted && !assemblyState.isError) {
      return <Spinner />
      return <div className="info-message">Assembling code...</div>;
    }
    
    if (assemblyState.isError) {
      return <div className="error-message">Error assembling code</div>;
    }
    else if (!assemblyState.isSubmitted) {
      return <div className="info-message">Submit code to assemble</div>;
    } 
    
  }

  return (
    <div className="App">
      <RegisterView registers={registers} />
      <div className="emulator">
        <h1 className="emulator-header">6502 Emulator</h1>
        {wasmResults.isReady && <Editor bus={bus} wasmModule={wasmModule} assemblyState={assemblyState} setAssemblyState={setAssemblyState}/>}
        <div className="emulator-controls">
          <button onClick={runCpu} disabled={!assemblyState.isAssembled}>Run CPU</button>
          <button onClick={resetCpu}>Reset CPU</button>
          <button onClick={toggleSubmitted}>Assemble</button>
          {renderAssemblyMessage()}
        </div>
      </div>
      {registers && <Trace  cpu={cpu} bus={bus} PC={registers.PC} traceLog={traceLog} setTraceLog={setTraceLog} />}
      {bus && <StackView bus={bus} SP={registers.SP} />}
    </div>
  );
};

export default App;
