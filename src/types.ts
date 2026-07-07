export type AppLanguage = 
  | 'English' 
  | 'Hindi' 
  | 'Marathi' 
  | 'Tamil' 
  | 'Gujarati';

export type AppView = 
  | 'landing' 
  | 'assistant' 
  | 'services' 
  | 'schemes' 
  | 'complaints' 
  | 'dashboard' 
  | 'admin';

export interface CitizenProfile {
  age: number;
  occupation: string;
  income: number;
  state: string;
  district?: string;
  category?: string;
  education: string;
  isFarmer: boolean;
  isStudent: boolean;
  isSenior: boolean;
  isBusinessOwner: boolean;
  gender: string;
  isDisabled: boolean;
}

export interface Scheme {
  name: string;
  eligibilityScore: number;
  category: string;
  benefits: string;
  documents: string[];
  deadline: string;
  steps: string[];
  website: string;
  aiExplanation: string;
}

export interface Complaint {
  id: string;
  issue: string;
  category: string;
  department: string;
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  gps: {
    lat: number;
    lng: number;
    address: string;
  };
  description: string;
  estimatedResolution: string;
  status: 'Submitted' | 'Verified' | 'Assigned' | 'Inspection' | 'Work Started' | 'Resolved';
  image: string;
  createdAt: string;
  citizenRating?: number;
  officerName?: string;
  officerPhone?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  parts: { text: string }[];
  timestamp: string;
  audioUrl?: string;
}

export interface DocIntelligenceResult {
  extractedData: {
    name?: string;
    dob?: string;
    docNumber?: string;
    address?: string;
    authority?: string;
  };
  verifiedStatus: string;
  summary: string;
  checklist: string[];
  termsExplanation: string;
  isExpired?: boolean;
  expiryDate?: string;
}

export interface AccessibilitySettings {
  highContrast: boolean;
  fontSize: 'normal' | 'large' | 'xlarge';
  screenReaderActive: boolean;
  offlineMode: boolean;
  simpleLanguage: boolean;
}
