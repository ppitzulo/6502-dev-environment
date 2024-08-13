import React from 'react';

interface FlagProps {
    label: string;
    value: boolean;
    onToggle: () => void;
}

const extractFlagLabel = (flag: string): string => {
    const label = flag.replace(/Flag$/, '');
    return label.charAt(0).toUpperCase() + label.slice(1);
};

const Flag: React.FC<FlagProps> = ({ label, value, onToggle }) => {
    const getColor = (flag: boolean) => flag ? '#90ee90' : 'red';

    return (
        <div className="register" onClick={onToggle}>
            <span
                data-tooltip-id="register-tooltip"
                data-tooltip-content={`${extractFlagLabel(label)} Flag`}
                className="label"
            >
                {label.charAt(0).toUpperCase()}
            </span>
            <span className="value" style={{ color: getColor(value) }}>{value ? 'T' : 'F'}</span>
        </div>
    );
};

export default Flag;
