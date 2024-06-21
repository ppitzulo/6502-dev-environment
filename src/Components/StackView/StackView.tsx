import { useState, useEffect } from 'react';
import './StackView.css';

interface StackProps {
  bus: any;
  SP: number;
}

const StackView = ({ bus, SP }: StackProps) => {
  const [stackContents, setStackContents] = useState<number[]>([]);

  useEffect(() => {
    const readStack = () => {
      const stack = [];
      for (let i = 0x0100; i <= 0x01FF; i++) {
        stack.push(bus.readMemory(i));
      }
      setStackContents(stack);
    };

    readStack();

    // Optionally, you can set an interval to update the stack contents periodically
    const intervalId = setInterval(readStack, 1000);

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, [bus]);

  return (
    <div className="stack">
      <h2 className="header">Stack</h2>
      <div className="stack-header">
        <div>Address</div>
        <div>Value</div>
      </div>
      <div className="stack-body">
        {stackContents.slice().reverse().map((value, index) => {
          const address = 0x01FF - index;
          return (
            <div className={`stack-row ${address === (0x0100 + SP) ? 'highlight' : ''}`} key={index}>
              <div className="address">
                {`0x${address.toString(16).toUpperCase()}`}
              </div>
              <div>{`0x${value.toString(16).toUpperCase()}`}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StackView;
