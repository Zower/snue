import {Mode} from "./views/main/MainPage";

interface OnExitModeDetails {
    previousMode: Mode;
    newMode: Mode;
}

interface CustomEventMap {
    "onExitMode": CustomEvent<OnExitModeDetails>;
    "onSubmitButton": CustomEvent;
}

declare global {
    interface Document {
        addEventListener<K extends keyof CustomEventMap>(type: K,
            listener: (this: Document, ev: CustomEventMap[K]) => void): void;
    }
}

export { };