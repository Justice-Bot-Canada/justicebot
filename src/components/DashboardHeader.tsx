import { useState } from "react";
import { LogOut, User, Settings, HelpCircle, ChevronDown, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/useAuth";
import { useRole } from "@/hooks/useRole";
import { PremiumStatusBanner } from "@/components/PremiumStatusBanner";
import { SkipToContent } from "@/components/SkipToContent";
import NotificationBell from "./NotificationBell";
import justiceBotLogo from "@/assets/justice-bot-logo.png";
import { Link } from "react-router-dom";

/**
 * DashboardHeader - Minimal workspace header with NO homepage escape
 * - Logo links to /dashboard (not /)
 * - NO homepage, pricing, or marketing links
 * - Profile dropdown with settings/help/admin
 */
const DashboardHeader = () => {
  const { user, signOut } = useAuth();
  const { isAdmin } = useRole();

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <>
      <SkipToContent />
      <PremiumStatusBanner />
      <header className="bg-background border-b border-border sticky top-0 z-50" role="banner">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo links to /dashboard - NOT homepage */}
            <Link 
              to="/dashboard" 
              className="flex items-center gap-3"
              aria-label="Justice-Bot - Go to dashboard"
            >
              <div className="flex items-center justify-center w-10 h-10 rounded-lg overflow-hidden">
                <img 
                  src={justiceBotLogo} 
                  alt="Justice-Bot logo" 
                  className="w-10 h-10 object-contain"
                  width="40"
                  height="40"
                  loading="eager"
                />
              </div>
              <div>
                <h1 className="text-lg font-bold text-foreground">Justice-Bot</h1>
                <p className="text-xs text-muted-foreground">Your Case Workspace</p>
              </div>
            </Link>

            {/* Right side - notifications + profile dropdown only */}
            <div className="flex items-center gap-3">
              {user && <NotificationBell />}
              
              {user && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="gap-2">
                      <User className="w-4 h-4" />
                      <span className="hidden sm:inline text-sm max-w-[120px] truncate">
                        {user.email}
                      </span>
                      <ChevronDown className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuItem asChild>
                      <Link to="/profile" className="flex items-center gap-2 cursor-pointer">
                        <User className="w-4 h-4" />
                        Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/profile" className="flex items-center gap-2 cursor-pointer">
                        <Settings className="w-4 h-4" />
                        Settings
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/faq" className="flex items-center gap-2 cursor-pointer">
                        <HelpCircle className="w-4 h-4" />
                        Help & FAQ
                      </Link>
                    </DropdownMenuItem>
                    
                    {isAdmin && (
                      <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                          <Link to="/admin" className="flex items-center gap-2 cursor-pointer text-primary">
                            <Shield className="w-4 h-4" />
                            Admin Console
                          </Link>
                        </DropdownMenuItem>
                      </>
                    )}
                    
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      onClick={handleSignOut}
                      className="flex items-center gap-2 cursor-pointer text-destructive focus:text-destructive"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default DashboardHeader;
