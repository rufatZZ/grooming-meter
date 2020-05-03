import React from 'react';

import { ReactComponent as LoadingIcon } from 'assets/img/loading.svg';

interface IProps {
    isLoading: boolean;
}

export const WithLoading: React.FC<IProps> = ({ isLoading, children }) => {
    return <div style={{ width: '100%', textAlign: 'center' }}>{isLoading ? <LoadingIcon /> : children}</div>;
};
