import React from 'react';
import Image from 'next/image';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import { useForm, FormProvider, set } from 'react-hook-form';
import { Button } from '@/app/components/ui/button';
import crscLogo from '@/app/assets/images/crsclogo.svg';
import { Label } from '@/app/components/ui/label';
import { resetPassword } from '@/lib/react-redux/features/auth/authAction';
import { useAppDispatch, useAppSelector } from '@/lib/react-redux/hooks';
import { validationError } from '@/lib/utils';
import { Eye, EyeOff } from 'lucide-react';
import Input from '../Input';
import ButtonLoader from '../ButtonLoader';

function CreatePasswordForm({ description }: { description: string }) {
    const { push } = useRouter();
    const dispatch = useAppDispatch();
    const state = useAppSelector((state) => state.user);
    const [isLoader, setIsLoader] = React.useState(false);
    const [showPassword, setShowPassword] = React.useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);

    const methods = useForm({ mode: 'onChange', reValidateMode: 'onChange' });

    // eslint-disable-next-line consistent-return
    const onFormSubmit = async (data: any) => {
        try {
            setIsLoader(true);
            const { newPassword } = data;
            const { id } = state.data;
            const response = await dispatch(resetPassword({ id, newPassword }));
            if (response.type === 'user/verifyOTP/rejected') {
                toast.error(response.payload);
                return push('/forgot-password');
            }
            toast.success('Successfully Updated Password');
            return push('/signin');
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoader(false);
        }
    };
    const toggleShowPassword = () => {
        setShowPassword((prev) => !prev);
    };

    const toggleShowConfirmPassword = () => {
        setShowConfirmPassword((prev) => !prev);
    };

    return (
        <div className=" p-8 md:p-10 w-[100%] lg:w-[75%] flex flex-col ">
            <div className="flex  lg:items-start flex-col">
                <Image
                    height={100}
                    width={100}
                    src={crscLogo}
                    alt="CRSC Logo"
                />
                <h1 className="text-2xl font-semibold mt-6">Create Password</h1>
                <p className="text-sm font-medium text-dark-gray mb-6">
                    {description}
                </p>
            </div>
            <FormProvider {...methods}>
                <form onSubmit={methods.handleSubmit(onFormSubmit)}>
                    <div className="mt-2 relative">
                        <Label htmlFor="password">New Password</Label>
                        <Input
                            name="newPassword"
                            placeholder="Enter Password"
                            type="password"
                            rules={{
                                required: {
                                    value: true,
                                    message: validationError.REQUIRED_FIELD,
                                },
                                pattern: {
                                    value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[~`!@#$%^&*()_\-\\+=:;"'?\\/>.<,{}\\[\]])[a-zA-Z\d~`!@#$%^&*()_\-\\+=:;"'?\\/>.<,{}\\[\]]{8,}$/,
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
                        <button
                            type="button"
                            onClick={toggleShowPassword}
                            className="absolute right-3 top-10 mt-1"
                        >
                            {showPassword ? (
                                <Eye className="w-5 h-5" />
                            ) : (
                                <EyeOff className="w-5 h-5" />
                            )}
                        </button>
                    </div>

                    <div className="mt-2 relative">
                        <Label htmlFor="password">Confirm Password</Label>
                        <Input
                            name="confirmPassword"
                            placeholder="Confirm Password"
                            type="password"
                            rules={{
                                required: {
                                    value: true,
                                    message: validationError.REQUIRED_FIELD,
                                },
                                validate: (value: string) =>
                                    value ===
                                        methods.getValues('newPassword') ||
                                    'Passwords must match',
                            }}
                        />
                        <button
                            type="button"
                            onClick={toggleShowConfirmPassword}
                            className="absolute right-3 top-10 mt-1"
                        >
                            {showConfirmPassword ? (
                                <Eye className="w-5 h-5" />
                            ) : (
                                <EyeOff className="w-5 h-5" />
                            )}
                        </button>
                    </div>

                    <div className="text-center mt-8">
                        <Button
                            type="submit"
                            disabled={isLoader}
                            className="w-full bg-primary-color lg:hover:bg-orange-400 mb-3"
                        >
                            {isLoader ? <ButtonLoader /> : 'Create Password'}
                        </Button>
                    </div>
                </form>
            </FormProvider>
        </div>
    );
}

export default CreatePasswordForm;
