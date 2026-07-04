import { create } from 'zustand';
import { NetworkType } from '../constants/network';


interface NetworkState{
    network: NetworkType;
    setNetwork: (network: NetworkType) => void;
}

export const useNetworkState=create <NetworkState>((set)=>({
    network: 'devnet',
    setNetwork: (network: NetworkType) => set({ network }),
}));