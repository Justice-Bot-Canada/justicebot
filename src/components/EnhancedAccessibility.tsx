import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { 
  Type, 
  Palette, 
  Zap, 
  Eye, 
  Volume2, 
  VolumeX,
  Settings,
  X
} from "lucide-react";

// Enhanced Accessibility Panel
export const AccessibilityPanel = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [fontSize, setFontSize] = useState(16);
  const [lineHeight, setLineHeight] = useState(1.6);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Load saved preferences
    const savedPrefs = JSON.parse(localStorage.getItem('accessibility-prefs') || '{}');
    setFontSize(savedPrefs.fontSize || 16);
    setLineHeight(savedPrefs.lineHeight || 1.6);
    setSoundEnabled(savedPrefs.soundEnabled || false);
    setReducedMotion(savedPrefs.reducedMotion || false);
    setHighContrast(savedPrefs.highContrast || false);

    // Apply initial settings
    applyAccessibilitySettings(savedPrefs);
  }, []);

  const applyAccessibilitySettings = (prefs: any) => {
    const root = document.documentElement;
    
    // Font size
    root.style.fontSize = `${prefs.fontSize || fontSize}px`;
    
    // Line height
    root.style.setProperty('--line-height-base', `${prefs.lineHeight || lineHeight}`);
    
    // High contrast
    if (prefs.highContrast || highContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }
    
    // Reduced motion
    if (prefs.reducedMotion || reducedMotion) {
      root.classList.add('reduce-motion');
    } else {
      root.classList.remove('reduce-motion');
    }
  };

  const savePreferences = (newPrefs: any) => {
    const preferences = {
      fontSize,
      lineHeight,
      soundEnabled,
      reducedMotion,
      highContrast,
      ...newPrefs
    };
    
    localStorage.setItem('accessibility-prefs', JSON.stringify(preferences));
    applyAccessibilitySettings(preferences);
  };

  const handleFontSizeChange = (value: number[]) => {
    const newSize = value[0];
    setFontSize(newSize);
    savePreferences({ fontSize: newSize });
    
    if (soundEnabled) {
      playSound('adjustment');
    }
  };

  const handleLineHeightChange = (value: number[]) => {
    const newHeight = value[0];
    setLineHeight(newHeight);
    savePreferences({ lineHeight: newHeight });
  };

  const toggleHighContrast = () => {
    const newValue = !highContrast;
    setHighContrast(newValue);
    savePreferences({ highContrast: newValue });
    
    toast({
      title: newValue ? "High contrast enabled" : "High contrast disabled",
      description: newValue ? "Enhanced contrast for better readability" : "Returned to normal contrast",
    });
  };

  const toggleReducedMotion = () => {
    const newValue = !reducedMotion;
    setReducedMotion(newValue);
    savePreferences({ reducedMotion: newValue });
    
    toast({
      title: newValue ? "Reduced motion enabled" : "Reduced motion disabled",
      description: newValue ? "Animations minimized" : "Animations restored",
    });
  };

  const toggleSounds = () => {
    const newValue = !soundEnabled;
    setSoundEnabled(newValue);
    savePreferences({ soundEnabled: newValue });
    
    if (newValue) {
      playSound('success');
    }
  };

  const playSound = (type: 'success' | 'error' | 'adjustment') => {
    if (!soundEnabled) return;
    
    // Create audio feedback for actions
    const context = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = context.createOscillator();
    const gainNode = context.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(context.destination);
    
    // Different frequencies for different actions
    const frequencies = {
      success: 880,
      error: 220,
      adjustment: 440
    };
    
    oscillator.frequency.setValueAtTime(frequencies[type], context.currentTime);
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0.1, context.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, context.currentTime + 0.2);
    
    oscillator.start(context.currentTime);
    oscillator.stop(context.currentTime + 0.2);
  };

  const resetToDefaults = () => {
    setFontSize(16);
    setLineHeight(1.6);
    setSoundEnabled(false);
    setReducedMotion(false);
    setHighContrast(false);
    
    localStorage.removeItem('accessibility-prefs');
    applyAccessibilitySettings({});
    
    toast({
      title: "Accessibility settings reset",
      description: "All settings returned to defaults",
    });
  };

  return (
    <>
      {/* Accessibility Button */}
      <Button
        variant="outline"
        size="icon"
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 z-50 shadow-lg"
        aria-label="Open accessibility settings"
      >
        <Settings className="h-4 w-4" />
      </Button>

      {/* Accessibility Panel */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100]" role="dialog" aria-modal="true" aria-labelledby="accessibility-title">
          <Card className="w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 id="accessibility-title" className="text-lg font-semibold">Accessibility Settings</h2>
              <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} aria-label="Close accessibility settings">
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <CardContent className="p-4 space-y-6">
              {/* Font Size */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Type className="h-4 w-4" />
                  <Label htmlFor="font-size">Font Size: {fontSize}px</Label>
                </div>
                <Slider
                  id="font-size"
                  min={12}
                  max={24}
                  step={1}
                  value={[fontSize]}
                  onValueChange={handleFontSizeChange}
                  aria-label="Adjust font size"
                />
              </div>

              {/* Line Height */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Type className="h-4 w-4" />
                  <Label htmlFor="line-height">Line Spacing: {lineHeight}</Label>
                </div>
                <Slider
                  id="line-height"
                  min={1.2}
                  max={2.0}
                  step={0.1}
                  value={[lineHeight]}
                  onValueChange={handleLineHeightChange}
                  aria-label="Adjust line spacing"
                />
              </div>

              {/* High Contrast */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Palette className="h-4 w-4" />
                  <Label htmlFor="high-contrast">High Contrast</Label>
                </div>
                <Switch
                  id="high-contrast"
                  checked={highContrast}
                  onCheckedChange={toggleHighContrast}
                  aria-label="Toggle high contrast mode"
                />
              </div>

              {/* Reduced Motion */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4" />
                  <Label htmlFor="reduced-motion">Reduce Motion</Label>
                </div>
                <Switch
                  id="reduced-motion"
                  checked={reducedMotion}
                  onCheckedChange={toggleReducedMotion}
                  aria-label="Toggle reduced motion"
                />
              </div>

              {/* Sound Feedback */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                  <Label htmlFor="sound-feedback">Sound Feedback</Label>
                </div>
                <Switch
                  id="sound-feedback"
                  checked={soundEnabled}
                  onCheckedChange={toggleSounds}
                  aria-label="Toggle sound feedback"
                />
              </div>

              {/* Reset Button */}
              <Button 
                variant="outline" 
                onClick={resetToDefaults}
                className="w-full"
              >
                Reset to Defaults
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
};

// Enhanced Screen Reader Announcements
export const LiveAnnouncer = ({ message, priority = 'polite' }: { 
  message: string; 
  priority?: 'polite' | 'assertive' 
}) => {
  return (
    <div
      aria-live={priority}
      aria-atomic="true"
      className="sr-only"
      role="status"
    >
      {message}
    </div>
  );
};

// Focus Trap for Modals
export const FocusTrap = ({ children, isActive }: { children: React.ReactNode; isActive: boolean }) => {
  useEffect(() => {
    if (!isActive) return;

    const focusableElements = document.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          lastElement.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === lastElement) {
          firstElement.focus();
          e.preventDefault();
        }
      }
    };

    document.addEventListener('keydown', handleTabKey);
    firstElement?.focus();

    return () => {
      document.removeEventListener('keydown', handleTabKey);
    };
  }, [isActive]);

  return <>{children}</>;
};