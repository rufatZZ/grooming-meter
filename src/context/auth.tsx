import { createContext, useContext } from 'react';

import { IUser } from 'models';

export const useAuthContext = () => useContext(AuthContext);

export const AuthContext = createContext({ user: {} as IUser, isLoggedIn: false });