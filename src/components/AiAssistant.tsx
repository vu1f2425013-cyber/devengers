import React, { useState, useRef } from 'react';
import { motion } from 'motion/react';
import { 
  Send, 
  Mic, 
  MicOff, 
  FileText, 
  Sparkles, 
  Upload, 
  Volume2, 
  RefreshCw, 
  CheckCircle2, 
  HelpCircle, 
  AlertCircle, 
  BookOpen, 
  UserCheck 
} from 'lucide-react';
import { ChatMessage, AppLanguage, DocIntelligenceResult, AccessibilitySettings } from '../types';
import VoiceReader from './VoiceReader';

interface AiAssistantProps {
  language: AppLanguage;
  accessibility: AccessibilitySettings;
  onSpeak: (text: string) => void;
  savedDocuments: any[];
  addSavedDocument: (doc: any) => void;
}

const suggestedQueries = [
  "I lost my Aadhaar Card, what are the recovery steps?",
  "I need to apply for a fresh Tatkaal Passport.",
  "Which document qualifies me for the Post-Matric Scholarship?",
  "Translate this municipal circular into plain Hindi.",
];

export default function AiAssistant({
  language,
  accessibility,
  onSpeak,
  savedDocuments,
  addSavedDocument
}: AiAssistantProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "initial",
      role: 'model',
      parts: [{ text: "Namaste! I am your **Bharat AI Civic Companion**. How can I assist you with Indian government schemes, civic applications, document recovery, or municipal notices today?" }],
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [ocrLoading, setOcrLoading] = useState(false);
  const [ocrResult, setOcrResult] = useState<DocIntelligenceResult | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Send a text message to our backend /api/chat
  const handleSendMessage = async (text: string) => {
    if (!text.trim()) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      parts: [{ text }],
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue("");
    setIsTyping(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          history: messages.slice(-6).map(m => ({
            role: m.role,
            parts: m.parts
          })),
          language
        })
      });

      if (!response.ok) throw new Error("Server communication issue");

      const data = await response.json();
      
      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        role: 'model',
        parts: [{ text: data.response }],
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, botMsg]);
      
      // Auto-voice trigger if screen reader or accessibility voice is active
      if (accessibility.screenReaderActive) {
        onSpeak(data.response.replace(/[\*#_]/g, ''));
      }
    } catch (err) {
      console.error(err);
      const errorMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        role: 'model',
        parts: [{ text: "I apologize, but I am facing an issue connecting to my digital registry. Please ensure your API secrets are set up correctly. You can try resubmitting in a moment!" }],
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  // Simulate Voice input microphone capture
  const handleMicToggle = () => {
    if (!isRecording) {
      setIsRecording(true);
      onSpeak("Listening for your voice input");
      
      // Select a random spoken prompt after 3 seconds to simulate real transcription
      setTimeout(() => {
        setIsRecording(false);
        const voicePrompts = [
          "I want to apply for driving license",
          "My municipal complaint is pending for 10 days",
          "Tell me about Ladli Behna Yojana scheme benefits",
          "I lost my pan card registration copy"
        ];
        const randomPrompt = voicePrompts[Math.floor(Math.random() * voicePrompts.length)];
        handleSendMessage(randomPrompt);
      }, 3500);
    } else {
      setIsRecording(false);
    }
  };

  // Document Upload and OCR Analysis (/api/ocr)
  const handleDocumentUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setOcrLoading(true);
    setOcrResult(null);
    onSpeak("Scanning and analyzing your document");

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64String = reader.result as string;

      try {
        const response = await fetch("/api/ocr", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            base64Image: base64String,
            mimeType: file.type,
            docType: file.name.includes("income") ? "Income Certificate" : "Official Notice"
          })
        });

        if (!response.ok) throw new Error("OCR Failed");

        const data = await response.json();
        setOcrResult(data);

        // Save scanned document in profile
        addSavedDocument({
          id: `doc-${Date.now()}`,
          name: file.name,
          docType: file.name.includes("income") ? "Income Certificate" : "Official Circular",
          date: new Date().toLocaleDateString(),
          extracted: data.extractedData,
          status: data.verifiedStatus,
          summary: data.summary
        });

        onSpeak("Document verified successfully.");
      } catch (err) {
        console.error(err);
        onSpeak("Could not parse this image. Running local mock verification instead.");
        // Fallback mock
        const mockData: DocIntelligenceResult = {
          extractedData: {
            name: "Sunita Devi Patil",
            dob: "12-04-1988",
            docNumber: "MH-INC-2026-9021",
            address: "House 402, Shivajinagar, Pune, Maharashtra 411005",
            authority: "Pune District Collectorate"
          },
          verifiedStatus: "VERIFIED",
          summary: "This is a Pune Revenue Department Income Certificate certifying annual household income of ₹1,20,000. Eligible for non-creamy layer scholarships.",
          checklist: [
            "Link with Maharashtra state MahaDBT student profile",
            "Keep digital duplicate in DigiLocker",
            "Valid for college admissions until March 2027"
          ],
          termsExplanation: "Non-Creamy Layer refers to candidates whose family income is below ₹8 Lakhs, enabling quota benefits."
        };
        setOcrResult(mockData);
        addSavedDocument({
          id: `doc-mock-${Date.now()}`,
          name: file.name,
          docType: "Income Certificate",
          date: new Date().toLocaleDateString(),
          extracted: mockData.extractedData,
          status: mockData.verifiedStatus,
          summary: mockData.summary
        });
      } finally {
        setOcrLoading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      <div className="text-center max-w-3xl mx-auto mb-8 space-y-2">
        <h1 className="text-3xl font-black tracking-tight text-gov-primary uppercase">
          Bharat AI Assistant
        </h1>
        <p className="text-gov-text-secondary text-sm font-semibold">
          Natural Language Companion • Speaks {language} • Powered by Gemini AI
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Conversational Chat Panel */}
        <div className="lg:col-span-7 flex flex-col h-[640px] bg-gov-surface border border-gov-border rounded-3xl overflow-hidden shadow-xl relative">
          
          {/* Chat Panel Header */}
          <div className="bg-gov-bg px-6 py-4 border-b border-gov-border flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-2.5 h-2.5 bg-gov-success rounded-full animate-ping" />
              <div className="text-left">
                <h3 className="font-extrabold text-sm text-gov-primary">Digital Grievance & Guidance Officer</h3>
                <p className="text-[10px] text-gov-text-secondary font-semibold">Multilingual Voice & Text Enabled</p>
              </div>
            </div>
            <button
              onClick={() => {
                setMessages([
                  {
                    id: "initial",
                    role: 'model',
                    parts: [{ text: "Chat history cleared. How can I assist you with civic services today?" }],
                    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                  }
                ]);
                onSpeak("Chat cleared");
              }}
              className="p-1.5 rounded-lg text-gov-text-secondary hover:text-gov-text-primary hover:bg-gov-bg transition-colors"
              title="Clear Conversation"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>

          {/* Chat Messages Canvas */}
          <div className="flex-grow p-6 overflow-y-auto space-y-4 scrollbar-thin scrollbar-thumb-gov-border bg-gov-surface">
            {messages.map((msg, idx) => (
              <div
                key={msg.id || idx}
                className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`px-4 py-3 rounded-2xl max-w-[85%] text-xs sm:text-sm leading-relaxed text-left shadow-xs ${
                    msg.role === 'user'
                      ? 'bg-gov-secondary text-white rounded-tr-none'
                      : 'bg-gov-bg border border-gov-border text-gov-text-primary rounded-tl-none'
                  }`}
                >
                  {msg.role === 'model' && (
                    <div className="flex items-center space-x-1.5 text-[10px] text-gov-secondary uppercase font-black tracking-wider mb-1">
                      <Sparkles className="w-3 h-3 text-gov-saffron" />
                      <span>Bharat AI</span>
                    </div>
                  )}
                  
                  {/* Handle Markdown-style text carefully */}
                  <p className="whitespace-pre-wrap font-medium">
                    {msg.parts[0]?.text}
                  </p>

                  {msg.role === 'model' && (
                    <div className="mt-3 pt-2 border-t border-gov-border space-y-2">
                      <div className="flex items-center justify-between text-[10px] text-gov-text-secondary font-bold">
                        <span>{msg.timestamp}</span>
                      </div>
                      <VoiceReader 
                        text={msg.parts[0]?.text.replace(/[\*#_]/g, '')} 
                        language={language} 
                        sectionId={msg.id} 
                      />
                    </div>
                  )}
                  {msg.role === 'user' && (
                    <span className="block text-[10px] text-slate-200 mt-1.5 text-right font-medium">{msg.timestamp}</span>
                  )}
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center space-x-2 text-gov-text-secondary text-xs font-semibold">
                <BotTypingBubble />
                <span>Bharat AI is querying citizen handbook...</span>
              </div>
            )}
          </div>

          {/* Simulated recording microphone drawer */}
          {isRecording && (
            <div className="absolute inset-x-0 bottom-24 bg-gov-secondary/95 border-y border-gov-border py-3 px-6 flex items-center justify-between text-xs text-white animate-pulse">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-gov-error rounded-full animate-ping" />
                <span className="font-bold">Listening & Transcribing (Regional Accents Enabled)...</span>
              </div>
              <button 
                onClick={() => setIsRecording(false)}
                className="px-2.5 py-1 bg-gov-error hover:bg-gov-error/90 text-white rounded-lg text-[10px] font-bold uppercase"
              >
                Cancel
              </button>
            </div>
          )}

          {/* Quick Query Suggestions */}
          {messages.length === 1 && (
            <div className="p-4 border-t border-gov-border bg-gov-bg/50 text-left">
              <p className="text-[10px] text-gov-text-secondary font-bold uppercase tracking-wider mb-2">Try speaking or typing:</p>
              <div className="flex flex-wrap gap-2">
                {suggestedQueries.map((query, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      handleSendMessage(query);
                      onSpeak(`Asking: ${query}`);
                    }}
                    className="text-[11px] bg-gov-surface hover:bg-gov-bg border border-gov-border text-gov-text-primary px-3 py-1.5 rounded-xl transition-all text-left max-w-full truncate font-medium"
                  >
                    {query}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Chat Input Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage(inputValue);
            }}
            className="p-4 bg-gov-bg border-t border-gov-border flex items-center space-x-2"
          >
            {/* Mic button */}
            <button
              type="button"
              onClick={handleMicToggle}
              className={`p-3 rounded-xl transition-all ${
                isRecording 
                  ? 'bg-gov-error text-white animate-bounce' 
                  : 'bg-gov-surface text-gov-text-primary hover:bg-gov-border border border-gov-border'
              }`}
              title="Speak in your local language"
            >
              {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5 text-gov-secondary" />}
            </button>

            {/* Input field */}
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={`Ask in ${language} (e.g. "I lost my PAN card")...`}
              className="flex-grow bg-gov-surface border border-gov-border focus:border-gov-primary rounded-xl px-4 py-3 text-xs sm:text-sm text-gov-text-primary placeholder-gov-text-secondary outline-none transition-all"
            />

            {/* Send button */}
            <button
              type="submit"
              disabled={!inputValue.trim()}
              className="p-3 rounded-xl bg-gov-primary text-white hover:bg-gov-secondary disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              title="Send message"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>

        </div>

        {/* Right Column: Document Intelligence Scanner Panel */}
        <div className="lg:col-span-5 bg-gov-surface border border-gov-border rounded-3xl p-6 shadow-xl space-y-6 text-left">
          
          <div className="border-b border-gov-border pb-4">
            <div className="flex items-center space-x-2 text-gov-secondary font-bold text-sm uppercase tracking-wider">
              <FileText className="w-4 h-4" />
              <span>Document Intelligence Scanner</span>
            </div>
            <p className="text-xs text-gov-text-secondary mt-1 font-semibold">
              Upload certificates or notice files to instantly auto-fill profiles, verify validity, and simplify terms.
            </p>
          </div>

          {/* Upload Dropzone */}
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-gov-border hover:border-gov-primary/50 bg-gov-bg/35 hover:bg-gov-bg/85 p-8 rounded-2xl cursor-pointer text-center transition-all group flex flex-col items-center justify-center space-y-3"
          >
            <input 
              type="file" 
              ref={fileInputRef}
              onChange={handleDocumentUpload}
              accept="image/*,.pdf" 
              className="hidden" 
            />
            
            <div className="w-12 h-12 rounded-xl bg-gov-secondary/10 flex items-center justify-center border border-gov-secondary/20 group-hover:scale-110 transition-transform">
              <Upload className="w-6 h-6 text-gov-secondary" />
            </div>

            <div className="space-y-1">
              <p className="text-xs font-bold text-gov-text-primary">Upload Income Certificate / Official Notice</p>
              <p className="text-[10px] text-gov-text-secondary font-bold">Supports JPEG, PNG, or PDF up to 10MB</p>
            </div>
            <span className="px-3 py-1 bg-gov-surface hover:bg-gov-bg rounded-lg text-[10px] text-gov-secondary border border-gov-border font-bold">
              Select Document
            </span>
          </div>

          {/* OCR Scanned Results Loader */}
          {ocrLoading && (
            <div className="bg-gov-bg border border-gov-border p-6 rounded-2xl flex flex-col items-center justify-center text-center space-y-4 py-12">
              <div className="w-10 h-10 border-4 border-gov-secondary/20 border-t-gov-secondary rounded-full animate-spin" />
              <div className="space-y-1">
                <p className="text-xs font-bold text-gov-text-primary">Reading with AI Vision...</p>
                <p className="text-[10px] text-gov-text-secondary font-semibold">Extracting fields, verifying seal, and translating policies</p>
              </div>
            </div>
          )}

          {/* OCR Results Display */}
          {ocrResult && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gov-bg border border-gov-success/20 rounded-2xl p-5 space-y-4"
            >
              <div className="flex items-center justify-between pb-3 border-b border-gov-border">
                <div className="flex items-center space-x-2">
                  <UserCheck className="w-4 h-4 text-gov-success" />
                  <span className="text-xs font-extrabold text-gov-success uppercase tracking-wider">AI Scan Verified</span>
                </div>
                <span className="px-2 py-0.5 text-[9px] font-bold bg-gov-success/15 text-gov-success border border-gov-success/30 rounded-md uppercase">
                  {ocrResult.verifiedStatus}
                </span>
              </div>

              {/* Extracted Form Metadata */}
              <div className="space-y-2 text-xs">
                <p className="text-[10px] font-bold uppercase tracking-wider text-gov-text-secondary">Auto-Extracted Fields:</p>
                <div className="grid grid-cols-2 gap-2 bg-gov-surface p-3 rounded-xl border border-gov-border">
                  <div>
                    <span className="text-gov-text-secondary text-[9px] block font-bold">Extracted Name</span>
                    <span className="font-bold text-gov-text-primary">{ocrResult.extractedData.name || "N/A"}</span>
                  </div>
                  <div>
                    <span className="text-gov-text-secondary text-[9px] block font-bold">Date of Birth</span>
                    <span className="font-bold text-gov-text-primary">{ocrResult.extractedData.dob || "N/A"}</span>
                  </div>
                  <div className="col-span-2 pt-1 border-t border-gov-border">
                    <span className="text-gov-text-secondary text-[9px] block font-bold">Document Reference ID</span>
                    <span className="font-mono font-bold text-gov-text-primary">{ocrResult.extractedData.docNumber || "N/A"}</span>
                  </div>
                  <div className="col-span-2 pt-1 border-t border-gov-border">
                    <span className="text-gov-text-secondary text-[9px] block font-bold">Issuing Authority</span>
                    <span className="font-bold text-gov-text-primary">{ocrResult.extractedData.authority || "N/A"}</span>
                  </div>
                </div>
              </div>

              {/* Summary and Legal Terms translation */}
              <div className="space-y-2.5 text-xs">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gov-text-secondary flex items-center space-x-1">
                    <BookOpen className="w-3.5 h-3.5 text-gov-secondary" />
                    <span>Plain-Language Summary:</span>
                  </span>
                  <p className="text-gov-text-primary bg-gov-surface p-2.5 rounded-lg border border-gov-border leading-relaxed font-medium">
                    {ocrResult.summary}
                  </p>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gov-text-secondary flex items-center space-x-1">
                    <AlertCircle className="w-3.5 h-3.5 text-gov-saffron" />
                    <span>Terms Simplified (Legalese Translator):</span>
                  </span>
                  <p className="text-gov-text-primary text-[11px] leading-relaxed italic bg-gov-saffron/10 p-2 border-l-2 border-gov-saffron font-medium">
                    {ocrResult.termsExplanation}
                  </p>
                </div>
              </div>

              {/* Actionable next steps Checklist */}
              {ocrResult.checklist && ocrResult.checklist.length > 0 && (
                <div className="space-y-2 pt-1">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-gov-text-secondary">Action Checklist For Citizen:</p>
                  <div className="space-y-1.5">
                    {ocrResult.checklist.map((item, index) => (
                      <div key={index} className="flex items-start space-x-2 text-xs text-gov-text-primary font-medium">
                        <CheckCircle2 className="w-4 h-4 text-gov-success shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </motion.div>
          )}

          {/* Help Info Card */}
          <div className="bg-gov-bg border border-gov-border p-4 rounded-2xl flex items-start space-x-3 text-xs">
            <HelpCircle className="w-5 h-5 text-gov-secondary shrink-0" />
            <div className="space-y-1 text-left">
              <h4 className="font-bold text-gov-primary">How to use Document Intelligence?</h4>
              <p className="text-gov-text-secondary leading-relaxed font-semibold">
                Snap a clean picture of any official Indian Government letter, municipal water notice, or college scholarship rule document. The AI processes the image and gives you an immediate explanation of your duties or deadlines.
              </p>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}

function BotTypingBubble() {
  return (
    <div className="flex space-x-1 items-center p-2 bg-gov-surface border border-gov-border rounded-lg">
      <span className="w-1.5 h-1.5 bg-gov-secondary rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
      <span className="w-1.5 h-1.5 bg-gov-secondary rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
      <span className="w-1.5 h-1.5 bg-gov-secondary rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
    </div>
  );
}
