import { Button } from "@/components/ui/button";
import { useAppStore } from "@/lib/store";
import { Link } from "wouter";
import { ArrowRight, Shield, Lock, Zap, CheckCircle2, HelpCircle, Wallet } from "lucide-react";
import { motion } from "framer-motion";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

export default function Landing() {
  const { isWalletConnected, connectWallet } = useAppStore();

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] gap-16">
      {/* Hero Section */}
      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="text-center space-y-6 max-w-3xl"
      >
        <motion.div variants={item} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-4">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
          </span>
          Midnight Network Testnet Live
        </motion.div>
        
        <motion.h1 variants={item} className="text-5xl md:text-7xl font-display font-bold tracking-tight leading-[1.1]">
          Verify Once. <br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-purple-400 to-accent">
            Prove Everywhere.
          </span>
        </motion.h1>
        
        <motion.p variants={item} className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          The world's first Zero-Knowledge Age Verification Token on Cardano. 
          Prove you are 18+ without ever revealing your birthdate or identity.
        </motion.p>

        <motion.div variants={item} className="flex flex-col sm:flex-row gap-4 justify-center pt-4 items-center">
          {isWalletConnected ? (
            <Link href="/verify">
              <Button size="lg" className="h-14 px-8 text-lg bg-primary hover:bg-primary/90 shadow-xl shadow-primary/20 transition-all hover:scale-105">
                Start Verification <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          ) : (
            <div className="flex items-center gap-2">
              <Button size="lg" onClick={() => connectWallet()} className="h-14 px-8 text-lg bg-white text-black hover:bg-gray-200 shadow-xl transition-all hover:scale-105">
                Connect Wallet to Start
              </Button>
              
              <HoverCard>
                <HoverCardTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full h-10 w-10 text-muted-foreground hover:text-white">
                    <HelpCircle className="w-6 h-6" />
                  </Button>
                </HoverCardTrigger>
                <HoverCardContent className="w-80 bg-card border-white/10 backdrop-blur-xl">
                  <div className="flex justify-between space-x-4">
                    <div className="space-y-1">
                      <h4 className="text-sm font-semibold flex items-center gap-2">
                        <Wallet className="w-4 h-4 text-primary" /> What is this?
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        Connecting your wallet allows you to:
                      </p>
                      <ul className="text-xs text-muted-foreground list-disc pl-4 mt-2 space-y-1">
                        <li>Create a secure, private account without a password</li>
                        <li>Receive your Age Verification Token (AVT)</li>
                        <li>Prove your age to apps without sharing data</li>
                      </ul>
                    </div>
                  </div>
                </HoverCardContent>
              </HoverCard>
            </div>
          )}
          <Button size="lg" variant="outline" className="h-14 px-8 text-lg border-white/10 hover:bg-white/5">
            Read the Whitepaper
          </Button>
        </motion.div>
      </motion.div>

      {/* Features Grid */}
      <div className="grid md:grid-cols-3 gap-8 w-full max-w-6xl">
        <FeatureCard 
          icon={<Lock className="w-8 h-8 text-accent" />}
          title="Zero-Knowledge Privacy"
          description="Your personal data never leaves your device. We only verify the math, not the documents."
        />
        <FeatureCard 
          icon={<Shield className="w-8 h-8 text-primary" />}
          title="Soulbound Security"
          description="Receive a non-transferable AVT token on Cardano that permanently proves your status."
        />
        <FeatureCard 
          icon={<Zap className="w-8 h-8 text-purple-400" />}
          title="Instant Access"
          description="One-click login for age-restricted dApps, websites, and services. No more uploads."
        />
      </div>

      {/* Stats/Trust Section */}
      <div className="w-full max-w-4xl p-8 rounded-2xl bg-card/30 border border-white/5 backdrop-blur-sm">
        <div className="flex justify-between items-center text-center divide-x divide-white/10">
          <div className="flex-1 px-4">
            <div className="text-3xl font-mono font-bold text-white">100%</div>
            <div className="text-sm text-muted-foreground mt-1">Private</div>
          </div>
          <div className="flex-1 px-4">
            <div className="text-3xl font-mono font-bold text-white">CIP-68</div>
            <div className="text-sm text-muted-foreground mt-1">Standard</div>
          </div>
          <div className="flex-1 px-4">
            <div className="text-3xl font-mono font-bold text-white">2s</div>
            <div className="text-sm text-muted-foreground mt-1">Verification</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="p-6 rounded-xl bg-card/40 border border-white/5 hover:border-primary/30 transition-colors group backdrop-blur-sm">
      <div className="mb-4 p-3 rounded-lg bg-white/5 w-fit group-hover:bg-primary/10 transition-colors">
        {icon}
      </div>
      <h3 className="text-xl font-display font-bold mb-2 text-white">{title}</h3>
      <p className="text-muted-foreground leading-relaxed">
        {description}
      </p>
    </div>
  );
}
