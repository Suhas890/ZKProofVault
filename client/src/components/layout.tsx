import { Link, useLocation } from "wouter";
import { useAppStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { 
  ShieldCheck, 
  Wallet, 
  Menu, 
  X, 
  LogOut 
} from "lucide-react";
import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import abstractBg from "@assets/generated_images/abstract_dark_midnight_blockchain_network_background.png";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const { isWalletConnected, walletAddress, connectWallet, disconnectWallet } = useAppStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const NavLink = ({ href, children }: { href: string; children: React.ReactNode }) => {
    const isActive = location === href;
    return (
      <Link href={href}>
        <div className={`cursor-pointer text-sm font-medium transition-colors hover:text-primary ${isActive ? "text-primary" : "text-muted-foreground"}`}>
          {children}
        </div>
      </Link>
    );
  };

  return (
    <div className="min-h-screen w-full bg-background text-foreground relative overflow-hidden flex flex-col">
      {/* Background Layer */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-background/90 z-10" />
        <img 
          src={abstractBg} 
          alt="Background" 
          className="w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-transparent to-background z-20" />
        <div className="absolute inset-0 grid-bg z-30 opacity-20" />
      </div>

      {/* Navbar */}
      <header className="sticky top-0 z-50 w-full border-b border-white/5 bg-background/50 backdrop-blur-md">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/">
            <div className="flex items-center gap-2 cursor-pointer group">
              <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center border border-primary/50 group-hover:border-primary transition-colors">
                <ShieldCheck className="w-5 h-5 text-primary" />
              </div>
              <span className="font-display font-bold text-lg tracking-tight">Midnight<span className="text-primary">AVT</span></span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            <NavLink href="/">Home</NavLink>
            <NavLink href="/verify">Verify Age</NavLink>
            <NavLink href="/playground">Playground</NavLink>
            <NavLink href="/dashboard">Dashboard</NavLink>
          </nav>

          <div className="hidden md:flex items-center gap-4">
            {isWalletConnected ? (
              <div className="flex items-center gap-3">
                <div className="px-3 py-1.5 rounded-full bg-secondary/50 border border-white/10 text-xs font-mono text-muted-foreground">
                  {walletAddress}
                </div>
                <Button variant="ghost" size="icon" onClick={disconnectWallet} className="text-destructive hover:text-destructive hover:bg-destructive/10">
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <Button onClick={() => connectWallet()} className="bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20">
                <Wallet className="w-4 h-4 mr-2" />
                Connect Wallet
              </Button>
            )}
          </div>

          {/* Mobile Nav */}
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="w-5 h-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] bg-card border-l border-white/10">
              <div className="flex flex-col gap-8 mt-8">
                <div className="flex flex-col gap-4">
                  <Link href="/" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button variant="ghost" className="w-full justify-start">Home</Button>
                  </Link>
                  <Link href="/verify" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button variant="ghost" className="w-full justify-start">Verify Age</Button>
                  </Link>
                  <Link href="/dashboard" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button variant="ghost" className="w-full justify-start">Dashboard</Button>
                  </Link>
                </div>
                {isWalletConnected ? (
                  <div className="flex flex-col gap-2">
                    <div className="px-3 py-2 rounded-lg bg-secondary/50 border border-white/10 text-xs font-mono text-center text-muted-foreground break-all">
                      {walletAddress}
                    </div>
                    <Button variant="destructive" onClick={() => { disconnectWallet(); setIsMobileMenuOpen(false); }}>
                      Disconnect
                    </Button>
                  </div>
                ) : (
                  <Button onClick={() => { connectWallet(); setIsMobileMenuOpen(false); }}>
                    Connect Wallet
                  </Button>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 relative z-40 container mx-auto px-4 py-8 md:py-12">
        {children}
      </main>

      {/* Footer */}
      <footer className="relative z-40 border-t border-white/5 py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>Powered by Midnight Network & Cardano • Zero-Knowledge Architecture</p>
        </div>
      </footer>
    </div>
  );
}
