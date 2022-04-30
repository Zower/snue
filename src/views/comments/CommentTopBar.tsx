import * as React from "react";
import {SnuiContext} from "~/views/main";
import "./comment.less";

export interface CommentTopBarProps {
    user: string;
    score: number;
    time: number;
}

export const CommentTopBar = (props: CommentTopBarProps) => {
    const context = React.useContext(SnuiContext);
    const seconds = (Date.now() - props.time * 1000) / 1000;
    const minutes = seconds / 60;
    const hours = seconds / 3600;

    let timeDiffString: string;

    if (seconds < 60) {
        timeDiffString = seconds.toFixed(0) + "s";
    } else if (minutes < 59) {
        timeDiffString = minutes.toFixed(0) + "m";
    } else if (hours < 23) {
        timeDiffString = hours.toFixed(0) + "h";
    } else if (seconds / 2592000 < 12) {
        timeDiffString = (seconds / 2592000).toFixed(0) + "M";
    } else {
        timeDiffString = (seconds / 31536000).toFixed(0) + "Y";
    }

    return (
        <div className="comment-topbar-content">
            <p className="submission-info" style={{color: context.theme.highlight}}>u/{props.user}</p>
            <p className="comment-number" style={{color: context.theme.text}}>↑ {props.score}</p>
            <p className="comment-number" style={{color: context.theme.text}}>⌛ {timeDiffString}</p>
        </div>
    );
}