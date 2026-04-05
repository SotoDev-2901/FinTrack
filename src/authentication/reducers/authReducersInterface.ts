export interface User {
  uid: string;
  email: string | null;
}

export interface AuthState {
  logged: boolean;
  user: User | null;
  errorMessage: string | null;
  registerSuccess?: boolean;
  resetPasswordSuccess?: boolean;
}

export type AuthAction =
  | { type: 'LOGIN'; payload: { user: User } }
  | { type: 'LOGOUT' }
  | { type: 'REGISTER'; }
  | { type: 'ERROR'; payload: { errorMessage: string } }
  | { type: "CLEAR_REGISTER_SUCCESS" }
  | { type: "RESET_PASSWORD_SUCCESS" }
  | { type: "CLEAR_RESET_PASSWORD_SUCCESS" };
  