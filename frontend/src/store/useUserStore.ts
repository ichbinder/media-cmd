import { create } from 'zustand';
import { persist } from 'zustand/middleware'
import { isUserTokenValid, userLogin, userLogout } from '../services/backendApiRequests';
    
type User = {
  username: string;
  role: string;
  token: string;
};

type UserStoreProps = {
  loggedIn: boolean;
  user: User | null;
  logIn: (user: User) => void;
  logOut: () => Promise<void>;
  removeUser: () => void;
  loginUser: (username: string, password: string) => Promise<void>;
  checkToken: () => Promise<boolean>;
};

const useUserStore = create<UserStoreProps>()(
    persist((set) => ({
        loggedIn: false,
        user: null,
        removeUser: () => set(() => ({ user: null, loggedIn: false })),
        logIn: (user) => set(() => ({ loggedIn: true, user })),
        logOut: () => logOutAction(set),
        loginUser: (username, password) => logInAction(set, username, password),
        checkToken: () => checkTokenAction(set),
    }), { name: 'user-storage'})
);

const logOutAction = async (set: any) => {
    try {
        await userLogout();

        set(() => ({ loggedIn: false, user: null }));
    } catch (error) {
        console.error('Logout error: ', error);
    }
};

const logInAction = async (set: any, username: string, password: string) => {
    try {
        const response = await userLogin(username, password);
        
        const user: User = {
            username: response.data.username,
            role: response.data.role,
            token: response.data.token,
        };

        set(() => ({ loggedIn: true, user }));
    } catch (error) {
        console.error('Login error: ', error);
    }
};

const checkTokenAction = async (set: any) => {
    try {
        const response = await isUserTokenValid();

        if (!response.data.valid) {
          console.error("Token is invalid.");
          set({ user: { token: "" }, loggedIn: false });
        }
        return response.data.valid;
    } catch (error) {
        console.error("There was an error validating the token:", error);
        set({ user: { token: "" }, loggedIn: false });
        return false;
    }
};


export {
    UserStoreProps as Store,
    useUserStore as useUserStore,
};
