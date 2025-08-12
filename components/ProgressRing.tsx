import React from 'react';
import { motion } from 'framer-motion';

interface ProgressRingProps {
  value: number; // 0-100
  size?: number;
  strokeWidth?: number;
  label?: string;
  helper?: string;
  showValue?: boolean;
  className?: string;
}

export const ProgressRing: React.FC<ProgressRingProps> = ({
  value,
  size = 120,
  strokeWidth = 8,
  label,
  helper,
  showValue = true,
  className = ''
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (value / 100) * circumference;

  return (
    <div className={`flex flex-col items-center ${className}`}>
      <div className="relative">
        {/* Background Circle */}
        <svg
          width={size}
          height={size}
          className="transform -rotate-90"
        >
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="var(--color-border-muted)"
            strokeWidth={strokeWidth}
            fill="none"
          />
          
          {/* Progress Circle */}
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="var(--color-primary)"
            strokeWidth={strokeWidth}
            fill="none"
            strokeLinecap="round"
            strokeDasharray={strokeDasharray}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ 
              duration: 0.8, 
              ease: "easeOut",
              delay: 0.1
            }}
            style={{
              filter: 'drop-shadow(0 0 8px var(--color-primary))'
            }}
          />
        </svg>

        {/* Center Content */}
        {showValue && (
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-center"
            >
              <div className="text-2xl font-bold text-text">
                {Math.round(value)}%
              </div>
            </motion.div>
          </div>
        )}
      </div>

      {/* Label and Helper */}
      {(label || helper) && (
        <div className="mt-4 text-center">
          {label && (
            <div className="text-sm font-medium text-text mb-1">
              {label}
            </div>
          )}
          {helper && (
            <div className="text-xs text-muted">
              {helper}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProgressRing;
