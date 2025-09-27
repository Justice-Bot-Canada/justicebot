import { Menu, LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useRole } from "@/hooks/useRole";
import AuthDialog from "@/components/AuthDialog";
import justiceBotLogo from "@/assets/justice-bot-logo.jpeg";

const Header = () => {
  const [authDialogOpen, setAuthDialogOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, signOut } = useAuth();
  const { isAdmin } = useRole();

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
              <div className="flex items-center justify-center w-10 h-10 bg-white rounded-lg shadow-sm">
                <img 
                  src={justiceBotLogo} 
                  alt="Justice-Bot Logo" 
                  className="w-8 h-8 object-contain"
                />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">Justice-Bot</h1>
                <p className="text-xs text-muted-foreground">Legal clarity, simplified</p>
              </div>
            </a>
          </div>
          
            <nav className="hidden md:flex items-center gap-6">
              <a href="#merit" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Merit Score
              </a>
              <a href="/pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Pricing
              </a>
              {isAdmin && (
                <a href="/admin" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Admin
                </a>
              )}
              <a href="/liability" className="text-sm text-warning hover:text-warning/80 transition-colors font-medium">
                ⚠️ Legal Disclaimer
              </a>
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
            <Button 
              variant="ghost" 
              size="icon" 
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <Menu className="w-5 h-5" />
            </Button>
          </div>
        </div>
        
        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-border">
            <nav className="flex flex-col gap-4 mt-4">
              <a 
                href="#merit" 
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Merit Score
              </a>
              <a 
                href="/pricing" 
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Pricing
              </a>
              {isAdmin && (
                <a 
                  href="/admin" 
                  className="text-sm text-primary hover:text-primary/80 transition-colors font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  🔧 Admin Console
                </a>
              )}
              <a 
                href="/liability" 
                className="text-sm text-warning hover:text-warning/80 transition-colors font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                ⚠️ Legal Disclaimer
              </a>
              
              {user ? (
                <div className="flex flex-col gap-3 pt-4 border-t border-border">
                  <div className="text-xs text-muted-foreground">
                    Signed in as: {user.email}
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      window.location.href = "/dashboard";
                      setMobileMenuOpen(false);
                    }}
                    className="justify-start"
                  >
                    <User className="w-4 h-4 mr-2" />
                    Dashboard
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => {
                      signOut();
                      setMobileMenuOpen(false);
                    }}
                    className="justify-start"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </Button>
                </div>
              ) : (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    handleSignIn();
                    setMobileMenuOpen(false);
                  }}
                  className="justify-start mt-4"
                >
                  Sign In
                </Button>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
    <AuthDialog open={authDialogOpen} onOpenChange={setAuthDialogOpen} />
    </>
  );
};
export default Header;