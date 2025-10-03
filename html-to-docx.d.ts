declare module 'html-to-docx' {
    interface Options {
        orientation?: 'portrait' | 'landscape';
    }

    function htmlToDocx(
        html: string,
        headerHtml?: string | null,
        options?: Options
    ): Promise<ArrayBuffer>;

    export = htmlToDocx;
}
