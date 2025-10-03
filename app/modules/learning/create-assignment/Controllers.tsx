import {
    AlignCenter,
    AlignLeft,
    AlignRight,
    Bold,
    Italic,
    List,
    ListOrdered,
    Underline,
} from 'lucide-react';
import React from 'react';

function Controllers() {
    return (
        <section className="flex flex-wrap justify-center items-center gap-4 border bg-white  rounded-xl p-4 md:p-2">
            {[
                { icon: <Bold />, label: 'Bold' },
                { icon: <Italic />, label: 'Italic' },
                { icon: <Underline />, label: 'Underline' },
                { icon: <ListOrdered />, label: 'Ordered List' },
                { icon: <List />, label: 'Unordered List' },
                { icon: <AlignLeft />, label: 'Align Left' },
                { icon: <AlignRight />, label: 'Align Right' },
                { icon: <AlignCenter />, label: 'Align Center' },
            ].map(({ icon, label }, index) => (
                <div
                    key={label}
                    className="border border-gray-200 rounded-xl p-2 w-fit m-2"
                >
                    {icon}
                </div>
            ))}
        </section>
    );
}

export default Controllers;
