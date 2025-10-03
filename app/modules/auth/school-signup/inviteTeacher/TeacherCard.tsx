import { X } from 'lucide-react';
import React from 'react';

export interface TeacherCardInterface {
    id: string;
    name: string;
    email: string;
}
function TeacherCard({ name, email, id }: TeacherCardInterface) {
    return (
        <div key={id} className="border-2 rounded-lg p-3">
            <div className="flex justify-between mb-2  font-semibold">
                <p>{name}</p>
                <X color="#E6500D" />
            </div>
            <p className="text-dark-gray font-medium">{email}</p>
        </div>
    );
}

export default TeacherCard;
