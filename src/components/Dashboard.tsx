import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  User, 
  Clock, 
  FileCheck2, 
  CreditCard, 
  Edit3, 
  Lock 
} from 'lucide-react';
import { CitizenProfile, Complaint } from '../types';

interface DashboardProps {
  complaints: Complaint[];
  applications: any[];
  savedDocuments: any[];
  addNotification: (text: string, type: 'success' | 'info' | 'warning') => void;
  onSpeak: (text: string) => void;
  profile?: CitizenProfile;
  setProfile?: React.Dispatch<React.SetStateAction<CitizenProfile>>;
}

export default function Dashboard({
  complaints,
  applications,
  savedDocuments,
  addNotification,
  onSpeak,
  profile: propProfile,
  setProfile: propSetProfile
}: DashboardProps) {
  const [localProfile, setLocalProfile] = useState<CitizenProfile>({
    age: 35,
    occupation: "Farmer / Agriculturalist",
    income: 180000,
    state: "Maharashtra",
    education: "Secondary Education",
    isFarmer: true,
    isStudent: false,
    isSenior: false,
    isBusinessOwner: false,
    gender: "Male",
    isDisabled: false
  });

  const profile = propProfile || localProfile;
  const setProfile = propSetProfile || setLocalProfile;

  const [activeCardTab, setActiveCardTab] = useState<'aadhaar' | 'pan' | 'voter'>('aadhaar');
  const [editingProfile, setEditingProfile] = useState(false);

  // Profile fields state
  const [editAge, setEditAge] = useState(profile.age);
  const [editOccupation, setEditOccupation] = useState(profile.occupation);
  const [editIncome, setEditIncome] = useState(profile.income);

  // Synchronize editing fields when profile changes (e.g. on role-selection login)
  React.useEffect(() => {
    setEditAge(profile.age);
    setEditOccupation(profile.occupation);
    setEditIncome(profile.income);
  }, [profile]);

  const handleSaveProfile = () => {
    setProfile(prev => ({
      ...prev,
      age: editAge,
      occupation: editOccupation,
      income: editIncome,
      isSenior: editAge >= 60,
      isFarmer: editOccupation.includes("Farmer"),
      isStudent: editOccupation.includes("Student"),
      isBusinessOwner: editOccupation.includes("Business")
    }));
    setEditingProfile(false);
    addNotification("Citizen profile updated successfully!", "success");
    onSpeak("Profile saved successfully");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Title Header */}
      <div className="text-center max-w-3xl mx-auto mb-10 space-y-2">
        <h1 className="text-3xl font-black tracking-tight text-gov-primary uppercase">
          Citizen Personal Cabinet
        </h1>
        <p className="text-gov-text-secondary text-sm font-semibold">
          Unified Profile Management • Digital Identity Vault • Dynamic Application Tracker
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Profile Card & ID Vault */}
        <div className="lg:col-span-5 space-y-6 text-left">
          
          {/* Profile Card */}
          <div className="bg-gov-surface border border-gov-border rounded-3xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-gov-border pb-3">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gov-secondary/10 text-gov-secondary rounded-xl flex items-center justify-center border border-gov-secondary/20">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-gov-primary">Demographic Profile</h3>
                  <p className="text-[10px] text-gov-text-secondary font-bold">Self-Declared Citizen Details</p>
                </div>
              </div>
              <button
                onClick={() => setEditingProfile(!editingProfile)}
                className="p-1.5 rounded-lg bg-gov-bg border border-gov-border hover:bg-gov-border text-gov-text-secondary hover:text-gov-text-primary text-xs font-bold flex items-center space-x-1.5 cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>{editingProfile ? "Cancel" : "Edit"}</span>
              </button>
            </div>

            {!editingProfile ? (
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="space-y-0.5">
                  <span className="text-[10px] text-gov-text-secondary uppercase tracking-wider font-bold block">Age</span>
                  <span className="font-bold text-gov-text-primary text-sm">{profile.age} Years</span>
                </div>
                <div className="space-y-0.5">
                  <span className="text-[10px] text-gov-text-secondary uppercase tracking-wider font-bold block">Primary Occupation</span>
                  <span className="font-bold text-gov-text-primary text-sm truncate block">{profile.occupation}</span>
                </div>
                <div className="space-y-0.5 pt-2 border-t border-gov-border">
                  <span className="text-[10px] text-gov-text-secondary uppercase tracking-wider font-bold block">Family Income</span>
                  <span className="font-mono font-bold text-gov-text-primary text-sm">₹{profile.income.toLocaleString()} / year</span>
                </div>
                <div className="space-y-0.5 pt-2 border-t border-gov-border">
                  <span className="text-[10px] text-gov-text-secondary uppercase tracking-wider font-bold block">State Residence</span>
                  <span className="font-bold text-gov-text-primary text-sm">{profile.state}</span>
                </div>
              </div>
            ) : (
              <div className="space-y-3.5 text-xs">
                
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] text-gov-text-secondary font-bold block uppercase">Age</label>
                    <input
                      type="number"
                      value={editAge}
                      onChange={(e) => setEditAge(parseInt(e.target.value) || 0)}
                      className="w-full bg-gov-bg border border-gov-border rounded-xl px-3 py-2 text-gov-text-primary font-bold"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] text-gov-text-secondary font-bold block uppercase">Income (₹)</label>
                    <input
                      type="number"
                      value={editIncome}
                      onChange={(e) => setEditIncome(parseInt(e.target.value) || 0)}
                      className="w-full bg-gov-bg border border-gov-border rounded-xl px-3 py-2 text-gov-text-primary font-bold font-mono"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-gov-text-secondary font-bold block uppercase">Occupation</label>
                  <input
                    type="text"
                    value={editOccupation}
                    onChange={(e) => setEditOccupation(e.target.value)}
                    className="w-full bg-gov-bg border border-gov-border rounded-xl px-3 py-2 text-gov-text-primary font-bold"
                  />
                </div>

                <button
                  onClick={handleSaveProfile}
                  className="w-full py-2.5 bg-gov-primary hover:bg-gov-secondary text-white font-bold rounded-lg text-xs cursor-pointer shadow-sm"
                >
                  Save Profile Changes
                </button>

              </div>
            )}

          </div>

          {/* Digital ID Vault card visualizer */}
          <div className="bg-gov-surface border border-gov-border rounded-3xl p-6 shadow-xl space-y-4">
            
            <div className="flex items-center justify-between border-b border-gov-border pb-3">
              <div className="flex items-center space-x-2 text-gov-success">
                <CreditCard className="w-4 h-4" />
                <span className="text-xs font-extrabold uppercase tracking-wider">Digital Identity Vault</span>
              </div>
              <span className="text-[9px] bg-gov-bg border border-gov-border px-2 py-0.5 text-gov-text-secondary rounded-md font-mono flex items-center space-x-1 font-bold">
                <Lock className="w-3 h-3 text-gov-text-secondary" />
                <span>Encrypted</span>
              </span>
            </div>

            {/* Selector tabs */}
            <div className="grid grid-cols-3 gap-2 text-xs">
              {(['aadhaar', 'pan', 'voter'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => {
                    setActiveCardTab(tab);
                    onSpeak(`Displaying digital ${tab} card`);
                  }}
                  className={`py-1.5 rounded-lg border text-center font-bold capitalize transition-all cursor-pointer ${
                    activeCardTab === tab 
                      ? 'bg-gov-success/15 text-gov-success border-gov-success' 
                      : 'bg-gov-bg border-gov-border text-gov-text-secondary hover:text-gov-text-primary'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Virtual Identity Card display */}
            <div className="relative h-44 rounded-2xl bg-gradient-to-br from-gov-primary to-gov-secondary border border-gov-border p-5 shadow-lg overflow-hidden flex flex-col justify-between text-white">
              
              {/* Saffron/White/Green soft background highlight */}
              <div className="absolute top-0 inset-x-0 h-1.5 bg-linear-to-r from-gov-saffron via-white to-gov-success" />
              <div className="absolute top-4 right-4 w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center p-1.5 opacity-30">
                <div className="w-full h-full rounded-full border-2 border-dotted border-white animate-spin-slow" />
              </div>

              {activeCardTab === 'aadhaar' && (
                <>
                  <div className="flex justify-between items-start text-left">
                    <div>
                      <p className="text-[10px] text-gov-saffron font-bold uppercase tracking-wider">Unique Identification Authority</p>
                      <h4 className="text-sm font-black text-white mt-0.5">Government of India</h4>
                    </div>
                  </div>
                  
                  <div className="space-y-1 text-left">
                    <span className="text-[9px] text-slate-200 block uppercase font-bold tracking-wider">Aadhaar Number</span>
                    <span className="font-mono text-base font-black text-white tracking-widest">5821 4091 1083</span>
                  </div>

                  <div className="flex justify-between text-[10px] text-slate-100 border-t border-white/10 pt-2 text-left">
                    <span>Name: RAMESH KUMAR SHARMA</span>
                    <span>DOB: 15/08/1980</span>
                  </div>
                </>
              )}

              {activeCardTab === 'pan' && (
                <>
                  <div className="flex justify-between items-start text-left">
                    <div>
                      <p className="text-[10px] text-gov-saffron font-bold uppercase tracking-wider">Income Tax Department</p>
                      <h4 className="text-sm font-black text-white mt-0.5">Permanent Account Number (PAN)</h4>
                    </div>
                  </div>
                  
                  <div className="space-y-1 text-left">
                    <span className="text-[9px] text-slate-200 block uppercase font-bold tracking-wider">PAN Reference ID</span>
                    <span className="font-mono text-base font-black text-white tracking-widest">ABKPS 9021 R</span>
                  </div>

                  <div className="flex justify-between text-[10px] text-slate-100 border-t border-white/10 pt-2 text-left">
                    <span>Category: INDIVIDUAL</span>
                    <span>Valid Globally</span>
                  </div>
                </>
              )}

              {activeCardTab === 'voter' && (
                <>
                  <div className="flex justify-between items-start text-left">
                    <div>
                      <p className="text-[10px] text-gov-saffron font-bold uppercase tracking-wider">Election Commission of India</p>
                      <h4 className="text-sm font-black text-white mt-0.5">Identity Card (EPIC)</h4>
                    </div>
                  </div>
                  
                  <div className="space-y-1 text-left">
                    <span className="text-[9px] text-slate-200 block uppercase font-bold tracking-wider">EPIC Card Number</span>
                    <span className="font-mono text-base font-black text-white tracking-widest">DL/42/180/0912</span>
                  </div>

                  <div className="flex justify-between text-[10px] text-slate-100 border-t border-white/10 pt-2 text-left">
                    <span>Constituency: ND-12 (Central)</span>
                    <span>Verified Citizen</span>
                  </div>
                </>
              )}

            </div>

          </div>

        </div>

        {/* Right Column: Applications & Scanned Documents dockets */}
        <div className="lg:col-span-7 space-y-6 text-left">
          
          {/* Ongoing Applications */}
          <div className="bg-gov-surface border border-gov-border rounded-3xl p-6 shadow-xl space-y-4">
            
            <div className="border-b border-gov-border pb-3 flex items-center justify-between">
              <div className="flex items-center space-x-2 text-gov-secondary">
                <Clock className="w-4 h-4" />
                <span className="text-xs font-extrabold uppercase tracking-wider">My Active Applications</span>
              </div>
              <span className="text-[10px] text-gov-text-secondary font-bold uppercase">{applications.length} Active Process</span>
            </div>

            <div className="space-y-3">
              {applications.map((app) => (
                <div key={app.id} className="bg-gov-bg p-4 rounded-2xl border border-gov-border flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="space-y-1 text-xs text-left">
                    <div className="flex items-center space-x-2">
                      <span className="px-1.5 py-0.5 bg-gov-secondary/10 text-gov-secondary border border-gov-secondary/20 font-bold text-[9px] rounded uppercase">{app.urgency}</span>
                      <span className="font-mono text-[10px] font-bold text-gov-text-secondary">{app.id}</span>
                    </div>
                    <h4 className="font-black text-gov-primary text-sm">{app.serviceName}</h4>
                    <p className="text-[10px] text-gov-text-secondary font-semibold">Applicant: {app.applicantName} • Submitted: {app.date}</p>
                  </div>

                  <div className="flex items-center space-x-4 self-end sm:self-center">
                    <div className="text-right text-xs">
                      <span className="px-2.5 py-1 text-[10px] font-bold uppercase bg-gov-saffron/10 text-gov-primary border border-gov-saffron/30 rounded-lg">
                        {app.status}
                      </span>
                      <p className="text-[9px] text-gov-text-secondary mt-1 font-bold">SLA: {app.estimatedDays || "10 Days"}</p>
                    </div>
                  </div>
                </div>
              ))}

              {applications.length === 0 && (
                <div className="p-8 text-center text-gov-text-secondary font-bold text-xs">
                  No active application dockets. Visit the Services Hub to apply!
                </div>
              )}
            </div>

          </div>

          {/* Saved Documents Drawer */}
          <div className="bg-gov-surface border border-gov-border rounded-3xl p-6 shadow-xl space-y-4">
            
            <div className="border-b border-gov-border pb-3 flex items-center justify-between">
              <div className="flex items-center space-x-2 text-gov-success">
                <FileCheck2 className="w-4 h-4" />
                <span className="text-xs font-extrabold uppercase tracking-wider">AI Scanned Certificates Vault</span>
              </div>
              <span className="text-[10px] text-gov-text-secondary font-bold uppercase">{savedDocuments.length} Documents</span>
            </div>

            <div className="space-y-3">
              {savedDocuments.map((doc) => (
                <div key={doc.id} className="bg-gov-bg p-4 rounded-2xl border border-gov-border flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-xs text-left">
                  <div className="space-y-1">
                    <h4 className="font-black text-gov-primary">{doc.name}</h4>
                    <p className="text-[10px] text-gov-text-secondary font-semibold">Auto-Verified on {doc.date} • Type: {doc.docType}</p>
                    <p className="text-[10px] text-gov-success font-bold">Holder: {doc.extracted?.name || "Unrecognized"}</p>
                  </div>

                  <div className="flex items-center space-x-3 self-end sm:self-center text-right">
                    <span className="px-2.5 py-1 text-[9px] font-bold bg-gov-success/10 text-gov-success border border-gov-success/20 rounded">
                      {doc.status}
                    </span>
                  </div>
                </div>
              ))}

              {savedDocuments.length === 0 && (
                <div className="p-8 text-center text-gov-text-secondary font-bold text-xs">
                  No scanned documents saved. Upload certificates in the AI Assistant's Document Panel to save them here!
                </div>
              )}
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
