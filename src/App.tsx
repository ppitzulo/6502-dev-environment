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
  });
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (wasmResults.isReady && !cpu) {
      try {
        const bus = new wasmResults.wasmModule.Bus();
        const cpuInstance = new wasmResults.wasmModule.CPU(bus);
        setBus(bus);
        setCpu(cpuInstance);

        const registers = cpuInstance.getRegisters();
        setRegisters(registers);
        setWasmModule(wasmResults.wasmModule);
      } catch (error) {
        console.error("Error creating Bus or CPU instance:", error);
      }
    }
  }, [wasmResults, cpu]);

  const runCpu = () => {
    if (cpu) {
      cpu.run();
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

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(null), 5000); // Hide message after 5 seconds
      return () => clearTimeout(timer);
    }
  }, [message]);

  return (
    <div className="App">
      <div className="emulator">
        {wasmResults.isReady && <Editor bus={bus} wasmModule={wasmModule} assemblyState={assemblyState} setAssemblyState={setAssemblyState} setMessage={setMessage} />}
        <div className="controls-container">
          <div className="emulator-controls">
            <button onClick={runCpu} disabled={!assemblyState.isAssembled}>Run CPU</button>
            <button onClick={resetCpu}>Reset CPU</button>
            <button onClick={() => { toggleSubmitted();}}>Assemble</button>
            {message && <div className="assembly-message">{message}</div>}
            {assemblyState.isSubmitted && !assemblyState.isError && <Spinner />}
          </div>
          <RegisterView registers={registers} />
        </div>
      </div>
      {registers && <Trace cpu={cpu} bus={bus} PC={registers.PC} traceLog={traceLog} setTraceLog={setTraceLog}/>}
      {bus && <StackView bus={bus} SP={registers.SP} />}
    </div>
  );
};

export default App;