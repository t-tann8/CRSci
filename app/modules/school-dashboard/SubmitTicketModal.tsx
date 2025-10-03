'use client';

import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useForm, FormProvider, useFormContext } from 'react-hook-form';
import ModalFooter from '@/app/components/common/ModalFooter';
import SyncIcon from '@/app/assets/icons/SyncIcon';
import AppDropDown, {
    OptionsInterface,
} from '@/app/components/common/AppDropDown';
import { Label } from '@/app/components/ui/label';
import FormError from '@/app/components/common/FormError';
import { createTicketAPI } from '@/app/api/school';
import { useSession } from 'next-auth/react';
import { toast } from 'react-toastify';
import action from '@/app/action';

function CustomTextarea({ name, ...props }: any) {
    const {
        register,
        formState: { errors },
    } = useFormContext();
    return (
        <div>
            <textarea
                {...register(name, {
                    required: 'Message is required',
                })}
                {...props}
                className={`border h-[120px] w-full rounded-lg p-3 resize-none 
                            bg-slate-100 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 font-medium ${
                                errors[name] ? 'border-red-500' : ''
                            }`}
            />
            <FormError name={name} />
        </div>
    );
}

function SubmitTicketModal({ onClose }: any) {
    const methods = useForm({ mode: 'onChange', reValidateMode: 'onChange' });
    const [selectedOption, setSelectedOption] = useState('Payment Problem');
    const [isLoading, setIsloading] = useState(false);
    const { data } = useSession();

    const handleSelectChange = (
        event: React.ChangeEvent<HTMLSelectElement>
    ) => {
        setSelectedOption(event.target.value);
    };
    const gradeOptions: OptionsInterface[] = [
        { label: 'Payment Problem', value: 'Payment Problem' },
    ];

    // eslint-disable-next-line consistent-return
    const onSubmit = async (formData: any) => {
        try {
            setIsloading(true);
            const result = await createTicketAPI(
                data?.user?.accessToken || '',
                data?.user?.id || '',
                selectedOption,
                formData?.message
            );
            if (result?.statusCode === 200) {
                action('getSchoolDashboard');
                return toast.success(result?.message);
            }
            return toast.error(result?.message);
        } catch (error) {
            console.error('Error creating ticket:', error);
        } finally {
            setIsloading(false);
        }
    };

    return (
        <FormProvider {...methods}>
            <section className="w-full bg-white h-screen py-4 px-6 shadow-lg">
                <div>
                    <div className="flex justify-between items-center">
                        <div className="flex my-7">
                            <div className="bg-green-100 px-3 h-fit py-3 rounded-lg">
                                <SyncIcon
                                    fill="#7AA43E"
                                    width="30"
                                    height="30"
                                />
                            </div>
                            <div className="flex flex-col ml-2">
                                <h3 className="text-xl font-semibold mr-1">
                                    Submit Ticket
                                </h3>
                                <p className="text-sm text-dark-gray mb-2">
                                    Register New Complaint
                                </p>
                            </div>
                        </div>
                        <div className="rounded-full bg-white border p-1 cursor-pointer">
                            <X size={15} onClick={onClose} />
                        </div>
                    </div>

                    <form onSubmit={methods.handleSubmit(onSubmit)}>
                        <div className="flex flex-col space-y-2">
                            <Label className="font-semibold" htmlFor="invite">
                                Complaint Type
                            </Label>

                            <AppDropDown
                                name="invite"
                                options={gradeOptions}
                                value={selectedOption}
                                onChange={handleSelectChange}
                            />
                        </div>
                        <div className="flex flex-col space-y-2 mt-7">
                            <Label className="font-semibold" htmlFor="message">
                                Your Message
                            </Label>
                            <CustomTextarea
                                name="message"
                                placeholder="Type your message"
                            />
                        </div>
                        <div className="text-center mt-8">
                            <ModalFooter
                                text="Submit"
                                buttonType="submit"
                                loading={isLoading}
                            />
                        </div>
                    </form>
                </div>
            </section>
        </FormProvider>
    );
}

export default SubmitTicketModal;
