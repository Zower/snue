import * as React from 'react';
import sanitize from 'sanitize-html';

export interface SanitizeHtmlProps {
    html: string;
}

export const SanitizeHtml = (props: SanitizeHtmlProps) => {
    const clean = sanitize(props.html, {
        allowedTags: sanitize.defaults.allowedTags.concat(['img']),
        disallowedTagsMode: 'escape',
    });

    return (
        <div dangerouslySetInnerHTML={{ __html: clean }} />
    );
}