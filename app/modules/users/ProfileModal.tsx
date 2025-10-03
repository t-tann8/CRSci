'use client';

import { toast } from 'react-toastify';
import React, { useEffect, useState } from 'react';
import {
    useForm,
    SubmitHandler,
    FieldValues,
    FormProvider,
} from 'react-hook-form';
import { useSession } from 'next-auth/react';
import { Label } from '@/app/components/ui/label';
import { validationError } from '@/lib/utils';
import { OptionsInterface } from '@/app/components/common/AppDropDown';
import Input from '@/app/components/common/Input';
import Loader from '@/app/components/common/ButtonLoader';
import { ModalHeader } from '@/app/components/common/ModalHeader';
import useProfileImage from '@/lib/custom-hooks/useProfileImage';
import { updateAnotherUserProfileAPI } from '@/app/api/user';
import Select from '@/app/components/common/DropDown';
import action from '@/app/action';
import ProfileImage from '@/app/components/common/ProfileImage';

// type for the form data
type ProfileFormData = {
    name: string;
    email: string;
    role: string;
};

function ProfileModal({
    onClose,
    userId,
    image,
    name,
    email,
    role,
    isViewOnly,
}: {
    onClose: () => void;
    userId: string;
    image: string;
    name: string;
    email: string;
    role: string;
    isViewOnly?: boolean;
}) {
    const { data } = useSession();
    const [loading, setLoading] = useState(false);
    const [heading, setHeading] = useState(name);
    const [tagline, setTagline] = useState(email);
    const roleOptions: OptionsInterface[] = [
        { label: 'student', value: 'Student' },
        { label: 'teacher', value: 'Teacher' },
        { label: 'school', value: 'School' },
        { label: 'admin', value: 'Admin' },
    ];
    const {
        hiddenFileInput,
        selectedFile,
        currentImage,
        setOriginalImage,
        setCurrentImage,
        uploadProfilePicture,
        handleClick,
        handleFileChange,
        removeImage,
        undoImageChange,
        shouldResetProfilePicture,
        deleteProfilePicture,
    } = useProfileImage();
    const methods = useForm({
        mode: 'onChange',
        reValidateMode: 'onChange',
    });
    // Function to undo all changes made before clicking save
    const handleReset = () => {
        undoImageChange();
        methods.reset();
    };

    // Function to handle form submission
    const onFormSubmit = async (formData: ProfileFormData) => {
        setLoading(true);
        let imageUrl = currentImage;
        try {
            // Upload image to s3Bucket if selected
            if (selectedFile) {
                const uploadResponse: any = await uploadProfilePicture(
                    data?.user.id
                );
                // Handle image upload error
                if (uploadResponse?.status !== 200) {
                    return toast.error(
                        uploadResponse?.message || 'Error Uploading Image'
                    );
                }
                // It is an axios response so we need to access the data property
                imageUrl = uploadResponse?.data?.url;
            }
            // Delete old image if images removed all-together
            if (shouldResetProfilePicture()) {
                await deleteProfilePicture();
            }

            const { name, email, role } = formData;

            // // Update heading and tagline
            setHeading(name);
            setTagline(email);

            // Update user profile
            await updateAnotherUserProfileAPI(
                data?.user?.accessToken || '',
                imageUrl,
                name,
                email,
                userId,
                role
            );

            action('getAllUsers');

            // Manually trigger update after form submission to prevent discard changes to that of before form submission
            setCurrentImage(imageUrl);
            setOriginalImage(imageUrl);
            methods.reset({
                name,
                email,
                role,
            });

            return toast.success('Profile Updated Successfully');
        } catch (error: any) {
            return toast.error(
                error?.response?.data?.message || 'Error Uploading Profile'
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        setOriginalImage(image);
        setCurrentImage(image);
        methods.reset({
            name,
            email,
            role,
        });
    }, [email, image, methods, name, role, setCurrentImage, setOriginalImage]);

    return (
        <section className="w-full bg-white h-screen py-4 shadow-lg overflow-y-auto">
            <FormProvider {...methods}>
                <form
                    onSubmit={methods.handleSubmit(
                        onFormSubmit as SubmitHandler<FieldValues>
                    )}
                >
                    <div className="px-6 mb-24">
                        <ModalHeader
                            headerText={{
                                heading,
                                tagline,
                            }}
                            onClose={onClose}
                        />
                        <div className="flex flex-col  mobile:items-center w-full">
                            <ProfileImage
                                isViewOnly={isViewOnly}
                                selectedFile={selectedFile}
                                currentImage={currentImage}
                                handleClick={handleClick}
                                handleFileChange={handleFileChange}
                                hiddenFileInput={hiddenFileInput}
                                removeImage={removeImage}
                            />
                            <div className="mb-2 w-full mt-4">
                                <Label htmlFor="name">Name</Label>
                                <Input
                                    disabled={isViewOnly}
                                    name="name"
                                    placeholder="Enter Name"
                                    type="text"
                                    rules={{
                                        required: {
                                            value: true,
                                            message:
                                                validationError.REQUIRED_FIELD,
                                        },
                                    }}
                                />
                            </div>
                            <div className="mb-2 w-full">
                                <Label htmlFor="email">Email Address</Label>
                                <Input
                                    disabled={isViewOnly}
                                    name="email"
                                    placeholder="Enter Email"
                                    type="email"
                                    rules={{
                                        required: {
                                            value: true,
                                            message:
                                                validationError.REQUIRED_FIELD,
                                        },
                                        pattern: {
                                            value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                                            message:
                                                validationError.VALID_EMAIL,
                                        },
                                    }}
                                />
                            </div>
                            {isViewOnly ? (
                                <div className="mb-2 w-full">
                                    <Label htmlFor="role">Role</Label>
                                    <Input
                                        disabled={isViewOnly}
                                        name="text"
                                        type="text"
                                        inputValue={
                                            role.charAt(0).toUpperCase() +
                                            role.slice(1)
                                        }
                                    />
                                </div>
                            ) : (
                                <div className="mb-2 w-full">
                                    <Label htmlFor="role ">Role</Label>
                                    <Select
                                        disabled
                                        name="role"
                                        additionalClasses="mt-1"
                                        options={roleOptions}
                                        rules={{
                                            required: {
                                                value: true,
                                                message:
                                                    validationError.REQUIRED_FIELD,
                                            },
                                        }}
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                    {!isViewOnly && (
                        <div className="flex lg:flex-row flex-col lg:space-x-2 lg:space-y-0 space-y-2 lg:justify-between w-full py-2 gap-1 absolute bottom-0 left-0  p-3 border bg-white">
                            <button
                                type="button"
                                onClick={handleReset}
                                className="text-dark-gray font-semibold  w-full px-5 py-2 border rounded-xl hover:bg-gray-200"
                            >
                                Discard
                            </button>
                            <button
                                type="submit"
                                disabled={!methods.formState.isValid}
                                className={`text-white ${
                                    !methods.formState.isValid
                                        ? 'bg-gray-300'
                                        : 'bg-primary-color'
                                } font-semibold w-full px-5 py-2  border rounded-xl hover:bg-orange-500`}
                            >
                                {loading ? <Loader /> : 'Save'}
                            </button>
                        </div>
                    )}
                </form>
            </FormProvider>
        </section>
    );
}

export default ProfileModal;
