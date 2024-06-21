interface AssemblyState {
    isSubmitted: boolean;
    isAssembled: boolean;
    isError: boolean;
}

interface Operation {
    opcode: number;
    name: string;
    A: number;
    X: number;
    Y: number;
    P: number;
    SP: number;
    PC: number;
    status: number;
    CYC: number;
    operand: string;
  }

  
export type { AssemblyState, Operation };