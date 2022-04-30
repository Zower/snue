import * as React from 'react';
import ReactDOM from 'react-dom';
import {Video} from '~/common/post';
import {useKeyPress} from '~/common/utils';
import {SnuiContext} from '~/views/main';
import './media.less';

export interface VideoPlayerProps {
    video: Video;
}

export const VideoPlayer = (props: VideoPlayerProps) => {
    const vidRef = React.useRef<HTMLVideoElement>(null);
    const theme = React.useContext(SnuiContext).theme;

    const togglePlay = (e: KeyboardEvent) => {
        if (vidRef.current) {
            vidRef.current.paused ? vidRef.current.play() : vidRef.current.pause()
        }
    }

    const rewind = () => {
        if (vidRef.current) {
            vidRef.current.currentTime < 5.011 ? vidRef.current.currentTime = 0 : vidRef.current.currentTime -= 5;
        }
    }

    const forward = () => {
        if (vidRef.current) {
            vidRef.current.currentTime > vidRef.current.duration - 5.011 ? vidRef.current.currentTime = vidRef.current.duration : vidRef.current.currentTime += 5;
        }
    }

    const volumeUp = () => {
        if (vidRef.current) {
            vidRef.current.volume > 0.899 ? vidRef.current.volume = 1 : vidRef.current.volume += 0.1;
        }
    }

    const volumeDown = () => {
        if (vidRef.current) {
            vidRef.current.volume < 0.011 ? vidRef.current.volume = 0 : vidRef.current.volume -= 0.1;
        }
    }

    useKeyPress(togglePlay, 'playPause');

    useKeyPress(rewind, 'left');
    useKeyPress(forward, 'right');

    useKeyPress(volumeDown, 'volumeDown');
    useKeyPress(volumeUp, 'volumeUp');

    const video = props.video;
    return (
        <div className='content-container' style={{backgroundColor: theme.content_background}}>
            <video className='video' ref={(vidRef != undefined) ? vidRef : null} controls autoPlay loop src={video.url} />
        </div>
    )
}