"use client";

import { useState } from 'react';
import {
  Check,
  PlayCircle,
  Loader2,
  Sparkles,
  Menu,
  Copy,
  ChevronLeft,
  Clock,
  FileText,
  Zap,
  Globe,
  Lock,
  MessageSquare,
  Share2,
  RefreshCw,
  Search
} from 'lucide-react';

const apiKey = ""; // Environment provides this
const supadataApiKey = ""; // Add your Supadata API key here

type SummaryData = {
  title?: string;
  duration?: string;
  category?: string;
  takeaways?: string[];
  executiveSummary?: string;
  actionItems?: string[];
};

const App = () => {
  const [view, setView] = useState<'landing' | 'result'>('landing');
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [summaryData, setSummaryData] = useState<SummaryData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchWithRetry = async (
    url: string,
    options: RequestInit,
    retries = 5,
    backoff = 1000
  ): Promise<any> => {
    try {
      const response = await fetch(url, options);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return await response.json();
    } catch (err) {
      if (retries > 0) {
        await new Promise(resolve => setTimeout(resolve, backoff));
        return fetchWithRetry(url, options, retries - 1, backoff * 2);
      }
      throw err;
    }
  };

  const handleSummarize = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!url) return;

    setIsLoading(true);
    setError(null);

    try {
      // 1. Fetch the actual transcript from Supadata API
      const supadataResponse = await fetch(`https://api.supadata.ai/v1/youtube/transcript?url=${encodeURIComponent(url)}`, {
        method: 'GET',
        headers: {
          'x-api-key': supadataApiKey,
          'Content-Type': 'application/json'
        }
      });

      if (!supadataResponse.ok) {
        throw new Error(`Supadata API error! status: ${supadataResponse.status}`);
      }

      const transcriptData = await supadataResponse.json();
      
      // Extract text from transcript array (Supadata typically returns an array of segment objects)
      const transcriptText = Array.isArray(transcriptData)
        ? transcriptData.map((item: { text: string }) => item.text).join(' ')
        : JSON.stringify(transcriptData);

      // 2. Feed the actual transcript to Gemini for structured JSON analysis
      const systemPrompt = "You are a professional AI video analyst. Generate a comprehensive JSON summary based on the provided video transcript. Structure: { title: string, duration: string, category: string, takeaways: string[], executiveSummary: string, actionItems: string[] }. Use professional, concise language. If title or duration are missing, infer or estimate them.";
      const userQuery = `Analyze this video based on its transcript:\n\n${transcriptText.substring(0, 100000)}`;

      const result = await fetchWithRetry(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: userQuery }] }],
            systemInstruction: { parts: [{ text: systemPrompt }] },
            generationConfig: { responseMimeType: "application/json" }
          })
        }
      );

      const text = result.candidates?.[0]?.content?.parts?.[0]?.text;
      if (text) {
        setSummaryData(JSON.parse(text));
        setView('result');
      }
    } catch (err) {
      console.error("Summarization Error:", err);
      setError("Analysis failed. Please check the URL and your API key, then try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const reset = () => {
    setView('landing');
    setUrl('');
    setSummaryData(null);
  };

  return (
    <div className="min-h-screen bg-[#030303] text-zinc-100 font-sans selection:bg-yellow-400/30 overflow-x-hidden">
      {/* Dynamic Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-yellow-500/10 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-zinc-800/20 blur-[120px] rounded-full" />
      </div>

      {/* Navigation */}
      <nav className="relative z-50 flex justify-between items-center px-6 py-5 max-w-7xl mx-auto">
        <div className="flex items-center gap-3 cursor-pointer group" onClick={reset}>
          <div className="w-10 h-10 bg-yellow-400 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(250,204,21,0.3)] transition-transform group-hover:scale-110">
            <PlayCircle size={22} className="text-black" strokeWidth={2.5} />
          </div>
          <span className="text-xl font-bold tracking-tight">Summly<span className="text-yellow-400">.</span></span>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="hidden md:flex gap-8 text-sm font-medium text-zinc-400 mr-6">
            <a href="#" className="hover:text-white transition-colors">Integrations</a>
            <a href="#" className="hover:text-white transition-colors">API Docs</a>
            <a href="#" className="hover:text-white transition-colors">Enterprise</a>
          </div>
          <button className="p-2.5 rounded-xl bg-zinc-900/50 border border-zinc-800 hover:border-zinc-700 transition-all">
            <Menu size={20} />
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="relative z-10 max-w-6xl mx-auto px-6 py-12">
        {view === 'landing' ? (
          <div className="flex flex-col items-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-400/10 border border-yellow-400/20 text-yellow-500 text-[10px] font-bold uppercase tracking-[0.2em] mb-8">
              <Sparkles size={12} /> New: Gemini 2.5 Analysis
            </div>

            {/* Headline */}
            <h1 className="text-5xl md:text-8xl font-black text-center leading-[0.95] tracking-tighter mb-8 max-w-4xl">
              Watch less. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-b from-yellow-200 to-yellow-500">Know more.</span>
            </h1>

            <p className="text-zinc-500 text-lg md:text-xl text-center max-w-2xl mb-12 font-medium">
              Transform hours of video into actionable insights in seconds. Perfect for researchers, students, and power learners.
            </p>

            {/* Modern Input Component */}
            <div className="w-full max-w-2xl relative mb-20 group">
              <div className="absolute inset-0 bg-yellow-400/5 blur-2xl rounded-3xl group-focus-within:bg-yellow-400/10 transition-all" />
              <form onSubmit={handleSummarize} className="relative flex flex-col sm:flex-row gap-3 p-2 bg-zinc-900/40 backdrop-blur-xl border border-zinc-800 rounded-2xl shadow-2xl">
                <div className="flex-1 flex items-center px-4">
                  <Search className="text-zinc-600 mr-3" size={20} />
                  <input 
                    type="url"
                    placeholder="Paste any YouTube URL..."
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    className="w-full bg-transparent py-4 text-zinc-100 placeholder:text-zinc-600 focus:outline-none font-medium"
                    required
                  />
                </div>
                <button 
                  disabled={isLoading}
                  className="bg-yellow-400 hover:bg-yellow-300 text-black px-8 py-4 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isLoading ? <Loader2 className="animate-spin" size={20} /> : <><Zap size={18} fill="currentColor" /> Summarize</>}
                </button>
              </form>
              {error && <p className="text-red-400 text-sm mt-4 text-center font-medium">{error}</p>}
            </div>

            {/* Bento Grid Features */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
              <div className="md:col-span-2 p-8 rounded-3xl bg-zinc-900/30 border border-zinc-800/50 flex flex-col justify-between aspect-video md:aspect-auto">
                <div className="w-12 h-12 bg-zinc-800 rounded-xl flex items-center justify-center mb-6">
                  <Globe className="text-yellow-400" size={24} />
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-2">Multilingual Analysis</h3>
                  <p className="text-zinc-500 font-medium">Summarize content in over 50 languages with native-level accuracy.</p>
                </div>
              </div>
              <div className="p-8 rounded-3xl bg-zinc-900/30 border border-zinc-800/50 flex flex-col justify-between">
                <div className="w-12 h-12 bg-zinc-800 rounded-xl flex items-center justify-center mb-6">
                  <Lock className="text-yellow-400" size={24} />
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-2">Private</h3>
                  <p className="text-zinc-500 font-medium">Your library is encrypted and only visible to you.</p>
                </div>
              </div>
              <div className="p-8 rounded-3xl bg-zinc-900/30 border border-zinc-800/50 flex flex-col justify-between">
                <div className="w-12 h-12 bg-zinc-800 rounded-xl flex items-center justify-center mb-6">
                  <MessageSquare className="text-yellow-400" size={24} />
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-2">Chat with Video</h3>
                  <p className="text-zinc-500 font-medium">Ask follow-up questions about specific parts.</p>
                </div>
              </div>
              <div className="md:col-span-2 p-8 rounded-3xl bg-yellow-400 flex flex-col justify-between group overflow-hidden relative">
                <div className="absolute right-[-20%] bottom-[-20%] text-black/10 transition-transform group-hover:scale-110">
                  <PlayCircle size={240} />
                </div>
                <div className="w-12 h-12 bg-black/10 rounded-xl flex items-center justify-center mb-6">
                  <Check className="text-black" size={24} strokeWidth={3} />
                </div>
                <div className="relative z-10">
                  <h3 className="text-2xl font-black text-black mb-2">Crystal Clear Insights</h3>
                  <p className="text-black/60 font-bold max-w-sm">No more scrubbing through 20-minute intros. Get to the point instantly.</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Results Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
              <div className="flex-1">
                <button onClick={reset} className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors mb-6 font-bold text-sm uppercase tracking-widest">
                  <ChevronLeft size={16} /> Back to dashboard
                </button>
                <div className="inline-block px-3 py-1 rounded-lg bg-yellow-400/10 text-yellow-500 text-xs font-bold uppercase tracking-widest mb-4">
                  {summaryData?.category || "Education"}
                </div>
                <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-tight">{summaryData?.title}</h1>
              </div>
              <div className="flex gap-3">
                <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-4 bg-zinc-900 border border-zinc-800 rounded-xl font-bold hover:bg-zinc-800 transition-all">
                  <Share2 size={18} /> Share
                </button>
                <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-4 bg-yellow-400 text-black rounded-xl font-bold hover:bg-yellow-300 transition-all">
                  <Copy size={18} /> Copy All
                </button>
              </div>
            </div>

            {/* Results Bento */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column: Summary & Analysis */}
              <div className="lg:col-span-2 space-y-6">
                <div className="p-8 rounded-3xl bg-zinc-900/40 border border-zinc-800">
                  <h2 className="text-xl font-bold mb-6 flex items-center gap-3">
                    <FileText className="text-yellow-400" size={20} /> Executive Summary
                  </h2>
                  <p className="text-zinc-400 leading-relaxed text-lg italic">
                    {summaryData?.executiveSummary}
                  </p>
                </div>

                <div className="p-8 rounded-3xl bg-zinc-900/40 border border-zinc-800">
                  <h2 className="text-xl font-bold mb-6 flex items-center gap-3">
                    <Sparkles className="text-yellow-400" size={20} /> Key Takeaways
                  </h2>
                  <div className="space-y-4">
                    {summaryData?.takeaways?.map((item: string, i: number) => (
                      <div key={i} className="flex gap-4 group">
                        <div className="flex-none w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-xs font-black text-yellow-400 group-hover:bg-yellow-400 group-hover:text-black transition-colors">
                          {i + 1}
                        </div>
                        <p className="text-zinc-300 font-medium leading-relaxed pt-1">{item}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column: Stats & Actions */}
              <div className="space-y-6">
                <div className="p-8 rounded-3xl bg-zinc-900/40 border border-zinc-800">
                  <h2 className="text-sm font-bold text-zinc-500 uppercase tracking-widest mb-6">Video Stats</h2>
                  <div className="space-y-6">
                    <div className="flex justify-between items-center">
                      <span className="text-zinc-400 font-medium">Duration</span>
                      <div className="flex items-center gap-2 text-white font-bold">
                        <Clock size={16} className="text-yellow-400" /> {summaryData?.duration}
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-zinc-400 font-medium">Insights</span>
                      <span className="text-white font-bold">{summaryData?.takeaways?.length}</span>
                    </div>
                    <div className="h-px bg-zinc-800" />
                    <button className="w-full py-4 bg-zinc-800 hover:bg-zinc-700 rounded-xl font-bold transition-all flex items-center justify-center gap-2">
                      <RefreshCw size={16} /> Re-analyze
                    </button>
                  </div>
                </div>

                <div className="p-8 rounded-3xl bg-yellow-400/5 border border-yellow-400/20">
                  <h2 className="text-sm font-bold text-yellow-500 uppercase tracking-widest mb-6 flex items-center gap-2">
                    <Check size={16} strokeWidth={3} /> Action Items
                  </h2>
                  <div className="space-y-3">
                    {summaryData?.actionItems?.map((item: string, i: number) => (
                      <div key={i} className="p-4 rounded-xl bg-black/20 text-sm font-bold text-zinc-300 border border-white/5">
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Modern Footer */}
      <footer className="relative z-10 border-t border-zinc-900 mt-24">
        <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2 text-zinc-500">
            <PlayCircle size={18} />
            <span className="text-sm font-bold">© 2024 Summly AI. Next-gen learning.</span>
          </div>
          <div className="flex gap-8 text-sm font-bold text-zinc-600">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">Twitter</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;