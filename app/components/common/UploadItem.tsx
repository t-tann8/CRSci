/* eslint-disable jsx-a11y/label-has-associated-control */

'use client';

import React from 'react';
import { Upload } from 'lucide-react';
import { ResourceType } from '@/lib/utils';

function UploadItem({
    resourceType,
    itemName,
    setSelectedFile,
}: {
    resourceType: ResourceType;
    itemName: string;
    setSelectedFile: (file: File | null) => void;
}) {
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files && event.target.files[0];
        setSelectedFile(file);
    };

    const resourceTypeToFileTypes = {
        [ResourceType.VIDEO]: '.gif, .mp4, .avi, .mov',
        [ResourceType.WORKSHEET]: '.doc, .docx',
        [ResourceType.SLIDESHOW]: '.ppt, .pptx',
        [ResourceType.QUIZ]: '.doc, .docx',
        [ResourceType.ASSIGNMENT]: '.doc, .docx',
        [ResourceType.FORMATIVE_ASSESSMENT]: '.doc, .docx',
        [ResourceType.SUMMARIZE_ASSESSMENT]: '.doc, .docx',
        [ResourceType.LAB]: '.pdf',
        [ResourceType.STATION]: '.pdf',
        [ResourceType.ACTIVITY]: '.pdf',
        [ResourceType.GUIDED_NOTE]: '.pdf',
        [ResourceType.DATA_TRACKER]: '.pdf',
    };

    return (
        <section
            className="flex justify-between items-center flex-col md:p-12 sm:p-10 p-6 border-4 border-dotted rounded-lg text-center cursor-pointer"
            onClick={() => document.getElementById('fileInput')?.click()}
        >
            <label
                htmlFor="fileInput"
                className=" rounded-full bg-green-50 p-2 mb-2"
            >
                <input
                    type="file"
                    id="fileInput"
                    accept={resourceTypeToFileTypes[resourceType]}
                    onChange={handleFileChange}
                    className="hidden"
                />
                <Upload size={30} color="#7AA43E" />
            </label>
            <div className="upload-video__text">
                <h3 className="text-lg font-semibold mb-2">
                    Upload {itemName}
                </h3>
                <p>
                    <span className="text-primary-color">Upload Here</span>
                </p>
            </div>
        </section>
    );
}

export default UploadItem;
