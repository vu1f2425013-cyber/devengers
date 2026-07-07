import React, { useState } from 'react';
import { 
  Home, 
  Bot, 
  LayoutGrid, 
  Award, 
  AlertTriangle, 
  User, 
  ShieldAlert, 
  Globe, 
  Eye, 
  Volume2, 
  Settings, 
  Sun, 
  Moon, 
  Sliders, 
  Sparkles, 
  Flame, 
  VolumeX, 
  BookOpen, 
  WifiOff 
} from 'lucide-react';
import { AppView, AppLanguage, AccessibilitySettings } from '../types';
import { getTranslation } from '../lib/translations';

interface HeaderProps {
  currentView: AppView;
  setCurrentView: (view: AppView) => void;
  language: AppLanguage;
  setLanguage: (lang: AppLanguage) => void;
  darkMode: boolean;
  setDarkMode: (dark: boolean) => void;
  accessibility: AccessibilitySettings;
  setAccessibility: React.Dispatch<React.SetStateAction<AccessibilitySettings>>;
  onSpeak: (text: string) => void;
  isLoggedIn?: boolean;
  onLogout?: () => void;
}

const languages: { code: AppLanguage; label: string; native: string }[] = [
  { code: 'English', label: 'English', native: 'English' },
  { code: 'Hindi', label: 'Hindi', native: 'हिन्दी' },
  { code: 'Marathi', label: 'Marathi', native: 'मराठी' },
  { code: 'Tamil', label: 'Tamil', native: 'தமிழ்' },
  { code: 'Gujarati', label: 'Gujarati', native: 'ગુજરાતી' },
];

