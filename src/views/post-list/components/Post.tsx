import * as React from "react";
import {Post} from "~/common/post";
import {SnuiContext} from "~/views/main";
import "./post.less";
import {PostTopBar} from "./PostTopBar";


export interface PostProps {
    post: Post;
    highlighted: boolean;
    idx: number;
}

export const PostItem = React.forwardRef<HTMLDivElement | null, PostProps>((props, ref) => {
    const context = React.useContext(SnuiContext);
    return (
        <>
            <div style={{backgroundColor: props.highlighted ? context.theme.foreground : undefined, borderLeft: props.post.inner.over_18 ? "2px solid red" : undefined, paddingLeft: props.post.inner.over_18 ? "2.5%" : "3%"}} ref={ref} className={`post-sidebar-single`}>
                <PostTopBar user={props.post.inner.author.name} subreddit={props.post.inner.subreddit_name_prefixed} score={props.post.inner.score} comments={props.post.inner.num_comments} />
                <p style={{color: context.theme.text}} className="title">{props.post.inner.title}</p>
            </div >
        </>
    );
})