import { ChangeEvent, HTMLInputTypeAttribute, HTMLProps, memo } from 'react';
import {
  ControllerRenderProps,
  FieldValues,
  useFormContext,
} from 'react-hook-form';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from './form';
import { Input } from './input';

interface FormInputProps extends Omit<HTMLProps<HTMLInputElement>, 'ref'> {
  name: string;
  label?: string;
  placeholder?: string;
  type?: HTMLInputTypeAttribute;
  suffix?: React.ReactNode;
  helperText?: string;
}

const FormInput = ({
  label,
  name,
  placeholder,
  type,
  required,
  suffix,
  helperText,
  className,
  onChange,
  ...rest
}: FormInputProps) => {
  const handleNumericInput = (e: ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value.trim();
    const cleaned = inputValue.replace(/(?!^\+|\d)\D/g, '');
    return cleaned;
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement>,
    field: ControllerRenderProps<FieldValues, string>
  ) => {
    const value = type === 'tel' ? handleNumericInput(e) : e.target.value;
    field.onChange(value);
    onChange?.(e);
  };

  const { control } = useFormContext();

  return (
    <FormField
      control={control}
      name={name}
      render={({ field, fieldState: { error } }) => (
        <FormItem className="gap-1.5">
          {label && (
            <FormLabel className="text-body-text-2 text-sm font-normal capitalize">
              {label}
              {required && <span className="text-destructive">*</span>}
            </FormLabel>
          )}
          <FormControl>
            <div className="relative">
              {helperText && (
                <p className="text-body-text-1 absolute top-1/12 left-3 -translate-y-1/12 text-xs font-normal capitalize">
                  {helperText}
                </p>
              )}
              <Input
                placeholder={placeholder}
                {...field}
                onChange={(e) => handleChange(e, field)}
                type={type}
                className={`${
                  error ? 'border-destructive border' : 'border-none'
                } ${className || ''}`}
                {...rest}
              />
              {suffix && (
                <div className="absolute top-1/2 right-3 -translate-y-1/2 transform">
                  {suffix}
                </div>
              )}
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default memo(FormInput);
