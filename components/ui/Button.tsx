import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline';
}

export function Button({ children, variant = 'default', ...props }: ButtonProps) {
  const baseClasses = "px-4 py-2 rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-offset-2";
  const variantClasses = variant === 'outline' 
    ? "border border-blue-500 text-blue-500 hover:bg-blue-50" 
    : "bg-blue-500 text-white hover:bg-blue-600";

  return (
    <button className={`${baseClasses} ${variantClasses}`} {...props}>
      {children}
    </button>
  );
}