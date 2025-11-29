import { useAppStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ShieldCheck, 
  ExternalLink, 
  Clock, 
  Fingerprint, 
  FileCode, 
  CheckCircle2,
  XCircle,
  RefreshCw,
  Loader2
} from "lucide-react";
import { Link } from "wouter";
import { useState } from "react";
import { motion } from "framer-motion";

export default function Dashboard() {
  const { isWalletConnected, avtStatus, walletAddress, reset } = useAppStore();
  const [demoVerificationStatus, setDemoVerificationStatus] = useState<'idle' | 'checking' | 'success'>('idle');

  const handleDemoCheck = () => {
    setDemoVerificationStatus('checking');
    setTimeout(() => {
      setDemoVerificationStatus('success');
    }, 1500);
  };

  if (!isWalletConnected) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center">
        <h2 className="text-2xl font-bold mb-4">Wallet Not Connected</h2>
        <p className="text-muted-foreground mb-8">Please connect your wallet to view your AVT Dashboard.</p>
        <Link href="/">
          <Button>Return Home</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold">My Identity Dashboard</h1>
          <p className="text-muted-foreground">Manage your Zero-Knowledge credentials.</p>
        </div>
        {avtStatus === 'minted' && (
          <Button variant="outline" onClick={() => { reset(); window.location.reload(); }} className="border-white/10 hover:bg-white/5 text-xs">
            <RefreshCw className="w-3 h-3 mr-2" /> Reset Demo
          </Button>
        )}
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Main Token Card */}
        <Card className="md:col-span-2 glass-panel border-0 overflow-hidden relative group">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-xl flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-primary" />
                  Midnight AVT Credential
                </CardTitle>
                <CardDescription>CIP-68 Soulbound Token</CardDescription>
              </div>
              {avtStatus === 'minted' ? (
                <Badge className="bg-accent text-black hover:bg-accent/90">Active</Badge>
              ) : (
                <Badge variant="outline" className="text-muted-foreground">Not Minted</Badge>
              )}
            </div>
          </CardHeader>
          
          <CardContent className="space-y-6 relative z-10">
            {avtStatus === 'minted' ? (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg bg-black/20 border border-white/5">
                    <div className="text-xs text-muted-foreground mb-1">Verification Type</div>
                    <div className="font-medium">Age 18+ Check</div>
                  </div>
                  <div className="p-4 rounded-lg bg-black/20 border border-white/5">
                    <div className="text-xs text-muted-foreground mb-1">Privacy Level</div>
                    <div className="font-medium text-accent">Zero-Knowledge</div>
                  </div>
                  <div className="p-4 rounded-lg bg-black/20 border border-white/5">
                    <div className="text-xs text-muted-foreground mb-1">Issued Date</div>
                    <div className="font-medium">Today</div>
                  </div>
                  <div className="p-4 rounded-lg bg-black/20 border border-white/5">
                    <div className="text-xs text-muted-foreground mb-1">Issuer</div>
                    <div className="font-medium">Midnight Network</div>
                  </div>
                </div>

                <div className="bg-code-bg p-4 rounded-lg font-mono text-xs text-muted-foreground break-all border border-white/5">
                  <div className="flex items-center gap-2 mb-2 text-white font-bold">
                    <Fingerprint className="w-3 h-3" /> Token Policy ID
                  </div>
                  8f920192...9201920 (Mock)
                </div>
              </>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-6">You haven't verified your age yet.</p>
                <Link href="/verify">
                  <Button>Start Verification</Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Side Stats */}
        <div className="space-y-6">
          <Card className="glass-panel border-0">
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">Wallet Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="font-medium">Connected</span>
              </div>
              <div className="text-xs font-mono text-muted-foreground truncate bg-black/20 p-2 rounded">
                {walletAddress}
              </div>
            </CardContent>
          </Card>

          <Card className="glass-panel border-0">
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {avtStatus === 'minted' && (
                <div className="flex items-start gap-3 text-sm">
                  <div className="mt-1 p-1 bg-accent/10 rounded-full">
                    <CheckCircle2 className="w-3 h-3 text-accent" />
                  </div>
                  <div>
                    <div className="font-medium">AVT Minted</div>
                    <div className="text-xs text-muted-foreground">Just now</div>
                  </div>
                </div>
              )}
              <div className="flex items-start gap-3 text-sm opacity-50">
                <div className="mt-1 p-1 bg-white/10 rounded-full">
                  <Clock className="w-3 h-3" />
                </div>
                <div>
                  <div className="font-medium">Wallet Connected</div>
                  <div className="text-xs text-muted-foreground">2 mins ago</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Integration Demo Area */}
      {avtStatus === 'minted' && (
        <div className="mt-12 pt-12 border-t border-white/5">
          <h2 className="text-2xl font-bold mb-6">Developer Integration Demo</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <p className="text-muted-foreground">
                Test how third-party dApps verify your AVT without asking for personal data.
              </p>
              <div className="p-6 rounded-xl bg-white/5 border border-white/10">
                <h3 className="font-bold mb-4 flex items-center gap-2">
                  <ExternalLink className="w-4 h-4" /> Partner Website Example
                </h3>
                <div className="space-y-4">
                  <div className="h-4 w-3/4 bg-white/10 rounded" />
                  <div className="h-4 w-1/2 bg-white/10 rounded" />
                  <div className="h-32 w-full bg-black/40 rounded-lg flex items-center justify-center border border-white/5">
                    {demoVerificationStatus === 'idle' && (
                      <div className="text-center">
                        <p className="text-sm text-muted-foreground mb-3">This content is 18+ only.</p>
                        <Button size="sm" variant="secondary" onClick={handleDemoCheck}>
                          Verify with Midnight AVT
                        </Button>
                      </div>
                    )}
                    {demoVerificationStatus === 'checking' && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Loader2 className="w-4 h-4 animate-spin" /> Checking Blockchain...
                      </div>
                    )}
                    {demoVerificationStatus === 'success' && (
                      <motion.div 
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="text-center"
                      >
                        <CheckCircle2 className="w-8 h-8 text-green-500 mx-auto mb-2" />
                        <p className="text-green-400 font-bold">Access Granted</p>
                        <p className="text-xs text-muted-foreground">Verified via AVT Token</p>
                      </motion.div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="rounded-xl overflow-hidden border border-white/10 bg-[#0d1117]">
              <div className="flex items-center gap-2 px-4 py-2 bg-white/5 border-b border-white/5">
                <FileCode className="w-4 h-4 text-muted-foreground" />
                <span className="text-xs font-mono text-muted-foreground">code_example.ts</span>
              </div>
              <div className="p-4 font-mono text-xs text-gray-300 overflow-x-auto">
                <pre>{`// How partners verify you
async function checkAccess(userAddress) {
  
  // 1. Query Cardano Blockchain
  const assets = await lucid
    .walletAt(userAddress)
    .getAssets();

  // 2. Check for AVT Policy ID
  const hasAVT = assets.find(asset => 
    asset.policyId === AVT_POLICY_ID &&
    asset.metadata.age >= 18
  );

  // 3. Grant Access
  return !!hasAVT; 
}`}</pre>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
