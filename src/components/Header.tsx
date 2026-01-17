import { Menu, LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useRole } from "@/hooks/useRole";
import AuthDialog from "@/components/AuthDialog";
import { HighContrastToggle, ScreenReaderOnly } from "@/components/AccessibilityFeatures";
import { PremiumStatusBanner } from "@/components/PremiumStatusBanner";
import { SkipToContent } from "@/components/SkipToContent";
import justiceBotLogo from "@/assets/justice-bot-logo.png";
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

  return (
    <>
      <SkipToContent />
      <PremiumStatusBanner />
      <header className="bg-background border-b border-border sticky top-0 z-50" role="banner">
      <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <a 
              href="/" 
              className="flex items-center gap-2 sm:gap-3" 
              aria-label="Justice-Bot - Legal clarity, simplified - Go to homepage"
            >
              <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-lg overflow-hidden">
                <img 
                  src={justiceBotLogo} 
                  alt="Justice-Bot logo - Lion with scales of justice" 
                  className="w-10 h-10 sm:w-12 sm:h-12 object-contain"
                  width="48"
                  height="48"
                  loading="eager"
                  decoding="async"
                />
              </div>
              <div className="hidden xs:block">
                <h1 className="text-lg sm:text-xl font-bold text-foreground leading-tight">Justice-Bot</h1>
                <p className="text-xs text-muted-foreground hidden sm:block">Legal clarity, simplified</p>
              </div>
            </a>
          </div>
          
            <nav id="main-navigation" className="hidden md:flex items-center gap-4 lg:gap-6" role="navigation" aria-label="Main navigation">
              <div className="relative group">
                <button 
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors px-2 py-1"
                  aria-label="Get started with your legal issue"
                  aria-haspopup="true"
                >
                  Get Help
                </button>
                <div className="absolute left-0 top-full mt-2 w-56 bg-background border rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                  <div className="py-2">
                    <a href="/urgent-triage" className="block px-4 py-2 text-sm hover:bg-muted font-medium text-destructive">🚨 I Need Help NOW</a>
                    <a href="/find-my-path" className="block px-4 py-2 text-sm hover:bg-muted">🧭 Find My Legal Path</a>
                    <a href="/upload-first" className="block px-4 py-2 text-sm hover:bg-muted">📂 Upload Documents</a>
                    <a href="/explain-my-options" className="block px-4 py-2 text-sm hover:bg-muted">🧠 Explain My Options</a>
                    <a href="/triage" className="block px-4 py-2 text-sm hover:bg-muted">AI Case Triage</a>
                    <a href="/case-demo" className="block px-4 py-2 text-sm hover:bg-muted">🧪 Try a Demo Case</a>
                  </div>
                </div>
              </div>
              
              <div className="relative group">
                <button 
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors px-2 py-1"
                  aria-label="Legal areas we help with"
                  aria-haspopup="true"
                >
                  Legal Areas
                </button>
                <div className="absolute left-0 top-full mt-2 w-56 bg-background border rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                  <div className="py-2">
                    <div className="px-3 py-1 text-xs font-semibold text-muted-foreground">Housing & Tenancy</div>
                    <a href="/ltb-journey" className="block px-4 py-2 text-sm hover:bg-muted">Landlord-Tenant Board</a>
                    <a href="/ltb-toronto" className="block px-4 py-2 text-sm hover:bg-muted">LTB Toronto Guide</a>
                    <div className="px-3 py-1 mt-2 text-xs font-semibold text-muted-foreground">Family & Children</div>
                    <a href="/family-journey" className="block px-4 py-2 text-sm hover:bg-muted">Family Court</a>
                    <a href="/cas-journey" className="block px-4 py-2 text-sm hover:bg-muted">CAS Issues</a>
                    <div className="px-3 py-1 mt-2 text-xs font-semibold text-muted-foreground">Criminal Law</div>
                    <a href="/criminal-journey" className="block px-4 py-2 text-sm hover:bg-muted">Criminal Defense</a>
                    <div className="px-3 py-1 mt-2 text-xs font-semibold text-muted-foreground">Human Rights</div>
                    <a href="/hrto-journey" className="block px-4 py-2 text-sm hover:bg-muted">HRTO Claims</a>
                    <a href="/labour-journey" className="block px-4 py-2 text-sm hover:bg-muted">Labour Board</a>
                  </div>
                </div>
              </div>
              
              <div className="relative group">
                <button 
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors px-2 py-1"
                  aria-label="AI tools and features"
                  aria-haspopup="true"
                >
                  AI Tools
                </button>
                <div className="absolute left-0 top-full mt-2 w-56 bg-background border rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                  <a href="/legal-chat" className="block px-4 py-2 text-sm hover:bg-muted">AI Legal Assistant</a>
                  <a href="/document-analysis" className="block px-4 py-2 text-sm hover:bg-muted">Document Analyzer</a>
                  <a href="/case-strength" className="block px-4 py-2 text-sm hover:bg-muted">Case Strength Analyzer</a>
                  <a href="/evidence" className="block px-4 py-2 text-sm hover:bg-muted">Evidence Organizer</a>
                  <a href="/forms" className="block px-4 py-2 text-sm hover:bg-muted">Form Assistant</a>
                </div>
              </div>
              
              <div className="relative group">
                <button 
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors px-2 py-1"
                  aria-label="Resources and guides"
                  aria-haspopup="true"
                >
                  Resources
                </button>
                <div className="absolute left-0 top-full mt-2 w-56 bg-background border rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                  <a href="/tutorials" className="block px-4 py-2 text-sm hover:bg-muted">Video Tutorials</a>
                  <a href="/legal-resources" className="block px-4 py-2 text-sm hover:bg-muted">Legal Guides</a>
                  <a href="/templates" className="block px-4 py-2 text-sm hover:bg-muted">Document Templates</a>
                  <a href="/blog" className="block px-4 py-2 text-sm hover:bg-muted">Blog</a>
                  <a href="/faq" className="block px-4 py-2 text-sm hover:bg-muted">FAQ</a>
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

          <div className="flex items-center gap-2 sm:gap-3">
            {user && <NotificationBell />}
            {user ? (
              <div className="flex items-center gap-2 sm:gap-3">
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => window.location.href = "/profile"}
                  className="hidden lg:inline-flex"
                  aria-label="View and edit your profile"
                >
                  <User className="w-4 h-4 mr-2" aria-hidden="true" />
                  Profile
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => window.location.href = "/dashboard"}
                  className="hidden md:inline-flex"
                  aria-label="Go to dashboard"
                >
                  Dashboard
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={handleSignOut} 
                  className="hidden lg:inline-flex"
                  aria-label="Sign out of your account"
                >
                  <LogOut className="w-4 h-4 mr-2" aria-hidden="true" />
                  Sign Out
                </Button>
              </div>
            ) : (
              <Button 
                variant="ghost" 
                size="sm"
                className="hidden md:inline-flex" 
                onClick={handleSignIn}
                aria-label="Sign in to your account"
              >
                Sign In
              </Button>
            )}
            
            <Button 
              variant="cta" 
              size="sm"
              onClick={handleGetStarted}
              aria-label={user ? "Start a new case" : "Get started with Justice-Bot"}
              className="text-xs sm:text-sm px-3 sm:px-4"
            >
              {user ? "Start" : "Get Started"}
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="md:hidden flex-shrink-0"
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
            <nav className="flex flex-col gap-2 mt-4" role="navigation">
              <div className="text-xs font-semibold text-muted-foreground px-2 pt-2">Get Help</div>
              <a href="/urgent-triage" className="text-sm text-destructive hover:text-destructive/80 font-medium transition-colors px-2 py-1" onClick={() => setMobileMenuOpen(false)}>🚨 I Need Help NOW</a>
              <a href="/find-my-path" className="text-sm text-muted-foreground hover:text-foreground transition-colors px-2 py-1" onClick={() => setMobileMenuOpen(false)}>🧭 Find My Legal Path</a>
              <a href="/upload-first" className="text-sm text-muted-foreground hover:text-foreground transition-colors px-2 py-1" onClick={() => setMobileMenuOpen(false)}>📂 Upload Documents</a>
              <a href="/explain-my-options" className="text-sm text-muted-foreground hover:text-foreground transition-colors px-2 py-1" onClick={() => setMobileMenuOpen(false)}>🧠 Explain My Options</a>
              
              <div className="text-xs font-semibold text-muted-foreground px-2 pt-3">Legal Areas</div>
              <a href="/ltb-journey" className="text-sm text-muted-foreground hover:text-foreground transition-colors px-2 py-1" onClick={() => setMobileMenuOpen(false)}>Landlord-Tenant</a>
              <a href="/family-journey" className="text-sm text-muted-foreground hover:text-foreground transition-colors px-2 py-1" onClick={() => setMobileMenuOpen(false)}>Family Court</a>
              <a href="/criminal-journey" className="text-sm text-muted-foreground hover:text-foreground transition-colors px-2 py-1" onClick={() => setMobileMenuOpen(false)}>Criminal Law</a>
              <a href="/hrto-journey" className="text-sm text-muted-foreground hover:text-foreground transition-colors px-2 py-1" onClick={() => setMobileMenuOpen(false)}>Human Rights</a>
              
              <div className="text-xs font-semibold text-muted-foreground px-2 pt-3">AI Tools</div>
              <a href="/legal-chat" className="text-sm text-muted-foreground hover:text-foreground transition-colors px-2 py-1" onClick={() => setMobileMenuOpen(false)}>AI Assistant</a>
              <a href="/document-analysis" className="text-sm text-muted-foreground hover:text-foreground transition-colors px-2 py-1" onClick={() => setMobileMenuOpen(false)}>Document Analyzer</a>
              <a href="/case-strength" className="text-sm text-muted-foreground hover:text-foreground transition-colors px-2 py-1" onClick={() => setMobileMenuOpen(false)}>Case Strength</a>
              <a href="/evidence" className="text-sm text-muted-foreground hover:text-foreground transition-colors px-2 py-1" onClick={() => setMobileMenuOpen(false)}>Evidence Hub</a>
              
              <div className="text-xs font-semibold text-muted-foreground px-2 pt-3">Resources</div>
              <a href="/tutorials" className="text-sm text-muted-foreground hover:text-foreground transition-colors px-2 py-1" onClick={() => setMobileMenuOpen(false)}>Tutorials</a>
              <a href="/legal-resources" className="text-sm text-muted-foreground hover:text-foreground transition-colors px-2 py-1" onClick={() => setMobileMenuOpen(false)}>Legal Guides</a>
              <a href="/faq" className="text-sm text-muted-foreground hover:text-foreground transition-colors px-2 py-1" onClick={() => setMobileMenuOpen(false)}>FAQ</a>
              
              <div className="text-xs font-semibold text-muted-foreground px-2 pt-3">Support</div>
              <a href="/pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors px-2 py-1" onClick={() => setMobileMenuOpen(false)}>Pricing</a>
              <a href="/contact" className="text-sm text-muted-foreground hover:text-foreground transition-colors px-2 py-1" onClick={() => setMobileMenuOpen(false)}>Contact</a>
              
              {isAdmin && (
                <>
                  <div className="border-t border-border my-2"></div>
                  <a href="/admin" className="text-sm text-primary hover:text-primary/80 transition-colors font-medium px-2 py-1" onClick={() => setMobileMenuOpen(false)}>🔧 Admin</a>
                </>
              )}
              
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