import clsx from 'clsx';
import React, { useEffect, useState } from 'react';

import { Loading } from 'shared/components/Loading';
import { IUser } from 'shared/models';
import { isEmpty } from 'shared/utils/object';

interface IProps {
    users: IUser[];
    currentUser?: string;
    loading: boolean;
}

export const Users: React.FC<IProps> = props => {
    const { users, currentUser = null, loading } = props;
    const [isVisible, toggleVisibility] = useState(false);
    const [isMobile, toggleMobile] = useState(window.innerWidth <= 767);

    useEffect(() => {
        window.addEventListener('resize', () => toggleMobile(window.innerWidth <= 767));
    }, []);

    return (
        <div className="users">
            <Loading isLoading={loading}>
                <div className="panel">
                    {!isMobile ? (
                        <div className="panel px-3x py-2x">
                            <span className="subtitle">Users {users && `( ${users.length} )`}</span>
                        </div>
                    ) : (
                        <div
                            className="panel px-3x py-2x d-flex flex-justify-space-between flex-align-center panel-clickable"
                            onClick={() => toggleVisibility(!isVisible)}
                        >
                            <span className="subtitle">Users {users && `( ${users.length} )`}</span>
                            <span>{!isVisible ? 'Show' : 'Hide'}</span>
                        </div>
                    )}

                    {(!isMobile || (isMobile && isVisible)) && (
                        <div className="panel px-3x pb-2x">
                            <ol className="users-list text-left">
                                {!isEmpty(users) &&
                                    users.map(user => (
                                        <li
                                            key={user._id}
                                            className={clsx({
                                                'voted-user': user.isVoted,
                                                'bg-success': user.isVoted && user.isValidVote,
                                                'bg-warning': user.isVoted && !user.isValidVote,
                                            })}
                                        >
                                            <span
                                                className={clsx({
                                                    'font-bold': user.username === currentUser,
                                                })}
                                            >
                                                {user.username} {user.isVoted && !user.isValidVote && `\u2014 ?`}
                                            </span>
                                        </li>
                                    ))}
                            </ol>
                        </div>
                    )}
                </div>
            </Loading>
        </div>
    );
};
