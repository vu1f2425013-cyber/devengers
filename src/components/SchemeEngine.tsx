import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Award, 
  Sparkles, 
  User, 
  CheckCircle2, 
  Loader2, 
  Compass, 
  ExternalLink,
  Bookmark,
  Share2,
  Search,
  GraduationCap,
  Sprout,
  Building2,
  Heart,
  Wrench,
  Clock,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  Check,
  Eye,
  HelpCircle,
  FileText,
  X,
  ArrowLeftRight,
  Flame,
  ShieldAlert,
  Info,
  ChevronRight,
  Mic,
  Volume2,
  Trash2,
  History,
  Download,
  BookOpen,
  Home,
  HeartPulse,
  Briefcase
} from 'lucide-react';
import { CitizenProfile, AppLanguage } from '../types';
import VoiceReader from './VoiceReader';

interface SchemeEngineProps {
  language: AppLanguage;
  onSpeak: (text: string) => void;
  addNotification: (text: string, type: 'success' | 'info' | 'warning') => void;
  profile?: CitizenProfile;
  setProfile?: React.Dispatch<React.SetStateAction<CitizenProfile>>;
}

interface SchemeTranslations {
  name: string;
  department: string;
  description: string;
  benefits: string;
  eligibility: string;
  aiExplanation: string;
  steps: string[];
  documents: string[];
}

interface DetailedScheme {
  id: string;
  category: 'Education' | 'Healthcare' | 'Agriculture' | 'Women' | 'Business' | 'Housing' | 'Senior Citizens' | 'Youth';
  type: 'Central' | 'State';
  applicableStates: string[];
  minAge: number;
  maxAge: number;
  incomeLimit: number;
  genderRequirements: 'Male' | 'Female' | 'Any';
  requiresStudent?: boolean;
  requiresFarmer?: boolean;
  requiresSenior?: boolean;
  requiresBusinessOwner?: boolean;
  requiresDisability?: boolean;
  website: string;
  deadline: string;
  estimatedApprovalTime: string;
  popularityScore: number;
  priorityScore: number;
  complexity: 'Low' | 'Medium' | 'High';
  tags: string[];
  translations: Record<AppLanguage, SchemeTranslations>;
}

const statesList = [
  "All States", "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", 
  "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", 
  "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", 
  "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", 
  "West Bengal", "Delhi NCT"
];

// High fidelity UI static translation dictionaries
const UI_TRANSLATIONS: Record<AppLanguage, Record<string, string>> = {
  English: {
    title: "Government Schemes",
    subtitle: "Discover thousands of Central and State Government Schemes personalized specifically for you using Artificial Intelligence.",
    searchPlaceholder: "Ask Bharat AI: 'I am a student needing scholarship' or search 'PMAY'...",
    recommHeading: "Recommended For You",
    basedOn: "AI recommendations configured dynamically based on your demographics:",
    age: "Age",
    occupation: "Occupation",
    income: "Annual Income",
    state: "Domicile State",
    eligibility: "Eligibility",
    matchScore: "AI Match Score",
    applyNow: "Apply Now",
    officialSite: "Official Portal",
    learnMore: "Learn More",
    save: "Bookmark",
    saved: "Saved",
    share: "Share",
    compare: "Compare",
    documents: "Required Documents",
    steps: "Application Process",
    approvalTime: "Est. Approval Time",
    deadline: "Official Deadline",
    complexity: "Complexity Level",
    trackStatus: "Track Application",
    noMatches: "No exact schemes matched your profile.",
    closestMatches: "Closest Matches (Partially Qualified Suggestions)",
    emptyTitle: "No direct matching schemes identified",
    emptyTip: "Try updating your profile parameters or explore other categories below.",
    suggestTips: "Bharat AI Suggestion Tips to Qualify:"
  },
  Hindi: {
    title: "सरकारी कल्याणकारी योजनाएं",
    subtitle: "आर्टिफिशियल इंटेलिजेंस (AI) द्वारा विशेष रूप से आपके लिए अनुकूलित हजारों केंद्र और राज्य सरकार की योजनाओं की खोज करें।",
    searchPlaceholder: "भारत एआई से पूछें: 'मैं एक छात्र हूँ और मुझे छात्रवृत्ति चाहिए'...",
    recommHeading: "आपके लिए अनुशंसित योजनाएं",
    basedOn: "आपकी जनसांख्यिकी के आधार पर गतिशील रूप से कॉन्फ़िगर की गई एआई सिफारिशें:",
    age: "आयु",
    occupation: "व्यवसाय",
    income: "वार्षिक आय",
    state: "मूल राज्य",
    eligibility: "पात्रता",
    matchScore: "एआई मैच स्कोर",
    applyNow: "आवेदन करें",
    officialSite: "आधिकारिक पोर्टल",
    learnMore: "अधिक जानकारी",
    save: "बुकमार्क",
    saved: "सहेजा गया",
    share: "साझा करें",
    compare: "तुलना करें",
    documents: "आवश्यक दस्तावेज़",
    steps: "आवेदन की प्रक्रिया",
    approvalTime: "अनुमानित स्वीकृति समय",
    deadline: "आधिकारिक समय सीमा",
    complexity: "जटिलता का स्तर",
    trackStatus: "आवेदन की स्थिति",
    noMatches: "आपके प्रोफाइल से कोई सटीक योजना मेल नहीं खाई।",
    closestMatches: "निकटतम मेल (आंशिक रूप से योग्य सुझाव)",
    emptyTitle: "कोई प्रत्यक्ष मिलान योजना नहीं मिली",
    emptyTip: "कृपया अपने प्रोफाइल मापदंडों को अपडेट करें या नीचे दी गई श्रेणियों का पता लगाएं।",
    suggestTips: "योग्य होने के लिए भारत एआई सुझाव युक्तियाँ:"
  },
  Marathi: {
    title: "शासकीय कल्याणकारी योजना",
    subtitle: "कृत्रिम बुद्धिमत्ता (AI) वापरून तुमच्यासाठी वैयक्तिकृत केलेल्या हजारो केंद्र आणि राज्य सरकारच्या योजना शोधा.",
    searchPlaceholder: "भारत एआय विचारा: 'मी एक विद्यार्थी आहे आणि मला शिष्यवृत्ती हवी आहे'...",
    recommHeading: "तुमच्यासाठी शिफारस केलेल्या योजना",
    basedOn: "तुमच्या लोकसंख्याशास्त्रानुसार डायनॅमिकली कॉन्फिगर केलेल्या एआय शिफारसी:",
    age: "वय",
    occupation: "व्यवसाय",
    income: "वार्षिक उत्पन्न",
    state: "अधिवास राज्य",
    eligibility: "पात्रता",
    matchScore: "एआय मॅच स्कोर",
    applyNow: "अर्ज करा",
    officialSite: "अधिकृत पोर्टल",
    learnMore: "अधिक जाणून घ्या",
    save: "बुकमार्क",
    saved: "जतन केले",
    share: "शेअर करा",
    compare: "तुलना करा",
    documents: "आवश्यक कागदपत्रे",
    steps: "अर्ज प्रक्रिया",
    approvalTime: "अंदाजे मंजुरी वेळ",
    deadline: "अधिकृत अंतिम तारीख",
    complexity: "जटिलता स्तर",
    trackStatus: "अर्जाचा मागोवा",
    noMatches: "तुमच्या प्रोफाईलशी कोणतीही अचूक योजना जुळली नाही.",
    closestMatches: "जवळचे सामने (अंशतः पात्र शिफारसी)",
    emptyTitle: "थेट जुळणारी कोणतीही योजना सापडली नाही",
    emptyTip: "तुमचे प्रोफाइल पॅरामीटर्स अपडेट करण्याचा प्रयत्न करा किंवा इतर श्रेणी एक्सप्लोर करा.",
    suggestTips: "पात्र होण्यासाठी भारत एआय शिफारस टिपा:"
  },
  Tamil: {
    title: "அரசு நலத்திட்டங்கள்",
    subtitle: "செயற்கை நுண்ணறிவு (AI) மூலம் உங்களுக்காக பிரத்யேகமாக வடிவமைக்கப்பட்ட ஆயிரக்கணக்கான மத்திய மற்றும் மாநில அரசு திட்டங்களைக் கண்டறியுங்கள்.",
    searchPlaceholder: "பாரத் AI-யிடம் கேளுங்கள்: 'நான் ஒரு மாணவன் எனக்கு கல்வி உதவித்தொகை வேண்டும்'...",
    recommHeading: "உங்களுக்காக பரிந்துரைக்கப்படுபவை",
    basedOn: "உங்கள் சுயவிவரத்தின் அடிப்படையில் மாறும் வகையில் கட்டமைக்கப்பட்ட AI பரிந்துரைகள்:",
    age: "வயது",
    occupation: "தொழில்",
    income: "ஆண்டு வருமானம்",
    state: "வசிப்பிட மாநிலம்",
    eligibility: "தகுதி",
    matchScore: "AI பொருத்தம்",
    applyNow: "விண்ணப்பிக்கவும்",
    officialSite: "அதிகாரப்பூர்வ தளம்",
    learnMore: "மேலும் அறிய",
    save: "சேமி",
    saved: "சேமிக்கப்பட்டது",
    share: "பகிர்",
    compare: "ஒப்பிடு",
    documents: "தேவையான ஆவணங்கள்",
    steps: "விண்ணப்பிக்கும் முறை",
    approvalTime: "மதிப்பிடப்பட்ட ஒப்புதல் காலம்",
    deadline: "அதிகாரப்பூர்வ கடைசி தேதி",
    complexity: "சிக்கலான நிலை",
    trackStatus: "விண்ணப்ப கண்காணிப்பு",
    noMatches: "உங்கள் சுயவிவரத்துடன் எந்த திட்டமும் சரியாக பொருந்தவில்லை.",
    closestMatches: "நெருக்கமான பொருத்தங்கள் (பகுதி தகுதி பெற்ற பரிந்துரைகள்)",
    emptyTitle: "பொருந்தக்கூடிய திட்டங்கள் ஏதும் கண்டறியப்படவில்லை",
    emptyTip: "சுயவிவர அளவுருக்களை மாற்றியமைக்க அல்லது பிற பிரிவுகளை ஆராயவும்.",
    suggestTips: "தகுதி பெற பாரத் AI பரிந்துரைக்கும் உதவிக்குறிப்புகள்:"
  },
  Gujarati: {
    title: "સરકારી યોજનાઓ",
    subtitle: "આર્ટિફિશિયલ ઇન્ટેલિજન્સ (AI) દ્વારા ખાસ કરીને તમારા માટે પર્સનલાઇઝ્ડ કરેલી હજારો કેન્દ્ર અને રાજ્ય સરકારની યોજનાઓ શોધો.",
    searchPlaceholder: "ભારત AI ને પૂછો: 'હું વિદ્યાર્થી છું અને મને સ્કોલરશિપની જરૂર છે'...",
    recommHeading: "તમારા માટે ભલામણ કરેલ",
    basedOn: "તમારી પ્રોફાઇલ માહિતીના આધારે ડાયનેમિકલી ગોઠવેલ AI ભલામણો:",
    age: "ઉંમર",
    occupation: "વ્યવસાય",
    income: "વાર્ષિક આવક",
    state: "રાજ્ય",
    eligibility: "પાત્રતા",
    matchScore: "AI મેચ સ્કોર",
    applyNow: "અરજી કરો",
    officialSite: "સત્તાવાર વેબસાઇટ",
    learnMore: "વધુ માહિતી",
    save: "બુકમાર્ક",
    saved: "સાચવેલ",
    share: "શેર કરો",
    compare: "સરખામણી કરો",
    documents: "જરૂરી દસ્તાવેજો",
    steps: "અરજી કરવાની પ્રક્રિયા",
    approvalTime: "મંજૂરીનો સમય",
    deadline: "અંતિમ તારીખ",
    complexity: "જટિલતા",
    trackStatus: "અરજી ટ્રેક કરો",
    noMatches: "તમારી પ્રોફાઇલ સાથે કોઈ મેળ ખાતી યોજના મળી નથી.",
    closestMatches: "નજીકની મેળ ખાતી યોજનાઓ (અંશતઃ પાત્ર)",
    emptyTitle: "કોઈ સીધી મેળ ખાતી યોજના મળી નથી",
    emptyTip: "કૃપા કરીને તમારી પ્રોફાઇલ વિગતો અપડેટ કરો અથવા નીચે દર્શાવેલ કેટેગરીઝ તપાસો.",
    suggestTips: "પાત્ર બનવા માટે ભારત AI સૂચન ટિપ્સ:"
  }
};

