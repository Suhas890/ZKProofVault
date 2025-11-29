import { useEffect, useState } from "react";
import { useAppStore } from "@/lib/store";
import { useLocation, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { 
  Upload, 
  FileCheck, 
  Loader2, 
  Shield, 
  CheckCircle, 
  ArrowRight,
  AlertCircle,
  Cpu
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function KYCProcess() {
  const [_, setLocation] = useLocation();
  const { 
    isWalletConnected, 
    kycStatus, 
    startKYC, 
    birthDate, 
    proofStatus, 
    generateProof,
    avtStatus,
    mintAVT
  } = useAppStore();

  const [uploadProgress, setUploadProgress] = useState(0);

  // Redirect if wallet not connected
  useEffect(() => {
    if (!isWalletConnected) {
      setLocation("/");
    }
  }, [isWalletConnected, setLocation]);

  // Step Logic
  const currentStep = 
    avtStatus === 'minted' ? 4 :
    proofStatus === 'generated' ? 3 :
    kycStatus === 'verified' ? 2 :
    1;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      // Simulate upload progress
      let p = 0;
      const interval = setInterval(() => {
        p += 10;
        setUploadProgress(p);
        if (p >= 100) {
          clearInterval(interval);
          startKYC(e.target.files![0]);
        }
      }, 100);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-12 text-center">
        <h1 className="text-3xl font-display font-bold mb-4">Identity Verification</h1>
        <p className="text-muted-foreground">
          Follow the steps to generate your private Age Verification Token.
        </p>
      </div>

      {/* Stepper */}
      <div className="flex justify-between mb-12 relative">
        <div className="absolute top-1/2 left-0 w-full h-0.5 bg-white/10 -z-10 transform -translate-y-1/2" />
        <Step number={1} title="Upload ID" active={currentStep >= 1} completed={currentStep > 1} />
        <Step number={2} title="Generate ZK Proof" active={currentStep >= 2} completed={currentStep > 2} />
        <Step number={3} title="Mint AVT" active={currentStep >= 3} completed={currentStep > 3} />
        <Step number={4} title="Complete" active={currentStep >= 4} completed={currentStep === 4} />
      </div>

      {/* Main Card */}
      <div className="glass-panel rounded-2xl p-8 min-h-[400px] flex flex-col items-center justify-center relative overflow-hidden">
        
        {/* Step 1: Upload */}
        {currentStep === 1 && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }} 
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md text-center"
          >
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-primary/20">
              <Upload className="w-10 h-10 text-primary" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Upload Government ID</h2>
            <p className="text-muted-foreground mb-8 text-sm">
              We support Passports, Driver's Licenses, and National ID cards.
              <br/><span className="text-xs text-accent/80 mt-2 block">Data is processed locally and never stored.</span>
            </p>

            {kycStatus === 'idle' ? (
              <div className="border-2 border-dashed border-white/10 rounded-xl p-8 hover:border-primary/50 transition-colors cursor-pointer relative bg-white/5 hover:bg-white/10">
                <input 
                  type="file" 
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  onChange={handleFileUpload}
                  accept="image/*"
                />
                <div className="flex flex-col items-center gap-2">
                  <FileCheck className="w-8 h-8 text-muted-foreground" />
                  <span className="text-sm font-medium">Click or Drag to Upload</span>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span>Processing ID...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <Progress value={uploadProgress} className="h-2" />
                {kycStatus === 'scanning' && (
                  <div className="flex items-center justify-center gap-2 text-xs text-primary animate-pulse mt-4">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Extracting birthdate via OCR...
                  </div>
                )}
              </div>
            )}
          </motion.div>
        )}

        {/* Step 2: ZK Proof */}
        {currentStep === 2 && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }} 
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md text-center"
          >
            <div className="w-20 h-20 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-accent/20">
              <Shield className="w-10 h-10 text-accent" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Generate Zero-Knowledge Proof</h2>
            <p className="text-muted-foreground mb-8 text-sm">
              Birthdate extracted: <span className="text-white font-mono bg-white/10 px-2 py-0.5 rounded">{birthDate}</span>
              <br/>We will now prove you are 18+ without revealing this date.
            </p>

            {proofStatus === 'idle' && (
              <Button onClick={() => generateProof()} size="lg" className="w-full bg-accent text-black hover:bg-accent/90 font-bold">
                <Cpu className="w-4 h-4 mr-2" />
                Generate Proof on Midnight
              </Button>
            )}

            {proofStatus === 'generating' && (
              <div className="space-y-6">
                <div className="relative w-32 h-32 mx-auto">
                  <div className="absolute inset-0 border-4 border-accent/20 rounded-full" />
                  <div className="absolute inset-0 border-4 border-accent rounded-full border-t-transparent animate-spin" />
                  <Cpu className="absolute inset-0 m-auto w-10 h-10 text-accent animate-pulse" />
                </div>
                <div className="text-center">
                  <h3 className="font-mono text-accent">Constructing Circuit...</h3>
                  <p className="text-xs text-muted-foreground mt-2">
                    Inputs: [Secret: Birthdate, Public: CurrentDate]<br/>
                    Output: [Boolean: IsAdult]
                  </p>
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* Step 3: Mint AVT */}
        {currentStep === 3 && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }} 
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md text-center"
          >
            <div className="w-20 h-20 bg-purple-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-purple-500/20">
              <CheckCircle className="w-10 h-10 text-purple-500" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Proof Verified</h2>
            <p className="text-muted-foreground mb-8 text-sm">
              Midnight Network has verified your proof. 
              <br/>You can now mint your Soulbound AVT on Cardano.
            </p>

            {avtStatus === 'idle' && (
              <Button onClick={() => mintAVT()} size="lg" className="w-full bg-purple-600 hover:bg-purple-700 font-bold shadow-lg shadow-purple-900/20">
                <ArrowRight className="w-4 h-4 mr-2" />
                Mint AVT to Wallet
              </Button>
            )}

            {avtStatus === 'minting' && (
              <div className="space-y-4">
                <div className="flex items-center justify-center gap-3 text-purple-400">
                  <Loader2 className="w-6 h-6 animate-spin" />
                  <span className="font-mono text-lg">Submitting Transaction...</span>
                </div>
                <p className="text-xs text-muted-foreground">Interaction with Cardano Blockchain</p>
              </div>
            )}
          </motion.div>
        )}

        {/* Step 4: Success */}
        {currentStep === 4 && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }} 
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md text-center"
          >
            <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-green-500/50 shadow-[0_0_30px_rgba(0,255,0,0.2)]">
              <CheckCircle className="w-12 h-12 text-green-400" />
            </div>
            <h2 className="text-3xl font-bold mb-4 text-green-400">Verification Complete</h2>
            <p className="text-muted-foreground mb-8">
              Your Age Verification Token has been minted and is now in your wallet.
            </p>

            <div className="bg-white/5 p-4 rounded-lg mb-8 border border-white/10 text-left">
              <div className="text-xs text-muted-foreground mb-1">Token ID</div>
              <div className="font-mono text-sm truncate text-primary">asset1...8j290s9j20s</div>
              <div className="text-xs text-muted-foreground mt-3 mb-1">Status</div>
              <div className="text-green-400 text-sm font-bold flex items-center gap-2">
                <Shield className="w-3 h-3" /> Verified Adult (18+)
              </div>
            </div>

            <Link href="/dashboard">
              <Button size="lg" className="w-full bg-white text-black hover:bg-gray-200">
                Go to Dashboard
              </Button>
            </Link>
          </motion.div>
        )}
      </div>
    </div>
  );
}

function Step({ number, title, active, completed }: { number: number, title: string, active: boolean, completed: boolean }) {
  return (
    <div className="flex flex-col items-center relative z-10">
      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-500 border-2 
        ${completed ? 'bg-primary border-primary text-white' : 
          active ? 'bg-background border-primary text-primary shadow-[0_0_15px_rgba(99,102,241,0.5)]' : 
          'bg-background border-white/10 text-muted-foreground'}`}>
        {completed ? <CheckCircle className="w-5 h-5" /> : number}
      </div>
      <div className={`mt-3 text-xs font-medium uppercase tracking-wider transition-colors duration-300 ${active || completed ? 'text-white' : 'text-muted-foreground'}`}>
        {title}
      </div>
    </div>
  );
}
