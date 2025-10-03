import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { useForm, FormProvider } from 'react-hook-form';
import { useSession } from 'next-auth/react';
import ModalFooter from '@/app/components/common/ModalFooter';
import ClassroomIcon from '@/app/assets/icons/ClassroomIcon';
import { Label } from '@/app/components/ui/label';
import AppDropDown from '@/app/components/common/AppDropDown';
import Input from '@/app/components/common/Input';
import { createClassroomAPI } from '@/app/api/classroom';
import { getAllTeacherAPI } from '@/app/api/user';
import Loader from '@/app/components/common/PageLoader';
import { toast } from 'react-toastify';
import action from '@/app/action';

function AddClassroomModal({ onClose }: any) {
    const methods = useForm({ mode: 'onChange', reValidateMode: 'onChange' });
    const [currentTeacher, setCurrentTeacher] = useState('');
    const [teacherList, setTeacherList] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [buttonLoader, setButtonLoader] = useState(false);
    const { data } = useSession();

    useEffect(() => {
        const accessToken = data?.user.accessToken || '';
        getAllTeacherAPI(accessToken).then((response) => {
            if (response?.status === 'success') {
                const newTeacherList = response?.data?.map(
                    (teacher: { name: string; id: string }) => ({
                        id: teacher.id,
                        label: teacher.name,
                        value:
                            teacher.name.charAt(0).toUpperCase() +
                            teacher.name.slice(1),
                    })
                );
                setTeacherList(newTeacherList);
                setCurrentTeacher(newTeacherList[0]?.value || '');
            }
            setLoading(false);
        });
    }, [data?.user?.accessToken]);

    const onSubmit = async (formData: any) => {
        try {
            setButtonLoader(true);
            const { className } = formData;
            const selectedTeacher = teacherList.find(
                (teacher) =>
                    teacher.value.toLowerCase() === currentTeacher.toLowerCase()
            );

            const accessToken = data?.user.accessToken || '';

            const payload = {
                name: className,
                teacherId: selectedTeacher?.id,
                accessToken,
                schoolId: data?.user?.schoolId || '',
            };

            const response = await createClassroomAPI(payload);
            if (response?.status !== 'success') {
                return toast.error(response.message);
            }
            action('getSchoolDashboard');
            action('getSchoolClassrooms');
            return toast.success('Classroom created successfully');
        } catch (error: any) {
            return toast.error('Something went wrong');
        } finally {
            setButtonLoader(false);
        }
    };

    return (
        <FormProvider {...methods}>
            <section className="w-full bg-white h-screen py-4 px-6 shadow-lg">
                <div>
                    <div className="flex justify-between items-center">
                        <div className="flex my-7">
                            <div className="bg-green-100 px-3 h-fit py-3 rounded-lg">
                                <ClassroomIcon width={30} height={30} />
                            </div>
                            <div className="flex flex-col ml-2">
                                <h3 className="text-xl font-semibold mr-1">
                                    Create Classroom
                                </h3>
                                <p className="text-sm text-dark-gray mb-2">
                                    Add a new classroom to your school
                                </p>
                            </div>
                        </div>
                        <div className="rounded-full bg-white border p-1 cursor-pointer">
                            <X size={15} onClick={onClose} />
                        </div>
                    </div>

                    {loading ? (
                        <div className="flex justify-center items-center h-full">
                            <Loader /> {/* Show a loading spinner or message */}
                        </div>
                    ) : (
                        <form onSubmit={methods.handleSubmit(onSubmit)}>
                            <div className="flex flex-col space-y-2 mt-2">
                                <Label
                                    className="font-semibold"
                                    htmlFor="className"
                                >
                                    Class Name
                                </Label>
                                <Input
                                    name="className"
                                    type="text"
                                    placeholder="Enter Class Name"
                                    rules={{
                                        required: {
                                            value: true,
                                            message: 'Class name is required',
                                        },
                                    }}
                                />
                            </div>
                            <div className="flex flex-col space-y-2 mt-5">
                                <Label
                                    className="font-semibold"
                                    htmlFor="teacher"
                                >
                                    Select Teacher
                                </Label>
                                <AppDropDown
                                    name="teacher"
                                    options={teacherList || []}
                                    value={
                                        currentTeacher || 'No Teacher To select'
                                    }
                                    onChange={(e: any) =>
                                        setCurrentTeacher(e.target.value)
                                    }
                                />
                            </div>
                            <div className="text-center mt-8">
                                <ModalFooter
                                    loading={buttonLoader}
                                    text="Create"
                                    buttonType="submit"
                                />
                            </div>
                        </form>
                    )}
                </div>
            </section>
        </FormProvider>
    );
}

export default AddClassroomModal;
