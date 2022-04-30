import {createContext, useState} from "react";
import * as React from 'react';
import {Mode} from "./main";

export interface ValidModeContext {
    mode: Mode;
}

export interface VimModeProviderProps {
    validMode: Mode;
    children: React.ReactNode;
}

export const ValidModeContext = createContext<ValidModeContext>({mode: 'NORMAL'});

export const VimModeProvider = (props: VimModeProviderProps) => {
    const [mode, _] = useState({mode: props.validMode});

    return (
        <ValidModeContext.Provider value={mode} >
            {props.children}
        </ValidModeContext.Provider>
    )
};
