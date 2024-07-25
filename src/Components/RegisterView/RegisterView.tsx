import React from 'react';
import './RegisterView.css';
import { RegisterState } from '../../Interfaces/AssemblyStateInterfaces';
import { Tooltip } from 'react-tooltip';

const RegisterView = ({ registers, setRegisters, cpu }: { registers: RegisterState, setRegisters: React.Dispatch<React.SetStateAction<RegisterState>>, cpu: any }) => {
    if (!registers) return null;

    const getColor = (flag: boolean) => flag ? '#90ee90' : 'red';

    const toggleFlag = (flagName: keyof RegisterState) => () => {
        setRegisters(prevRegisters => ({
            ...prevRegisters,
            [flagName]: !prevRegisters[flagName],
        }));
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
                    <span className="value">0x{registers.A.toString(16).toUpperCase()}</span>
                </div>
                <div className="register">
                    <span
                        data-tooltip-id='register-tooltip'
                        data-tooltip-content="Index Register X"
                        className="label"
                    >
                        X
                    </span>
                    <span className="value">0x{registers.X.toString(16).toUpperCase()}</span>
                </div>

                <div className="register">
                    <span
                        data-tooltip-id='register-tooltip'
                        data-tooltip-content="Index Register Y"
                        className="label"
                    >
                        Y
                    </span>
                    <span className="value">0x{registers.Y.toString(16).toUpperCase()}</span>
                </div>

                <div className="register">
                    <span
                        data-tooltip-id='register-tooltip'
                        data-tooltip-content="Program Counter"
                        className="label"
                    >
                        PC
                    </span>
                    <span className="value">0x{registers.PC.toString(16).toUpperCase()}</span>
                </div>

                <div className="register">
                    <span
                        data-tooltip-id='register-tooltip'
                        data-tooltip-content="Stack Pointer"
                        className="label"
                    >
                        SP
                    </span>
                    <span className="value">0x{registers.SP.toString(16).toUpperCase()}</span>
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