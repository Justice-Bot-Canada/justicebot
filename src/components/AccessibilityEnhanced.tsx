import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { 
  Eye, 
  EyeOff, 
  Volume2, 
  VolumeX, 
  Type, 
  Contrast,
  MousePointer,
  Keyboard,
  Settings,
  X
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface AccessibilitySettings {
  fontSize: number;
  highContrast: boolean;
  reducedMotion: boolean;
  largerCursor: boolean;
  screenReaderMode: boolean;
  keyboardNavigation: boolean;
  voiceAnnouncements: boolean;
}

const defaultSettings: AccessibilitySettings = {
  fontSize: 16,
  highContrast: false,
  reducedMotion: false,
  largerCursor: false,
  screenReaderMode: false,
  keyboardNavigation: true,
  voiceAnnouncements: false
};

export const AccessibilityPanel: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [settings, setSettings] = useState<AccessibilitySettings>(defaultSettings);
  const { toast } = useToast();

  // Load settings from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('accessibility-settings');
    if (saved) {
      try {
        const parsedSettings = JSON.parse(saved);
        setSettings({ ...defaultSettings, ...parsedSettings });
        applySettings({ ...defaultSettings, ...parsedSettings });
      } catch (error) {
        console.warn('Failed to parse accessibility settings:', error);
      }
    }
  }, []);

  // Apply settings to document
  const applySettings = (newSettings: AccessibilitySettings) => {
    const root = document.documentElement;
    
    // Font size
    root.style.fontSize = `${newSettings.fontSize}px`;
    
    // High contrast
    if (newSettings.highContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }
    
    // Reduced motion
    if (newSettings.reducedMotion) {
      root.classList.add('reduce-motion');
    } else {
      root.classList.remove('reduce-motion');
    }
    
    // Larger cursor
    if (newSettings.largerCursor) {
      root.classList.add('large-cursor');
    } else {
      root.classList.remove('large-cursor');
    }
    
    // Screen reader mode
    if (newSettings.screenReaderMode) {
      root.classList.add('screen-reader-mode');
    } else {
      root.classList.remove('screen-reader-mode');
    }
    
    // Save to localStorage
    localStorage.setItem('accessibility-settings', JSON.stringify(newSettings));
  };

  const updateSetting = <K extends keyof AccessibilitySettings>(
    key: K,
    value: AccessibilitySettings[K]
  ) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    applySettings(newSettings);
    
    // Announce changes
    announceChange(key, value);
  };

  const announceChange = (setting: keyof AccessibilitySettings, value: any) => {
    if (!settings.voiceAnnouncements) return;
    
    const messages = {
      fontSize: `Font size changed to ${value} pixels`,
      highContrast: `High contrast mode ${value ? 'enabled' : 'disabled'}`,
      reducedMotion: `Reduced motion ${value ? 'enabled' : 'disabled'}`,
      largerCursor: `Large cursor ${value ? 'enabled' : 'disabled'}`,
      screenReaderMode: `Screen reader mode ${value ? 'enabled' : 'disabled'}`,
      keyboardNavigation: `Keyboard navigation ${value ? 'enabled' : 'disabled'}`,
      voiceAnnouncements: `Voice announcements ${value ? 'enabled' : 'disabled'}`
    };
    
    const message = messages[setting];
    if (message) {
      // Create temporary element for screen reader announcement
      const announcement = document.createElement('div');
      announcement.setAttribute('aria-live', 'polite');
      announcement.setAttribute('aria-atomic', 'true');
      announcement.className = 'sr-only';
      announcement.textContent = message;
      document.body.appendChild(announcement);
      
      setTimeout(() => {
        document.body.removeChild(announcement);
      }, 1000);
      
      toast({
        title: "Accessibility Setting Updated",
        description: message,
        duration: 2000
      });
    }
  };

  const resetSettings = () => {
    setSettings(defaultSettings);
    applySettings(defaultSettings);
    toast({
      title: "Settings Reset",
      description: "All accessibility settings have been reset to defaults",
      duration: 3000
    });
  };

  return (
    <>
      {/* Accessibility Button */}
      <Button
        onClick={() => setIsOpen(true)}
        variant="outline"
        size="sm"
        className="fixed bottom-4 right-4 z-50 shadow-lg"
        aria-label="Open accessibility settings"
      >
        <Settings className="w-4 h-4" />
        <span className="sr-only">Accessibility Settings</span>
      </Button>

      {/* Accessibility Panel */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/50 z-50"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />
          
          {/* Panel */}
          <Card className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-md z-50 max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Accessibility Settings</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsOpen(false)}
                  aria-label="Close accessibility settings"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {/* Font Size */}
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <Type className="w-4 h-4" />
                  Font Size: {settings.fontSize}px
                </label>
                <Slider
                  value={[settings.fontSize]}
                  onValueChange={([value]) => updateSetting('fontSize', value)}
                  min={12}
                  max={24}
                  step={1}
                  className="w-full"
                  aria-label="Adjust font size"
                />
              </div>

              <Separator />

              {/* Visual Settings */}
              <div className="space-y-4">
                <h3 className="text-sm font-medium">Visual Settings</h3>
                
                <div className="flex items-center justify-between">
                  <label className="text-sm flex items-center gap-2">
                    <Contrast className="w-4 h-4" />
                    High Contrast Mode
                  </label>
                  <Switch
                    checked={settings.highContrast}
                    onCheckedChange={(checked) => updateSetting('highContrast', checked)}
                    aria-label="Toggle high contrast mode"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <label className="text-sm flex items-center gap-2">
                    <Eye className="w-4 h-4" />
                    Reduce Motion
                  </label>
                  <Switch
                    checked={settings.reducedMotion}
                    onCheckedChange={(checked) => updateSetting('reducedMotion', checked)}
                    aria-label="Toggle reduced motion"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <label className="text-sm flex items-center gap-2">
                    <MousePointer className="w-4 h-4" />
                    Large Cursor
                  </label>
                  <Switch
                    checked={settings.largerCursor}
                    onCheckedChange={(checked) => updateSetting('largerCursor', checked)}
                    aria-label="Toggle large cursor"
                  />
                </div>
              </div>

              <Separator />

              {/* Navigation Settings */}
              <div className="space-y-4">
                <h3 className="text-sm font-medium">Navigation & Audio</h3>
                
                <div className="flex items-center justify-between">
                  <label className="text-sm flex items-center gap-2">
                    <Keyboard className="w-4 h-4" />
                    Enhanced Keyboard Navigation
                  </label>
                  <Switch
                    checked={settings.keyboardNavigation}
                    onCheckedChange={(checked) => updateSetting('keyboardNavigation', checked)}
                    aria-label="Toggle enhanced keyboard navigation"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <label className="text-sm flex items-center gap-2">
                    <Volume2 className="w-4 h-4" />
                    Voice Announcements
                  </label>
                  <Switch
                    checked={settings.voiceAnnouncements}
                    onCheckedChange={(checked) => updateSetting('voiceAnnouncements', checked)}
                    aria-label="Toggle voice announcements"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <label className="text-sm flex items-center gap-2">
                    <EyeOff className="w-4 h-4" />
                    Screen Reader Mode
                  </label>
                  <Switch
                    checked={settings.screenReaderMode}
                    onCheckedChange={(checked) => updateSetting('screenReaderMode', checked)}
                    aria-label="Toggle screen reader optimizations"
                  />
                </div>
              </div>

              <Separator />

              {/* Reset Button */}
              <Button
                onClick={resetSettings}
                variant="outline"
                className="w-full"
                aria-label="Reset all accessibility settings to defaults"
              >
                Reset to Defaults
              </Button>

              {/* Info */}
              <p className="text-xs text-muted-foreground">
                These settings are saved in your browser and will persist across sessions.
              </p>
            </CardContent>
          </Card>
        </>
      )}
    </>
  );
};