import { useReducer, useEffect, useCallback } from "react";
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  getDocs,
  Timestamp,
} from "firebase/firestore";
import { db } from "../../config/firebase";
import { useAuth } from "../../authentication/hooks/useAuth";
import { categoryReducer, initialState } from "../reducers/categoryReducers";

import type { Category } from "../reducers/categoryReducersInterface";

export const useCategory = () => {
  const [state, dispatch] = useReducer(categoryReducer, initialState);
  const { authState } = useAuth();

  // Cargar categorías del usuario
  const loadCategories = useCallback(async () => {
    if (!authState.user?.uid) return;

    try {
      const categoriesRef = collection(db, "categories");
      const q = query(categoriesRef, where("userId", "==", authState.user.uid));
      const querySnapshot = await getDocs(q);

      const loadedCategories: Category[] = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          name: data.name,
          type: data.type,
          userId: data.userId,
          createdAt: data.createdAt?.toDate(),
          updatedAt: data.updatedAt?.toDate(),
        };
      });

      dispatch({ type: "SET_CATEGORIES", payload: loadedCategories });
    } catch (err: any) {
      console.error("Error cargando categorías:", err);
    }
  }, [authState.user?.uid]);

  // Crear nueva categoría
  const createCategory = useCallback(
    async (name: string, type: "income" | "expense") => {
      if (!authState.user?.uid) {
        return;
      }

      try {
        const categoryData = {
          name,
          type,
          userId: authState.user.uid,
          createdAt: Timestamp.now(),
        };

        const docRef = await addDoc(collection(db, "categories"), categoryData);

        const newCategory: Category = {
          id: docRef.id,
          name,
          type,
          userId: authState.user.uid,
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        dispatch({ type: "ADD_CATEGORY", payload: newCategory });
      } catch (err: any) {
        console.error("Error creando categoría:", err);
        throw err;
      }
    },
    [authState.user?.uid]
  );

  // Actualizar categoría existente
  const updateCategory = useCallback(
    async (id: string, name: string, type: "income" | "expense") => {
      try {
        const categoryRef = doc(db, "categories", id);
        const updateData: any = {
          name,
          type,
          updatedAt: Timestamp.now(),
        };

        await updateDoc(categoryRef, updateData);

        dispatch({
          type: "UPDATE_CATEGORY",
          payload: {
            id,
            data: {
              name,
              type,
              updatedAt: new Date(),
            },
          },
        });
      } catch (err: any) {
        console.error("Error actualizando categoría:", err);
        throw err;
      }
    },
    []
  );

  // Eliminar categoría
  const deleteCategory = useCallback(async (id: string) => {
    try {
      await deleteDoc(doc(db, "categories", id));
      dispatch({ type: "DELETE_CATEGORY", payload: id });
    } catch (err: any) {
      console.error("Error eliminando categoría:", err);
      throw err;
    }
  }, []);

  // Reset del estado
  const resetCategories = useCallback(() => {
    dispatch({ type: "RESET" });
  }, []);

  // Cargar categorías al montar o cuando cambie el usuario
  useEffect(() => {
    if (authState.user?.uid) {
      loadCategories();
    } else {
      resetCategories();
    }
  }, [authState.user?.uid, loadCategories, resetCategories]);

  return {
    categories: state.categories,
    createCategory,
    updateCategory,
    deleteCategory,
  };
};
