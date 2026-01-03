import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { FlowProgressBadge } from '@/components/FlowProgressIndicator';
import { FlowStep, STEP_METADATA } from '@/hooks/useFlowEnforcement';
import { User, LogOut, ChevronDown } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface FlowHeaderProps {
  currentStep: FlowStep;
  caseTitle?: string;
  showProgress?: boolean;
}

export function FlowHeader({ 
  currentStep, 
  caseTitle,
  showProgress = true 
}: FlowHeaderProps) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await supabase.auth.signOut();
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  const stepMeta = STEP_METADATA[currentStep];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between px-4">
        {/* Logo - links to current step only, not homepage */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => {
              // Stay on current step - no homepage escape
            }}
            className="flex items-center gap-2 font-bold text-lg text-primary cursor-default"
          >
            <span className="hidden sm:inline">Justice-Bot</span>
            <span className="sm:hidden">JB</span>
          </button>

          {/* Case title if available */}
          {caseTitle && (
            <span className="hidden md:inline text-sm text-muted-foreground truncate max-w-[200px]">
              {caseTitle}
            </span>
          )}
        </div>

        {/* Center: Progress indicator */}
        {showProgress && (
          <div className="hidden sm:flex items-center">
            <FlowProgressBadge currentStep={currentStep} />
          </div>
        )}

        {/* Right: User dropdown (minimal - sign out only) */}
        <div className="flex items-center gap-2">
          {/* Mobile step indicator */}
          {showProgress && (
            <div className="sm:hidden">
              <FlowProgressBadge currentStep={currentStep} />
            </div>
          )}

          {user && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-2">
                  <User className="h-4 w-4" />
                  <span className="hidden sm:inline text-sm">
                    {user.email?.split('@')[0]}
                  </span>
                  <ChevronDown className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="text-destructive focus:text-destructive"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  {isLoggingOut ? 'Signing out...' : 'Sign Out'}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>

      {/* Step title bar (mobile) */}
      <div className="sm:hidden border-t bg-muted/30 px-4 py-2">
        <p className="text-sm font-medium text-center">
          {stepMeta?.title}
        </p>
      </div>
    </header>
  );
}
