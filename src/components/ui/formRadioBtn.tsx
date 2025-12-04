'use client';

import { ReactNode } from 'react';
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
  description?: string;
}
interface FormRadioProps {
  required?: boolean;
  name: string;
  label: string | ReactNode;
  options: Option[];
}

const FormRadioBtn = ({ label, options, name, required }: FormRadioProps) => {
  const { control } = useFormContext();

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-[0.813rem] font-normal">
            {label}
            {required && <span className="text-destructive">*</span>}
          </FormLabel>
          <FormControl>
            <RadioGroup
              onValueChange={field.onChange}
              defaultValue={field.value}
              className="flex w-full items-center justify-start"
            >
              {options.map((item) => (
                <FormItem key={item.key} className="my-1 items-center p-0">
                  <div className="flex justify-start gap-2 py-1">
                    <FormControl>
                      <RadioGroupItem value={item.value} />
                    </FormControl>
                    <FormLabel className="text-header-text text-sm font-normal">
                      {item.label}
                    </FormLabel>
                  </div>
                  <div>
                    <p className="pl-6 text-xs font-light">
                      {item.description}
                    </p>
                  </div>
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
export default FormRadioBtn;
