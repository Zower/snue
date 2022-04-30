import {useContext} from "react"
import Snoowrap from "snoowrap";
import {useKeyPress} from "~/common/utils";
import {Mode, ModeContext, SnuiContext} from "..";

export interface GlobalKeybindsProps {
    setMode: (mode: Mode) => void;
}

export const GlobalKeybinds = (props: GlobalKeybindsProps) => {
    const mode = useContext(ModeContext);

    const onExitMode = () => {
        const event = new CustomEvent('onExitMode', {detail: {previousMode: mode, newMode: mode.previousMode}});
        props.setMode(mode.previousMode);
        document.dispatchEvent(event);
    }

    const onSubmit = () => {
        const event = new CustomEvent('onSubmitButton');
        onExitMode();
        document.dispatchEvent(event);
    }

    const auth = () => {
        const authUrl = Snoowrap.getAuthUrl({
            scope: ["*"],
            clientId: 'cy9JcdDLbKkOhtKtgU5yDw',
            permanent: true,
            redirectUri: 'http://snuiredirect.com/'
        });

        window.location.href = authUrl;
    }

    useKeyPress(auth, 'login');
    useKeyPress(() => props.setMode('COMMENTS'), 'commentMode');
    useKeyPress(() => props.setMode('NORMAL'), 'normalMode');
    useKeyPress(onExitMode, 'exitMode', {isInsertAction: true});
    useKeyPress(onSubmit, 'submit', {isInsertAction: true});

    return null;
}