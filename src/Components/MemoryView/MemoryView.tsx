import React, { useState, useEffect } from 'react';
import './MemoryView.css';

// Function to convert linear memory into a 2D array with 16 bytes per row
const convertMemoryTo2DArray = (memory: number[]) => {
  const rows = [];
  for (let i = 0; i < memory.length; i += 16) {
    rows.push(memory.slice(i, i + 16));
  }
  return rows;
};

const MemoryView = ({ bus, isVisible, setIsVisible }: { bus: any, isVisible: boolean, setIsVisible: React.Dispatch<React.SetStateAction<boolean>> }) => {
  const [memoryData, setMemoryData] = useState<number[][]>([]);
  const [address, setAddress] = useState<string>('0x8000');
  const [displayedAddress, setDisplayedAddress] = useState<string>('0x8000'); // Separate state for displayed address


  useEffect(() => {
    readMemorySpace(parseInt(address, 16));
  }, [])

  const readMemorySpace = (startAddress: number) => {
    const memory = [];
    const startOffset = Math.max(0, startAddress - 64); // Ensure the startOffset is not less than 0
    const endOffset = Math.min(0xFFFF, startAddress + 80); // Ensure the endOffset does not exceed 0xFFFF
  
    for (let address = startOffset; address < endOffset; address++) {
      memory.push(bus.readMemory(address)); 
    }
  
    setMemoryData(convertMemoryTo2DArray(memory));
  };

  const handleBackgroundClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      setIsVisible(false); // Close memory view when clicking outside
    }
  };

  const handleAddressChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAddress(event.target.value);
  };

  const handleSubmit = () => {
    const parsedAddress = parseInt(address, 16);
    if (!isNaN(parsedAddress) && parsedAddress >= 0 && parsedAddress <= 0xFFFF) {
      setDisplayedAddress(address); // Update displayed address
      readMemorySpace(parsedAddress); // Update memory data
    } else {
      alert('Please enter a valid address (0000-FFFF).');
    }
  };

  // Row rendering logic
  const Row = ({ index }: { index: number; }) => {
    const currentAddress = (parseInt(displayedAddress, 16) + index * 16) - 4 * 16; // Use displayedAddress for rendering
    
    return (
      <div className="memory-row">
        <div className="address">
          0x{(currentAddress).toString(16).toUpperCase().padStart(4, '0')}:
        </div>
        <div className="values">
          {memoryData[index].map((value, idx) => (
            <span key={idx} className="memory-value">
              {value.toString(16).toUpperCase().padStart(2, '0')}
            </span>
          ))}
        </div>
      </div>
    );
  };

  return (
    <>
      {isVisible && (
        <div className="memory-view-container" onClick={handleBackgroundClick}>
          <div className="memory-view">
            <h2>Memory View</h2>
            {memoryData.length > 0 && (
              <div>
                {memoryData.map((_, index) => (
                  <Row key={index} index={index} />
                ))}
              </div>
            )}
            <div className="memory-view-controls">
              <input 
                type="text" 
                maxLength={6} 
                value={address} 
                placeholder="Enter address" 
                onChange={handleAddressChange}
              />
              <button className="styled-button" onClick={handleSubmit}>Submit</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MemoryView;
