import { ipcRenderer, contextBridge } from 'electron'
import { FetchTextResult, SnuiIpcAPI } from './ipc'

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
}

contextBridge
    .exposeInMainWorld('ipcAPI', api)