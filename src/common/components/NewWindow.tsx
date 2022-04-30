import * as React from 'react';
import { createPortal } from 'react-dom';

export interface NewWindowProps {
    width: number;
    height: number;
    frame?: boolean;
    children: React.ReactNode;
}

export const NewWindow = (props: NewWindowProps) => {
    const newWindow = React.useRef<Window | null>(null);
    const [container, setContainer] = React.useState<null | HTMLDivElement>(null);

    React.useEffect(() => {
        setContainer(document.createElement("div"));
    }, []);

    React.useEffect(() => {
        if (container) {
            newWindow.current = window.open(
                "",
                "_blank",
                `width=${props.width},height=${props.height},left=200,top=200,frame=${props.frame ?? true}`
            );
            copyStyles(document, newWindow.current!!.document);
            newWindow.current!!.document.body.appendChild(container);

            return () => newWindow.current!!.close();
        }
    }, [container]);

    return container && createPortal(props.children, container);

}

export const copyStyles = (sourceDoc: Document, targetDoc: Document) => {
    Array.from(sourceDoc.styleSheets).forEach(styleSheet => {
        if (styleSheet.cssRules) { // for <style> elements
            const newStyleEl = sourceDoc.createElement('style');

            Array.from(styleSheet.cssRules).forEach(cssRule => {
                // write the text of each rule into the body of the style element
                newStyleEl.appendChild(sourceDoc.createTextNode(cssRule.cssText));
            });

            targetDoc.head.appendChild(newStyleEl);
        }
    });
}