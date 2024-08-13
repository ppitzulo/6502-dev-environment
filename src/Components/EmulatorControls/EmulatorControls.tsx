import React from 'react';
import Spinner from '../Spinner/Spinner';
import './EmulatorControls.css';

interface EmulatorControlsProps {
  runCpu: () => void;
  stepCpu: () => void;
  resetCpu: () => void;
  toggleSubmitted: () => void;
  toggleIsVisible: () => void;
  assemblyState: {
    isAssembled: boolean;
    isSubmitted: boolean;
    isError: boolean;
  };
  message: string | null;
}

const EmulatorControls: React.FC<EmulatorControlsProps> = ({
  runCpu,
  stepCpu,
  resetCpu,
  toggleSubmitted,
  toggleIsVisible,
  assemblyState,
  message
}) => {
  return (
    <div className="emulator-controls">
      <button className="styled-button" onClick={runCpu} disabled={!assemblyState.isAssembled}>Run</button>
      <button className="styled-button" onClick={stepCpu} disabled={!assemblyState.isAssembled}>Step</button>
      <button className="styled-button" onClick={resetCpu}>Reset</button>
      <button className="styled-button" onClick={toggleSubmitted}>Assemble</button>
      <button className="styled-button" onClick={toggleIsVisible}>View #</button>
      {message && <div className="assembly-message">{message}</div>}
      {assemblyState.isSubmitted && !assemblyState.isError && <Spinner />}
    </div>
  );
};

export default EmulatorControls;