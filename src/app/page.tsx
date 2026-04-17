"use client";

import { useState } from "react";
import { Loader2, Copy, Check, Sparkles, Wand2, RefreshCw, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

const TONES = [
  { id: "professional", icon: "💼" },
  { id: "fun", icon: "🎉" },
  { id: "bold", icon: "🔥" },
  { id: "minimalist", icon: "✨" },
];

export default function Home() {
  const [profession, setProfession] = useState("");
  const [keywords, setKeywords] = useState("");
  const [tone, setTone] = useState("professional");
  const [bios, setBios] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const generateBios = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    // We don't clear bios immediately for a smoother transition if re-generating

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profession, keywords, tone }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      setBios(data.bios);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <main className="relative min-h-screen bg-[#050505] text-white selection:bg-purple-500/30 overflow-x-hidden">
      <div className="noise" />
      {/* Background Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-900/20 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-900/20 blur-[120px] rounded-full" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 py-16 md:py-24">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center space-y-6 mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium tracking-wider uppercase text-purple-400 mb-4">
            <Sparkles className="w-3 h-3" />
            AI-Powered Personal Branding
          </div>
          <h1 className="text-5xl md:text-8xl font-bold tracking-tight">
            <span className="gradient-text">Bio</span>
            <span className="text-white">Forge</span>
          </h1>
          <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            Craft high-converting bios that capture your essence in seconds.
            Powered by world-class AI models.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Form Side */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-5 space-y-8"
          >
            <form onSubmit={generateBios} className="glass p-8 rounded-3xl space-y-8 glow">
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-400 ml-1">What do you do?</label>
                  <input
                    type="text"
                    placeholder="e.g. Creative Director & Film Maker"
                    value={profession}
                    onChange={(e) => setProfession(e.target.value)}
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all duration-300"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-400 ml-1">Describe yourself in 3 words</label>
                  <input
                    type="text"
                    placeholder="e.g. Visionary, Driven, Minimalist"
                    value={keywords}
                    onChange={(e) => setKeywords(e.target.value)}
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all duration-300"
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-medium text-gray-400 ml-1">Choose your vibe</label>
                  <div className="grid grid-cols-2 gap-3">
                    {TONES.map((t) => (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => setTone(t.id)}
                        className={cn(
                          "flex items-center justify-center gap-2 px-4 py-3 rounded-xl border text-sm font-medium transition-all duration-300",
                          tone === t.id
                            ? "bg-white text-black border-white scale-[1.02] shadow-lg shadow-white/10"
                            : "bg-white/5 text-gray-400 border-white/5 hover:border-white/20 hover:bg-white/10"
                        )}
                      >
                        <span>{t.icon}</span>
                        <span className="capitalize">{t.id}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="group relative w-full bg-gradient-to-r from-purple-600 to-blue-600 p-[1px] rounded-2xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:hover:scale-100"
              >
                <div className="relative w-full h-full bg-[#050505] group-hover:bg-transparent rounded-2xl py-4 px-6 flex items-center justify-center gap-3 transition-all duration-300">
                  {isLoading ? (
                    <RefreshCw className="w-5 h-5 animate-spin text-white" />
                  ) : (
                    <>
                      <Wand2 className="w-5 h-5 text-white" />
                      <span className="font-bold text-white tracking-wide">Generate Magic</span>
                    </>
                  )}
                </div>
              </button>
            </form>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-sm text-center font-medium"
              >
                {error}
              </motion.div>
            )}
          </motion.div>

          {/* Results Side */}
          <div className="lg:col-span-7 space-y-6">
            <AnimatePresence mode="wait">
              {bios.length > 0 ? (
                <motion.div
                  key="results"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-6"
                >
                  <div className="flex items-center justify-between px-2">
                    <h2 className="text-xl font-bold tracking-tight text-white/90">Curated Options</h2>
                    <span className="text-xs text-gray-500 font-medium uppercase tracking-widest">Select to copy</span>
                  </div>

                  <div className="grid gap-4">
                    {bios.map((bio, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        onClick={() => copyToClipboard(bio, index)}
                        className="group relative glass p-6 rounded-2xl glass-hover cursor-pointer transition-all duration-500"
                      >
                        <p className="text-gray-200 leading-relaxed text-lg pr-12 group-hover:text-white transition-colors italic font-light">
                          "{bio}"
                        </p>

                        <div className="flex items-center justify-between mt-6">
                          <div className="text-[10px] text-gray-500 uppercase tracking-[0.2em] font-semibold">
                            {bio.length} characters
                          </div>
                          <div className={cn(
                            "flex items-center gap-2 text-xs font-bold transition-all duration-300",
                            copiedIndex === index ? "text-green-400" : "text-purple-400 opacity-0 group-hover:opacity-100"
                          )}>
                            {copiedIndex === index ? (
                              <>
                                <Check className="w-4 h-4" />
                                <span>COPIED</span>
                              </>
                            ) : (
                              <>
                                <span className="mr-1">USE THIS</span>
                                <ChevronRight className="w-4 h-4" />
                              </>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="placeholder"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="h-[400px] flex flex-col items-center justify-center text-center space-y-4 border border-dashed border-white/10 rounded-3xl bg-white/[0.02]"
                >
                  <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-2">
                    <Sparkles className="w-8 h-8 text-white/20" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-lg font-medium text-gray-400">Ready to forge?</h3>
                    <p className="text-sm text-gray-600 px-12">
                      Fill out the details on the left to generate your custom social media presence.
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-32 pt-12 border-t border-white/5 text-center">
          <p className="text-gray-600 text-sm font-medium tracking-wide">
            Designed for the next generation of creators.
          </p>
        </footer>
      </div>
    </main>
  );
}
