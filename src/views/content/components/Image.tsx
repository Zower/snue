import * as React from 'react';
import {SnuiContext} from '~/views/main';
import './media.less';

export interface ImageProps {
    src: string;
}

export const CImage = (props: ImageProps) => {
    const theme = React.useContext(SnuiContext).theme;

    return (
        <div className='content-container' style={{backgroundColor: theme.content_background}}>
            <img className='image' src={props.src} />
        </div>
    )
}