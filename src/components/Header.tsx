import { Menu, LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useRole } from "@/hooks/useRole";
import AuthDialog from "@/components/AuthDialog";
import { HighContrastToggle, ScreenReaderOnly } from "@/components/AccessibilityFeatures";
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

  const handleSignOut = async () => {
    await signOut();
    setMobileMenuOpen(false);
  };

  // Debug logging
  console.log('Header - User:', user?.email, 'IsAdmin:', isAdmin);

  return (
    <>
      <header className="bg-background border-b border-border sticky top-0 z-50" role="banner">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <a 
              href="/" 
              className="flex items-center gap-3" 
              aria-label="Justice-Bot - Legal clarity, simplified - Go to homepage"
            >
              <div className="flex items-center justify-center w-10 h-10 bg-white rounded-lg shadow-sm">
                <img 
                  src={justiceBotLogo} 
                  alt="Justice-Bot logo - Scale of justice symbol" 
                  className="w-8 h-8 object-contain"
                />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">Justice-Bot</h1>
                <p className="text-xs text-muted-foreground">Legal clarity, simplified</p>
              </div>
            </a>
          </div>
          
            <nav id="main-navigation" className="hidden md:flex items-center gap-6" role="navigation" aria-label="Main navigation">
              <a 
                href="#merit" 
                className="text-sm text-muted-foreground hover:text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-md px-2 py-1"
              >
                Merit Score
                <ScreenReaderOnly>Assess the strength of your legal case</ScreenReaderOnly>
              </a>
              <a 
                href="/pricing" 
                className="text-sm text-muted-foreground hover:text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-md px-2 py-1"
              >
                Pricing
              </a>
              <a 
                href="/contact" 
                className="text-sm text-muted-foreground hover:text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-md px-2 py-1"
              >
                Contact
              </a>
              {isAdmin && (
                <a 
                  href="/admin" 
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-md px-2 py-1"
                  aria-label="Admin console - Administrative functions"
                >
                  Admin
                </a>
              )}
              <a 
                href="/liability" 
                className="text-sm text-warning hover:text-warning/80 transition-colors font-medium focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-md px-2 py-1"
                aria-label="Legal disclaimer - Important legal information"
              >
                ⚠️ Legal Disclaimer
              </a>
              <HighContrastToggle />
            </nav>

          <div className="flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-4">
                <Button 
                  variant="ghost" 
                  onClick={() => window.location.href = "/profile"}
                  className="hidden md:inline-flex"
                >
                  <User className="w-4 h-4 mr-2" />
                  Profile
                </Button>
                <Button 
                  variant="ghost" 
                  onClick={() => window.location.href = "/dashboard"}
                  className="hidden md:inline-flex"
                >
                  Dashboard
                </Button>
                <span className="text-sm text-muted-foreground hidden md:inline">
                  {user.email}
                </span>
                <Button variant="ghost" onClick={handleSignOut} className="hidden md:inline-flex">
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </Button>
              </div>
            ) : (
              <Button variant="ghost" className="hidden md:inline-flex" onClick={handleSignIn}>
                Sign In
              </Button>
            )}
            
            {/* Always show sign out on mobile if user exists */}
            {user && (
              <Button variant="ghost" size="sm" onClick={handleSignOut} className="md:hidden">
                <LogOut className="w-4 h-4" />
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
              aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-menu"
            >
              <Menu className="w-5 h-5" />
              <ScreenReaderOnly>{mobileMenuOpen ? "Close menu" : "Open menu"}</ScreenReaderOnly>
            </Button>
          </div>
        </div>
        
        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div 
            id="mobile-menu" 
            className="md:hidden mt-4 pb-4 border-t border-border"
            role="region"
            aria-label="Mobile navigation menu"
          >
            <nav className="flex flex-col gap-4 mt-4" role="navigation">
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
              <a 
                href="/contact" 
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Contact
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
                      window.location.href = "/profile";
                      setMobileMenuOpen(false);
                    }}
                    className="justify-start"
                  >
                    <User className="w-4 h-4 mr-2" />
                    Profile
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      window.location.href = "/dashboard";
                      setMobileMenuOpen(false);
                    }}
                    className="justify-start"
                  >
                    Dashboard
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={handleSignOut}
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