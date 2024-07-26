import React, { useState, KeyboardEvent, ChangeEvent } from 'react';
import './RegisterView.css';
import { RegisterState } from '../../Interfaces/AssemblyStateInterfaces';
import { Tooltip } from 'react-tooltip';
import Register from '../Register/Register';
import Flag from '../Flag/Flag';

const RegisterView = ({ registers, setRegisters }: { registers: RegisterState, setRegisters: React.Dispatch<React.SetStateAction<RegisterState>> }) => {
    if (!registers) return null;

    const [tempRegisters, setTempRegisters] = useState<Partial<RegisterState>>({});


    const toggleFlag = (flagName: keyof RegisterState) => () => {
        setRegisters(prevRegisters => ({
            ...prevRegisters,
            [flagName]: !prevRegisters[flagName],
        }));
    };

    const handleEdit = (event: ChangeEvent<HTMLInputElement>, registerName: keyof RegisterState) => {
        const newValue = event.target.value.replace("0x", ""); // Remove "0x" prefix if present

        if (newValue === "") {
            setTempRegisters(prevRegisters => ({
                ...prevRegisters,
                [registerName]: 0,
            }));
        }
        else {
            const parsedValue = parseInt(newValue, 16);

            setTempRegisters(prevRegisters => ({
                ...prevRegisters,
                [registerName]: isNaN(parsedValue) ? prevRegisters[registerName] : parsedValue,
            }));
        }
    };

    const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>, registerName: keyof RegisterState) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            const newValue = tempRegisters[registerName] || '';

            if (newValue === "") {
                setRegisters(prevRegisters => ({
                    ...prevRegisters,
                    [registerName]: 0,
                }));
            } else {
                const parsedValue = parseInt(newValue.toString());
                if (!isNaN(parsedValue)) {
                    setRegisters(prevRegisters => ({
                        ...prevRegisters,
                        [registerName]: parsedValue,
                    }));
                }
            }

            // Clear the temporary input
            setTempRegisters(prev => ({
                ...prev,
                [registerName]: undefined
            }));

            (event.target as HTMLInputElement).blur();
        }
    };

    return (
        <div className="register-display">
            <div className="register-section">
                <Tooltip id='register-tooltip' place='top' />

                {(['A', 'X', 'Y', 'PC', 'SP'] as const).map((reg) => (
                    <Register
                        key={reg}
                        label={reg}
                        value={registers[reg]}
                        tempValue={tempRegisters[reg]?.toString(16).toUpperCase()}
                        onChange={(event) => handleEdit(event, reg)}
                        onKeyDown={(event) => handleKeyDown(event, reg)}
                    />
                ))}
            </div>

            <div className="flag-section">
                {(['carryFlag', 'zeroFlag', 'interruptDisableFlag', 'decimalModeFlag', 'breakCommandFlag', 'overflowFlag', 'negativeFlag'] as const).map((flag) => (
                    <Flag
                        key={flag}
                        label={flag.charAt(0).toUpperCase()}
                        value={registers[flag]}
                        onToggle={toggleFlag(flag)}
                    />
                ))}
            </div>
        </div>
    );
};

export default RegisterView;