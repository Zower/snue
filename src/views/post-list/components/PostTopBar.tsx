import * as React from "react";
import {Post} from "~/common/post";
import {SnuiContext} from "~/views/main";
import "./post.less";


export interface PostTopBarProps {
    post: Post;
    subreddit: string;
    user: string;
    score: number;
    comments: number;
}

export const PostTopBar = (props: PostTopBarProps) => {
    const context = React.useContext(SnuiContext);
    return (
        <div className="post-topbar">
            <div className="topbar-content">
                <p className="submission-info" style={{color: context.theme.highlight}}>{props.subreddit}</p>
                <p className="submission-info" style={{color: context.theme.text}}>u/{props.user}</p>
            </div>
            <div className="topbar-content">
                <p className="post-number" style={{color: context.theme.text}}>↑ {props.score}</p>
                <p className="post-number" style={{color: context.theme.text}}>💬 {props.comments}  {contentTypeToEmoji(props.post)}</p>
            </div>
        </div >
    );
}

const contentTypeToEmoji = (post: Post) => {
    if (post.content.type === 'Album') {
        return `📷{post.content.images ? post.content.images.length : ''}`
    } else if (post.content.type === 'Image') {
        return '📷';
    } else if (post.content.type === 'Video') {
        return '🎥';
    } else if (post.content.type === 'Text') {
        return '📄';
    } else if (post.content.type === 'Link') {
        return '🔗';
    } else if (post.content.type === 'Media') {
        return '📺';
    }
}