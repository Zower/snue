import * as React from 'react';
import {SnuiContext} from '~/views/main';
import './media.less';

export interface EmbeddedYoutubeProps {
    id: string;
}

export const EmbeddedYoutube = (props: EmbeddedYoutubeProps) => {
    return <iframe className="main-content-webpage" src={`https://www.youtube.com/embed/${props.id}?autoplay=1`} />;
}