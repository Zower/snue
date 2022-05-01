import {Media} from "snoowrap/dist/objects/Submission";
import {Video} from "./post";

export interface VideoProvider {
    name: () => string;
    parse: (url: string, media: Media | null) => Video | null;
}

const createVideo = (src: string) => {
    return {
        type: "Video" as const,
        url: src,
    };
}

class GfyCatProvider implements VideoProvider {
    name = () => "GfyCat"
    parse(url: string, media: Media | null): Video | null {
        if (!url.includes("gfycat.com") || !media?.oembed) {
            return null;
        }

        const src = media.oembed.thumbnail_url.replace("-mobile", "").replace("thumbs", "giant").replace(".gif", ".mp4").replace("-size_restricted", "");
        return createVideo(src);
    }
}

class RedditVideoProvider implements VideoProvider {
    name = () => "Reddit Video"
    parse(url: string, media: Media | null): Video | null {
        if (!media?.reddit_video?.hls_url) {
            return null;
        }

        return createVideo(media.reddit_video.hls_url);
    }
}

class ImgurProvider implements VideoProvider {
    name = () => "Imgur"
    parse(url: string, media: Media | null): Video | null {
        if (!url.includes("imgur.com") || !url.includes(".gifv")) {
            return null;
        }

        return createVideo(url.replace(".gifv", ".mp4"));
    }
}

class RedGifsProvider implements VideoProvider {
    name = () => "RedGifs"
    parse(url: string, media: Media | null): Video | null {
        if (!url.includes("redgifs.com")) {
            return null;
        }

        if (media?.oembed?.thumbnail_url) {
            const src = media.oembed.thumbnail_url.replace("-mobile", "").replace(".jpg", ".mp4");
            return createVideo(src);
        } else {
            console.log("RedGifs media failed. URL:", url);
            return null;
        }
    }
}

export const videoProviders: VideoProvider[] = [new GfyCatProvider, new RedditVideoProvider, new ImgurProvider, new RedGifsProvider];