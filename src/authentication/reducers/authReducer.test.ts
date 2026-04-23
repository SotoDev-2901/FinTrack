import { describe, expect, it } from 'vitest';
import { authReducer } from './authReducer';
import type { AuthState } from './authReducersInterface';

const initialState: AuthState = {
  logged: false,
  user: null,
  errorMessage: null,
  registerSuccess: false,
  resetPasswordSuccess: false,
};

describe('authReducer', () => {
  it('maneja login, logout y errores', () => {
    const user = { uid: 'u1', email: 'user@example.com' };

    expect(authReducer(initialState, { type: 'LOGIN', payload: { user } })).toEqual({
      ...initialState,
      logged: true,
      user,
      errorMessage: null,
    });

    expect(authReducer({ ...initialState, logged: true, user }, { type: 'LOGOUT' })).toEqual({
      ...initialState,
      logged: false,
      user: null,
      errorMessage: null,
    });

    expect(authReducer(initialState, { type: 'ERROR', payload: { errorMessage: 'fail' } })).toEqual({
      ...initialState,
      logged: false,
      errorMessage: 'fail',
    });
  });

  it('maneja estados de registro y recuperación de contraseña', () => {
    expect(authReducer(initialState, { type: 'REGISTER' })).toEqual({
      ...initialState,
      logged: false,
      user: null,
      errorMessage: null,
      registerSuccess: true,
    });

    expect(authReducer({ ...initialState, registerSuccess: true }, { type: 'CLEAR_REGISTER_SUCCESS' }))
      .toEqual({ ...initialState, registerSuccess: false });

    expect(authReducer(initialState, { type: 'RESET_PASSWORD_SUCCESS' })).toEqual({
      ...initialState,
      errorMessage: null,
      resetPasswordSuccess: true,
    });

    expect(authReducer({ ...initialState, resetPasswordSuccess: true }, { type: 'CLEAR_RESET_PASSWORD_SUCCESS' }))
      .toEqual({ ...initialState, resetPasswordSuccess: false });
  });
});