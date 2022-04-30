import * as React from 'react';
import {FiltersUI} from "~/views/post-list/components/FiltersUI";
import {Filters} from '~/views/post-list/filters';
import {Mode} from '..';
import {KeybindMenu} from './KeybindMenu';
import {PickSubreddit} from "./PickSubreddit";

export interface GlobalUIProps {
    setSubreddit: (subreddit: string) => void;
    setFilters: (filters: Filters) => void;
    setMode: (mode: Mode) => void;
}

export const GlobalUI = (props: GlobalUIProps) => {
    const setInsertMode = () => {
        props.setMode('INSERT')
    }

    return (
        <>
            <PickSubreddit onSubmit={props.setSubreddit} setInsertMode={setInsertMode} />
            <FiltersUI setFilters={props.setFilters} />
            <KeybindMenu />
        </>
    );
}