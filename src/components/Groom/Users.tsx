import classnames from 'classnames';
import isEmpty from 'lodash/isEmpty';
import React from 'react';

import { Loading } from 'shared/components/Loading';
import { IUser } from 'shared/models';

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
                                <li key={user._id} className={classnames({ 'user-list-item-voted': user.isVoted })}>
                                    <span
                                        className={classnames({
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
