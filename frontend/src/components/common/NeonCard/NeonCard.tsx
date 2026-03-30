import React from 'react';
import clsx from 'clsx';

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
  const classes = clsx('neon-card', className);

  return (
    <Tag className={classes} {...props}>
      {children}
    </Tag>
  );
};

export default NeonCard;
