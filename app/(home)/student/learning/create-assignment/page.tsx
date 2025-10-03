import React from 'react';
import CreateAssignment from '@/app/modules/learning/create-assignment/CreateAssignment';

function CreateAssignmentPage() {
    return (
        <CreateAssignment
            resourceId=""
            documentURL=""
            attempted={false}
            name=""
            canWrite={false}
            deadline=""
            standardId=""
        />
    );
}

export default CreateAssignmentPage;
