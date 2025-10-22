export interface Category {
  id: string;
  name: string;
  type: "income" | "expense";
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CategoryState {
  categories: Category[];
}

export type CategoryAction =
  | { type: "SET_CATEGORIES"; payload: Category[] }
  | { type: "ADD_CATEGORY"; payload: Category }
  | {
      type: "UPDATE_CATEGORY";
      payload: { id: string; data: Partial<Category> };
    }
  | { type: "DELETE_CATEGORY"; payload: string }
  | { type: "RESET" };
