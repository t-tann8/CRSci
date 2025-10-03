import React from 'react';
import CreateAssignment from '@/app/modules/learning/create-assignment/CreateAssignment';

function EditAssignmentPage() {
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

export default EditAssignmentPage;
