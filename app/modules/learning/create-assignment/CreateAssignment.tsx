/* eslint-disable jsx-a11y/tabindex-no-positive */

'use client';

/* eslint-disable import/no-extraneous-dependencies */
import AWS from 'aws-sdk';
import mammoth from 'mammoth';
import dynamic from 'next/dynamic';
import HTMLtoDOCX from 'html-to-docx';
import { toast } from 'react-toastify';
import { useSession } from 'next-auth/react';
import { String } from 'aws-sdk/clients/apigateway';
import { PutObjectRequest } from 'aws-sdk/clients/s3';
import React, { useState, useEffect, useMemo, useRef } from 'react';
import action from '@/app/action';
import { convertSpacesToDashes } from '@/lib/utils';
import PageLoader from '@/app/components/common/PageLoader';
import { createAssessmentAnswerAPI } from '@/app/api/assignment';

const JoditEditor: any = dynamic(() => import('jodit-react'), { ssr: false });
function S3DocxEditor({
    resourceId,
    documentURL,
    attempted,
    name,
    canWrite,
    deadline,
    standardId,
}: {
    resourceId: string;
    documentURL: string;
    attempted: boolean;
    name: string;
    canWrite: boolean;
    deadline: string;
    standardId: string;
}) {
    const { data, status } = useSession();
    const editor = useRef(null);

    const [isLoading, setIsLoading] = useState(false);
    const [isMounted, setIsMounted] = useState(false);
    const [buttonLoader, setButtonLoader] = useState(false);
    const [content, setContent] = useState('');
    const uploadAttempt = async (fileBuffer: ArrayBuffer, fileName: string) => {
        try {
            setButtonLoader(true);
            const s3 = new AWS.S3({
                accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID,
                secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY,
                region: process.env.NEXT_PUBLIC_AWS_DEFAULT_REGION,
            });
            const params: PutObjectRequest = {
                Bucket: process.env.NEXT_PUBLIC_AWS_BUCKET || 'default-bucket',
                Key: fileName,
                Body: fileBuffer,
                ContentType:
                    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            };

            const response = await s3.upload(params).promise();

            if (!response) {
                throw new Error('Failed to upload file');
            }

            const url = s3.getSignedUrl('getObject', {
                Bucket: process.env.NEXT_PUBLIC_AWS_BUCKET,
                Key: response.Key,
            });

            const studentAnswer = url.split('?')[0];

            const APIresponse = await createAssessmentAnswerAPI({
                accessToken: data?.user?.accessToken || '',
                userId: data?.user?.id || '',
                standardId,
                resourceId,
                answerURL: studentAnswer,
            });

            if (APIresponse.status !== 200) {
                throw new Error('Failed to upload file');
            }

            action('getStudentDashboardSummaries');
            return toast.success('File uploaded successfully');
        } catch (error: any) {
            return toast.error(
                error?.response?.data?.message || 'Failed to upload file'
            );
        } finally {
            setButtonLoader(false);
        }
    };

    useEffect(() => {
        setIsLoading(true);
        fetchDocxFromS3(documentURL)
            .then((docxContent) => {
                setIsLoading(false);
                convertDocxToHTML(docxContent);
            })
            .catch((error) => {
                setIsLoading(false);
            });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const fetchDocxFromS3 = async (url: string): Promise<ArrayBuffer> => {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Failed to fetch document from S3');
        }
        return response.arrayBuffer();
    };

    const convertDocxToHTML = async (
        docxContent: ArrayBuffer
    ): Promise<void> => {
        try {
            const { value } = await mammoth.convertToHtml({
                arrayBuffer: docxContent,
            });
            setContent(value);
        } catch (error) {
            // console.error('Error converting .docx to HTML:', error);
        }
    };

    const handleChange = (content: String) => {
        setContent(content);
    };

    const convertHTMLToDocx = async (htmlContent: string) => {
        const options: any = {
            table: { row: { cantSplit: true } },
            footer: true,
            pageNumber: true,
        };

        const fileBuffer: ArrayBuffer = await HTMLtoDOCX(
            htmlContent,
            null,
            options
        );

        return fileBuffer;
    };

    const config: any = useMemo(
        () => ({
            readonly: !canWrite,
            tabIndex: 1,
            placeholder: 'Type something here',
        }),
        [canWrite]
    );
    const handleSubmit = async () => {
        const docxBlob = await convertHTMLToDocx(content);
        await uploadAttempt(
            docxBlob,
            `AssessmentAttempts/${data?.user
                ?.id}-${resourceId}-${convertSpacesToDashes(name)}.docx`
        );
    };
    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted || status === 'loading') {
        return <PageLoader />;
    }

    return isLoading ? (
        <PageLoader />
    ) : (
        <>
            <h1 className="text-2xl font-bold mb-5 flex justify-center">{`Deadline - ${deadline}`}</h1>
            <JoditEditor
                ref={editor}
                config={config}
                tabIndex={1}
                value={content}
                onBlur={handleChange}
            />
            <button
                type="button"
                className="mt-5 rounded-md bg-blue-500 text-white px-4 py-2 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-white"
                onClick={handleSubmit}
                disabled={buttonLoader}
            >
                {buttonLoader ? 'Uploading...' : 'Submit'}
            </button>
        </>
    );
}

export default S3DocxEditor;
