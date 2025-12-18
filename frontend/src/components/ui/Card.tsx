// Componente Card reutilizável

import type { ReactNode, HTMLAttributes } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hover?: boolean;
}

export default function Card({
  children,
  padding = 'md',
  hover = false,
  className = '',
  ...props
}: CardProps) {
  const paddings = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  return (
    <div
      className={`
        bg-white rounded-2xl border border-gray-200/60
        shadow-xl
        ${paddings[padding]}
        ${hover ? 'transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 hover:border-indigo-300 cursor-pointer' : ''}
        ${className}
      `}
      style={{
        boxShadow: hover 
          ? '0 20px 60px rgba(0, 0, 0, 0.12), 0 8px 24px rgba(0, 0, 0, 0.08)' 
          : '0 10px 40px rgba(0, 0, 0, 0.1), 0 2px 8px rgba(0, 0, 0, 0.08)'
      }}
      {...props}
    >
      {children}
    </div>
  );
}


