'use client';

import * as React from 'react';
import { useState, useRef, useEffect, HTMLProps } from 'react';
import { memo } from 'react';
import { FormField, FormItem, FormControl, FormMessage } from './form';
import {
  ControllerRenderProps,
  FieldValues,
  useFormContext,
} from 'react-hook-form';

interface FourDigitInputProps extends Omit<HTMLProps<HTMLInputElement>, 'ref'> {
  name: string;
  value?: string;
  disabled?: boolean;
  className?: string;
  hidePin?: boolean;
}

const FormPinInput: React.FC<FourDigitInputProps> = ({
  name,
  value,
  disabled,
  className,
  hidePin = false,
  ...rest
}) => {
  const { control } = useFormContext();
  const [digits, setDigits] = useState<string[]>(
    Array(4)
      .fill('')
      .map((_, i) => (value && value[i]) || '')
  );
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    setDigits(
      Array(4)
        .fill('')
        .map((_, i) => (value && value[i]) || '')
    );
  }, [value]);

  const handleChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>,
    field: ControllerRenderProps<FieldValues, string>
  ) => {
    if (disabled) return;
    const newValue = e.target.value;
    if (/^\d*$/.test(newValue) && newValue.length <= 1) {
      const newDigits = [...digits];
      newDigits[index] = newValue;
      setDigits(newDigits);

      const newCode = newDigits.join('');
      field.onChange(newCode);

      if (newValue && index < 3) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (disabled) return;
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (
    index: number,
    e: React.ClipboardEvent<HTMLInputElement>,
    field: ControllerRenderProps<FieldValues, string>
  ) => {
    if (index !== 0) {
      return;
    }
    if (disabled || index !== 0) return;
    const pastedData = e.clipboardData.getData('text').trim();
    if (/^\d{1,4}$/.test(pastedData)) {
      const newDigits = Array(4)
        .fill('')
        .map((_, i) => pastedData[i] || '');
      setDigits(newDigits);
      field.onChange(pastedData);
      const lastFilledIndex = Math.min(pastedData.length - 1, 3);
      inputRefs.current[lastFilledIndex]?.focus();
    }
    e.preventDefault();
  };

  return (
    <FormField
      control={control}
      name={name}
      render={({ field, fieldState: { error } }) => (
        <FormItem>
          <FormControl></FormControl>
          <div className={`flex justify-center gap-2 ${className}`}>
            {Array(4)
              .fill(null)
              .map((_, index) => (
                <input
                  key={index}
                  {...field}
                  ref={(el) => {
                    inputRefs.current[index] = el;
                  }}
                  type="text"
                  autoComplete="off"
                  inputMode="numeric"
                  maxLength={1}
                  value={digits[index]}
                  onChange={(e) => handleChange(index, e, field)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={(e) => handlePaste(index, e, field)}
                  disabled={disabled}
                  {...rest}
                  className={`size-14 rounded-xl border bg-gray-100 text-center text-base focus:outline-none sm:size-16 ${
                    error
                      ? 'border-destructive border-1'
                      : digits[index]
                        ? 'border-primary bg-primary/5 border-2'
                        : 'border-none'
                  } font-mono shadow-none ${hidePin ? 'hide-pin' : ''}`}
                />
              ))}
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default memo(FormPinInput);
