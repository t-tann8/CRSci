import React from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { X } from 'lucide-react';
import ModalFooter from '@/app/components/common/ModalFooter';
import ClassroomIcon from '@/app/assets/icons/ClassroomIcon';
import { Label } from '@/app/components/ui/label';
import { validationError } from '@/lib/utils';
import Input from '@/app/components/common/Input';
import { useSession } from 'next-auth/react';
import { signupInviteAPI } from '@/app/api/auth';
import { toast } from 'react-toastify';

interface AddTeacherModalProps {
    onClose: () => void;
}

function AddTeacherModal({ onClose }: AddTeacherModalProps) {
    const [loading, setLoading] = React.useState(false);
    const { data } = useSession();
    const methods = useForm({ mode: 'onChange', reValidateMode: 'onChange' });

    // eslint-disable-next-line consistent-return
    const onFormSubmit = async (formData: any) => {
        try {
            setLoading(true);
            const result = await signupInviteAPI(
                formData.name,
                formData.email,
                'teacher',
                data?.user?.accessToken || '',
                data?.user?.schoolId || ''
            );
            if (result.status === 200) {
                return toast.success('Teacher invited successfully!');
            }
        } catch (error: any) {
            return toast.error(
                error?.response?.data?.message || 'Something went wrong'
            );
        } finally {
            setLoading(false);
        }
        // Perform any actions needed with form data here
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
                                    Add Teacher
                                </h3>
                                <p className="text-sm text-dark-gray mb-2">
                                    Invite Via Email
                                </p>
                            </div>
                        </div>
                        <div className="rounded-full bg-white border p-1 cursor-pointer">
                            <X size={15} onClick={onClose} />
                        </div>
                    </div>

                    <form onSubmit={methods.handleSubmit(onFormSubmit)}>
                        <div className="flex flex-col space-y-2 mt-2">
                            <Label className="font-semibold" htmlFor="name">
                                Teacher Name
                            </Label>
                            <Input
                                name="name"
                                placeholder="Enter name"
                                type="text"
                                rules={{
                                    required: {
                                        value: true,
                                        message: validationError.REQUIRED_FIELD,
                                    },
                                }}
                            />
                        </div>
                        <div className="flex flex-col space-y-2 mt-5">
                            <Label className="font-semibold" htmlFor="email">
                                Teacher Email Address
                            </Label>
                            <Input
                                name="email"
                                type="email"
                                placeholder="Enter email"
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
                        <ModalFooter loading={loading} text="Invite" />
                    </form>
                </div>
            </section>
        </FormProvider>
    );
}

export default AddTeacherModal;
