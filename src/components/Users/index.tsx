import React from 'react';
import classnames from 'classnames';
import isEmpty from 'lodash/isEmpty';

import { IUser } from 'shared/models';
import { WithLoading } from 'shared/components/WithLoading';

interface IProps {
    users: IUser[];
    currentUser?: string;
    loading: boolean;
}

export const Users: React.FC<IProps> = props => {
    const { users, currentUser = null, loading } = props;

    return (
        <div className="users">
            <div className="panel">
                <span className="subtitle">Users {users && `{ ${users.length} }`}</span>
                <WithLoading isLoading={loading}>
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
                </WithLoading>
            </div>
        </div>
    );
};
