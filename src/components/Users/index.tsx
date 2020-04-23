import React from 'react';
import classnames from 'classnames';

import { IUser } from 'models';

interface IProps {
    users?: IUser[];
    currentUser?: string;
}

export const Users: React.FC<IProps> = props => {
    const { users, currentUser } = props;

    return (
        <div className="users">
            <div className="panel">
                <span className="subtitle">Users {users && `{ ${users.length} }`}</span>
                <ol className="users-list">
                    {users &&
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
        </div>
    );
};
