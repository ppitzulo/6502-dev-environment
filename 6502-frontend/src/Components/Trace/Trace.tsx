import React, { useState, useEffect } from 'react';
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
            <h2>Trace</h2>
            <table className="trace-table">
                <thead>
                    <tr>
                        <th>addr</th>
                        <th>instr</th>
                        <th>disass</th>
                        <th>A</th>
                        <th>X</th>
                        <th>Y</th>
                        <th>SP</th>
                        {/* <th>nvdizc</th> */}
                        <th>cycles</th>
                    </tr>
                </thead>
                <tbody>
                    {traceLog.map((operation, index) => (
                        <tr key={index}>
                            <td>{`0x${PC.toString(16)}`}</td>
                            <td>{`0x${operation.opcode.toString(16)}`}</td>
                            <td>{operation.name}</td>
                            <td>{`0x${operation.A.toString(16)}`}</td>
                            <td>{`0x${operation.X.toString(16)}`}</td>
                            <td>{`0x${operation.Y.toString(16)}`}</td>
                            <td>{`0x${operation.SP.toString(16)}`}</td>
                            {/* <td>{`0x${operation.status.toString(16)}`}</td> */}
                            <td>{`0x${operation.CYC.toString(16)}`}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Trace;
