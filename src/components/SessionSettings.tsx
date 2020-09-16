import React, { SyntheticEvent } from 'react';

import { ISession } from 'shared/models';

interface IProps {
    sessionInfo: ISession;
}

export const SessionSettings: React.FC<IProps> = props => {
    const { sessionInfo } = props;
    const { _id: sessionId = '---' } = sessionInfo || ({} as ISession);

    console.log(sessionInfo);

    const handleSelect = (e: SyntheticEvent<HTMLInputElement>) => {
        const currentTarget = e.currentTarget;
        currentTarget.setSelectionRange(0, currentTarget.value.length);
    };

    const handleCopy = async () => {
        await navigator.clipboard.writeText(sessionId);
    };

    return (
        <div className="session--settings">
            <div className="panel mt-1">
                <span className="subtitle"> Session </span>

                <div className="copy-options mt-1">
                    <input className="copy-options-input" type="text" readOnly value={sessionId} onClick={handleSelect} />
                    <div className="copy-options-button" onClick={handleCopy}>
                        Copy
                    </div>
                </div>
            </div>
        </div>
    );
};
