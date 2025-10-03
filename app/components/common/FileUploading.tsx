import { Upload, FileVideo, LucideIcon } from 'lucide-react';
import React from 'react';

interface FileUploadingProp {
    isCompleted?: boolean;
    Icon?: React.ComponentType<React.SVGProps<SVGSVGElement>> | LucideIcon;
    fileName?: string;
    progress: number;
}
function FileUploading({
    isCompleted,
    Icon,
    fileName,
    progress,
}: FileUploadingProp) {
    return (
        <div className="p-3 border-2 rounded-lg flex space-x-4 mt-3 items-center">
            <div className="h-full">
                {Icon ? (
                    <Icon size={80} />
                ) : (
                    <FileVideo size={60} fill="#54C3F4" color="#1976D2" />
                )}
            </div>
            <div className="flex flex-col gap-1 w-auto">
                <h3 className="md:text-md text-sm font-semibold">{fileName}</h3>
                {progress !== 0 && (
                    <>
                        <div className="flex gap-1">
                            <Upload size={18} color="#7AA43E" />
                            <p className="text-sm">
                                {progress !== 100
                                    ? `Uploading ${progress}%`
                                    : 'Uploaded Successfully'}
                            </p>
                        </div>
                        <div className="w-[16rem] bg-white rounded-md">
                            <div
                                className="h-2 bg-primary-color rounded-md"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

export default FileUploading;
