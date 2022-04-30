import React from 'react';
import './horizontal.less';

export interface HorizontalProps {
    children: React.ReactNode;
}

export const Horizontal = (props: HorizontalProps) => {
    return (
        <div className='horizontal'>
            {props.children}
        </div>
    )
}