import React from 'react';
import Spinner from '../Spinner/Spinner';

interface EmulatorControlsProps {
  runCpu: () => void;
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
  resetCpu,
  toggleSubmitted,
  assemblyState,
  message
}) => {
  return (
    <div className="emulator-controls">
      <button onClick={runCpu} disabled={!assemblyState.isAssembled}>Run CPU</button>
      <button onClick={resetCpu}>Reset CPU</button>
      <button onClick={toggleSubmitted}>Assemble</button>
      {message && <div className="assembly-message">{message}</div>}
      {assemblyState.isSubmitted && !assemblyState.isError && <Spinner />}
    </div>
  );
};

export default EmulatorControls;