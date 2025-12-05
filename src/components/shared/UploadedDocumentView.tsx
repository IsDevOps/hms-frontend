import React, { ReactNode } from 'react';

interface UploadedDocumentViewProps {
    filename: string;
    children?: ReactNode;
}

const UploadedDocumentView = ({ filename, children }: UploadedDocumentViewProps) => {
    return (
        <div className="flex items-center justify-between p-3 border rounded-md">
            <span className="text-sm truncate max-w-[200px]">{filename}</span>
            <div className="flex items-center gap-2">
                {children}
            </div>
        </div>
    );
};

export default UploadedDocumentView;
