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

interface FormMonthDropdownProps
  extends Omit<HTMLProps<HTMLInputElement>, 'ref'> {
  name: string;
  label: string;
  placeholder?: string;
}

const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const FormMonth = ({
  name,
  label,
  placeholder,
  disabled,
  required,
  ...rest
}: FormMonthDropdownProps) => {
  const { control } = useFormContext();

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
          <Select
            {...field}
            onValueChange={(val) => field.onChange(val)}
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
              {months.map((month, index) => (
                <SelectItem key={month} value={String(index + 1)}>
                  {month}
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

export default FormMonth;
