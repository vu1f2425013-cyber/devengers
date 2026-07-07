import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Bot, 
  Sparkles, 
  Volume2, 
  VolumeX, 
  AlertTriangle, 
  X, 
  Megaphone, 
  HelpCircle, 
  PhoneCall, 
  Sparkle, 
  Flame, 
  Mic 
} from 'lucide-react';
import { AppView, AppLanguage, Complaint, AccessibilitySettings, CitizenProfile } from './types';
import Header from './components/Header';
import LandingPage from './components/LandingPage';
import AiAssistant from './components/AiAssistant';
import ServicesHub from './components/ServicesHub';
import SchemeEngine from './components/SchemeEngine';
import ComplaintCenter from './components/ComplaintCenter';
import AdminPanel from './components/AdminPanel';
import Dashboard from './components/Dashboard';
import Login from './components/Login';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState<string>('Citizen');
  const [currentView, setCurrentView] = useState<AppView>('landing');
  const [language, setLanguage] = useState<AppLanguage>(() => {
    const saved = localStorage.getItem('smart_language');
    return (saved as AppLanguage) || 'English';
  });
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    return localStorage.getItem('smart_darkMode') === 'true';
  });
  const [accessibility, setAccessibility] = useState<AccessibilitySettings>(() => {
    const saved = localStorage.getItem('smart_accessibility');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // Fallback to default
      }
    }
    return {
      highContrast: false,
      fontSize: 'normal',
      screenReaderActive: false,
      offlineMode: false,
      simpleLanguage: false,
    };
  });

  // Sync Theme, Contrast, and Language states
  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
      localStorage.setItem('smart_darkMode', 'true');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('smart_darkMode', 'false');
    }
  }, [darkMode]);

  useEffect(() => {
    const root = document.documentElement;
    if (accessibility.highContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }
    localStorage.setItem('smart_accessibility', JSON.stringify(accessibility));
  }, [accessibility]);

  useEffect(() => {
    localStorage.setItem('smart_language', language);
  }, [language]);

  const [profile, setProfile] = useState<CitizenProfile>({
    age: 34,
    occupation: "Private Sector Employee",
    income: 320000,
    state: "Delhi NCT",
    education: "Graduate",
    isFarmer: false,
    isStudent: false,
    isSenior: false,
    isBusinessOwner: false,
    gender: "Female",
    isDisabled: false
  });

  // Global notifications (toasts)
  const [notifications, setNotifications] = useState<Array<{ id: string; text: string; type: 'success' | 'info' | 'warning' }>>([]);

  // Subtitle subtitle overlay for Screen Reader voice synthesis
  const [audioSubtitle, setAudioSubtitle] = useState<string | null>(null);
  const [subtitleTimer, setSubtitleTimer] = useState<NodeJS.Timeout | null>(null);

  // Prefilled active civic complaints (demo state)
  const [complaints, setComplaints] = useState<Complaint[]>([
    {
      id: "COM-748912",
      issue: "Deep pothole pockets causing tire skids",
      category: "Road Damage",
      department: "Public Works Department (PWD)",
      priority: "CRITICAL",
      gps: {
        lat: 19.0760,
        lng: 72.8777,
        address: "Sion-Bandra Link Road, Opposite Kalpataru Building, Mumbai, Maharashtra 400017"
      },
      description: "Severe asphalt rupture roughly 1.8 meters in span. Multiple minor skid reports logged. Dispatched to regional engineer.",
      estimatedResolution: "24 Hours",
      status: "Assigned",
      image: "https://images.unsplash.com/photo-1515162305285-0293e4767cc2?auto=format&fit=crop&q=80&w=600",
      createdAt: "06/07/2026 14:12 PM",
      officerName: "Senior Engineer Vikram Deshmukh",
      officerPhone: "+91 98200 45291"
    },
    {
      id: "COM-902183",
      issue: "Broken streetlight lamp post darkness",
      category: "Street Light",
      department: "Brihanmumbai Electric Supply & Transport (BEST)",
      priority: "MEDIUM",
      gps: {
        lat: 19.1120,
        lng: 72.9050,
        address: "Powai Lake Promenade, Opposite Hiranandani Gate, Mumbai, Maharashtra 400076"
      },
      description: "Pole bracket and high-pressure sodium lamp bulb damaged due to tree branch fall. Localized dark corridor.",
      estimatedResolution: "48 Hours",
      status: "Resolved",
      image: "https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?auto=format&fit=crop&q=80&w=600",
      createdAt: "05/07/2026 09:30 AM",
      officerName: "Linesman Sunil Tambe",
      officerPhone: "+91 94220 18239"
    }
  ]);

  // Active Applications (demo state)
  const [applications, setApplications] = useState<any[]>([
    {
      id: "APP-PASSPORT-4091",
      serviceName: "Fresh Indian Passport (Normal Track)",
      applicantName: "Ramesh Kumar Sharma",
      status: "Verified",
      feePaid: "₹1,500",
      urgency: "Normal",
      date: "02/07/2026",
      estimatedDays: "12 Days"
    }
  ]);

  // Saved Verified Documents from scanner
  const [savedDocuments, setSavedDocuments] = useState<any[]>([
    {
      id: "doc-9021",
      name: "Income_Certificate_2026.png",
      docType: "Income Certificate",
      date: "06/07/2026",
      extracted: { name: "Ramesh Kumar Sharma", dob: "15-08-1980" },
      status: "VERIFIED",
      summary: "Tehsildar issued income certificate with family annual income validated at ₹1,80,000."
    }
  ]);

  // Floating speech capsule active
  const [speechModalActive, setSpeechModalActive] = useState(false);
  const [speechStateText, setSpeechStateText] = useState("Click bubble to speak...");

  const addNotification = (text: string, type: 'success' | 'info' | 'warning' = 'info') => {
    const newNotif = { id: `notif-${Date.now()}`, text, type };
    setNotifications(prev => [newNotif, ...prev.slice(0, 4)]);
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  // Browser-native speech synthesis / Accessibility Subtitle bridge
  const handleSpeakText = (text: string) => {
    if (!text) return;
    
    // Set digital subtitle toast
    setAudioSubtitle(text);
    if (subtitleTimer) clearTimeout(subtitleTimer);
    const timer = setTimeout(() => setAudioSubtitle(null), 5500);
    setSubtitleTimer(timer);

    try {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 0.95;
        
        // Attempt to find an Indian English or Hindi voice if possible
        const voices = window.speechSynthesis.getVoices();
        const regionalVoice = voices.find(v => v.lang.includes('IN') || v.lang.includes('hi'));
        if (regionalVoice) utterance.voice = regionalVoice;
        
        window.speechSynthesis.speak(utterance);
      }
    } catch (err) {
      console.warn("Speech Synthesis blocked or unsupported.", err);
    }
  };

  // Floating microphone prompt processor
  const handleStartFloatingSpeech = () => {
    setSpeechStateText("Listening (Continuous regional detection)...");
    handleSpeakText("Listening. Please state your civic request.");
    
    setTimeout(() => {
      setSpeechStateText("Processing your query with Bharat AI...");
    }, 2500);

    setTimeout(() => {
      setSpeechModalActive(false);
      setCurrentView('assistant');
      handleSpeakText("Understood. Displaying recovery guidelines for lost Aadhaar Card.");
      addNotification("Aadhaar Card query routed to AI Assistant!", "success");
    }, 5000);
  };

  // Ensure initial announcement is polite
  useEffect(() => {
    const welcomeText = "Welcome to Smart Bharat. Please choose your citizen role to personalize your AI Civic Companion portal.";
    handleSpeakText(welcomeText);
    addNotification("Smart Bharat Secure Gateway: Personalization Portal Active", "success");
  }, []);

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex flex-col justify-between transition-all duration-300 bg-gov-bg text-gov-text-primary">
        <Login 
          language={language}
          onLogin={(role, defaultProfile) => {
            setIsLoggedIn(true);
            setUserRole(role);
            setProfile(defaultProfile);
            if (role === 'Administrator' || role === 'Govt Officer') {
              setCurrentView('admin');
            } else {
              setCurrentView('landing');
            }
          }}
          onSpeak={handleSpeakText}
          addNotification={addNotification}
        />
        
        {/* Screen Reader Voice subtitle toast overlay */}
        {audioSubtitle && (
          <div className="fixed bottom-6 left-6 max-w-md bg-gov-surface/95 text-gov-text-primary border border-gov-border p-4 rounded-2xl shadow-2xl z-50 flex items-start space-x-3 text-xs leading-relaxed animate-bounce text-left">
            <Volume2 className="w-5 h-5 text-gov-secondary shrink-0 mt-0.5" />
            <div>
              <p className="text-[9px] uppercase font-bold text-gov-text-secondary tracking-wider">Voice Reader Subtitle</p>
              <p className="font-medium mt-0.5 text-gov-text-primary">{audioSubtitle}</p>
            </div>
          </div>
        )}

        {/* Global notification toast center removed per user request */}
      </div>
    );
  }

  return (
    <div className="min-h-screen transition-all duration-300 flex flex-col justify-between bg-gov-bg text-gov-text-primary">
      
      {/* Header component */}
      <Header 
        currentView={currentView}
        setCurrentView={setCurrentView}
        language={language}
        setLanguage={setLanguage}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        accessibility={accessibility}
        setAccessibility={setAccessibility}
        onSpeak={handleSpeakText}
        isLoggedIn={isLoggedIn}
        onLogout={() => {
          setIsLoggedIn(false);
          setCurrentView('landing');
          handleSpeakText("Logged out securely.");
          addNotification("You have been signed out of Smart Bharat", "info");
        }}
      />

      {/* Global alert announcements marquee bar */}
      <div className="bg-gov-primary py-1.5 px-4 text-center text-[10px] sm:text-xs font-medium tracking-wide flex items-center justify-center space-x-2 border-b border-gov-border overflow-hidden text-white">
        <Megaphone className="w-4 h-4 text-orange-400 animate-bounce shrink-0" />
        <span className="truncate">ALERT: Unified DigiLocker credentials and State scholarship windows for 2026-27 are now active on Smart Bharat. Check eligibility!</span>
      </div>

      {/* Main view router canvas */}
      <main className={`flex-grow ${
        accessibility.fontSize === 'large' ? 'text-lg' : accessibility.fontSize === 'xlarge' ? 'text-xl' : 'text-sm'
      }`}>
        <AnimatePresence mode="wait">
          {currentView === 'landing' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <LandingPage 
                setCurrentView={setCurrentView} 
                language={language} 
                onSpeak={handleSpeakText} 
                profile={profile}
                setProfile={setProfile}
                accessibility={accessibility}
              />
            </motion.div>
          )}

          {currentView === 'assistant' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <AiAssistant 
                language={language} 
                accessibility={accessibility} 
                onSpeak={handleSpeakText}
                savedDocuments={savedDocuments}
                addSavedDocument={(doc) => setSavedDocuments(prev => [doc, ...prev])}
              />
            </motion.div>
          )}

          {currentView === 'services' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <ServicesHub 
                language={language} 
                onSpeak={handleSpeakText} 
                addNotification={addNotification}
                applications={applications}
                addApplication={(app) => setApplications(prev => [app, ...prev])}
              />
            </motion.div>
          )}

          {currentView === 'schemes' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <SchemeEngine 
                language={language} 
                onSpeak={handleSpeakText} 
                addNotification={addNotification} 
                profile={profile}
                setProfile={setProfile}
              />
            </motion.div>
          )}

          {currentView === 'complaints' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <ComplaintCenter 
                language={language} 
                onSpeak={handleSpeakText} 
                addNotification={addNotification}
                complaints={complaints}
                addComplaint={(comp) => setComplaints(prev => [comp, ...prev])}
              />
            </motion.div>
          )}

          {currentView === 'dashboard' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <Dashboard 
                complaints={complaints} 
                applications={applications} 
                savedDocuments={savedDocuments} 
                addNotification={addNotification}
                onSpeak={handleSpeakText}
                profile={profile}
                setProfile={setProfile}
              />
            </motion.div>
          )}

          {currentView === 'admin' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <AdminPanel />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Floating speech assistant bubble widget */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={() => {
            setSpeechModalActive(true);
            handleStartFloatingSpeech();
          }}
          className="w-14 h-14 rounded-full bg-gov-secondary hover:bg-gov-primary text-white flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-all group"
          title="Speak with Bharat AI Voice Companion"
        >
          <Bot className="w-7 h-7 text-white animate-pulse" />
          <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-gov-success rounded-full border-2 border-gov-surface" />
        </button>
      </div>

      {/* Speech Interaction overlay dialog modal */}
      {speechModalActive && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-xs">
          <div className="bg-gov-surface border border-gov-border rounded-3xl p-6 max-w-sm w-full space-y-6 text-center shadow-2xl">
            <div className="flex justify-between items-center pb-2 border-b border-gov-border">
              <span className="text-[10px] font-bold uppercase tracking-wider text-gov-text-secondary">Voice Assistant Active</span>
              <button 
                onClick={() => setSpeechModalActive(false)}
                className="text-gov-text-secondary hover:text-gov-text-primary"
              >
                ✕
              </button>
            </div>

            <div className="flex flex-col items-center justify-center space-y-4">
              <div className="w-20 h-20 bg-gov-secondary/10 border border-gov-secondary/20 rounded-full flex items-center justify-center text-gov-secondary animate-pulse">
                <Mic className="w-10 h-10 text-gov-secondary" />
              </div>
              <p className="text-xs text-gov-text-primary font-bold leading-relaxed">
                {speechStateText}
              </p>
            </div>

            <div className="text-[10px] text-gov-text-secondary leading-relaxed bg-gov-bg p-2.5 rounded-xl border border-gov-border">
              Speak clearly: "I lost my Aadhaar Card" or "I want driving license guide."
            </div>
          </div>
        </div>
      )}

      {/* Screen Reader Voice subtitle toast overlay (Accessibility helper) */}
      {audioSubtitle && (
        <div className="fixed bottom-6 left-6 max-w-md bg-gov-surface/95 text-gov-text-primary border border-gov-border p-4 rounded-2xl shadow-2xl z-50 flex items-start space-x-3 text-xs leading-relaxed animate-bounce text-left">
          <Volume2 className="w-5 h-5 text-gov-secondary shrink-0 mt-0.5" />
          <div>
            <p className="text-[9px] uppercase font-bold text-gov-text-secondary tracking-wider">Voice Reader Subtitle</p>
            <p className="font-medium mt-0.5 text-gov-text-primary">{audioSubtitle}</p>
          </div>
        </div>
      )}

      {/* Global notification toast center removed per user request */}

    </div>
  );
}
