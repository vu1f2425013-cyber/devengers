import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';
import { 
  Activity, 
  ThumbsUp, 
  Clock, 
  Map, 
  AlertTriangle, 
  TrendingUp, 
  FileCheck2, 
  Sparkles 
} from 'lucide-react';

const analyticsData = [
  { name: 'Road Damage', Resolved: 480, Pending: 12 },
  { name: 'Garbage', Resolved: 642, Pending: 8 },
  { name: 'Drainage', Resolved: 390, Pending: 22 },
  { name: 'Street Light', Resolved: 812, Pending: 4 },
  { name: 'Water Leak', Resolved: 290, Pending: 15 },
  { name: 'Pollution', Resolved: 124, Pending: 3 }
];

const categoryDistribution = [
  { name: 'Identity & Travel', value: 450, color: '#0F4C81' },
  { name: 'Utilities & Land', value: 300, color: '#138808' },
  { name: 'Tax Services', value: 200, color: '#FF9933' },
  { name: 'Civil Registry', value: 350, color: '#2563EB' }
];

const mockHeatmapPins = [
  { id: 1, lat: 19.0760, lng: 72.8777, label: "Deep Pothole", location: "Sion Circle, Mumbai", type: "Road Damage", status: "Critical" },
  { id: 2, lat: 19.0820, lng: 72.8888, label: "Overflowing Drainage", location: "Kurla West, Mumbai", type: "Drainage", status: "High" },
  { id: 3, lat: 19.0600, lng: 72.8600, label: "Dark Street Light", location: "Bandra East, Mumbai", type: "Street Light", status: "Medium" },
  { id: 4, lat: 19.0900, lng: 72.8950, label: "Uncollected Garbage Pile", location: "Ghatkopar, Mumbai", type: "Garbage", status: "Critical" },
  { id: 5, lat: 19.0550, lng: 72.8450, label: "Water Pipe Burst", location: "Khar Road, Mumbai", type: "Water Leakage", status: "High" }
];

