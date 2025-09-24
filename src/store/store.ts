import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

export interface IUser {
  id: number;
  lastName: string;
  firstName: string;
  username: string;
  age: number;
}

type State = {
  users: IUser[]
}

type Action = {
  updateUsers: (newUsers: IUser[]) => void;
}

export const useUsersStore = create<State & Action>()(
  devtools(
    persist(
      (set) => ({
        users: [] as IUser[],
        updateUsers: (newUsers) => set(() => ({ users: newUsers }))
      }),
      { name: 'userStore' }
    )
  )
)