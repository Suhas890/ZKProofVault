import { create } from 'zustand';

interface AppState {
  walletAddress: string | null;
  isWalletConnected: boolean;
  kycStatus: 'idle' | 'scanning' | 'verified' | 'failed';
  birthDate: string | null;
  proofStatus: 'idle' | 'generating' | 'generated' | 'failed';
  avtStatus: 'idle' | 'minting' | 'minted' | 'failed';
  
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  startKYC: (file: File) => Promise<void>;
  generateProof: () => Promise<void>;
  mintAVT: () => Promise<void>;
  reset: () => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  walletAddress: null,
  isWalletConnected: false,
  kycStatus: 'idle',
  birthDate: null,
  proofStatus: 'idle',
  avtStatus: 'idle',

  connectWallet: async () => {
    // Simulate wallet connection
    await new Promise(resolve => setTimeout(resolve, 800));
    set({ 
      walletAddress: 'addr1q9x7...3j2s9k', 
      isWalletConnected: true 
    });
  },

  disconnectWallet: () => {
    set({ 
      walletAddress: null, 
      isWalletConnected: false,
      kycStatus: 'idle',
      birthDate: null,
      proofStatus: 'idle',
      avtStatus: 'idle'
    });
  },

  startKYC: async (file: File) => {
    set({ kycStatus: 'scanning' });
    // Simulate KYC processing
    await new Promise(resolve => setTimeout(resolve, 2500));
    set({ 
      kycStatus: 'verified',
      birthDate: '1995-06-15' // Mock birthdate > 18
    });
  },

  generateProof: async () => {
    set({ proofStatus: 'generating' });
    // Simulate ZK Proof generation (heavy computation)
    await new Promise(resolve => setTimeout(resolve, 3000));
    set({ proofStatus: 'generated' });
  },

  mintAVT: async () => {
    set({ avtStatus: 'minting' });
    // Simulate Blockchain transaction
    await new Promise(resolve => setTimeout(resolve, 2000));
    set({ avtStatus: 'minted' });
  },

  reset: () => {
    set({
      kycStatus: 'idle',
      birthDate: null,
      proofStatus: 'idle',
      avtStatus: 'idle'
    });
  }
}));
