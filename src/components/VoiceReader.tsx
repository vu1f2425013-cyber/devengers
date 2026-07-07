import React, { useState, useEffect, useRef } from 'react';
import { 
  Volume2, 
  VolumeX, 
  Play, 
  Pause, 
  Square, 
  RotateCcw, 
  Settings2, 
  ChevronDown, 
  Sparkles,
  RefreshCw
} from 'lucide-react';
import { AppLanguage } from '../types';
import { getTranslation } from '../lib/translations';

interface VoiceReaderProps {
  text: string;
  language: AppLanguage;
  sectionId: string;
}

export default function VoiceReader({ text, language, sectionId }: VoiceReaderProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [panelOpen, setPanelOpen] = useState(false);
  
  // Controls
  const [rate, setRate] = useState(1.0);
  const [volume, setVolume] = useState(1.0);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoiceURI, setSelectedVoiceURI] = useState<string>('');
  
  // Progress & Highlighting
  const [progress, setProgress] = useState(0);
  const [highlightedIndex, setHighlightedIndex] = useState<{ start: number; end: number } | null>(null);

  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const wordsRef = useRef<string[]>([]);
  const charRangesRef = useRef<{ start: number; end: number }[]>([]);

  // Split text into words to support word-by-word visual highlighting
  useEffect(() => {
    if (!text) return;
    const words: string[] = [];
    const ranges: { start: number; end: number }[] = [];
    let currentIndex = 0;
    
    // Simple regex word splitter that preserves indices
    const matches = Array.from(text.matchAll(/\S+/g));
    matches.forEach(match => {
      if (match.index !== undefined) {
        words.push(match[0]);
        ranges.push({
          start: match.index,
          end: match.index + match[0].length
        });
      }
    });
    
    wordsRef.current = words;
    charRangesRef.current = ranges;
  }, [text]);

  // Load available voices in browser
  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      const loadVoices = () => {
        const availableVoices = window.speechSynthesis.getVoices();
        setVoices(availableVoices);
        
        // Find best initial voice match for current language
        const matched = findBestVoice(availableVoices, language);
        if (matched) {
          setSelectedVoiceURI(matched.voiceURI);
        }
      };

      loadVoices();
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, [language]);

  const findBestVoice = (voiceList: SpeechSynthesisVoice[], lang: AppLanguage): SpeechSynthesisVoice | null => {
    const langCodeMap: Record<AppLanguage, string[]> = {
      English: ['en-IN', 'en-US', 'en-GB'],
      Hindi: ['hi-IN', 'hi'],
      Marathi: ['mr-IN', 'mr', 'hi-IN'], // fallback to hi-IN if mr-IN is missing
      Tamil: ['ta-IN', 'ta'],
      Gujarati: ['gu-IN', 'gu', 'hi-IN'] // fallback to hi-IN if gu-IN is missing
    };

    const preferredCodes = langCodeMap[lang] || ['en-IN'];
    
    for (const code of preferredCodes) {
      const voice = voiceList.find(v => v.lang.toLowerCase().startsWith(code.toLowerCase()));
      if (voice) return voice;
    }
    
    // General fallback
    const indianVoice = voiceList.find(v => v.lang.includes('IN'));
    if (indianVoice) return indianVoice;
    
    return voiceList[0] || null;
  };

  const handleStop = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsPlaying(false);
    setIsPaused(false);
    setProgress(0);
    setHighlightedIndex(null);
  };

  const handlePlay = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    handleStop();
    setIsLoading(true);

    const utterance = new SpeechSynthesisUtterance(text);
    utteranceRef.current = utterance;

    // Set voice
    if (selectedVoiceURI) {
      const voice = voices.find(v => v.voiceURI === selectedVoiceURI);
      if (voice) utterance.voice = voice;
    } else {
      const matched = findBestVoice(voices, language);
      if (matched) utterance.voice = matched;
    }

    // Set parameters
    utterance.rate = rate;
    utterance.volume = volume;

    // Boundary tracking for highlighting and progress
    utterance.onboundary = (event) => {
      if (event.name === 'word') {
        const charIndex = event.charIndex;
        
        // Update progress bar
        const ratio = Math.min(100, Math.round((charIndex / text.length) * 100));
        setProgress(ratio);

        // Find which word is currently being spoken
        const range = charRangesRef.current.find(
          r => charIndex >= r.start && charIndex <= r.end
        );
        if (range) {
          setHighlightedIndex(range);
        }
      }
    };

    utterance.onstart = () => {
      setIsLoading(false);
      setIsPlaying(true);
      setIsPaused(false);
    };

    utterance.onend = () => {
      setIsPlaying(false);
      setIsPaused(false);
      setProgress(100);
      setHighlightedIndex(null);
    };

    utterance.onerror = () => {
      setIsLoading(false);
      setIsPlaying(false);
      setIsPaused(false);
      setHighlightedIndex(null);
    };

    // Play
    window.speechSynthesis.speak(utterance);
  };

  const handlePause = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.pause();
      setIsPaused(true);
    }
  };

  const handleResume = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.resume();
      setIsPaused(false);
    }
  };

  const handleReplay = () => {
    handleStop();
    setTimeout(() => {
      handlePlay();
    }, 150);
  };

  // Render text with word-by-word highlight overlays inside the reader panel if playing
  const renderHighlightedText = () => {
    if (!highlightedIndex) return <p className="text-sm leading-relaxed text-gov-text-primary">{text}</p>;
    
    const start = highlightedIndex.start;
    const end = highlightedIndex.end;
    
    const before = text.substring(0, start);
    const word = text.substring(start, end);
    const after = text.substring(end);

    return (
      <p className="text-sm leading-relaxed text-gov-text-primary">
        <span>{before}</span>
        <span className="bg-amber-200 text-black px-1 py-0.5 rounded-sm font-bold shadow-sm transition-all duration-100">
          {word}
        </span>
        <span>{after}</span>
      </p>
    );
  };

  return (
    <div className="w-full bg-gov-surface/40 hover:bg-gov-surface/60 border border-gov-border rounded-2xl p-3 transition-all duration-300">
      <div className="flex flex-wrap items-center justify-between gap-3">
        
        {/* Trigger / Section Info */}
        <div className="flex items-center space-x-3">
          <button
            onClick={() => {
              if (isPlaying) {
                if (isPaused) handleResume();
                else handlePause();
              } else {
                handlePlay();
              }
            }}
            disabled={isLoading}
            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all shadow-md active:scale-95 ${
              isPlaying 
                ? isPaused 
                  ? 'bg-amber-500 hover:bg-amber-600 text-white' 
                  : 'bg-gov-error hover:bg-gov-error/90 text-white animate-pulse'
                : 'bg-gov-secondary hover:bg-gov-primary text-white'
            }`}
            title={isPlaying ? (isPaused ? 'Resume' : 'Pause') : getTranslation('listen_tool', language)}
            id={`speaker-trigger-${sectionId}`}
          >
            {isLoading ? (
              <RefreshCw className="w-5 h-5 animate-spin" />
            ) : isPlaying ? (
              isPaused ? <Play className="w-5 h-5 pl-0.5" /> : <Pause className="w-5 h-5" />
            ) : (
              <Volume2 className="w-5 h-5" />
            )}
          </button>
          
          <div className="text-left">
            <div className="flex items-center space-x-1.5">
              <span className="text-[10px] font-bold tracking-wider text-gov-text-secondary uppercase">
                {getTranslation('speech_controls', language)}
              </span>
              {isPlaying && !isPaused && (
                <span className="flex items-center space-x-0.5">
                  <span className="w-1.5 h-3 bg-gov-success rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                  <span className="w-1.5 h-3.5 bg-gov-success rounded-full animate-bounce" style={{ animationDelay: '0.3s' }} />
                  <span className="w-1.5 h-3 bg-gov-success rounded-full animate-bounce" style={{ animationDelay: '0.5s' }} />
                </span>
              )}
            </div>
            <p className="text-[11px] font-semibold text-gov-text-primary truncate max-w-[180px] sm:max-w-[280px]">
              {isPlaying 
                ? (isPaused ? 'Audio Paused' : getTranslation('speaking', language)) 
                : getTranslation('listen_tool', language)}
            </p>
          </div>
        </div>

        {/* Action Controls Toolbar */}
        <div className="flex items-center space-x-2">
          {isPlaying && (
            <>
              <button
                onClick={handleReplay}
                className="p-2 bg-gov-surface hover:bg-gov-border rounded-lg border border-gov-border text-gov-text-secondary hover:text-gov-text-primary transition-all active:scale-95"
                title={getTranslation('speech_replay', language)}
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                onClick={handleStop}
                className="p-2 bg-gov-surface hover:bg-gov-border rounded-lg border border-gov-border text-gov-error hover:bg-gov-error/10 transition-all active:scale-95"
                title={getTranslation('speech_stop', language)}
              >
                <Square className="w-4 h-4 fill-current" />
              </button>
            </>
          )}

          <button
            onClick={() => setPanelOpen(!panelOpen)}
            className={`p-2 rounded-lg border transition-all flex items-center space-x-1 ${
              panelOpen 
                ? 'bg-gov-secondary text-white border-gov-secondary' 
                : 'bg-gov-surface hover:bg-gov-border text-gov-text-secondary border-gov-border'
            }`}
            title="Adjust Voice Settings"
          >
            <Settings2 className="w-4 h-4" />
            <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${panelOpen ? 'rotate-180' : ''}`} />
          </button>
        </div>
      </div>

      {/* Progress Bar (Visible when playing) */}
      {isPlaying && (
        <div className="mt-2.5 w-full bg-gov-border rounded-full h-1.5 overflow-hidden">
          <div 
            className="bg-gov-success h-full rounded-full transition-all duration-200"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      {/* Slide Down Extended Control Panel */}
      {panelOpen && (
        <div className="mt-3 pt-3 border-t border-gov-border grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-left animate-fadeIn">
          
          {/* Left Column: Voice Choice & Speed */}
          <div className="space-y-3">
            <div>
              <label className="block font-bold text-gov-text-secondary mb-1">
                {getTranslation('speech_voice', language)}
              </label>
              <select
                value={selectedVoiceURI}
                onChange={(e) => setSelectedVoiceURI(e.target.value)}
                className="w-full bg-gov-surface border border-gov-border rounded-lg px-2 py-1.5 text-xs text-gov-text-primary focus:outline-none"
              >
                {voices.length === 0 ? (
                  <option>Detecting System Voices...</option>
                ) : (
                  voices.map(v => (
                    <option key={v.voiceURI} value={v.voiceURI}>
                      {v.name} ({v.lang}) {v.localService ? '[Local]' : ''}
                    </option>
                  ))
                )}
              </select>
            </div>

            <div className="flex items-center justify-between space-x-4">
              <span className="font-bold text-gov-text-secondary">
                {getTranslation('speech_speed', language)}: <span className="text-gov-text-primary">{rate.toFixed(1)}x</span>
              </span>
              <input
                type="range"
                min="0.5"
                max="2.0"
                step="0.1"
                value={rate}
                onChange={(e) => setRate(parseFloat(e.target.value))}
                className="w-1/2 accent-gov-secondary cursor-pointer"
              />
            </div>
          </div>

          {/* Right Column: Volume & Visual Highlight Tracker */}
          <div className="space-y-3">
            <div className="flex items-center justify-between space-x-4">
              <span className="font-bold text-gov-text-secondary">
                {getTranslation('speech_volume', language)}: <span className="text-gov-text-primary">{Math.round(volume * 100)}%</span>
              </span>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={volume}
                onChange={(e) => setVolume(parseFloat(e.target.value))}
                className="w-1/2 accent-gov-secondary cursor-pointer"
              />
            </div>

            <div className="p-2 bg-gov-surface/80 rounded-xl border border-gov-border">
              <div className="flex items-center space-x-1 mb-1">
                <Sparkles className="w-3.5 h-3.5 text-gov-saffron animate-pulse" />
                <span className="font-bold text-[9px] text-gov-text-secondary uppercase">Visual Highlight Tracker</span>
              </div>
              <div className="max-h-20 overflow-y-auto pr-1">
                {renderHighlightedText()}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
