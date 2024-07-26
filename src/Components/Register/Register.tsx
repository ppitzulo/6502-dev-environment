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
    return (
        <div className="register">
            <span
                data-tooltip-id='register-tooltip'
                data-tooltip-content={`${label} Register`}
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
