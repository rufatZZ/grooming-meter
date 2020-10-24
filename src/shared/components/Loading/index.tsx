import clsx from 'clsx';
import React from 'react';

import { ReactComponent as LoadingIcon } from 'assets/img/loading.svg';

import './index.scss';

interface IProps {
    isLoading?: boolean;
}

export const Loading: React.FC<IProps> = ({ isLoading = true, children }) => {
    const getClassNames = () => clsx('loading-overlay', { 'overlay-open': isLoading });

    return (
        <div className="loading">
            <div className={getClassNames()}>
                <div className="indicator-wrapper">
                    <div className="loading-indicator">
                        <LoadingIcon />
                    </div>
                </div>
            </div>
            {children}
        </div>
    );
};
