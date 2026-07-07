import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  GraduationCap, 
  Sprout, 
  User, 
  Heart, 
  Briefcase, 
  Building2, 
  ShieldAlert, 
  Eye, 
  EyeOff, 
  Lock, 
  Sparkles, 
  Check, 
  Smartphone, 
  Globe, 
  Shield, 
  QrCode, 
  HelpCircle, 
  CheckCircle,
  FileCheck2,
  Bot,
  AlertTriangle,
  Award,
  BookOpen,
  Volume2,
  LockKeyhole,
  Info
} from 'lucide-react';
import { CitizenProfile, AppLanguage } from '../types';

interface LoginProps {
  language: AppLanguage;
  onLogin: (role: string, customProfile: CitizenProfile) => void;
  onSpeak: (text: string) => void;
  addNotification: (text: string, type: 'success' | 'info' | 'warning') => void;
}

const rolesList = [
  {
    id: "student",
    title: "Student",
    icon: GraduationCap,
    description: "Access national scholarships, exam guides, and digital skill grants.",
    color: "from-blue-500/10 to-blue-600/10 hover:border-blue-400",
    borderColor: "border-blue-100",
    accentColor: "text-blue-600",
    defaultProfile: {
      age: 21,
      occupation: "Student",
      income: 35000,
      state: "Maharashtra",
      education: "Graduate",
      isStudent: true,
      isFarmer: false,
      isSenior: false,
      isBusinessOwner: false,
      gender: "Female",
      isDisabled: false
    }
  },
  {
    id: "farmer",
    title: "Farmer",
    icon: Sprout,
    description: "Claim crop benefits, equipment subsidies, and weather advisories.",
    color: "from-gov-success/10 to-emerald-600/10 hover:border-gov-success/40",
    borderColor: "border-emerald-100",
    accentColor: "text-gov-success",
    defaultProfile: {
      age: 45,
      occupation: "Farmer / Agriculturalist",
      income: 120000,
      state: "Uttar Pradesh",
      education: "Primary Education",
      isStudent: false,
      isFarmer: true,
      isSenior: false,
      isBusinessOwner: false,
      gender: "Male",
      isDisabled: false
    }
  },
  {
    id: "citizen",
    title: "Citizen",
    icon: User,
    description: "Apply for passports, UIDAI cards, power connections, and report city issues.",
    color: "from-slate-500/10 to-slate-600/10 hover:border-slate-400",
    borderColor: "border-slate-100",
    accentColor: "text-slate-700",
    defaultProfile: {
      age: 34,
      occupation: "Private Sector Employee",
      income: 320000,
      state: "Delhi NCT",
      education: "Graduate",
      isStudent: false,
      isFarmer: false,
      isSenior: false,
      isBusinessOwner: false,
      gender: "Female",
      isDisabled: false
    }
  },
  {
    id: "senior",
    title: "Senior Citizen",
    icon: Heart,
    description: "Check pension status, premium health cards, and transit concessions.",
    color: "from-pink-500/10 to-rose-600/10 hover:border-rose-400",
    borderColor: "border-rose-100",
    accentColor: "text-rose-600",
    defaultProfile: {
      age: 67,
      occupation: "Retired / Pensioner",
      income: 180000,
      state: "Kerala",
      education: "Secondary Education",
      isStudent: false,
      isFarmer: false,
      isSenior: true,
      isBusinessOwner: false,
      gender: "Male",
      isDisabled: false
    }
  },
  {
    id: "entrepreneur",
    title: "Entrepreneur",
    icon: Briefcase,
    description: "Explore MSME business loans, tax registrations, and trade licenses.",
    color: "from-amber-500/10 to-gov-saffron/10 hover:border-gov-saffron/40",
    borderColor: "border-amber-100",
    accentColor: "text-gov-saffron",
    defaultProfile: {
      age: 29,
      occupation: "Small Business Owner / Shopkeeper",
      income: 550000,
      state: "Gujarat",
      education: "Graduate",
      isStudent: false,
      isFarmer: false,
      isSenior: false,
      isBusinessOwner: true,
      gender: "Male",
      isDisabled: false
    }
  },
  {
    id: "officer",
    title: "Govt Officer",
    icon: Building2,
    description: "Moderate citizen dockets, review regional complaints, and check SLAs.",
    color: "from-indigo-500/10 to-indigo-600/10 hover:border-indigo-400",
    borderColor: "border-indigo-100",
    accentColor: "text-indigo-600",
    defaultProfile: {
      age: 48,
      occupation: "Government Employee",
      income: 850000,
      state: "Delhi NCT",
      education: "Post Graduate",
      isStudent: false,
      isFarmer: false,
      isSenior: false,
      isBusinessOwner: false,
      gender: "Female",
      isDisabled: false
    }
  },
  {
    id: "admin",
    title: "Administrator",
    icon: ShieldAlert,
    description: "Oversee system health dashboards, AI classifier models, and active databases.",
    color: "from-red-500/10 to-red-600/10 hover:border-red-400",
    borderColor: "border-red-100",
    accentColor: "text-red-600",
    defaultProfile: {
      age: 42,
      occupation: "System Administrator",
      income: 1200000,
      state: "Maharashtra",
      education: "Post Graduate",
      isStudent: false,
      isFarmer: false,
      isSenior: false,
      isBusinessOwner: false,
      gender: "Male",
      isDisabled: false
    }
  }
];

