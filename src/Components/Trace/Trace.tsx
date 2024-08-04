import { useState, useEffect } from 'react';
import './Trace.css';
import { Operation } from '../../Interfaces/AssemblyStateInterfaces';

interface TraceProps {
    cpu: any;
    bus: any;
    PC: number;
    cycles: number;
    traceLog: Operation[];
    setTraceLog: React.Dispatch<React.SetStateAction<Operation[]>>;
}


const Trace = ({ cpu, bus, PC, traceLog, setTraceLog }: TraceProps) => {
    const [prevPC, setPrevPC] = useState<number>(PC); // Track previous PC to make sure we don't add the value at the inital address to the trace log

    useEffect(() => {
        // If the PC is not the initial address and the PC has changed
        if (PC !== 0x8000 && PC !== prevPC) {

            // Get the current opcode from the bus
            const opcode = bus.readMemory(prevPC);

            // Get the disassembled operation details
            const operation = cpu.dissassemble(opcode);

            // Get the current number of cycles
            const cycles = cpu.getCycles();

            // Add the new operation to the trace log
            setTraceLog(prevLog => [...prevLog, { ...operation, opcode, cycles, PC: `${(PC).toString(16)}` }]);
        }
        setPrevPC(PC);
    }, [PC]);

    return (
        <div className="trace">
            <div className="trace-header">
                <div title="Program Counter">PC</div>
                {/* <div title="Instruction">Instr</div> */}
                <div title="Operand">Opnd</div>
                <div title="Disassembly">Diss</div>
                <div title="Accumulator">A</div>
                <div title="Index Register X">X</div>
                <div title="Index Register Y">Y</div>
                <div title="Stack Pointer">SP</div>
                <div title="Flags (N, O, -, B, D, I, Z, C)">Flags</div>
                <div title="Cycles">Cyc</div>
            </div>
            <div className="trace-body">
                {traceLog.map((operation, index) => (
                    <div className="trace-row" key={index}>
                        <div>{`0x${operation.PC.toString(16).toUpperCase().padStart(4, '0')}`}</div>
                        {/* <div>{`0x${operation.opcode.toString(16).toUpperCase()}`}</div> */}
                        <div title={`0x${operation.opcode.toString(16).toUpperCase()}`}>{operation.name}</div>
                        <div>{operation.operand}</div>
                        <div>{`0x${operation.A.toString(16).toUpperCase()}`}</div>
                        <div>{`0x${operation.X.toString(16).toUpperCase()}`}</div>
                        <div>{`0x${operation.Y.toString(16).toUpperCase()}`}</div>
                        <div>{`0x${operation.SP.toString(16).toUpperCase()}`}</div>
                        <div>{`${operation.P.toString(2).padStart(8, '0')}`}</div>
                        <div>{`${operation.cycles}`}</div>
                    </div>
                ))}
            </div>
        </div >
    );
};

export default Trace;
