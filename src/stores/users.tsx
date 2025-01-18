import { create } from "zustand";

interface UsersStoreState {
  filters: {
    page: number;
    limit: number;
  };
}

interface UsersStoreActions {
  actions: {
    setPage: (page: number) => void;
    setLimit: (limit: number) => void;
    reset: () => void;
  };
}

type UsersStore = UsersStoreState & UsersStoreActions;

export const initialState: UsersStoreState = {
  filters: {
    page: 1,
    limit: 10,
  },
};

export const useUsersStore = create<UsersStore>()((set, get) => ({
  ...initialState,
  actions: {
    setPage: (page: number) =>
      set((state) => ({
        filters: { ...state.filters, page },
      })),
    setLimit: (limit: number) =>
      set((state) => ({
        filters: { ...state.filters, limit },
      })),
    reset: () => set(initialState),
  },
}));

export const useUsersStoreActions = () =>
  useUsersStore((state) => state.actions);

export const useUserStoreFilters = () =>
  useUsersStore((state) => state.filters);
