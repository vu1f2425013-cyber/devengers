import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Bot, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  FileText, 
  Users, 
  Activity, 
  AlertCircle, 
  MessageSquare, 
  Zap, 
  ChevronDown, 
  ChevronUp,
  Building,
  ShieldCheck,
  Award,
  PhoneCall,
  Bell,
  BookOpen,
  Heart,
  Sprout,
  Truck,
  Coins,
  Briefcase,
  Scale,
  Baby,
  FileDigit,
  Globe,
  Search,
  Mic,
  Upload,
  Clock,
  LayoutGrid,
  ChevronLeft,
  ChevronRight,
  Star,
  MapPin,
  AlertTriangle,
  CheckCircle,
  Download,
  RefreshCw,
  Play,
  Volume2,
  Smartphone,
  ExternalLink,
  Lock,
  Settings,
  AlertOctagon,
  Compass,
  Eye,
  HeartHandshake,
  UserCheck,
  Flame
} from 'lucide-react';
import { AppView, AppLanguage, CitizenProfile, AccessibilitySettings } from '../types';
import { getTranslation } from '../lib/translations';
import VoiceReader from './VoiceReader';

interface LandingPageProps {
  setCurrentView: (view: AppView) => void;
  language: AppLanguage;
  onSpeak: (text: string) => void;
  profile: CitizenProfile;
  setProfile: (profile: CitizenProfile) => void;
  accessibility: AccessibilitySettings;
}

