import { useState, useEffect, useRef } from 'react';
import './StackView.css';

interface StackProps {
  bus: any;
  SP: number;
}

const StackView = ({ bus, SP }: StackProps) => {
  const [stackContents, setStackContents] = useState<number[]>([]);
  const stackPointerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const readStack = () => {
      const stack = [];
      for (let i = 0x0100; i <= 0x01FF; i++) {
        stack.push(bus.readMemory(i));
      }
      setStackContents(stack);
    };

    readStack();

    const intervalId = setInterval(readStack, 1000);

    return () => clearInterval(intervalId);
  }, [bus]);

  useEffect(() => {
    if (stackPointerRef.current) {
      stackPointerRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }
  , [stackContents]);

  return (
    <div className="stack">
      <div className="stack-header">
        <div>Address</div>
        <div>Value</div>
      </div>
      <div className="stack-body">
        {stackContents.slice().reverse().map((value, index) => {
          const address = 0x01FF - index;
          return (
            <div className={`stack-row ${address === (0x0100 + SP) ? 'highlight' : ''}`} key={index} ref={address === (0x0100 + SP) ? stackPointerRef : null}>
              <div className="address">
                {`0x${address.toString(16).toUpperCase()}`}
              </div>
              <div className="value">{`0x${value.toString(16).toUpperCase()}`}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StackView;
