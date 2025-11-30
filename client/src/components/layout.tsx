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
// import abstractBg from "@assets/generated_images/abstract_dark_midnight_blockchain_network_background.png"; // ⚠️ FIX: Commented out the image import that was causing a runtime crash (blank screen)

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
        <div 
          className="absolute inset-0 bg-background/90 z-10" 
          // style={{ backgroundImage: `url(${abstractBg})`, backgroundSize: 'cover' }} // ⚠️ FIX: Commented out the image usage to prevent runtime crash
        />
      </div>

      {/* Header */}
      <header className="relative z-40 border-b border-white/5 py-4">
        <div className="container mx-auto px-4 flex justify-between items-center">
          {/* Logo/Title */}
          <Link href="/">
            <div className="flex items-center space-x-2 cursor-pointer">
              <ShieldCheck className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold font-display">Midnight AVT</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <NavLink href="/">Home</NavLink>
            <NavLink href="/verify">Verify Age</NavLink>
            <NavLink href="/dashboard">Dashboard</NavLink>

            {isWalletConnected ? (
              <div className="flex items-center space-x-3">
                <div className="px-3 py-1 rounded-lg bg-secondary/50 border border-white/10 text-xs font-mono text-muted-foreground">
                  {walletAddress}
                </div>
                <Button variant="destructive" size="sm" onClick={disconnectWallet}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Disconnect
                </Button>
              </div>
            ) : (
              <Button onClick={connectWallet} size="sm">
                <Wallet className="h-4 w-4 mr-2" />
                Connect Wallet
              </Button>
            )}
          </nav>

          {/* Mobile Menu */}
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent className="w-[300px] sm:w-[400px]">
              <div className="flex flex-col h-full justify-between py-6">
                <div className="flex flex-col space-y-4">
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