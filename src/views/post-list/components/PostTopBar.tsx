import * as React from "react";
import {SnuiContext} from "~/views/main";
import "./post.less";


export interface PostTopBarProps {
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
                <p className="post-number" style={{color: context.theme.text}}>💬 {props.comments}</p>
            </div>
        </div >
    );
}