import './RegisterView.css'

const RegisterView = ({ registers }: { registers: any }) => {
    if (!registers) return null;

    return (
        <div className="register-display">
            <h2>CPU Registers</h2>
            <table>
                <tbody className="registers">
                    <tr><td>A:</td><td>{registers.A.toString(16).toUpperCase()}</td></tr>
                    <tr><td>X:</td><td>{registers.X.toString(16).toUpperCase()}</td></tr>
                    <tr><td>Y:</td><td>{registers.Y.toString(16).toUpperCase()}</td></tr>
                    <tr><td>PC:</td><td>{registers.PC.toString(16).toUpperCase()}</td></tr>
                    <tr><td>SP:</td><td>{registers.SP.toString(16).toUpperCase()}</td></tr>
                </tbody>
                <tbody className="status-flags">
                    <tr><td>Carry Flag:</td><td>{registers.carryFlag ? 'True' : 'False'}</td></tr>
                    <tr><td>Zero Flag:</td><td>{registers.zeroFlag ? 'True' : 'False'}</td></tr>
                    <tr><td>Interrupt Disable Flag:</td><td>{registers.interruptDisableFlag ? 'True' : 'False'}</td></tr>
                    <tr><td>Decimal Mode Flag:</td><td>{registers.decimalModeFlag ? 'True' : 'False'}</td></tr>
                    <tr><td>Break Command Flag:</td><td>{registers.breakCommandFlag ? 'True' : 'False'}</td></tr>
                    <tr><td>Overflow Flag:</td><td>{registers.overflowFlag ? 'True' : 'False'}</td></tr>
                    <tr><td>Negative Flag:</td><td>{registers.negativeFlag ? 'True' : 'False'}</td></tr>
                </tbody>
            </table>
        </div>
    );
};

export default RegisterView;
