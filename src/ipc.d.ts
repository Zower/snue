export interface FetchTextSuccess {
    type: "Success";
    text: string;
    url: string;
}

export interface FetchTextFailure {
    type: "Error",
    error: any;
    url: string;
}

export type FetchTextResult = FetchTextSuccess | FetchTextFailure;

export interface SnuiIpcAPI {
    fetchWebsiteAsText: (url: string, c: (event: Electron.IpcRendererEvent, result: FetchTextResult) => void) => void;
    fetchImgurUrls: (albumId: string, c: (result: string[]) => void) => void;
}

declare global {
    interface Window {
        ipcAPI: SnuiIpcAPI
    }
}