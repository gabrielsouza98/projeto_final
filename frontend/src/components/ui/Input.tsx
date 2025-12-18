// Componente Input reutilizável

import type { InputHTMLAttributes, TextareaHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export function Input({ label, error, helperText, className = '', ...props }: InputProps) {
  const inputId = props.id || `input-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={inputId} className="block text-sm font-bold text-gray-800 mb-2.5">
          {label}
          {props.required && <span className="text-red-500 ml-1.5 font-bold">*</span>}
        </label>
      )}
      <input
        id={inputId}
        className={`
          w-full px-5 py-3.5 text-base
          border-2 rounded-xl
          bg-white
          text-gray-900
          placeholder-gray-400
          transition-all duration-300
          shadow-sm
          focus:outline-none focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 focus:shadow-lg
          hover:border-gray-400 hover:shadow-md
          disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed
          ${error ? 'border-red-400 focus:ring-red-100 focus:border-red-500' : 'border-gray-300'}
          ${className}
        `}
        style={{
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)'
        }}
        {...props}
      />
      {error && (
        <p className="mt-1.5 text-sm text-red-600 flex items-center">
          <span className="mr-1">⚠️</span>
          {error}
        </p>
      )}
      {helperText && !error && (
        <p className="mt-1.5 text-sm text-gray-500">{helperText}</p>
      )}
    </div>
  );
}

export function Textarea({ label, error, helperText, className = '', ...props }: TextareaProps) {
  const textareaId = props.id || `textarea-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={textareaId} className="block text-sm font-semibold text-gray-900 mb-1.5">
          {label}
          {props.required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <textarea
        id={textareaId}
        className={`
          w-full px-4 py-2.5 text-base
          border rounded-lg
          bg-white
          text-gray-900
          placeholder-gray-400
          transition-all duration-200
          focus:outline-none focus:ring-2 focus:ring-[#6366F1] focus:border-transparent
          disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed
          resize-vertical
          ${error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300'}
          ${className}
        `}
        {...props}
      />
      {error && (
        <p className="mt-1.5 text-sm text-red-600 flex items-center">
          <span className="mr-1">⚠️</span>
          {error}
        </p>
      )}
      {helperText && !error && (
        <p className="mt-1.5 text-sm text-gray-500">{helperText}</p>
      )}
    </div>
  );
}



