import { Textarea } from './textarea';
import { HTMLProps, memo } from 'react';
import { useFormContext } from 'react-hook-form';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from './form';

interface TextareaProps extends Omit<HTMLProps<HTMLTextAreaElement>, 'ref'> {
  name: string;
  placeholder?: string;
  label: string;
}

const FormTextarea = ({
  name,
  label,
  placeholder,
  className,
  ...rest
}: TextareaProps) => {
  const { control } = useFormContext();
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="gap-1.5">
          <FormLabel className="text-[0.813rem] font-normal">{label}</FormLabel>
          <FormControl>
            <Textarea
              placeholder={placeholder}
              {...rest}
              {...field}
              className={`border-none ${className}`}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
export default memo(FormTextarea);