export default function AdminPanel() {
  const [selectedPin, setSelectedPin] = useState<typeof mockHeatmapPins[0] | null>(mockHeatmapPins[0]);

  // SLA department ranking
  const slaMetrics = [
    { dept: "PWD (Road Maintenance)", score: "96.4%", time: "16 Hours", status: "EXCELLENT" },
    { dept: "DISCOM (Power & Lights)", score: "99.1%", time: "8 Hours", status: "EXCELLENT" },
    { dept: "MCD (Garbage & Sewage)", score: "91.8%", time: "22 Hours", status: "COMPLIANT" },
    { dept: "Jal Board (Water supply)", score: "88.2%", time: "30 Hours", status: "DELAY_RISK" }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Title Header */}
      <div className="text-center max-w-3xl mx-auto mb-10 space-y-2">
        <h1 className="text-3xl font-black tracking-tight text-gov-primary uppercase">
          Government Administrative Control
        </h1>
        <p className="text-gov-text-secondary text-sm font-semibold">
          Live SLA Performance Tracker • Predictive AI Civic Heatmaps • Citizen Satisfaction Indicators
        </p>
      </div>

      {/* Top Level Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8 text-left">
        
        {/* Card 1 */}
        <div className="bg-gov-surface border border-gov-border rounded-2xl p-5 space-y-3 shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-gov-text-secondary tracking-wider">Overall Resolution SLA</span>
            <Activity className="w-5 h-5 text-gov-secondary" />
          </div>
          <p className="text-2xl font-black text-gov-primary">96.8%</p>
          <div className="text-[10px] text-gov-success font-extrabold">
            +1.2% this week (Standard Compliant)
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-gov-surface border border-gov-border rounded-2xl p-5 space-y-3 shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-gov-text-secondary tracking-wider">Citizen Satisfaction</span>
            <ThumbsUp className="w-5 h-5 text-gov-success" />
          </div>
          <p className="text-2xl font-black text-gov-primary">4.82 / 5</p>
          <div className="text-[10px] text-gov-text-secondary font-bold">
            Based on 14,810 feedback surveys
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-gov-surface border border-gov-border rounded-2xl p-5 space-y-3 shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-gov-text-secondary tracking-wider">Pending Dockets</span>
            <AlertTriangle className="w-5 h-5 text-gov-saffron" />
          </div>
          <p className="text-2xl font-black text-gov-primary">64 Cases</p>
          <div className="text-[10px] text-gov-saffron font-bold">
            18 critical tasks dispatched to site engineers
          </div>
        </div>

        {/* Card 4 */}
        <div className="bg-gov-surface border border-gov-border rounded-2xl p-5 space-y-3 shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-gov-text-secondary tracking-wider">Average Dispatch Delay</span>
            <Clock className="w-5 h-5 text-gov-secondary" />
          </div>
          <p className="text-2xl font-black text-gov-primary">12.5 Minutes</p>
          <div className="text-[10px] text-gov-secondary font-extrabold">
            Instant routing via AI Classifier
          </div>
        </div>

      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">
        
        {/* Left Column: Recharts Bar Chart */}
        <div className="lg:col-span-8 bg-gov-surface border border-gov-border p-6 rounded-3xl text-left space-y-4 shadow-md">
          <div className="flex items-center justify-between border-b border-gov-border pb-3">
            <div>
              <h3 className="font-extrabold text-sm text-gov-primary">Department Civic Docket Metrics</h3>
              <p className="text-[10px] text-gov-text-secondary font-semibold">Comparing total resolved vs pending cases by municipal category.</p>
            </div>
            <span className="px-2.5 py-1 bg-gov-bg text-gov-text-secondary rounded-lg text-[10px] font-mono border border-gov-border font-bold">
              Live Feed
            </span>
          </div>

          <div className="h-[300px] text-[11px] font-semibold text-gov-text-secondary">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analyticsData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis dataKey="name" stroke="#64748B" />
                <YAxis stroke="#64748B" />
                <Tooltip contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#CBD5E1', color: '#0F172A' }} />
                <Legend />
                <Bar dataKey="Resolved" fill="#138808" radius={[4, 4, 0, 0]} name="Resolved Cases" />
                <Bar dataKey="Pending" fill="#FF9933" radius={[4, 4, 0, 0]} name="Pending Redresses" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right Column: Recharts Pie Chart & Scheme Match Stats */}
        <div className="lg:col-span-4 bg-gov-surface border border-gov-border p-6 rounded-3xl text-left flex flex-col justify-between space-y-4 shadow-md">
          
          <div className="border-b border-gov-border pb-3">
            <h3 className="font-extrabold text-sm text-gov-primary">Welfare Schemes Allocation</h3>
            <p className="text-[10px] text-gov-text-secondary font-semibold">Demographic distribution of direct benefits DBT.</p>
          </div>

          <div className="h-[180px] flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={70}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#CBD5E1', color: '#0F172A' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Pie Chart Legend details */}
          <div className="grid grid-cols-2 gap-2 text-[10px] pt-2 border-t border-gov-border">
            {categoryDistribution.map((cat, idx) => (
              <div key={idx} className="flex items-center space-x-2 text-gov-text-secondary font-bold">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: cat.color }} />
                <span className="truncate">{cat.name} ({cat.value})</span>
              </div>
            ))}
          </div>

        </div>

      </div>

      {/* Heatmaps & AI Predictions Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Heatmap Simulation Card */}
        <div className="lg:col-span-7 bg-gov-surface border border-gov-border rounded-3xl p-6 shadow-xl text-left space-y-4">
          <div className="border-b border-gov-border pb-3 flex items-center justify-between">
            <div className="flex items-center space-x-2 text-gov-primary">
              <Map className="w-4 h-4" />
              <span className="text-xs font-extrabold uppercase tracking-wider">Interactive Complaint Heatmap</span>
            </div>
            <span className="text-[10px] text-gov-text-secondary font-bold">Mumbai Metropolitan Region (MMR)</span>
          </div>

          {/* Map canvas container */}
          <div className="relative h-64 bg-gov-bg rounded-2xl border border-gov-border overflow-hidden flex items-center justify-center p-4">
            
            {/* Visual Grid Backdrop */}
            <div className="absolute inset-0 bg-[radial-gradient(#CBD5E1_1px,transparent_1px)] [background-size:16px_16px] opacity-75" />
            
            {/* Simulated Heatmap contours (Colored SVGs) */}
            <div className="absolute top-1/4 left-1/3 w-32 h-32 bg-red-500/10 rounded-full blur-2xl animate-pulse" />
            <div className="absolute bottom-1/3 right-1/4 w-24 h-24 bg-orange-500/10 rounded-full blur-xl" />

            {/* Simulated Map Outline drawing via SVG */}
            <svg className="absolute inset-0 w-full h-full text-slate-300" fill="none" viewBox="0 0 400 200">
              <path d="M50,40 Q120,30 200,90 T350,150" stroke="currentColor" strokeWidth="2" strokeDasharray="5 5" />
              <path d="M100,160 Q180,100 280,120 T380,40" stroke="currentColor" strokeWidth="1.5" />
            </svg>

            {/* Map Interactive Pins */}
            {mockHeatmapPins.map((pin) => (
              <button
                key={pin.id}
                onClick={() => setSelectedPin(pin)}
                className={`absolute w-4 h-4 rounded-full flex items-center justify-center border transition-all cursor-pointer ${
                  selectedPin?.id === pin.id 
                    ? 'scale-125 bg-red-600 border-white shadow-lg shadow-red-600/50 z-10' 
                    : 'bg-red-500/60 border-red-300 hover:bg-red-600'
                }`}
                style={{
                  top: `${((pin.lat - 19.05) / 0.05) * 80 + 10}%`,
                  left: `${((pin.lng - 72.84) / 0.06) * 70 + 15}%`
                }}
                title={pin.label}
              >
                <div className="w-1.5 h-1.5 bg-white rounded-full" />
              </button>
            ))}

            <div className="absolute bottom-3 left-3 bg-gov-surface/90 backdrop-blur-xs px-2.5 py-1 rounded-md text-[9px] text-gov-text-secondary border border-gov-border font-bold">
              Interactive Map Simulation
            </div>
          </div>

          {/* Active pin detailed inspector */}
          {selectedPin && (
            <div className="bg-gov-bg p-4 rounded-2xl border border-gov-border flex items-start justify-between text-xs gap-4">
              <div className="space-y-1">
                <div className="flex items-center space-x-1.5 text-left">
                  <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
                  <span className="font-extrabold text-red-600 uppercase tracking-wide text-[10px]">Hazard: {selectedPin.type}</span>
                </div>
                <h4 className="font-black text-gov-primary">{selectedPin.label}</h4>
                <p className="text-gov-text-secondary font-semibold">{selectedPin.location}</p>
              </div>
              <div className="text-right space-y-1 shrink-0">
                <span className="px-2 py-0.5 bg-red-500/10 text-red-600 border border-red-500/20 font-black rounded text-[9px] uppercase">
                  {selectedPin.status} Urgency
                </span>
                <p className="text-[10px] text-gov-text-secondary font-bold">Dispatch Queue: #Q-{selectedPin.id * 149}</p>
              </div>
            </div>
          )}

        </div>

        {/* AI Predictive Analytics Feed details */}
        <div className="lg:col-span-5 bg-gov-surface border border-gov-border rounded-3xl p-6 shadow-xl text-left space-y-5">
          
          <div className="border-b border-gov-border pb-3 flex items-center justify-between">
            <div className="flex items-center space-x-2 text-gov-primary font-black text-xs uppercase tracking-wider">
              <Sparkles className="w-4 h-4 animate-spin-slow text-gov-saffron" />
              <span>AI Predictive Risk Alerts</span>
            </div>
            <span className="text-[9px] font-black text-gov-primary bg-gov-saffron/10 border border-gov-saffron/30 px-2 py-0.5 rounded-md uppercase">
              Monsoon Model Active
            </span>
          </div>

          <p className="text-xs text-gov-text-secondary leading-relaxed font-semibold">
            Our machine learning models analyze historical grievance density, localized precipitation datasets, and age of infrastructure to predict civic hazards before they affect citizens.
          </p>

          <div className="space-y-3">
            
            {/* Prediction item 1 */}
            <div className="p-3.5 bg-gov-bg border border-gov-border rounded-2xl space-y-2">
              <div className="flex items-center justify-between text-[10px]">
                <span className="text-gov-primary font-black flex items-center space-x-1">
                  <TrendingUp className="w-3.5 h-3.5 text-gov-saffron" />
                  <span>Drainage Failure Risk (Ward 12, Kurla)</span>
                </span>
                <span className="font-bold text-gov-text-secondary">Probability: 84%</span>
              </div>
              <p className="text-xs text-gov-text-primary leading-relaxed font-medium">
                Rainfall models predict severe water accumulation near Sion Station on Thursday. Recommend <span className="font-extrabold text-gov-primary">preventative garbage unclogging</span> of municipal stormwater grates by MCD.
              </p>
            </div>

            {/* Prediction item 2 */}
            <div className="p-3.5 bg-gov-bg border border-gov-border rounded-2xl space-y-2">
              <div className="flex items-center justify-between text-[10px]">
                <span className="text-gov-success font-black flex items-center space-x-1">
                  <FileCheck2 className="w-3.5 h-3.5" />
                  <span>SLA Speed Optimizer</span>
                </span>
                <span className="font-bold text-gov-text-secondary font-mono">Gain: +4.2 Hrs Saved</span>
              </div>
              <p className="text-xs text-gov-text-primary leading-relaxed font-medium">
                Automated document verification logs indicate a bottleneck in scholarship processing. Recommending auto-validating Aadhaar details instantly on profile submission to save 4 hours of delay.
              </p>
            </div>

          </div>

          {/* Department Performance SLAs */}
          <div className="space-y-2.5 pt-2 border-t border-gov-border">
            <span className="text-[10px] font-bold uppercase tracking-wider text-gov-text-secondary block">Zonal SLA response rankings:</span>
            <div className="space-y-1.5">
              {slaMetrics.map((met, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs bg-gov-bg/60 p-2.5 rounded-xl border border-gov-border">
                  <span className="font-bold text-gov-text-primary">{met.dept}</span>
                  <div className="flex items-center space-x-3 text-right">
                    <span className="text-[10px] text-gov-text-secondary font-semibold">Avg: {met.time}</span>
                    <span className={`px-2 py-0.5 text-[9px] font-black rounded uppercase ${
                      met.status === 'EXCELLENT' 
                        ? 'bg-gov-success/10 text-gov-success border border-gov-success/20' 
                        : 'bg-gov-saffron/10 text-gov-primary border border-gov-saffron/20'
                    }`}>
                      {met.score}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
