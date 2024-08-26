interface AssemblyState {
    isSubmitted: boolean;
    isAssembled: boolean;
    isError: boolean;
}

type RegisterState = {
  A: number;
  X: number;
  Y: number;
  PC: number;
  SP: number;
  carry: boolean;
  zero: boolean;
  interruptDisable: boolean;
  decimalMode: boolean;
  breakCommand: boolean;
  overflow: boolean;
  negative: boolean;
};

interface Operation {
    opcode: number;
    name: string;
    A: number;
    X: number;
    Y: number;
    P: number;
    SP: number;
    PC: number;
    // status: number;
    cycles: number;
    operand: string;
  }

  
export type { AssemblyState, Operation, RegisterState };