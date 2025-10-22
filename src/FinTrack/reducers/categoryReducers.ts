import type { CategoryState, CategoryAction } from "./categoryReducersInterface";

export const initialState: CategoryState = {
  categories: [],
};

export const categoryReducer = (
  state: CategoryState,
  action: CategoryAction
): CategoryState => {
  switch (action.type) {
    case "SET_CATEGORIES":
      return {
        ...state,
        categories: action.payload,
      };

    case "ADD_CATEGORY":
      return {
        ...state,
        categories: [...state.categories, action.payload],
      };

    case "UPDATE_CATEGORY":
      return {
        ...state,
        categories: state.categories.map((cat) =>
          cat.id === action.payload.id
            ? { ...cat, ...action.payload.data }
            : cat
        ),
      };

    case "DELETE_CATEGORY":
      return {
        ...state,
        categories: state.categories.filter((cat) => cat.id !== action.payload),
      };

    case "RESET":
      return initialState;

    default:
      return state;
  }
};
