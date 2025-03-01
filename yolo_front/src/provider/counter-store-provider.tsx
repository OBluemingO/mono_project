// src/providers/counter-store-provider.tsx
'use client'

import { type ReactNode, createContext, useContext, useRef } from 'react'
import { useStore } from 'zustand'

import { type Store, createAppStore, initCounterStore } from '@/stores/counter-store'

export type StoreApi = ReturnType<typeof createAppStore>

export const StoreContext = createContext<StoreApi | undefined>(
  undefined,
)

export interface CounterStoreProviderProps {
  children: ReactNode
}

export const AppStoreProvider = ({
  children,
}: CounterStoreProviderProps) => {
  const storeRef = useRef<StoreApi>(null)
  if (!storeRef.current) {
    storeRef.current = createAppStore(initCounterStore())
  }

  return (
    <StoreContext.Provider value={storeRef.current}>
      {children}
    </StoreContext.Provider>
  )
}

export const useAppStore = <T,>(
  selector: (store: Store) => T,
): T => {
  const appStoreContext = useContext(StoreContext)

  if (!appStoreContext) {
    throw new Error(`useCounterStore must be used within AppStoreProvider`)
  }

  return useStore(appStoreContext, selector)
}
