import {ipcRenderer, contextBridge} from 'electron'
import {FetchTextResult, SnuiIpcAPI} from './ipc'

const api: SnuiIpcAPI = {
    fetchWebsiteAsText(url: string, callback: (event: Electron.IpcRendererEvent, result: FetchTextResult) => void) {
        const handler = (event, result: FetchTextResult) => {
            if (result.url === url) {
                callback(event, result);
            }

            ipcRenderer.removeListener(`fetch-text-ready-${url}`, handler);
        }

        ipcRenderer.on(`fetch-text-ready-${url}`, handler)
        ipcRenderer.send('fetch-url', url);
    },
    fetchImgurUrls(albumId: string, callback: (result: string[]) => void) {
        const handler = (event, result: string[]) => {
            console.log(result);
            callback(result);

            ipcRenderer.removeListener(`imgur-urls-ready`, handler);
        }

        ipcRenderer.on(`imgur-urls-ready`, handler)
        ipcRenderer.send('fetch-imgur-urls', albumId);
    }
}

contextBridge
    .exposeInMainWorld('ipcAPI', api)