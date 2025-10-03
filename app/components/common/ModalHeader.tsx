import { LucideIcon, X } from 'lucide-react';
import React from 'react';

interface Header {
    heading?: string;
    tagline?: string;
}
interface ModalHeaderProps {
    headerText?: Header;
    Icon?:
        | React.ComponentType<React.SVGProps<SVGSVGElement>>
        | LucideIcon
        | undefined;
    onClose?: any;
}

export function ModalHeader({
    headerText,
    Icon,
    onClose,
}: ModalHeaderProps): JSX.Element {
    return (
        <div className="flex justify-between items-center">
            <div className="flex flex-col my-7">
                <div className="flex">
                    <h3 className="text-xl font-semibold mb-2 mr-1">
                        {headerText?.heading}
                    </h3>
                    {Icon && <Icon />}
                </div>
                <p className="text-sm text-dark-gray">{headerText?.tagline}</p>
            </div>
            <div className="rounded-full bg-white border p-1 cursor-pointer z-50">
                <X size={15} onClick={onClose} />
            </div>
        </div>
    );
}
