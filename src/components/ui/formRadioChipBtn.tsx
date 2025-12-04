'use client';

import { useFormContext } from 'react-hook-form';

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from './form';
import { RadioGroup, RadioGroupItem } from './radio-group';

interface Option {
  key: string;
  label: string;
  value: string;
  icon?: React.ReactNode;
}
interface FormRadioProps {
  name: string;
  label: string;
  options: Option[];
  disabled?: boolean;
  required?: boolean;
}

const FormRadioChipBtn = ({
  label,
  options,
  name,
  required = false,
  disabled = false,
}: FormRadioProps) => {
  const { control } = useFormContext();

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-[0.813rem] font-normal capitalize">
            {label}
            {required && <span className="text-destructive">*</span>}
          </FormLabel>
          <FormControl>
            <RadioGroup
              onValueChange={field.onChange}
              defaultValue={field.value}
              disabled={disabled}
              className="flex w-full flex-wrap items-start justify-start gap-3"
            >
              {options.map((item) => (
                <FormItem
                  key={item.key}
                  className="has-checked:border-primary my-1 flex items-center justify-center gap-0 rounded-full border border-[#E3E3E3] px-4 py-2"
                >
                  <FormControl>
                    <RadioGroupItem value={item.value} className="hidden" />
                  </FormControl>

                  <FormLabel className="text-header-text flex justify-start gap-2 text-[0.813rem] font-normal capitalize">
                    {item.icon}
                    {item.label}
                  </FormLabel>
                </FormItem>
              ))}
            </RadioGroup>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
export default FormRadioChipBtn;
