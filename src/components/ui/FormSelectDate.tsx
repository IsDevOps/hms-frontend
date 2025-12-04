'use client';

import { format, parse } from 'date-fns';
import { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { InfoIcon } from 'lucide-react';
import { CalendarIcon } from '@/icons';

import { Calendar } from './calendar';
import { Button } from './button';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from './form';
import { Popover, PopoverContent, PopoverTrigger } from './popover';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './tooltip';
import { cn } from '@/lib/utils';
import CustomCaption from '../shared/CustomCaption';

interface FormDateOfBirthProps {
  name: string;
  label: string;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  tooltipContent?: string;
  className?: string;
}

const FormSelectDateOfBirth = ({
  name,
  label,
  placeholder = 'YYYY/MM/DD',
  disabled = false,
  required = false,
  tooltipContent,
  className,
}: FormDateOfBirthProps) => {
  const { control, setValue } = useFormContext();
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [calendarMonth, setCalendarMonth] = useState(new Date());

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        const selectedDate = field.value
          ? parse(field.value, 'yyyy-MM-dd', new Date())
          : undefined;

        return (
          <FormItem className="flex w-full flex-col gap-1.5">
            <FormLabel className="text-[0.813rem] font-normal">
              {label}{' '}
              {tooltipContent && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" className="size-fit">
                        <InfoIcon className="h-4 w-4" />
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
                      !field.value && 'text-body-text-1',
                      className
                    )}
                    disabled={disabled}
                  >
                    {field.value ? (
                      format(field.value, 'yyyy-MMM-dd')
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
                  month={calendarMonth}
                  onMonthChange={setCalendarMonth}
                  selected={selectedDate}
                  onSelect={(date) => {
                    if (date) {
                      const formatted = format(date, 'yyyy-MM-dd');
                      field.onChange(formatted);
                      setValue(name, formatted, {
                        shouldTouch: true,
                        shouldDirty: true,
                      });
                    }
                    setIsPopoverOpen(false);
                  }}
                  fromYear={1920}
                  toYear={new Date().getFullYear()}
                  showOutsideDays={false}
                  initialFocus
                  components={{
                    Caption: (props) => (
                      <CustomCaption
                        {...props}
                        onMonthChange={setCalendarMonth}
                      />
                    ),
                  }}
                />
              </PopoverContent>
            </Popover>

            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
};

export default FormSelectDateOfBirth;
