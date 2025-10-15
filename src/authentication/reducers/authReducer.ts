import type { AuthState, AuthAction } from "./authReducersInterface";

export const authReducer = (
  state: AuthState,
  action: AuthAction
): AuthState => {
  switch (action.type) {
    case "LOGIN":
      return {
        ...state,
        logged: true,
        user: action.payload.user,
        errorMessage: null,
      };

    case "LOGOUT":
      return {
        ...state,
        logged: false,
        user: null,
        errorMessage: null,
      };

    case "REGISTER":
      return {
        ...state,
        logged: false,
        user: null,
        errorMessage: null,
        registerSuccess: true,
      };

    case "CLEAR_REGISTER_SUCCESS":
      return {
        ...state,
        registerSuccess: false,
      };

    case "ERROR":
      return {
        ...state,
        logged: false,
        errorMessage: action.payload.errorMessage,
      };

    default:
      return state; 
  }
};
