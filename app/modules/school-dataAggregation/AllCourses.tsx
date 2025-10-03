import React from 'react';
import CourseCard, { CourseCardInterface } from './CourseCard';

interface Standard {
    id: string;
    name: string;
    description: string;
    courseLength: string;
    createdAt: string;
    updatedAt: string;
}

const courses: CourseCardInterface[] = [
    {
        id: '1',
        name: 'Corona Virus',
    },
    {
        id: '2',
        name: 'Corona Virus Topic 2',
    },
    {
        id: '3',
        name: 'Aggregates and Programs',
    },
    {
        id: '4',
        name: 'Computatioal Devices',
    },
    {
        id: '5',
        name: 'Internet Services',
    },
    {
        id: '6',
        name: 'Programming and Data Structures',
    },
    {
        id: '7',
        name: 'Corona Virus',
    },
    {
        id: '8',
        name: 'Corona Virus',
    },
    {
        id: '9',
        name: 'Corona Virus',
    },
    {
        id: '10',
        name: 'Corona Virus',
    },
];
function AllCourses({ standards }: { standards: Standard[] }) {
    return (
        <section className="pb-5">
            <h1 className="font-semibold text-xl">All Courses</h1>
            {standards?.length > 0 ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 mt-5">
                    {standards?.map((standard) => (
                        <div key={standard.id}>
                            <CourseCard name={standard.name} id={standard.id} />
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center w-full text-lg h-72 flex items-center justify-center">
                    No Standard Assigned to any Classroom by Teacher!
                </div>
            )}
        </section>
    );
}

export default AllCourses;
