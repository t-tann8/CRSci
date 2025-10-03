'use client';

import React, { useEffect } from 'react';
import { useFormContext } from 'react-hook-form';

function SetEmptyValue({
    index,
    topicIndex,
    allSelectedResources,
    setAllSelectedResources,
}: {
    index: number;
    topicIndex: number;
    allSelectedResources: any;
    setAllSelectedResources: any;
}) {
    const { watch, setValue } = useFormContext();

    useEffect(() => {
        // Update the form value
        setValue(
            `standard.dailyUploads.${index}.topics.${topicIndex}.resourceId`,
            ''
        );

        // Update the allSelectedResources state
        setAllSelectedResources((prevResources: any) =>
            prevResources.map((resourceArray: any, i: number) =>
                i === index
                    ? resourceArray.map((resource: any, j: number) =>
                          j === topicIndex
                              ? {
                                    ...resource,
                                    resourceId: '',
                                    resourceType: watch(
                                        `standard.dailyUploads.${index}.topics.${topicIndex}.type`
                                    ),
                                    name: '',
                                }
                              : resource
                      )
                    : resourceArray
            )
        );
    }, [index, topicIndex, setValue, setAllSelectedResources, watch]);

    return <>hello</>;
}

export default SetEmptyValue;
