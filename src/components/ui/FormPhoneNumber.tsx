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
import NigFlag from '@/icons/NigFlagIcon';
import { Input } from './input';

interface FormPhoneNumberProps
  extends Omit<HTMLProps<HTMLInputElement>, 'ref'> {
  name: string;
  label: string;
  placeholder?: string;
  required?: boolean;
  onChangeClick?: () => void;
  prefixBgColor?: string;
}

const FormPhoneNumber = ({
  label,
  name,
  placeholder,
  required,
  className,
  onChangeClick,
  prefixBgColor,
  ...rest
}: FormPhoneNumberProps) => {
  const { control } = useFormContext();

  const handleNumericInput = (e: ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value.trim();
    return inputValue.replace(/\D/g, '');
  };

  return (
    <FormField
      control={control}
      name={name}
      render={({ field, fieldState: { error } }) => {
        const handleChange = (
          e: ChangeEvent<HTMLInputElement>,
          field: ControllerRenderProps<FieldValues, string>
        ) => {
          const value = handleNumericInput(e);
          field.onChange(value);
        };

        return (
          <FormItem className="gap-1.5">
            <FormLabel
              className={`flex items-center justify-between text-[0.813rem] font-normal ${
                error ? 'text-destructive' : ''
              }`}
            >
              <span>
                {label}
                {required && <span className="text-destructive ml-1">*</span>}
              </span>
              {rest.disabled !== false && onChangeClick && (
                <span
                  role="button"
                  className="text-primary cursor-pointer text-sm font-medium underline hover:underline"
                  onClick={onChangeClick}
                >
                  Change
                </span>
              )}
            </FormLabel>
            <FormControl>
              <div className="flex w-full items-center gap-[0.12rem] overflow-hidden rounded-[0.5rem]">
                <div
                  className={`flex h-full items-center rounded-tl-[0.5rem] rounded-bl-[0.5rem] px-4 py-3 ${
                    prefixBgColor ?? 'bg-gray-100'
                  } ${error ? 'border-destructive border' : 'border-none'}`}
                >
                  <span className="text-2xl">
                    <NigFlag className="text-green-600" />
                  </span>
                  <span className="text-body-text-2/80 ml-2 text-base font-medium">
                    +234
                  </span>
                </div>
                <Input
                  type="tel"
                  pattern="[0-9]*"
                  inputMode="numeric"
                  autoComplete="off"
                  placeholder={placeholder}
                  value={field.value}
                  onChange={(e) => handleChange(e, field)}
                  className={`rounded-tl-none rounded-bl-none ${
                    error ? 'border-destructive border' : 'border-none'
                  } ${className || ''}`}
                  maxLength={11}
                  {...rest}
                />
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
};

export default memo(FormPhoneNumber);
