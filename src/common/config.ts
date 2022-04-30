import {KeyPress} from './utils';

export class ConfigStore {
    defaults: Config;

    constructor(defaults: Config) {
        this.defaults = defaults;
    }

    get = <KeyType extends keyof Config>(key: KeyType): Config[KeyType] => {
        const value = window.localStorage.getItem(this.getFullKey(key.toString()));
        return value ? JSON.parse(value) : this.defaults[key];
    }

    getKeybind = (action: keyof ActionMap): string | KeyPress => {
        return this.get('keybinds')[action] ?? this.defaults.keybinds[action];
    }

    setKeybind = (action: keyof ActionMap, kp: KeyPress) => {
        const x = this.get('keybinds');
        x[action] = kp;
        this.set('keybinds', x);
    }

    set = <KeyType extends keyof Config>(key: KeyType, value: Config[KeyType]) => {
        window.localStorage.setItem(this.getFullKey(key.toString()), JSON.stringify(value))
    }

    // Borrows value. Make changes and it will be saved after.
    getMut = <KeyType extends keyof Config>(key: KeyType, callback: (value: Config[KeyType]) => void) => {
        const value = this.get(key);
        callback(value);
        this.set(key, value);
    }

    getFullKey = (key: string) => {
        return `${this.defaults.name}.${key}`;
    }
}

export interface ActionMap {
    down: KeyPress | string;
    up: KeyPress | string;
    altUp: KeyPress | string;
    altDown: KeyPress | string;
    normalMode: KeyPress | string;
    commentMode: KeyPress | string;
    playPause: KeyPress | string;
    left: KeyPress | string;
    right: KeyPress | string;
    volumeUp: KeyPress | string;
    volumeDown: KeyPress | string;
    copy: KeyPress | string;
    exitMode: KeyPress | string;
    submit: KeyPress | string;

    //Globals
    login: KeyPress | string;
    openSubreddit: KeyPress | string;
    openFilters: KeyPress | string;
    openKeybinds: KeyPress | string;
    toggleSidebarState: KeyPress | string;
    toggleCommentState: KeyPress | string;
}


export interface Config {
    keybinds: ActionMap;
    name: 'CONFIG';
}

const defaults: Config = {
    name: 'CONFIG',
    keybinds: {
        down: 'j',
        up: 'k',
        altDown: {targetKey: 'j', modifiers: ['SHIFT']},
        altUp: {targetKey: 'k', modifiers: ['SHIFT']},
        normalMode: 'n',
        commentMode: 'c',
        playPause: ' ',
        left: 'h',
        right: 'l',
        volumeUp: 'i',
        volumeDown: 'u',
        copy: {targetKey: 'c', modifiers: ['CTRL']},
        exitMode: 'escape',
        submit: 'enter',
        login: {targetKey: 'l', modifiers: ['CTRL', 'SHIFT']},
        openSubreddit: 'r',
        openFilters: 'f',
        openKeybinds: 's',
        toggleSidebarState: {targetKey: 's', modifiers: ['CTRL', 'SHIFT']},
        toggleCommentState: {targetKey: 'o', modifiers: ['CTRL', 'SHIFT']}
    }
}

export const config = new ConfigStore(defaults);
