import { HTMLProps } from 'react';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from './form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './select';
import { useFormContext } from 'react-hook-form';

interface FormYearDropdownProps
  extends Omit<HTMLProps<HTMLInputElement>, 'ref'> {
  name: string;
  label: string;
  placeholder?: string;
  endYear?: Date;
  startYear?: number;
}

const FormYear = ({
  name,
  label,
  placeholder,
  disabled,
  required,
  startYear = 1700,
  endYear = new Date(),
  ...rest
}: FormYearDropdownProps) => {
  const { control } = useFormContext();
  const years = Array.from(
    { length: endYear.getFullYear() - startYear + 1 },
    (_, i) => String(endYear.getFullYear() - i) // descending
  );
  return (
    <FormField
      control={control}
      name={name}
      render={({ field, fieldState: { error } }) => (
        <FormItem className="flex w-full flex-col gap-1.5">
          <FormLabel className="text-[0.813rem] font-normal">
            {label}
            {required && <span className="text-destructive">*</span>}
          </FormLabel>
          {/* component here */}
          <Select
            {...field}
            onValueChange={(val) => {
              field.onChange(val);
            }}
            value={field.value}
            disabled={disabled}
          >
            <FormControl>
              <SelectTrigger
                className={`data-[placeholder]:text-body-text-1 data-[state=open]:border-none ${
                  error ? 'border-destructive border' : 'border-none'
                }`}
              >
                <div className="flex gap-0.5">
                  <SelectValue {...rest} {...field} placeholder={placeholder} />
                </div>
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {/* render years here */}
              {years?.map((year) => (
                <SelectItem key={year} value={String(year)}>
                  <div className="flex gap-2">{year}</div>
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

export default FormYear;
