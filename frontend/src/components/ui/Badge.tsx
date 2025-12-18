// Componente Badge reutilizável

import type { HTMLAttributes } from 'react';

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'success' | 'warning' | 'error' | 'info' | 'neutral';
  size?: 'sm' | 'md';
  children: React.ReactNode;
}

export default function Badge({
  variant = 'neutral',
  size = 'md',
  className = '',
  children,
  ...props
}: BadgeProps) {
  const variants = {
    success: 'bg-green-100 text-green-800',
    warning: 'bg-amber-100 text-amber-800',
    error: 'bg-red-100 text-red-800',
    info: 'bg-blue-100 text-blue-800',
    neutral: 'bg-gray-100 text-gray-800',
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
  };

  return (
    <span
      className={`
        inline-flex items-center font-semibold rounded-full
        ${variants[variant]}
        ${sizes[size]}
        ${className}
      `}
      {...props}
    >
      {children}
    </span>
  );
}





