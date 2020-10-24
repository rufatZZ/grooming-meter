import { createContext, useContext } from 'react';

import { IUser } from 'shared/models';

export const useAuthContext = () => useContext(AuthContext);

export const AuthContext = createContext({ user: {} as IUser | null, isLoggedIn: false });
