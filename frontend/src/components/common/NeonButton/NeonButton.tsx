import React from 'react';

import './NeonButton.css';

type NeonButtonTone = 'emerald' | 'azure' | 'amber' | 'cyan';
type NeonButtonSize = 'md' | 'sm';

type NeonButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  tone?: NeonButtonTone;
  size?: NeonButtonSize;
  fullWidth?: boolean;
};

const NeonButton: React.FC<NeonButtonProps> = ({
  tone = 'azure',
  size = 'md',
  fullWidth = false,
  className,
  type = 'button',
  children,
  ...props
}) => {
  const buttonClass = [
    'neon-btn',
    `tone-${tone}`,
    `size-${size}`,
    fullWidth ? 'full-width' : '',
    className ?? '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button type={type} className={buttonClass} {...props}>
      <span className="label">{children}</span>
    </button>
  );
};

export default NeonButton;
