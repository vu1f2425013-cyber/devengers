import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Search, 
  MapPin, 
  CheckCircle2, 
  ArrowRight, 
  ExternalLink, 
  AlertCircle 
} from 'lucide-react';
import { AppLanguage } from '../types';

interface ServicesHubProps {
  language: AppLanguage;
  onSpeak: (text: string) => void;
  addNotification: (text: string, type: 'success' | 'info' | 'warning') => void;
  applications: any[];
  addApplication: (app: any) => void;
}

const servicesList = [
  {
    id: "passport",
    name: "Indian Passport",
    category: "Identity & Travel",
    overview: "Apply for a fresh or renewal passport to travel internationally under the Consular, Passport & Visa Division of Ministry of External Affairs.",
    eligibility: "All citizens of India of any age (Minors require parental consent).",
    benefits: "Official national citizenship proof, valid globally, serves as ultimate address/ID proof.",
    documents: ["Aadhaar Card", "Birth Certificate / Class 10 Marksheet", "Electricity or Water Bill (Address Proof)", "Parental proof (if minor)"],
    processingTime: "7 - 15 Days (Normal) | 3 Days (Tatkaal)",
    fee: "₹1,500 (Normal) | ₹3,500 (Tatkaal)",
    nearestOffice: "Passport Seva Kendra (PSK), South Extension, New Delhi",
    steps: [
      "Register on Passport Seva Online Portal.",
      "Fill the online application form and pay the fee.",
      "Schedule and attend an interview at your nearest PSK.",
      "Undergo local police verification.",
      "Receive passport by Speed Post."
    ],
    faqs: [
      { q: "What is Tatkaal processing?", a: "Tatkaal is an express application path for emergency travels where passports are printed and dispatched within 3 days without waiting for police verification first." },
      { q: "Do I need to carry original papers to PSK?", a: "Yes, you must carry original documents for physical verification at the PSK counter." }
    ]
  },
  {
    id: "aadhaar",
    name: "Aadhaar Card (UIDAI)",
    category: "Identity & Travel",
    overview: "Get or update your 12-digit unique identity number issued by the Unique Identification Authority of India.",
    eligibility: "Any individual residing in India (including minors and infants).",
    benefits: "Universal digital identity verification, mandatory for banking, subsidies, taxation, and phone connections.",
    documents: ["Proof of Identity (Voter ID, PAN, Passport)", "Proof of Address (Electricity Bill, Bank Statement)", "Proof of DOB (Birth Certificate)"],
    processingTime: "10 - 20 Days",
    fee: "Free for Fresh Enrolment | ₹50 for Demographic Update | ₹100 for Biometric Update",
    nearestOffice: "Aadhaar Enrolment Centre, Gole Market, New Delhi",
    steps: [
      "Locate and book appointment at an authorised UIDAI Enrolment Centre.",
      "Submit physical demographic proof papers.",
      "Complete biometric scan (iris, fingerprints, and photograph).",
      "Collect acknowledgment slip containing 14-digit EID.",
      "Download e-Aadhaar online or receive physical card via post."
    ],
    faqs: [
      { q: "Can I update Aadhaar details online?", a: "You can update your name, address, gender, and DOB online. Fingerprints and iris require a physical centre visit." },
      { q: "Is e-Aadhaar equally valid?", a: "Yes, digitally signed e-Aadhaar holds absolute legal validity under the Aadhaar Act." }
    ]
  },
  {
    id: "pan",
    name: "Permanent Account Number (PAN)",
    category: "Tax & Financial Services",
    overview: "Apply for a 10-digit alphanumeric identifier issued by the Income Tax Department to track financial transactions.",
    eligibility: "Any individual, company, or firm residing in India.",
    benefits: "Mandatory for filing tax returns, opening bank accounts, purchasing vehicles, and investing in stocks.",
    documents: ["Aadhaar Card (Instantly via e-KYC)", "Voter ID Card", "Passport size photograph"],
    processingTime: "10 Minutes (Instant e-PAN) | 10 Days (Physical Card)",
    fee: "Free for Instant e-PAN | ₹107 for Physical Plastic Card",
    nearestOffice: "UTIITSL / NSDL TIN Facilitation Centre, Connaught Place",
    steps: [
      "Visit NSDL/UTIITSL portal or select Instant e-PAN via Income Tax e-Filing.",
      "Validate your Aadhaar via OTP verification.",
      "Submit digital request.",
      "Instant e-PAN is generated in PDF format.",
      "Physical plastic laminated card is dispatched to address."
    ],
    faqs: [
      { q: "Is PAN card mandatory for students?", a: "It is not mandatory unless you have taxable income or wish to open a zero-balance student bank account." }
    ]
  },
  {
    id: "driving_license",
    name: "Driving License (Sarathi)",
    category: "Transport & Licensing",
    overview: "Acquire authorization to drive motor vehicles on Indian public roads under the Ministry of Road Transport & Highways.",
    eligibility: "Age 16+ for gearless 2-wheelers | Age 18+ for light motor vehicles (LMV).",
    benefits: "Legally drive motor vehicles, serves as an official photo ID and address proof.",
    documents: ["Learner's License", "Aadhaar Card", "Age Proof (School certificate, Birth certificate)", "Medical Certificate Form 1A (for heavy vehicles)"],
    processingTime: "15 Days (After driving test clearance)",
    fee: "₹200 (Learner's License) | ₹700 (Permanent License + Test Fee)",
    nearestOffice: "Regional Transport Office (RTO), Sarai Kale Khan, New Delhi",
    steps: [
      "Apply online for a Learner's License (LL) and clear an MCQ-based traffic signs test.",
      "Practice driving under LL rules for at least 30 days.",
      "Book slot for a physical driving test at your RTO.",
      "Drive vehicle on test track under officer supervision.",
      "Clear test to get Smartcard Driving License delivered to your address."
    ],
    faqs: [
      { q: "What is the validity of Driving License?", a: "A non-transport permanent driving license is valid for 20 years or until the holder reaches 40 years of age, whichever is earlier." }
    ]
  },
  {
    id: "birth_cert",
    name: "Birth Certificate",
    category: "Civil Registry",
    overview: "Official registration of a child's birth in municipal records under the Births and Deaths Registration Act, 1969.",
    eligibility: "Any child born within the municipal territory limits.",
    benefits: "Primary proof of age, mandatory for school admissions, passport, voter registration, and inheritance claims.",
    documents: ["Hospital Discharge Slip", "Aadhaar Card of Parents", "Address proof of parents"],
    processingTime: "5 - 7 Days",
    fee: "Free (If registered within 21 days of birth) | Late fees apply thereafter",
    nearestOffice: "Municipal Corporation Civic Centre, New Delhi",
    steps: [
      "Verify if hospital filed the birth report.",
      "Apply online at municipal corporation portal or visit ward office.",
      "Fill child's name, parents' details, and date of birth.",
      "Submit hospital discharge summary.",
      "Download digitally signed municipal certificate."
    ],
    faqs: [
      { q: "What if birth registration was delayed?", a: "Delayed registration after 30 days requires an affidavit from a notary public and executive magistrate approval." }
    ]
  },
  {
    id: "voter_id",
    name: "Voter ID Card (EPIC)",
    category: "Identity & Travel",
    overview: "Get registered in the electoral roll and receive an Electors Photo Identity Card issued by Election Commission of India.",
    eligibility: "Indian citizen, age 18 or above on the qualifying date.",
    benefits: "Confers voting rights in state and national elections, trusted national proof of address.",
    documents: ["Aadhaar Card", "Proof of Address", "Age Proof", "Recent passport-size photo"],
    processingTime: "15 - 30 Days",
    fee: "Free of Cost",
    nearestOffice: "SDM Office / Electoral Registration Centre, New Delhi",
    steps: [
      "Register online at Voters Service Portal (VSP) or via Voter Helpline App.",
      "Fill Form 6 for fresh registration.",
      "Upload age and residence proof.",
      "Electoral Booth Level Officer (BLO) visits home for verification.",
      "EPIC number is generated; card dispatched by speed post."
    ],
    faqs: [
      { q: "Can I vote with an e-EPIC?", a: "Yes, you can download digital e-EPIC and show it alongside Aadhaar at polling booths." }
    ]
  },
  {
    id: "electricity",
    name: "Electricity Connection",
    category: "Utilities & Land",
    overview: "Apply for a fresh domestic power connection from state utility distribution companies (DISCOMs).",
    eligibility: "Any owner or legal tenant occupying a residential property.",
    benefits: "Official domestic power supply, registered billing account serves as auxiliary address proof.",
    documents: ["Proof of Ownership (Sale Deed, Tax Receipt) or Lease Agreement", "Aadhaar Card of Applicant", "NOC from builder/owner"],
    processingTime: "5 - 7 Days",
    fee: "₹1,500 - ₹3,000 (Based on sanctioned load kW)",
    nearestOffice: "State DISCOM Substation / Zonal Division Office",
    steps: [
      "Register online on state electricity board portal.",
      "Submit load requirement and structural ownership proofs.",
      "DISCOM technician conducts a site inspection for safety.",
      "Pay security deposit and connection charges.",
      "Meter installation is executed and line energized."
    ],
    faqs: []
  },
  {
    id: "income_cert",
    name: "Income Certificate",
    category: "Civil Registry",
    overview: "Document issued by the state revenue authority certifying the annual income of an individual or family.",
    eligibility: "Any salaried, self-employed, or agricultural resident of the state.",
    benefits: "Prerequisite for claiming state scholarships, fee waivers, agricultural subsidies, and EWS quota.",
    documents: ["Salary Slips / ITR return", "Affidavit declaring family income sources", "Aadhaar Card", "Ration Card"],
    processingTime: "7 - 10 Days",
    fee: "₹20 - ₹50 (Depending on State Tehsil office)",
    nearestOffice: "Tehsildar Office / Revenue Department / CSC Center",
    steps: [
      "Apply online on State's e-District portal.",
      "Fill income sources (salary, agriculture, business).",
      "Upload declarations and salary certificates.",
      "Local Patwari or Revenue Officer conducts inquiry.",
      "Tehsildar issues digitally authenticated certificate."
    ],
    faqs: []
  }
];

