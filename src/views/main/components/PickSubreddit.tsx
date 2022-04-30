import * as React from 'react';
import {Popup} from '~/common/components/Popup';
import {useInsertMode, useKeyPress} from '~/common/utils';
import {ModeContext, SnuiContext} from '..';
import './pick-subreddit.less';

export interface PickSubredditProps {
    onSubmit: (subreddit: string) => void;
    setInsertMode: () => void;
}

export const PickSubreddit = (props: PickSubredditProps) => {
    const [subreddit, setSubreddit] = React.useState("");
    const [show, setShow] = React.useState(false);
    const mode = React.useContext(ModeContext);

    const submit = () => {
        let sub = '';
        setSubreddit(old => {
            sub = old;
            return '';
        });
        setShow(false);
        props.onSubmit(sub);
    }


    const onExit = () => setShow(false);
    const onSubmit = () => submit();
    const onOpen = () => setShow(true);

    useInsertMode(onSubmit, onExit, onOpen, 'openSubreddit')

    return (
        <Popup show={show && mode.currentMode === 'INSERT'} >
            <input className='pick-subreddit-input' type="text" autoFocus value={subreddit} onChange={(e) => setSubreddit(e.target.value)} />
        </Popup>
    );
}

