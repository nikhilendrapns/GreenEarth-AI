import React, { useState } from "react";
import { Shield, Sparkles, TreePine, Flame, Waves, Heart, HelpCircle } from "lucide-react";
const bannerImg = new URL("../../assets/images/environmental_safety_banner_1781626765606.jpg", import.meta.url).href;

interface FactItem {
  title: string;
  detail: string;
  color: string;
  icon: React.ReactNode;
}

export function EnvironmentalProtectionBanner({ isTwilightMode }: { isTwilightMode: boolean }) {
  const [activeTab, setActiveTab] = useState<number>(0);

  const facts: FactItem[] = [
    {
      title: "Atmospheric Restoration Protection",
      detail: "Global efforts to cap temperature anomalies below 1.5°C rely heavily on household conservation behaviors. Shifting habits early preserves natural ecosystems.",
      color: "text-emerald-500",
      icon: <TreePine className="w-4 h-4" />
    },
    {
      title: "Carbon Sink Maintenance",
      detail: "Preserving existing ancient forests and marine kelp networks ensures high-capacity baseline carbon sequestration to offset manufacturing and travel cycles safely.",
      color: "text-amber-500",
      icon: <Flame className="w-4 h-4" />
    },
    {
      title: "Marine Integrity & Biodiversity Focus",
      detail: "Over 25% of human-originated CO2 emissions are absorbed by oceans. Clean habits mitigate acidification risk protecting ocean ecosystems and biological cycles.",
      color: "text-cyan-500",
      icon: <Waves className="w-4 h-4" />
    }
  ];

  const cardBg = isTwilightMode ? "bg-[#161F2B]/90 border-[#2E3B4E]/80" : "bg-white border-[#E4E2DB]";
  const textColor = isTwilightMode ? "text-stone-100" : "text-stone-900";
  const bodyColor = isTwilightMode ? "text-slate-300" : "text-stone-700 font-serif";
  const hoverBg = isTwilightMode ? "hover:bg-[#1E293B]" : "hover:bg-[#F9F8F6]";

  return (
    <div
      id="environmental-protection-showcase"
      className={`border rounded-2xl p-6 shadow-sm transition-all duration-300 ${cardBg} max-w-5xl mx-auto`}
    >
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left Side: Thriving Planet Artwork display */}
        <div className="flex-1 space-y-4">
          <div className="flex items-center justify-between">
            <span className={`text-xs font-bold tracking-wider uppercase px-2.5 py-1 rounded-md flex items-center gap-1.5 ${
              isTwilightMode ? "bg-emerald-950/40 text-emerald-300 border border-emerald-800/20" : "bg-emerald-50 text-emerald-800 border border-emerald-100"
            }`}>
              <Shield className="w-3.5 h-3.5" /> Environmental Safeguards
            </span>
            <span className="text-xs font-mono text-stone-500 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-pulse" /> Interactive Showcase
            </span>
          </div>

          {/* Banner Image Stage */}
          <div
            id="protection-banner-stage"
            className="group relative w-full aspect-[16/9] rounded-xl overflow-hidden bg-stone-900 border border-stone-400/10 shadow-md"
          >
            <img
              src={bannerImg}
              alt="Environmental Safeguards & Thriving Biodiversity Banner"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
            {/* Subtle elegant gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent flex flex-col justify-end p-5" />
            <div className="absolute bottom-4 left-4 right-4 z-10 text-white space-y-1 select-none pointer-events-none">
              <span className="text-[10px] text-emerald-400 font-mono tracking-widest uppercase flex items-center gap-1">
                <Heart className="w-3 h-3 text-red-400 fill-red-400 animate-pulse" /> Environmental Integrity Indicator
              </span>
              <h4 className="text-sm md:text-base font-extrabold tracking-tight">
                Our Living Earth: Thriving Ecosystem Balance
              </h4>
            </div>
          </div>
        </div>

        {/* Right Side: Educational Safeguard guidelines */}
        <div className="w-full lg:w-80 flex flex-col justify-between gap-5">
          <div className="space-y-3">
            <div className="space-y-1">
              <h4 className={`text-sm font-bold tracking-tight uppercase flex items-center gap-1.5 ${textColor}`}>
                <HelpCircle className="w-4 h-4 text-emerald-500" /> Active Protection Pillars
              </h4>
              <p className={`text-[11px] ${isTwilightMode ? "text-slate-400" : "text-stone-500"}`}>
                Select an protection arena to delve into key conservation statistics:
              </p>
            </div>

            <div className="space-y-2">
              {facts.map((item, idx) => {
                const isActive = idx === activeTab;
                return (
                  <button
                    key={idx}
                    onClick={() => setActiveTab(idx)}
                    className={`w-full text-left p-3 rounded-xl border transition-all text-xs flex gap-2.5 items-start ${
                      isActive
                        ? "border-emerald-500/50 bg-emerald-500/5"
                        : `${isTwilightMode ? "border-[#2E3B4E] " + hoverBg : "border-[#E4E2DB] " + hoverBg}`
                    }`}
                  >
                    <div className="p-1.5 rounded-lg bg-stone-500/5 mt-0.5">
                      {item.icon}
                    </div>
                    <div className="flex-1 space-y-0.5">
                      <div className={`font-semibold line-clamp-1 ${isActive ? "text-emerald-500" : textColor}`}>
                        {item.title}
                      </div>
                      <p className={`text-[11px] line-clamp-2 ${isTwilightMode ? "text-slate-400" : "text-stone-500"}`}>
                        {item.detail}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Selected Feature Card */}
          <div className={`p-4 rounded-xl border ${
            isTwilightMode ? "bg-[#1E293B]/60 border-slate-700/50" : "bg-emerald-50/30 border-emerald-100"
          } space-y-2`}>
            <span className="text-[10px] font-bold text-emerald-600 block uppercase tracking-wider">
              Selected Safeguard Protocol:
            </span>
            <p className={`${bodyColor} text-[11px] leading-relaxed italic`}>
              &ldquo;{facts[activeTab].detail}&rdquo;
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
