import React, { SyntheticEvent } from 'react';

import { ISession } from 'shared/models';

interface IProps {
    sessionInfo: ISession;
}

export const SessionSettings: React.FC<IProps> = props => {
    // const { sessionInfo } = props;
    // const { _id: sessionId = '---' } = sessionInfo || ({} as ISession);
    const location = window.location;

    const handleSelect = (e: SyntheticEvent<HTMLInputElement>) => {
        const currentTarget = e.currentTarget;
        currentTarget.setSelectionRange(0, currentTarget.value.length);
    };

    const handleCopy = async () => {
        navigator.clipboard && (await navigator.clipboard.writeText(location.href || ''));
    };

    return (
        <div className="session--settings">
            <div className="panel">
                <span className="subtitle"> Session </span>

                <div className="copy-options mt-1">
                    <input className="copy-options-input" type="text" readOnly value={location.pathname.replace('/', '')} onClick={handleSelect} />
                    <div className="copy-options-button" onClick={handleCopy}>
                        Copy
                    </div>
                </div>
            </div>
        </div>
    );
};
