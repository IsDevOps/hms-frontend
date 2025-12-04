'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './select';

import { ChangeEvent, HTMLProps, memo, ReactNode } from 'react';
import { useFormContext } from 'react-hook-form';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from './form';

type Options =
  | {
      id: number | string;
      name: string;
      icon?: ReactNode;
    }
  | undefined;

interface FormSelectProps extends Omit<HTMLProps<HTMLSelectElement>, 'ref'> {
  name: string;
  label?: string;
  placeholder: string;
  defaultValue?: string;
  disabled?: boolean;
  options?: Options[];
  className?: string;
  startIcon?: React.ReactNode;
  triggerBgColor?: string;
}

const FormSelect = ({
  label,
  name,
  placeholder,
  options,
  disabled,
  defaultValue,
  className,
  required,
  startIcon,
  triggerBgColor,
  onChange,
  ...rest
}: FormSelectProps) => {
  const { control } = useFormContext();

  return (
    <FormField
      control={control}
      name={name}
      render={({ field, fieldState: { error } }) => (
        <FormItem className={`gap-1.5 ${className}`}>
          {label && (
            <FormLabel className="text-body-text-2 text-sm font-normal">
              {label}
              {required && <span className="text-destructive">*</span>}
            </FormLabel>
          )}
          <Select
            {...field}
            onValueChange={(val) => {
              field.onChange(val);
              onChange?.({
                target: { value: val },
              } as ChangeEvent<HTMLSelectElement>);
            }}
            value={field.value || defaultValue}
            disabled={disabled}
          >
            <FormControl>
              <SelectTrigger
                bgColor={triggerBgColor}
                className={`data-[placeholder]:text-body-text-1 data-[state=open]:border-none ${
                  error ? 'border-destructive border' : 'border-none'
                }`}
              >
                <div className="flex gap-0.5">
                  {startIcon && startIcon}
                  <SelectValue {...rest} {...field} placeholder={placeholder} />
                </div>
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {options?.map((item, i) => (
                <SelectItem
                  key={`item-${i + 1}-${item?.name}`} //item.id
                  value={String(item?.id)}
                >
                  <div className="flex gap-2">
                    {item?.icon} {item?.name}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
export default memo(FormSelect);
