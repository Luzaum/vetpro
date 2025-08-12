import React from 'react';
import { Card, CardContent } from './ui/Card';
import { Button } from './ui/Button';
import { motion } from 'framer-motion';

interface ActionCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  action: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary' | 'accent';
  className?: string;
}

export const ActionCard: React.FC<ActionCardProps> = ({
  icon,
  title,
  description,
  action,
  onClick,
  variant = 'secondary',
  className = ''
}) => {
  const variantStyles = {
    primary: 'border-primary/20 bg-primary/5',
    secondary: 'border-border bg-surface',
    accent: 'border-accent/20 bg-accent/5'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={className}
    >
      <Card
        elevation={1}
        interactive
        onClick={onClick}
        className={`${variantStyles[variant]} hover:border-primary/40 transition-colors`}
      >
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            {/* Icon */}
            <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
              {icon}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold text-text mb-2">
                {title}
              </h3>
              <p className="text-sm text-muted mb-4 leading-relaxed">
                {description}
              </p>
              
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onClick();
                }}
              >
                {action}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ActionCard;
