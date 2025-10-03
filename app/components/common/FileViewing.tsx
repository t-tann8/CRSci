/* eslint-disable jsx-a11y/iframe-has-title */

'use client';

import { ResourceType } from '@/lib/utils';

export default function FileViewing({
    resourceURL,
    type,
}: {
    resourceURL: string;
    type: ResourceType;
}) {
    // if (type === ResourceType.ASSIGNMENT || type === ResourceType.QUIZ) {
    //     return (
    //         <iframe
    //             src={`https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(
    //                 resourceURL
    //             )}`}
    //             width="100%"
    //             height="600px"
    //         >
    //             This is an embedded{' '}
    //             <a target="_blank" href="http://office.com" rel="noreferrer">
    //                 Microsoft Office
    //             </a>{' '}
    //             document, powered by{' '}
    //             <a
    //                 target="_blank"
    //                 href="http://office.com/webapps"
    //                 rel="noreferrer"
    //             >
    //                 Office Online
    //             </a>
    //             .
    //         </iframe>
    //     );
    // }
    let resourceRenderingLink = '';
    if (
        type === ResourceType.ASSIGNMENT ||
        type === ResourceType.QUIZ ||
        type === ResourceType.WORKSHEET ||
        type === ResourceType.FORMATIVE_ASSESSMENT ||
        type === ResourceType.SUMMARIZE_ASSESSMENT
    ) {
        const isGoogleDocs = resourceURL.includes('docs.google.com/document');
        resourceRenderingLink = isGoogleDocs
            ? `https://docs.google.com/document/d/${
                  resourceURL.split('/d/')[1].split('/')[0]
              }/preview`
            : `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(
                  resourceURL
              )}`;
    } else if (type === ResourceType.SLIDESHOW) {
        const isGoogleSlides = resourceURL.includes(
            'docs.google.com/presentation'
        );
        resourceRenderingLink = isGoogleSlides
            ? `https://docs.google.com/presentation/d/${
                  resourceURL.split('/d/')[1].split('/')[0]
              }/embed?start=false&loop=false&delayms=3000`
            : `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(
                  resourceURL
              )}`;
    } else {
        resourceRenderingLink = resourceURL;
    }
    return (
        <div className="text-lg flex justify-center">
            <iframe
                src={resourceRenderingLink}
                title="File Viewer"
                frameBorder="0"
                style={{ width: '100%', minHeight: '100vh' }}
                className=""
            />
        </div>
    );
}
