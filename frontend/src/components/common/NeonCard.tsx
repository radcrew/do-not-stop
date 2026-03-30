import React from 'react';

import './NeonCard.css';

type NeonCardProps = React.HTMLAttributes<HTMLElement> & {
  as?: 'article' | 'div' | 'section';
};

const NeonCard: React.FC<NeonCardProps> = ({
  as = 'article',
  className,
  children,
  ...props
}) => {
  const Tag = as;
  const classes = ['neon-card', className ?? ''].filter(Boolean).join(' ');

  return (
    <Tag className={classes} {...props}>
      {children}
    </Tag>
  );
};

export default NeonCard;
