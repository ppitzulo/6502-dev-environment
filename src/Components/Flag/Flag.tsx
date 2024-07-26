import React from 'react';

interface FlagProps {
    label: string;
    value: boolean;
    onToggle: () => void;
}

const Flag: React.FC<FlagProps> = ({ label, value, onToggle }) => {
    const getColor = (flag: boolean) => flag ? '#90ee90' : 'red';

    return (
        <div className="register" onClick={onToggle}>
            <span
                data-tooltip-id="register-tooltip"
                data-tooltip-content={`${label} Flag`}
                className="label"
            >
                {label}
            </span>
            <span className="value" style={{ color: getColor(value) }}>{value ? 'True' : 'False'}</span>
        </div>
    );
};

export default Flag;