export default function LandingPage({ 
  setCurrentView, 
  language, 
  onSpeak, 
  profile, 
  setProfile,
  accessibility 
}: LandingPageProps) {

  // State Declarations
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedState, setSelectedState] = useState('Maharashtra');
  const [schemeFilter, setSchemeFilter] = useState<'AI Recommended' | 'Trending' | 'Closing Soon' | 'New' | 'Popular'>('AI Recommended');
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [alertIndex, setAlertIndex] = useState(0);

  // Live Statistics Counter State
  const [liveStats, setLiveStats] = useState({
    citizens: 2482912,
    queriesToday: 18452,
    resolved: 98.4,
    verifiedDocs: 812493,
    schemesClaimed: 428000000,
  });

  // DigiLocker OCR Simulated State
  const [isUploadingDoc, setIsUploadingDoc] = useState(false);
  const [uploadedDoc, setUploadedDoc] = useState<string | null>(null);
  const [ocrResult, setOcrResult] = useState<{
    docName: string;
    num: string;
    holder: string;
    summary: string;
    simplified: string;
  } | null>(null);

  // Civic Complaint Builder State
  const [isProcessingComplaint, setIsProcessingComplaint] = useState(false);
  const [complaintMedia, setComplaintMedia] = useState<string | null>(null);
  const [complaintLocation, setComplaintLocation] = useState('Sector 4, Gandhinagar, Gujarat');
  const [detectedIssue, setDetectedIssue] = useState<{
    issue: string;
    confidence: string;
    dept: string;
    priority: string;
    description: string;
    ticketId: string;
  } | null>(null);

  // AI Assistant Quick Chat State
  const [chatPreviewQuery, setChatPreviewQuery] = useState('');
  const [chatPreviewReply, setChatPreviewReply] = useState<string | null>(null);
  const [isReplyingPreview, setIsReplyingPreview] = useState(false);

  // Interactive Map State Selection Data
  const stateData: Record<string, {
    departments: string[];
    schemes: string[];
    services: string[];
    offices: string[];
    centers: string[];
  }> = {
    'Maharashtra': {
      departments: ['Revenue & Forest Dept', 'Higher & Technical Education', 'Agriculture Department', 'Public Health Department'],
      schemes: ['MahaDBT Farmer Pension', 'Rajarshi Chhatrapati Shahu Maharaj Scholarship', 'Maha Jyotiba Phule Jan Arogya'],
      services: ['Search 7/12 Land Record', 'Income Certificate Apply', 'Non-Creamy Layer Verification'],
      offices: ['MH Grievance Commission, Mumbai', 'Sub-Registrar Office, Pune', 'District Collectorate, Nagpur'],
      centers: ['Maha e-Seva Kendra (450+ Locations)', 'Setu Suvidha Kendra, Aurangabad']
    },
    'Delhi': {
      departments: ['Department of Food & Supplies', 'Revenue Department', 'Delhi Jal Board', 'Health & Family Welfare'],
      schemes: ['Ladli Scheme Delhi', 'Delhi Widows Pension Scheme', 'Jai Bhim Mukhyamantri Pratibha Vikas'],
      services: ['Ration Card E-Verification', 'Property Tax Assessment', 'OBC Certificate Renewal'],
      offices: ['Delhi Grievance Redressal, ITO', 'Divisional Commissioner, Civil Lines', 'SDM Office, Vasant Vihar'],
      centers: ['Doorstep Delivery Services (Dial 1076)', 'Delhi Government e-Sewa Hubs']
    },
    'Karnataka': {
      departments: ['Revenue Department', 'Department of Agriculture', 'Backward Classes Welfare', 'Department of Food'],
      schemes: ['Grama One Portal Benefits', 'Raitha Vidya Nidhi Scholarship', 'Gruha Lakshmi Financial Aid'],
      services: ['Bhoomi Land Records Lookup', 'Caste and Income Certificate', 'Pahani RTC Download'],
      offices: ['Karnataka Chief Secretary Grievance', 'Tahsildar Office, Bengaluru South', 'Janaspandana Redressal'],
      centers: ['Karnataka One Centers (Bengaluru)', 'Grama One Gram Panchayat Hubs']
    },
    'Tamil Nadu': {
      departments: ['Revenue & Disaster Management', 'Agriculture & Farmers Welfare', 'Social Welfare', 'Health Department'],
      schemes: ['Pudhumai Penn Scheme', 'Makkalai Thedi Maruthuvam', 'TN Farmer Tractor Subsidy'],
      services: ['Patta Chitta Land Verification', 'Community Certificate Issuance', 'Legal Heir Certificate'],
      offices: ['Commissioner of Revenue, Chennai', 'Collectorate Office, Coimbatore', 'e-Grievance Cell Madurai'],
      centers: ['e-Sevai Centers TN (Arasu Cable)', 'TNeGA Regional Digital Hubs']
    },
    'Uttar Pradesh': {
      departments: ['Revenue Department', 'Social Welfare Department', 'Basic Education UP', 'UP Agriculture Commission'],
      schemes: ['Kanya Sumangala Yojana', 'UP Pankh Portal Scholarships', 'UP Samajwadi Pension Scheme'],
      services: ['Khatedaar Bhulekh Verification', 'Domicile Certificate Apply', 'Ration Card NFSA Search'],
      offices: ['Lok Grievance Authority, Lucknow', 'Tehsildar Suvidha Kendra, Varanasi', 'Jansunwai UP Portal'],
      centers: ['Jan Seva Kendra (UP Desco)', 'Lokvani Centers UP']
    },
    'Gujarat': {
      departments: ['Revenue Department Gujarat', 'Agriculture & Co-operation', 'Education Department', 'Urban Development'],
      schemes: ['Mukhyamantri Amrutam Yojana', 'Gujarat Vidya Sahay Yojana', 'UPY-Seven Farmer Pension'],
      services: ['AnyROR @ Anywhere Land Records', 'Caste Certificate E-Verification', 'Digital Gujarat Scholarships'],
      offices: ['Gujarat Grievance Redressal, Gandhinagar', 'District Collector Office, Surat', 'Mamlatdar Office, Vadodara'],
      centers: ['e-Gram Vishvagram Centers', 'Digital Gujarat Facilitation Hubs']
    }
  };

  // Auto counter increment to simulate a real, living official platform
  useEffect(() => {
    const timer = setInterval(() => {
      setLiveStats(prev => ({
        citizens: prev.citizens + Math.floor(Math.random() * 3) + 1,
        queriesToday: prev.queriesToday + Math.floor(Math.random() * 2) + 1,
        resolved: parseFloat((prev.resolved + (Math.random() * 0.001)).toFixed(3)),
        verifiedDocs: prev.verifiedDocs + Math.floor(Math.random() * 2) + 1,
        schemesClaimed: prev.schemesClaimed + Math.floor(Math.random() * 500) + 200,
      }));
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  // News ticker auto-scroll
  useEffect(() => {
    const newsTimer = setInterval(() => {
      setAlertIndex(prev => (prev + 1) % newsAlerts.length);
    }, 6000);
    return () => newsTimer;
  }, []);

  // Carousel auto-scroll
  useEffect(() => {
    const carouselTimer = setInterval(() => {
      setCarouselIndex(prev => (prev + 1) % carouselItems.length);
    }, 8000);
    return () => clearInterval(carouselTimer);
  }, []);

  // News alerts list
  const newsAlerts = [
    { type: 'IMPORTANT', text: 'Unified DigiLocker credentials and State scholarship windows for 2026-27 are now active on Smart Bharat.', date: 'July 2026' },
    { type: 'WEATHER', text: 'IMD Alert: Heavy precipitation predicted over Western Maharashtra and Coastal Karnataka. Local Disaster Management units on alert.', date: 'Live' },
    { type: 'DEADLINE', text: 'PM-Kisan Maandhan Yojana KYC verification deadline extended up to August 15th, 2026. Complete via Aadhaar verification.', date: 'August 2026' },
    { type: 'NEW FEATURE', text: 'Smart Bharat voice assistant updated with offline support for 2G rural telemetry lines. Try Dial-in voice help.', date: 'New' }
  ];

  // Carousel Items (What's New)
  const carouselItems = [
    {
      title: "PM-SVANidhi Loan Scheme Extended",
      category: "Central Schemes",
      desc: "Street vendors can now apply for collateral-free microloans up to ₹50,000 with 7% interest subsidy directly using our AI Form Filler.",
      action: "Apply with AI",
      link: "schemes",
      bg: "from-blue-600 to-indigo-800"
    },
    {
      title: "DigiLocker OCR Native Translation",
      category: "Digital India Updates",
      desc: "Instantly translate scanned certificates and regional revenue documents from 12 Indian languages into English or your chosen mother tongue.",
      action: "Upload Document",
      link: "assistant",
      bg: "from-amber-500 to-orange-700"
    },
    {
      title: "Single-Window Municipal Complaint Registry",
      category: "Civic Empowerment",
      desc: "Take a photo of waste dumps or broken streetlights. The platform automatically matches the GPS, creates a formal complaint, and assigns municipal supervisors.",
      action: "Report Issue Now",
      link: "complaints",
      bg: "from-emerald-600 to-teal-800"
    },
    {
      title: "Next-Gen AI Scheme Eligibility Profiler",
      category: "Citizen Onboarding",
      desc: "Updated criteria for all 2026 central and state education scholarships. Fill your demographic details once and let the model match active grants.",
      action: "Test Eligibility",
      link: "schemes",
      bg: "from-purple-600 to-pink-800"
    }
  ];

  // Quick Services list (14 cards)
  const quickServices = [
    { title: "Birth Certificate", desc: "Apply for or search official municipal birth records using digital identity.", icon: Baby, dept: "Municipal Corporation" },
    { title: "Death Certificate", desc: "Register, apply for, or verify official municipal death certifications.", icon: FileDigit, dept: "Municipal Corporation" },
    { title: "Aadhaar Services", desc: "Update address, verify biometrics, or download e-Aadhaar letters safely.", icon: ShieldCheck, dept: "UIDAI, Govt of India" },
    { title: "PAN Card", desc: "Instant e-PAN allotment, updates, and Aadhaar linking in 2 minutes.", icon: FileText, dept: "Income Tax Department" },
    { title: "Passport Seva", desc: "Schedule passport appointments, track application status, or apply for renewals.", icon: Globe, dept: "Ministry of External Affairs" },
    { title: "Driving Licence", desc: "Apply for learner permit, renew permanent license, or register your vehicle.", icon: Truck, dept: "Ministry of Road Transport" },
    { title: "Property Tax", desc: "View municipal property assessments, pay taxes online, or download receipts.", icon: Building, dept: "Municipal Revenue Dept" },
    { title: "Electricity Bill", desc: "Unified payment platform for state power distribution boards with subsidy checks.", icon: Zap, dept: "State Electricity Boards" },
    { title: "Water Bill Payment", desc: "Check outstanding sewage and water supply bills, make payments instantly.", icon: Activity, dept: "State Jal Boards" },
    { title: "Scholarships Portal", desc: "National and state scholarships for students, disabled citizens, and minority youth.", icon: Award, dept: "Ministry of Social Justice" },
    { title: "Healthcare Services", desc: "Ayushman Bharat card creation, PM-JAY hospital search, and digital prescriptions.", icon: Heart, dept: "Ministry of Health" },
    { title: "Farmer Services", desc: "PM-Kisan registration, soil health card verification, and crop insurance claims.", icon: Sprout, dept: "Ministry of Agriculture" },
    { title: "Employment Portal", desc: "National Career Service registration, rural job cards, and skills development.", icon: Briefcase, dept: "Ministry of Labor" },
    { title: "Business Registration", desc: "MSME Udyam registry, GST filing lookup, and local municipal trade licenses.", icon: Scale, dept: "Ministry of MSME" }
  ];

  // Service Categories
  const categories = [
    { title: "Identity & Citizens", desc: "Aadhaar, PAN, Passport, Domicile, Caste", count: "18 Services", icon: ShieldCheck },
    { title: "Education & Skills", desc: "Scholarships, Board results, Skill development", count: "34 Services", icon: BookOpen },
    { title: "Healthcare & Welfare", desc: "Ayushman Bharat, Pension, Disability grants", count: "25 Services", icon: Heart },
    { title: "Agriculture & Farmers", desc: "PM-Kisan, Soil testing, Subsidies, Machinery", count: "19 Services", icon: Sprout },
    { title: "Transport & Travel", desc: "Driving License, Vahan RC, Tolls, e-Challan", count: "12 Services", icon: Truck },
    { title: "Finance & Tax", desc: "GST, Income Tax, Corporate filing, Pension accounts", count: "15 Services", icon: Coins },
    { title: "Employment & Jobs", desc: "NREGA Job card, Apprentice programs, PMKVY", count: "21 Services", icon: Briefcase },
    { title: "Business & Trade", desc: "Udyam Registry, Food licensing, Trade permit", count: "29 Services", icon: Scale }
  ];

  // Schemes Data dynamically evaluated based on the current profile!
  const getPersonalizedSchemes = () => {
    // Generate simulated matches based on profile properties
    const matches = [
      {
        name: "Pradhan Mantri Kisan Maandhan Yojana (PM-KMY)",
        dept: "Ministry of Agriculture & Farmers Welfare",
        benefits: "Assured pension of ₹3,000/month after age 60",
        score: profile.isFarmer ? 98 : profile.age > 45 ? 75 : 40,
        tag: "Farmer Benefit"
      },
      {
        name: "National Merit-cum-Means Scholarship Scheme",
        dept: "Department of School Education & Literacy",
        benefits: "Financial assistance of ₹12,000 per annum for studies",
        score: profile.isStudent && profile.income < 350000 ? 99 : profile.isStudent ? 80 : 30,
        tag: "Student Grant"
      },
      {
        name: "Atal Pension Yojana (APY)",
        dept: "Pension Fund Regulatory and Development Authority",
        benefits: "Guaranteed minimum pension of ₹1,000 to ₹5,000/month",
        score: profile.age >= 18 && profile.age <= 40 ? 95 : profile.age > 40 ? 60 : 25,
        tag: "Social Security"
      },
      {
        name: "Pradhan Mantri Mudra Yojana (PMMY)",
        dept: "Ministry of Finance",
        benefits: "Collateral-free business loans up to ₹10 Lakhs",
        score: profile.isBusinessOwner ? 97 : profile.income < 500000 ? 82 : 55,
        tag: "MSME Support"
      },
      {
        name: "Indira Gandhi National Old Age Pension Scheme",
        dept: "Ministry of Rural Development",
        benefits: "Monthly cash assistance for senior citizens",
        score: profile.isSenior || profile.age >= 60 ? 99 : profile.age >= 50 ? 70 : 15,
        tag: "Senior Pension"
      }
    ];

    // Sort schemes by match score descending
    return matches.sort((a, b) => b.score - a.score);
  };

  const getTrendingSchemes = () => [
    { name: "Ayushman Bharat (PM-JAY)", dept: "National Health Authority", benefits: "Health insurance cover of ₹5 Lakhs per family annually", score: 92, tag: "Healthcare" },
    { name: "PM-Kisan Samman Nidhi", dept: "Ministry of Agriculture", benefits: "Direct income support of ₹6,000/year in 3 equal installments", score: 88, tag: "Direct Cash" },
    { name: "LPG Subsidy - Pradhan Mantri Ujjwala Yojana", dept: "Ministry of Petroleum", benefits: "Free LPG connections & subsidy on cylinder refills", score: 85, tag: "Cooking Fuel" },
  ];

  const getClosingSoonSchemes = () => [
    { name: "National Overseas Scholarship Program", dept: "Ministry of Social Justice", benefits: "Funding for post-graduate studies abroad", score: 94, tag: "Scholarship" },
    { name: "PM SVANidhi Loan Renewal", dept: "Ministry of Housing & Urban Affairs", benefits: "Collateral-free working capital loan up to ₹50,000", score: 89, tag: "Credit Support" }
  ];

  const getActiveSchemeList = () => {
    switch (schemeFilter) {
      case 'AI Recommended':
        return getPersonalizedSchemes();
      case 'Trending':
        return getTrendingSchemes();
      case 'Closing Soon':
        return getClosingSoonSchemes();
      case 'New':
        return [
          { name: "Pradhan Mantri Vishwakarma Scheme", dept: "Ministry of MSME", benefits: "End-to-end support for traditional artisans and craftspeople", score: 95, tag: "Artisan Support" },
          { name: "PM Surya Ghar: Muft Bijli Yojana", dept: "Ministry of New & Renewable Energy", benefits: "Up to ₹78,000 subsidy on solar rooftop systems", score: 91, tag: "Solar Subsidy" }
        ];
      case 'Popular':
        return [
          { name: "PM Awas Yojana (Urban)", dept: "Ministry of Housing & Urban Affairs", benefits: "Subsidies on home loans under Credit Linked Subsidy Scheme", score: 96, tag: "Housing Grant" },
          { name: "PM Mudra Yojana (Tarun Category)", dept: "Ministry of Finance", benefits: "Collateral-free business expansion loans above ₹5 Lakhs", score: 93, tag: "Business Loan" }
        ];
    }
  };

  // Simulated DigiLocker File OCR Upload Action
  const handleDocSelection = (docType: string) => {
    setIsUploadingDoc(true);
    setUploadedDoc(docType);
    setOcrResult(null);

    // Simulate OCR delay and response
    setTimeout(() => {
      setIsUploadingDoc(false);
      if (docType === "Aadhaar Card") {
        setOcrResult({
          docName: "Aadhaar Card (UIDAI)",
          num: "XXXX-XXXX-8921",
          holder: profile.age > 40 ? "Shri Rajesh Sharma" : "Amit Kumar Varma",
          summary: "This is a valid Unique Identification Authority of India (UIDAI) Card. It certifies residency status but does not represent citizenship or passport authorization.",
          simplified: "This card is your official ID card for living in India. It is used to verify who you are, your age, and your house address when getting services like a phone connection or bank account."
        });
      } else if (docType === "PAN Card") {
        setOcrResult({
          docName: "Permanent Account Number Card (Income Tax)",
          num: "APQVPXXXXN",
          holder: profile.age > 40 ? "RAJESH SHARMA" : "AMIT KUMAR VARMA",
          summary: "Official Permanent Account Number (PAN) Card issued under the Income Tax Department of India for tax payments and financial asset management.",
          simplified: "This card is a permanent tax identity card. You need it to do big transactions, pay taxes, buy a car, open a business bank account, or start a new job."
        });
      } else if (docType === "Driving License") {
        setOcrResult({
          docName: "Driving License (MoRTH)",
          num: "DL-142026004921",
          holder: "AMIT KUMAR VARMA",
          summary: "Valid Motor Vehicle Driving License issued by National Transport Authority, Gandhinagar, authorizing light motor vehicle operation.",
          simplified: "This card proves you successfully passed a driving test. It lets you legally drive a motorbike or a small car anywhere on roads in India."
        });
      } else {
        setOcrResult({
          docName: "Income Certificate (State Authority)",
          num: "INC-2026-89410",
          holder: "Amit Kumar Varma",
          summary: "Income verification certificate for financial year 2025-2026, registering an annual family income of ₹2,40,000.",
          simplified: "This paper proves how much money your family earns in a year. It is very important because it determines if you qualify for cheap ration, free health cards, or student scholarships."
        });
      }
    }, 1800);
  };

  // Simulated Civic Complaint Media Selection Action
  const handleComplaintMediaSelect = (mediaType: string) => {
    setIsProcessingComplaint(true);
    setComplaintMedia(mediaType);
    setDetectedIssue(null);

    setTimeout(() => {
      setIsProcessingComplaint(false);
      const ticketId = "SB-CIVIC-" + Math.floor(100000 + Math.random() * 900000);
      if (mediaType === "Pothole") {
        setDetectedIssue({
          issue: "Severe Potholes & Asphalt Rupture",
          confidence: "98.2% (Deep Learning Vision)",
          dept: "Public Works Department (PWD)",
          priority: "CRITICAL",
          description: "Major tarmac erosion spanning 1.2 meters. High risk of two-wheeler vehicle damage and localized gridlock.",
          ticketId
        });
      } else if (mediaType === "Garbage") {
        setDetectedIssue({
          issue: "Illegal Secondary Solid Waste Dump",
          confidence: "94.5% (Deep Learning Vision)",
          dept: "Municipal Corporation Sanitation",
          priority: "HIGH",
          description: "Accumulated commercial plastic refuse and bio-organic trash blocking secondary pedestrian lanes.",
          ticketId
        });
      } else {
        setDetectedIssue({
          issue: "Non-Functional Municipal Streetlight Array",
          confidence: "89.1% (Deep Learning Vision)",
          dept: "Municipal Electricity & Lighting Board",
          priority: "MEDIUM",
          description: "Three sequential streetlighting lamp fixtures out of service. Causes severe safety hazard for night commuters.",
          ticketId
        });
      }
    }, 2000);
  };

  // Simulated AI Quick Assistant Preview Action
  const handleChatPreviewSubmit = (query: string) => {
    if (!query.trim()) return;
    setChatPreviewQuery(query);
    setIsReplyingPreview(true);
    setChatPreviewReply(null);

    setTimeout(() => {
      setIsReplyingPreview(false);
      const cleaned = query.toLowerCase();
      if (cleaned.includes('aadhaar')) {
        setChatPreviewReply("If you lost your Aadhaar card: 1. Use the official UIDAI website to retrieve your Aadhaar Number using your linked mobile number. 2. Download a digital copy (e-Aadhaar) which is fully legal under the IT Act. 3. Alternatively, visit an Aadhaar Seva Kendra for biometric retrieval.");
      } else if (cleaned.includes('scholarship') || cleaned.includes('education')) {
        setChatPreviewReply("For scholarships: Based on your current profile, you match criteria for the National Merit-cum-Means scholarship (up to ₹12,000/year). You need an Income Certificate proving family earnings under ₹3.5 Lakhs per year. Applications can be drafted directly in our Schemes Matcher tab.");
      } else if (cleaned.includes('pothole') || cleaned.includes('road')) {
        setChatPreviewReply("To report a pothole: Use our Civic Complaints portal. Upload a photo, select your GPS coordinates, and the AI will auto-detect the damage, file a formal complaint under PWD, and give you an official tracking ticket instantly.");
      } else {
        setChatPreviewReply("Certainly! I can guide you through any Government of India service, scheme details, document translations, or complaint filings. Please head over to the dedicated AI Assistant tab on the navigation bar for deep interactive help and real-time voice guidance!");
      }
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-gov-bg text-gov-text-primary overflow-hidden relative pb-10">
      
      {/* Soft Ambient Background Highlights */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-gov-primary/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-[500px] h-[500px] bg-gov-saffron/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-20 left-10 w-[400px] h-[400px] bg-gov-success/5 rounded-full blur-3xl pointer-events-none" />

      {/* EMERGENCY SERVICES HEADER TICKER ALERTS */}
      <div className="bg-red-600/10 border-b border-red-200 text-red-800 py-2 px-4 text-xs font-semibold flex items-center justify-between z-10 relative">
        <div className="flex items-center space-x-2 truncate">
          <span className="bg-red-600 text-white text-[9px] px-1.5 py-0.5 rounded-sm font-bold uppercase shrink-0 animate-pulse">EMERGENCY LINE ACTIVE</span>
          <span className="truncate">National Disaster Helpline (1078) & Women Safety Helpline (1091) are integrated. Scroll to the Emergency grid below for one-tap assistance.</span>
        </div>
        <button 
          onClick={() => {
            const el = document.getElementById('emergency-section');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
            onSpeak("Sourcing Emergency Support.");
          }}
          className="text-red-700 hover:text-red-900 flex items-center space-x-1 shrink-0 text-[10px] font-black uppercase tracking-wider bg-white/50 px-2 py-0.5 rounded-md border border-red-300"
        >
          <PhoneCall className="w-3 h-3" />
          <span>Call Support</span>
        </button>
      </div>

      {/* NATIONAL GOVERNMENT ALERTS BAR */}
      <div className="bg-gov-surface border-b border-gov-border py-2 px-4 flex items-center justify-between text-xs z-10 relative overflow-hidden">
        <div className="flex items-center space-x-2 text-gov-primary w-full md:w-3/4 truncate">
          <Bell className="w-3.5 h-3.5 text-gov-saffron shrink-0 animate-bounce" />
          <span className="font-extrabold text-[10px] uppercase text-gov-saffron shrink-0 bg-gov-saffron/10 px-1.5 py-0.5 rounded-sm">
            {newsAlerts[alertIndex].type}
          </span>
          <span className="text-gov-text-primary truncate font-semibold">
            {newsAlerts[alertIndex].text}
          </span>
        </div>
        <div className="hidden md:flex items-center space-x-1.5 text-gov-text-secondary text-[10px] font-bold">
          <Clock className="w-3 h-3 text-gov-secondary" />
          <span>Updated: {newsAlerts[alertIndex].date}</span>
          <div className="flex space-x-1 pl-2">
            {newsAlerts.map((_, idx) => (
              <button 
                key={idx} 
                onClick={() => setAlertIndex(idx)} 
                className={`w-1.5 h-1.5 rounded-full ${idx === alertIndex ? 'bg-gov-primary' : 'bg-gov-border'}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* HERO SECTION */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Side: Dynamic Headings & Large AI Search */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="inline-flex items-center space-x-2 px-3 py-1 bg-gov-primary/10 text-gov-primary border border-gov-primary/20 rounded-full text-xs font-bold tracking-wide uppercase">
              <Sparkles className="w-3.5 h-3.5 text-gov-saffron animate-pulse shrink-0" />
              <span>{getTranslation('brand_subtitle', language)}</span>
            </div>

            {/* Voice speaker for Hero introduction */}
            <VoiceReader 
              text={`Welcome to Smart Bharat. India's AI Powered Civic Companion. One platform for Government Services, AI Guidance, Schemes, Complaints, Documents, and Citizen Support.`} 
              language={language} 
              sectionId="landing-hero-speech" 
            />

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-none text-gov-primary">
              Welcome to <span className="text-gov-saffron">Smart Bharat</span><br />
              <span className="text-gov-secondary text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight block mt-2">
                India's AI Powered Civic Companion
              </span>
            </h1>

            <p className="text-gov-text-secondary text-sm sm:text-base max-w-xl leading-relaxed font-semibold">
              Your single digital gateway for Government Services, Automated AI Guidance, scheme checking, civic complaint resolution, and secure OCR document management.
            </p>

            {/* LARGE AI SEARCH BAR */}
            <div className="bg-gov-surface border-2 border-gov-primary/30 focus-within:border-gov-secondary/70 p-1.5 rounded-2xl shadow-lg shadow-gov-primary/5 transition-all max-w-xl">
              <form onSubmit={(e) => { e.preventDefault(); handleChatPreviewSubmit(searchQuery); }} className="flex items-center">
                <Search className="w-5 h-5 text-gov-text-secondary ml-3 shrink-0" />
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Ask anything about Government services (e.g. lost Aadhaar, scholarships)..."
                  className="w-full bg-transparent text-sm text-gov-text-primary placeholder:text-gov-text-secondary font-medium px-3 outline-none py-3"
                />
                
                {/* Voice search simulation button */}
                <button 
                  type="button"
                  onClick={() => {
                    const phrases = ["I need scholarship", "Apply for birth certificate", "I lost my Aadhaar", "Report pothole"];
                    const randomPhrase = phrases[Math.floor(Math.random() * phrases.length)];
                    setSearchQuery(randomPhrase);
                    onSpeak(`Simulating voice entry: ${randomPhrase}`);
                  }}
                  title="Simulate Voice Input Search"
                  className="p-2.5 hover:bg-gov-bg rounded-xl text-gov-secondary hover:text-gov-primary transition-colors cursor-pointer mr-1 shrink-0"
                >
                  <Mic className="w-5 h-5 animate-pulse" />
                </button>

                <button 
                  type="submit"
                  className="px-5 py-3 bg-gov-primary hover:bg-gov-secondary text-white font-bold text-xs rounded-xl transition-all shadow-md cursor-pointer shrink-0"
                >
                  Ask AI
                </button>
              </form>
            </div>

            {/* EXAMPLES AND SUGGESTIONS */}
            <div className="space-y-2 max-w-xl">
              <span className="text-[10px] font-bold text-gov-text-secondary uppercase tracking-wider block">Try asking these queries:</span>
              <div className="flex flex-wrap gap-2">
                {[
                  { text: "I lost my Aadhaar", speak: "How do I recover lost Aadhaar card?" },
                  { text: "I need scholarship", speak: "What are student scholarships?" },
                  { text: "Report pothole", speak: "How to report a local pothole?" },
                  { text: "Apply for birth certificate", speak: "Steps to apply for birth certificate" }
                ].map((sug, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setSearchQuery(sug.text);
                      handleChatPreviewSubmit(sug.text);
                      onSpeak(`Searching for ${sug.speak}`);
                    }}
                    className="px-3 py-1.5 bg-gov-surface hover:bg-gov-bg text-gov-primary hover:text-gov-secondary border border-gov-border rounded-lg text-xs font-bold transition-all cursor-pointer shadow-xs active:scale-95"
                  >
                    "{sug.text}"
                  </button>
                ))}
              </div>
            </div>

            {/* Chat Search Result Dialog inline preview */}
            <AnimatePresence>
              {(chatPreviewQuery || isReplyingPreview) && (
                <motion.div 
                  initial={{ opacity: 0, y: 15 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  exit={{ opacity: 0, y: 15 }}
                  className="p-4 bg-gov-secondary/5 border border-gov-secondary/20 rounded-2xl max-w-xl relative mt-4"
                >
                  <button 
                    onClick={() => { setSearchQuery(''); setChatPreviewQuery(''); setChatPreviewReply(null); }}
                    className="absolute top-2 right-2 text-gov-text-secondary hover:text-gov-primary font-bold text-xs p-1"
                  >
                    ×
                  </button>
                  <div className="flex items-center space-x-2 mb-2">
                    <Bot className="w-4 h-4 text-gov-secondary animate-pulse" />
                    <span className="text-[11px] font-black uppercase text-gov-primary">Smart Bharat Instant AI Assist</span>
                  </div>
                  <p className="text-xs text-gov-text-primary font-bold mb-1">Query: "{chatPreviewQuery}"</p>
                  
                  {isReplyingPreview ? (
                    <div className="flex items-center space-x-2 py-2">
                      <RefreshCw className="w-4 h-4 text-gov-secondary animate-spin" />
                      <span className="text-xs text-gov-text-secondary italic">Analyzing government procedures...</span>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <p className="text-xs text-gov-text-secondary leading-relaxed font-semibold">
                        {chatPreviewReply}
                      </p>
                      <div className="flex items-center space-x-2 pt-2">
                        <button 
                          onClick={() => onSpeak(chatPreviewReply || '')}
                          className="px-2.5 py-1 bg-gov-primary/10 text-gov-primary border border-gov-primary/20 rounded-md text-[10px] font-black flex items-center space-x-1 hover:bg-gov-primary/20 transition-colors"
                        >
                          <Volume2 className="w-3 h-3" />
                          <span>HEAR RESPONSE</span>
                        </button>
                        <button 
                          onClick={() => setCurrentView('assistant')}
                          className="px-2.5 py-1 bg-gov-secondary text-white rounded-md text-[10px] font-black flex items-center space-x-1 hover:bg-gov-secondary/95 transition-all"
                        >
                          <span>CONTINUE CHAT</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Quick Action buttons */}
            <div className="flex flex-wrap gap-3 pt-2">
              <button 
                onClick={() => { setCurrentView('services'); onSpeak("Exploring government services"); }} 
                className="flex items-center space-x-1.5 px-4 py-2.5 bg-gov-primary hover:bg-gov-primary/95 text-white font-extrabold text-xs rounded-xl shadow-md cursor-pointer transition-transform active:scale-95"
              >
                <LayoutGrid className="w-4 h-4" />
                <span>Explore Services</span>
              </button>
              <button 
                onClick={() => { setCurrentView('complaints'); onSpeak("Opening complaints division"); }} 
                className="flex items-center space-x-1.5 px-4 py-2.5 bg-white hover:bg-gov-bg text-gov-primary border border-gov-border font-extrabold text-xs rounded-xl shadow-xs cursor-pointer transition-transform active:scale-95"
              >
                <AlertTriangle className="w-4 h-4 text-gov-saffron" />
                <span>Report Issue</span>
              </button>
              <button 
                onClick={() => { setCurrentView('schemes'); onSpeak("Accessing schemes engine"); }} 
                className="flex items-center space-x-1.5 px-4 py-2.5 bg-white hover:bg-gov-bg text-gov-primary border border-gov-border font-extrabold text-xs rounded-xl shadow-xs cursor-pointer transition-transform active:scale-95"
              >
                <Award className="w-4 h-4 text-gov-secondary" />
                <span>Find Schemes</span>
              </button>
              <button 
                onClick={() => { setCurrentView('assistant'); onSpeak("Opening chat interface"); }} 
                className="flex items-center space-x-1.5 px-4 py-2.5 bg-gov-saffron hover:bg-gov-saffron/90 text-gov-primary font-black text-xs rounded-xl shadow-md cursor-pointer transition-transform active:scale-95"
              >
                <Bot className="w-4 h-4" />
                <span>Talk to AI</span>
              </button>
            </div>
          </div>

          {/* Right Side: Interactive Digital India Dashboard Panel */}
          <div className="lg:col-span-5 relative">
            <div className="bg-gov-surface border border-gov-border rounded-3xl overflow-hidden shadow-xl flex flex-col relative z-10 p-5 space-y-4">
              
              {/* Dynamic status tags */}
              <div className="flex items-center justify-between border-b border-gov-border pb-3">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-gov-success rounded-full animate-ping" />
                  <span className="text-[10px] text-gov-primary font-black uppercase tracking-wider">SMART BHARAT NETWORK CORE</span>
                </div>
                <span className="text-[9px] bg-gov-secondary/15 text-gov-primary font-bold px-2 py-0.5 rounded-md border border-gov-secondary/25 uppercase">
                  National AI Node 26
                </span>
              </div>

              {/* Graphic element simulating live telemetry details */}
              <div className="bg-gov-bg/65 border border-gov-border rounded-2xl p-4 space-y-3 relative overflow-hidden">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-1.5">
                    <UserCheck className="w-4 h-4 text-gov-secondary" />
                    <span className="font-bold text-gov-primary">Connected Profile</span>
                  </div>
                  <span className="text-[10px] bg-gov-saffron/10 text-gov-primary font-bold px-2 py-0.5 rounded-sm">Active Citizen</span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-left">
                  <div className="bg-gov-surface p-2.5 rounded-xl border border-gov-border">
                    <span className="text-[9px] text-gov-text-secondary font-bold block uppercase">State of Residence</span>
                    <span className="text-xs text-gov-primary font-black">{profile.state}</span>
                  </div>
                  <div className="bg-gov-surface p-2.5 rounded-xl border border-gov-border">
                    <span className="text-[9px] text-gov-text-secondary font-bold block uppercase">Occupation</span>
                    <span className="text-xs text-gov-primary font-black capitalize">{profile.occupation}</span>
                  </div>
                  <div className="bg-gov-surface p-2.5 rounded-xl border border-gov-border">
                    <span className="text-[9px] text-gov-text-secondary font-bold block uppercase">Age Bracket</span>
                    <span className="text-xs text-gov-primary font-black">{profile.age} Years</span>
                  </div>
                  <div className="bg-gov-surface p-2.5 rounded-xl border border-gov-border">
                    <span className="text-[9px] text-gov-text-secondary font-bold block uppercase">Ann. Family Income</span>
                    <span className="text-xs text-gov-primary font-black">₹{profile.income.toLocaleString()}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[10px] text-gov-text-secondary font-bold pt-1">
                  <span className="flex items-center space-x-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-gov-success" />
                    <span>UIDAI Securely Parsed</span>
                  </span>
                  <button 
                    onClick={() => { setCurrentView('dashboard'); onSpeak("Modifying citizen credentials"); }}
                    className="text-gov-secondary hover:underline"
                  >
                    Manage Profile →
                  </button>
                </div>
              </div>

              {/* Connected Services simulation */}
              <div className="space-y-2">
                <span className="text-[10px] font-black text-gov-text-secondary uppercase tracking-wider block text-left">Integrated Services Pipeline</span>
                
                <div className="space-y-1.5">
                  {[
                    { label: "DigiLocker OCR Scanner", status: "Active & Secured", color: "bg-gov-primary/10 text-gov-primary border-gov-primary/20" },
                    { label: "State Municipal Grievance API", status: "Connected - Live", color: "bg-gov-secondary/10 text-gov-primary border-gov-secondary/20" },
                    { label: "Central Scholarship Registry", status: "Synchronized", color: "bg-gov-success/15 text-gov-success border-gov-success/20" }
                  ].map((srv, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2.5 bg-gov-bg/30 border border-gov-border rounded-xl">
                      <span className="text-xs font-bold text-gov-text-primary text-left">{srv.label}</span>
                      <span className={`text-[9px] font-black px-2 py-0.5 rounded-md border uppercase ${srv.color}`}>{srv.status}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Floating micro indicators decoration (Trust elements) */}
              <div className="flex items-center justify-center space-x-3 text-[11px] text-gov-text-secondary font-bold pt-2 border-t border-gov-border">
                <span className="flex items-center space-x-1">
                  <CheckCircle className="w-3.5 h-3.5 text-gov-success" />
                  <span>MeitY Compliant</span>
                </span>
                <span>•</span>
                <span className="flex items-center space-x-1">
                  <Lock className="w-3.5 h-3.5 text-gov-secondary" />
                  <span>256-bit AES</span>
                </span>
                <span>•</span>
                <span className="flex items-center space-x-1">
                  <Eye className="w-3.5 h-3.5 text-gov-saffron" />
                  <span>WCAG 2.1 Compliant</span>
                </span>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* LIVE GOVERNMENT STATISTICS BAR */}
      <section className="bg-gov-primary py-8 text-white z-10 relative shadow-inner overflow-hidden border-y border-gov-border/40">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/30 via-transparent to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-6">
            <span className="text-[10px] font-black uppercase tracking-widest text-gov-saffron bg-white/10 px-3 py-1 rounded-full border border-white/15">
              Live National Governance Analytics
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {[
              { label: "Registered Citizens", value: liveStats.citizens.toLocaleString() + "+", icon: Users, color: "text-gov-saffron" },
              { label: "Live AI Queries Today", value: liveStats.queriesToday.toLocaleString() + "+", icon: MessageSquare, color: "text-blue-300" },
              { label: "Complaints Resolved", value: liveStats.resolved.toFixed(3) + "%", icon: Activity, color: "text-emerald-400" },
              { label: "Verified Documents", value: liveStats.verifiedDocs.toLocaleString() + "+", icon: ShieldCheck, color: "text-indigo-300" },
              { label: "Total Direct Benefits Paid", value: "₹" + (liveStats.schemesClaimed / 10000000).toFixed(2) + " Cr+", icon: Coins, color: "text-yellow-400" }
            ].map((st, idx) => (
              <div key={idx} className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center flex flex-col items-center justify-center space-y-1.5 shadow-xs hover:bg-white/10 transition-colors">
                <div className={`p-2 bg-white/10 rounded-xl ${st.color}`}>
                  <st.icon className="w-4.5 h-4.5" />
                </div>
                <h4 className="text-xl sm:text-2xl font-black tracking-tight font-heading">{st.value}</h4>
                <p className="text-[9px] text-slate-300 font-extrabold uppercase tracking-wider leading-tight">{st.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AI RECOMMENDATION SECTION - PROFILE DRIVEN */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="bg-gov-surface border-2 border-gov-primary/10 rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-lg">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gov-saffron/10 rounded-bl-full pointer-events-none" />
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gov-border pb-6 mb-6">
            <div className="text-left space-y-1.5">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-5 h-5 text-gov-saffron animate-pulse" />
                <h2 className="text-2xl font-black text-gov-primary font-heading">Recommended For You</h2>
              </div>
              <p className="text-gov-text-secondary text-xs sm:text-sm font-semibold">
                Personalized benefits evaluated based on your registered Citizen Profile state: <strong className="text-gov-primary">{profile.state}</strong> • Occupation: <strong className="text-gov-primary capitalize">{profile.occupation}</strong> • Age: <strong className="text-gov-primary">{profile.age}</strong>
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button 
                onClick={() => { setCurrentView('dashboard'); onSpeak("Opening profile dashboard"); }}
                className="px-4 py-2 bg-gov-primary text-white font-extrabold text-xs rounded-xl hover:bg-gov-secondary transition-all cursor-pointer flex items-center space-x-1"
              >
                <Settings className="w-3.5 h-3.5" />
                <span>Adjust Profile Criteria</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {getPersonalizedSchemes().slice(0, 3).map((sch, idx) => (
              <div 
                key={idx}
                className="bg-gov-bg/40 border border-gov-border rounded-2xl p-5 flex flex-col justify-between hover:border-gov-primary/30 hover:shadow-md transition-all text-left relative"
              >
                <div className="absolute top-4 right-4 bg-gov-success/10 text-gov-success border border-gov-success/20 text-[9px] font-black px-2 py-0.5 rounded-sm uppercase tracking-wider">
                  {sch.score}% Match Score
                </div>

                <div className="space-y-3">
                  <span className="text-[10px] font-black text-gov-secondary uppercase tracking-widest block">{sch.tag}</span>
                  <h3 className="text-sm font-black text-gov-primary leading-snug line-clamp-2">{sch.name}</h3>
                  
                  <div className="space-y-1.5 text-xs text-gov-text-secondary">
                    <p className="font-semibold"><strong className="text-gov-text-primary">Department:</strong> {sch.dept}</p>
                    <p className="font-semibold"><strong className="text-gov-text-primary">Key Benefits:</strong> {sch.benefits}</p>
                  </div>
                </div>

                <div className="pt-4 border-t border-gov-border mt-4 flex items-center justify-between">
                  <span className="text-[9px] bg-gov-saffron/10 text-gov-primary px-2 py-0.5 rounded-sm font-black uppercase">Based on Age/Occupation</span>
                  <button 
                    onClick={() => { setCurrentView('schemes'); onSpeak(`Analyzing scheme ${sch.name}`); }}
                    className="text-xs font-black text-gov-secondary hover:text-gov-primary hover:underline flex items-center space-x-1"
                  >
                    <span>Check eligibility</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* QUICK GOVERNMENT SERVICES HUB (14 Items) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-left">
        <div className="text-left space-y-2 mb-8">
          <div className="flex items-center space-x-2">
            <Building className="w-5.5 h-5.5 text-gov-primary" />
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gov-primary font-heading">
              Quick Government Services
            </h2>
          </div>
          <p className="text-gov-text-secondary text-sm font-semibold">
            Access, verify, and apply directly for major state and central municipal certificates under standard procedures.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {quickServices.map((srv, idx) => (
            <div 
              key={idx}
              className="bg-gov-surface border border-gov-border hover:border-gov-primary/30 rounded-2xl p-4.5 flex flex-col justify-between hover:shadow-lg hover:-translate-y-1 transition-all text-left group"
            >
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-gov-bg flex items-center justify-center border border-gov-border group-hover:bg-gov-primary/10 transition-colors">
                  <srv.icon className="w-5.5 h-5.5 text-gov-primary" />
                </div>
                
                <div className="space-y-1">
                  <h3 className="text-sm font-black text-gov-primary group-hover:text-gov-secondary transition-colors">{srv.title}</h3>
                  <p className="text-[10px] text-gov-text-secondary font-bold uppercase tracking-wider">{srv.dept}</p>
                </div>

                <p className="text-xs text-gov-text-secondary leading-normal line-clamp-3 font-semibold">
                  {srv.desc}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-gov-border flex items-center justify-between">
                <button 
                  onClick={() => { setCurrentView('services'); onSpeak(`Form loader for ${srv.title}`); }}
                  className="px-3 py-1.5 bg-gov-primary hover:bg-gov-secondary text-white text-[10px] font-black rounded-lg transition-colors cursor-pointer"
                >
                  Apply Online
                </button>
                <button 
                  onClick={() => {
                    onSpeak(`${srv.title} is managed by ${srv.dept}. ${srv.desc}`);
                  }}
                  className="text-[10px] font-black text-gov-text-secondary hover:text-gov-primary"
                >
                  Learn More
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* WHAT'S NEW - MODERN CAROUSEL */}
      <section className="bg-gov-surface border-y border-gov-border py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div className="text-left space-y-1.5">
              <div className="flex items-center space-x-2">
                <Bell className="w-5 h-5 text-gov-saffron" />
                <h2 className="text-2xl font-black text-gov-primary font-heading">What's New</h2>
              </div>
              <p className="text-gov-text-secondary text-xs sm:text-sm font-semibold">Stay updated with the latest digital initiatives, announcements, and policy rollouts.</p>
            </div>

            <div className="flex items-center space-x-2">
              <button 
                onClick={() => setCarouselIndex(prev => (prev === 0 ? carouselItems.length - 1 : prev - 1))}
                className="p-2 border border-gov-border hover:bg-gov-bg rounded-xl text-gov-primary transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button 
                onClick={() => setCarouselIndex(prev => (prev === carouselItems.length - 1 ? 0 : prev + 1))}
                className="p-2 border border-gov-border hover:bg-gov-bg rounded-xl text-gov-primary transition-colors cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Carousel Card */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-gov-primary to-blue-950 p-6 sm:p-10 text-white text-left shadow-lg">
            <div className="absolute inset-0 bg-cover bg-center mix-blend-overlay opacity-10" />
            
            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              <div className="lg:col-span-8 space-y-4">
                <span className="px-3 py-1 bg-white/15 text-gov-saffron text-[10px] font-black rounded-md border border-white/10 uppercase tracking-widest inline-block">
                  {carouselItems[carouselIndex].category}
                </span>
                
                <h3 className="text-2xl sm:text-3xl font-black font-heading leading-tight">
                  {carouselItems[carouselIndex].title}
                </h3>
                
                <p className="text-slate-200 text-xs sm:text-sm max-w-2xl leading-relaxed font-semibold">
                  {carouselItems[carouselIndex].desc}
                </p>

                <div className="pt-2 flex items-center space-x-3">
                  <button 
                    onClick={() => {
                      const link = carouselItems[carouselIndex].link as AppView;
                      setCurrentView(link);
                      onSpeak(`Proceeding to ${carouselItems[carouselIndex].title}`);
                    }}
                    className="px-5 py-2.5 bg-gov-saffron hover:bg-gov-saffron/90 text-gov-primary font-black text-xs rounded-xl shadow-md cursor-pointer transition-transform active:scale-95 flex items-center space-x-1.5"
                  >
                    <span>{carouselItems[carouselIndex].action}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => onSpeak(`${carouselItems[carouselIndex].title}. ${carouselItems[carouselIndex].desc}`)}
                    className="px-4 py-2.5 bg-white/10 hover:bg-white/15 text-white font-extrabold text-xs rounded-xl border border-white/10 cursor-pointer"
                  >
                    Hear Announcement
                  </button>
                </div>
              </div>

              {/* Graphical mini layout decoration for the carousel */}
              <div className="hidden lg:col-span-4 lg:flex items-center justify-center">
                <div className="w-40 h-40 rounded-full border-4 border-white/10 flex items-center justify-center bg-white/5 relative">
                  <Sparkles className="w-16 h-16 text-gov-saffron/60 animate-pulse" />
                  <div className="absolute top-4 right-4 w-6 h-6 bg-gov-secondary rounded-full animate-bounce" />
                </div>
              </div>
            </div>

            {/* Pagination Indicators */}
            <div className="flex justify-center space-x-1.5 mt-6 sm:mt-8">
              {carouselItems.map((_, idx) => (
                <button 
                  key={idx}
                  onClick={() => setCarouselIndex(idx)}
                  className={`w-2.5 h-2.5 rounded-full transition-all ${idx === carouselIndex ? 'bg-gov-saffron w-6' : 'bg-white/40 hover:bg-white/60'}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SERVICES BY STATE - INTERACTIVE SELECTOR */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="text-left space-y-2 mb-8">
          <div className="flex items-center space-x-2">
            <Globe className="w-5.5 h-5.5 text-gov-primary animate-spin-slow" />
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gov-primary font-heading">
              Services By State
            </h2>
          </div>
          <p className="text-gov-text-secondary text-sm font-semibold">
            Select any state or union territory below to access specialized localized state departments, schemes, and nearby service centers.
          </p>
        </div>

        {/* STATE BUTTON TABS */}
        <div className="flex flex-wrap gap-2 mb-6 justify-start">
          {Object.keys(stateData).map((stateName) => (
            <button
              key={stateName}
              onClick={() => { setSelectedState(stateName); onSpeak(`Selecting state database for ${stateName}`); }}
              className={`px-4 py-2.5 rounded-xl text-xs font-black border transition-all cursor-pointer ${
                selectedState === stateName 
                  ? 'bg-gov-primary text-white border-gov-primary shadow-md' 
                  : 'bg-gov-surface text-gov-text-primary border-gov-border hover:bg-gov-bg'
              }`}
            >
              {stateName}
            </button>
          ))}
          <span className="px-3 py-2 bg-gov-bg text-gov-text-secondary rounded-xl text-[10px] font-bold border border-gov-border flex items-center">
            + 22 More States Integrated
          </span>
        </div>

        {/* STATE DATA RESULTS DISPLAY */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-gov-surface border border-gov-border rounded-3xl p-6 shadow-sm">
          {/* State Briefing card */}
          <div className="lg:col-span-4 bg-gov-bg/60 border border-gov-border rounded-2xl p-5 text-left space-y-4">
            <div className="flex items-center space-x-2">
              <MapPin className="w-5 h-5 text-gov-saffron" />
              <h3 className="text-lg font-black text-gov-primary font-heading">{selectedState} State Portal</h3>
            </div>
            
            <p className="text-xs text-gov-text-secondary leading-relaxed font-semibold">
              Currently connected to the direct municipal database of {selectedState} through official state telemetry pipelines.
            </p>

            <div className="bg-gov-surface p-3.5 rounded-xl border border-gov-border text-xs">
              <span className="font-bold text-gov-primary block mb-1">State Digital Center:</span>
              <p className="text-gov-text-secondary font-semibold leading-relaxed">
                {stateData[selectedState].centers[0]}
              </p>
            </div>

            <button 
              onClick={() => { setCurrentView('services'); onSpeak(`Redirecting to complete state services directory for ${selectedState}`); }}
              className="w-full py-2.5 bg-gov-primary hover:bg-gov-secondary text-white font-extrabold text-xs rounded-xl shadow-xs transition-colors cursor-pointer text-center block"
            >
              Access All {selectedState} Services
            </button>
          </div>

          {/* Details breakdown */}
          <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-5 text-left">
            <div className="space-y-2">
              <span className="text-[10px] font-black text-gov-text-secondary uppercase tracking-widest block">Active State Departments</span>
              <div className="space-y-2">
                {stateData[selectedState].departments.map((dept, i) => (
                  <div key={i} className="p-3 bg-gov-bg/30 border border-gov-border rounded-xl flex items-center space-x-2 text-xs font-semibold">
                    <Building className="w-4 h-4 text-gov-primary shrink-0" />
                    <span className="truncate">{dept}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-[10px] font-black text-gov-text-secondary uppercase tracking-widest block">Localized State Schemes</span>
              <div className="space-y-2">
                {stateData[selectedState].schemes.map((sch, i) => (
                  <div key={i} className="p-3 bg-gov-bg/30 border border-gov-border rounded-xl flex items-center space-x-2 text-xs font-semibold">
                    <Award className="w-4 h-4 text-gov-saffron shrink-0" />
                    <span className="truncate">{sch}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-[10px] font-black text-gov-text-secondary uppercase tracking-widest block">Popular E-Services</span>
              <div className="space-y-2">
                {stateData[selectedState].services.map((srv, i) => (
                  <div key={i} className="p-3 bg-gov-bg/30 border border-gov-border rounded-xl flex items-center space-x-2 text-xs font-semibold">
                    <FileText className="w-4 h-4 text-gov-secondary shrink-0" />
                    <span className="truncate">{srv}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-[10px] font-black text-gov-text-secondary uppercase tracking-widest block">Grievance & Resolution Offices</span>
              <div className="space-y-2">
                {stateData[selectedState].offices.map((off, i) => (
                  <div key={i} className="p-3 bg-gov-bg/30 border border-gov-border rounded-xl flex items-center space-x-2 text-xs font-semibold">
                    <AlertCircle className="w-4 h-4 text-gov-success shrink-0" />
                    <span className="truncate">{off}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SERVICE CATEGORIES */}
      <section className="bg-gov-surface border-y border-gov-border py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-10 space-y-2">
            <h2 className="text-2xl sm:text-3xl font-black text-gov-primary font-heading">
              Service Categories
            </h2>
            <p className="text-gov-text-secondary text-xs sm:text-sm font-semibold">
              Browse through structured citizen service portfolios grouped by focus department.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {categories.map((cat, idx) => (
              <div 
                key={idx}
                onClick={() => { setCurrentView('services'); onSpeak(`Browsing category ${cat.title}`); }}
                className="bg-gov-bg/40 border border-gov-border rounded-2xl p-5 hover:border-gov-primary/40 hover:shadow-md transition-all cursor-pointer text-left flex flex-col justify-between group h-full"
              >
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-gov-surface flex items-center justify-center border border-gov-border text-gov-primary group-hover:bg-gov-primary group-hover:text-white transition-all">
                    <cat.icon className="w-5 h-5" />
                  </div>
                  
                  <div className="space-y-1">
                    <h3 className="text-sm font-black text-gov-primary group-hover:text-gov-secondary transition-colors">{cat.title}</h3>
                    <p className="text-[10px] text-gov-secondary font-black">{cat.count}</p>
                  </div>

                  <p className="text-xs text-gov-text-secondary leading-normal font-semibold">
                    {cat.desc}
                  </p>
                </div>

                <div className="flex items-center space-x-1 text-[10px] font-black text-gov-secondary pt-4 group-hover:translate-x-1 transition-transform">
                  <span>Browse Category</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED SCHEMES - FILTER TABS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div className="text-left space-y-1.5">
            <div className="flex items-center space-x-2">
              <Award className="w-5.5 h-5.5 text-gov-saffron" />
              <h2 className="text-2xl sm:text-3xl font-extrabold text-gov-primary font-heading">
                Featured Government Schemes
              </h2>
            </div>
            <p className="text-gov-text-secondary text-sm font-semibold">
              Explore highlighted social security plans, cash-incentive benefits, and scholarships from state and central agencies.
            </p>
          </div>

          {/* FILTER PILLS */}
          <div className="flex flex-wrap gap-1.5 justify-start md:justify-end">
            {(['AI Recommended', 'Trending', 'Closing Soon', 'New', 'Popular'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => { setSchemeFilter(tab); onSpeak(`Filtering schemes by ${tab}`); }}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-black border transition-all cursor-pointer ${
                  schemeFilter === tab 
                    ? 'bg-gov-saffron text-gov-primary border-gov-saffron shadow-sm' 
                    : 'bg-gov-surface text-gov-text-primary border-gov-border hover:bg-gov-bg'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* SCHEME CARD RENDERING */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {getActiveSchemeList().map((sch, idx) => (
            <div 
              key={idx}
              className="bg-gov-surface border border-gov-border rounded-2xl p-6 text-left flex flex-col justify-between hover:border-gov-primary/30 hover:shadow-md transition-all relative"
            >
              <div className="absolute top-6 right-6 bg-gov-secondary/15 text-gov-primary text-[10px] font-black px-2.5 py-0.5 rounded-sm border border-gov-secondary/25 uppercase">
                {sch.tag}
              </div>

              <div className="space-y-4">
                <div className="space-y-1.5 max-w-[80%]">
                  <h3 className="text-base font-black text-gov-primary font-heading leading-snug">{sch.name}</h3>
                  <p className="text-[10px] text-gov-text-secondary font-bold uppercase tracking-wider">{sch.dept}</p>
                </div>

                <div className="p-4 bg-gov-bg/35 border border-gov-border rounded-xl space-y-2 text-xs text-gov-text-secondary">
                  <p className="font-semibold"><strong className="text-gov-text-primary">Financial Benefits:</strong> {sch.benefits}</p>
                  <p className="font-semibold"><strong className="text-gov-text-primary">Match Suitability:</strong> {sch.score}% eligibility likelihood based on profile criteria</p>
                </div>
              </div>

              <div className="pt-6 border-t border-gov-border mt-6 flex flex-wrap gap-2 items-center justify-between">
                <div className="flex space-x-1.5">
                  <button 
                    onClick={() => { setCurrentView('schemes'); onSpeak(`Starting application for ${sch.name}`); }}
                    className="px-4 py-2 bg-gov-primary hover:bg-gov-secondary text-white text-xs font-black rounded-lg transition-colors cursor-pointer"
                  >
                    Apply Now
                  </button>
                  <button 
                    onClick={() => { onSpeak(`Saved scheme ${sch.name} to dashboard`); }}
                    className="p-2 border border-gov-border hover:bg-gov-bg rounded-lg text-gov-text-secondary hover:text-gov-primary transition-colors cursor-pointer"
                    title="Save Scheme"
                  >
                    <Heart className="w-3.5 h-3.5" />
                  </button>
                  <button 
                    onClick={() => { onSpeak(`Generating direct sharing credentials`); }}
                    className="p-2 border border-gov-border hover:bg-gov-bg rounded-lg text-gov-text-secondary hover:text-gov-primary transition-colors cursor-pointer"
                    title="Share Scheme"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                </div>

                <span className="text-[10px] text-gov-text-secondary font-bold">Applications open via Single Sign-On</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* DIGILOCKER SECTION - MODERN DOCUMENT SCANNER & OCR */}
      <section className="bg-gov-surface border-y border-gov-border py-14 text-left">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Description Side */}
            <div className="lg:col-span-5 space-y-5 text-left">
              <div className="inline-flex items-center space-x-1.5 px-3 py-1 bg-gov-primary/10 text-gov-primary border border-gov-primary/20 rounded-md text-[10px] font-black uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4 text-gov-success animate-pulse" />
                <span>DigiLocker Certified Platform</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold text-gov-primary font-heading leading-tight">
                Modern Document Management & OCR
              </h2>

              <p className="text-gov-text-secondary text-xs sm:text-sm leading-relaxed font-semibold">
                Securely scan, verify, and store central documents like PAN, Aadhaar, and Driving Licenses. Our built-in AI explains complex terms in simple 5th-grade English.
              </p>

              <div className="space-y-2">
                <span className="text-[10px] font-black text-gov-text-secondary uppercase tracking-widest block">Select Mock Scanned Document:</span>
                <div className="flex flex-wrap gap-2">
                  {["Aadhaar Card", "PAN Card", "Driving License", "Income Certificate"].map((docName) => (
                    <button
                      key={docName}
                      onClick={() => { handleDocSelection(docName); onSpeak(`Uploading mock ${docName}`); }}
                      className="px-3 py-2 bg-gov-bg hover:bg-gov-border text-gov-primary border border-gov-border rounded-xl text-xs font-black transition-colors cursor-pointer active:scale-95"
                    >
                      {docName}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Upload Panel Simulator */}
            <div className="lg:col-span-7">
              <div className="bg-gov-bg/65 border border-gov-border rounded-3xl p-6 relative overflow-hidden">
                <div className="border-2 border-dashed border-gov-border rounded-2xl p-6 text-center bg-gov-surface space-y-4">
                  <Upload className="w-10 h-10 text-gov-secondary mx-auto animate-bounce" />
                  
                  <div className="space-y-1">
                    <span className="text-sm font-black text-gov-primary block">Drag & Drop Scanned Document Here</span>
                    <p className="text-[10px] text-gov-text-secondary font-bold uppercase tracking-wider">Supports PDF, PNG, JPG up to 10MB (AES-256 encrypted)</p>
                  </div>

                  <button 
                    onClick={() => { handleDocSelection("Aadhaar Card"); }}
                    className="px-4 py-2 bg-gov-primary hover:bg-gov-secondary text-white font-extrabold text-xs rounded-xl transition-all shadow-xs cursor-pointer"
                  >
                    Browse Local Storage
                  </button>
                </div>

                {/* Uploading Status Overlay */}
                <AnimatePresence>
                  {isUploadingDoc && (
                    <motion.div 
                      initial={{ opacity: 0 }} 
                      animate={{ opacity: 1 }} 
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 bg-gov-surface/90 flex flex-col items-center justify-center space-y-4 rounded-3xl"
                    >
                      <RefreshCw className="w-10 h-10 text-gov-secondary animate-spin" />
                      <div className="text-center space-y-1">
                        <span className="font-extrabold text-gov-primary text-sm block">AI Document Intelligence System</span>
                        <p className="text-[10px] text-gov-text-secondary font-bold uppercase tracking-widest animate-pulse">Running OCR, Extracting Fields, Simplifying Terms...</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* OCR results preview */}
                <AnimatePresence>
                  {ocrResult && !isUploadingDoc && (
                    <motion.div 
                      initial={{ opacity: 0, y: 15 }} 
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-6 p-4 bg-gov-surface border border-gov-border rounded-2xl text-left space-y-3 shadow-md"
                    >
                      <div className="flex items-center justify-between border-b border-gov-border pb-2">
                        <div className="flex items-center space-x-1.5 text-xs font-black text-gov-primary">
                          <CheckCircle2 className="w-4 h-4 text-gov-success" />
                          <span>Extracted File: {ocrResult.docName}</span>
                        </div>
                        <span className="bg-gov-success/15 text-gov-success text-[8px] font-black px-2 py-0.5 rounded-sm border border-gov-success/25 uppercase">Verified Valid</span>
                      </div>

                      <div className="grid grid-cols-2 gap-3 text-xs">
                        <div>
                          <span className="text-[9px] text-gov-text-secondary font-bold block uppercase">Identified Doc Number</span>
                          <span className="text-gov-primary font-black font-mono">{ocrResult.num}</span>
                        </div>
                        <div>
                          <span className="text-[9px] text-gov-text-secondary font-bold block uppercase">Registered Holder</span>
                          <span className="text-gov-primary font-black">{ocrResult.holder}</span>
                        </div>
                      </div>

                      <div className="space-y-1 border-t border-gov-border pt-2 text-xs">
                        <span className="text-[9px] text-gov-text-secondary font-bold block uppercase">Official Legal Meaning:</span>
                        <p className="text-gov-text-primary leading-relaxed font-semibold">
                          {ocrResult.summary}
                        </p>
                      </div>

                      <div className="space-y-1 p-3 bg-gov-saffron/5 border-l-2 border-l-gov-saffron rounded-lg text-xs">
                        <span className="text-[9px] text-gov-saffron font-black block uppercase">Simplified Language (5th Grade Equivalent):</span>
                        <p className="text-gov-text-primary leading-normal font-semibold">
                          {ocrResult.simplified}
                        </p>
                      </div>

                      <div className="flex space-x-2 pt-2">
                        <button 
                          onClick={() => {
                            onSpeak(`Simplified description of your ${ocrResult.docName}: ${ocrResult.simplified}`);
                          }}
                          className="px-3 py-1.5 bg-gov-bg hover:bg-gov-border text-gov-primary border border-gov-border text-[10px] font-black rounded-lg transition-colors flex items-center space-x-1"
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                          <span>HEAR TRANSLATION</span>
                        </button>
                        <button 
                          onClick={() => {
                            onSpeak("Saving document securely to your DigiLocker folder");
                          }}
                          className="px-3 py-1.5 bg-gov-secondary text-white text-[10px] font-black rounded-lg hover:bg-gov-secondary/95 transition-all flex items-center space-x-1"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>SAVE TO DIGILOCKER</span>
                        </button>
                      </div>

                    </motion.div>
                  )}
                </AnimatePresence>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* COMPLAINT SECTION - PHOTO/VIDEO UPLOAD WITH LIVE TIMELINE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="bg-gov-surface border border-gov-border rounded-3xl p-6 sm:p-10 text-left shadow-lg">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left input and submission zone */}
            <div className="lg:col-span-6 space-y-5">
              <div className="flex items-center space-x-2 text-gov-primary">
                <AlertTriangle className="w-5.5 h-5.5 text-gov-saffron animate-bounce" />
                <h2 className="text-2xl sm:text-3xl font-black font-heading leading-tight">Civic Complaint Division</h2>
              </div>
              
              <p className="text-gov-text-secondary text-xs sm:text-sm leading-relaxed font-semibold">
                Submit potholes, water blockages, or electrical faults. Our automated Vision AI detects the hazard, tags GPS, files reports, and logs tickets to local authorities.
              </p>

              <div className="space-y-2">
                <span className="text-[10px] font-black text-gov-text-secondary uppercase tracking-widest block">Select Mock Media File:</span>
                <div className="flex flex-wrap gap-2">
                  <button 
                    onClick={() => { handleComplaintMediaSelect("Pothole"); onSpeak("Uploading pothole photo"); }}
                    className="px-3 py-2 bg-gov-bg hover:bg-gov-border text-gov-primary border border-gov-border rounded-xl text-xs font-black transition-colors cursor-pointer"
                  >
                    📸 Pothole on Highway
                  </button>
                  <button 
                    onClick={() => { handleComplaintMediaSelect("Garbage"); onSpeak("Uploading waste dump photo"); }}
                    className="px-3 py-2 bg-gov-bg hover:bg-gov-border text-gov-primary border border-gov-border rounded-xl text-xs font-black transition-colors cursor-pointer"
                  >
                    📸 Overflowing Waste Dump
                  </button>
                  <button 
                    onClick={() => { handleComplaintMediaSelect("Streetlight"); onSpeak("Uploading broken streetlight photo"); }}
                    className="px-3 py-2 bg-gov-bg hover:bg-gov-border text-gov-primary border border-gov-border rounded-xl text-xs font-black transition-colors cursor-pointer"
                  >
                    📸 Broken Streetlight
                  </button>
                </div>
              </div>

              <div className="bg-gov-bg/65 border border-gov-border rounded-2xl p-4 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-gov-primary">
                  <span>Geotag Location (Simulated GPS):</span>
                  <button className="text-gov-secondary" onClick={() => onSpeak("Syncing localized coordinates")}>Re-tag GPS</button>
                </div>
                <div className="flex items-center space-x-2 text-xs text-gov-text-secondary bg-gov-surface p-2.5 rounded-xl border border-gov-border font-semibold">
                  <MapPin className="w-4 h-4 text-gov-saffron shrink-0" />
                  <input 
                    type="text" 
                    value={complaintLocation}
                    onChange={(e) => setComplaintLocation(e.target.value)}
                    className="bg-transparent outline-none w-full font-bold"
                  />
                </div>
              </div>
            </div>

            {/* Right AI report and timeline */}
            <div className="lg:col-span-6">
              <div className="bg-gov-bg/65 border border-gov-border rounded-2xl p-5 relative overflow-hidden h-[380px] flex flex-col justify-between">
                
                {/* Processing Overlay */}
                <AnimatePresence>
                  {isProcessingComplaint && (
                    <motion.div 
                      initial={{ opacity: 0 }} 
                      animate={{ opacity: 1 }} 
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 bg-gov-surface/90 flex flex-col items-center justify-center space-y-4 z-10 rounded-2xl"
                    >
                      <RefreshCw className="w-10 h-10 text-gov-saffron animate-spin" />
                      <div className="text-center space-y-1">
                        <span className="font-extrabold text-gov-primary text-sm block">AI Hazard Inspection Engine</span>
                        <p className="text-[10px] text-gov-text-secondary font-bold uppercase tracking-widest animate-pulse">Running Computer Vision Model, Geotagging, Drafting Grievance...</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {detectedIssue ? (
                  <div className="space-y-4 flex-grow overflow-y-auto text-left">
                    <div className="flex items-center justify-between border-b border-gov-border pb-2">
                      <div className="space-y-0.5">
                        <span className="text-[10px] font-black text-gov-secondary uppercase tracking-wider block">Grievance Ticket: {detectedIssue.ticketId}</span>
                        <h4 className="text-sm font-black text-gov-primary">{detectedIssue.issue}</h4>
                      </div>
                      <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-sm uppercase tracking-wider ${
                        detectedIssue.priority === 'CRITICAL' ? 'bg-red-100 text-red-700 border border-red-200' : 'bg-amber-100 text-amber-700 border border-amber-200'
                      }`}>
                        {detectedIssue.priority}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div>
                        <span className="text-[9px] text-gov-text-secondary font-bold block uppercase">Assigned Authority</span>
                        <span className="text-gov-primary font-black">{detectedIssue.dept}</span>
                      </div>
                      <div>
                        <span className="text-[9px] text-gov-text-secondary font-bold block uppercase">AI Model Accuracy</span>
                        <span className="text-gov-success font-black">{detectedIssue.confidence}</span>
                      </div>
                    </div>

                    <p className="text-xs text-gov-text-secondary leading-normal bg-gov-surface p-3 border border-gov-border rounded-xl font-semibold">
                      <strong>Automatic Technical Report:</strong> {detectedIssue.description}
                    </p>

                    {/* Timeline visualization */}
                    <div className="space-y-2 border-t border-gov-border pt-3">
                      <span className="text-[9px] font-black text-gov-text-secondary uppercase tracking-wider block">Live Resolution Timeline</span>
                      
                      <div className="flex items-center justify-between text-[10px] font-black text-gov-primary">
                        <div className="flex items-center space-x-1 text-gov-success">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Submitted (AI logged)</span>
                        </div>
                        <div className="w-8 h-0.5 bg-gov-border" />
                        <div className="flex items-center space-x-1 text-gov-secondary">
                          <Clock className="w-3.5 h-3.5 animate-spin" />
                          <span>Assigned (24h)</span>
                        </div>
                        <div className="w-8 h-0.5 bg-gov-border" />
                        <span className="text-gov-text-secondary">Resolved</span>
                      </div>
                    </div>

                    <div className="pt-2 flex space-x-2">
                      <button 
                        onClick={() => {
                          const ticket = "SB-" + detectedIssue.ticketId.split('-')[2];
                          onSpeak(`Submitting complaint ticket ${ticket}. Priority assigned: ${detectedIssue.priority}. Municipal department assigned.`);
                          setCurrentView('complaints');
                        }}
                        className="px-4 py-2 bg-gov-primary text-white font-black text-xs rounded-lg hover:bg-gov-secondary transition-all cursor-pointer"
                      >
                        SUBMIT FORMAL TICKET
                      </button>
                      <button 
                        onClick={() => { onSpeak(`Automatic report details: ${detectedIssue.description}`); }}
                        className="p-2 border border-gov-border hover:bg-gov-bg rounded-lg text-gov-text-secondary transition-colors"
                        title="Hear Report"
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                    </div>

                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center space-y-4 my-auto">
                    <AlertOctagon className="w-12 h-12 text-gov-text-secondary" />
                    <div className="text-center space-y-1">
                      <span className="font-extrabold text-gov-primary text-sm block">No Grievance Selected</span>
                      <p className="text-xs text-gov-text-secondary max-w-sm mx-auto leading-relaxed font-semibold">
                        Select one of the mock options or upload a file. The computer vision pipeline will automatically analyze the damage, tag GPS coordinates, and map it.
                      </p>
                    </div>
                  </div>
                )}

              </div>
            </div>

          </div>

        </div>
      </section>

      {/* EMERGENCY SERVICES & DIRECT HELPLINES */}
      <section id="emergency-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="bg-red-500/5 border-2 border-red-200/50 rounded-3xl p-6 text-left shadow-xs">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-red-200 pb-5 mb-5">
            <div className="space-y-1">
              <div className="flex items-center space-x-2 text-red-700">
                <PhoneCall className="w-5.5 h-5.5 text-red-600 animate-bounce" />
                <h2 className="text-xl sm:text-2xl font-black font-heading leading-tight">National Emergency Helplines</h2>
              </div>
              <p className="text-red-800/80 text-xs sm:text-sm font-semibold">One-tap direct dialing lines for medical, disaster, fire, or civil safety emergencies across India.</p>
            </div>

            <span className="text-[10px] bg-red-600 text-white font-black px-3 py-1 rounded-full uppercase tracking-wider block shrink-0">
              Integrated National Services
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { label: "National Helpline", num: "112", icon: PhoneCall, desc: "Unified Emergency Response" },
              { label: "Police Services", num: "100", icon: ShieldCheck, desc: "Law Enforcement Support" },
              { label: "Ambulance", num: "102", icon: Heart, desc: "Medical Emergency" },
              { label: "Fire Services", num: "101", icon: Flame || AlertTriangle, desc: "Fire Protection Control" },
              { label: "Women Safety", num: "1091", icon: Users, desc: "Women Protection Line" },
              { label: "Disaster (NDRF)", num: "1078", icon: Globe, desc: "National Disaster Relief" }
            ].map((em, idx) => (
              <a 
                href={`tel:${em.num}`}
                key={idx}
                onClick={(e) => {
                  e.preventDefault();
                  onSpeak(`Dialing ${em.label} under number ${em.num}`);
                }}
                className="bg-white border border-red-200 hover:border-red-500 hover:shadow-md rounded-2xl p-4.5 text-center flex flex-col items-center justify-center space-y-1.5 transition-all group"
              >
                <div className="p-2.5 rounded-full bg-red-50 text-red-600 group-hover:bg-red-600 group-hover:text-white transition-all">
                  <em.icon className="w-5 h-5" />
                </div>
                <span className="text-[10px] text-red-800 font-black block uppercase">{em.label}</span>
                <h4 className="text-xl font-black text-red-600 tracking-tight">{em.num}</h4>
                <p className="text-[8px] text-gov-text-secondary leading-tight font-semibold uppercase">{em.desc}</p>
              </a>
            ))}
          </div>

          {/* Map pin finders */}
          <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-bold">
            <button 
              onClick={() => { onSpeak("Searching for closest government hospitals using GPS telemetry"); }}
              className="bg-white border border-red-200 rounded-xl p-3.5 flex items-center justify-between hover:border-red-400 transition-colors cursor-pointer text-red-800"
            >
              <div className="flex items-center space-x-2">
                <MapPin className="w-4.5 h-4.5 text-red-600" />
                <span>Locate Nearby Government Hospitals (ayushman)</span>
              </div>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button 
              onClick={() => { onSpeak("Finding nearest municipal police stations"); }}
              className="bg-white border border-red-200 rounded-xl p-3.5 flex items-center justify-between hover:border-red-400 transition-colors cursor-pointer text-red-800"
            >
              <div className="flex items-center space-x-2">
                <Building className="w-4.5 h-4.5 text-red-600" />
                <span>Locate Closest Civil Police Stations</span>
              </div>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      </section>

      {/* AI ASSISTANT DIV - CHAT CARD LAUNCHER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="bg-gradient-to-r from-gov-primary to-blue-900 border border-gov-border rounded-3xl p-6 sm:p-10 text-white text-left relative overflow-hidden shadow-lg">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-gov-saffron/15 via-transparent to-transparent pointer-events-none" />
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            <div className="lg:col-span-8 space-y-5">
              <div className="inline-flex items-center space-x-2 px-3 py-1 bg-white/10 text-gov-saffron border border-white/15 rounded-full text-xs font-bold tracking-wide uppercase">
                <Sparkles className="w-3.5 h-3.5 text-gov-saffron animate-pulse" />
                <span>Conversational Multilingual Agent</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-black font-heading leading-tight">
                AI Powered Chat & Translation Support
              </h2>

              <p className="text-slate-200 text-xs sm:text-sm leading-relaxed max-w-xl font-semibold">
                Talk with Bharat AI in over 10 regional Indian languages. Scan letters, verify receipts, generate scheme checks, or draft municipal complains entirely with conversational text-to-speech.
              </p>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-xs">
                {[
                  "Natively speaks 10+ languages",
                  "OCR receipt parsing",
                  "Auto scheme matching",
                  "GPS complaint analysis",
                  "Document summarization",
                  "Official government guidelines"
                ].map((ft, i) => (
                  <div key={i} className="flex items-center space-x-1.5 font-bold text-slate-100">
                    <CheckCircle2 className="w-4 h-4 text-gov-saffron shrink-0" />
                    <span>{ft}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-4 flex flex-col justify-center items-stretch sm:items-center space-y-3">
              <button 
                onClick={() => { setCurrentView('assistant'); onSpeak("Entering Bharat AI assistant canvas"); }}
                className="px-8 py-4 bg-gov-saffron hover:bg-gov-saffron/90 text-gov-primary font-black rounded-2xl shadow-lg shadow-gov-saffron/10 transition-transform hover:scale-105 cursor-pointer text-center flex items-center justify-center space-x-2 w-full max-w-xs"
              >
                <Bot className="w-5 h-5" />
                <span>Start AI Chat Session</span>
              </button>
              <span className="text-[11px] text-slate-300 font-bold text-center">No registration required for query search</span>
            </div>
          </div>
        </div>
      </section>

      {/* CITIZEN TESTIMONIALS & RATING */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="text-center max-w-3xl mx-auto mb-10 space-y-2">
          <h2 className="text-2xl sm:text-3xl font-black text-gov-primary font-heading">
            Citizen Satisfaction
          </h2>
          <p className="text-gov-text-secondary text-xs sm:text-sm font-semibold">
            Real feedback from citizens across Indian states who solved administrative hurdles with Smart Bharat.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              name: "Savitri Devi",
              role: "Farmer, Wardha",
              quote: "I spoke in Marathi. The AI recommended PM-Kisan, scanned my land papers, and explained the eligibility in minutes. I got my verification cleared easily!",
              tag: "PM-Kisan Approved",
              stars: 5,
              state: "Maharashtra"
            },
            {
              name: "Aryan Gupta",
              role: "Student, New Delhi",
              quote: "I took a photo of an enormous water leak. The platform auto-detected the pipeline damage, pinned the location, and lodged the report. PWD fixed it within 24 hours!",
              tag: "Grievance Cleared",
              stars: 5,
              state: "Delhi"
            },
            {
              name: "Karthik Subramanian",
              role: "Retired Postmaster, Madurai",
              quote: "Ayushman Bharat registration was incredibly simple. The OCR scanned my old identification cards, verified coordinates, and generated the draft checklist without error.",
              tag: "Health Card",
              stars: 5,
              state: "Tamil Nadu"
            }
          ].map((story, idx) => (
            <div key={idx} className="bg-gov-surface border border-gov-border rounded-3xl p-5 text-left flex flex-col justify-between space-y-4 shadow-sm">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-gov-secondary uppercase text-[10px] tracking-widest block">{story.tag}</span>
                  <span className="text-gov-text-secondary">{story.state}</span>
                </div>
                
                <div className="flex space-x-0.5 text-gov-saffron">
                  {Array.from({ length: story.stars }).map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-gov-saffron" />
                  ))}
                </div>

                <p className="text-gov-text-primary text-xs italic leading-relaxed font-semibold">
                  "{story.quote}"
                </p>
              </div>

              <div className="pt-4 border-t border-gov-border flex items-center justify-between text-xs">
                <div className="space-y-0.5">
                  <span className="font-bold text-gov-primary block">{story.name}</span>
                  <span className="text-[10px] text-gov-text-secondary block font-bold leading-none">{story.role}</span>
                </div>
                <span className="px-2 py-0.5 bg-gov-success/10 text-gov-success text-[8px] font-black rounded-sm border border-gov-success/20 uppercase">Citizen Verified</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-gov-primary text-white pt-14 pb-8 text-xs border-t-4 border-gov-saffron text-left relative overflow-hidden mt-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 relative z-10">
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 pb-10 border-b border-white/10">
            {/* Column 1: Logo and motto */}
            <div className="lg:col-span-4 space-y-4 text-left">
              <div className="flex items-center space-x-2">
                <span className="font-black text-lg text-white tracking-widest font-heading uppercase">
                  SMART <span className="text-gov-saffron">BHARAT</span>
                </span>
              </div>
              <p className="text-slate-200 text-xs leading-relaxed max-w-sm font-semibold">
                An advanced AI-powered national digital companion designed to democratize government services, schemes checking, and municipal grievance filings across all Indian states.
              </p>
              
              <div className="flex space-x-3 text-gov-saffron pt-2 text-xs font-bold uppercase tracking-wider">
                <span className="bg-white/10 px-2.5 py-1 rounded-sm border border-white/10">Satyameva Jayate</span>
                <span className="bg-white/10 px-2.5 py-1 rounded-sm border border-white/10">Digital India</span>
              </div>
            </div>

            {/* Column 2: Quick links */}
            <div className="lg:col-span-2 space-y-3">
              <h4 className="text-xs font-black uppercase text-gov-saffron tracking-wider font-heading">Application Links</h4>
              <div className="flex flex-col space-y-2 text-slate-200 font-semibold">
                <button onClick={() => setCurrentView('landing')} className="hover:text-white hover:underline text-left transition-colors">Home</button>
                <button onClick={() => setCurrentView('assistant')} className="hover:text-white hover:underline text-left transition-colors">AI Assistant</button>
                <button onClick={() => setCurrentView('services')} className="hover:text-white hover:underline text-left transition-colors">Services Hub</button>
                <button onClick={() => setCurrentView('schemes')} className="hover:text-white hover:underline text-left transition-colors">Schemes Matcher</button>
                <button onClick={() => setCurrentView('complaints')} className="hover:text-white hover:underline text-left transition-colors">Grievance Center</button>
              </div>
            </div>

            {/* Column 3: Government links */}
            <div className="lg:col-span-3 space-y-3">
              <h4 className="text-xs font-black uppercase text-gov-saffron tracking-wider font-heading">Government Resources</h4>
              <div className="flex flex-col space-y-2 text-slate-200 font-semibold">
                <a href="https://india.gov.in" target="_blank" rel="noopener noreferrer" className="hover:text-white hover:underline text-left">National Portal of India</a>
                <a href="https://mygov.in" target="_blank" rel="noopener noreferrer" className="hover:text-white hover:underline text-left">MyGov Citizen Engagement</a>
                <a href="https://meity.gov.in" target="_blank" rel="noopener noreferrer" className="hover:text-white hover:underline text-left">Ministry of Electronics & IT</a>
                <a href="https://digilocker.gov.in" target="_blank" rel="noopener noreferrer" className="hover:text-white hover:underline text-left">DigiLocker Portal</a>
                <a href="https://umang.gov.in" target="_blank" rel="noopener noreferrer" className="hover:text-white hover:underline text-left">Official UMANG Gateway</a>
              </div>
            </div>

            {/* Column 4: Contact & Emergency */}
            <div className="lg:col-span-3 space-y-3 text-left">
              <h4 className="text-xs font-black uppercase text-gov-saffron tracking-wider font-heading">National Helplines</h4>
              <div className="text-slate-200 text-xs font-semibold space-y-2">
                <p>National Emergency Number: <strong>112</strong></p>
                <p>Police Emergency Line: <strong>100</strong></p>
                <p>Disaster Control Room: <strong>1078</strong></p>
                <p>Women Safety Response: <strong>1091</strong></p>
                <p className="text-[11px] text-slate-300">Email: helpdesk-smartbharat@gov.in</p>
              </div>
            </div>

          </div>

          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-slate-300 pt-6">
            <p className="leading-relaxed font-semibold">
              © {new Date().getFullYear()} Smart Bharat Initiative. Designed in partnership with Digital India Corporation & MeitY. Supporting the National Digital Transformation Vision.
            </p>

            <div className="flex space-x-4 text-slate-200 font-bold uppercase tracking-wider text-[10px]">
              <span className="hover:text-white cursor-pointer">Privacy Policy</span>
              <span>•</span>
              <span className="hover:text-white cursor-pointer">Terms of Use</span>
              <span>•</span>
              <span className="hover:text-white cursor-pointer">RTI Information</span>
              <span>•</span>
              <span className="hover:text-white cursor-pointer">Accessibility Statement</span>
            </div>
          </div>
        </div>
      </footer>

      {/* FLOAT SCROLL TO TOP MICRO INTERACTION */}
      <button
        onClick={() => {
          window.scrollTo({ top: 0, behavior: 'smooth' });
          onSpeak("Scrolling to the top header.");
        }}
        className="fixed bottom-6 right-6 p-3 bg-gov-saffron text-gov-primary rounded-full shadow-lg hover:shadow-xl hover:scale-110 active:scale-95 transition-all z-40 border-2 border-white cursor-pointer"
        title="Scroll To Top"
      >
        <ChevronUp className="w-5 h-5 font-black" />
      </button>

      {/* FLOATING AI COMPANION PILL */}
      <button
        onClick={() => {
          setCurrentView('assistant');
          onSpeak("Entering smart chat interface");
        }}
        className="fixed bottom-6 left-6 px-4.5 py-3.5 bg-gov-primary hover:bg-gov-secondary text-white rounded-full shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all z-40 border border-gov-border cursor-pointer flex items-center space-x-2 animate-bounce"
        title="Quick AI Assistant"
      >
        <Bot className="w-4.5 h-4.5 text-gov-saffron animate-pulse" />
        <span className="text-xs font-black uppercase tracking-wider">Talk to AI</span>
      </button>

    </div>
  );
}
