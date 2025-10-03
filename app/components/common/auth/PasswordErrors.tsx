import { Check } from 'lucide-react';

function PasswordErrors({ password }: { password: string }) {
    const isUpperCase = /[A-Z]/.test(password);
    const isLowerCase = /[a-z]/.test(password);
    const hasSpecialChar = /[!@#$%^&*()_+{}[\]:;<>,.?~]/.test(password);

    return (
        <div className="flex space-y-2 lg:space-y-0 lg:flex-row flex-col lg:space-x-3 mb-4 mt-2">
            <div
                className={`flex space-x-1 items-center ${
                    isUpperCase ? 'text-green-500' : 'text-red-500'
                }`}
            >
                <Check size={20} color={isUpperCase ? '#7AA43E' : '#E6500D'} />
                <p className="text-xs">At Least 1 Uppercase</p>
            </div>
            <div
                className={`flex space-x-1 items-center ${
                    isLowerCase ? 'text-green-500' : 'text-red-500'
                }`}
            >
                <Check size={20} color={isLowerCase ? '#7AA43E' : '#E6500D'} />
                <p className="text-xs">At Least 1 Lowercase</p>
            </div>
            <div
                className={`flex space-x-1 items-center ${
                    hasSpecialChar ? 'text-green-500' : 'text-red-500'
                }`}
            >
                <Check
                    size={20}
                    color={hasSpecialChar ? '#7AA43E' : '#E6500D'}
                />
                <p className="text-xs">At Least 1 Special Character</p>
            </div>
        </div>
    );
}

export default PasswordErrors;
