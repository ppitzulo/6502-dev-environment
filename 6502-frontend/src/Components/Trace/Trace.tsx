import { useState, useEffect } from 'react';
import './Trace.css';
import { Operation } from '../../Interfaces/AssemblyStateInterfaces';

interface TraceProps {
    cpu: any;
    bus: any;
    PC: number;
    traceLog: Operation[];
    setTraceLog: React.Dispatch<React.SetStateAction<Operation[]>>;
}


const Trace = ({ cpu, bus, PC, traceLog, setTraceLog }: TraceProps) => {
    const [prevPC, setPrevPC] = useState<number>(PC); // Track previous PC to detect changes

    useEffect(() => {
        if (PC !== prevPC) {
            // Get the current opcode from the bus
            const opcode = bus.readMemory(prevPC);

            // Get the disassembled operation details
            const operation = cpu.dissassemble(opcode);

            // Add the new operation to the trace log
            setTraceLog(prevLog => [...prevLog, { ...operation, opcode, PC: `0x${(PC).toString(16)}` }]);
        }
        setPrevPC(PC);
    }, [PC]);

    return (
        <div className="trace">
            <h2 className='header'>Trace</h2>

            <div className="trace-header">
                <div>PC</div>
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
                        <div>{`${operation.PC.toString(16)}`}</div>
                        <div>{`${operation.opcode.toString(16)}`}</div>
                        <div>{operation.name}</div>
                        <div>{`${operation.A.toString(16)}`}</div>
                        <div>{`${operation.X.toString(16)}`}</div>
                        <div>{`${operation.Y.toString(16)}`}</div>
                        <div>{`${operation.P.toString(2)}`}</div>
                        <div>{`${operation.SP.toString(16)}`}</div>
                        <div>{`${operation.CYC.toString(16)}`}</div>
                    </div>
                ))}
            </div>
        </div >
    );
};

export default Trace;
