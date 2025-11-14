import React from 'react';
import { useCurrencyInput } from '../hooks/useCurrencyInput';

interface CurrencyInputProps {
  value?: number;
  onChange?: (value: number) => void;
  placeholder?: string;
  className?: string;
  id?: string;
  name?: string;
  required?: boolean;
}

export const CurrencyInput: React.FC<CurrencyInputProps> = ({
  value = 0,
  onChange,
  placeholder = "Ingresa el monto",
  className = "",
  id,
  name,
  required = false
}) => {
  const { displayValue, handleChange: handleInputChange } = useCurrencyInput(value);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleInputChange(e);
    const numericValue = parseInt(e.target.value.replace(/[^\d]/g, ''), 10) || 0;
    onChange?.(numericValue);
  };

  return (
    <div className="relative">
      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm">
        $
      </span>
      <input
        type="text"
        id={id}
        name={name}
        value={displayValue}
        onChange={handleChange}
        placeholder={placeholder}
        required={required}
        className={`${className}`}
      />
    </div>
  );
};