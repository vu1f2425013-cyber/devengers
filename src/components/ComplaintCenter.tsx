import React, { useState, useRef } from 'react';
import { motion } from 'motion/react';
import { 
  Camera, 
  MapPin, 
  Clock, 
  Star, 
  CheckCircle2, 
  Upload, 
  Compass, 
  Check 
} from 'lucide-react';
import { Complaint, AppLanguage } from '../types';
import VoiceReader from './VoiceReader';

interface ComplaintCenterProps {
  language: AppLanguage;
  onSpeak: (text: string) => void;
  addNotification: (text: string, type: 'success' | 'info' | 'warning') => void;
  complaints: Complaint[];
  addComplaint: (complaint: Complaint) => void;
}

const mockHazards = [
  { name: "Pothole / Broken Road", category: "Road Damage" },
  { name: "Piling Organic Waste", category: "Garbage" },
  { name: "Sewerage Water Leakage", category: "Drainage" },
  { name: "Flickering Street Lamp", category: "Street Light" }
];

export default function ComplaintCenter({
  language,
  onSpeak,
  addNotification,
  complaints,
  addComplaint
}: ComplaintCenterProps) {
  const [analyzing, setAnalyzing] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(complaints[0] || null);
  const [userDesc, setUserDesc] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Ratings for resolved dockets
  const [userRating, setUserRating] = useState(0);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setAnalyzing(true);
    onSpeak("Inspecting image for civic hazards");

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64String = reader.result as string;

      try {
        const response = await fetch("/api/complaint-analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            base64Image: base64String,
            mimeType: file.type,
            description: userDesc
          })
        });

        if (!response.ok) throw new Error("Analysis failed");

        const data = await response.json();
        
        const newComplaint: Complaint = {
          id: `COM-${Math.floor(100000 + Math.random() * 900000)}`,
          issue: data.issue,
          category: data.category,
          department: data.department,
          priority: data.priority,
          gps: data.simulatedGPS,
          description: data.description,
          estimatedResolution: data.estimatedResolution,
          status: "Submitted",
          image: base64String,
          createdAt: new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          officerName: "Inspector Vijay Deshmukh",
          officerPhone: "+91 98200 45102"
        };

        addComplaint(newComplaint);
        setSelectedComplaint(newComplaint);
        addNotification(`Civic Complaint Lodged: ${newComplaint.issue}`, 'success');
        onSpeak(`Lodge successful. Assigned ticket to ${data.department}. Standard turnaround is ${data.estimatedResolution}.`);
      } catch (err) {
        console.error(err);
        onSpeak("Vision parsing issue. Establishing standard municipal ticket instead.");
        
        // Fallback
        const fallbackTicket: Complaint = {
          id: `COM-${Math.floor(100000 + Math.random() * 900000)}`,
          issue: "Road asphalt breakdown with pothole pockets",
          category: "Road Damage",
          department: "Public Works Department (PWD)",
          priority: "HIGH",
          gps: {
            lat: 19.0760,
            lng: 72.8777,
            address: "Sion Circle, Near Swagat Restaurant, Mumbai, Maharashtra 400022"
          },
          description: "Localized breakdown of road surface with three deep potholes approximately 10-15cm deep causing active traffic bottlenecks.",
          estimatedResolution: "3 Days",
          status: "Submitted",
          image: base64String,
          createdAt: new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          officerName: "Engineer Rajesh Kulkarni",
          officerPhone: "+91 94220 18392"
        };

        addComplaint(fallbackTicket);
        setSelectedComplaint(fallbackTicket);
        addNotification(`Civic Complaint Lodged: ${fallbackTicket.issue}`, 'success');
      } finally {
        setAnalyzing(false);
        setUserDesc("");
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Title Header */}
      <div className="text-center max-w-3xl mx-auto mb-10 space-y-2">
        <h1 className="text-3xl font-black tracking-tight text-gov-primary uppercase">
          Smart Civic Complaint Desk
        </h1>
        <p className="text-gov-text-secondary text-sm font-semibold">
          Auto-Detecting Civic Hazards • Dynamic Geotagging • Real-Time Resolution Timelines
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Complaint Upload / Visual Scanner form */}
        <div className="lg:col-span-5 space-y-6">
          
          <div className="bg-gov-surface border border-gov-border rounded-3xl p-6 shadow-xl text-left space-y-5">
            
            <div className="border-b border-gov-border pb-3 flex items-center space-x-2 text-gov-secondary font-bold text-xs uppercase tracking-wider">
              <Camera className="w-4 h-4" />
              <span>Snap & File Instant Report</span>
            </div>

            <p className="text-xs text-gov-text-secondary leading-relaxed font-semibold">
              Snap and upload a photo of garbage dumps, faulty traffic lights, potholes, or open drainages. The AI automatically classifies the issue, simulates GPS, and files a case docket.
            </p>

            {/* Supplemental Comments */}
            <div className="space-y-1.5">
              <label className="text-[10px] text-gov-text-secondary font-bold uppercase tracking-wider">Additional details or Landmark (Optional)</label>
              <textarea
                value={userDesc}
                onChange={(e) => setUserDesc(e.target.value)}
                placeholder="E.g. near Green Park Metro station Pillar 42..."
                rows={2}
                className="w-full bg-gov-bg border border-gov-border focus:border-gov-primary rounded-xl px-4 py-2.5 text-xs text-gov-text-primary placeholder-gov-text-secondary outline-none font-medium"
              />
            </div>

            {/* Drag Drop Image Upload area */}
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-gov-border hover:border-gov-primary/50 bg-gov-bg/35 hover:bg-gov-bg/85 p-8 rounded-2xl cursor-pointer text-center transition-all group flex flex-col items-center justify-center space-y-3"
            >
              <input 
                type="file" 
                ref={fileInputRef}
                onChange={handleImageUpload}
                accept="image/*" 
                className="hidden" 
              />
              
              <div className="w-12 h-12 rounded-xl bg-gov-secondary/10 flex items-center justify-center border border-gov-secondary/20 group-hover:scale-110 transition-transform">
                <Upload className="w-6 h-6 text-gov-secondary" />
              </div>

              <div className="space-y-1">
                <p className="text-xs font-bold text-gov-text-primary">Snap or Upload Hazard Photo</p>
                <p className="text-[10px] text-gov-text-secondary font-bold">Camera / Photo Roll (JPEG, PNG)</p>
              </div>
            </div>

            {/* Loader */}
            {analyzing && (
              <div className="bg-gov-bg border border-gov-border p-6 rounded-2xl flex flex-col items-center justify-center text-center space-y-4 py-8">
                <div className="w-10 h-10 border-4 border-gov-success/20 border-t-gov-success rounded-full animate-spin" />
                <div className="space-y-1">
                  <p className="text-xs font-bold text-gov-success">AI Vision Analyzing...</p>
                  <p className="text-[10px] text-gov-text-secondary font-semibold">Classifying hazard, routing municipal division, and pinning GPS</p>
                </div>
              </div>
            )}

          </div>

          {/* Quick Mock Tags guidance */}
          <div className="bg-gov-surface border border-gov-border p-5 rounded-3xl text-left space-y-3">
            <h4 className="text-[10px] font-bold uppercase text-gov-text-secondary tracking-wider">Common Civic Categories Managed:</h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {mockHazards.map((haz, idx) => (
                <div key={idx} className="bg-gov-bg p-2.5 rounded-lg border border-gov-border text-gov-text-secondary font-semibold">
                  <p className="text-[11px] text-gov-text-primary font-bold">{haz.name}</p>
                  <p className="text-[9px] text-gov-text-secondary">{haz.category}</p>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column: Active Complaint Timeline & Details display */}
        <div className="lg:col-span-7 space-y-6 text-left">
          
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            
            {/* Ticket select dropdown */}
            <div className="flex-grow">
              <span className="text-[10px] font-bold uppercase tracking-wider text-gov-text-secondary">My Filed Tickets:</span>
              <select
                value={selectedComplaint?.id || ""}
                onChange={(e) => {
                  const comp = complaints.find(c => c.id === e.target.value);
                  if (comp) setSelectedComplaint(comp);
                }}
                className="w-full bg-gov-surface border border-gov-border focus:border-gov-primary rounded-xl px-4 py-2.5 text-xs sm:text-sm font-bold text-gov-text-primary outline-none mt-1"
              >
                {complaints.map((comp) => (
                  <option key={comp.id} value={comp.id}>
                    [{comp.id}] {comp.issue.substring(0, 35)}...
                  </option>
                ))}
              </select>
            </div>

          </div>

          {/* Ticket detail Display */}
          {selectedComplaint ? (
            <div className="bg-gov-surface border border-gov-border rounded-3xl overflow-hidden shadow-xl space-y-6 pb-6">
              
              {/* Photo preview slider mock header */}
              <div className="relative h-48 bg-gov-bg overflow-hidden flex items-center justify-center">
                <img 
                  src={selectedComplaint.image} 
                  alt="Civic hazard evidence" 
                  className="w-full h-full object-cover opacity-80" 
                />
                
                {/* Overlay details */}
                <div className="absolute inset-0 bg-gradient-to-t from-gov-surface via-transparent to-transparent" />
                
                <div className="absolute bottom-4 left-6 text-left">
                  <span className="px-2 py-0.5 bg-gov-error/15 text-gov-error border border-gov-error/30 text-[10px] font-bold rounded-md uppercase">
                    Priority: {selectedComplaint.priority}
                  </span>
                  <h3 className="text-lg font-black text-gov-primary mt-1">{selectedComplaint.issue}</h3>
                </div>
              </div>

              {/* Case information */}
              <div className="px-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                <div className="space-y-1 text-left">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gov-text-secondary">Responsible Agency:</span>
                  <p className="text-xs font-bold text-gov-text-primary">{selectedComplaint.department}</p>
                </div>

                <div className="space-y-1 text-left">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gov-text-secondary">Estimated Turnaround:</span>
                  <p className="text-xs font-bold text-gov-text-primary flex items-center space-x-1.5">
                    <Clock className="w-3.5 h-3.5 text-gov-secondary" />
                    <span>{selectedComplaint.estimatedResolution}</span>
                  </p>
                </div>

                <div className="col-span-1 sm:col-span-2 pt-2 border-t border-gov-border space-y-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gov-text-secondary flex items-center space-x-1">
                    <MapPin className="w-3.5 h-3.5 text-gov-saffron" />
                    <span>Geotag Coordinates (Auto-Captured):</span>
                  </span>
                  <p className="text-xs font-mono font-bold text-gov-saffron bg-gov-bg/60 p-2.5 rounded-xl border border-gov-border leading-relaxed">
                    Latitude: {selectedComplaint.gps.lat.toFixed(5)}, Longitude: {selectedComplaint.gps.lng.toFixed(5)}<br />
                    <span className="text-gov-text-primary font-sans text-[11px] block mt-1 font-semibold">{selectedComplaint.gps.address}</span>
                  </p>
                </div>

                <div className="col-span-1 sm:col-span-2 pt-2 border-t border-gov-border space-y-2 text-left">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gov-text-secondary">AI Inspection Technical Report:</span>
                  <p className="text-xs text-gov-text-primary leading-relaxed font-medium">
                    {selectedComplaint.description}
                  </p>
                  <div className="pt-2">
                    <VoiceReader 
                      text={`${selectedComplaint.issue}. Department: ${selectedComplaint.department}. Location: ${selectedComplaint.gps.address}. Technical Report: ${selectedComplaint.description}`} 
                      language={language} 
                      sectionId={selectedComplaint.id} 
                    />
                  </div>
                </div>

              </div>

              {/* Resolution Timeline workflow */}
              <div className="px-6 pt-4 border-t border-gov-border space-y-4 text-left">
                <span className="text-[10px] font-bold uppercase tracking-wider text-gov-text-secondary">Case Docket Resolution Timeline:</span>
                
                <div className="relative pl-6 space-y-5 border-l border-gov-border">
                  
                  {/* Timeline step item generator */}
                  <TimelineStep 
                    title="Complaint Submitted" 
                    desc={`Registered under ticket ID ${selectedComplaint.id} on ${selectedComplaint.createdAt}`} 
                    isDone={true} 
                  />
                  <TimelineStep 
                    title="Demographic Verification" 
                    desc="Electoral and physical geolocations cross-referenced by municipal automated script." 
                    isDone={selectedComplaint.status !== 'Submitted'} 
                  />
                  <TimelineStep 
                    title="Assigned to Area Sub-Engineer" 
                    desc={selectedComplaint.officerName ? `Assigned to ${selectedComplaint.officerName} (${selectedComplaint.officerPhone})` : "Queued in Department SLA registry"} 
                    isDone={['Assigned', 'Inspection', 'Work Started', 'Resolved'].includes(selectedComplaint.status)} 
                  />
                  <TimelineStep 
                    title="Resolution Verification / Resolution Completed" 
                    desc="Structural work executed on site with proof photos attached." 
                    isDone={selectedComplaint.status === 'Resolved'} 
                  />

                </div>
              </div>

              {/* Citizen Feedback Rating */}
              {selectedComplaint.status === 'Resolved' && (
                <div className="mx-6 p-4 bg-gov-success/10 border border-gov-success/20 rounded-2xl space-y-3">
                  <div className="flex items-center space-x-2 text-gov-success">
                    <CheckCircle2 className="w-4 h-4 text-gov-success animate-bounce" />
                    <span className="text-xs font-bold uppercase tracking-wider">Citizen Feedback Panel</span>
                  </div>
                  <p className="text-xs text-gov-text-primary font-semibold">This municipal issue was solved! How do you rate the speed and execution quality?</p>
                  
                  <div className="flex items-center space-x-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => {
                          setUserRating(star);
                          addNotification("Thank you for rating municipal response!", "success");
                          onSpeak(`Rated ${star} stars.`);
                        }}
                        className="p-1 rounded-md bg-gov-surface hover:bg-gov-bg text-gov-saffron border border-gov-border"
                      >
                        <Star className={`w-4 h-4 ${userRating >= star ? 'fill-gov-saffron text-gov-saffron' : 'text-gov-text-secondary'}`} />
                      </button>
                    ))}
                  </div>
                </div>
              )}

            </div>
          ) : (
            <div className="bg-gov-surface border border-gov-border rounded-3xl p-12 text-center text-gov-text-secondary space-y-2">
              <Compass className="w-10 h-10 text-gov-text-secondary mx-auto" />
              <p className="font-bold text-sm text-gov-primary">No Active Tickets</p>
              <p className="text-xs font-semibold text-gov-text-secondary">File a complaint using the left-hand panel camera scanner.</p>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}

interface TimelineStepProps {
  title: string;
  desc: string;
  isDone: boolean;
}

function TimelineStep({ title, desc, isDone }: TimelineStepProps) {
  return (
    <div className="relative text-left">
      <div className={`absolute -left-8.5 top-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
        isDone 
          ? 'bg-gov-success border-gov-success text-white' 
          : 'bg-gov-surface border-gov-border text-gov-text-secondary'
      }`}>
        {isDone ? <Check className="w-3 h-3 text-white" /> : <Clock className="w-2.5 h-2.5" />}
      </div>
      <div>
        <h4 className={`text-xs font-bold ${isDone ? 'text-gov-primary' : 'text-gov-text-secondary'}`}>{title}</h4>
        <p className="text-[11px] text-gov-text-secondary mt-0.5 leading-relaxed font-semibold">{desc}</p>
      </div>
    </div>
  );
}
