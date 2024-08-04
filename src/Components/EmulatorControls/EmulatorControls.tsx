import React from 'react';
import Spinner from '../Spinner/Spinner';

interface EmulatorControlsProps {
  runCpu: () => void;
  stepCpu: () => void;
  resetCpu: () => void;
  toggleSubmitted: () => void;
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
  assemblyState,
  message
}) => {
  return (
    <div className="emulator-controls">
      <button onClick={runCpu} disabled={!assemblyState.isAssembled}>Run</button>
      <button onClick={stepCpu} disabled={!assemblyState.isAssembled}>Step</button>
      <button onClick={resetCpu}>Reset</button>
      <button onClick={toggleSubmitted}>Assemble</button>
      {message && <div className="assembly-message">{message}</div>}
      {assemblyState.isSubmitted && !assemblyState.isError && <Spinner />}
    </div>
  );
};

export default EmulatorControls;