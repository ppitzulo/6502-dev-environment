import React from 'react';

interface FlagProps {
    label: string;
    value: boolean;
    onToggle: () => void;
}

const Flag: React.FC<FlagProps> = ({ label, value, onToggle }) => {
    const getColor = (flag: boolean) => flag ? '#90ee90' : 'red';

    const formattedLabel = label.replace(/([a-z])([A-Z])/g, '$1 $2'); // Add space between lowercase and uppercase character

    return (
        <div className="register" onClick={onToggle}>
            <span
                data-tooltip-id="register-tooltip"
                data-tooltip-content={formattedLabel.charAt(0).toUpperCase() + formattedLabel.slice(1)}
                className="label"
            >
                {formattedLabel.charAt(0).toUpperCase()}
            </span>
            <span className="value" style={{ color: getColor(value) }}>{value ? 'T' : 'F'}</span>
        </div>
    );
};

export default Flag;
