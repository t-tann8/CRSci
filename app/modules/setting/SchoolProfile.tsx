'use client';

import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { FormProvider, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { DEFAULT_IMAGE, validationError } from '@/lib/utils';
import Input from '@/app/components/common/Input';
import { Label } from '@/app/components/ui/label';
import {
    getSchoolProfileAPI,
    updateSchoolAndUserProfile,
} from '@/app/api/school';
import { DeleteProfilePicture, UploadProfilePicture } from '@/app/api/s3Bucket';
import { updateUserProfileAPI } from '@/app/api/user';
import Loader from '@/app/components/common/ButtonLoader';

type Inputs = {
    schoolName: string;
    numOfClasses: number;
    classesStart: number;
    classesEnd: number;
};

function SchoolProfile({
    isProfileFormValid,
    selectedImageFile,
    originalImage,
    profileImage,
    username,
    email,
    password,
    handleProfileReset,
    handleUpdateOriginalImage,
}: {
    isProfileFormValid: boolean;
    selectedImageFile: File | null;
    originalImage: string;
    profileImage: string;
    username: string;
    email: string;
    password: string;
    handleProfileReset: () => void;
    handleUpdateOriginalImage: Dispatch<SetStateAction<string>>;
}) {
    const { data } = useSession();
    const [loading, setLoading] = useState(false);
    const [schoolProfileData, setSchoolProfileData] = useState({
        schoolName: '',
        numOfClasses: 1,
        classesStart: 0,
        classesEnd: 0,
    });
    const methods = useForm<Inputs>({
        mode: 'onChange',
        reValidateMode: 'onChange',
    });

    const classesStartData = methods.watch('classesStart');

    // Reset school form values and profile form values initial state
    const handleReset = () => {
        handleProfileReset();
        methods.reset({
            schoolName: schoolProfileData.schoolName,
            numOfClasses: schoolProfileData.numOfClasses,
            classesStart: schoolProfileData.classesStart,
            classesEnd: schoolProfileData.classesEnd,
        });
    };

    // Form submission handler
    const onSubmit = async (formData: any) => {
        setLoading(true);

        let imageUrl = profileImage;
        try {
            // Upload new profile image if selected
            if (selectedImageFile) {
                const s3BucketResponse: any = await UploadProfilePicture({
                    selectedFile: selectedImageFile,
                    originalImage,
                    userId: data?.user.id,
                });

                if (s3BucketResponse?.status !== 200) {
                    return toast.error(
                        s3BucketResponse?.message || 'Error Uploading Image'
                    );
                }

                imageUrl = s3BucketResponse?.data?.url || imageUrl;
            }
            // Delete original profile image if new image not selected and user removed profile picture
            if (
                !selectedImageFile &&
                originalImage !== DEFAULT_IMAGE &&
                profileImage === DEFAULT_IMAGE
            ) {
                await DeleteProfilePicture(originalImage);
            }

            // Update school and user profile
            const { schoolName, numOfClasses, classesStart, classesEnd } =
                formData;

            const response = await updateSchoolAndUserProfile(
                data?.user.accessToken || '',
                imageUrl,
                username,
                email,
                password,
                schoolName,
                numOfClasses,
                classesStart,
                classesEnd
            );

            handleUpdateOriginalImage(imageUrl);

            return toast.success('Profile Updated Successfully');
        } catch (error: any) {
            return toast.error(
                error.response?.data?.message || 'Error Updating Profile'
            );
        } finally {
            setLoading(false);
        }
    };

    // Fetch school profile data on component mount
    useEffect(() => {
        // eslint-disable-next-line consistent-return
        (async () => {
            try {
                if (data?.user.accessToken) {
                    const APIdata = await getSchoolProfileAPI(
                        data?.user.accessToken
                    );
                    // Check if APIdata.data.data is not empty
                    if (APIdata.data.data) {
                        const { name, numOfClasses, classesStart, classesEnd } =
                            APIdata.data.data;
                        setSchoolProfileData({
                            schoolName: name,
                            numOfClasses,
                            classesStart,
                            classesEnd,
                        });
                        methods.reset({
                            schoolName: name,
                            numOfClasses,
                            classesStart,
                            classesEnd,
                        });
                    } else {
                        // Handle the empty case, e.g., set defaults or show an error
                        setSchoolProfileData({
                            schoolName: '',
                            numOfClasses: 1,
                            classesStart: 0,
                            classesEnd: 0,
                        });
                        methods.reset({
                            schoolName: '',
                            numOfClasses: 1,
                            classesStart: 0,
                            classesEnd: 0,
                        });
                    }
                }
            } catch (error: any) {
                toast.error(error.message || 'An error occurred');
            }
        })();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data?.user.accessToken]);

    return (
        <div className="w-full relative mobile:px-2">
            <h1 className="text-2xl font-semibold mb-2 mobile:mb-4 text-center lg:text-left">
                School Profile
            </h1>
            <FormProvider {...methods}>
                <form onSubmit={methods.handleSubmit(onSubmit)}>
                    <div className="flex flex-col mt-5  ">
                        <Label htmlFor="schoolName">School Name</Label>

                        <Input
                            name="schoolName"
                            placeholder="Enter School Name"
                            type="string"
                            rules={{
                                required: {
                                    value: true,
                                    message: validationError.REQUIRED_FIELD,
                                },
                                minLength: {
                                    value: 3,
                                    message:
                                        validationError.MIN_SCHOOL_NAME_LENGTH,
                                },
                                maxLength: {
                                    value: 25,
                                    message:
                                        validationError.MAX_SCHOOL_NAME_LENGTH,
                                },
                            }}
                        />
                    </div>
                    <div className="flex flex-col mt-5 ">
                        <Label htmlFor="numOfClasses ">No Of Classrooms</Label>

                        <Input
                            name="numOfClasses"
                            placeholder="Enter No of Classrooms"
                            type="number"
                            rules={{
                                required: {
                                    value: true,
                                    message: validationError.REQUIRED_FIELD,
                                },
                                min: {
                                    value: 1,
                                    message: validationError.MIN_CLASSES_NUM,
                                },
                            }}
                        />
                    </div>

                    <div className="flex mt-5 justify-between w-full space-x-4 ">
                        <div className="flex flex-col w-full">
                            <Label htmlFor="classesStart">Classes Start</Label>

                            <Input
                                name="classesStart"
                                placeholder="i.e. 5th Class"
                                type="number"
                                rules={{
                                    required: {
                                        value: true,
                                        message: validationError.REQUIRED_FIELD,
                                    },
                                    min: {
                                        value: 0,
                                        message:
                                            validationError.MIN_CLASS_START,
                                    },
                                }}
                            />
                        </div>
                        <div className="flex flex-col w-full">
                            <Label htmlFor="classesEnd">Classes End</Label>

                            <Input
                                name="classesEnd"
                                placeholder="i.e. 10th Class"
                                type="number"
                                rules={{
                                    required: {
                                        value: true,
                                        message: validationError.REQUIRED_FIELD,
                                    },
                                    min: {
                                        value: classesStartData,
                                        message: validationError.MIN_CLASS_END,
                                    },
                                }}
                            />
                        </div>
                    </div>
                    <div className="md:flex md:justify-between w-full mt-[4.4rem] gap-1">
                        <button
                            type="button"
                            className="text-dark-gray w-[90%] font-semibold mobile:mb-2 mobile:w-full p-2 md:px-6 md:py-2 border rounded-lg"
                            onClick={handleReset}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={
                                !methods.formState.isValid ||
                                !isProfileFormValid
                            }
                            className={`text-white w-[90%] ${
                                !methods.formState.isValid ||
                                !isProfileFormValid
                                    ? 'bg-gray-300'
                                    : 'bg-primary-color'
                            } font-semibold mobile:w-full p-2 md:px-6 md:py-2 border rounded-lg`}
                        >
                            {loading ? <Loader /> : 'Save'}
                        </button>
                    </div>
                    {/* </div> */}
                </form>
            </FormProvider>
        </div>
    );
}

export default SchoolProfile;
