import { create } from 'zustand';

interface WalletState {
  publicKey: string | null;
  isUnlocked: boolean;
  isLoading: boolean;
  setPublicKey: (publicKey: string) => void;
  setUnlocked: (unlocked: boolean) => void;
  setLoading: (loading: boolean) => void;
  reset: () => void;
}

export const userWalletStore= create<WalletState>((set)=>({
    publicKey:null,
    isUnlocked:false,
    isLoading:false,
    setPublicKey: (publicKey) => set({ publicKey }),
    setUnlocked: (unlocked) => set({ isUnlocked: unlocked }),
    setLoading: (loading) => set({ isLoading: loading }),
    reset: () => set({ publicKey: null, isUnlocked: false, isLoading: false }),
}));