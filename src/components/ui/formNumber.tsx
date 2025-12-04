import { ChangeEvent, HTMLProps, memo } from 'react';
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

interface FormNumberProps extends Omit<HTMLProps<HTMLInputElement>, 'ref'> {
  name: string;
  label: string;
  placeholder?: string;
  suffix?: React.ReactNode;
}

const FormNumber = ({
  label,
  name,
  placeholder,
  required,
  suffix,
  className,
  onChange,
  ...rest
}: FormNumberProps) => {
  const handleNumericInput = (e: ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value.trim();
    const cleaned = inputValue.replace(/\D/g, '');
    return cleaned;
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement>,
    field: ControllerRenderProps<FieldValues, string>
  ) => {
    const value = handleNumericInput(e);
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
          <FormLabel
            className={`text-[0.813rem] font-normal ${error ? 'border-red-500' : 'border-none'}`}
          >
            {label}
            {required && <span className="text-destructive">*</span>}
          </FormLabel>
          <FormControl>
            <div className="relative">
              <Input
                placeholder={placeholder}
                {...field}
                onChange={(e) => handleChange(e, field)}
                className={`${
                  error ? 'border-destructive border' : 'border-none'
                } ${className || ''}`}
                {...rest}
              />
              {suffix && (
                <div className="absolute top-1/2 right-3 -translate-y-[40%] transform">
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

export default memo(FormNumber);
