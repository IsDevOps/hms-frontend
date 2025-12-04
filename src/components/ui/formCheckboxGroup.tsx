'use client';

import { useFormContext } from 'react-hook-form';

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from './form';
import { Checkbox } from './checkbox';

interface Option {
  key: string;
  label: string;
  value: string;
  description?: string;
}
interface FormCheckboxProps {
  name: string;
  label?: string;
  options: Option[];
  disabled?: boolean;
  required?: boolean;
  disabledFields?: string[] | null;
  onChange?: (checked?: string) => void;
  className?: string;
}

const FormCheckboxGroup = ({
  options,
  name,
  label,
  required = false,
  disabled = false,
  disabledFields,
  className,
  onChange,
}: FormCheckboxProps) => {
  const { control } = useFormContext();

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          {label && (
            <FormLabel className="mb-1.5 text-sm font-normal capitalize">
              {label}
              {required && <span className="text-destructive">*</span>}
            </FormLabel>
          )}
          <div className={`grid gap-3 ${className}`}>
            {options.map((item) => {
              const isChecked = field.value?.includes(item.value);

              return (
                <FormItem
                  key={item.key}
                  className="border-border flex gap-2 rounded-lg border px-4 has-[button:disabled]:opacity-100"
                >
                  <FormControl>
                    <Checkbox
                      className="my-4 size-5"
                      checked={isChecked}
                      disabled={
                        disabled || disabledFields?.includes(item.value)
                      }
                      onCheckedChange={(checked) => {
                        const currentValues = field.value ?? [];
                        const updatedValue = checked
                          ? [...currentValues, item.value]
                          : currentValues.filter(
                              (val: any) => val !== item.value
                            );
                        field.onChange(updatedValue);
                        onChange?.(item.value);
                      }}
                    />
                  </FormControl>
                  <FormLabel className="w-full py-4 text-sm font-normal peer-disabled:opacity-100">
                    {item.label}
                  </FormLabel>
                </FormItem>
              );
            })}
          </div>

          <FormMessage />
        </FormItem>
      )}
    />
  );
};
export default FormCheckboxGroup;
