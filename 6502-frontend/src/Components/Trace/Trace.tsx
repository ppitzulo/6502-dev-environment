import { useState, useEffect } from 'react';
import './Trace.css';

interface TraceProps {
    cpu: any;
    bus: any;
    PC: number;
}

interface Operation {
    opcode: number;
    name: string;
    A: number;
    X: number;
    Y: number;
    P: number;
    SP: number;
    status: number;
    CYC: number;
    operand: string;
}

const Trace = ({ cpu, bus, PC }: TraceProps) => {
    const [traceLog, setTraceLog] = useState<Operation[]>([]);

    useEffect(() => {
        // Get the current opcode from the bus
        const opcode = bus.readMemory(PC);

        // Get the disassembled operation details
        const operation = cpu.dissassemble(opcode);

        // Add the new operation to the trace log
        setTraceLog(prevLog => [...prevLog, { ...operation, opcode, operand: `0x${PC.toString(16)}` }]);
    }, [PC, bus, cpu]);

    return (
        <div className="trace">
            <h2 className='header'>Trace</h2>

            <div className="trace-header">
                <div>addr</div>
                <div>instr</div>
                <div>disass</div>
                <div>A</div>
                <div>X</div>
                <div>Y</div>
                <div>NVBDIZC</div>
                <div>SP</div>
                <div>cycles</div>
            </div>
            <div className="trace-body">
                {traceLog.map((operation, index) => (
                    <div className="trace-row" key={index}>
                        <div >{`${PC.toString(16)}`}</div>
                        <div >{`${operation.opcode.toString(16)}`}</div>
                        <div >{operation.name}</div>
                        <div >{`${operation.A.toString(16)}`}</div>
                        <div >{`${operation.X.toString(16)}`}</div>
                        <div >{`${operation.Y.toString(16)}`}</div>
                        <div >{`${operation.P.toString(2)}`}</div>
                        <div >{`${operation.SP.toString(16)}`}</div>
                        <div>{`${operation.CYC.toString(16)}`}</div>
                    </div>
                ))}
            </div>
        </div >
    );
};

export default Trace;
