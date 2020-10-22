import React from 'react';
import classNames from 'classnames';

import { ReactComponent as LoadingIcon } from 'assets/img/loading.svg';

import './index.scss';

interface IProps {
    isLoading: boolean;
}

export const Loading: React.FC<IProps> = ({ isLoading, children }) => {
    const getClassNames = () => classNames('loading-overlay', { 'overlay-open': isLoading });

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
