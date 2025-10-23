import { Menu, LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useRole } from "@/hooks/useRole";
import AuthDialog from "@/components/AuthDialog";
import { HighContrastToggle, ScreenReaderOnly } from "@/components/AccessibilityFeatures";
import { PremiumStatusBanner } from "@/components/PremiumStatusBanner";
import justiceBotLogo from "@/assets/justice-bot-logo.jpeg";
import NotificationBell from "./NotificationBell";

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
          
            <nav id="main-navigation" className="hidden lg:flex items-center gap-6" role="navigation" aria-label="Main navigation">
              <div className="relative group">
                <button className="text-sm text-muted-foreground hover:text-foreground transition-colors px-2 py-1">
                  Housing
                </button>
                <div className="absolute left-0 top-full mt-2 w-48 bg-background border rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                  <a href="/ltb-journey" className="block px-4 py-2 text-sm hover:bg-muted">Landlord-Tenant Board</a>
                  <a href="/small-claims-journey" className="block px-4 py-2 text-sm hover:bg-muted">Eviction Defense</a>
                </div>
              </div>
              
              <div className="relative group">
                <button className="text-sm text-muted-foreground hover:text-foreground transition-colors px-2 py-1">
                  Family
                </button>
                <div className="absolute left-0 top-full mt-2 w-48 bg-background border rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                  <a href="/family-journey" className="block px-4 py-2 text-sm hover:bg-muted">Family Court</a>
                  <a href="/cas-journey" className="block px-4 py-2 text-sm hover:bg-muted">CAS Issues</a>
                </div>
              </div>
              
              <div className="relative group">
                <button className="text-sm text-muted-foreground hover:text-foreground transition-colors px-2 py-1">
                  Human Rights
                </button>
                <div className="absolute left-0 top-full mt-2 w-48 bg-background border rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                  <a href="/hrto-journey" className="block px-4 py-2 text-sm hover:bg-muted">HRTO Claims</a>
                  <a href="/labour-board-journey" className="block px-4 py-2 text-sm hover:bg-muted">Labour Board</a>
                </div>
              </div>
              
              <div className="relative group">
                <button className="text-sm text-muted-foreground hover:text-foreground transition-colors px-2 py-1">
                  Support
                </button>
                <div className="absolute left-0 top-full mt-2 w-48 bg-background border rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                  <a href="/about" className="block px-4 py-2 text-sm hover:bg-muted">About Us</a>
                  <a href="/faq" className="block px-4 py-2 text-sm hover:bg-muted">FAQ</a>
                  <a href="/tutorials" className="block px-4 py-2 text-sm hover:bg-muted">Tutorials</a>
                  <a href="/contact" className="block px-4 py-2 text-sm hover:bg-muted">Contact</a>
                </div>
              </div>
              
              <a href="/pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors px-2 py-1">
                Pricing
              </a>
              
              {isAdmin && (
                <a 
                  href="/admin" 
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors px-2 py-1"
                  aria-label="Admin console"
                >
                  Admin
                </a>
              )}
              <HighContrastToggle />
            </nav>

          <div className="flex items-center gap-4">
            {user && <NotificationBell />}
            {user ? (
              <div className="flex items-center gap-4">
                <Button 
                  variant="ghost" 
                  onClick={() => window.location.href = "/profile"}
                  className="hidden md:inline-flex"
                  aria-label="View and edit your profile"
                >
                  <User className="w-4 h-4 mr-2" aria-hidden="true" />
                  Profile
                </Button>
                <Button 
                  variant="ghost" 
                  onClick={() => window.location.href = "/dashboard"}
                  className="hidden md:inline-flex"
                  aria-label="Go to dashboard"
                >
                  Dashboard
                </Button>
                <span className="text-sm text-muted-foreground hidden md:inline" aria-live="polite">
                  {user.email}
                </span>
                <Button 
                  variant="ghost" 
                  onClick={handleSignOut} 
                  className="hidden md:inline-flex"
                  aria-label="Sign out of your account"
                >
                  <LogOut className="w-4 h-4 mr-2" aria-hidden="true" />
                  Sign Out
                </Button>
              </div>
            ) : (
              <Button 
                variant="ghost" 
                className="hidden md:inline-flex" 
                onClick={handleSignIn}
                aria-label="Sign in to your account"
              >
                Sign In
              </Button>
            )}
            
            {/* Always show sign out on mobile if user exists */}
            {user && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleSignOut} 
                className="md:hidden"
                aria-label="Sign out"
              >
                <LogOut className="w-4 h-4" aria-hidden="true" />
              </Button>
            )}
            <Button 
              variant="cta" 
              onClick={handleGetStarted}
              aria-label={user ? "Start a new case" : "Get started with Justice-Bot"}
            >
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
                href="/feedback" 
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Feedback
              </a>
              <a 
                href="/contact" 
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Contact
              </a>
              <a 
                href="/legal-chat" 
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                AI Assistant
              </a>
              <a 
                href="/document-analysis" 
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Document Analyzer
              </a>
              <a 
                href="/tutorials" 
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Tutorials
              </a>
              <a 
                href="/templates" 
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Templates
              </a>
              <a 
                href="/referrals" 
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Referrals
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
    <PremiumStatusBanner />
    <AuthDialog open={authDialogOpen} onOpenChange={setAuthDialogOpen} />
    </>
  );
};
export default Header;