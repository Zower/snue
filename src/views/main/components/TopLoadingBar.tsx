import * as React from 'react';
import './loading.less';

interface TopLoadingBarProps {
    loading: boolean;
}

export const TopLoadingBar = (props: TopLoadingBarProps) => {
    if (props.loading) {
        return <div className='loading-bar' />;
    } else {
        return null;
    }
}