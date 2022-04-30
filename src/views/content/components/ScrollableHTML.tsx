import * as React from 'react';
import {SanitizeHtml} from '~/common/SanitizeHtml';
import {useKeyPress} from '~/common/utils';
import {SnuiContext} from '~/views/main';
import './media.less';

export interface ScrollableHTMLProps {
    unsafe_html: string;
    title?: string;
}

export const ScrollableHTML = (props: ScrollableHTMLProps) => {
    const theme = React.useContext(SnuiContext).theme;
    const keyboardScrollableContent = React.useRef<HTMLDivElement>(null);

    const onMove = (direction: "Up" | "Down") => {
        if (keyboardScrollableContent.current) {
            if (direction === "Down") {
                keyboardScrollableContent.current.scrollTop += 150;
            } else {
                keyboardScrollableContent.current.scrollTop -= 150;
            }
        }
    }

    useKeyPress(() => onMove("Down"), 'altDown');
    useKeyPress(() => onMove("Up"), 'altUp');

    return (
        <div ref={keyboardScrollableContent} className="scrollable-text-container smooth-scroll" style={{backgroundColor: theme.text_background}}>
            {props.title &&
                <h1 style={{color: theme.highlight}}>{props.title}</h1>
            }

            <SanitizeHtml html={props.unsafe_html} />
        </div>
    );
}