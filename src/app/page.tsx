"use client";

import { useState } from "react";
import { Loader2, Copy, Check, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

const TONES = ["professional", "fun", "bold", "minimalist"];

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
    setBios([]);

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
    <main className="min-h-screen bg-black text-white px-4 py-12 md:py-24">
      <div className="max-w-2xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center p-2 bg-white/10 rounded-xl mb-4">
            <Sparkles className="w-6 h-6 text-purple-400" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tighter bg-gradient-to-b from-white to-gray-500 bg-clip-text text-transparent">
            BioForge
          </h1>
          <p className="text-gray-400 text-lg md:text-xl">
            Generate your perfect bio in seconds.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={generateBios} className="space-y-6 bg-white/5 p-6 md:p-8 rounded-2xl border border-white/10 shadow-2xl">
          <div className="space-y-2">
            <label htmlFor="profession" className="text-sm font-medium text-gray-300">
              Profession
            </label>
            <input
              id="profession"
              type="text"
              placeholder="e.g. Software Engineer, Designer"
              value={profession}
              onChange={(e) => setProfession(e.target.value)}
              required
              className="w-full bg-black border border-white/20 rounded-lg px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="keywords" className="text-sm font-medium text-gray-300">
              3 Personality Keywords
            </label>
            <input
              id="keywords"
              type="text"
              placeholder="e.g. Creative, Ambitious, Friendly"
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
              required
              className="w-full bg-black border border-white/20 rounded-lg px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="tone" className="text-sm font-medium text-gray-300">
              Tone
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {TONES.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTone(t)}
                  className={cn(
                    "px-4 py-2 rounded-lg border text-sm capitalize transition-all",
                    tone === t
                      ? "bg-white text-black border-white"
                      : "bg-transparent text-gray-400 border-white/20 hover:border-white/40"
                  )}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-white text-black font-bold py-4 rounded-xl hover:bg-gray-200 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              "Generate"
            )}
          </button>
        </form>

        {/* Error State */}
        {error && (
          <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-center">
            {error}
          </div>
        )}

        {/* Results */}
        {bios.length > 0 && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-xl font-bold text-gray-300 px-2">Generated Bios</h2>
            <div className="grid gap-4">
              {bios.map((bio, index) => (
                <div
                  key={index}
                  className="group relative bg-white/5 border border-white/10 p-5 rounded-2xl hover:bg-white/10 transition-all cursor-pointer"
                  onClick={() => copyToClipboard(bio, index)}
                >
                  <p className="text-gray-200 leading-relaxed pr-8">{bio}</p>
                  <div className="absolute top-5 right-5 text-gray-500 group-hover:text-white transition-colors">
                    {copiedIndex === index ? (
                      <Check className="w-5 h-5 text-green-400" />
                    ) : (
                      <Copy className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    )}
                  </div>
                  <div className="mt-2 text-[10px] text-gray-500 uppercase tracking-widest font-medium">
                    {bio.length} characters
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
