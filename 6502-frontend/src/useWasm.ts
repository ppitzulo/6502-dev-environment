import { useEffect, useState } from 'react';

// Define the type for the Wasm module
declare global {
  interface Window {
    MyModule: any;
  }
}

export const useWasm = () => {
  const [wasmModule, setWasmModule] = useState<any>(null);

  useEffect(() => {
    const loadWasm = async () => {
      try {
        console.log("Attempting to load Wasm module...");
        if (window.MyModule) {
          console.log("window.MyModule is defined, loading module...");
          const module = await window.MyModule();
          console.log("Wasm module loaded:", module);
          setWasmModule(module);
        } else {
          console.error("window.MyModule is not defined.");
        }
      } catch (error) {
        console.error("Error loading Wasm module:", error);
      }
    };

    loadWasm();
  }, []);

  return wasmModule;
};
