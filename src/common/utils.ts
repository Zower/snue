import * as React from 'react';
import {useContext} from 'react';
import {Mode, ModeContext, SnuiContext} from '~/views/main';
import {ValidModeContext} from '~/views/vaildMode';
import {ActionMap} from './config';

export type Mods = 'SHIFT' | "CTRL" | "ALT";

export interface KeyPress {
    targetKey: string;
    modifiers?: Mods[];
};

export const keyPressToPretty = (kp: KeyPress) => {
    return `${kp.modifiers?.join(' + ')} ${kp.targetKey}`;
}

interface Options {
    // Is active even if program is in insert mode.
    isInsertAction?: boolean;
    overrideValidMode?: Mode;
    overrideCurrentMode?: Mode;
}


export const useKeyPress = (callback: (keyboardEvent: KeyboardEvent) => void, action: keyof ActionMap, options: Options = {}) => {
    const context = React.useContext(SnuiContext);
    const validMode = options.overrideValidMode ?? useContext(ValidModeContext).mode;
    const currentModeContext = useContext(ModeContext).currentMode;
    const currentMode = options.overrideCurrentMode ?? currentModeContext;

    const downHandler = (e: KeyboardEvent) => {
        if ((currentMode !== validMode && validMode !== 'GLOBAL') || (currentMode === 'INSERT' && !options.isInsertAction)) {
            return;
        }

        const keybind = context.config.getKeybind(action);
        const key = typeof keybind === "string" ? keybind : keybind.targetKey;
        const modifiers = typeof keybind === "string" ? undefined : keybind.modifiers;

        if (e.key.toLowerCase() === key.toLowerCase()) {
            let pressed = true;

            // Make sure no modifiers are pressed that shouldn't be
            if (e.shiftKey && !modifiers?.includes("SHIFT")) {pressed = false;}
            if (e.ctrlKey && !modifiers?.includes("CTRL")) {pressed = false;}
            if (e.altKey && !modifiers?.includes("ALT")) {pressed = false;}

            // Make sure all modifiers that should be pressed are.
            if (modifiers) {
                modifiers.forEach(mod => {
                    switch (mod) {
                        case 'SHIFT': {
                            if (!e.shiftKey) {
                                pressed = false;
                            }
                            break;
                        }
                        case 'CTRL': {
                            if (!e.ctrlKey) {
                                pressed = false;
                            }
                            break;
                        }
                        case 'ALT': {
                            if (!e.altKey) {
                                pressed = false;
                            }
                            break;
                        }
                    }
                })
            }

            if (pressed) {
                if (e.target == document.body) {
                    e.preventDefault();
                }

                callback(e);
            }
        }

        return null;
    }

    React.useEffect(() => {
        window.addEventListener("keydown", downHandler);

        return () => {
            window.removeEventListener("keydown", downHandler);
        };
    });
};

export function getPrefetchWindow<Content>(array: Content[], length: number, currentIndex: number): Content[] {
    if (array.length === 0) {
        return array.slice(0, 0);
    }

    const startIndex = Math.max(0, currentIndex - Math.floor(length / 2));
    const endIndex = Math.min(array.length - 1, currentIndex + Math.floor(length / 2));

    return array.slice(startIndex, endIndex + 1);
}

export const useWindowDimensions = () => {
    const [windowDimensions, setWindowDimensions] = React.useState(getWindowDimensions());

    React.useEffect(() => {
        const handleResize = () => {
            setWindowDimensions(getWindowDimensions());
        }

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return windowDimensions;
}

const getWindowDimensions = () => {
    const {innerWidth: width, innerHeight: height} = window;
    return {
        width,
        height
    };
}

export interface InsertModeComponentProps {
    children: React.ReactNode;
}

export const useInsertMode = (onSubmit: () => void, onExit: () => void, onOpen: () => void, action: keyof ActionMap) => {
    const context = React.useContext(ModeContext);
    const onOpenInner = () => {
        context._set ? context._set('INSERT') : undefined;
        onOpen();
    }

    useKeyPress(onOpenInner, action);

    React.useEffect(() => {
        document.addEventListener('onExitMode', onExit);
        document.addEventListener('onSubmitButton', onSubmit);

        return () => {
            document.removeEventListener('onExitMode', onExit);
            document.removeEventListener('onSubmitButton', onSubmit);
        }
    }, [])

    return null;
}