const quickFeaturesList = [
  { icon: Bot, title: "AI Assistant", desc: "Interactive GPT-class companion" },
  { icon: Award, title: "Govt Schemes", desc: "Direct eligibility checking" },
  { icon: AlertTriangle, title: "Grievance Tracker", desc: "Map-based tracking & updates" },
  { icon: FileCheck2, title: "AI Doc Scan", desc: "Instant OCR key-data extraction" },
  { icon: Globe, title: "Multi-Language", desc: "Available in 10 major languages" },
  { icon: Volume2, title: "Voice Portal", desc: "Speaks guidelines back in regional tones" }
];

export default function Login({
  language,
  onLogin,
  onSpeak,
  addNotification
}: LoginProps) {
  const [selectedRoleId, setSelectedRoleId] = useState<string>("citizen");
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [authMethod, setAuthMethod] = useState<'password' | 'otp' | 'digilocker'>('password');
  const [otpSent, setOtpSent] = useState(false);
  const [otpVal, setOtpVal] = useState("");

  const handleRoleSelect = (roleId: string, title: string) => {
    setSelectedRoleId(roleId);
    onSpeak(`Selected role: ${title}. The citizen dashboard will automatically personalize for you.`);
    addNotification(`Optimized profile for ${title} selected`, 'info');
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const activeRole = rolesList.find(r => r.id === selectedRoleId);
    if (!activeRole) return;

    onSpeak(`Verifying secure credentials for ${activeRole.title}.`);

    setTimeout(() => {
      setLoading(false);
      onLogin(activeRole.title, activeRole.defaultProfile);
      addNotification(`Securely logged in as ${activeRole.title}! Dashboard initialized.`, 'success');
      onSpeak(`Welcome back to Smart Bharat. Authorized as ${activeRole.title}.`);
    }, 1500);
  };

  const handleSendOtp = () => {
    if (!identifier) {
      addNotification("Please enter your Mobile Number first", "warning");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setOtpSent(true);
      onSpeak("OTP sent successfully to your registered mobile.");
      addNotification("6-digit verification code dispatched via secure SMS", "info");
    }, 1000);
  };

  const handleDigiLockerMock = () => {
    setLoading(true);
    onSpeak("Connecting with national DigiLocker secure portal");
    setTimeout(() => {
      setLoading(false);
      const activeRole = rolesList.find(r => r.id === selectedRoleId);
      if (activeRole) {
        onLogin(activeRole.title, activeRole.defaultProfile);
        addNotification("Linked successfully with secure DigiLocker! Profile fetched.", "success");
      }
    }, 2000);
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-gov-bg">
      
      {/* LEFT COLUMN: 40% branding, illustration, and stats */}
      <div className="hidden lg:flex lg:w-[40%] bg-gov-primary flex-col justify-between p-10 text-white relative overflow-hidden border-r border-gov-border">
        
        {/* Ashoka Chakra background watermark */}
        <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full border-4 border-white/5 opacity-10 flex items-center justify-center p-6 select-none pointer-events-none">
          <div className="w-full h-full rounded-full border-2 border-dotted border-white/20 animate-spin-slow" />
        </div>

        {/* Dynamic connection overlay lines */}
        <div className="absolute top-1/4 right-0 w-44 h-44 bg-gov-saffron/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 left-1/4 w-36 h-36 bg-gov-success/10 rounded-full blur-3xl pointer-events-none" />

        {/* Left Side Header */}
        <div className="space-y-6 z-10 text-left">
          <div className="flex items-center space-x-3.5">
            <div className="relative flex items-center justify-center w-11 h-11 rounded-2xl bg-gradient-to-tr from-gov-saffron via-white to-gov-success p-[2px] shadow-md">
              <div className="flex items-center justify-center w-full h-full bg-gov-primary rounded-[14px]">
                <Sparkles className="w-6.5 h-6.5 text-gov-saffron" />
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="font-extrabold text-xl tracking-tight text-white uppercase">
                  SMART <span className="text-gov-saffron">BHARAT</span>
                </h1>
                <span className="px-1.5 py-0.5 text-[9px] font-bold bg-white/10 text-gov-saffron border border-white/10 rounded">
                  PROTOTYPE
                </span>
              </div>
              <p className="text-[10px] font-bold text-slate-300 tracking-wider uppercase">
                Digital Identity & Civic Companion
              </p>
            </div>
          </div>

          <div className="space-y-3 pt-4">
            <span className="text-gov-saffron text-xs font-black uppercase tracking-widest block">
              Ministry of Electronics & IT Initiative
            </span>
            <h2 className="text-3xl font-black tracking-tight text-white leading-tight">
              One Nation.<br />One AI Assistant.<br />Every Government Service.
            </h2>
            <p className="text-slate-300 text-sm leading-relaxed max-w-sm">
              Empowering 1.4 Billion citizens with intelligent, direct, and multi-lingual access to welfare policies, civil registries, and instant grievance resolution.
            </p>
          </div>
        </div>

        {/* AI Connection Interactive Map / Illustration (CSS representation) */}
        <div className="my-8 relative h-48 bg-white/5 rounded-2xl border border-white/10 p-5 flex items-center justify-center overflow-hidden z-10 backdrop-blur-md">
          
          {/* Glowing central core representing Bharat AI */}
          <div className="relative flex items-center justify-center w-16 h-16 bg-gradient-to-tr from-gov-saffron via-white to-gov-success p-0.5 rounded-full shadow-lg shadow-white/10">
            <div className="w-full h-full bg-gov-primary rounded-full flex items-center justify-center">
              <Bot className="w-7 h-7 text-white animate-pulse" />
            </div>
            {/* Spinning decorative dot path */}
            <div className="absolute inset-0 border border-dashed border-white/30 rounded-full animate-spin-slow scale-150" />
          </div>

          {/* Connected citizen profile nodes with pulsing indicator */}
          <div className="absolute top-6 left-12 flex flex-col items-center">
            <div className="w-8 h-8 rounded-full bg-blue-500/20 border border-blue-400 flex items-center justify-center text-blue-300 shadow-sm text-xs" title="Student">
              🎓
            </div>
            <span className="text-[9px] font-semibold text-slate-300 mt-1">Student</span>
          </div>

          <div className="absolute bottom-6 left-10 flex flex-col items-center">
            <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-400 flex items-center justify-center text-emerald-300 shadow-sm text-xs" title="Farmer">
              🌾
            </div>
            <span className="text-[9px] font-semibold text-slate-300 mt-1">Farmer</span>
          </div>

          <div className="absolute top-5 right-12 flex flex-col items-center">
            <div className="w-8 h-8 rounded-full bg-amber-500/20 border border-amber-400 flex items-center justify-center text-amber-300 shadow-sm text-xs" title="Entrepreneur">
              💼
            </div>
            <span className="text-[9px] font-semibold text-slate-300 mt-1">MSME</span>
          </div>

          <div className="absolute bottom-6 right-10 flex flex-col items-center">
            <div className="w-8 h-8 rounded-full bg-rose-500/20 border border-rose-400 flex items-center justify-center text-rose-300 shadow-sm text-xs" title="Senior Citizen">
              👴
            </div>
            <span className="text-[9px] font-semibold text-slate-300 mt-1">Senior</span>
          </div>

          <div className="absolute top-20 right-4 flex flex-col items-center">
            <div className="w-7 h-7 rounded-full bg-indigo-500/20 border border-indigo-400 flex items-center justify-center text-indigo-300 shadow-sm text-[10px]" title="Officer">
              🏛
            </div>
          </div>

          <div className="absolute top-20 left-4 flex flex-col items-center">
            <div className="w-7 h-7 rounded-full bg-slate-500/20 border border-slate-400 flex items-center justify-center text-slate-300 shadow-sm text-[10px]" title="Citizen">
              👩
            </div>
          </div>

          {/* Dotted lines rendering via SVG overlay */}
          <svg className="absolute inset-0 w-full h-full text-white/15" fill="none" viewBox="0 0 300 200">
            <line x1="50" y1="40" x2="150" y2="100" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" />
            <line x1="50" y1="160" x2="150" y2="100" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" />
            <line x1="250" y1="40" x2="150" y2="100" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" />
            <line x1="250" y1="160" x2="150" y2="100" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" />
            <line x1="25" y1="100" x2="150" y2="100" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" />
            <line x1="275" y1="100" x2="150" y2="100" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" />
          </svg>

        </div>

        {/* Small statistics card layout */}
        <div className="grid grid-cols-2 gap-4 border-t border-white/10 pt-6 z-10 text-left">
          <div className="space-y-0.5">
            <p className="text-[9px] text-gov-saffron font-extrabold uppercase tracking-widest">Welfare Access</p>
            <p className="text-lg font-black text-white">100+ Services</p>
            <p className="text-[10px] text-slate-400 font-semibold">Digitized Central dockets</p>
          </div>
          <div className="space-y-0.5">
            <p className="text-[9px] text-gov-success font-extrabold uppercase tracking-widest font-mono">Response Rate</p>
            <p className="text-lg font-black text-white">24×7 Active AI</p>
            <p className="text-[10px] text-slate-400 font-semibold">Instant diagnostic sorting</p>
          </div>
          <div className="space-y-0.5">
            <p className="text-[9px] text-blue-400 font-extrabold uppercase tracking-widest">Inclusion</p>
            <p className="text-lg font-black text-white">Multilingual</p>
            <p className="text-[10px] text-slate-400 font-semibold">Voice in 10 major tongues</p>
          </div>
          <div className="space-y-0.5">
            <p className="text-[9px] text-pink-400 font-extrabold uppercase tracking-widest">Encryption</p>
            <p className="text-lg font-black text-white">Secure & Trusted</p>
            <p className="text-[10px] text-slate-400 font-semibold">Authorized citizen vault</p>
          </div>
        </div>

      </div>

      {/* RIGHT COLUMN: 60% Login form card & role selectors */}
      <div className="w-full lg:w-[60%] flex flex-col justify-between p-4 sm:p-10 md:p-12 overflow-y-auto">
        
        {/* Top bar with language and accessibility reminders */}
        <div className="flex justify-between items-center mb-8 border-b border-gov-border pb-3.5 text-left">
          <div className="flex items-center space-x-2 text-gov-primary">
            <Shield className="w-4 h-4 text-gov-secondary shrink-0" />
            <span className="text-[10px] font-black uppercase tracking-wider text-gov-text-secondary">
              National Informatics Standards (Proto)
            </span>
          </div>
          <div className="flex items-center space-x-1 text-gov-success text-[10px] font-bold">
            <span className="w-2 h-2 rounded-full bg-gov-success animate-ping shrink-0" />
            <span>AES-256 SSL Encrypted</span>
          </div>
        </div>

        {/* Central Auth Container Card */}
        <div className="max-w-2xl w-full mx-auto bg-gov-surface border border-gov-border rounded-3xl p-6 md:p-8 shadow-xl space-y-8 text-left">
          
          {/* Header */}
          <div className="space-y-2 border-b border-gov-border pb-4">
            <div className="flex items-center space-x-2 text-gov-primary sm:hidden">
              <Sparkles className="w-5 h-5 text-gov-saffron animate-pulse" />
              <span className="font-extrabold text-sm uppercase">Smart Bharat AI</span>
            </div>
            <h2 className="text-2xl font-black text-gov-primary tracking-tight">Welcome Back</h2>
            <p className="text-xs text-gov-text-secondary font-semibold">
              Sign in to access India's AI-Powered Civic Companion
            </p>
          </div>

          {/* ROLE SELECTION CARDS ROW */}
          <div className="space-y-3.5">
            <div className="flex items-center justify-between">
              <label className="text-[10px] text-gov-text-secondary font-black uppercase tracking-wider">
                1. SELECT YOUR CITIZEN ROLE (FOR INSTANT PERSONALIZATION)
              </label>
              <span className="text-[9px] bg-gov-saffron/10 text-gov-primary border border-gov-saffron/20 px-2 py-0.5 rounded font-bold uppercase">
                AI Driven Layout
              </span>
            </div>

            {/* Horizontal or Grid scroll selection */}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5">
              {rolesList.map((role) => {
                const IconComp = role.icon;
                const isSelected = selectedRoleId === role.id;
                return (
                  <button
                    key={role.id}
                    type="button"
                    onClick={() => handleRoleSelect(role.id, role.title)}
                    className={`p-3 rounded-2xl border text-center flex flex-col items-center justify-between transition-all cursor-pointer relative h-28 ${role.color} ${role.borderColor} ${
                      isSelected 
                        ? 'border-gov-secondary shadow-md scale-105 bg-white ring-2 ring-gov-secondary/20 z-10' 
                        : 'bg-gov-bg/40 opacity-75 hover:opacity-100 hover:scale-[1.02]'
                    }`}
                  >
                    {/* Active Check overlay badge */}
                    {isSelected && (
                      <div className="absolute top-1 right-1 w-3.5 h-3.5 bg-gov-success text-white rounded-full flex items-center justify-center p-0.5 shadow-xs">
                        <Check className="w-2.5 h-2.5 stroke-[3]" />
                      </div>
                    )}

                    <div className={`p-1.5 rounded-xl bg-white border border-gov-border shadow-xs ${role.accentColor}`}>
                      <IconComp className="w-5 h-5" />
                    </div>

                    <div className="space-y-0.5 mt-2">
                      <p className="font-extrabold text-[10px] text-gov-text-primary leading-tight uppercase block truncate">
                        {role.title}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Selected Role Meta Details Box */}
            {selectedRoleId && (
              <div className="p-3 bg-gov-bg border border-gov-border rounded-xl flex items-start space-x-2.5">
                <Info className="w-4 h-4 text-gov-secondary shrink-0 mt-0.5" />
                <p className="text-[10px] sm:text-xs text-gov-text-secondary leading-relaxed font-semibold">
                  <span className="text-gov-primary font-bold">Personalized Route: </span>
                  {rolesList.find(r => r.id === selectedRoleId)?.description} Submitting login will pre-fill eligibility matching vectors.
                </p>
              </div>
            )}
          </div>

          {/* Form Method selectors */}
          <div className="grid grid-cols-3 gap-2 border-b border-gov-border pb-4 text-xs">
            <button
              type="button"
              onClick={() => {
                setAuthMethod('password');
                onSpeak("Switched to secure credentials login");
              }}
              className={`py-2 rounded-xl text-center font-bold transition-all border cursor-pointer ${
                authMethod === 'password' 
                  ? 'bg-gov-primary text-white border-gov-primary shadow-sm' 
                  : 'bg-gov-bg text-gov-text-secondary border-gov-border hover:text-gov-text-primary'
              }`}
            >
              Password Login
            </button>
            <button
              type="button"
              onClick={() => {
                setAuthMethod('otp');
                onSpeak("Switched to mobile verification track");
              }}
              className={`py-2 rounded-xl text-center font-bold transition-all border cursor-pointer ${
                authMethod === 'otp' 
                  ? 'bg-gov-primary text-white border-gov-primary shadow-sm' 
                  : 'bg-gov-bg text-gov-text-secondary border-gov-border hover:text-gov-text-primary'
              }`}
            >
              Mobile OTP
            </button>
            <button
              type="button"
              onClick={() => {
                setAuthMethod('digilocker');
                onSpeak("Switched to DigiLocker authorization");
              }}
              className={`py-2 rounded-xl text-center font-bold transition-all border cursor-pointer ${
                authMethod === 'digilocker' 
                  ? 'bg-gov-primary text-white border-gov-primary shadow-sm' 
                  : 'bg-gov-bg text-gov-text-secondary border-gov-border hover:text-gov-text-primary'
              }`}
            >
              DigiLocker Auth
            </button>
          </div>

          {/* MAIN FORM HANDLER */}
          {authMethod === 'password' && (
            <form onSubmit={handleFormSubmit} className="space-y-5">
              
              <div className="space-y-1.5 text-left">
                <label className="text-[10px] text-gov-text-secondary font-black uppercase tracking-wider block">Email Address or Aadhaar Registered Mobile</label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="citizen@smartbharat.gov.in or 10-digit phone"
                    className="w-full bg-gov-bg border border-gov-border focus:border-gov-primary rounded-xl px-4 py-2.5 text-xs sm:text-sm text-gov-text-primary font-bold outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1.5 text-left">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] text-gov-text-secondary font-black uppercase tracking-wider">Secure Access Password</label>
                  <a 
                    href="#forgot" 
                    onClick={(e) => { e.preventDefault(); addNotification("Secure reset link dispatched to registered backup credentials", "info"); }}
                    className="text-[10px] font-extrabold text-gov-secondary hover:text-gov-primary"
                  >
                    Forgot Password?
                  </a>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full bg-gov-bg border border-gov-border focus:border-gov-primary rounded-xl pl-4 pr-10 py-2.5 text-xs sm:text-sm text-gov-text-primary font-bold outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-gov-text-secondary hover:text-gov-text-primary"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center space-x-2 text-xs font-bold text-gov-text-secondary cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded border-gov-border text-gov-secondary focus:ring-0 shrink-0"
                  />
                  <span>Keep session secured on this system</span>
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-gov-primary hover:bg-gov-secondary disabled:opacity-50 text-white font-black rounded-xl text-xs uppercase tracking-widest transition-all shadow-md cursor-pointer flex items-center justify-center space-x-2"
              >
                {loading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                    <span>Authorizing credentials...</span>
                  </>
                ) : (
                  <>
                    <LockKeyhole className="w-4 h-4" />
                    <span>Authorize Secure Log In</span>
                  </>
                )}
              </button>

            </form>
          )}

          {authMethod === 'otp' && (
            <div className="space-y-5">
              <div className="space-y-1.5 text-left">
                <label className="text-[10px] text-gov-text-secondary font-black uppercase tracking-wider block">Registered Mobile Number</label>
                <div className="flex gap-2">
                  <input
                    type="tel"
                    maxLength={10}
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value.replace(/\D/g, ""))}
                    placeholder="Enter registered 10-digit number"
                    className="flex-grow bg-gov-bg border border-gov-border focus:border-gov-primary rounded-xl px-4 py-2.5 text-xs sm:text-sm text-gov-text-primary font-bold outline-none font-mono"
                  />
                  <button
                    type="button"
                    onClick={handleSendOtp}
                    className="px-4 bg-gov-secondary hover:bg-gov-primary text-white font-bold text-xs rounded-xl cursor-pointer"
                  >
                    Send OTP
                  </button>
                </div>
              </div>

              {otpSent && (
                <div className="space-y-1.5 text-left animate-slide-up">
                  <label className="text-[10px] text-gov-text-secondary font-black uppercase tracking-wider block">6-Digit Verification Code</label>
                  <input
                    type="text"
                    maxLength={6}
                    value={otpVal}
                    onChange={(e) => setOtpVal(e.target.value.replace(/\D/g, ""))}
                    placeholder="XXXXXX"
                    className="w-full bg-gov-bg border border-gov-border focus:border-gov-primary rounded-xl px-4 py-2.5 text-xs sm:text-sm text-gov-text-primary font-bold outline-none font-mono tracking-widest text-center"
                  />
                  
                  <button
                    type="button"
                    onClick={handleFormSubmit}
                    className="w-full mt-4 py-4 bg-gov-primary hover:bg-gov-secondary text-white font-black rounded-xl text-xs uppercase tracking-widest transition-all shadow-md cursor-pointer flex items-center justify-center space-x-2"
                  >
                    Verify & Authenticate
                  </button>
                </div>
              )}
            </div>
          )}

          {authMethod === 'digilocker' && (
            <div className="space-y-6 text-center py-4">
              <div className="max-w-xs mx-auto space-y-3">
                <div className="w-16 h-16 bg-blue-50 border border-blue-100 rounded-full flex items-center justify-center mx-auto text-gov-primary">
                  <QrCode className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-gov-primary">Authorize via DigiLocker ID</h3>
                  <p className="text-[10px] text-gov-text-secondary font-semibold mt-1">
                    Retrieve secure verified documents like Aadhaar, PAN, and high school certificates instantly.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleDigiLockerMock}
                className="w-full max-w-sm mx-auto py-4 bg-amber-500 hover:bg-amber-600 text-white font-black rounded-xl text-xs uppercase tracking-wider transition-all shadow-md cursor-pointer flex items-center justify-center space-x-2"
              >
                <Smartphone className="w-4 h-4" />
                <span>Connect with DigiLocker Gateway</span>
              </button>
            </div>
          )}

          {/* Social login option */}
          <div className="space-y-4 pt-2 border-t border-gov-border">
            <div className="relative flex py-2 items-center">
              <div className="flex-grow border-t border-gov-border"></div>
              <span className="flex-shrink mx-4 text-[10px] text-gov-text-secondary font-black uppercase tracking-widest">or authorized pathways</span>
              <div className="flex-grow border-t border-gov-border"></div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs font-bold">
              <button
                type="button"
                onClick={handleFormSubmit}
                className="py-3 bg-gov-bg hover:bg-gov-border/60 text-gov-text-primary rounded-xl border border-gov-border flex items-center justify-center space-x-2 cursor-pointer"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v3.92h6.61c-.29 1.53-1.15 2.83-2.45 3.71v3.08h3.97c2.32-2.14 3.61-5.3 3.61-8.64z"/>
                  <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.97-3.08c-1.11.75-2.53 1.19-3.96 1.19-3.05 0-5.63-2.06-6.55-4.83H1.31v3.18C3.29 20.33 7.37 24 12 24z"/>
                  <path fill="#FBBC05" d="M5.45 14.37c-.24-.75-.38-1.54-.38-2.37s.14-1.62.38-2.37V6.45H1.31C.48 8.11 0 9.99 0 12s.48 3.89 1.31 5.55l4.14-3.18z"/>
                  <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.37 0 3.29 3.67 1.31 7.45l4.14 3.18c.92-2.77 3.5-4.83 6.55-4.83z"/>
                </svg>
                <span>Continue with Google</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  onSpeak("Initiated secure device biometric credential verification");
                  addNotification("Biometric sensor interface ready", "info");
                  setTimeout(() => {
                    const activeRole = rolesList.find(r => r.id === selectedRoleId);
                    if (activeRole) {
                      onLogin(activeRole.title, activeRole.defaultProfile);
                      addNotification("Biometric Fingerprint/Iris matching success!", "success");
                    }
                  }, 1200);
                }}
                className="py-3 bg-gov-bg hover:bg-gov-border/60 text-gov-text-primary rounded-xl border border-gov-border flex items-center justify-center space-x-2 cursor-pointer"
              >
                <Shield className="w-4 h-4 text-gov-success" />
                <span>Biometric Key Login</span>
              </button>
            </div>
          </div>

          {/* Quick Features Checklist Row */}
          <div className="space-y-3 pt-4 border-t border-gov-border text-left">
            <span className="text-[10px] text-gov-text-secondary font-black uppercase tracking-wider block">
              SYSTEM CAPABILITIES INTEGRATED WITHIN PORTAL
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {quickFeaturesList.map((feat, idx) => {
                const IconComp = feat.icon;
                return (
                  <div key={idx} className="flex items-start space-x-2 bg-gov-bg/60 p-2.5 rounded-xl border border-gov-border hover:border-gov-secondary/20 transition-all">
                    <IconComp className="w-4.5 h-4.5 text-gov-secondary shrink-0 mt-0.5" />
                    <div className="space-y-0.5 text-left">
                      <p className="font-extrabold text-[10px] text-gov-text-primary leading-tight uppercase block">
                        {feat.title}
                      </p>
                      <p className="text-[9px] text-gov-text-secondary font-semibold leading-none truncate block w-28">
                        {feat.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* FOOTER */}
        <div className="mt-12 text-center max-w-2xl mx-auto space-y-4">
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-[11px] font-bold text-gov-text-secondary">
            <a href="#privacy" className="hover:text-gov-primary transition-colors">Privacy Policy</a>
            <span>•</span>
            <a href="#terms" className="hover:text-gov-primary transition-colors">Terms & Conditions</a>
            <span>•</span>
            <a href="#help" className="hover:text-gov-primary transition-colors">Help Center</a>
            <span>•</span>
            <a href="#accessibility" className="hover:text-gov-primary transition-colors">Accessibility Statement</a>
          </div>

          <div className="bg-gov-bg border border-gov-border p-4 rounded-xl space-y-1.5 text-left text-[10px] leading-relaxed text-gov-text-secondary font-semibold">
            <p className="font-bold text-gov-primary text-[11px] uppercase tracking-wide">
              Official Government Portal Prototype Disclaimer:
            </p>
            <p>
              Smart Bharat is an conceptual AI-enabled framework demonstrating future-ready digital public infrastructure. All system states, user accounts, and database integrations are local simulations representing design benchmarks inspired by national guidelines.
            </p>
            <div className="flex justify-between items-center pt-2 border-t border-gov-border text-[9px] font-mono">
              <span>Secure Gateway: SHA-256 / RSA-2048 Signed</span>
              <span>v3.5.2 (Stable Production)</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
