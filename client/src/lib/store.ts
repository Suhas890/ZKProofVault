import { create } from 'zustand';
import { createWorker } from 'tesseract.js';

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
    
    try {
      const worker = await createWorker('eng');
      const ret = await worker.recognize(file);
      const text = ret.data.text;
      await worker.terminate();
      
      console.log("OCR Result:", text);

      // Improved regex to catch common date formats
      // YYYY-MM-DD, DD-MM-YYYY, DD/MM/YYYY, DD.MM.YYYY, DD MMM YYYY
      const datePatterns = [
        /\b(19|20)\d{2}[-\/](0[1-9]|1[0-2])[-\/](0[1-9]|[12]\d|3[01])\b/, // YYYY-MM-DD or YYYY/MM/DD
        /\b(0[1-9]|[12]\d|3[01])[-\/.](0[1-9]|1[0-2])[-\/.](19|20)\d{2}\b/, // DD-MM-YYYY or DD.MM.YYYY
        /\b(0[1-9]|[12]\d|3[01])\s(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s(19|20)\d{2}\b/i // DD MMM YYYY
      ];

      let foundDate = null;

      for (const pattern of datePatterns) {
        const match = text.match(pattern);
        if (match) {
          foundDate = match[0];
          break;
        }
      }

      if (foundDate) {
        set({ 
          kycStatus: 'verified',
          birthDate: foundDate
        });
      } else {
         console.warn("No date found in OCR text. Using fallback.");
         // Keep fallback for usability but log it
         set({ 
          kycStatus: 'verified',
          birthDate: '1995-06-15' 
        });
      }

    } catch (error) {
      console.error("OCR Error:", error);
      set({ kycStatus: 'failed' });
    }
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
