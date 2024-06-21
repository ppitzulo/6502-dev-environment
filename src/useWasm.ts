import { useEffect, useState } from 'react';

// Define the type for the Wasm module
declare global {
  interface Window {
    MyModule: any;
  }
}

export const useWasm = () => {
  const [wasmModule, setWasmModule] = useState<any>(null);
  const [isReady, setIsReady] = useState<boolean>(false);

  useEffect(() => {
    const loadWasm = async () => {
      try {
        if (window.MyModule) {
          const module = await window.MyModule();
          setWasmModule(module);
          setIsReady(true);
        } else {
          console.error("window.MyModule is not defined.");
        }
      } catch (error) {
        console.error("Error loading Wasm module:", error);
      }
    };

    loadWasm();
  }, []);

  return { wasmModule, isReady};
};
