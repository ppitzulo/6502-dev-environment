import { useEffect, useRef } from 'react';
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


const Trace = ({ traceLog }: TraceProps) => {
    const traceRef = useRef<HTMLDivElement | null>(null);

    const formatFlags = (flags: number) => {
        // Flags are typically represented in the order: N, V, -, B, D, I, Z, C
        const flagNames = ['N', 'O', '-', 'B', 'D', 'I', 'Z', 'C'];

        // Convert flags to a binary string, pad with leading zeros
        const flagBits = flags.toString(2).padStart(8, '0').split('');

        return flagBits.map((bit, index) => (
            <span
                key={flagNames[index]}
                className={`flag ${bit === '1' ? 'set' : ''}`} // Apply 'set' class if bit is 1
                title={flagNames[index]}
            >
                {flagNames[index]}
            </span>
        ));
    };

    useEffect(() => {
        // Scroll to the bottom of the trace log
        if (traceRef.current) {
            traceRef.current.scrollTop = traceRef.current.scrollHeight;
        }
    }, [traceLog]);

    return (
        <div className="trace">
            <div className="trace-header">
                <div title="Program Counter">PC</div>
                {/* <div title="Instruction">Instr</div> */}
                <div title="Instruction">Instr</div>
                <div title="Operand">Opnd</div>
                <div title="Accumulator">A</div>
                <div title="Index Register X">X</div>
                <div title="Index Register Y">Y</div>
                <div title="Stack Pointer">SP</div>
                <div title="Flags (N, O, -, B, D, I, Z, C)">Flags</div>
                <div title="Cycles">Cyc</div>
            </div>
            <div className="trace-body" ref={traceRef}>
                {traceLog.map((operation, index) => (
                    <div className="trace-row" key={index}>
                        <div>{`0x${operation.PC.toString(16).toUpperCase().padStart(4, '0')}`}</div>
                        {/* <div>{`0x${operation.opcode.toString(16).toUpperCase()}`}</div> */}
                        <div className="instruction" title={`0x${operation.opcode.toString(16).toUpperCase()}`}>{operation.name}</div>
                        <div className="operand">{operation.operand}</div>
                        <div>{`0x${operation.A.toString(16).toUpperCase()}`}</div>
                        <div>{`0x${operation.X.toString(16).toUpperCase()}`}</div>
                        <div>{`0x${operation.Y.toString(16).toUpperCase()}`}</div>
                        <div>{`0x${operation.SP.toString(16).toUpperCase()}`}</div>
                        <div>{formatFlags(operation.P)}</div>
                        <div>{`${operation.cycles}`}</div>
                    </div>
                ))}
            </div>
        </div >
    );
};

export default Trace;
