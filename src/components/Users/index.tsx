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
            <WithLoading isLoading={loading}>
                <div className="panel mt-1">
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
            </WithLoading>
        </div>
    );
};
