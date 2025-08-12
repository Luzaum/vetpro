import React from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: React.ReactNode;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  children,
  className = '',
  disabled,
  ...props
}) => {
  const baseClasses = `
    inline-flex items-center justify-center
    font-medium rounded-lg
    transition-all duration-200
    focus:outline-none focus:ring-2 focus:ring-offset-2
    disabled:opacity-50 disabled:cursor-not-allowed
    interactive
  `;

  const variantClasses = {
    primary: `
      bg-primary text-primary-contrast
      hover:bg-primary/90
      focus:ring-primary
      shadow-sm
    `,
    secondary: `
      bg-surface border border-border text-text
      hover:bg-surface-raised
      focus:ring-primary
    `,
    outline: `
      bg-transparent border border-border text-text
      hover:bg-surface hover:border-primary
      focus:ring-primary
    `,
    ghost: `
      bg-transparent text-text
      hover:bg-surface
      focus:ring-primary
    `,
    danger: `
      bg-danger text-white
      hover:bg-danger/90
      focus:ring-danger
    `
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm gap-1.5',
    md: 'px-4 py-2 text-base gap-2',
    lg: 'px-6 py-3 text-lg gap-2'
  };

  const classes = `
    ${baseClasses}
    ${variantClasses[variant]}
    ${sizeClasses[size]}
    ${className}
  `;

  return (
    <motion.button
      className={classes}
      disabled={disabled || loading}
      whileTap={{ scale: 0.98 }}
      {...props}
    >
      {loading ? (
        <Loader2 className="animate-spin" size={size === 'sm' ? 14 : 16} />
      ) : icon ? (
        icon
      ) : null}
      {children}
    </motion.button>
  );
};

export default Button;
