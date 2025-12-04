'use client';

import { format } from 'date-fns';
import { CalendarIcon } from '@/icons';

import { Button } from './button';
import { Calendar } from './calendar';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from './form';
import { Popover, PopoverContent, PopoverTrigger } from './popover';
import { cn } from '../../lib/utils';
import { HTMLProps, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { InfoIcon } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './tooltip';

interface FormDateProps extends Omit<HTMLProps<HTMLInputElement>, 'ref'> {
  name: string;
  label: string;
  placeholder?: string;
  disabled?: boolean;
  tooltipContent?: string;
  captionLayout?: 'buttons' | 'dropdown-buttons' | 'dropdown';
  // mode?: 'day' | 'month' | 'year';
  disabledDatePassed?: boolean;
}

const FormDate = ({
  label,
  name,
  placeholder,
  disabled,
  required,
  tooltipContent,
  captionLayout,
  disabledDatePassed,
}: FormDateProps) => {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const { control, setValue } = useFormContext();

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex w-full flex-col gap-1.5">
          <FormLabel className="text-[0.813rem] font-normal">
            {label}{' '}
            {tooltipContent && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="size-fit">
                      <InfoIcon className="stroke-warning-mustard" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{tooltipContent}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
            {required && <span className="text-destructive">*</span>}
          </FormLabel>
          <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant="outline"
                  size="lg"
                  className={cn(
                    'border-input disabled:border-input text-body-text-2 hover:text-body-text-1 hover:bg-currentColor h-12 w-full rounded-[0.5rem] bg-[#F5F6F8] pl-3 text-left font-normal hover:opacity-100',
                    'focus-visible:border focus-visible:border-black',
                    !field.value && 'text-body-text-1'
                  )}
                  disabled={disabled}
                >
                  {field.value ? (
                    format(field.value, 'dd MMM, yyyy hh:mm a')
                  ) : (
                    <span>{placeholder}</span>
                  )}
                  <CalendarIcon className="ml-auto h-4 w-4 text-[#2c2c2c] opacity-75" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={field.value}
                captionLayout={captionLayout ?? 'buttons'}
                onSelect={(date) => {
                  field.onChange(date);
                  setValue(name, date, {
                    shouldTouch: true,
                    shouldDirty: true,
                  });
                  setIsPopoverOpen(false);
                }}
                disabled={(date) =>
                  (disabledDatePassed &&
                    date < new Date(new Date().setHours(0, 0, 0, 0))) ||
                  date < new Date('1900-01-01')
                }
                initialFocus
                fromYear={1920}
                toYear={new Date().getFullYear()}
              />
            </PopoverContent>
          </Popover>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default FormDate;
