import { X } from 'lucide-react';
import { useFormContext } from 'react-hook-form';

function FormError({ name }: { name: string }) {
    const {
        formState: { errors },
    } = useFormContext();

    return errors[name]?.type ? (
        <div className="flex items-center gap-1 mt-1">
            <div style={{ minWidth: '20px' }}>
                <X size={20} color="#E6500D" />
            </div>
            <p className={`text-red-500 text-xs `}>
                {errors[name]?.message?.toString() ?? ''}
            </p>
        </div>
    ) : null;
}

export default FormError;
