import * as React from 'react';
import Snoowrap from 'snoowrap';
import {commentDepthColor} from '~/common/style';
import {SnuiContext} from '~/views/main';
import './comment.less';
import {CommentTopBar} from './CommentTopBar';

export interface CommentProps {
    comment: Snoowrap.Comment;
    highlight: boolean;
}
export const CommentItem = React.forwardRef<HTMLDivElement | null, CommentProps>((props, ref) => {
    const context = React.useContext(SnuiContext);
    return (
        <>
            <div ref={ref} style={{width: "100%"}}>
                <div
                    style={{
                        width: "95%", position: 'relative', left: `${props.comment.depth * 7}px`, paddingRight: "50px", backgroundColor: props.highlight ? context.theme.foreground : undefined
                    }}>
                    <div style={{backgroundColor: commentDepthColor(props.comment.depth)}} className="comment-highlight-color" />
                    <div className='comment-divider' />
                    <div className='comment-item'>
                        <CommentTopBar user={props.comment.author.name} score={props.comment.score} time={props.comment.created} />
                        <p className="body" style={{color: context.theme.text}}>{props.comment.body}</p>
                    </div>
                </div>
            </div>
        </>
    )
})