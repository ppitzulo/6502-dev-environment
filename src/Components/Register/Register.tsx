import React, { KeyboardEvent, ChangeEvent } from 'react';
import './Register.css';

interface RegisterProps {
    label: string;
    value: number;
    tempValue: string | undefined;
    onChange: (event: ChangeEvent<HTMLInputElement>) => void;
    onKeyDown: (event: KeyboardEvent<HTMLInputElement>) => void;
}

const Register: React.FC<RegisterProps> = ({ label, value, tempValue, onChange, onKeyDown }) => {

    const registerDescriptions: { [key: string]: string } = {
        PC: 'Program Counter - Points to the next instruction to execute.',
        SP: 'Stack Pointer - Points to the top of the stack.',
        A: 'Accumulator - Used for arithmetic and logic operations.',
        X: 'Index Register X - Used for indexing memory locations.',
        Y: 'Index Register Y - Used for indexing memory locations.',
    };

    const unabbreviatedLabel = registerDescriptions[label] || label;

    return (
        <div className="register">
            <span
                data-tooltip-id='register-tooltip'
                data-tooltip-content={unabbreviatedLabel}
                className="label"
            >
                {label}
            </span>
            <input
                className={label === 'PC' ? "value program-counter" : "value"}
                maxLength={label === 'PC' ? 6 : 4} // Adjust max length for PC
                value={tempValue !== undefined 
                    ? `0x${tempValue}`
                    : `0x${value.toString(16).toUpperCase()}`}
                onChange={onChange}
                onKeyDown={onKeyDown}
            />
        </div>
    );
};

export default Register;
