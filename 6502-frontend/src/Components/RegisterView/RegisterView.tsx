import './RegisterView.css';

const RegisterView = ({ registers }: { registers: any }) => {
    if (!registers) return null;

    return (
        <div className="register-display">
            <h2>CPU Registers</h2>
            <div className="register-section">
                <div className="register">
                    <span className="label">A</span>
                    <span className="value">0x{registers.A.toString(16).toUpperCase()}</span>
                </div>
                <div className="register">
                    <span className="label">X</span>
                    <span className="value">0x{registers.X.toString(16).toUpperCase()}</span>
                </div>
                <div className="register">
                    <span className="label">Y</span>
                    <span className="value">0x{registers.Y.toString(16).toUpperCase()}</span>
                </div>
                <div className="register">
                    <span className="label">PC</span>
                    <span className="value">0x{registers.PC.toString(16).toUpperCase()}</span>
                </div>
                <div className="register">
                    <span className="label">SP</span>
                    <span className="value">0x{registers.SP.toString(16).toUpperCase()}</span>
                </div>
            </div>

            <h2>Status Flags</h2>
            <div className="flag-section">
                <div className="register">
                    <span className="label">C</span>
                    <span className="value">{registers.carryFlag ? 'True' : 'False'}</span>
                </div>
                <div className="register">
                    <span className="label">Z</span>
                    <span className="value">{registers.zeroFlag ? 'True' : 'False'}</span>
                </div>
                <div className="register">
                    <span className="label">I</span>
                    <span className="value">{registers.interruptDisableFlag ? 'True' : 'False'}</span>
                </div>
                <div className="register">
                    <span className="label">D</span>
                    <span className="value">{registers.decimalModeFlag ? 'True' : 'False'}</span>
                </div>
                <div className="register">
                    <span className="label">B</span>
                    <span className="value">{registers.breakCommandFlag ? 'True' : 'False'}</span>
                </div>
                <div className="register">
                    <span className="label">O</span>
                    <span className="value">{registers.overflowFlag ? 'True' : 'False'}</span>
                </div>
                <div className="register">
                    <span className="label">N</span>
                    <span className="value">{registers.negativeFlag ? 'True' : 'False'}</span>
                </div>
            </div>
        </div>
    );
};

export default RegisterView;
