'use client';
import React, {
  ChangeEvent,
  HTMLProps,
  memo,
  ReactNode,
  useRef,
  useState,
} from 'react';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form';
import { Loader2, UploadCloud } from 'lucide-react';
import { useFormContext } from 'react-hook-form';
import { fileUploadSchema } from '@/lib/validations/fileUpload';
import { z } from 'zod';
import UploadedDocumentView from '../shared/UploadedDocumentView';
import { TrashIcon, UploadIcon } from '@/icons';
import { Button } from '../ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';
import { useUploadDocumentMutation } from '@/store/services/others';

interface FormUploadProps extends Omit<HTMLProps<HTMLInputElement>, 'ref'> {
  name: string;
  label?: string;
  fileToUpload?: string;
  supportedText?: string | ReactNode;
  hideBtn?: boolean;
}

function FormUpload({
  label,
  name,
  className,
  fileToUpload,
  supportedText,
  hideBtn = false,
  disabled,
  ...rest
}: FormUploadProps) {
  const { control, setError, clearErrors, setValue } = useFormContext();
  const inputFileRef = useRef<any>(null);
  const [fileData, setFileData] = useState({
    filename: '',
    filetype: '',
  });
  const [uploadToAws, { isLoading }] = useUploadDocumentMutation();

  const handleChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    if (files && files.length > 0) {
      const file = files[0];

      // Clear previous errors
      clearErrors(name);
      // Size validation
      if (file.size > 2 * 1024 * 1024) {
        setError(name, {
          type: 'manual',
          message: 'File must be less than 2MB',
        });
        return;
      }

      // File type validation using Zod
      try {
        await fileUploadSchema.parseAsync(file);
        const formData = new FormData();
        formData.append('file', file);
        setFileData({
          filename: file.name,
          filetype: file.type,
        });

        const res = await uploadToAws(formData).unwrap();
        if (res.success) {
          setValue(name, res.data, {
            shouldDirty: true,
            shouldTouch: true,
            shouldValidate: true,
          });
        }
      } catch (error: any) {
        if (error instanceof z.ZodError) {
          setError(name, {
            type: 'manual',
            message: error.message,
          });
        } else if (typeof error?.data?.message === 'string') {
          setError(name, {
            type: 'manual',
            message: error.data.message,
          });
        } else {
          setError(name, {
            type: 'manual',
            message: 'An unexpected error occurred',
          });
        }
      }
    }
  };

  const handleDeleteFile = async () => {
    setFileData({
      filename: '',
      filetype: '',
    });
    setValue(name, undefined, {
      shouldDirty: true,
      shouldTouch: true,
    });
    if (inputFileRef.current) inputFileRef.current.value = '';
  };

  return (
    <FormField
      control={control}
      name={name}
      render={({ field: { value, onBlur }, fieldState: { error } }) => (
        <FormItem className="gap-1.5">
          <FormLabel className="font-arial text-body-text-2 gap-1 text-sm font-normal">
            {<span>{label}</span>}
            {label ? <span className="text-destructive">*</span> : null}
          </FormLabel>

          <FormControl>
            <div>
              {value ? (
                <UploadedDocumentView
                  filename={fileData.filename || fileToUpload || value.url}
                >
                  {!hideBtn && (
                    <>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="size-fit cursor-pointer hover:bg-transparent"
                            onClick={() => inputFileRef?.current?.click()}
                          >
                            <UploadIcon className="text-body-text-1" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Replace file</p>
                        </TooltipContent>
                      </Tooltip>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="size-fit cursor-pointer hover:bg-transparent"
                        onClick={handleDeleteFile}
                      >
                        <TrashIcon className="text-destructive" />
                      </Button>
                    </>
                  )}
                </UploadedDocumentView>
              ) : (
                <div
                  className={`${error ? 'dashed-border--error' : 'dashed-border'} flex cursor-pointer items-center justify-center`}
                  onClick={() => inputFileRef.current?.click()}
                >
                  <div className={`flex w-full gap-2 p-5 ${className}`}>
                    <div className="flex items-center">
                      {isLoading ? (
                        <Loader2 className="text-primary mr-2 animate-spin" />
                      ) : (
                        <UploadCloud className="text-primary" />
                      )}
                    </div>
                    <div>
                      <p className="text-body-text-2 text-xs font-medium">
                        {isLoading
                          ? 'Uploading...'
                          : fileToUpload || 'Upload Document'}
                      </p>
                      <p className="text-body-text-1 font-arial text-xs tracking-[0,24px]">
                        {supportedText ||
                          'Max file size: 2MB (.jpg, .jpeg, .png, or .pdf supported)'}
                      </p>
                    </div>
                  </div>
                </div>
              )}
              <input
                {...rest}
                type="file"
                id={name}
                name={name}
                ref={inputFileRef}
                className="hidden"
                accept=".jpg,.jpeg,.png,.pdf"
                onChange={handleChange}
                onBlur={onBlur}
                disabled={disabled || hideBtn || isLoading}
              />
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

export default memo(FormUpload);
