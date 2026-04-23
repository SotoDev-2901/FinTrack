import { createContext } from "react";
import type { AuthState } from "../reducers/authReducersInterface";

interface AuthContextState {
  authState: AuthState;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  singInWithGoogle: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  clearResetPasswordSuccess: () => void;
}

export const AuthContext = createContext({} as AuthContextState);