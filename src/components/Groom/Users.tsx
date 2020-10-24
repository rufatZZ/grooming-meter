import clsx from 'clsx';
import React from 'react';

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

    return (
        <div className="users">
            <Loading isLoading={loading}>
                <div className="panel">
                    <span className="subtitle">Users {users && `( ${users.length} )`}</span>
                    <ol className="users-list text-left">
                        {!isEmpty(users) &&
                            users.map(user => (
                                <li key={user._id} className={clsx({ 'user-list-item-voted': user.isVoted })}>
                                    <span
                                        className={clsx({
                                            'font-bold': user.username === currentUser,
                                        })}
                                    >
                                        {user.username}
                                    </span>
                                </li>
                            ))}
                    </ol>
                </div>
            </Loading>
        </div>
    );
};
