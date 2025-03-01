// src/stores/counter-store.ts
import { DeepPartial } from 'react-hook-form';
import { createStore } from 'zustand/vanilla';

export type User = {
  id: number;
  username: string
  email: string
  password: string
}

export type State = {
  count: number
  yolo: number
  user?: DeepPartial<User>
}

export type Actions = {
  decrementCount: () => void
  incrementCount: () => void
}

export type Store = State & Actions

export const defaultInitState: State = {
  count: 0,
  yolo: 0
}

export const initCounterStore = (): State => {
  return { ...defaultInitState, yolo: 100 }
}

// const initializeAuthStore = async () => {
//   if (typeof window !== "undefined") {
//     const c = await cookies()
//     const userInfoFromCookie = c.get("token");
//     if (userInfoFromCookie) {
//       try {
//         useUserStore.setState({ userInfo: JSON.parse(userInfoFromCookie) });
//       } catch (error) {
//         console.error("Error parsing userInfo from cookie:", error);
//       }
//     }
//   }
// };


export const createAppStore = (
  initState: State = defaultInitState,
) => {
  return createStore<Store>()((set) => ({
    ...initState,
    decrementCount: () => set((state) => ({ count: state.count - 1 })),
    incrementCount: () => set((state) => ({ count: state.count + 1 })),
  }))
}
