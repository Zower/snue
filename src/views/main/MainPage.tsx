import * as React from 'react';
import {Content} from '~/views/content/Content';
import {Sidebar} from '../post-list/Sidebar';
import {Post} from '~/common/post';
import {useKeyPress, useWindowDimensions} from '~/common/utils';
import {NewWindow} from '~/common/components/NewWindow';
import {GlobalKeybinds} from './components/GlobalKeybinds';
import {GlobalUI} from './components/GlobalUI';
import {Mode, ModeContext, SnuiContext} from '.';
import {defaultFilters, Filters, getFilters} from '../post-list/filters';
import {Loading} from './Loading';
import {CommentSection} from '../comments/CommentSection';
import {VimModeProvider} from '../vaildMode';

export interface ModeConfig {
    previousMode: Mode;
    currentMode: Mode;
}


export interface MainPageProps {
    posts: Post[];
    subreddit: string;
    setSubreddit: (subreddit: string) => void;
    setMode: (mode: Mode) => void;
    setLoading: (loading: boolean) => void;
    fetchMore: () => void;
}

export const MainPage = (props: MainPageProps) => {
    const [highlighted, setHighlighted] = React.useState<number>(0);
    const [filters, setFilters] = React.useState<Filters>(defaultFilters);
    const [sidebarState, setSidebarState] = React.useState<ViewState>("Fixed");
    const [commentState, setCommentState] = React.useState<ViewState>("Fixed");
    const [posts, setPosts] = React.useState(props.posts);

    const mode = React.useContext(ModeContext);

    React.useEffect(() => {
        setHighlighted(0);
    }, [props.subreddit, filters])

    React.useEffect(() => {
        let posts = props.posts;

        for (const filter of getFilters(filters)) {
            posts = posts.filter(filter);
        }

        setPosts(posts);
    }, [filters, props.posts])

    // somewhere else

    // useKeyPress(() => setSidebarState(old => toggleState(old)), 'toggleSidebarState');
    // useKeyPress(() => setCommentState(old => toggleState(old)), 'toggleCommentState');

    // todo filters and clean up, move one level down so they have context
    useKeyPress(() => setHighlighted(old => Math.min(posts.length, old + 1)), 'down');
    useKeyPress(() => setHighlighted(old => Math.max(0, old - 1)), 'up');

    const windowDimensions = useWindowDimensions();

    const renderSideBar = (poppedOut: boolean) => {
        return <Sidebar poppedOut={poppedOut} fetchMore={props.fetchMore} posts={posts} setLoading={props.setLoading} highlighted={highlighted} />
    }

    const post = posts[highlighted];

    if (!post) {
        return <Loading />
    } else {
        return (
            <>
                <VimModeProvider validMode='GLOBAL'>
                    <GlobalKeybinds setMode={props.setMode} />
                    <GlobalUI setSubreddit={props.setSubreddit} setMode={props.setMode} setFilters={setFilters} />
                </VimModeProvider>
                <VimModeProvider validMode={'NORMAL'} >
                    <div style={{display: 'flex', width: windowDimensions.width, height: windowDimensions.height, overflow: 'clip'}}>
                        {sidebarState === "SeparateWindow" ?
                            <NewWindow width={450} height={800} >
                                {renderSideBar(true)}
                            </NewWindow>
                            :
                            <>
                                {renderSideBar(false)}
                            </>
                        }
                        {mode.currentMode === 'COMMENTS' ?
                            // TODO Pop out
                            <VimModeProvider validMode='COMMENTS'>
                                <CommentSection comments={post.inner.comments} setComments={(c) => post.inner.comments = c} setLoading={props.setLoading} />
                            </VimModeProvider>
                            :
                            <Content
                                post={post}
                                setLoading={props.setLoading}
                            />
                        }
                    </div>
                </VimModeProvider>
            </>
        );
    }
}


const toggleState = (state: ViewState): ViewState => {
    return state === "Fixed" ? "SeparateWindow" : "Fixed";
};

export type ViewState = "Fixed" | "SeparateWindow";
