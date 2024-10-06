import React from 'react';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options: SelectOption[];
  error?: string;
}

export const Select: React.FC<SelectProps> = ({ options, error, ...props }) => {
  return (
    <div>
      <select
        {...props}
        className={`border rounded px-3 py-2 w-full ${error ? 'border-red-500' : 'border-gray-300'}`}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};