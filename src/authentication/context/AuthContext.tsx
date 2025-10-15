import { createContext } from "react";
import type { AuthState } from "../reducers/authReducersInterface";

interface AuthContextState {
  authState: AuthState;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext({} as AuthContextState);