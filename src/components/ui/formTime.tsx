import { ChangeEvent, HTMLProps, memo, useRef } from 'react';
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

interface FormTimeProps extends Omit<HTMLProps<HTMLInputElement>, 'ref'> {
  name: string;
  label: string;
  placeholder?: string;
  suffix?: React.ReactNode;
}

const FormTime = ({
  label,
  name,
  placeholder,
  required,
  className,
  onChange,
  suffix,
  ...rest
}: FormTimeProps) => {
  const { control } = useFormContext();
  const inputEl = useRef<HTMLInputElement>(null);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement>,
    field: ControllerRenderProps<FieldValues, string>
  ) => {
    field.onChange(e.target.value);
    onChange?.(e);
  };

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
                type="time"
                placeholder={placeholder}
                {...field}
                ref={inputEl}
                value={field.value || ''}
                onChange={(e) => handleChange(e, field)}
                className={`${
                  error ? 'border-destructive border' : 'border-none'
                } ${className || ''}`}
                {...rest}
              />
              {suffix && (
                <div
                  role="button"
                  onClick={(e) => {
                    e.preventDefault();
                    inputEl.current?.showPicker();
                  }}
                  className="absolute top-1/2 right-3 -translate-y-1/2 transform cursor-pointer"
                >
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

export default memo(FormTime);
