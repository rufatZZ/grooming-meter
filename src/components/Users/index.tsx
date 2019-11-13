import React from "react";

import { IUser } from "./../../models";

interface IProps {
  users?: IUser[];
}

export const Users: React.FC<IProps> = props => {
  const { users } = props;

  return (
    <div className="users">
      <div className="panel">
        <span className="subtitle">Users {users && `{ ${users.length} }`}</span>
        <ul>
          {users &&
            users.map((user, index) => (
              <li key={user.id}>
                {index + 1}. {user.username}
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
};
