import { describe, expect, it } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useCurrencyInput } from './useCurrencyInput';

describe('useCurrencyInput', () => {
  it('formatea, parsea y sincroniza el valor', () => {
    const { result, rerender } = renderHook(({ initialValue }) => useCurrencyInput(initialValue), {
      initialProps: { initialValue: 123456 },
    });

    expect(result.current.value).toBe(123456);
    expect(result.current.displayValue).toContain('123.456');
    expect(result.current.currencyValue).toContain('$');

    act(() => {
      result.current.handleChange({ target: { value: '$ 50.000' } } as React.ChangeEvent<HTMLInputElement>);
    });

    expect(result.current.value).toBe(50000);

    rerender({ initialValue: 7000 });
    expect(result.current.value).toBe(7000);
  });
});