const SCHEMES_DATABASE: DetailedScheme[] = [
  {
    id: "post_matric_scholarship",
    category: "Education",
    type: "Central",
    applicableStates: ["All"],
    minAge: 15,
    maxAge: 30,
    incomeLimit: 250000,
    requiresStudent: true,
    genderRequirements: "Any",
    website: "https://scholarships.gov.in",
    deadline: "31st Dec 2026",
    estimatedApprovalTime: "30-45 Days",
    popularityScore: 94,
    priorityScore: 92,
    complexity: "Medium",
    tags: ["scholarship", "student", "education", "degree", "post matric"],
    translations: {
      English: {
        name: "Post-Matric Scholarship Scheme",
        department: "Ministry of Social Justice & Empowerment",
        description: "Comprehensive financial assistance to student groups from low-income households ensuring continuous access to higher education.",
        benefits: "100% academic fee waiver plus monthly living maintenance allowances of up to ₹1,200.",
        eligibility: "Available to Indian students enrolled in Post-Matric courses (Class 11 to PhD) with annual parental income below ₹2.5 Lakhs.",
        aiExplanation: "You qualify perfectly as a registered student with annual income under the ceiling of ₹2.5 Lakhs.",
        steps: [
          "Register on the National Scholarship Portal (NSP).",
          "Fill in your academic history and link your Aadhaar Card.",
          "Upload documents and submit to your college nodal officer for verification."
        ],
        documents: ["Aadhaar Card", "Income Certificate", "Caste Certificate", "College Fee Receipt", "Previous Year Marksheet"]
      },
      Hindi: {
        name: "पोस्ट-मैट्रिक छात्रवृत्ति योजना",
        department: "सामाजिक न्याय और अधिकारिता मंत्रालय",
        description: "कम आय वाले परिवारों के छात्रों को उच्च शिक्षा तक निरंतर पहुंच सुनिश्चित करने के लिए व्यापक वित्तीय सहायता।",
        benefits: "100% शैक्षणिक शुल्क माफी और ₹1,200 प्रति माह तक का शैक्षणिक भत्ता।",
        eligibility: "₹2.5 लाख से कम वार्षिक आय वाले कक्षा 11 से पीएचडी पाठ्यक्रमों में नामांकित भारतीय छात्रों के लिए उपलब्ध।",
        aiExplanation: "आप ₹2.5 लाख की सीमा के तहत वार्षिक आय वाले एक पंजीकृत छात्र के रूप में पूरी तरह से अर्हता प्राप्त करते हैं।",
        steps: [
          "राष्ट्रीय छात्रवृत्ति पोर्टल (NSP) पर पंजीकरण करें।",
          "अपनी शैक्षणिक जानकारी भरें और अपना आधार कार्ड लिंक करें।",
          "दस्तावेज़ अपलोड करें और कॉलेज नोडल अधिकारी को सत्यापन के लिए भेजें।"
        ],
        documents: ["आधार कार्ड", "आय प्रमाण पत्र", "जाति प्रमाण पत्र", "कॉलेज शुल्क रसीद", "पिछली कक्षा की मार्कशीट"]
      },
      Marathi: {
        name: "पोस्ट-मॅट्रिक शिष्यवृत्ती योजना",
        department: "सामाजिक न्याय आणि सक्षमीकरण मंत्रालय",
        description: "कमी उत्पन्नातील कुटुंबातील विद्यार्थ्यांना उच्च शिक्षणाची दारे खुली ठेवण्यासाठी सर्वसमावेशक आर्थिक मदत.",
        benefits: "१००% शैक्षणिक शुल्क माफी आणि मासिक ₹१,२०० पर्यंतचा निवास/शैक्षणिक भत्ता.",
        eligibility: "वार्षिक उत्पन्न ₹२.५ लाखांच्या आत असणाऱ्या आणि इयत्ता ११ वी ते पीएचडी अभ्यासक्रमात प्रवेशित भारतीय विद्यार्थ्यांसाठी उपलब्ध.",
        aiExplanation: "तुम्ही एक विद्यार्थी आहात आणि तुमचे उत्पन्न ₹२.५ लाखांपेक्षा कमी असल्यामुळे तुम्ही या योजनेसाठी पात्र आहात.",
        steps: [
          "नॅशनल स्कॉलरशिप पोर्टल (NSP) वर नोंदणी करा.",
          "तुमचा शैक्षणिक इतिहास भरा आणि आधार कार्ड लिंक करा.",
          "आवश्यक कागदपत्रे अपलोड करून कॉलेजच्या पडताळणी अधिकाऱ्याकडे सबमिट करा."
        ],
        documents: ["आधार कार्ड", "उत्पन्नाचा दाखला", "जातीचा दाखला", "कॉलेज फी पावती", "मागील वर्षाची गुणपत्रिका"]
      },
      Tamil: {
        name: "போஸ்ட் மெட்ரிக் கல்வி உதவித்தொகை திட்டம்",
        department: "சமூக நீதி மற்றும் அதிகாரமளித்தல் அமைச்சகம்",
        description: "குறைந்த வருமானம் கொண்ட குடும்பங்களைச் சேர்ந்த மாணவர்கள் உயர்கல்வியைத் தொடர முழுமையான நிதி உதவி வழங்குதல்.",
        benefits: "100% கல்விக் கட்டணத் தள்ளுபடி மற்றும் மாதத்திற்கு ₹1,200 வரை பராமரிப்பு உதவித்தொகை.",
        eligibility: "பெற்றோரின் ஆண்டு வருமானம் ₹2.5 லட்சத்திற்கு மிகாமல் இருக்கும், 11-ஆம் வகுப்பு முதல் பிஎச்டி வரை பயிலும் இந்திய மாணவர்கள்.",
        aiExplanation: "வருமானம் ₹2.5 லட்சத்திற்கு மிகாமல் உள்ள பதிவுசெய்யப்பட்ட மாணவர் என்பதால் நீங்கள் இதற்கு முழு தகுதி உடையவர்.",
        steps: [
          "தேசிய கல்வி உதவித்தொகை போர்ட்டலில் (NSP) பதிவு செய்யவும்.",
          "கல்வி விவரங்களை பூர்த்தி செய்து, ஆதார் கார்டை இணைக்கவும்.",
          "ஆவணங்களை பதிவேற்றி, கல்லூரி சரிபார்ப்பு அதிகாரியிடம் சமர்ப்பிக்கவும்."
        ],
        documents: ["ஆதார் அட்டை", "வருமான சான்றிதழ்", "சாதி சான்றிதழ்", "கல்லூரி கட்டண ரசீது", "முந்தைய ஆண்டு மதிப்பெண் சான்றிதழ்"]
      },
      Gujarati: {
        name: "પોસ્ટ-મેટ્રિક સ્કોલરશિપ યોજના",
        department: "સામાજિક ન્યાય અને સત્તાધિકાર મંત્રાલય",
        description: "ઓછી આવક ધરાવતા પરિવારોના વિદ્યાર્થીઓને ઉચ્ચ શિક્ષણ ચાલુ રાખવા માટે આર્થિક સહાય પૂરી પાડવી.",
        benefits: "૧૦૦% શૈક્ષણિક ફી માફી અને માસિક ₹૧,૨૦૦ સુધીનું નિભાવ ભથ્થું.",
        eligibility: "વાર્ષિક આવક ₹૨.૫ લાખથી ઓછી હોય તેવા ધોરણ ૧૧ થી પીએચડીમાં અભ્યાસ કરતા ભારતીય વિદ્યાર્થીઓ માટે.",
        aiExplanation: "તમે એક વિદ્યાર્થી છો અને વાર્ષિક આવક ₹૨.૫ લાખથી ઓછી હોવાથી આ યોજના માટે સંપૂર્ણ પાત્ર છો.",
        steps: [
          "નેશનલ સ્કોલરશિપ પોર્ટલ (NSP) પર રજીસ્ટ્રેશન કરો.",
          "તમારી શૈક્ષણિક વિગતો ભરો અને આધાર કાર્ડ લિંક કરો.",
          "દસ્તાવેજો અપલોડ કરો અને તમારા કોલેજ નોડલ અધિકારીને મોકલો."
        ],
        documents: ["આધાર કાર્ડ", "આવકનું પ્રમાણપત્ર", "જાતિનું પ્રમાणપત્ર", "કોલેજ ફીની રસીદ", "છેલ્લા વર્ષની માર્કશીટ"]
      }
    }
  },
  {
    id: "pm_kisan_subsidy",
    category: "Agriculture",
    type: "Central",
    applicableStates: ["All"],
    minAge: 18,
    maxAge: 85,
    incomeLimit: 400000,
    requiresFarmer: true,
    genderRequirements: "Any",
    website: "https://pmkisan.gov.in",
    deadline: "Ongoing Window",
    estimatedApprovalTime: "15-20 Days",
    popularityScore: 97,
    priorityScore: 95,
    complexity: "Low",
    tags: ["farmer", "crop", "subsidy", "pm kisan", "agriculture", "land"],
    translations: {
      English: {
        name: "PM Kisan Samman Nidhi Yojana",
        department: "Ministry of Agriculture & Farmers Welfare",
        description: "Direct income support of ₹6,000 per year paid in three equal installments directly to landholding farming families.",
        benefits: "Guaranteed income transfer of ₹6,000 per annum paid in direct benefit transfers (DBT) every 4 months.",
        eligibility: "Small and marginal farming families owning cultivable land under their names with manageable non-farm income.",
        aiExplanation: "Matches your farming profile completely, enabling rapid registration using land records.",
        steps: [
          "Visit PM Kisan portal and select 'New Farmer Registration'.",
          "Enter Aadhaar and select state, land holding size and survey numbers.",
          "Complete biometric e-KYC validation via local CSC center."
        ],
        documents: ["Aadhaar Card", "Land Mutation Copy (7/12 extract)", "Bank Account Passbook", "Mobile number linked to Aadhaar"]
      },
      Hindi: {
        name: "पीएम किसान सम्मान निधि योजना",
        department: "कृषि और किसान कल्याण मंत्रालय",
        description: "खेती करने वाले परिवारों को प्रति वर्ष ₹6,000 की सीधी आय सहायता, जो सीधे बैंक खातों में तीन समान किश्तों में ट्रांसफर की जाती है।",
        benefits: "हर 4 महीने में ₹2,000 की किश्त के रूप में प्रति वर्ष ₹6,000 की गारंटीकृत आय सहायता (DBT)।",
        eligibility: "कृषि योग्य भूमि रखने वाले छोटे और सीमांत किसान परिवार, जिनके नाम पर वैध भूमि रिकॉर्ड हैं।",
        aiExplanation: "आपके किसान प्रोफाइल से पूरी तरह मेल खाता है, जिससे भूमि रिकॉर्ड के माध्यम से तेजी से पंजीकरण संभव है।",
        steps: [
          "पीएम किसान पोर्टल पर जाएं और 'नया किसान पंजीकरण' चुनें।",
          "आधार संख्या दर्ज करें और राज्य, भूमि जोत का आकार और खसरा नंबर चुनें।",
          "स्थानीय सीएससी केंद्र के माध्यम से बायोमेट्रिक ई-केवाईसी सत्यापन पूरा करें।"
        ],
        documents: ["आधार कार्ड", "खसरा खतौनी / भूमि रिकॉर्ड", "बैंक पासबुक", "आधार से लिंक मोबाइल नंबर"]
      },
      Marathi: {
        name: "पीएम किसान सन्मान निधी योजना",
        department: "कृषी आणि शेतकरी कल्याण मंत्रालय",
        description: "खातेदार शेतकरी कुटुंबांना प्रति वर्ष ₹६,००० थेट बँक खात्यात तीन समान हप्त्यांमध्ये मिळणारे उत्पन्न सहकार्य.",
        benefits: "दर ४ महिन्यांनी थेट बँक खात्यात जमा होणारी ₹२,००० ची खात्रीशीर मदत (वार्षिक ₹६,००० DBT).",
        eligibility: "स्वतःच्या नावावर शेतीयोग्य जमीन धारण करणारे अल्प व अत्यल्प भूधारक शेतकरी कुटुंब.",
        aiExplanation: "तुमच्या शेतकरी प्रोफाईलशी पूर्णपणे सुसंगत आहे, जमीन नोंदींनुसार त्वरित नावनोंदणी करता येईल.",
        steps: [
          "पीएम किसान पोर्टलला भेट देऊन 'नवीन शेतकरी नोंदणी' पर्याय निवडा.",
          "आधार कार्ड प्रविष्ट करा आणि राज्य, जमिनीचा भूखंड क्रमांक (७/१२) भरा.",
          "जवळच्या महा-ई-सेवा केंद्रात जाऊन बायोमेट्रिक ई-केवायसी पूर्ण करा."
        ],
        documents: ["आधार कार्ड", "७/१२ उतारा आणि ८ अ दाखला", "बँक पासबुक", "आधार लिंक मोबाईल नंबर"]
      },
      Tamil: {
        name: "பிரதமர் கிசான் சம்மான் நிதி திட்டம்",
        department: "வேளாண்மை மற்றும் விவசாயிகள் நல அமைச்சகம்",
        description: "நிலம் வைத்திருக்கும் விவசாய குடும்பங்களுக்கு ஆண்டுக்கு ₹6,000 நேரடி வருமான உதவி மூன்று சம தவணைகளாக நேரடியாக வழங்கப்படுகிறது.",
        benefits: "ஆண்டுக்கு ₹6,000 உத்தரவாதமான நேரடி வங்கி பரிமாற்றம் (தவணைக்கு ₹2,000 வீதம் 4 மாதங்களுக்கு ஒருமுறை).",
        eligibility: "சொந்த பெயரில் விவசாய நிலம் வைத்துள்ள சிறு மற்றும் குறு விவசாய குடும்பங்கள்.",
        aiExplanation: "உங்கள் விவசாய சுயவிவரத்துடன் சரியாகப் பொருந்துகிறது, நில ஆவணங்கள் மூலம் விரைவாக விண்ணப்பிக்கலாம்.",
        steps: [
          "பிஎம் கிசான் போர்ட்டலுக்குச் சென்று 'புதிய விவசாயி பதிவு' என்பதைத் தேர்ந்தெடுக்கவும்.",
          "ஆதார் எண்ணை உள்ளிட்டு, மாநிலம், நில அளவு மற்றும் சர்வே எண்களைத் தேர்ந்தெடுக்கவும்.",
          "உள்ளூர் பொது சேவை மையம் மூலம் பயோமெட்ரிக் இ-கேஒய்சி-யை பூர்த்தி செய்யவும்."
        ],
        documents: ["ஆதார் அட்டை", "பட்டா / சிட்டா நகல்", "வங்கி கணக்கு புத்தகத்தின் முதல் பக்கம்", "ஆதாருடன் இணைக்கப்பட்ட கைபேசி எண்"]
      },
      Gujarati: {
        name: "પીએમ કિસાન સન્માન નિધિ યોજના",
        department: "કૃષિ અને ખેડૂત કલ્યાણ મંત્રાલય",
        description: "ખેતી ધરાવતા પરિવારોને વાર્ષિક ₹૬,૦૦૦ ની સીધી આર્થિક સહાય, જે સીધી ત્રણ સમાન હપ્તામાં બેંક ખાતામાં જમા થાય છે.",
        benefits: "ડીબીટી દ્વારા દર ૪ મહિને ₹૨,૦૦૦ ના હપ્તા તરીકે વાર્ષિક ₹૬,૦૦૦ ની ખાતરીપૂર્વક સહાય.",
        eligibility: "પોતાના નામે ખેતીલાયક જમીન ધરાવતા નાના અને સીમાંત ખેડૂત પરિવારો.",
        aiExplanation: "તમારી પ્રોફાઇલ સાથે મેળ ખાય છે, જમીનના રેકોર્ડ દ્વારા ઝડપથી અરજી કરી શકાય છે.",
        steps: [
          "પીએમ કિસાન પોર્ટલ પર જાઓ અને 'નવા ખેડૂત નોંધણી' પસંદ કરો.",
          "આધાર નંબર દાખલ કરી રાજ્ય અને જમીન ખાતાની વિગતો ભરો.",
          "નજીકના સીએસસી સેન્ટર પર જઈ બાયોમેટ્રિક ઇ-કેવાયસી પ્રક્રિયા પૂર્ણ કરો."
        ],
        documents: ["આધાર કાર્ડ", "જમીનનો ઉતારો (૮-અ/૭-१૨)", "બેંક પાસબુક", "આધાર લિંક્ડ મોબાઈલ નંબર"]
      }
    }
  },
  {
    id: "pm_mudra_loans",
    category: "Business",
    type: "Central",
    applicableStates: ["All"],
    minAge: 18,
    maxAge: 65,
    incomeLimit: 1200000,
    requiresBusinessOwner: true,
    genderRequirements: "Any",
    website: "https://www.mudra.org.in",
    deadline: "Open All Year",
    estimatedApprovalTime: "7-10 Days",
    popularityScore: 91,
    priorityScore: 88,
    complexity: "Medium",
    tags: ["loan", "business", "funding", "mudra", "micro finance", "entrepreneur"],
    translations: {
      English: {
        name: "Pradhan Mantri Mudra Yojana (PMMY)",
        department: "Ministry of Finance & Micro-Enterprises",
        description: "Collateral-free business development loans up to ₹10 Lakhs categorised into Shishu, Kishor, and Tarun schemes for micro-enterprises.",
        benefits: "Collateral-free commercial loans with flexible interest rates, mudra cards, and low processing fees.",
        eligibility: "Non-corporate, non-farm small/micro enterprises operating in trading, manufacturing, or services sector.",
        aiExplanation: "Recommended for funding business expansion with subsidized interest structures.",
        steps: [
          "Prepare a detailed business plan outlining startup or expansion costs.",
          "Visit any public sector bank or complete application on Udyami Mitra portal.",
          "Submit business proof and receive customized Mudra Debit Card."
        ],
        documents: ["Aadhaar & PAN Card", "Business Registration Proof", "6 Months Bank Statements", "Project Cost Quotation"]
      },
      Hindi: {
        name: "प्रधानमंत्री मुद्रा योजना (PMMY)",
        department: "वित्त और सूक्ष्म उद्यम मंत्रालय",
        description: "सूक्ष्म उद्यमों के विकास के लिए बिना किसी गारंटी के ₹10 लाख तक के ऋण, जिन्हें शिशु, किशोर और तरुण श्रेणियों में विभाजित किया गया है।",
        benefits: "लचीली ब्याज दरों, मुद्रा डेबिट कार्ड और शून्य प्रोसेसिंग शुल्क के साथ गारंटी-मुक्त व्यापार ऋण।",
        eligibility: "व्यापार, विनिर्माण या सेवा क्षेत्र में काम करने वाले गैर-कॉर्पोरेट, गैर-कृषि लघु और सूक्ष्म उद्यम।",
        aiExplanation: "कम ब्याज दरों पर आपके व्यवसाय विस्तार के लिए वित्तपोषण के उद्देश्य से इसकी पुरजोर सिफारिश की जाती है।",
        steps: [
          "स्टार्टअप या विस्तार लागत को दर्शाने वाली एक विस्तृत व्यावसायिक योजना तैयार करें।",
          "किसी भी सार्वजनिक क्षेत्र के बैंक में जाएं या उद्यमी मित्र पोर्टल पर ऑनलाइन आवेदन करें।",
          "व्यावसायिक प्रमाण जमा करें और अपनी स्वीकृत राशि के साथ मुद्रा डेबिट कार्ड प्राप्त करें।"
        ],
        documents: ["आधार और पैन कार्ड", "व्यवसाय पंजीकरण प्रमाण पत्र", "6 महीने का बैंक स्टेटमेंट", "परियोजना लागत का कोटेशन"]
      },
      Marathi: {
        name: "प्रधानमंत्री मुद्रा योजना (PMMY)",
        department: "वित्त आणि सूक्ष्म-उद्योग मंत्रालय",
        description: "सूक्ष्म उद्योगांना विना-तारण ₹१० लाखांपर्यंतचे व्यावसायिक कर्ज, ज्याचे शिशु, किशोर आणि तरुण अशा तीन वर्गांत वर्गीकरण केले आहे.",
        benefits: "कोणत्याही हमीशिवाय व्यावसायिक कर्ज, कमी व्याजदर, मुद्रा कार्ड आणि शून्य प्रक्रिया शुल्क.",
        eligibility: "व्यापार, उत्पादन किंवा सेवा क्षेत्रात कार्यरत असणारे बिगर-कॉर्पोरेट, बिगर-शेती लघु आणि सूक्ष्म उद्योग.",
        aiExplanation: "तुमच्या उद्योगाच्या विस्तारासाठी कमी व्याजाच्या कर्ज संरचनेसाठी शिफारस केली जाते.",
        steps: [
          "व्यवसायाचा सविस्तर आराखडा (प्रकल्प अहवाल) तयार करा.",
          "कोणत्याही राष्ट्रीयीकृत बँकेला भेट द्या किंवा उद्यमी मित्र पोर्टलवर अर्ज करा.",
          "व्यवसाय नोंदणी पुरावा सादर करा आणि बँक मंजुरीनंतर मुद्रा डेबिट कार्ड मिळवा."
        ],
        documents: ["आधार आणि पॅन कार्ड", "व्यवसाय नोंदणी प्रमाणपत्र (गुमास्ता)", "६ महिन्यांचे बँक स्टेटमेंट", "मशिनरी/साहित्य खरेदी कोटेशन"]
      },
      Tamil: {
        name: "பிரதமர் முத்ரா யோஜனா திட்டம்",
        department: "நிதி மற்றும் குறுந்தொழில் அமைச்சகம்",
        description: "குறுந்தொழில்களுக்கு பிணையில்லா வணிக மேம்பாட்டு கடன்கள் ₹10 லட்சம் வரை ஷிஷு, கிஷோர் மற்றும் தருண் திட்டங்களாக வழங்கப்படுகிறது.",
        benefits: "பிணையில்லா வணிகக் கடன்கள், நெகிழ்வான வட்டி விகிதம் மற்றும் மிகக் குறைந்த செயலாக்கக் கட்டணங்கள்.",
        eligibility: "வணிகம், உற்பத்தி அல்லது சேவைத் துறைகளில் ஈடுபட்டுள்ள கார்ப்பரேட் அல்லாத, விவசாயம் சாராத சிறு/குறு நிறுவனங்கள்.",
        aiExplanation: "மானிய வட்டி அமைப்புகளுடன் வணிக விரிவாக்கத்திற்கு நிதியுதவி பெற இது மிகவும் பரிந்துரைக்கப்படுகிறது.",
        steps: [
          "தொடக்க அல்லது விரிவாக்க செலவுகளை விளக்கும் விரிவான வணிக திட்டத்தைத் தயாரிக்கவும்.",
          "ஏதேனும் பொதுத்துறை வங்கியை அணுகவும் அல்லது உத்யமி மித்ரா போர்ட்டலில் ஆன்லைனில் விண்ணப்பிக்கவும்.",
          "வணிகச் சான்றைச் சமர்ப்பித்து, பிரத்யேக முத்ரா டெபிட் கார்டைப் பெறவும்."
        ],
        documents: ["ஆதார் மற்றும் பான் அட்டை", "வணிக பதிவு சான்றிதழ்", "6 மாத வங்கி கணக்கு அறிக்கை", "திட்ட மதிப்பீட்டு சான்றிதழ்"]
      },
      Gujarati: {
        name: "પ્રધાનમંત્રી મુદ્રા યોજના (PMMY)",
        department: "નાણાં અને સૂક્ષ્મ ઉદ્યોગ મંત્રાલય",
        description: "સૂક્ષ્મ સાહસોના વિકાસ માટે કોઈ પણ ગેરંટી વિના ₹૧૦ લાખ સુધીની લોન, જેને શિશુ, કિશોર અને તરુણમાં વિભાજિત કરવામાં આવી છે.",
        benefits: "કોઈપણ જામીનગીરી વિના વ્યાપારિક લોન, આકર્ષક વ્યાજ દરો અને પ્રોસેસિંગ ફીમાં રાહત.",
        eligibility: "વેપાર, ઉત્પાદન કે સેવા ક્ષેત્રે કાર્યરત બિન-કોર્પોરેટ, બિન-ખેતી નાના અને લઘુ સાહસો.",
        aiExplanation: "વ્યવસાય વધારવા માટે આ લોનની સખત ભલામણ કરવામાં આવે છે.",
        steps: [
          "તમારા વ્યવસાયના આયોજનનો વિગતવાર પ્રોજેક્ટ રિપોર્ટ તૈયાર કરો.",
          "નજીકની સરકારી બેંકની મુલાકાત લો અથવા ઉદ્યમી મિત્ર પોર્ટલ પર ઓનલાઈન અરજી કરો.",
          "ધંધાના પુરાવા સબમिट કરો અને મુદ્રા ડેબિટ કાર્ડ મેળવો."
        ],
        documents: ["આધાર અને પાન કાર્ડ", "ધંધાની નોંધણીનો પુરાવો (ગુમાસ્તા)", "૬ મહિનાનું બેંક સ્ટેટમેન્ટ", "ખર્ચનું અંદાજપત્ર"]
      }
    }
  },
  {
    id: "jyotirao_phule_health",
    category: "Healthcare",
    type: "State",
    applicableStates: ["Maharashtra"],
    minAge: 1,
    maxAge: 95,
    incomeLimit: 120000,
    genderRequirements: "Any",
    website: "https://www.jeevandayee.gov.in",
    deadline: "Ongoing Window",
    estimatedApprovalTime: "Instant / Cashless",
    popularityScore: 89,
    priorityScore: 87,
    complexity: "High",
    tags: ["healthcare", "insurance", "medical", "maharashtra", "treatment", "cashless"],
    translations: {
      English: {
        name: "Mahatma Jyotirao Phule Jan Arogya Yojana",
        department: "Department of Health, Maharashtra State",
        description: "Comprehensive cashless medical coverage up to ₹1.5 Lakhs per family per year for identified critical surgeries and therapies in network hospitals.",
        benefits: "100% Cashless hospitalization and critical surgery support covering over 996 specialized clinical medical procedures.",
        eligibility: "Families holding yellow or orange ration cards registered in the state of Maharashtra with low household incomes.",
        aiExplanation: "Since you reside in Maharashtra with verified low income, this ensures fully cashless healthcare coverage for critical hospital events.",
        steps: [
          "Visit any empanelled network government or private hospital in Maharashtra.",
          "Meet the Aarogyamitra desk representative at the entrance.",
          "Present your yellow/orange ration card and Aadhaar for cashless authorization pre-approval."
        ],
        documents: ["Yellow / Orange Ration Card", "Aadhaar Card", "Income Certificate from Tehsildar", "Hospital Referral Slips"]
      },
      Hindi: {
        name: "महात्मा ज्योतिराव फुले जन आरोग्य योजना",
        department: "स्वास्थ्य विभाग, महाराष्ट्र राज्य",
        description: "महाराष्ट्र के सूचीबद्ध अस्पतालों में चिन्हित गंभीर सर्जरी और उपचारों के लिए प्रति परिवार प्रति वर्ष ₹1.5 लाख तक का कैशलेस चिकित्सा बीमा।",
        benefits: "996 से अधिक विशिष्ट नैदानिक चिकित्सा प्रक्रियाओं को कवर करने वाला 100% कैशलेस अस्पताल में भर्ती और गंभीर सर्जरी सहायता।",
        eligibility: "महाराष्ट्र राज्य में पंजीकृत और पीला या नारंगी राशन कार्ड धारक कम आय वाले परिवार।",
        aiExplanation: "चूंकि आप महाराष्ट्र के निवासी हैं और आपकी आय कम है, इसलिए यह गंभीर बीमारियों के इलाज के लिए कैशलेस स्वास्थ्य कवरेज सुनिश्चित करता है।",
        steps: [
          "महाराष्ट्र के किसी भी सूचीबद्ध नेटवर्क सरकारी या निजी अस्पताल का दौरा करें।",
          "अस्पताल के प्रवेश द्वार पर 'आरोग्यमित्र' डेस्क प्रतिनिधि से मिलें।",
          "कैशलेस इलाज की पूर्व-मंजूरी के लिए अपना पीला/नारंगी राशन कार्ड और आधार प्रस्तुत करें।"
        ],
        documents: ["पीला / नारंगी राशन कार्ड", "आधार कार्ड", "तहसीलदार द्वारा जारी आय प्रमाण पत्र", "अस्पताल के मेडिकल रेफरल कागजात"]
      },
      Marathi: {
        name: "महात्मा ज्योतिराव फुले जन आरोग्य योजना",
        department: "सार्वजनिक आरोग्य विभाग, महाराष्ट्र शासन",
        description: "महाराष्ट्रातील निवडक नेटवर्क रुग्णालयांमध्ये गंभीर आजार आणि शस्त्रक्रियांसाठी प्रति कुटुंब प्रति वर्ष ₹१.५ लाखांपर्यंतचे मोफत कॅशलेस वैद्यकीय विमा संरक्षण.",
        benefits: "९९६ पेक्षा अधिक गंभीर वैद्यकीय उपचारांवर १००% पूर्णपणे मोफत कॅशलेस उपचार आणि शस्त्रक्रिया सहाय्य.",
        eligibility: "महाराष्ट्र राज्यातील रहिवासी असणारे व पिवळे किंवा केशरी शिधापत्रिका (रेशन कार्ड) धारक कुटुंब.",
        aiExplanation: "तुम्ही महाराष्ट्रातील रहिवासी असल्यामुळे आणि तुमचे उत्पन्न मर्यादित असल्याने, तुम्हाला या योजनेंतर्गत मोफत कॅशलेस आरोग्य संरक्षण मिळते.",
        steps: [
          "महाराष्ट्रातील मान्यताप्राप्त किंवा सरकारी सूचीबद्ध नेटवर्क रुग्णालयाला भेट द्या.",
          "रुग्णालयाच्या मुख्य प्रवेशद्वाराजवळील 'आरोग्यमित्र' कक्षाशी संपर्क साधा.",
          "पिवळे/केशरी रेशन कार्ड आणि आधार कार्ड सादर करून कॅशलेस उपचाराची मंजुरी मिळवा."
        ],
        documents: ["पिवळे / केशरी रेशन कार्ड", "आधार कार्ड", "तहसीलदारांचा उत्पन्नाचा दाखला", "वैद्यकीय कागदपत्रे व तपासणी रिपोर्ट"]
      },
      Tamil: {
        name: "மகாத்மா ஜோதிராவ் புலே மக்கள் ஆரோக்கிய திட்டம்",
        department: "சுகாதாரத் துறை, மகாராஷ்டிர மாநிலம்",
        description: "குறிப்பிடப்பட்ட அறுவை சிகிச்சைகள் மற்றும் சிகிச்சைகளுக்கு ஒரு குடும்பத்திற்கு ஆண்டுக்கு ₹1.5 லட்சம் வரை ரொக்கமில்லா முழு மருத்துவ காப்பீடு வழங்குதல்.",
        benefits: "996-க்கும் மேற்பட்ட சிறப்பு மருத்துவ சிகிச்சைகளை உள்ளடக்கிய 100% ரொக்கமில்லா மருத்துவமனை அனுமதி மற்றும் அறுவை சிகிச்சை உதவி.",
        eligibility: "மகாராஷ்டிர மாநிலத்தில் வசிக்கும் மஞ்சள் அல்லது ஆரஞ்சு நிற குடும்ப அட்டை வைத்திருக்கும் குறைந்த வருவாய் உடைய குடும்பங்கள்.",
        aiExplanation: "நீங்கள் மகாராஷ்டிராவில் வசிப்பதாலும் குறைந்த வருமானம் உடையவர் என்பதாலும் இந்த ரொக்கமில்லா மருத்துவ காப்பீடு தங்களுக்கு பொருந்தும்.",
        steps: [
          "மகாராஷ்டிராவில் அங்கீகரிக்கப்பட்ட ஏதேனும் ஒரு நெட்வொர்க் மருத்துவமனைக்குச் செல்லவும்.",
          "நுழைவாயிலில் உள்ள 'ஆரோக்கியமித்ரா' உதவி மைய பிரதிநிதியை அணுகவும்.",
          "ரொக்கமில்லா சிகிச்சையைத் தொடங்க உங்கள் மஞ்சள்/ஆரஞ்சு குடும்ப அட்டை மற்றும் ஆதாரைச் சமர்ப்பிக்கவும்."
        ],
        documents: ["மஞ்சள் / ஆரஞ்சு ரேஷன் அட்டை", "ஆதார் அட்டை", "தாசில்தார் வழங்கிய வருமான சான்றிதழ்", "மருத்துவமனை பரிந்துரை சீட்டுகள்"]
      },
      Gujarati: {
        name: "મહાત્મા જ્યોતિરાવ ફૂલે જન આરોગ્ય યોજના",
        department: "આરોગ્ય વિભાગ, મહારાષ્ટ્ર રાજ્ય",
        description: "મહારાષ્ટ્રની માન્ય હોસ્પિટલોમાં પસંદગીની ગંભીર સર્જરીઓ અને સારવાર માટે પરિવાર દીઠ વાર્ષિક ₹૧.૫ લાખ સુધીનું કેશલેસ તબીબી વીમા કવચ.",
        benefits: "૧૦૦% સંપૂર્ણ કેશલેસ સારવાર અને ઓપરેશન સહાય, જે ૯૯૬ થી વધુ જટિલ શારીરિક સારવારોને આવરી લે છે.",
        eligibility: "મહારાષ્ટ્રમાં રહેતા પીળા અથવા કેસરી રેશનકાર્ડ ધરાવતા અને ઓછી આવક ધરાવતા પરિવારો.",
        aiExplanation: "તમે મહારાષ્ટ્રના રહેવાસી હોવાથી અને ઓછી આવક ધરાવતા હોવાથી આ કેશલેસ આરોગ્ય યોજનાનો લાભ મેળવી શકો છો.",
        steps: [
          "મહારાષ્ટ્રની કોઈપણ માન્ય પેનલ હોસ્પિટલની મુલાકાત લો.",
          "હોસ્પિટલ પ્રવેશદ્વાર પર રહેલ 'આરોગ્યમિત્ર' ડેસ્ક પ્રતિનિધિનો સંપર્ક કરો.",
          "લાભ મંજૂર કરવા માટે તમારું પીળું/કેસરી રેશનકાર્ડ અને આધાર કાર્ડ રજૂ કરો."
        ],
        documents: ["પીળું અથવા કેસરી રેશનકાર્ડ", "આધાર કાર્ડ", "તહસીલદારનો આવકનો દાખલો", "હોસ્પિટલ રિફર સ્લિપ"]
      }
    }
  }
];

