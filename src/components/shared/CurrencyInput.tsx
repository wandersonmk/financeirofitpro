
import { Input } from "@/components/ui/input";
import { forwardRef, useState } from "react";

interface CurrencyInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  value: number;
  onChange: (value: number) => void;
  currency?: string;
}

export const CurrencyInput = forwardRef<HTMLInputElement, CurrencyInputProps>(
  ({ value, onChange, currency = "BRL", className, ...props }, ref) => {
    const [displayValue, setDisplayValue] = useState(() => {
      return formatCurrency(value, currency);
    });

    function formatCurrency(value: number, currency: string) {
      return new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency,
        minimumFractionDigits: 2,
      }).format(value);
    }

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
      let value = e.target.value;
      
      // Remove currency symbol, separators and convert to standard format
      value = value.replace(/[^\d,-]/g, "");
      value = value.replace(/,/g, ".");
      
      // Get last instance of decimal
      const decimalIndex = value.lastIndexOf(".");
      if (decimalIndex !== -1) {
        const wholePart = value.substring(0, decimalIndex).replace(/\./g, "");
        const decimalPart = value.substring(decimalIndex);
        value = wholePart + decimalPart;
      } else {
        value = value.replace(/\./g, "");
      }
      
      const numericValue = parseFloat(value) || 0;
      onChange(numericValue);
      setDisplayValue(formatCurrency(numericValue, currency));
    }

    function handleFocus(e: React.FocusEvent<HTMLInputElement>) {
      e.target.select();
      if (props.onFocus) props.onFocus(e);
    }

    function handleBlur(e: React.FocusEvent<HTMLInputElement>) {
      setDisplayValue(formatCurrency(value, currency));
      if (props.onBlur) props.onBlur(e);
    }

    return (
      <Input
        ref={ref}
        value={displayValue}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        className={className}
        {...props}
      />
    );
  }
);

CurrencyInput.displayName = "CurrencyInput";
