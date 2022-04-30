import * as React from 'react';
import Snoowrap, {Listing} from 'snoowrap';
import {useKeyPress} from '~/common/utils';
import {CommentItem} from './Comment';
import {Loading} from '~/views/main/Loading';
import {SnuiContext} from '~/views/main';

export interface CommentProps {
    comments: Listing<Snoowrap.Comment>;
    setComments: (listing: Listing<Snoowrap.Comment>) => void;
    setLoading: (loading: boolean) => void;
}

export const CommentSection = (props: CommentProps) => {
    const [comments, setComments] = React.useState(props.comments);
    const [higlighted, setHighlighted] = React.useState(0);
    const [flattened, setFlattened] = React.useState<Snoowrap.Comment[]>([]);
    const [isMounted, setIsMounted] = React.useState(true);

    const context = React.useContext(SnuiContext);

    const highlightedRef = React.useRef<HTMLDivElement>(null);
    const scrollRef = React.useRef<HTMLDivElement>(null);

    const setAll = (comments: Snoowrap.Listing<Snoowrap.Comment>) => {
        setFlattened(flatten(comments));
        setComments(comments);
        props.setComments(comments);
    }

    const fetchMore = () => {
        if (!comments.isFinished) {
            const result = comments.fetchMore({amount: 5, append: true})
            if (result.then) {
                props.setLoading(true)
                result.then((comments: Listing<Snoowrap.Comment>) => {
                    props.setLoading(false)
                    if (isMounted) {
                        setAll(comments)
                    }
                });
            }
            else {
                if (isMounted) {
                    //@ts-ignore
                    setAll(result)
                }
            }
        }
    }

    React.useEffect(() => {
        fetchMore();
        return () => setIsMounted(false)
    }, [])

    React.useEffect(() => {
        setAll(props.comments);
    }, [props.comments])


    React.useEffect(() => {
        if (highlightedRef.current) {
            highlightedRef.current.scrollIntoView({
                behavior: 'auto',
                block: 'center',
            });
        }

        const handleScroll = () => {
            const position = scrollRef.current!!.scrollTop;
            const x = scrollRef.current!!.scrollHeight - (position + window.innerHeight);

            if (x < 500) {
                fetchMore();
            }
        };

        if (scrollRef.current) {
            scrollRef.current.removeEventListener('scroll', handleScroll);
            scrollRef.current.addEventListener('scroll', handleScroll, {passive: true});
        }

        return () => {
            scrollRef.current?.removeEventListener('scroll', handleScroll);
        };
    }, [higlighted, scrollRef])

    if (scrollRef.current) {
        if (scrollRef.current.clientHeight - scrollRef.current.scrollHeight === 0) {
            fetchMore()
        }
    }

    useKeyPress(() => setHighlighted(old => navigate(flattened, old, "Down")), 'down');
    useKeyPress(() => setHighlighted(old => navigate(flattened, old, "Up")), 'up');

    useKeyPress(() => setHighlighted(old => Math.min(flattened.length - 1, old + 1)), 'altDown');
    useKeyPress(() => setHighlighted(old => Math.max(0, old - 1)), 'altUp');

    if (!comments.isFinished && flattened.length === 0) {
        // TODO Show pretty view
        return <Loading />;
    } else if (comments.length === 0 && comments.isFinished) {
        return <h3 style={{padding: "35%"}}>*Crickets*</h3>
    } else {
        return (
            <div ref={scrollRef} style={{overflowX: "hidden", overflowY: "scroll", width: "100%", height: "100vh", backgroundColor: context.theme.content_background}}>
                <ul>
                    {flattened.map((comment, idx) =>
                        <li key={comment.id}>
                            <CommentItem
                                comment={comment}
                                highlight={idx === higlighted}
                                ref={idx === higlighted ? highlightedRef : undefined}
                            />
                        </li>)}
                </ul>
            </div>
        )
    }
}

const flatten = (comments: Listing<Snoowrap.Comment>): Snoowrap.Comment[] => {
    return comments.reduce<Snoowrap.Comment[]>((acc, c) => {
        acc.push(c);
        if (c.replies.length > 0) {
            acc = acc.concat(flatten(c.replies));
        }

        return acc;
    }, [])
}

const navigate = (flattened: Snoowrap.Comment[], start: number, direction: "Up" | "Down"): number => {
    if (flattened.length === 0 || (start === 0 && direction === "Up")) {
        return 0;
    } else if (start === flattened.length - 1 && direction === "Down") {
        return flattened.length - 1;
    }

    let i = start;
    let comment = flattened[direction === "Up" ? i -= 1 : i += 1];

    while (comment && comment.depth > flattened[start].depth) {
        comment = flattened[direction === "Up" ? i -= 1 : i += 1];
    }

    if (i > flattened.length - 1) {
        return flattened.length - 1;
    }

    return i;
}