export default function Header({
  currentView,
  setCurrentView,
  language,
  setLanguage,
  darkMode,
  setDarkMode,
  accessibility,
  setAccessibility,
  onSpeak,
  isLoggedIn,
  onLogout
}: HeaderProps) {
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [accessPanelOpen, setAccessPanelOpen] = useState(false);

  const toggleHighContrast = () => {
    const updated = { ...accessibility, highContrast: !accessibility.highContrast };
    setAccessibility(updated);
    onSpeak(updated.highContrast ? "High Contrast Enabled" : "High Contrast Disabled");
  };

  const cycleFontSize = () => {
    let next: 'normal' | 'large' | 'xlarge' = 'normal';
    if (accessibility.fontSize === 'normal') next = 'large';
    else if (accessibility.fontSize === 'large') next = 'xlarge';
    
    const updated = { ...accessibility, fontSize: next };
    setAccessibility(updated);
    onSpeak(`Font size set to ${next}`);
  };

  const toggleScreenReader = () => {
    const updated = { ...accessibility, screenReaderActive: !accessibility.screenReaderActive };
    setAccessibility(updated);
    onSpeak(updated.screenReaderActive ? "Screen Reader Enabled" : "Screen Reader Disabled");
  };

  const toggleOfflineMode = () => {
    const updated = { ...accessibility, offlineMode: !accessibility.offlineMode };
    setAccessibility(updated);
    onSpeak(updated.offlineMode ? "Offline Mode Enabled" : "Online Mode Restored");
  };

  const toggleSimpleLanguage = () => {
    const updated = { ...accessibility, simpleLanguage: !accessibility.simpleLanguage };
    setAccessibility(updated);
    onSpeak(updated.simpleLanguage ? "Simple Language active" : "Standard language active");
  };

  return (
    <header className="sticky top-0 z-50 bg-gov-surface/95 text-gov-text-primary backdrop-blur-md border-b border-gov-border transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo Brand */}
          <div 
            onClick={() => setCurrentView('landing')} 
            className="flex items-center space-x-3 cursor-pointer group"
          >
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-gov-saffron via-white to-gov-success p-[2px] shadow-sm">
              <div className="flex items-center justify-center w-full h-full bg-gov-primary rounded-[10px]">
                <Sparkles className="w-5 h-5 text-gov-saffron group-hover:scale-110 transition-transform duration-300" />
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-extrabold text-lg tracking-tight text-gov-primary">
                  {getTranslation('brand_name', language).split(' ')[0]} <span className="text-gov-saffron">{getTranslation('brand_name', language).split(' ')[1] || 'BHARAT'}</span>
                </span>
                <span className="px-1.5 py-0.2 text-[9px] font-bold bg-gov-secondary/10 text-gov-secondary border border-gov-secondary/20 rounded-sm">
                  AI v3.5
                </span>
              </div>
              <p className="text-[9px] font-semibold text-gov-text-secondary tracking-wider text-left uppercase">{getTranslation('brand_subtitle', language)}</p>
            </div>
          </div>

          {/* Core Navigation Links */}
          <nav className="hidden md:flex space-x-1">
            <button
              onClick={() => { setCurrentView('landing'); onSpeak("Navigating to Home"); }}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${
                currentView === 'landing' 
                  ? 'bg-gov-saffron/10 text-gov-primary border-b-2 border-gov-saffron shadow-xs' 
                  : 'text-gov-text-secondary hover:bg-gov-bg hover:text-gov-text-primary'
              }`}
            >
              <Home className="w-4 h-4 text-gov-saffron" />
              <span>{getTranslation('nav_home', language)}</span>
            </button>

            <button
              onClick={() => { setCurrentView('assistant'); onSpeak("Navigating to AI Assistant"); }}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${
                currentView === 'assistant' 
                  ? 'bg-gov-secondary/10 text-gov-primary border-b-2 border-gov-secondary shadow-xs' 
                  : 'text-gov-text-secondary hover:bg-gov-bg hover:text-gov-text-primary'
              }`}
            >
              <Bot className="w-4 h-4 text-gov-secondary animate-pulse" />
              <span>{getTranslation('nav_assistant', language)}</span>
            </button>

            <button
              onClick={() => { setCurrentView('services'); onSpeak("Navigating to Government Services Hub"); }}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${
                currentView === 'services' 
                  ? 'bg-gov-secondary/10 text-gov-primary border-b-2 border-gov-secondary shadow-xs' 
                  : 'text-gov-text-secondary hover:bg-gov-bg hover:text-gov-text-primary'
              }`}
            >
              <LayoutGrid className="w-4 h-4 text-gov-secondary" />
              <span>{getTranslation('nav_services', language)}</span>
            </button>

            <button
              onClick={() => { setCurrentView('schemes'); onSpeak("Navigating to AI Schemes Engine"); }}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${
                currentView === 'schemes' 
                  ? 'bg-gov-saffron/10 text-gov-primary border-b-2 border-gov-saffron shadow-xs' 
                  : 'text-gov-text-secondary hover:bg-gov-bg hover:text-gov-text-primary'
              }`}
            >
              <Award className="w-4 h-4 text-gov-saffron" />
              <span>{getTranslation('nav_schemes', language)}</span>
            </button>

            <button
              onClick={() => { setCurrentView('complaints'); onSpeak("Navigating to Smart Complaint Desk"); }}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${
                currentView === 'complaints' 
                  ? 'bg-gov-success/10 text-gov-primary border-b-2 border-gov-success shadow-xs' 
                  : 'text-gov-text-secondary hover:bg-gov-bg hover:text-gov-text-primary'
              }`}
            >
              <AlertTriangle className="w-4 h-4 text-gov-success" />
              <span>{getTranslation('nav_complaints', language)}</span>
            </button>

            <button
              onClick={() => { setCurrentView('dashboard'); onSpeak("Navigating to Citizen Dashboard"); }}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${
                currentView === 'dashboard' 
                  ? 'bg-gov-secondary/10 text-gov-primary border-b-2 border-gov-secondary shadow-xs' 
                  : 'text-gov-text-secondary hover:bg-gov-bg hover:text-gov-text-primary'
              }`}
            >
              <User className="w-4 h-4 text-gov-secondary" />
              <span>{getTranslation('nav_dashboard', language)}</span>
            </button>

            <button
              onClick={() => { setCurrentView('admin'); onSpeak("Navigating to Admin Portal"); }}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${
                currentView === 'admin' 
                  ? 'bg-gov-error/10 text-gov-primary border-b-2 border-gov-error shadow-xs' 
                  : 'text-gov-text-secondary hover:bg-gov-bg hover:text-gov-text-primary'
              }`}
            >
              <ShieldAlert className="w-4 h-4 text-gov-error" />
              <span>{getTranslation('nav_admin', language)}</span>
            </button>
          </nav>

          {/* Quick Actions Panel (Accessibility, Language, Mode, etc.) */}
          <div className="flex items-center space-x-2">
            
            {/* Accessibility Drawer Toggle */}
            <button
              onClick={() => { setAccessPanelOpen(!accessPanelOpen); onSpeak("Opening Accessibility Settings"); }}
              className={`p-2 rounded-lg hover:bg-gov-bg transition-colors ${accessPanelOpen ? 'bg-gov-secondary/10 text-gov-secondary' : 'text-gov-text-secondary'}`}
              title="Accessibility & Inclusion Tools"
              aria-label="Accessibility settings"
            >
              <Eye className="w-5 h-5 text-gov-secondary" />
            </button>

            {/* Language Selection Switcher */}
            <div className="relative">
              <button
                onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                className="flex items-center space-x-1 px-2.5 py-1.5 rounded-lg bg-gov-surface hover:bg-gov-bg text-xs font-semibold text-gov-text-primary transition-all border border-gov-border"
                title="Select Preferred Language"
              >
                <Globe className="w-4 h-4 text-gov-success" />
                <span className="hidden sm:inline text-xs">{language}</span>
              </button>
              
              {langDropdownOpen && (
                <div className="absolute right-0 mt-2 w-52 bg-gov-surface border border-gov-border rounded-xl shadow-2xl overflow-hidden z-50">
                  <div className="px-3 py-2 border-b border-gov-border bg-gov-bg">
                    <span className="text-[10px] uppercase font-bold text-gov-text-secondary tracking-wider">Choose Language</span>
                  </div>
                  <div className="max-h-64 overflow-y-auto divide-y divide-gov-border scrollbar-thin scrollbar-thumb-gov-border">
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => {
                          setLanguage(lang.code);
                          setLangDropdownOpen(false);
                          onSpeak(`Language set to ${lang.label}`);
                        }}
                        className={`w-full text-left px-4 py-2.5 text-xs flex items-center justify-between transition-colors ${
                          language === lang.code ? 'bg-gov-primary/10 text-gov-primary font-bold' : 'text-gov-text-primary hover:bg-gov-bg'
                        }`}
                      >
                        <span>{lang.label}</span>
                        <span className="text-gov-text-secondary text-[10px] font-mono font-medium">{lang.native}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Theme Toggle (Light/Dark Switcher) */}
            <button
              onClick={() => {
                setDarkMode(!darkMode);
                onSpeak(darkMode ? "Switching to Light Mode" : "Switching to Dark Mode");
              }}
              className="p-2 rounded-lg bg-gov-surface hover:bg-gov-bg text-gov-text-primary border border-gov-border transition-all"
              title="Toggle Dark/Light Mode"
            >
              {darkMode ? <Sun className="w-4 h-4 text-gov-saffron" /> : <Moon className="w-4 h-4 text-gov-primary" />}
            </button>

            {isLoggedIn && onLogout && (
              <button
                onClick={onLogout}
                className="flex items-center space-x-1 px-3 py-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 transition-all font-bold text-xs cursor-pointer"
                title="Secure Log Out"
              >
                Logout
              </button>
            )}

          </div>
        </div>
      </div>

      {/* Accessibility Settings Toolbar Panel */}
      {accessPanelOpen && (
        <div className="bg-gov-bg border-t border-gov-border px-4 py-3 sm:px-6 transition-all duration-300">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div className="flex items-center space-x-2 text-gov-primary">
              <Sliders className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-wider text-gov-text-secondary">{getTranslation('access_title', language)}</span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              
              {/* Screen Reader Voicing Toggle */}
              <button
                onClick={toggleScreenReader}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors border ${
                  accessibility.screenReaderActive 
                    ? 'bg-gov-primary text-white border-gov-primary shadow-xs' 
                    : 'bg-gov-surface text-gov-text-primary border-gov-border hover:bg-gov-bg'
                }`}
                title="Reads elements and assistant replies aloud"
              >
                {accessibility.screenReaderActive ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
                <span>{getTranslation('access_screen_reader', language)} {accessibility.screenReaderActive ? "ON" : "OFF"}</span>
              </button>

              {/* High Contrast Toggle */}
              <button
                onClick={toggleHighContrast}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors border ${
                  accessibility.highContrast 
                    ? 'bg-gov-warning text-white border-gov-warning shadow-xs' 
                    : 'bg-gov-surface text-gov-text-primary border-gov-border hover:bg-gov-bg'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>{getTranslation('access_contrast', language)} {accessibility.highContrast ? "Active" : "Standard"}</span>
              </button>

              {/* Text Zoom Control */}
              <button
                onClick={cycleFontSize}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-gov-surface text-gov-text-primary border border-gov-border hover:bg-gov-bg transition-colors"
              >
                <Sliders className="w-3.5 h-3.5 text-gov-secondary" />
                <span className="capitalize">{getTranslation('access_font', language)}: {accessibility.fontSize}</span>
              </button>

              {/* Simple Language Translation Switcher */}
              <button
                onClick={toggleSimpleLanguage}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors border ${
                  accessibility.simpleLanguage 
                    ? 'bg-gov-saffron text-gov-primary border-gov-saffron shadow-xs' 
                    : 'bg-gov-surface text-gov-text-primary border-gov-border hover:bg-gov-bg'
                }`}
                title="Translates complex rules into basic 5th-grade level terms"
              >
                <BookOpen className="w-3.5 h-3.5 text-gov-saffron" />
                <span>{getTranslation('access_simple', language)} {accessibility.simpleLanguage ? "ON" : "OFF"}</span>
              </button>

              {/* Offline/Low Internet Mode */}
              <button
                onClick={toggleOfflineMode}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors border ${
                  accessibility.offlineMode 
                    ? 'bg-gov-error text-white border-gov-error shadow-xs' 
                    : 'bg-gov-surface text-gov-text-primary border-gov-border hover:bg-gov-bg'
                }`}
                title="Disables image and maps loading for extremely poor/2G networks"
              >
                <WifiOff className="w-3.5 h-3.5" />
                <span>{getTranslation('access_offline', language)} {accessibility.offlineMode ? "Active" : "Normal"}</span>
              </button>

            </div>
          </div>
        </div>
      )}

      {/* Mobile Sticky Navigation Tab Bar */}
      <div className="md:hidden flex justify-around border-t border-gov-border bg-gov-surface py-2 text-gov-text-secondary text-xs">
        <button 
          onClick={() => { setCurrentView('landing'); onSpeak("Home"); }} 
          className={`flex flex-col items-center space-y-0.5 ${currentView === 'landing' ? 'text-gov-saffron font-bold' : ''}`}
        >
          <Home className="w-4.5 h-4.5" />
          <span className="text-[10px]">{getTranslation('nav_home', language).split(' ')[0]}</span>
        </button>
        <button 
          onClick={() => { setCurrentView('assistant'); onSpeak("AI Assistant"); }} 
          className={`flex flex-col items-center space-y-0.5 ${currentView === 'assistant' ? 'text-gov-secondary font-bold' : ''}`}
        >
          <Bot className="w-4.5 h-4.5 animate-pulse" />
          <span className="text-[10px]">{getTranslation('nav_assistant', language).split(' ')[0]}</span>
        </button>
        <button 
          onClick={() => { setCurrentView('services'); onSpeak("Services"); }} 
          className={`flex flex-col items-center space-y-0.5 ${currentView === 'services' ? 'text-gov-secondary font-bold' : ''}`}
        >
          <LayoutGrid className="w-4.5 h-4.5" />
          <span className="text-[10px]">{getTranslation('nav_services', language).split(' ')[0]}</span>
        </button>
        <button 
          onClick={() => { setCurrentView('schemes'); onSpeak("Matcher"); }} 
          className={`flex flex-col items-center space-y-0.5 ${currentView === 'schemes' ? 'text-gov-saffron font-bold' : ''}`}
        >
          <Award className="w-4.5 h-4.5" />
          <span className="text-[10px]">{getTranslation('nav_schemes', language).split(' ')[0]}</span>
        </button>
        <button 
          onClick={() => { setCurrentView('complaints'); onSpeak("Complaints"); }} 
          className={`flex flex-col items-center space-y-0.5 ${currentView === 'complaints' ? 'text-gov-success font-bold' : ''}`}
        >
          <AlertTriangle className="w-4.5 h-4.5" />
          <span className="text-[10px]">{getTranslation('nav_complaints', language).split(' ')[0]}</span>
        </button>
      </div>

    </header>
  );
}
