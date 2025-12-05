import React, { ReactNode } from 'react';

interface UploadedDocumentViewProps {
  filename: string;
  children?: ReactNode;
}

const UploadedDocumentView = ({
  filename,
  children,
}: UploadedDocumentViewProps) => {
  return (
    <div className="flex items-center justify-between rounded-md border p-3">
      <span className="max-w-[200px] truncate text-sm">{filename}</span>
      <div className="flex items-center gap-2">{children}</div>
    </div>
  );
};

export default UploadedDocumentView;