export default function SchemeEngine({
  language,
  onSpeak,
  addNotification,
  profile: propProfile,
  setProfile: propSetProfile
}: SchemeEngineProps) {
  
  const [localProfile, setLocalProfile] = useState<CitizenProfile>({
    age: 21,
    occupation: "Student",
    income: 180000,
    state: "Maharashtra",
    district: "Mumbai",
    category: "OBC",
    education: "Undergraduate",
    isFarmer: false,
    isStudent: true,
    isSenior: false,
    isBusinessOwner: false,
    gender: "Female",
    isDisabled: false
  });

  const profile = propProfile || localProfile;
  const setProfile = propSetProfile || setLocalProfile;

  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilters, setActiveFilters] = useState({
    type: 'All', // 'All', 'Central', 'State'
    state: 'All States',
    category: 'All',
    complexity: 'All'
  });

  // Saved Schemes & Recently Viewed lists
  const [savedSchemes, setSavedSchemes] = useState<string[]>([]);
  const [recentlyViewed, setRecentlyViewed] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Comparison State
  const [comparedSchemeIds, setComparedSchemeIds] = useState<string[]>([]);
  const [isCompareOpen, setIsCompareOpen] = useState(false);

  // Application Tracking state
  const [applications, setApplications] = useState<Array<{
    schemeId: string;
    schemeName: string;
    appliedDate: string;
    status: 'Submitted' | 'Under Review' | 'Approved' | 'Rejected';
    stepIndex: number;
  }>>([]);

  // Modal active states
  const [activeDetailsId, setActiveDetailsId] = useState<string | null>(null);
  const [aiAnalyzing, setAiAnalyzing] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>(["scholarship", "farmer", "PM Mudra"]);
  const [activeTab, setActiveTab] = useState<'Trending' | 'New' | 'Closing Soon' | 'Saved'>('Trending');

  const dict = UI_TRANSLATIONS[language] || UI_TRANSLATIONS.English;

  // Add search to recent lists
  const handleSearchSubmit = (term: string) => {
    if (!term.trim()) return;
    setSearchTerm(term);
    if (!recentSearches.includes(term)) {
      setRecentSearches(prev => [term, ...prev.slice(0, 4)]);
    }
  };

  // Sync profile indicators when certain select inputs change
  const handleInputChange = (field: keyof CitizenProfile, value: any) => {
    setProfile((prev: CitizenProfile) => {
      const updated = { ...prev, [field]: value };
      if (field === 'age') {
        const parsedAge = parseInt(value) || 0;
        updated.isSenior = parsedAge >= 60;
      }
      if (field === 'occupation') {
        updated.isFarmer = value === "Farmer / Agriculturalist";
        updated.isStudent = value === "Student";
        updated.isBusinessOwner = value === "Small Business Owner / Shopkeeper";
      }
      return updated;
    });
  };

  // Toggle bookmark
  const handleSaveScheme = (schemeId: string, name: string) => {
    setSavedSchemes(prev => {
      const isSaved = prev.includes(schemeId);
      if (isSaved) {
        addNotification(`Removed "${name}" from saved list.`, 'info');
        return prev.filter(id => id !== schemeId);
      } else {
        addNotification(`"${name}" saved securely under profile.`, 'success');
        onSpeak("Scheme bookmarked.");
        return [...prev, schemeId];
      }
    });
  };

  // Share
  const handleShareScheme = (name: string) => {
    if (navigator.share) {
      navigator.share({
        title: name,
        text: `Check out the eligibility details for ${name} on Smart Bharat Civic Portal.`,
        url: window.location.href,
      }).catch(err => console.log(err));
    } else {
      navigator.clipboard.writeText(`Smart Bharat Portal: check out the details of "${name}" on our official app.`);
      addNotification(`Copied sharing link for "${name}" to clipboard.`, 'success');
      onSpeak("Link copied");
    }
  };

  // Handle comparison checkboxes
  const handleToggleCompare = (schemeId: string) => {
    setComparedSchemeIds(prev => {
      if (prev.includes(schemeId)) {
        addNotification("Scheme removed from comparison matrix.", "info");
        return prev.filter(id => id !== schemeId);
      }
      if (prev.length >= 3) {
        addNotification("You can compare up to 3 schemes at a time.", "warning");
        return prev;
      }
      addNotification("Added to comparison grid. Click Compare to review.", "success");
      return [...prev, schemeId];
    });
  };

  // Submit Simulated Application
  const handleApplyScheme = (schemeId: string, schemeName: string) => {
    if (applications.some(app => app.schemeId === schemeId)) {
      addNotification(`You have already submitted an active application for ${schemeName}.`, 'warning');
      return;
    }
    const newApp = {
      schemeId,
      schemeName,
      appliedDate: new Date().toLocaleDateString(),
      status: 'Submitted' as const,
      stepIndex: 1
    };
    setApplications(prev => [newApp, ...prev]);
    addNotification(`Simulated Application for ${schemeName} submitted successfully to government servers.`, 'success');
    onSpeak(`Application submitted successfully.`);
  };

  // Advance Simulation Stage (for demo review)
  const handleAdvanceSimulation = (schemeId: string) => {
    setApplications(prev => prev.map(app => {
      if (app.schemeId === schemeId) {
        let nextStatus: 'Submitted' | 'Under Review' | 'Approved' | 'Rejected' = 'Submitted';
        let step = app.stepIndex;
        if (app.status === 'Submitted') {
          nextStatus = 'Under Review';
          step = 2;
          addNotification("Review stage updated: Verification started.", "info");
        } else if (app.status === 'Under Review') {
          nextStatus = Math.random() > 0.15 ? 'Approved' : 'Rejected';
          step = 3;
          if (nextStatus === 'Approved') {
            addNotification("Congratulations! Application has been approved cashless.", "success");
            onSpeak("Congratulations, scheme approved.");
          } else {
            addNotification("Application rejected due to incomplete verification.", "warning");
          }
        }
        return { ...app, status: nextStatus, stepIndex: step };
      }
      return app;
    }));
  };

  // Reset demo tracker
  const handleResetApplication = (schemeId: string) => {
    setApplications(prev => prev.filter(app => app.schemeId !== schemeId));
    addNotification("Application reset. You can apply again.", "info");
  };

  // Semantic search / filter parser
  const evaluatedSchemes = useMemo(() => {
    return SCHEMES_DATABASE.map(scheme => {
      const trans = scheme.translations[language] || scheme.translations.English;
      let criteriaCount = 0;
      let matchedCount = 0;
      const reasonsNotEligible: string[] = [];

      // 1. Age check
      criteriaCount++;
      if (profile.age >= scheme.minAge && profile.age <= scheme.maxAge) {
        matchedCount++;
      } else {
        reasonsNotEligible.push(
          language === 'Hindi' 
            ? `आयु ${profile.age} वर्ष आवश्यक सीमा [${scheme.minAge} - ${scheme.maxAge}] से बाहर है।`
            : language === 'Marathi'
            ? `वय ${profile.age} वर्षे आवश्यक मर्यादेच्या [${scheme.minAge} - ${scheme.maxAge}] बाहेर आहे.`
            : `Age of ${profile.age} falls outside the required range [${scheme.minAge} - ${scheme.maxAge}] for this scheme.`
        );
      }

      // 2. Income check
      criteriaCount++;
      if (profile.income <= scheme.incomeLimit) {
        matchedCount++;
      } else {
        reasonsNotEligible.push(
          language === 'Hindi' 
            ? `वार्षिक आय ₹${profile.income.toLocaleString('en-IN')} अधिकतम सीमा ₹${scheme.incomeLimit.toLocaleString('en-IN')} से अधिक है।`
            : language === 'Marathi'
            ? `वार्षिक उत्पन्न ₹${profile.income.toLocaleString('en-IN')} कमाल मर्यादा ₹${scheme.incomeLimit.toLocaleString('en-IN')} पेक्षा जास्त आहे.`
            : `Annual income of ₹${profile.income.toLocaleString('en-IN')} exceeds the maximum allowed limit of ₹${scheme.incomeLimit.toLocaleString('en-IN')}.`
        );
      }

      // 3. Gender check
      if (scheme.genderRequirements !== 'Any') {
        criteriaCount++;
        if (profile.gender === scheme.genderRequirements) {
          matchedCount++;
        } else {
          reasonsNotEligible.push(
            language === 'Hindi' 
              ? `यह योजना विशेष रूप से केवल ${scheme.genderRequirements === 'Female' ? 'महिला' : 'पुरुष'} उम्मीदवारों के लिए है।`
              : `This scheme is exclusively structured for ${scheme.genderRequirements} candidates.`
          );
        }
      }

      // 4. State Domicile check
      if (!scheme.applicableStates.includes('All')) {
        criteriaCount++;
        if (scheme.applicableStates.includes(profile.state)) {
          matchedCount++;
        } else {
          reasonsNotEligible.push(
            language === 'Hindi' 
              ? `यह केवल ${scheme.applicableStates.join(', ')} के निवासियों के लिए उपलब्ध राज्य विशिष्ट योजना है।`
              : `This is a state-level scheme restricted exclusively to residents of: ${scheme.applicableStates.join(', ')}.`
          );
        }
      }

      // 5. Special tags
      if (scheme.requiresStudent) {
        criteriaCount++;
        if (profile.isStudent || profile.occupation === 'Student') {
          matchedCount++;
        } else {
          reasonsNotEligible.push(
            language === 'Hindi' ? `सक्रिय छात्र पंजीकरण स्थिति आवश्यक है।` : `Requires an active student profile registration.`
          );
        }
      }

      if (scheme.requiresFarmer) {
        criteriaCount++;
        if (profile.isFarmer || profile.occupation === 'Farmer / Agriculturalist') {
          matchedCount++;
        } else {
          reasonsNotEligible.push(
            language === 'Hindi' ? `इसके लिए वैध भूमि रिकॉर्ड के साथ सक्रिय किसान होना आवश्यक है।` : `Requires cultivable land holdings and active farmer status.`
          );
        }
      }

      if (scheme.requiresBusinessOwner) {
        criteriaCount++;
        if (profile.isBusinessOwner || profile.occupation === 'Small Business Owner / Shopkeeper') {
          matchedCount++;
        } else {
          reasonsNotEligible.push(
            language === 'Hindi' ? `इसके लिए वैध व्यवसाय/उद्यमी पंजीकरण आवश्यक है।` : `Requires micro/small registered business or startup proof.`
          );
        }
      }

      // Calculate Eligibility progress percent
      const eligibilityScore = Math.round((matchedCount / criteriaCount) * 100);

      // AI Match score incorporates priority and popular weights
      const isPerfect = eligibilityScore === 100;
      const recommendationScore = Math.round(
        (eligibilityScore * 0.6) + 
        (scheme.priorityScore * 0.25) + 
        (scheme.popularityScore * 0.15)
      );

      return {
        ...scheme,
        eligibilityScore,
        recommendationScore,
        isPerfect,
        reasonsNotEligible,
        translated: trans
      };
    });
  }, [profile, language]);

  // Main list filters
  const filteredSchemes = useMemo(() => {
    return evaluatedSchemes.filter(scheme => {
      // 1. Category Filter (Bento triggers)
      if (selectedCategory && scheme.category !== selectedCategory) return false;

      // 2. Type Filter
      if (activeFilters.type !== 'All' && scheme.type !== activeFilters.type) return false;

      // 3. State Target Filter
      if (activeFilters.state !== 'All States' && !scheme.applicableStates.includes('All') && !scheme.applicableStates.includes(activeFilters.state)) return false;

      // 4. Complexity Filter
      if (activeFilters.complexity !== 'All' && scheme.complexity !== activeFilters.complexity) return false;

      // 5. Search Text Filter
      if (searchTerm) {
        const query = searchTerm.toLowerCase().trim();
        const tagsMatch = scheme.tags.some(t => t.toLowerCase().includes(query) || query.includes(t));
        const nameMatch = scheme.translated.name.toLowerCase().includes(query);
        const descMatch = scheme.translated.description.toLowerCase().includes(query);
        const deptMatch = scheme.translated.department.toLowerCase().includes(query);
        return tagsMatch || nameMatch || descMatch || deptMatch;
      }

      return true;
    });
  }, [evaluatedSchemes, selectedCategory, activeFilters, searchTerm]);

  // Tabbed horizontal categories (Trending, New, Closing Soon, Saved)
  const tabbedSchemes = useMemo(() => {
    switch (activeTab) {
      case 'Saved':
        return evaluatedSchemes.filter(s => savedSchemes.includes(s.id));
      case 'New':
        return evaluatedSchemes.filter(s => s.popularityScore < 92);
      case 'Closing Soon':
        return evaluatedSchemes.filter(s => s.deadline !== 'Ongoing Window' && s.deadline !== 'Open All Year');
      case 'Trending':
      default:
        return [...evaluatedSchemes].sort((a, b) => b.popularityScore - a.popularityScore);
    }
  }, [evaluatedSchemes, activeTab, savedSchemes]);

  // Auto recommend perfect matches for prompt top list
  const topRecommended = useMemo(() => {
    return evaluatedSchemes
      .filter(s => s.eligibilityScore >= 50)
      .sort((a, b) => b.recommendationScore - a.recommendationScore)
      .slice(0, 3);
  }, [evaluatedSchemes]);

  const activeDetailsScheme = useMemo(() => {
    if (!activeDetailsId) return null;
    return evaluatedSchemes.find(s => s.id === activeDetailsId) || null;
  }, [evaluatedSchemes, activeDetailsId]);

  const comparedSchemes = useMemo(() => {
    return evaluatedSchemes.filter(s => comparedSchemeIds.includes(s.id));
  }, [evaluatedSchemes, comparedSchemeIds]);

  // Track page view event simulation
  const triggerViewScheme = (schemeId: string) => {
    setActiveDetailsId(schemeId);
    if (!recentlyViewed.includes(schemeId)) {
      setRecentlyViewed(prev => [schemeId, ...prev.slice(0, 4)]);
    }
  };

  return (
    <div className="w-full mx-auto space-y-12 pb-20">
      
      {/* ====================================
          HERO SECTION
          ==================================== */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-950 to-blue-950 text-white rounded-[32px] p-8 md:p-12 shadow-2xl border border-slate-800">
        {/* Glow effect blobs */}
        <div className="absolute -top-12 -left-12 w-64 h-64 bg-gov-saffron/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-12 -right-12 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl animate-pulse" />
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
          
          {/* Hero Content Block */}
          <div className="lg:col-span-7 space-y-6 text-left">
            
            <div className="inline-flex items-center space-x-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs font-semibold tracking-wide text-gov-saffron backdrop-blur-md">
              <Sparkles className="w-4 h-4 text-gov-saffron animate-bounce" />
              <span>Personalized welfare recommendation engine</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight leading-none bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
              {dict.title}
            </h1>
            
            <p className="text-sm md:text-base text-slate-300 leading-relaxed max-w-xl">
              {dict.subtitle}
            </p>

            {/* AI Search Engine Block */}
            <div className="space-y-3">
              <div className="relative flex items-center bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-1.5 focus-within:ring-2 focus-within:ring-gov-saffron/50 transition-all duration-300 shadow-lg">
                <Search className="w-5 h-5 text-slate-400 ml-3 shrink-0" />
                <input
                  type="text"
                  placeholder={dict.searchPlaceholder}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearchSubmit(searchTerm)}
                  className="w-full bg-transparent border-none outline-none text-white placeholder-slate-400 px-3 py-2.5 text-xs md:text-sm font-semibold"
                />
                
                {/* Voice Input simulator */}
                <button 
                  onClick={() => {
                    const sampleVoices = [
                      "Scholarship for minority college student",
                      "PM Kisan land registration",
                      "Mudra loan up to 5 Lakhs",
                      "Cashless healthcare card"
                    ];
                    const chosen = sampleVoices[Math.floor(Math.random() * sampleVoices.length)];
                    setSearchTerm(chosen);
                    addNotification(`Voice prompt simulated: "${chosen}"`, 'success');
                    onSpeak(`Searching for ${chosen}`);
                  }}
                  className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl transition-all mr-1 group relative cursor-pointer"
                  title="Simulate Voice Input"
                >
                  <Mic className="w-4 h-4 text-gov-saffron group-hover:scale-110" />
                </button>

                <button
                  onClick={() => handleSearchSubmit(searchTerm)}
                  className="px-5 py-2.5 bg-gradient-to-r from-gov-saffron to-amber-500 hover:from-gov-saffron/90 hover:to-amber-500/90 text-slate-950 font-extrabold rounded-xl text-xs md:text-sm uppercase tracking-wider transition-all duration-300 shadow-md cursor-pointer"
                >
                  Search
                </button>
              </div>

              {/* Natural Language Prompt suggestions */}
              <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px]">
                <span className="text-slate-400 font-medium">Try asking:</span>
                <button 
                  onClick={() => setSearchTerm("I need scholarship")}
                  className="px-2.5 py-1 bg-white/5 hover:bg-white/10 rounded-lg text-slate-300 transition-colors cursor-pointer"
                >
                  "I need scholarship"
                </button>
                <button 
                  onClick={() => setSearchTerm("I am a farmer")}
                  className="px-2.5 py-1 bg-white/5 hover:bg-white/10 rounded-lg text-slate-300 transition-colors cursor-pointer"
                >
                  "I am a farmer"
                </button>
                <button 
                  onClick={() => setSearchTerm("Mudra loan")}
                  className="px-2.5 py-1 bg-white/5 hover:bg-white/10 rounded-lg text-slate-300 transition-colors cursor-pointer"
                >
                  "Mudra loan"
                </button>
                {searchTerm && (
                  <button 
                    onClick={() => { setSearchTerm(''); setSelectedCategory(null); }}
                    className="text-gov-saffron hover:underline ml-2"
                  >
                    Clear Filter
                  </button>
                )}
              </div>
            </div>

            {/* Platform statistics */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/10">
              <div>
                <p className="text-xl md:text-2xl font-black font-mono text-gov-saffron">5000+</p>
                <p className="text-[10px] text-slate-400 uppercase font-bold">Welfare Schemes</p>
              </div>
              <div className="border-l border-white/10 pl-4">
                <p className="text-xl md:text-2xl font-black font-mono text-emerald-400">35+</p>
                <p className="text-[10px] text-slate-400 uppercase font-bold">States & UTs</p>
              </div>
              <div className="border-l border-white/10 pl-4">
                <p className="text-xl md:text-2xl font-black font-mono text-blue-400">100+</p>
                <p className="text-[10px] text-slate-400 uppercase font-bold">Departments</p>
              </div>
            </div>

          </div>

          {/* Hero Graphics / Interactive Digital India Illustration */}
          <div className="lg:col-span-5 flex justify-center relative">
            <div className="w-72 h-72 rounded-full bg-gradient-to-tr from-slate-800 to-slate-900 border border-slate-700 shadow-2xl relative flex items-center justify-center p-6 animate-pulse">
              
              {/* Spinning decorative ring */}
              <div className="absolute inset-0 border-2 border-dashed border-gov-saffron/20 rounded-full animate-spin [animation-duration:40s]" />
              <div className="absolute inset-4 border border-emerald-500/10 rounded-full animate-spin [animation-duration:20s] reverse" />

              {/* Central Shield Icon */}
              <div className="p-6 bg-slate-950/80 border-2 border-white/10 rounded-3xl backdrop-blur-lg flex flex-col items-center justify-center text-center shadow-xl space-y-2 z-10">
                <Award className="w-14 h-14 text-gov-saffron animate-pulse" />
                <span className="text-xs font-bold tracking-wider text-slate-200">Digital India Portal</span>
                <span className="px-2.5 py-0.5 bg-emerald-500/15 text-emerald-400 text-[10px] rounded-full font-bold">Secure e-KYC Verified</span>
              </div>

              {/* Floating Citizen icon */}
              <div className="absolute top-4 left-6 p-2 bg-slate-950 border border-white/15 rounded-xl flex items-center space-x-1.5 shadow-md animate-bounce [animation-duration:4s]">
                <User className="w-4 h-4 text-blue-400" />
                <span className="text-[9px] font-bold">Profile Switched</span>
              </div>

              {/* Floating document scan icon */}
              <div className="absolute bottom-6 right-2 p-2 bg-slate-950 border border-white/15 rounded-xl flex items-center space-x-1.5 shadow-md animate-bounce [animation-duration:3s]">
                <FileText className="w-4 h-4 text-emerald-400" />
                <span className="text-[9px] font-bold">Aadhaar Linked</span>
              </div>

              {/* Floating assistant badge */}
              <div className="absolute top-1/2 -right-8 p-2.5 bg-slate-950 border border-white/15 rounded-xl flex items-center space-x-1.5 shadow-md animate-bounce [animation-duration:5s]">
                <Sparkles className="w-4 h-4 text-gov-saffron" />
                <span className="text-[9px] font-bold">AI Active</span>
              </div>

            </div>
          </div>

        </div>
      </div>

      {/* ====================================
          AI PERSONALIZED RECOMMENDATION PANEL
          ==================================== */}
      <div className="bg-slate-50 dark:bg-slate-950/30 border border-slate-200 dark:border-slate-800 rounded-[32px] p-6 text-left shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
          <div className="space-y-1">
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center space-x-2">
              <Sparkles className="w-5 h-5 text-gov-saffron animate-pulse" />
              <span>{dict.recommHeading}</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {dict.basedOn}
            </p>
          </div>
          
          {/* Quick Demographics Preview and Sync Indicator */}
          <div className="flex flex-wrap items-center gap-2 text-xs bg-white dark:bg-slate-900 p-2.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center space-x-1">
              <span className="text-slate-400 font-medium">Age:</span>
              <span className="font-extrabold text-slate-800 dark:text-slate-200">{profile.age}</span>
            </div>
            <span className="text-slate-300 dark:text-slate-700">|</span>
            <div className="flex items-center space-x-1">
              <span className="text-slate-400 font-medium">State:</span>
              <span className="font-extrabold text-slate-800 dark:text-slate-200">{profile.state}</span>
            </div>
            <span className="text-slate-300 dark:text-slate-700">|</span>
            <div className="flex items-center space-x-1">
              <span className="text-slate-400 font-medium">Income:</span>
              <span className="font-extrabold text-emerald-600">₹{profile.income.toLocaleString('en-IN')}</span>
            </div>
            <span className="text-slate-300 dark:text-slate-700">|</span>
            <div className="flex items-center space-x-1">
              <span className="text-slate-400 font-medium">Category:</span>
              <span className="font-extrabold text-slate-800 dark:text-slate-200">{profile.category}</span>
            </div>
          </div>
        </div>

        {/* Horizontal scroll of personalized matches */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {topRecommended.map((scheme) => (
            <div 
              key={scheme.id}
              className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-md relative hover:shadow-lg transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 bg-gov-saffron/10 text-gov-saffron border border-gov-saffron/20 rounded-md text-[9px] font-bold uppercase tracking-wider">
                    {scheme.recommendationScore}% AI Fit
                  </span>
                  <div className="flex items-center space-x-1 text-[10px] text-emerald-600 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                    <span>{scheme.eligibilityScore}% Match</span>
                  </div>
                </div>

                <h3 className="font-extrabold text-sm text-slate-900 dark:text-white leading-snug line-clamp-2">
                  {scheme.translated.name}
                </h3>
                <p className="text-[10px] text-slate-500 font-medium uppercase truncate">
                  {scheme.translated.department}
                </p>

                <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-3">
                  {scheme.translated.description}
                </p>

                <div className="bg-slate-50 dark:bg-slate-800/40 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 text-[11px] text-slate-700 dark:text-slate-300">
                  <span className="font-bold text-gov-saffron block text-[9px] uppercase tracking-wider">Welfare Benefit:</span>
                  <p className="font-semibold line-clamp-2">{scheme.translated.benefits}</p>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 mt-4 flex items-center justify-between">
                <span className="text-[10px] text-slate-400 font-bold uppercase flex items-center space-x-1">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>{scheme.estimatedApprovalTime}</span>
                </span>
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => triggerViewScheme(scheme.id)}
                    className="px-3 py-1.5 text-[11px] font-extrabold text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                  >
                    Details
                  </button>
                  <button
                    onClick={() => handleApplyScheme(scheme.id, scheme.translated.name)}
                    className="px-3.5 py-1.5 bg-gov-saffron hover:bg-gov-saffron/90 text-slate-950 text-[11px] font-black uppercase tracking-wider rounded-lg transition-colors cursor-pointer"
                  >
                    Apply
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ====================================
          SCHEME CATEGORIES BENTO GRID
          ==================================== */}
      <div className="space-y-4 text-left">
        <h3 className="text-base font-extrabold uppercase tracking-widest text-slate-400">
          Browse by Welfare Domain
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
          {[
            { name: "Education", icon: GraduationCap, color: "text-indigo-500 bg-indigo-500/10" },
            { name: "Healthcare", icon: HeartPulse, color: "text-red-500 bg-red-500/10" },
            { name: "Agriculture", icon: Sprout, color: "text-emerald-500 bg-emerald-500/10" },
            { name: "Business", icon: Building2, color: "text-amber-500 bg-amber-500/10" },
            { name: "Housing", icon: Home, color: "text-blue-500 bg-blue-500/10" },
            { name: "Senior Citizens", icon: Heart, color: "text-rose-500 bg-rose-500/10" },
            { name: "Youth", icon: Wrench, color: "text-teal-500 bg-teal-500/10" },
            { name: "Employment", icon: Briefcase, color: "text-cyan-500 bg-cyan-500/10" },
          ].map((cat, idx) => {
            const IconComponent = cat.icon;
            const isSelected = selectedCategory === cat.name;
            return (
              <button
                key={idx}
                onClick={() => {
                  setSelectedCategory(isSelected ? null : cat.name);
                  addNotification(`Filtered by category: ${cat.name}`, 'info');
                }}
                className={`p-4 rounded-2xl border text-center flex flex-col items-center justify-center space-y-2 transition-all cursor-pointer hover:scale-105 duration-300 ${
                  isSelected 
                    ? 'bg-gradient-to-br from-slate-900 to-slate-950 border-slate-800 text-white shadow-lg' 
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <div className={`p-2.5 rounded-xl ${isSelected ? 'bg-white/10 text-white' : cat.color} transition-all`}>
                  <IconComponent className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold block truncate max-w-full">
                  {cat.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ====================================
          CORE FILTER AND SCHEMES DISPLAY CANVAS
          ==================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-left items-start">
        
        {/* Sticky Filter Sidebar */}
        <div className="lg:col-span-4 lg:sticky lg:top-6 space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center space-x-2">
                <Compass className="w-5 h-5 text-slate-500" />
                <span>Smart Filters</span>
              </h3>
              {(activeFilters.type !== 'All' || activeFilters.state !== 'All States' || activeFilters.complexity !== 'All' || selectedCategory || searchTerm) && (
                <button
                  onClick={() => {
                    setActiveFilters({ type: 'All', state: 'All States', complexity: 'All' });
                    setSelectedCategory(null);
                    setSearchTerm('');
                    addNotification("Filters reset.", "info");
                  }}
                  className="text-xs font-bold text-gov-saffron hover:underline cursor-pointer"
                >
                  Reset
                </button>
              )}
            </div>

            {/* Scheme Type */}
            <div className="space-y-2">
              <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Welfare Type</span>
              <div className="grid grid-cols-3 gap-2">
                {['All', 'Central', 'State'].map((t) => (
                  <button
                    key={t}
                    onClick={() => setActiveFilters(prev => ({ ...prev, type: t }))}
                    className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer text-center ${
                      activeFilters.type === t
                        ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-slate-900'
                        : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:bg-slate-100'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* State selection */}
            <div className="space-y-2">
              <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Target Domicile State</span>
              <select
                value={activeFilters.state}
                onChange={(e) => setActiveFilters(prev => ({ ...prev, state: e.target.value }))}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-xl p-3 text-xs font-bold outline-none"
              >
                {statesList.map((st, idx) => (
                  <option key={idx} value={st}>{st}</option>
                ))}
              </select>
            </div>

            {/* Complexity Filter */}
            <div className="space-y-2">
              <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Application Complexity</span>
              <select
                value={activeFilters.complexity}
                onChange={(e) => setActiveFilters(prev => ({ ...prev, complexity: e.target.value as any }))}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-xl p-3 text-xs font-bold outline-none"
              >
                <option value="All">All Complexities</option>
                <option value="Low">Low (Direct Bank Benefit)</option>
                <option value="Medium">Medium (Verification Required)</option>
                <option value="High">High (Document Intensive)</option>
              </select>
            </div>

            {/* Profile Customizer Inside Sidebar for instant AI matchmaking */}
            <div className="border-t border-slate-100 dark:border-slate-800 pt-4 space-y-4">
              <span className="text-xs font-extrabold text-slate-950 dark:text-white block uppercase tracking-wider">
                Refine Your Match Profile
              </span>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400">Your Age</label>
                  <input
                    type="number"
                    value={profile.age}
                    onChange={(e) => handleInputChange('age', parseInt(e.target.value) || 0)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs font-bold"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400">Gender</label>
                  <select
                    value={profile.gender}
                    onChange={(e) => handleInputChange('gender', e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-xl px-2 py-2 text-xs font-bold"
                  >
                    <option value="Any">Any</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400">Annual Income Limit (₹)</label>
                <input
                  type="range"
                  min="50000"
                  max="1500000"
                  step="25000"
                  value={profile.income}
                  onChange={(e) => handleInputChange('income', parseInt(e.target.value))}
                  className="w-full accent-gov-saffron cursor-pointer"
                />
                <div className="flex justify-between text-[10px] font-black text-emerald-600">
                  <span>₹50K</span>
                  <span>₹{profile.income.toLocaleString('en-IN')}</span>
                  <span>₹15L+</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 pt-2">
                <label className="flex items-center space-x-2 text-[11px] font-bold text-slate-600 dark:text-slate-300">
                  <input 
                    type="checkbox" 
                    checked={profile.isStudent}
                    onChange={(e) => handleInputChange('isStudent', e.target.checked)}
                    className="rounded border-slate-300 text-gov-saffron focus:ring-gov-saffron"
                  />
                  <span>Is Student</span>
                </label>
                <label className="flex items-center space-x-2 text-[11px] font-bold text-slate-600 dark:text-slate-300">
                  <input 
                    type="checkbox" 
                    checked={profile.isFarmer}
                    onChange={(e) => handleInputChange('isFarmer', e.target.checked)}
                    className="rounded border-slate-300 text-gov-saffron focus:ring-gov-saffron"
                  />
                  <span>Is Farmer</span>
                </label>
                <label className="flex items-center space-x-2 text-[11px] font-bold text-slate-600 dark:text-slate-300">
                  <input 
                    type="checkbox" 
                    checked={profile.isBusinessOwner}
                    onChange={(e) => handleInputChange('isBusinessOwner', e.target.checked)}
                    className="rounded border-slate-300 text-gov-saffron focus:ring-gov-saffron"
                  />
                  <span>Is Business Owner</span>
                </label>
              </div>

            </div>

          </div>
        </div>

        {/* Right schemes results panel */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Horizontal carousel tabs */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3 gap-4">
            <div className="flex flex-wrap gap-1 bg-slate-100 dark:bg-slate-900 p-1 rounded-2xl border border-slate-200 dark:border-slate-800">
              {(['Trending', 'New', 'Closing Soon', 'Saved'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => {
                    setActiveTab(tab);
                    addNotification(`Switched to tab: ${tab}`, 'info');
                  }}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    activeTab === tab
                      ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm font-extrabold'
                      : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {tab === 'Saved' ? `Bookmarks (${savedSchemes.length})` : tab}
                </button>
              ))}
            </div>

            {/* Compared count bar */}
            {comparedSchemeIds.length > 0 && (
              <button
                onClick={() => setIsCompareOpen(true)}
                className="px-4 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100 rounded-xl text-xs font-black flex items-center space-x-2 uppercase tracking-wider animate-bounce cursor-pointer shadow-md"
              >
                <ArrowLeftRight className="w-4 h-4" />
                <span>Compare Side-by-Side ({comparedSchemeIds.length})</span>
              </button>
            )}
          </div>

          {/* Results Listing */}
          <div className="space-y-6">
            {filteredSchemes.length > 0 ? (
              filteredSchemes.map((scheme) => {
                const isSaved = savedSchemes.includes(scheme.id);
                const isCompared = comparedSchemeIds.includes(scheme.id);
                const hasApplied = applications.find(a => a.schemeId === scheme.id);
                
                // Color mapping for circular progress
                let strokeColor = "stroke-emerald-500";
                let textClass = "text-emerald-500";
                let bgClass = "bg-emerald-500/10";
                if (scheme.eligibilityScore < 50) {
                  strokeColor = "stroke-red-500";
                  textClass = "text-red-500";
                  bgClass = "bg-red-500/10";
                } else if (scheme.eligibilityScore < 100) {
                  strokeColor = "stroke-amber-500";
                  textClass = "text-amber-500";
                  bgClass = "bg-amber-500/10";
                }

                return (
                  <div
                    key={scheme.id}
                    id={`scheme-card-${scheme.id}`}
                    className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 relative overflow-hidden group flex flex-col justify-between"
                  >
                    {/* Glowing highlight borders */}
                    <div className="absolute top-0 left-0 w-1.5 h-full bg-gov-saffron/80" />
                    
                    <div className="space-y-4">
                      
                      {/* Top metadata tags */}
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex flex-wrap items-center gap-1.5">
                          <span className="px-2.5 py-0.5 bg-gov-saffron/10 text-gov-saffron border border-gov-saffron/20 rounded-md text-[8px] font-black uppercase tracking-widest">
                            {scheme.type} Government
                          </span>
                          <span className="px-2.5 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700 rounded-md text-[8px] font-black uppercase tracking-widest">
                            {scheme.category}
                          </span>
                        </div>

                        {/* Circular Eligibility Meter */}
                        <div className="flex items-center space-x-2">
                          <div className="relative w-10 h-10 shrink-0">
                            <svg className="w-full h-full transform -rotate-90">
                              <circle
                                cx="20"
                                cy="20"
                                r="16"
                                className="stroke-slate-100 dark:stroke-slate-800 fill-transparent"
                                strokeWidth="3"
                              />
                              <circle
                                cx="20"
                                cy="20"
                                r="16"
                                className={`${strokeColor} fill-transparent transition-all duration-1000`}
                                strokeWidth="3.5"
                                strokeDasharray={2 * Math.PI * 16}
                                strokeDashoffset={2 * Math.PI * 16 * (1 - scheme.eligibilityScore / 100)}
                              />
                            </svg>
                            <span className="absolute inset-0 flex items-center justify-center font-mono font-black text-[9px] text-slate-900 dark:text-slate-100">
                              {scheme.eligibilityScore}%
                            </span>
                          </div>
                          <div className="text-right">
                            <span className="text-[8px] text-slate-400 block font-bold uppercase tracking-wider">My Eligibility</span>
                            <span className={`text-[10px] font-black uppercase ${textClass}`}>{scheme.eligibilityScore}% Eligible</span>
                          </div>
                        </div>
                      </div>

                      {/* Title & Department */}
                      <div className="space-y-1">
                        <h3 className="text-lg font-extrabold text-slate-900 dark:text-white leading-snug group-hover:text-gov-saffron transition-colors">
                          {scheme.translated.name}
                        </h3>
                        <p className="text-[11px] text-slate-500 font-bold uppercase tracking-wide">
                          {scheme.translated.department}
                        </p>
                      </div>

                      {/* Description and benefits */}
                      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                        {scheme.translated.description}
                      </p>

                      <div className="bg-slate-50 dark:bg-slate-850 p-3 rounded-2xl border border-slate-200/60 dark:border-slate-800 text-xs text-slate-800 dark:text-slate-200">
                        <span className="text-[9px] font-black text-gov-saffron uppercase block tracking-widest mb-1">
                          Welfare Benefit Package
                        </span>
                        <p className="font-semibold">{scheme.translated.benefits}</p>
                      </div>

                      {/* AI-powered explanation */}
                      <div className="bg-gov-saffron/5 border border-gov-saffron/20 border-l-2 border-l-gov-saffron rounded-2xl p-3.5 space-y-2">
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center space-x-1.5 text-[9px] font-black uppercase text-gov-saffron">
                            <Sparkles className="w-4 h-4 text-gov-saffron animate-pulse" />
                            <span>Bharat AI Evaluation Reasoning</span>
                          </div>
                        </div>
                        <p className="text-xs text-slate-700 dark:text-slate-200 leading-normal font-semibold">
                          {scheme.translated.aiExplanation}
                        </p>
                        
                        {/* Custom voice reader integration inside card */}
                        <div className="pt-2">
                          <VoiceReader 
                            text={`${scheme.translated.name}. Benefits: ${scheme.translated.benefits}. AI Explanation: ${scheme.translated.aiExplanation}`}
                            language={language}
                            sectionId={scheme.id}
                          />
                        </div>
                      </div>

                      {/* Highlighted disqualifications if not fully eligible */}
                      {scheme.reasonsNotEligible.length > 0 && (
                        <div className="bg-red-500/5 border border-red-200/50 dark:border-red-950/50 rounded-2xl p-3 space-y-1.5">
                          <span className="text-[9px] font-black uppercase text-red-600 block tracking-wider flex items-center space-x-1">
                            <ShieldAlert className="w-3.5 h-3.5 text-red-500" />
                            <span>Ineligibility Diagnostics</span>
                          </span>
                          <div className="space-y-1">
                            {scheme.reasonsNotEligible.map((r, i) => (
                              <p key={i} className="text-[11px] text-red-700 dark:text-red-400 font-semibold">• {r}</p>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Live Application tracking pipeline simulation inside the card! */}
                      {hasApplied && (
                        <div className="p-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-black uppercase text-emerald-600 tracking-wider">
                              Live Application Pipeline Tracker
                            </span>
                            <span className={`px-2.5 py-0.5 text-[9px] font-black uppercase tracking-wider rounded-full ${
                              hasApplied.status === 'Approved' ? 'bg-emerald-500/10 text-emerald-500' :
                              hasApplied.status === 'Under Review' ? 'bg-amber-500/10 text-amber-500' :
                              hasApplied.status === 'Rejected' ? 'bg-red-500/10 text-red-500' : 'bg-blue-500/10 text-blue-500'
                            }`}>
                              {hasApplied.status}
                            </span>
                          </div>

                          {/* Progress Line */}
                          <div className="relative pt-1">
                            <div className="overflow-hidden h-1.5 text-xs flex rounded bg-slate-200 dark:bg-slate-800">
                              <div 
                                style={{ width: `${hasApplied.stepIndex * 33.3}%` }} 
                                className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-emerald-500 transition-all duration-1000"
                              />
                            </div>
                            <div className="flex justify-between text-[9px] font-extrabold text-slate-400 uppercase pt-2">
                              <span className={hasApplied.stepIndex >= 1 ? "text-emerald-500 font-black" : ""}>Submitted</span>
                              <span className={hasApplied.stepIndex >= 2 ? "text-emerald-500 font-black" : ""}>Under Review</span>
                              <span className={hasApplied.stepIndex >= 3 ? (hasApplied.status === 'Approved' ? "text-emerald-500 font-black" : "text-red-500 font-black") : ""}>
                                {hasApplied.status === 'Rejected' ? 'Rejected' : 'Approved'}
                              </span>
                            </div>
                          </div>

                          {/* Trigger stage progression for presentation review */}
                          <div className="flex items-center justify-between gap-2 pt-1.5">
                            <p className="text-[10px] text-slate-400 font-medium">Applied: {hasApplied.appliedDate}</p>
                            <div className="flex items-center space-x-2">
                              {hasApplied.status !== 'Approved' && hasApplied.status !== 'Rejected' && (
                                <button
                                  onClick={() => handleAdvanceSimulation(scheme.id)}
                                  className="px-3 py-1 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-lg text-[10px] font-black uppercase tracking-wider hover:bg-slate-800 transition-colors cursor-pointer"
                                >
                                  Process Stage
                                </button>
                              )}
                              <button
                                onClick={() => handleResetApplication(scheme.id)}
                                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                                title="Reset simulation"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      )}

                    </div>

                    {/* Footer Actions */}
                    <div className="pt-4 border-t border-slate-100 dark:border-slate-800 mt-5 flex flex-wrap items-center justify-between gap-3">
                      
                      {/* Compare Checkbox Trigger */}
                      <label className="inline-flex items-center space-x-2 text-xs font-bold text-slate-600 dark:text-slate-300 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={isCompared}
                          onChange={() => handleToggleCompare(scheme.id)}
                          className="rounded border-slate-300 text-gov-saffron focus:ring-gov-saffron w-4 h-4"
                        />
                        <span>Compare Scheme</span>
                      </label>

                      <div className="flex items-center space-x-2">
                        
                        {/* Bookmark action */}
                        <button
                          onClick={() => handleSaveScheme(scheme.id, scheme.translated.name)}
                          className={`p-2 rounded-xl border transition-all cursor-pointer ${
                            isSaved
                              ? 'bg-gov-saffron/15 border-gov-saffron text-gov-saffron scale-110'
                              : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
                          }`}
                          title="Save scheme"
                        >
                          <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
                        </button>

                        {/* Share */}
                        <button
                          onClick={() => handleShareScheme(scheme.translated.name)}
                          className="p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-all cursor-pointer"
                          title="Share"
                        >
                          <Share2 className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => triggerViewScheme(scheme.id)}
                          className="px-4 py-2 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-800 dark:text-slate-200 transition-all cursor-pointer"
                        >
                          {dict.learnMore}
                        </button>

                        <button
                          onClick={() => handleApplyScheme(scheme.id, scheme.translated.name)}
                          className={`px-4 py-2 text-white font-black rounded-xl text-xs uppercase tracking-wider transition-all duration-300 shadow-sm cursor-pointer ${
                            hasApplied 
                              ? 'bg-slate-400 cursor-not-allowed opacity-50' 
                              : 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100'
                          }`}
                          disabled={!!hasApplied}
                        >
                          {hasApplied ? "Applied" : dict.applyNow}
                        </button>

                      </div>

                    </div>

                  </div>
                );
              })
            ) : (
              /* Empty state fallback with Tips */
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[32px] p-12 text-center shadow-sm space-y-6">
                <Compass className="w-16 h-16 text-slate-400 mx-auto animate-spin [animation-duration:12s]" />
                <div className="max-w-md mx-auto space-y-2">
                  <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase">
                    {dict.emptyTitle}
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed font-semibold">
                    {dict.emptyTip}
                  </p>
                </div>

                {/* Recommendation parameters diagnostics */}
                <div className="p-4 bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 rounded-2xl text-left space-y-3 max-w-lg mx-auto">
                  <span className="text-xs font-black text-slate-900 dark:text-white block uppercase tracking-wider flex items-center space-x-1">
                    <Sparkles className="w-4 h-4 text-gov-saffron animate-pulse" />
                    <span>{dict.suggestTips}</span>
                  </span>
                  <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                    <p className="font-semibold">• If your family income is under ₹2.5 Lakhs, verify your Income limit slider setting is accurate.</p>
                    <p className="font-semibold">• For Agricultural Subsidies, toggle 'Is Farmer' checkbox in the sidebar customized filters.</p>
                    <p className="font-semibold">• For Mahatma Phule Healthcare scheme, confirm 'Maharashtra' domicile state is chosen.</p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setActiveFilters({ type: 'All', state: 'All States', complexity: 'All' });
                    setSelectedCategory(null);
                    setSearchTerm('');
                    addNotification("Welfare filters fully cleared.", "info");
                  }}
                  className="px-5 py-2.5 bg-gov-saffron hover:bg-gov-saffron/90 text-slate-950 font-black rounded-xl text-xs uppercase tracking-widest transition-all cursor-pointer shadow"
                >
                  Clear All Filters
                </button>
              </div>
            )}
          </div>

        </div>

      </div>

      {/* ====================================
          SIDE-BY-SIDE COMPARE SCHEMES MODAL MATRIX
          ==================================== */}
      <AnimatePresence>
        {isCompareOpen && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white dark:bg-slate-900 rounded-[32px] border border-slate-200 dark:border-slate-800 shadow-2xl max-w-5xl w-full overflow-hidden text-left"
            >
              <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-850">
                <div className="space-y-1">
                  <h3 className="font-extrabold text-lg text-slate-900 dark:text-white flex items-center space-x-2">
                    <ArrowLeftRight className="w-5 h-5 text-gov-saffron" />
                    <span>National Welfare Matrix comparison</span>
                  </h3>
                  <p className="text-xs text-slate-400">Comparing details side-by-side to choose best eligibility alignments</p>
                </div>
                <button
                  onClick={() => setIsCompareOpen(false)}
                  className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-full transition-all cursor-pointer"
                >
                  <X className="w-5 h-5 text-slate-400" />
                </button>
              </div>

              <div className="p-6 overflow-x-auto">
                {comparedSchemes.length > 0 ? (
                  <table className="w-full text-xs font-semibold text-slate-600 dark:text-slate-300 border-collapse">
                    <thead>
                      <tr>
                        <th className="p-4 bg-slate-50 dark:bg-slate-950/20 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-200 dark:border-slate-800 text-left w-1/4">Criteria</th>
                        {comparedSchemes.map(sch => (
                          <th key={sch.id} className="p-4 bg-slate-50 dark:bg-slate-950/20 border-b border-slate-200 dark:border-slate-800 text-left w-1/3">
                            <h4 className="font-extrabold text-sm text-slate-950 dark:text-white mb-1 leading-snug">{sch.translated.name}</h4>
                            <span className="px-2 py-0.5 bg-gov-saffron/10 text-gov-saffron rounded text-[8px] uppercase tracking-wider font-bold">{sch.type} Scheme</span>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      <tr>
                        <td className="p-4 font-bold text-slate-950 dark:text-white uppercase text-[9px] bg-slate-50/50 dark:bg-slate-950/5">Department</td>
                        {comparedSchemes.map(sch => (
                          <td key={sch.id} className="p-4 text-slate-600 dark:text-slate-300">{sch.translated.department}</td>
                        ))}
                      </tr>
                      <tr>
                        <td className="p-4 font-bold text-slate-950 dark:text-white uppercase text-[9px] bg-slate-50/50 dark:bg-slate-950/5">Financial Benefits</td>
                        {comparedSchemes.map(sch => (
                          <td key={sch.id} className="p-4 font-extrabold text-emerald-600">{sch.translated.benefits}</td>
                        ))}
                      </tr>
                      <tr>
                        <td className="p-4 font-bold text-slate-950 dark:text-white uppercase text-[9px] bg-slate-50/50 dark:bg-slate-950/5">Eligibility Overview</td>
                        {comparedSchemes.map(sch => (
                          <td key={sch.id} className="p-4 text-slate-600 dark:text-slate-300 leading-relaxed">{sch.translated.eligibility}</td>
                        ))}
                      </tr>
                      <tr>
                        <td className="p-4 font-bold text-slate-950 dark:text-white uppercase text-[9px] bg-slate-50/50 dark:bg-slate-950/5">Match Score</td>
                        {comparedSchemes.map(sch => (
                          <td key={sch.id} className="p-4">
                            <div className="flex items-center space-x-1 text-emerald-600 font-extrabold text-sm font-mono">
                              <Sparkles className="w-4 h-4 text-gov-saffron" />
                              <span>{sch.recommendationScore} / 100</span>
                            </div>
                          </td>
                        ))}
                      </tr>
                      <tr>
                        <td className="p-4 font-bold text-slate-950 dark:text-white uppercase text-[9px] bg-slate-50/50 dark:bg-slate-950/5">Required Documents</td>
                        {comparedSchemes.map(sch => (
                          <td key={sch.id} className="p-4 space-y-1">
                            {sch.translated.documents.map((d, idx) => (
                              <div key={idx} className="flex items-center space-x-1">
                                <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                                <span className="text-[11px] font-semibold">{d}</span>
                              </div>
                            ))}
                          </td>
                        ))}
                      </tr>
                      <tr>
                        <td className="p-4 font-bold text-slate-950 dark:text-white uppercase text-[9px] bg-slate-50/50 dark:bg-slate-950/5">Est. Approval Time</td>
                        {comparedSchemes.map(sch => (
                          <td key={sch.id} className="p-4 text-slate-600 dark:text-slate-300 font-bold">{sch.estimatedApprovalTime}</td>
                        ))}
                      </tr>
                      <tr>
                        <td className="p-4 font-bold text-slate-950 dark:text-white uppercase text-[9px] bg-slate-50/50 dark:bg-slate-950/5">Action</td>
                        {comparedSchemes.map(sch => (
                          <td key={sch.id} className="p-4">
                            <button
                              onClick={() => {
                                handleApplyScheme(sch.id, sch.translated.name);
                                setIsCompareOpen(false);
                              }}
                              className="px-4 py-2 bg-slate-950 dark:bg-white text-white dark:text-slate-900 rounded-xl font-bold uppercase tracking-wide text-[10px]"
                            >
                              Apply Directly
                            </button>
                          </td>
                        ))}
                      </tr>
                    </tbody>
                  </table>
                ) : (
                  <div className="py-12 text-center text-slate-400">
                    No schemes selected. Check &quot;Compare Scheme&quot; checkboxes in cards list above.
                  </div>
                )}
              </div>

              <div className="p-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/10 flex justify-end">
                <button
                  onClick={() => setComparedSchemeIds([])}
                  className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-800 mr-2 cursor-pointer"
                >
                  Clear Matrix list
                </button>
                <button
                  onClick={() => setIsCompareOpen(false)}
                  className="px-5 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-xs uppercase tracking-wide rounded-xl cursor-pointer"
                >
                  Close Matrix
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ====================================
          BEAUTIFUL SCHEME DETAILS MODAL
          ==================================== */}
      <AnimatePresence>
        {activeDetailsId && activeDetailsScheme && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white dark:bg-slate-900 rounded-[32px] border border-slate-200 dark:border-slate-800 shadow-2xl max-w-3xl w-full overflow-hidden text-left"
            >
              {/* Header */}
              <div className="p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 flex items-start justify-between">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="px-2.5 py-0.5 bg-gov-saffron/10 text-gov-saffron border border-gov-saffron/20 text-[9px] font-black rounded-md uppercase">
                      {activeDetailsScheme.type} Scheme
                    </span>
                    <span className="px-2.5 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-500 border border-slate-200 dark:border-slate-700 text-[9px] font-black rounded-md uppercase">
                      {activeDetailsScheme.category}
                    </span>
                  </div>
                  <h3 className="text-xl font-extrabold text-slate-950 dark:text-white leading-snug">
                    {activeDetailsScheme.translated.name}
                  </h3>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-wide">
                    {activeDetailsScheme.translated.department}
                  </p>
                </div>
                <button
                  onClick={() => setActiveDetailsId(null)}
                  className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-full transition-all cursor-pointer shrink-0 ml-4"
                >
                  <X className="w-5 h-5 text-slate-400" />
                </button>
              </div>

              {/* Body */}
              <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
                
                {/* Description */}
                <div className="space-y-2">
                  <h4 className="text-xs uppercase font-black tracking-widest text-slate-400 flex items-center space-x-1.5">
                    <Info className="w-4 h-4 text-slate-400" />
                    <span>Scheme Overview</span>
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-semibold">
                    {activeDetailsScheme.translated.description}
                  </p>
                </div>

                {/* Benefits */}
                <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-2xl p-4 space-y-2">
                  <h4 className="text-xs uppercase font-black tracking-widest text-emerald-600 flex items-center space-x-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    <span>Financial & Support Benefits</span>
                  </h4>
                  <p className="text-xs text-slate-700 dark:text-slate-100 font-black leading-relaxed">
                    {activeDetailsScheme.translated.benefits}
                  </p>
                </div>

                {/* Eligibility requirements */}
                <div className="space-y-2">
                  <h4 className="text-xs uppercase font-black tracking-widest text-slate-400 flex items-center space-x-1.5">
                    <User className="w-4 h-4 text-slate-400" />
                    <span>Eligibility Criteria</span>
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-semibold">
                    {activeDetailsScheme.translated.eligibility}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                  
                  {/* Documents needed */}
                  <div className="space-y-3">
                    <h4 className="text-xs uppercase font-black tracking-widest text-slate-400 flex items-center space-x-1.5">
                      <FileText className="w-4 h-4 text-slate-400" />
                      <span>{dict.documents}</span>
                    </h4>
                    <div className="space-y-2 bg-slate-50 dark:bg-slate-850 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
                      {activeDetailsScheme.translated.documents.map((doc, idx) => (
                        <div key={idx} className="flex items-center space-x-2 text-xs font-semibold text-slate-700 dark:text-slate-200">
                          <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                          <span>{doc}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Steps */}
                  <div className="space-y-3">
                    <h4 className="text-xs uppercase font-black tracking-widest text-slate-400 flex items-center space-x-1.5">
                      <BookOpen className="w-4 h-4 text-slate-400" />
                      <span>{dict.steps}</span>
                    </h4>
                    <div className="space-y-3 bg-slate-50 dark:bg-slate-850 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
                      {activeDetailsScheme.translated.steps.map((step, idx) => (
                        <div key={idx} className="flex items-start space-x-2 text-xs font-semibold text-slate-700 dark:text-slate-200">
                          <span className="font-bold text-gov-saffron shrink-0 font-mono">{idx + 1}.</span>
                          <span className="leading-snug text-slate-600 dark:text-slate-300">{step}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>

                {/* Additional meta attributes */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-slate-50 dark:bg-slate-850 border border-slate-150 dark:border-slate-800 rounded-2xl text-[11px] font-bold text-slate-500">
                  <div>
                    <span>Official Deadline</span>
                    <p className="text-xs text-slate-800 dark:text-slate-200 font-extrabold mt-0.5">{activeDetailsScheme.deadline}</p>
                  </div>
                  <div>
                    <span>Est. Approval Time</span>
                    <p className="text-xs text-slate-800 dark:text-slate-200 font-extrabold mt-0.5">{activeDetailsScheme.estimatedApprovalTime}</p>
                  </div>
                  <div>
                    <span>Application Complexity</span>
                    <p className="text-xs text-slate-800 dark:text-slate-200 font-extrabold mt-0.5">{activeDetailsScheme.complexity}</p>
                  </div>
                  <div>
                    <span>Popularity Score</span>
                    <p className="text-xs text-slate-800 dark:text-slate-200 font-extrabold mt-0.5">{activeDetailsScheme.popularityScore}% Applied</p>
                  </div>
                </div>

                {/* simulated official FAQ */}
                <div className="space-y-3 pt-2">
                  <h4 className="text-xs uppercase font-black tracking-widest text-slate-400 flex items-center space-x-1.5">
                    <HelpCircle className="w-4 h-4 text-slate-400" />
                    <span>Frequently Asked Questions (FAQ)</span>
                  </h4>
                  <div className="space-y-3 bg-slate-50 dark:bg-slate-850 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-200">
                    <div className="space-y-1">
                      <p className="font-extrabold">Q: Is there any registration fee for application?</p>
                      <p className="font-semibold text-slate-500">A: No, all registrations on official government portals (PM Kisan, NSP, Mudra) are completely free of charge.</p>
                    </div>
                    <div className="space-y-1 pt-2 border-t border-slate-200 dark:border-slate-800">
                      <p className="font-extrabold">Q: Can I apply for multiple scholarships at once?</p>
                      <p className="font-semibold text-slate-500">A: Students can apply for multiple listings but can receive only one main stipend under central/state welfare rules during a single academic year.</p>
                    </div>
                  </div>
                </div>

              </div>

              {/* Footer */}
              <div className="p-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 flex flex-wrap items-center justify-between gap-3">
                <button
                  onClick={() => {
                    addNotification(`PDF Guidelines downloaded successfully for "${activeDetailsScheme.translated.name}".`, 'success');
                    onSpeak("Guidelines downloaded.");
                  }}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center space-x-1.5 transition-colors cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Download PDF Guidelines</span>
                </button>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleSaveScheme(activeDetailsScheme.id, activeDetailsScheme.translated.name)}
                    className="px-4 py-2 border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-slate-800 rounded-xl text-xs font-bold transition-all cursor-pointer"
                  >
                    {savedSchemes.includes(activeDetailsScheme.id) ? "Bookmarked" : "Bookmark"}
                  </button>
                  <button
                    onClick={() => {
                      handleApplyScheme(activeDetailsScheme.id, activeDetailsScheme.translated.name);
                      setActiveDetailsId(null);
                    }}
                    className="px-5 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100 font-black rounded-xl text-xs uppercase tracking-wider transition-all cursor-pointer shadow-md"
                  >
                    Direct Apply Now
                  </button>
                </div>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