const categories = ["All", "Identity & Travel", "Tax & Financial Services", "Transport & Licensing", "Civil Registry", "Utilities & Land"];

export default function ServicesHub({
  language,
  onSpeak,
  addNotification,
  applications,
  addApplication
}: ServicesHubProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [activeService, setActiveService] = useState<any | null>(null);
  const [applying, setApplying] = useState(false);

  // Form states for online apply
  const [formName, setFormName] = useState("");
  const [formAadhaar, setFormAadhaar] = useState("");
  const [formUrgency, setFormUrgency] = useState<"Normal" | "Tatkaal">("Normal");

  // Filtering
  const filteredServices = servicesList.filter(serv => {
    const matchesSearch = serv.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          serv.overview.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = selectedCategory === "All" || serv.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const handleApplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formAadhaar.length !== 12) {
      addNotification("Aadhaar Card must be exactly 12 digits", "warning");
      return;
    }

    const newApp = {
      id: `APP-${Math.floor(100000 + Math.random() * 900000)}`,
      serviceId: activeService.id,
      serviceName: activeService.name,
      applicantName: formName,
      aadhaar: `XXXX-XXXX-${formAadhaar.slice(-4)}`,
      urgency: formUrgency,
      date: new Date().toLocaleDateString(),
      status: "Processing"
    };

    addApplication(newApp);
    addNotification(`Demographic Submission successful! Reference: ${newApp.id}`, 'success');
    onSpeak(`Form submitted successfully. Reference ticket ID is ${newApp.id}. Please await automated verification.`);
    
    // Clear Form & Close modal
    setFormName("");
    setFormAadhaar("");
    setFormUrgency("Normal");
    setApplying(false);
    setActiveService(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Title Header */}
      <div className="text-center max-w-3xl mx-auto mb-10 space-y-2">
        <h1 className="text-3xl font-black tracking-tight text-gov-primary uppercase">
          Citizen Services Hub
        </h1>
        <p className="text-gov-text-secondary text-sm font-semibold">
          Centralized Gateway for National Digital Registrations • Fully AI Guided
        </p>
      </div>

      {/* Search & Categories Navigation Bar */}
      <div className="space-y-4 mb-8">
        
        {/* Search bar wrapper */}
        <div className="max-w-xl mx-auto relative">
          <Search className="absolute left-4 top-3.5 w-5 h-5 text-gov-text-secondary" />
          <input
            type="text"
            placeholder="Search passports, tax PAN, UIDAI Aadhaar, water permits..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-gov-surface border border-gov-border focus:border-gov-primary rounded-2xl pl-12 pr-4 py-3.5 text-xs sm:text-sm text-gov-text-primary placeholder-gov-text-secondary font-bold outline-none shadow-xs transition-all"
          />
        </div>

        {/* Horizontal Category Pill selector */}
        <div className="flex items-center justify-center flex-wrap gap-2 pt-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setSelectedCategory(cat);
                onSpeak(`Filtering category to ${cat}`);
              }}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                selectedCategory === cat 
                  ? 'bg-gov-primary text-white border-gov-primary shadow-sm' 
                  : 'bg-gov-surface hover:bg-gov-bg text-gov-text-secondary border-gov-border'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

      </div>

      {/* Services Grid cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredServices.map((serv) => (
          <div
            key={serv.id}
            onClick={() => {
              setActiveService(serv);
              setApplying(false);
              onSpeak(`Displaying details for ${serv.name}`);
            }}
            className="group cursor-pointer bg-gov-surface border border-gov-border hover:border-gov-primary/40 rounded-3xl p-6 text-left flex flex-col justify-between h-full hover:shadow-lg transition-all"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 bg-gov-secondary/10 text-gov-secondary border border-gov-secondary/20 text-[9px] font-extrabold rounded-md uppercase">
                  {serv.category}
                </span>
                <span className="text-[10px] text-gov-text-secondary font-mono font-bold">
                  Code: UID-{serv.id.toUpperCase().substring(0, 4)}
                </span>
              </div>

              <h3 className="text-lg font-black text-gov-primary group-hover:text-gov-secondary transition-colors">
                {serv.name}
              </h3>
              
              <p className="text-xs text-gov-text-secondary leading-relaxed line-clamp-3 font-semibold">
                {serv.overview}
              </p>
            </div>

            <div className="pt-6 border-t border-gov-border mt-4 flex items-center justify-between text-xs">
              <div className="text-[10px] text-gov-text-secondary font-bold">
                Fee: <span className="text-gov-primary font-bold font-mono">{serv.fee.split(" ")[0]}</span>
              </div>
              <div className="flex items-center space-x-1.5 text-gov-secondary group-hover:translate-x-1 transition-transform font-bold">
                <span>View Guidelines</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>
        ))}

        {filteredServices.length === 0 && (
          <div className="col-span-full bg-gov-surface border border-gov-border rounded-3xl p-12 text-center text-gov-text-secondary space-y-2 shadow-xs">
            <AlertCircle className="w-10 h-10 text-gov-text-secondary mx-auto" />
            <p className="font-bold text-sm text-gov-primary">No matching service found</p>
            <p className="text-xs font-semibold text-gov-text-secondary">Try modifying your search or click 'All' categories.</p>
          </div>
        )}
      </div>

      {/* Slide-over Detail / Apply Drawer */}
      {activeService && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-gov-primary/30 backdrop-blur-xs flex justify-end">
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            className="w-full max-w-xl bg-gov-surface border-l border-gov-border h-full overflow-y-auto shadow-2xl flex flex-col justify-between"
          >
            {/* Header */}
            <div className="bg-gov-bg px-6 py-5 border-b border-gov-border flex items-center justify-between text-left">
              <div>
                <span className="text-[10px] bg-gov-secondary/15 text-gov-secondary border border-gov-secondary/20 px-2 py-0.5 rounded-md font-extrabold uppercase">
                  {activeService.category}
                </span>
                <h2 className="text-xl font-black text-gov-primary mt-1">{activeService.name}</h2>
              </div>
              <button
                onClick={() => {
                  setActiveService(null);
                  setApplying(false);
                }}
                className="w-8 h-8 rounded-full bg-gov-surface hover:bg-gov-bg text-gov-text-secondary hover:text-gov-text-primary border border-gov-border flex items-center justify-center font-bold font-mono cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Scrollable details canvas */}
            <div className="flex-grow p-6 space-y-6 text-left overflow-y-auto">
              
              {!applying ? (
                <>
                  {/* Quick Metrics Cards */}
                  <div className="grid grid-cols-3 gap-3">
                    <div className="bg-gov-bg p-3 rounded-xl border border-gov-border">
                      <span className="text-[9px] text-gov-text-secondary block uppercase font-bold">Process Time</span>
                      <span className="font-bold text-xs text-gov-text-primary">{activeService.processingTime}</span>
                    </div>
                    <div className="bg-gov-bg p-3 rounded-xl border border-gov-border">
                      <span className="text-[9px] text-gov-text-secondary block uppercase font-bold">Standard Fee</span>
                      <span className="font-mono font-bold text-xs text-gov-text-primary">{activeService.fee}</span>
                    </div>
                    <div className="bg-gov-bg p-3 rounded-xl border border-gov-border col-span-1">
                      <span className="text-[9px] text-gov-text-secondary block uppercase font-bold">Enrolment Code</span>
                      <span className="font-mono text-xs text-gov-secondary font-bold">UID-{activeService.id.toUpperCase().substring(0, 4)}</span>
                    </div>
                  </div>

                  {/* Overview */}
                  <div className="space-y-1.5">
                    <h4 className="text-xs uppercase tracking-wider font-bold text-gov-text-secondary">Service Overview</h4>
                    <p className="text-xs sm:text-sm text-gov-text-primary leading-relaxed bg-gov-bg/60 p-3.5 rounded-xl border border-gov-border font-medium">
                      {activeService.overview}
                    </p>
                  </div>

                  {/* Eligibility & Benefits */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <h4 className="text-xs uppercase tracking-wider font-bold text-gov-text-secondary">Who is Eligible?</h4>
                      <p className="text-xs text-gov-text-primary bg-gov-bg/30 p-3 rounded-xl border border-gov-border leading-relaxed min-h-[80px] font-medium">
                        {activeService.eligibility}
                      </p>
                    </div>
                    <div className="space-y-1.5">
                      <h4 className="text-xs uppercase tracking-wider font-bold text-gov-text-secondary">Key Benefits</h4>
                      <p className="text-xs text-gov-text-primary bg-gov-bg/30 p-3 rounded-xl border border-gov-border leading-relaxed min-h-[80px] font-medium">
                        {activeService.benefits}
                      </p>
                    </div>
                  </div>

                  {/* Required Documents */}
                  <div className="space-y-2">
                    <h4 className="text-xs uppercase tracking-wider font-bold text-gov-text-secondary">Required Documents (Uploadable in AI Desk)</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 bg-gov-bg/60 p-4 rounded-xl border border-gov-border">
                      {activeService.documents.map((doc, index) => (
                        <div key={index} className="flex items-center space-x-2 text-xs text-gov-text-primary font-semibold">
                          <CheckCircle2 className="w-4 h-4 text-gov-success shrink-0" />
                          <span className="truncate">{doc}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Step by Step Process */}
                  <div className="space-y-3">
                    <h4 className="text-xs uppercase tracking-wider font-bold text-gov-text-secondary">Application Resolution Path</h4>
                    <div className="space-y-2">
                      {activeService.steps.map((step, index) => (
                        <div key={index} className="flex items-start space-x-3 text-xs font-semibold">
                          <div className="w-5 h-5 bg-gov-bg border border-gov-border text-gov-secondary font-black rounded-md flex items-center justify-center shrink-0 text-[10px]">
                            {index + 1}
                          </div>
                          <p className="text-gov-text-primary pt-0.5">{step}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Nearest Office */}
                  <div className="bg-gov-bg/70 p-4 rounded-xl border border-gov-border space-y-1">
                    <span className="text-[9px] uppercase font-bold text-gov-text-secondary tracking-wider flex items-center space-x-1">
                      <MapPin className="w-3.5 h-3.5 text-gov-saffron shrink-0" />
                      <span>Nearest Physical Office Center:</span>
                    </span>
                    <p className="text-xs font-bold text-gov-primary">{activeService.nearestOffice}</p>
                  </div>
                </>
              ) : (
                /* Step by step Apply form */
                <form onSubmit={handleApplySubmit} className="space-y-6">
                  <div className="bg-gov-bg p-4 rounded-xl border border-gov-border text-xs space-y-1">
                    <h4 className="font-extrabold text-gov-secondary">Demographics Integration</h4>
                    <p className="text-gov-text-secondary font-semibold">Filling out official application dockets for {activeService.name}. Details are auto-encrypted.</p>
                  </div>

                  {/* Applicant Name */}
                  <div className="space-y-2">
                    <label className="text-xs text-gov-text-secondary font-bold uppercase tracking-wider block">Applicant's Full Name</label>
                    <input
                      type="text"
                      required
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      placeholder="As printed on Aadhaar card"
                      className="w-full bg-gov-bg border border-gov-border rounded-xl px-4 py-3 text-xs text-gov-text-primary font-bold outline-none focus:border-gov-primary"
                    />
                  </div>

                  {/* Aadhaar Number */}
                  <div className="space-y-2">
                    <label className="text-xs text-gov-text-secondary font-bold uppercase tracking-wider block">12-Digit Aadhaar Card Number</label>
                    <input
                      type="text"
                      required
                      maxLength={12}
                      value={formAadhaar}
                      onChange={(e) => setFormAadhaar(e.target.value.replace(/\D/g, ""))}
                      placeholder="XXXX XXXX XXXX"
                      className="w-full bg-gov-bg border border-gov-border rounded-xl px-4 py-3 text-xs text-gov-text-primary font-bold outline-none focus:border-gov-primary font-mono tracking-widest"
                    />
                  </div>

                  {/* Urgency */}
                  <div className="space-y-2">
                    <label className="text-xs text-gov-text-secondary font-bold uppercase tracking-wider block">Processing Track Speed</label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setFormUrgency("Normal")}
                        className={`py-3.5 rounded-xl border text-xs font-bold cursor-pointer ${
                          formUrgency === 'Normal' 
                            ? 'bg-gov-secondary/15 text-gov-secondary border-gov-secondary' 
                            : 'bg-gov-bg border-gov-border text-gov-text-secondary hover:text-gov-text-primary'
                        }`}
                      >
                        Normal Process (Standard Fee)
                      </button>
                      <button
                        type="button"
                        onClick={() => setFormUrgency("Tatkaal")}
                        className={`py-3.5 rounded-xl border text-xs font-bold cursor-pointer ${
                          formUrgency === 'Tatkaal' 
                            ? 'bg-gov-saffron/15 text-gov-primary border-gov-saffron' 
                            : 'bg-gov-bg border-gov-border text-gov-text-secondary hover:text-gov-text-primary'
                        }`}
                      >
                        Tatkaal Track (Premium Surcharge)
                      </button>
                    </div>
                  </div>

                  {/* Terms check */}
                  <div className="flex items-start space-x-2 bg-gov-bg p-3 rounded-lg border border-gov-border">
                    <input type="checkbox" required className="mt-0.5 shrink-0 focus:ring-0" />
                    <p className="text-[10px] text-gov-text-secondary font-bold leading-relaxed">
                      I hereby declare that I am a citizen of India, and all demographic/biometric declarations submitted correspond precisely with official state papers. Falsification is indictable under civil registries code.
                    </p>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-4 bg-gov-success hover:bg-gov-success/90 text-white text-xs uppercase font-black tracking-wider rounded-xl transition-all shadow-md cursor-pointer"
                  >
                    Confirm & Submit ({activeService.fee.split(" ")[0]})
                  </button>
                </form>
              )}

            </div>

            {/* Action buttons footer */}
            <div className="p-6 bg-gov-bg border-t border-gov-border flex items-center justify-between gap-4">
              {!applying ? (
                <>
                  <button
                    onClick={() => {
                      setApplying(true);
                      onSpeak(`Initiated online application form`);
                    }}
                    className="flex-grow py-3.5 bg-gov-primary hover:bg-gov-primary/95 text-white font-black rounded-xl transition-all text-xs uppercase tracking-wider cursor-pointer"
                  >
                    Apply Online Now
                  </button>
                  <button
                    onClick={() => {
                      addNotification(`Demo Application track initiated for ${activeService.name}`, 'info');
                      onSpeak("Tracking application");
                    }}
                    className="px-5 py-3.5 bg-gov-surface hover:bg-gov-bg border border-gov-border text-gov-text-primary rounded-xl text-xs font-bold cursor-pointer"
                  >
                    Track Status
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={() => setApplying(false)}
                  className="w-full py-3 bg-gov-surface hover:bg-gov-bg text-gov-text-secondary border border-gov-border rounded-xl text-xs font-bold cursor-pointer"
                >
                  Back to Overview
                </button>
              )}
            </div>

          </motion.div>
        </div>
      )}

    </div>
  );
}
