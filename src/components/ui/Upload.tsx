import * as React from 'react';
import { trimAndAppendEllipsis } from '@/lib/utils';

export interface UploadProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  filename: string;
}

const Upload = ({ placeholder, filename, name, ...props }: UploadProps) => {
  return (
    <label
      htmlFor={name}
      className="flex h-12 w-full cursor-pointer items-center justify-start gap-2 rounded-[0.5rem] border-[0.5px] border-none bg-[#F5F6F8] px-[20px] py-[12px] text-black hover:text-black disabled:bg-[#F4F7FA] disabled:shadow-none"
    >
      {/* <UploadIcon /> */}
      <span className="text-sm font-light">
        {trimAndAppendEllipsis(filename) || placeholder}
      </span>
      <input
        {...props}
        id={name}
        type="file"
        className="hidden"
        accept="image/*,.pdf"
      />
    </label>
  );
};

Upload.displayName = 'Input';

export { Upload };
