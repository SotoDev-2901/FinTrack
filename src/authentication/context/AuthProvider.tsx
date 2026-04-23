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

const INACTIVITY_TIMEOUT_MS = 30 * 60 * 1000;

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
  const inactivityTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearInactivityTimer = useCallback(() => {
    if (inactivityTimerRef.current) {
      clearTimeout(inactivityTimerRef.current);
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
        dispatch({ type: "LOGIN", payload: { user } });
      } else {
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
      inactivityTimerRef.current = setTimeout(() => {
        void logout();
      }, INACTIVITY_TIMEOUT_MS);
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
