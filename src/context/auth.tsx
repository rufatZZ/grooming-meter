import { createContext, useContext } from 'react';

export const useAuthContext = () => useContext(AuthContext);

export const AuthContext = createContext({ username: '', isLoggedIn: false });