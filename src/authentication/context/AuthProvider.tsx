import { useReducer, useEffect } from "react";
import { AuthContext } from "./AuthContext";
import { authReducer } from "../reducers/authReducer";
import type { AuthState } from "../reducers/authReducersInterface";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db} from "../../config/firebase";

const initialState: AuthState = {
  logged: false,
  user: null,
  errorMessage: null,
};

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

  const logout = async () => {
    try {
      await signOut(auth);
      dispatch({ type: "LOGOUT" });
      localStorage.removeItem("authState");
    } catch (error: any) {
      dispatch({ type: "ERROR", payload: { errorMessage: error.message } });
    }
  };

  return (
    <AuthContext.Provider value={{ authState, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
