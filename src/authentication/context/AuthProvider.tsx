import { useCallback, useEffect, useReducer, useRef } from "react";
import { AuthContext } from "./AuthContext";
import { authReducer } from "../reducers/authReducer";
import type { AuthState } from "../reducers/authReducersInterface";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged, sendPasswordResetEmail } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db, googleProvider} from "../../config/firebase";
import { signInWithPopup } from "firebase/auth";

const initialState: AuthState = {
  logged: false,
  user: null,
  errorMessage: null,
};

// Inactivity timeout configuration
// Default: 10 minutes. You can override via env or localStorage for testing.
// Order of precedence:
// 1. localStorage key 'FT_INACTIVITY_TIMEOUT_MS' (milliseconds)
// 2. Vite env var VITE_INACTIVITY_TIMEOUT_MS or CRA env REACT_APP_INACTIVITY_TIMEOUT_MS
// 3. default 30 minutes
const DEFAULT_INACTIVITY_TIMEOUT_MS = 10 * 60 * 1000;
const TEST_INACTIVITY_TIMEOUT_MS = 1 * 60 * 1000; // convenient constant for quick manual testing

const INACTIVITY_TIMEOUT_MS: number = (() => {
  try {
    const ls = (typeof window !== 'undefined' && window.localStorage.getItem('FT_INACTIVITY_TIMEOUT_MS')) || undefined;
    if (ls) return Number(ls);
  } catch (err) {
    // ignore
  }

  // support Vite and CRA env vars
  const envVal = typeof import.meta !== 'undefined' ? (import.meta.env?.VITE_INACTIVITY_TIMEOUT_MS as string | undefined) : process.env.REACT_APP_INACTIVITY_TIMEOUT_MS;
  if (envVal) {
    const n = Number(envVal);
    if (!Number.isNaN(n)) return n;
  }

  return DEFAULT_INACTIVITY_TIMEOUT_MS;
})();

// Enable debug logs when running in dev (Vite's import.meta.env.DEV) or NODE_ENV !== 'production'
const INACTIVITY_DEBUG = (typeof import.meta !== 'undefined' && Boolean((import.meta as any).env?.DEV)) || process.env.NODE_ENV !== 'production';

const loadAuthState = (): AuthState => {
  try {
    const savedState = localStorage.getItem("authState");
    if (savedState) {
      return JSON.parse(savedState);
    }
  } catch (error) {
    console.error("Error al cargar el estado de autenticación:", error);
  }
  return initialState;
};

export const AuthProvider = ({ children }: { children: any }) => {
  const [authState, dispatch] = useReducer(
    authReducer,
    initialState,
    loadAuthState
  );
  // use number | null to match browser setTimeout return type and keep TypeScript happy
  const inactivityTimerRef = useRef<number | null>(null);

  const clearInactivityTimer = useCallback(() => {
    if (inactivityTimerRef.current !== null) {
      if (INACTIVITY_DEBUG) console.debug('[Inactivity] clear timer id=', inactivityTimerRef.current);
      // window.clearTimeout expects a number in browsers
      window.clearTimeout(inactivityTimerRef.current);
      inactivityTimerRef.current = null;
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("authState", JSON.stringify(authState));
  }, [authState]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        const user = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
        };
        if (INACTIVITY_DEBUG) console.debug('[Inactivity] onAuthStateChanged: LOGIN', user?.uid);
        dispatch({ type: "LOGIN", payload: { user } });
      } else {
        if (INACTIVITY_DEBUG) console.debug('[Inactivity] onAuthStateChanged: LOGOUT');
        dispatch({ type: "LOGOUT" });
      }
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = {
        uid: userCredential.user.uid,
        email: userCredential.user.email,
      };
      dispatch({ type: "LOGIN", payload: { user } });
    } catch (error: any) {
      dispatch({ type: "ERROR", payload: { errorMessage: error.message } });
    }
  };

  const register = async (email: string, password: string) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        createdAt: serverTimestamp(),
      });

      await signOut(auth);
      dispatch({ type: "REGISTER" });
    } catch (error: any) {
      dispatch({ type: "ERROR", payload: { errorMessage: error.message } });
    }
  };

  const logout = useCallback(async () => {
    try {
      await signOut(auth);
      dispatch({ type: "LOGOUT" });
      localStorage.removeItem("authState");
    } catch (error: any) {
      dispatch({ type: "ERROR", payload: { errorMessage: error.message } });
    }
  }, []);

  useEffect(() => {
    if (!authState.logged) {
      clearInactivityTimer();
      return;
    }

    const activityEvents: Array<keyof WindowEventMap> = [
      "mousemove",
      "mousedown",
      "keydown",
      "scroll",
      "touchstart",
    ];

    const resetInactivityTimer = () => {
      clearInactivityTimer();
      // store numeric id returned by window.setTimeout
      inactivityTimerRef.current = window.setTimeout(() => {
        if (INACTIVITY_DEBUG) console.debug('[Inactivity] timer fired -> calling logout');
        // explicit void to ignore promise
        void logout();
      }, INACTIVITY_TIMEOUT_MS);
      if (INACTIVITY_DEBUG) console.debug('[Inactivity] set timer id=', inactivityTimerRef.current, 'timeoutMs=', INACTIVITY_TIMEOUT_MS);
    };

    activityEvents.forEach((eventName) => {
      window.addEventListener(eventName, resetInactivityTimer);
    });

    resetInactivityTimer();

    return () => {
      activityEvents.forEach((eventName) => {
        window.removeEventListener(eventName, resetInactivityTimer);
      });
      clearInactivityTimer();
    };
  }, [authState.logged, clearInactivityTimer, logout]);

  const singInWithGoogle = async (): Promise<void> => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error("Error al iniciar sesión con Google:", error);
      throw error;
    }
  };

  const resetPassword = async (email: string): Promise<void> => {
    try {
      await sendPasswordResetEmail(auth, email);
      dispatch({ type: "RESET_PASSWORD_SUCCESS" });
    } catch (error: any) {
      dispatch({ type: "ERROR", payload: { errorMessage: error.message } });
    }
  };

  const clearResetPasswordSuccess = () => {
    dispatch({ type: "CLEAR_RESET_PASSWORD_SUCCESS" });
  };

  return (
    <AuthContext.Provider value={{ authState, login, register, logout, singInWithGoogle, resetPassword, clearResetPasswordSuccess }}>
      {children}
    </AuthContext.Provider>
  );
};
