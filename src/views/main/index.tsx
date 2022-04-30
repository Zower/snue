import * as React from 'react';
import {useState, createContext, useEffect} from 'react';
import {postToDomain} from '~/common/post';
import {TopLoadingBar} from './components/TopLoadingBar';
import {Theme, defaultTheme} from '~/common/style';
import Snoowrap from 'snoowrap';
import {config, ConfigStore} from '~/common/config';
import {Loading} from './Loading';
import {MainPage} from './MainPage';

export type Mode = 'NORMAL' | 'COMMENTS' | 'INSERT' | 'GLOBAL';

export interface ModeContext {
    previousMode: Mode;
    currentMode: Mode;
    _set?: (mode: Mode) => void;
}


export interface SnuiContext {
    theme: Theme;
    settings: {};
    config: ConfigStore;
}

const defaultContext: SnuiContext = {
    theme: defaultTheme,
    settings: {},
    config: config,
};


export interface MainPageProps {
    snoowrap: Snoowrap;
}

export const SnuiContext = createContext<SnuiContext>(defaultContext);
export const ModeContext = createContext<ModeContext>({previousMode: 'NORMAL', currentMode: 'NORMAL'});

export const Index = (props: MainPageProps) => {
    const [listing, setListing] = useState<Snoowrap.Listing<Snoowrap.Submission> | null>();
    const [fetching, setFetching] = useState(false);
    const [loading, setLoading] = useState(false);
    const [subreddit, setSubreddit] = useState<string>("");

    const [context, setContext] = useState<SnuiContext>(defaultContext);
    const [currentMode, setCurrentMode] = useState<ModeContext>({
        previousMode: 'NORMAL' as const,
        currentMode: 'NORMAL' as const,
    });

    const setMode = (mode: Mode) => {
        setCurrentMode(old => {
            return {
                currentMode: mode,
                previousMode: old.currentMode,
                _set: setMode,
            }
        })
    }

    useEffect(() => {
        setMode('NORMAL');
    }, [])

    useEffect(() => {
        setLoading(true);
        setFetching(true);

        props.snoowrap.getHot(subreddit, {limit: 25}).then((listing: Snoowrap.Listing<Snoowrap.Submission>) => {
            setLoading(false);
            setFetching(false);

            setListing(listing);
        })
    }, [subreddit])


    const fetchMore = () => {
        let fetching = true;
        setFetching(old => {
            fetching = old;
            return old;
        });

        let listing: Snoowrap.Listing<Snoowrap.Submission> | null | undefined;
        setListing(oldListing => {
            listing = oldListing;
            return oldListing;
        })

        if (listing && !fetching) {
            setFetching(true);
            setLoading(true);
            listing.fetchMore({amount: 20, append: true}).then((l: Snoowrap.Listing<Snoowrap.Submission>) => {
                setFetching(false);
                setLoading(false);
                setListing(l);
            });
        }
    }

    if (listing && listing.length > 0) {
        return (
            <SnuiContext.Provider value={context}>
                <ModeContext.Provider value={currentMode}>
                    <TopLoadingBar loading={loading} />
                    <MainPage
                        posts={listing.map((p, idx) => postToDomain(p, idx <= 10))}
                        subreddit={subreddit}
                        fetchMore={fetchMore}
                        setMode={setMode}
                        setSubreddit={setSubreddit}
                        setLoading={setLoading}
                    />
                </ModeContext.Provider>
            </SnuiContext.Provider>
        );
    } else if (listing && listing.length === 0) {
        return (
            <h1>Empty subreddit</h1>
        );
    }
    else {
        return (
            // TODO Show pretty view
            <Loading />
        );
    }
}

