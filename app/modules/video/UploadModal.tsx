import React from 'react';
import { FileVideoIcon } from 'lucide-react';
import { ResourceType } from '@/lib/utils';
import ModalFooter from '@/app/components/common/ModalFooter';
import UploadItem from '../../components/common/UploadItem';
import FileUploading from '../../components/common/FileUploading';
import { ModalHeader } from '../../components/common/ModalHeader';

function UploadModal() {
    return (
        <section className="w-full bg-white h-screen py-4 px-6 shadow-md">
            <div>
                <ModalHeader
                    headerText={{
                        heading: 'Upload Video',
                        tagline: 'let’s Upload Video For Your User',
                    }}
                    Icon={FileVideoIcon}
                />
                <UploadItem
                    resourceType={ResourceType.VIDEO}
                    itemName="Video"
                    setSelectedFile={(file: File | null) => {}}
                />
                <FileUploading progress={0} />
                <div className="p-2 rounded-lg border w-32 text-center mt-3">
                    <button type="button" className="text-dark-gray text-sm">
                        Cancel Upload
                    </button>
                </div>
            </div>
            <ModalFooter text="Continue" />
        </section>
    );
}

export default UploadModal;
