import * as React from 'react';
import {useKeyPress} from '~/common/utils';
import {Post} from '~/common/post';
import {VideoPlayer} from './components/VideoPlayer';
import './content.less';
import {CImage} from './components/Image';
import {EmbeddedYoutube} from './components/EmbeddedYoutube';
import {ScrollableHTML} from './components/ScrollableHTML';
import {FetchTextResult} from '~/ipc';
import {Readability} from "@mozilla/readability";

export interface ContentProps {
    post: Post;
    setLoading: (loading: boolean) => void;
}


export const Content = (props: ContentProps) => {
    const [readerMode, setReaderMode] = React.useState<boolean>(true);
    const [readerModeContent, setReaderModeContent] = React.useState(props.post.content.type === 'Link' ? props.post.content.readerModeContent : undefined);

    React.useEffect(() => {
        if (props.post.content.type === 'Link') {
            const parse = (_e: any, result: FetchTextResult) => {
                if (props.post.content.type === "Link") {
                    if (result.type === "Success") {
                        const parseResult = new Readability(new DOMParser().parseFromString(result.text, 'text/html')).parse()

                        if (parseResult) {
                            setReaderModeContent({type: "Content", title: parseResult.title, unsafe_html: parseResult.content});
                        }
                        else {
                            setReaderModeContent({type: "Unrenderable"});
                        }
                    } else {
                        setReaderModeContent({type: "Unrenderable"});
                    }
                } else {
                    console.log("NOT LINK");
                }
            }

            window.ipcAPI.fetchWebsiteAsText(props.post.content.url, parse);
        }
    }, [props.post.inner.id])

    useKeyPress(() => setReaderMode(old => !old), 'playPause');

    const type = props.post.content.type;
    if (type == "Text")
        return <ScrollableHTML unsafe_html={props.post.content.unsafe_html ?? "error content empty"} />;
    else if (type === "Link") {
        if (readerMode) {
            if (!readerModeContent) {
                return <h1>Loading..</h1>
            } else if (readerModeContent.type === "Content") {
                return <ScrollableHTML title={readerModeContent.title} unsafe_html={readerModeContent.unsafe_html ?? "error content empty"} />;
            } else if (readerModeContent.type === "Loading") {
                return <h1>Loading..</h1>
            } else if (readerModeContent.type === "NotLoaded") {
                console.log("not loaded at content state")
                return <h1>Press Ctrl Shift E</h1>
            }
            else {
                return <h1>Could not parse... Switch view with Ctrl+Shift+E</h1>
            }
        } else {
            return <webview className="main-content-webpage" src={props.post.content.url} title="test" />
        }
    }
    else if (type === "Media") {
        if (props.post.content._media.oembed?.provider_name === "YouTube") {
            return <EmbeddedYoutube id={extractId(props.post.content.url)} />
        }
    } else if (type === "Image") {
        return <CImage src={props.post.content.image.src} />;
    } else if (type === "Video") {
        return <VideoPlayer video={props.post.content} />;
    }

    return <h1>bug</h1>
}

const extractId = (url: string): string => {
    if (url.includes("youtu.be")) {
        return url.split("youtu.be/")[1];
    } else {
        return url.split("?v=")[1];
    }
}