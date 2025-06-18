import { create } from "zustand";
import { persist } from "zustand/middleware";

interface User {
  name: string;
  email: string;
  image?: string;
}

interface UserState {
  user: User | null;
  users: User[];
  setUser: (user: User) => void;
  clearUser: () => void;
  setUsers: (users: User[]) => void;
  clearUsers: () => void;
}

const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      users: [],
      setUser: (user) => set({ user }),
      clearUser: () => set({ user: null }),
      setUsers: (users) => set({ users }),
      clearUsers: () => set({ users: [] }),
    }),
    {
      name: "user-store", 
      partialize: (state) => ({ user: state.user, users: state.users }), 
    }
  )
);

export default useUserStore;
