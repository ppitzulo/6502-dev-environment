import React, { useEffect, useState } from 'react';
import { useWasm } from './useWasm';

const App: React.FC = () => {
  const wasmModule = useWasm();
  const [cpu, setCpu] = useState<any>(null);

  useEffect(() => {
    if (wasmModule && !cpu) {
      try {
        console.log("Creating Bus and CPU instances...");
        console.log("wasmModule:", wasmModule);
        const bus = new wasmModule.Bus();
        const cpuInstance = new wasmModule.CPU(bus);
        console.log("Bus and CPU instances created:", bus, cpuInstance);
        setCpu(cpuInstance);
      } catch (error) {
        console.error("Error creating Bus or CPU instance:", error);
      }
    }
  }, [wasmModule, cpu]);

  const runCpu = () => {
    if (cpu) {
      cpu.run(1000); // Run for 1000 cycles
      console.log("CPU run for 1000 cycles.");
    }
  };

  const resetCpu = () => {
    if (cpu) {
      cpu.reset();
      console.log("CPU reset.");
    }
  };

  const getRegisters = () => {
    if (cpu) {
      const registers = cpu.getRegisters();
      console.log("CPU registers:", registers);
    }
  };

  return (
    <div className="App">
      <h1>React and WebAssembly Emulator</h1>
      <button onClick={runCpu}>Run CPU</button>
      <button onClick={resetCpu}>Reset CPU</button>
      <button onClick={getRegisters}>Get Registers</button>
    </div>
  );
};

export default App;
