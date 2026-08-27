import React, { useEffect, useRef } from 'react';
import { useMotionValue, useSpring } from 'motion/react';

interface NumberTickerProps {
  value: number;
  direction?: 'up' | 'down';
  className?: string;
  delay?: number;
  decimalPlaces?: number;
  prefix?: string;
  suffix?: string;
}

export const NumberTicker: React.FC<NumberTickerProps> = ({
  value,
  direction = 'up',
  delay = 0,
  className = '',
  decimalPlaces = 2,
  prefix = '',
  suffix = '',
}) => {
  const ref = useRef<HTMLSpanElement>(null);
  const motionValue = useMotionValue(direction === 'down' ? value : 0);
  const springValue = useSpring(motionValue, {
    damping: 30,
    stiffness: 100,
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      motionValue.set(value);
    }, delay * 1000);

    return () => clearTimeout(timer);
  }, [motionValue, value, delay]);

  useEffect(() => {
    const unsubscribe = springValue.on('change', (latestValue: any) => {
      if (ref.current) {
        const num = typeof latestValue === 'number' ? latestValue : parseFloat(latestValue) || 0;
        ref.current.textContent = `${prefix}${num.toLocaleString('en-IN', {
          minimumFractionDigits: decimalPlaces,
          maximumFractionDigits: decimalPlaces,
        })}${suffix}`;
      }
    });

    return () => {
      unsubscribe();
    };
  }, [springValue, decimalPlaces, prefix, suffix]);

  return (
    <span ref={ref} className={className}>
      {prefix}
      {value.toLocaleString('en-IN', {
        minimumFractionDigits: decimalPlaces,
        maximumFractionDigits: decimalPlaces,
      })}
      {suffix}
    </span>
  );
};
