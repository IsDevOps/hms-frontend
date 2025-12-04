'use client';
import { HTMLProps } from 'react';

import {
  ControllerRenderProps,
  FieldValues,
  useFormContext,
} from 'react-hook-form';

import { Checkbox } from './checkbox';
import { FormControl, FormField, FormItem, FormLabel } from './form';
import { CheckedState } from '@radix-ui/react-checkbox';

interface FormCheckboxProps extends Omit<HTMLProps<HTMLInputElement>, 'ref'> {
  name: string;
  label: string;
  className?: string;
}
const FormCheckbox = ({
  name,
  label,
  className,
  defaultChecked,
  onChange,
}: FormCheckboxProps) => {
  const { control } = useFormContext();

  const handleChange = (
    checked: CheckedState,
    field: ControllerRenderProps<FieldValues, string>
  ) => {
    field.onChange(checked);
    onChange?.({
      target: { value: checked },
    } as unknown as React.FormEvent<HTMLInputElement>);
  };

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem
          className={`flex items-center space-y-0 space-x-3 py-4 ${className}`}
        >
          <FormControl>
            <Checkbox
              checked={field.value || defaultChecked}
              onCheckedChange={(checked) => handleChange(checked, field)}
              className="size-5"
            />
          </FormControl>
          <FormLabel className="text-sm font-normal">{label}</FormLabel>
        </FormItem>
      )}
    />
  );
};
export default FormCheckbox;
