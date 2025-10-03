'use client';

import Image from 'next/image';
import { toast } from 'react-toastify';
import { FormProvider, useForm } from 'react-hook-form';
import { useSession } from 'next-auth/react';
import React, { useEffect, useRef, useState } from 'react';
import { DEFAULT_IMAGE, validationError } from '@/lib/utils';
import { Label } from '@/app/components/ui/label';
import Input from '@/app/components/common/Input';
import Loader from '@/app/components/common/ButtonLoader';
import PictureIcon from '@/app/assets/icons/PictureIcon';
import { getUserProfileAPI, updateUserProfileAPI } from '@/app/api/user/index';
import { UploadProfilePicture, DeleteProfilePicture } from '@/app/api/s3Bucket';
import useProfileImage from '@/lib/custom-hooks/useProfileImage';
import ProfileImage from '@/app/components/common/ProfileImage';
import SchoolProfile from './SchoolProfile';

interface MyProfileProps {
    isSchoolProfile?: boolean;
}

function Profile({ isSchoolProfile }: MyProfileProps) {
    const { data, update } = useSession();
    const [loading, setLoading] = useState(false);
    const {
        hiddenFileInput,
        selectedFile,
        originalImage,
        currentImage,
        setOriginalImage,
        uploadProfilePicture,
        setCurrentImage,
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
    const onFormSubmit = async (formData: any) => {
        setLoading(true);
        let imageUrl = currentImage;
        try {
            // Upload image to s3Bucket if selected
            if (selectedFile) {
                const uploadResponse: any = await uploadProfilePicture(
                    data?.user.id
                );
                // Handle image upload error
                if (uploadResponse.status !== 200) {
                    return toast.error(
                        uploadResponse.message || 'Error Uploading Image'
                    );
                }
                // It is an axios response so we need to access the data property
                imageUrl = uploadResponse?.data?.url;
            }
            // Delete old image if images removed all-together
            if (shouldResetProfilePicture()) {
                await deleteProfilePicture();
            }

            const { name, email, password, schoolName } = formData;

            // Update user profile
            const response = await updateUserProfileAPI(
                data?.user.accessToken || '',
                imageUrl,
                name,
                email,
                password,
                schoolName || ''
            );

            // Update next auth session data
            await update({
                ...data,
                name: response.data.data.name,
                email: response.data.data.email,
                user: {
                    ...data?.user,
                    name: response.data.data.name,
                    email: response.data.data.email,
                    accessToken: response.data.data.accessToken,
                },
            });
            // Manually update original image as it is only updated if form data/ email changes which in turn changes access token
            setOriginalImage(imageUrl);

            return toast.success('Profile Updated Successfully');
        } catch (error: any) {
            return toast.error(
                error.response?.data?.message || 'Error Uploading Profile'
            );
        } finally {
            setLoading(false);
        }
    };

    // Fetch profile data on component mount
    useEffect(() => {
        (async () => {
            try {
                if (data?.user.accessToken) {
                    const APIdata = await getUserProfileAPI(
                        data?.user.accessToken
                    );
                    const { name, email, image, schoolName } =
                        APIdata.data.data;
                    methods.reset({
                        name,
                        email,
                        password: '',
                        ...(schoolName && { schoolName }),
                    });
                    setOriginalImage(image);
                    setCurrentImage(image);
                }
            } catch (err: any) {
                if (!isSchoolProfile) {
                    toast.error(
                        err?.response?.data?.message || 'An Error Occured'
                    );
                }
            }
        })();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data?.user.accessToken]);

    return (
        <section className="bg-white flex mobile:flex-col mobile:gap-5 h-full w-full mt-8 lg:mt-0 md:gap-10 justify-center">
            <div className="flex flex-col mobile:items-center  mobile:w-full mobile:px-2 'm-auto mobile:h-screen w-[418px]">
                {/* <h1 className="text-2xl  font-semibold mb-2 mobile:mb-4">
                    My profile
                </h1> */}
                <FormProvider {...methods}>
                    <form
                        className="mobile:w-full"
                        onSubmit={methods.handleSubmit(onFormSubmit)}
                    >
                        <ProfileImage
                            selectedFile={selectedFile}
                            currentImage={currentImage}
                            handleClick={handleClick}
                            handleFileChange={handleFileChange}
                            hiddenFileInput={hiddenFileInput}
                            removeImage={removeImage}
                            inSettings
                        />
                        <div className="mt-2">
                            <Label htmlFor="name">Name</Label>
                            <Input
                                name="name"
                                placeholder="Enter Name"
                                type="text"
                                rules={{
                                    required: {
                                        value: true,
                                        message: validationError.REQUIRED_FIELD,
                                    },
                                }}
                            />
                        </div>
                        <div className="mt-2">
                            <Label htmlFor="email">Email Address</Label>
                            <Input
                                name="email"
                                placeholder="Enter Email"
                                type="email"
                                rules={{
                                    required: {
                                        value: true,
                                        message: validationError.REQUIRED_FIELD,
                                    },
                                    pattern: {
                                        value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                                        message: validationError.VALID_EMAIL,
                                    },
                                }}
                            />
                        </div>
                        {isSchoolProfile && (
                            <div className="mt-2">
                                <Label htmlFor="schoolName">School Name</Label>
                                <Input
                                    name="schoolName"
                                    placeholder="Enter the Name of Your School"
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
                        )}
                        <div className="mt-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                name="password"
                                placeholder="Enter Password"
                                type="password"
                                rules={{
                                    pattern: {
                                        value:
                                            // eslint-disable-next-line no-useless-escape
                                            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[~`!@#$%^&*()_\-\+=:;"'?\/>.<,{}\[\]])[a-zA-Z\d~`!@#$%^&*()_\-\+=:;"'?\/>.<,{}\[\]]{8,}$/,
                                        message:
                                            validationError.PASSWORD_VALIDATION_INFO_TEXT,
                                    },
                                    minLength: {
                                        value: 8,
                                        message: validationError.MIN_LENGTH,
                                    },
                                    maxLength: {
                                        value: 20,
                                        message: validationError.MAX_LENGTH,
                                    },
                                }}
                            />
                        </div>
                        {/* {!isSchoolProfile && ( */}
                        <div className="md:flex md:justify-between w-full mt-5 gap-2">
                            <button
                                type="button"
                                className="text-dark-gray w-44 font-semibold p-2 md:p-2 border rounded-lg bg-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
                                onClick={handleReset}
                            >
                                Discard
                            </button>

                            <button
                                type="submit"
                                disabled={!methods.formState.isValid || loading}
                                className={`text-white font-semibold p-2 w-44 md:p-2 border rounded-lg h-12 ${
                                    !methods.formState.isValid || loading
                                        ? 'bg-gray-300 cursor-not-allowed'
                                        : 'bg-primary-color hover:bg-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-400'
                                }`}
                            >
                                {loading ? <Loader /> : 'Save'}
                            </button>
                        </div>

                        {/* )} */}
                    </form>
                </FormProvider>
            </div>
            {/* {isSchoolProfile && (
                <SchoolProfile
                    isProfileFormValid={methods.formState.isValid}
                    selectedImageFile={selectedFile}
                    originalImage={originalImage}
                    profileImage={currentImage}
                    username={methods.watch('name')}
                    email={methods.watch('email')}
                    password={methods.watch('password')}
                    handleProfileReset={handleReset}
                    handleUpdateOriginalImage={setOriginalImage}
                />
            )} */}
        </section>
    );
}

export default Profile;
