import { useState } from 'react';

export const useCurrencyInput = (initialValue: number = 0) => {
  const [value, setValue] = useState(initialValue);
  
  // Formatear valor para mostrar (con puntos y símbolo $)
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(amount);
  };

  // Formatear para input (solo números con puntos, sin símbolo $)
  const formatForInput = (amount: number): string => {
    return new Intl.NumberFormat('es-CO', {
      minimumFractionDigits: 0
    }).format(amount);
  };

  // Parsear string con formato de vuelta a número
  const parseFromString = (str: string): number => {
    // Remover todo excepto números
    const cleanStr = str.replace(/[^\d]/g, '');
    return cleanStr ? parseInt(cleanStr, 10) : 0;
  };

  // Handler para cambios en el input
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    const numericValue = parseFromString(inputValue);
    setValue(numericValue);
  };

  return {
    value,
    displayValue: formatForInput(value),
    currencyValue: formatCurrency(value),
    handleChange,
    setValue,
    formatCurrency,
    formatForInput
  };
};