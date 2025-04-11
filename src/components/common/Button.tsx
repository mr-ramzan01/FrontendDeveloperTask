'use client';

import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'solid' | 'social' | 'outline';
  loading?: boolean;
  icon?: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'solid',
  loading = false,
  icon,
  className = '',
  ...props
}) => {

  return (
    <button
      className={`${variant == "solid" ? "bg-[#8854C0]" : variant === "social" ? "bg-[#1D1E26] border border-[#30303D]" : "bg-[]"} rounded-lg w-full h-[50px] ${loading ? 'opacity-70 cursor-not-allowed' : ''} ${className}`}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading ? (
        <div className="flex items-center justify-center">
          <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full mr-2"></div>
          <span>Loading...</span>
        </div>
      ) : (
        <div className="flex items-center justify-center">
          {icon && <span className="mr-2">{icon}</span>}
          {children}
        </div>
      )}
    </button>
  );
};

export default Button; 