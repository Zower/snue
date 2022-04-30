import React from "react";
import Snoowrap from "snoowrap"
import {Media as SnooMedia} from "snoowrap/dist/objects/Submission";
import {FetchTextResult} from "~/ipc";
import {videoProviders} from "./providers";

export interface Post {
    inner: Snoowrap.Submission;
    content: PostContent;
}

// Selfpost
export interface Text {
    type: "Text";
    unsafe_html: string | null;
}

interface ReaderModeContentAvailable {
    type: "Content";
    title: string;
    unsafe_html: string;
}

interface ReaderModeContentUnavailable {
    type: "Unrenderable";
}

interface ReaderModeContentNotLoaded {
    type: "NotLoaded";
}

interface ReaderModeContentLoading {
    type: "Loading";
}

type ReaderModeContent = ReaderModeContentAvailable | ReaderModeContentUnavailable | ReaderModeContentNotLoaded | ReaderModeContentLoading;
// External link
export interface Link {
    type: "Link";
    url: string;
    readerModeContent: ReaderModeContent;
}

// Various accepted formats, e.g. YouTube.
export interface Media {
    type: "Media";
    url: string;
    mediaType: MediaType;
    _media: SnooMedia;
}

// jpg, png..
export interface Image {
    type: "Image"
    image: HTMLImageElement,
}

// MP4, webm etc. Can be played with <video> element
export interface Video {
    type: "Video"
    // video: React.ReactElement;
    // video2: HTMLVideoElement;
    url: string,
}


// const x = React.createElement('video', {src: 'abc'});


export type MediaType = "Youtube"

export type PostContent = Text | Link | Image | Video | Media;

// export const prefetchComments = (post: Post) => {
//     if (post.inner.comments.length === 0 && !post.inner.comments.isFinished) {
//         post.inner.comments.fetchMore({ amount: 5 }).then(comments => {
//             console.log("arrived for ", post.inner.title)
//             post.inner.comments = comments;
//         });
//     }
// }

export const postToDomain = (post: Snoowrap.Submission, prefetchComments: boolean): Post => {
    for (const vidProvider of videoProviders) {
        const content = vidProvider.parse(post.url, post.media);

        if (content) {
            const src = content.url
            // fetch()

            if (!(src.includes(".mp4") || src.includes(".webm") || src.includes("mpd"))) {
                throw new Error(("Video provider " + vidProvider.name() + " did not provide valid url. Url: " + src));
            }

            return {
                inner: post,
                content,
            }
        }
    }

    let content: PostContent;

    if (post.is_self) {
        content = {type: "Text", unsafe_html: post.selftext_html};
    } else if (isImage(post.url)) {
        const image = new Image();
        image.src = post.url;
        content = {type: "Image", image};
    }
    else if (post.media && post.url.includes('youtu')) {
        console.log("Allowing media: ", post.media);

        content = {type: "Media", url: post.url, mediaType: "Youtube", _media: post.media};
    }
    else {
        content = {type: "Link", url: post.url, readerModeContent: {type: "NotLoaded"}};
    }

    return {
        inner: post,
        content,
    }
}

const isImage = (url: string): boolean => [".jpg", ".jpeg", ".png", ".gif"].some(v => url.endsWith(v))