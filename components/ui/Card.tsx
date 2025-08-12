import React from 'react';
import { motion } from 'framer-motion';

interface CardProps {
  children: React.ReactNode;
  elevation?: 0 | 1 | 2 | 3;
  interactive?: boolean;
  className?: string;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({
  children,
  elevation = 1,
  interactive = false,
  className = '',
  onClick,
  ...props
}) => {
  const baseClasses = `
    rounded-lg border
    transition-all duration-200
  `;

  const elevationClasses = {
    0: 'elevation-0',
    1: 'elevation-1',
    2: 'elevation-2',
    3: 'elevation-3'
  };

  const interactiveClasses = interactive ? 'interactive cursor-pointer' : '';

  const classes = `
    ${baseClasses}
    ${elevationClasses[elevation]}
    ${interactiveClasses}
    ${className}
  `;

  const Component = interactive ? motion.div : 'div';

  return (
    <Component
      className={classes}
      onClick={onClick}
      whileHover={interactive ? { y: -2 } : undefined}
      whileTap={interactive ? { y: 0 } : undefined}
      {...props}
    >
      {children}
    </Component>
  );
};

// Card sub-components
export const CardHeader: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = ''
}) => (
  <div className={`p-6 pb-0 ${className}`}>
    {children}
  </div>
);

export const CardContent: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = ''
}) => (
  <div className={`p-6 ${className}`}>
    {children}
  </div>
);

export const CardFooter: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = ''
}) => (
  <div className={`p-6 pt-0 ${className}`}>
    {children}
  </div>
);

export default Card;
