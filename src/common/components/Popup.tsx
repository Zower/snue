import * as React from 'react';
import {useKeyPress} from '../utils';
import './popup.less';

export interface PopupProps {
    children: React.ReactNode;
    show: boolean;
}

export const Popup = (props: PopupProps) => {
    if (!props.show) {
        return null;
    }

    return (
        <>
            <div className="popup-box" />
            <div className="box">
                <div style={{padding: "50px"}}>
                    {props.children}
                </div>
            </div>
        </>
    );
};