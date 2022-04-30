import * as React from 'react';
import './sidebar.less';

import {Post} from '~/common/post';
import {PostItem} from './components/Post';
import {getPrefetchWindow, useKeyPress} from '~/common/utils';
import {SnuiContext} from '../main';

export interface SideBarProps {
    posts: Post[];
    highlighted: number;
    poppedOut: boolean;
    fetchMore: () => void;
    setLoading: (progress: boolean) => void;
    // setViewedPost: (post: Post) => void;
}

export type PostFilter = (post: Post) => boolean;

export const Sidebar = (props: SideBarProps) => {
    const context = React.useContext(SnuiContext);

    const highlighted = props.highlighted;
    const highlightedRef = React.useRef<HTMLDivElement>(null);

    const posts = props.posts;

    const copy = () => {
        navigator.clipboard.writeText(posts[highlighted].inner.url).then(() => {
            console.log("Copied: ", posts[highlighted].inner.url)
        })
    };

    useKeyPress(copy, 'copy');

    React.useEffect(() => {
        if (highlightedRef.current) {
            highlightedRef.current.scrollIntoView({
                behavior: 'auto',
                block: 'center',
            });
        }

    }, [highlighted]);

    React.useEffect(() => {
        const view = getPrefetchWindow(posts, 20, highlighted);
        // const commentView = getPrefetchWindow(postsToDisplay, 4, highlighted);

        for (const post of view) {
            // prefetchContent(post);
        }

        // for (const post of commentView) {
        //     prefetchComments(post);
        // }
    }, [posts, highlighted])


    const classname = `post-sidebar ${props.poppedOut ? ' pop-out ' : ''}`;

    const divRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        const handleScroll = () => {
            const position = divRef.current!!.scrollTop;
            const x = divRef.current!!.scrollHeight - (position + window.innerHeight);

            if (x < 500 || divRef.current!!.scrollHeight === 0) {
                props.fetchMore();
            }
        };

        if (divRef.current) {
            if (divRef.current.clientHeight < divRef.current.scrollHeight) {
                props.fetchMore();
            }

            divRef.current.removeEventListener('scroll', handleScroll);
            divRef.current.addEventListener('scroll', handleScroll, {passive: true});
        }

        return () => {
            divRef.current?.removeEventListener('scroll', handleScroll);
        };
    }, [divRef]);

    if (divRef.current) {
        if (divRef.current.clientHeight - divRef.current.scrollHeight === 0) {
            props.fetchMore()
        }
    }

    return (
        <>
            <div ref={divRef} style={{backgroundColor: context.theme.background, width: "30%", maxWidth: "30%", minWidth: "30%"}} className={classname} >
                <ul>
                    {posts.map((post, idx) =>
                        <li key={post.inner.id}>
                            <PostItem idx={idx} ref={idx === highlighted ? highlightedRef : undefined} post={post} highlighted={idx === highlighted} />
                        </li>)}
                </ul>
            </div>
        </>
    );
}