import { Scale, Menu, LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import AuthDialog from "@/components/AuthDialog";
const Header = () => {
  const [authDialogOpen, setAuthDialogOpen] = useState(false);
  const { user, signOut } = useAuth();

  const handleGetStarted = () => {
    if (user) {
      // Scroll to triage section if authenticated
      document.getElementById('triage')?.scrollIntoView({ behavior: 'smooth' });
    } else {
      setAuthDialogOpen(true);
    }
  };

  const handleSignIn = () => {
    setAuthDialogOpen(true);
  };

  return (
    <>
      <header className="bg-background border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <a href="/" className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 bg-primary rounded-lg">
                <Scale className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">Justice-Bot</h1>
                <p className="text-xs text-muted-foreground">Legal clarity, simplified</p>
              </div>
            </a>
          </div>
          
          <nav className="hidden md:flex items-center gap-6">
            <a href="#triage" className="text-foreground hover:text-primary transition-colors">Smart Triage</a>
            <a href="#locator" className="text-foreground hover:text-primary transition-colors">Court Locator</a>
            <a href="#forms" className="text-foreground hover:text-primary transition-colors">Forms</a>
            <a href="#merit" className="text-foreground hover:text-primary transition-colors">Merit Score</a>
            <a href="/pricing" className="text-foreground hover:text-primary transition-colors">Pricing</a>
            <a href="/low-income" className="text-foreground hover:text-primary transition-colors">Low-Income</a>
          </nav>

          <div className="flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-4">
                <Button 
                  variant="ghost" 
                  onClick={() => window.location.href = "/dashboard"}
                  className="hidden md:inline-flex"
                >
                  <User className="w-4 h-4 mr-2" />
                  Dashboard
                </Button>
                <span className="text-sm text-muted-foreground hidden md:inline">
                  {user.email}
                </span>
                <Button variant="ghost" onClick={signOut} className="hidden md:inline-flex">
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </Button>
              </div>
            ) : (
              <Button variant="ghost" className="hidden md:inline-flex" onClick={handleSignIn}>
                Sign In
              </Button>
            )}
            <Button variant="cta" onClick={handleGetStarted}>
              {user ? "Start Case" : "Get Started"}
            </Button>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </header>
    <AuthDialog open={authDialogOpen} onOpenChange={setAuthDialogOpen} />
    </>
  );
};
export default Header;