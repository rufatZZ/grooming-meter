import React from 'react';

import { ReactComponent as LoadingIcon } from 'assets/img/loading.svg';
import classNames from 'classnames';

interface IProps {
    isLoading: boolean;
}

export const WithLoading: React.FC<IProps> = ({ isLoading, children }) => {
    return (
        <div className="loading">
            <div className={`loading-overlay ${classNames({ 'overlay-open': isLoading })}`}>
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
