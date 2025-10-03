// ProfileImage.tsx
import Image from 'next/image';
import PictureIcon from '@/app/assets/icons/PictureIcon';
import { Trash2 } from 'lucide-react';

type ProfileImageProps = {
    isViewOnly?: boolean;
    selectedFile: File | null;
    currentImage: string;
    handleClick: (event: React.MouseEvent) => void;
    handleFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    hiddenFileInput: React.RefObject<HTMLInputElement>;
    removeImage: () => void;
    inSettings?: boolean;
};

function ProfileImage({
    isViewOnly,
    selectedFile,
    currentImage,
    handleClick,
    handleFileChange,
    hiddenFileInput,
    removeImage,
    inSettings,
}: ProfileImageProps) {
    return (
        <div
            className={
                inSettings
                    ? `md:flex gap-2 lg:space-x-4 items-center  mobile:w-full mobile:mb-2 gap-x-2`
                    : `flex flex-col justify-between items-center space-y-2`
            }
        >
            <div className="flex justify-center">
                <div
                    className={`border-2 border-light-gray rounded-full flex justify-center items-center ${
                        inSettings ? `h-40 w-40` : `h-44 w-44 p-2 `
                    }`}
                >
                    <div
                        className={`border-2 border-light-gray rounded-full flex justify-center items-center ${
                            inSettings ? `h-36 w-36` : `h-40 w-40 p-2 `
                        }`}
                    >
                        <div
                            className={`border-2 border-light-gray rounded-full flex justify-center items-center ${
                                inSettings ? `h-32 w-32` : `h-36 w-36 p-2 `
                            }`}
                        >
                            <Image
                                src={
                                    selectedFile
                                        ? URL.createObjectURL(selectedFile)
                                        : currentImage
                                }
                                alt="profile Image"
                                className="rounded-full object-fit h-28 w-28"
                                width={176}
                                height={176}
                            />
                        </div>
                    </div>
                </div>
            </div>
            {!isViewOnly && (
                <div
                    className={`flex flex-col ${
                        inSettings
                            ? `justify-between items-center mobile:w-full mb-4 lg:mb-0`
                            : `lg:flex-row lg:space-x-2 justify-center items-center  mobile:w-full mb-5`
                    }`}
                >
                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={handleClick}
                            className="text-white flex items-center bg-primary-color font-semibold mobile:w-full px-3 py-2 border rounded-lg mt-2 hover:bg-orange-500"
                        >
                            <PictureIcon
                                className="shrink-0"
                                width={18}
                                height={18}
                            />
                            <span className="ml-1">Update</span>
                            <input
                                type="file"
                                id="profilePicInput"
                                accept=".jpg, .jpeg, .png"
                                onChange={handleFileChange}
                                ref={hiddenFileInput}
                                style={{ display: 'none' }}
                            />
                        </button>
                        <button
                            type="button"
                            onClick={removeImage}
                            className="text-dark-gray items-center flex font-semibold mobile:w-full px-3 py-2 border rounded-lg mt-2 hover:bg-gray-200"
                        >
                            <Trash2
                                className="shrink-0"
                                size={18}
                                color="#E6500D"
                            />
                            <span className="ml-1">Remove</span>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ProfileImage;
