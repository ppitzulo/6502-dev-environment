import React, { useState, KeyboardEvent, ChangeEvent } from 'react';
import './RegisterView.css';
import { RegisterState } from '../../Interfaces/AssemblyStateInterfaces';
import { Tooltip } from 'react-tooltip';

const RegisterView = ({ registers, setRegisters, cpu }: { registers: RegisterState, setRegisters: React.Dispatch<React.SetStateAction<RegisterState>>, cpu: any }) => {
    if (!registers) return null;

    const [tempRegisters, setTempRegisters] = useState<Partial<RegisterState>>({});

    const getColor = (flag: boolean) => flag ? '#90ee90' : 'red';

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

                <div className="register">
                    <span
                        data-tooltip-id='register-tooltip'
                        data-tooltip-content="Accumulator Register"
                        className="label"
                    >
                        A
                    </span>
                    <input
                        className="value"
                        maxLength={4}
                        value={`0x${registers.A.toString(16).toUpperCase()}`}
                        onChange={(event) => handleEdit(event, "A")}
                        onKeyDown={(event) => handleKeyDown(event, "A")}
                    />
                </div>

                <div className="register">
                    <span
                        data-tooltip-id='register-tooltip'
                        data-tooltip-content="Index Register X"
                        className="label"
                    >
                        X
                    </span>
                    <input
                        className="value"
                        maxLength={4}
                        value={`0x${registers.X.toString(16).toUpperCase()}`}
                        onChange={(event) => handleEdit(event, "X")}
                        onKeyDown={(event) => handleKeyDown(event, "X")}
                    />
                </div>

                <div className="register">
                    <span
                        data-tooltip-id='register-tooltip'
                        data-tooltip-content="Index Register Y"
                        className="label"
                    >
                        Y
                    </span>
                    <input
                        className="value"
                        maxLength={4}
                        value={`0x${registers.Y.toString(16).toUpperCase()}`}
                        onChange={(event) => handleEdit(event, "Y")}
                        onKeyDown={(event) => handleKeyDown(event, "Y")}
                    />
                </div>

                <div className="register">
                    <span
                        data-tooltip-id='register-tooltip'
                        data-tooltip-content="Program Counter"
                        className="label"
                    >
                        PC
                    </span>
                    <input
                        className="value program-counter"
                        maxLength={6}
                        value={tempRegisters["PC"] !== undefined 
                            ? `0x${tempRegisters["PC"].toString(16).toUpperCase()}`
                            : `0x${registers["PC"].toString(16).toUpperCase()}`}
                        onChange={(event) => handleEdit(event, "PC")}
                        onKeyDown={(event) => handleKeyDown(event, "PC")}
                    />
                </div>

                <div className="register">
                    <span
                        data-tooltip-id='register-tooltip'
                        data-tooltip-content="Stack Pointer"
                        className="label"
                    >
                        SP
                    </span>
                    <input
                        className="value"
                        maxLength={4}
                        value={`0x${registers.SP.toString(16).toUpperCase()}`}
                        onChange={(event) => handleEdit(event, "SP")}
                        onKeyDown={(event) => handleKeyDown(event, "SP")}
                    />
                </div>
            </div>

            <div className="flag-section">
                <div className="register" onClick={toggleFlag('carryFlag')}>
                    <span
                        data-tooltip-id="register-tooltip"
                        data-tooltip-content="Carry Flag"
                        className="label"
                    >
                        C
                    </span>
                    <span className="value" style={{ color: getColor(registers.carryFlag) }}>{registers.carryFlag ? 'True' : 'False'}</span>
                </div>

                <div className="register" onClick={toggleFlag('zeroFlag')}>
                    <span
                        data-tooltip-id="register-tooltip"
                        data-tooltip-content="Zero Flag"
                        className="label"
                    >
                        Z
                    </span>
                    <span className="value" style={{ color: getColor(registers.zeroFlag) }}>{registers.zeroFlag ? 'True' : 'False'}</span>
                </div>

                <div className="register" onClick={toggleFlag('interruptDisableFlag')}>
                    <span
                        data-tooltip-id="register-tooltip"
                        data-tooltip-content="Interrupt Disable Flag"
                        className="label"
                    >
                        I
                    </span>
                    <span className="value" style={{ color: getColor(registers.interruptDisableFlag) }}>{registers.interruptDisableFlag ? 'True' : 'False'}</span>
                </div>

                <div className="register" onClick={toggleFlag('decimalModeFlag')}>
                    <span
                        data-tooltip-id="register-tooltip"
                        data-tooltip-content="Decimal Mode Flag"
                        className="label"
                    >
                        D
                    </span>
                    <span className="value" style={{ color: getColor(registers.decimalModeFlag) }}>{registers.decimalModeFlag ? 'True' : 'False'}</span>
                </div>

                <div className="register" onClick={toggleFlag('breakCommandFlag')}>
                    <span
                        data-tooltip-id="register-tooltip"
                        data-tooltip-content="Break Command Flag"
                        className="label"
                    >
                        B
                    </span>
                    <span className="value" style={{ color: getColor(registers.breakCommandFlag) }}>{registers.breakCommandFlag ? 'True' : 'False'}</span>
                </div>

                <div className="register" onClick={toggleFlag('overflowFlag')}>
                    <span
                        data-tooltip-id="register-tooltip"
                        data-tooltip-content="Overflow Flag"
                        className="label"
                    >
                        O
                    </span>
                    <span className="value" style={{ color: getColor(registers.overflowFlag) }}>{registers.overflowFlag ? 'True' : 'False'}</span>
                </div>

                <div className="register" onClick={toggleFlag('negativeFlag')}>
                    <span
                        data-tooltip-id="register-tooltip"
                        data-tooltip-content="Negative Flag"
                        className="label"
                    >
                        N
                    </span>
                    <span className="value" style={{ color: getColor(registers.negativeFlag) }}>{registers.negativeFlag ? 'True' : 'False'}</span>
                </div>
            </div>
        </div>
    );
};

export default RegisterView;