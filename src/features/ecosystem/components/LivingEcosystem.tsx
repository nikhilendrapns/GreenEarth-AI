import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { CloudSun, CloudRain, Sun, Moon, Wind, ShieldAlert, Sparkles, Sliders, Calendar, Award } from "lucide-react";

interface LivingEcosystemProps {
  score: number; // estimated annual CO2 metric tons
  points: number; // eco-vitality reward points
  adoptedCount: number; // count of adopted actions
  completedMissionsCount: number; // count of completed missions
  isSimulation?: boolean; // is this showing a futuristic projection?
  reducedMotion?: boolean;
  isTwilightMode?: boolean; // Elegant Dark mode simulation
}

interface InteractionRipple {
  id: number;
  x: number;
  y: number;
  emoji: string;
}

export default function LivingEcosystem({
  score,
  points,
  adoptedCount,
  completedMissionsCount,
  isSimulation = false,
  reducedMotion = false,
  isTwilightMode = false,
}: LivingEcosystemProps) {
  // Earth Memory Playback state: "live" (current active), "day1", "week1", "month1"
  const [memoryTimeline, setMemoryTimeline] = useState<"day1" | "week1" | "month1" | "live">("live");
  const [activeWeatherMode, setActiveWeatherMode] = useState<"auto" | "breeze" | "cleansing_rain" | "industrial_smog" | "aurora">("auto");
  const [ripples, setRipples] = useState<InteractionRipple[]>([]);
  const rippleCounter = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Derive parameters depending on the Memory Playback status (Evolution replay)
  const displayScore = memoryTimeline === "day1" ? 22
    : memoryTimeline === "week1" ? 15
    : memoryTimeline === "month1" ? 8.5
    : score;

  const displayPoints = memoryTimeline === "day1" ? 0
    : memoryTimeline === "week1" ? 35
    : memoryTimeline === "month1" ? 110
    : points;

  const displayAdopted = memoryTimeline === "day1" ? 0
    : memoryTimeline === "week1" ? 1
    : memoryTimeline === "month1" ? 3
    : adoptedCount;

  const displayMissions = memoryTimeline === "day1" ? 0
    : memoryTimeline === "week1" ? 1
    : memoryTimeline === "month1" ? 4
    : completedMissionsCount;

  // Derive the 6 distinct moods for My Personal Earth based on emissions footprint and actions
  const getEcosystemMood = (): "Happy" | "Balanced" | "Hopeful" | "Recovering" | "Stressed" | "Critical" => {
    if (memoryTimeline === "day1") return "Critical";
    if (memoryTimeline === "week1") return "Stressed";
    if (memoryTimeline === "month1") return "Hopeful";

    if (displayScore >= 12.5) return "Critical";
    if (displayScore >= 7.8) return "Stressed";
    
    // High engagement gives Recovering / Hopeful mood
    if (displayAdopted >= 3) return "Recovering";
    if (displayPoints >= 150) return "Happy";
    if (displayScore < 4.2) return "Happy";
    if (displayScore < 6.8) return "Balanced";
    return "Hopeful";
  };

  const currMood = getEcosystemMood();

  // Mapping level tiers (Gamification progress)
  const getProgressionLevel = () => {
    const pts = displayPoints;
    if (pts >= 320) return { title: "Planet Guardian 👑", color: "from-amber-500 to-yellow-600", desc: "Supreme master of global carbon restoration." };
    if (pts >= 230) return { title: "Rainforest Tier 🌳", color: "from-emerald-500 to-teal-600", desc: "A dense sanctuary of mature environmental pledges." };
    if (pts >= 160) return { title: "Forest Guardian 🌲", color: "from-green-500 to-emerald-600", desc: "You have established dozens of sustainable loops." };
    if (pts >= 100) return { title: "Tree Nurturer 🌱", color: "from-emerald-400 to-green-500", desc: "Growing steadily, cooling down local air loads." };
    if (pts >= 45) return { title: "Plant Tier 🌿", color: "from-emerald-300 to-emerald-500", desc: "Your leaves are branching to capture solar elements." };
    if (pts >= 15) return { title: "Sprout Seedling 🌱", color: "from-green-200 to-emerald-400", desc: "Fresh roots taking place in the fertile ground." };
    return { title: "Seed Tier 🥔", color: "from-stone-400 to-stone-500", desc: "An active germ of change ready to sprout." };
  };

  const currentLevel = getProgressionLevel();

  // Climate/Weather calculation determined by computed mood
  const weather = activeWeatherMode === "auto"
    ? currMood === "Critical"
      ? "industrial_smog"
      : currMood === "Stressed"
      ? "industrial_smog"
      : currMood === "Recovering"
      ? "cleansing_rain"
      : isTwilightMode
      ? "aurora"
      : "breeze"
    : activeWeatherMode;

  // Sky color gradients correspond to weather atmosphere
  const getSkyGradient = () => {
    switch (weather) {
      case "breeze":
        // Radiant healthy mornings
        return currMood === "Happy" 
          ? "from-[#80DEEA] via-[#B2EBF2] to-[#E8F8F5]" 
          : "from-[#B3E5FC] via-[#E1F5FE] to-[#E8F5E9]";
      case "cleansing_rain":
        // Cleansing rain clearing smoke, displays beautiful turquoise/gray with hints of progress
        return "from-[#607D8B] via-[#90A4AE] to-[#E0F2F1]";
      case "industrial_smog":
        // Reddish bronze orange smog
        return currMood === "Critical"
          ? "from-[#3E2723] via-[#795548] to-[#FF8A65]/40"
          : "from-[#FFE0B2] via-[#FFB74D] to-[#E65100]/40";
      case "aurora":
      default:
        // Glowing celestial starry stargaze
        return isTwilightMode 
          ? "from-[#080E1A] via-[#0E1B35] to-[#152B54]" 
          : "from-[#E1F5FE] via-[#B3E5FC] to-[#C8E6C9]";
    }
  };

  // Tree and flower render logic mapping to progression
  const treeCount = currMood === "Critical" ? 0
    : currMood === "Stressed" ? 1
    : Math.max(1, Math.min(8, Math.floor(displayAdopted * 1.5) + (currMood === "Happy" ? 4 : 2)));

  const flowerCount = currMood === "Critical" ? 0
    : currMood === "Stressed" ? 2
    : Math.max(1, Math.min(10, Math.floor(displayPoints / 25) + displayMissions * 2));

  // Bunny or birds appearance
  const showBunny = currMood === "Happy" || currMood === "Balanced" || currMood === "Recovering";
  const showBirds = currMood === "Happy" || currMood === "Hopeful" || displayPoints > 80;

  const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const emojis = weather === "breeze" ? ["🍃", "🌸", "🦋", "✨"]
      : weather === "cleansing_rain" ? ["💧", "🌈", "🌱", "🦋"]
      : weather === "industrial_smog" ? ["⚠️", "🌾", "💨", "🛡️"]
      : ["⭐", "✦", "🌌", "🌙"];
    const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];

    const newRipple: InteractionRipple = {
      id: rippleCounter.current++,
      x,
      y,
      emoji: randomEmoji,
    };

    setRipples((prev) => [...prev, newRipple]);

    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== newRipple.id));
    }, 1200);
  };

  return (
    <div
      ref={containerRef}
      id="living-ecosystem-main"
      className={`relative rounded-3xl overflow-hidden border p-1 transition-all duration-500 shadow-xl select-none ${
        isTwilightMode ? "border-[#232A31] bg-[#0F141C]" : "border-[#E4E2DB] bg-[#FCFAF6]"
      }`}
    >
      {/* Sky Canvas viewport */}
      <div
        id="interactive-canvas-box"
        onClick={handleCanvasClick}
        className={`relative w-full h-[320px] md:h-[400px] rounded-t-[22px] bg-gradient-to-b ${getSkyGradient()} overflow-hidden cursor-crosshair transition-all duration-1000`}
      >
        
        {/* Dynamic Celestial Sun / Moon flare */}
        <motion.div
          id="celestial-body"
          className={`absolute top-8 right-12 rounded-full blur-[0.5px] transition-all duration-1000 ${
            isTwilightMode || weather === "aurora"
              ? "w-11 h-11 bg-[#ECEFF1] shadow-[0_0_30px_rgba(255,255,255,0.85),inset_-3px_-3px_0px_#CFD8DC]"
              : currMood === "Critical"
              ? "w-14 h-14 bg-red-600 shadow-[0_0_40px_rgba(239,68,68,0.8)]"
              : currMood === "Happy"
              ? "w-18 h-18 bg-yellow-300 shadow-[0_0_40px_#FBBF24,inset_-2px_-2px_0px_#F59E0B]"
              : "w-15 h-15 bg-[#FFF9C4]/90 shadow-[0_0_25px_rgba(251,191,36,0.5)]"
          }`}
          animate={
            reducedMotion
              ? {}
              : {
                  scale: [1, 1.05, 1],
                  y: [0, -3, 0],
                }
          }
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Dynamic Aurora Wave element in Twilight Mode */}
        {weather === "aurora" && !reducedMotion && (
          <svg className="absolute inset-0 w-full h-full opacity-40 pointer-events-none">
            <motion.path
              d="M 0,80 Q 80,40 180,90 T 400,60"
              fill="none"
              stroke="url(#auroraGradient1)"
              strokeWidth="40"
              strokeLinecap="round"
              animate={{
                d: [
                  "M 0,80 Q 80,40 180,90 T 400,60",
                  "M 0,60 Q 120,95 240,50 T 400,90",
                  "M 0,80 Q 80,40 180,90 T 400,60"
                ]
              }}
              transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
            />
            <defs>
              <linearGradient id="auroraGradient1" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#10B981" />
                <stop offset="50%" stopColor="#06B6D4" />
                <stop offset="100%" stopColor="#6366F1" />
              </linearGradient>
            </defs>
          </svg>
        )}

        {/* Rain particles overlay for Cleansing Rain */}
        {weather === "cleansing_rain" && !reducedMotion && (
          <div className="absolute inset-0 pointer-events-none z-10">
            {[...Array(30)].map((_, i) => (
              <motion.div
                key={`rain-${i}`}
                className="absolute bg-blue-300/50"
                style={{
                  width: "2px",
                  height: "18px",
                  left: `${i * 3.3}%`,
                  top: `-20px`,
                }}
                animate={{
                  y: ["0px", "430px"],
                  x: ["0px", "-45px"],
                }}
                transition={{
                  duration: 0.9 + (i % 4) * 0.25,
                  repeat: Infinity,
                  ease: "linear",
                  delay: (i % 6) * 0.12,
                }}
              />
            ))}
          </div>
        )}

        {/* Toxic Smoke particles if environment mood is Critical or Stressed */}
        {weather === "industrial_smog" && !reducedMotion && (
          <div className="absolute inset-0 pointer-events-none z-10 bg-black/15">
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={`smog-${i}`}
                className={`absolute rounded-full blur-xl ${
                  currMood === "Critical" ? "bg-stone-900/45" : "bg-[#5D4037]/25"
                }`}
                style={{
                  width: "200px",
                  height: "90px",
                  left: `${-60 + i * 110}px`,
                  top: `${30 + (i % 2) * 35}px`,
                }}
                animate={{
                  x: [-40, 40, -40],
                }}
                transition={{
                  duration: 7 + i * 2.2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            ))}
          </div>
        )}

        {/* Cinematic Rainbow appears only during "Recovering" climate */}
        {currMood === "Recovering" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.55 }}
            className="absolute left-6 top-16 pointer-events-none z-5 w-40 h-40 rounded-full border-[10px] border-b-0 border-t-red-400 border-r-yellow-400 border-l-teal-400 opacity-55 rotate-[-25deg]"
          />
        )}

        {/* Vector SVG Scenery container */}
        <svg
          viewBox="0 0 400 300"
          className="w-full h-full select-none pointer-events-none"
          preserveAspectRatio="none"
        >
          {/* Distant mountains layout */}
          <path
            d="M-50 210 L80 142 L190 220 L280 152 L450 210 L450 300 L-50 300 Z"
            className={`${
              isTwilightMode || weather === "aurora"
                ? "fill-[#0A101C]/80"
                : currMood === "Critical"
                ? "fill-[#37241E]"
                : currMood === "Stressed"
                ? "fill-[#4E342E]/70"
                : weather === "cleansing_rain"
                ? "fill-[#455A64]/40"
                : "fill-[#2E7D32]/25"
            } transition-colors duration-1000`}
          />
          <path
            d="M-20 225 L120 172 L240 230 L350 162 L420 225 L420 300 L-20 300 Z"
            className={`${
              isTwilightMode || weather === "aurora"
                ? "fill-[#05080E]/90"
                : currMood === "Critical"
                ? "fill-[#2D1B15]"
                : currMood === "Stressed"
                ? "fill-[#3E2723]/80"
                : weather === "cleansing_rain"
                ? "fill-[#37474F]/35"
                : "fill-[#1B5E20]/20"
            } transition-colors duration-1000`}
          />

          {/* Drifting Clouds */}
          <motion.g
            animate={reducedMotion ? {} : { x: [-35, 385, -35] }}
            transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
          >
            <path
              d="M20 50 Q28 42 38 48 Q46 38 58 45 Q64 35 74 42 Q82 45 80 55 Z"
              className={currMood === "Critical" ? "fill-stone-800/80" : "fill-white/75"}
              opacity={weather === "cleansing_rain" ? 0.45 : 0.85}
            />
          </motion.g>

          <motion.g
            animate={reducedMotion ? {} : { x: [360, -90, 360] }}
            transition={{ duration: 33, repeat: Infinity, ease: "linear" }}
          >
            <path
              d="M50 82 Q56 75 64 79 Q72 70 82 77 Q88 68 96 74 Q106 78 102 87 Z"
              className={currMood === "Critical" ? "fill-brown-900/60" : "fill-white/60"}
              opacity={0.5}
            />
          </motion.g>

          {/* Floating Bioluminescent sparkles / Fireflies */}
          {currMood === "Happy" && !reducedMotion && (
            <g>
              {[...Array(14)].map((_, idx) => (
                <motion.circle
                  key={`shiny-${idx}`}
                  cx={30 + idx * 26 + (idx % 2) * 10}
                  cy={120 + (idx % 3) * 20}
                  r="2.2"
                  fill="#6EE7B7"
                  animate={{
                    y: [0, -18, 0],
                    x: [0, 10, 0],
                    opacity: [0.1, 0.95, 0.1],
                  }}
                  transition={{
                    duration: 2.5 + (idx % 3) * 1.2,
                    repeat: Infinity,
                    delay: idx * 0.15,
                  }}
                />
              ))}
            </g>
          )}

          {/* Ground soils landscape representation */}
          <path
            d="M-40 260 Q120 220 280 250 T440 240 L440 320 L-40 320 Z"
            className={`${
              isTwilightMode || weather === "aurora" ? "fill-[#0E2018]" :
              currMood === "Critical" ? "fill-[#3A241F]" :
              currMood === "Stressed" ? "fill-[#6D4C41]" :
              currMood === "Recovering" ? "fill-[#43A047]" :
              "fill-emerald-800"
            } transition-colors duration-1000`}
          />
          <path
            d="M-20 275 Q150 250 320 270 T440 260 L440 320 L-20 320 Z"
            className={`${
              isTwilightMode || weather === "aurora" ? "fill-[#0A1610]" :
              currMood === "Critical" ? "fill-[#2D1B15]" :
              currMood === "Stressed" ? "fill-[#5D4037]" :
              currMood === "Recovering" ? "fill-[#388E3C]" :
              "fill-emerald-600"
            } transition-colors duration-1000`}
          />

          {/* Lush Trees forest rendering */}
          {[...Array(treeCount)].map((_, index) => {
            const xPos = 40 + index * 48 + (index % 2) * 10;
            const sizeMultiplier = 0.8 + (index % 3) * 0.12;

            const leavesColor = currMood === "Critical" ? "fill-[#372722]"
              : currMood === "Stressed" ? "fill-[#8D6E63]"
              : isTwilightMode ? "fill-teal-800"
              : "fill-emerald-650";

            const trunkColor = currMood === "Critical" ? "fill-stone-900" : "fill-[#5C3A21]";
            const maxSway = weather === "cleansing_rain" ? 3.5 : weather === "breeze" ? 1.8 : 0.4;

            return (
              <g key={`tree-${index}`} className="transition-all duration-700">
                <rect x={xPos + 12} y={235} width={4.5} height={34} className={trunkColor} />
                <motion.g
                  animate={
                    reducedMotion
                      ? {}
                      : {
                          rotate: [-maxSway, maxSway, -maxSway],
                        }
                  }
                  style={{ originX: `${(xPos + 14) / 4}%`, originY: "82%" }}
                  transition={{
                    duration: 3.2 + (index % 3),
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <polygon
                    points={`${xPos + 14},${162 * sizeMultiplier} ${xPos + 27},${213 * sizeMultiplier} ${xPos + 1},${213 * sizeMultiplier}`}
                    className={leavesColor}
                  />
                  <polygon
                    points={`${xPos + 14},${177 * sizeMultiplier} ${xPos + 24},${223 * sizeMultiplier} ${xPos + 4},${223 * sizeMultiplier}`}
                    className={leavesColor}
                    opacity={0.88}
                  />
                </motion.g>
              </g>
            );
          })}

          {/* Plant flower petals */}
          {[...Array(flowerCount)].map((_, index) => {
            const xPos2 = 15 + index * 36 + (index % 3) * 5;
            const yPos2 = 262 + (index % 2) * 10;

            const bloomColors = currMood === "Critical"
              ? ["fill-stone-600", "fill-stone-700"]
              : currMood === "Stressed"
              ? ["fill-amber-850", "fill-orange-800", "fill-brown-600"]
              : isTwilightMode
              ? ["fill-amber-300", "fill-purple-400", "fill-cyan-300", "fill-green-300"]
              : ["fill-amber-400", "fill-rose-500", "fill-cyan-400", "fill-violet-400", "fill-fuchsia-400"];

            const petalColor = bloomColors[index % bloomColors.length];

            return (
              <g key={`flower-${index}`} className="transition-opacity duration-550">
                <line
                  x1={xPos2}
                  y1={yPos2}
                  x2={xPos2}
                  y2={yPos2 + 10}
                  stroke={currMood === "Critical" ? "#44403C" : currMood === "Stressed" ? "#78716C" : "#059669"}
                  strokeWidth="1.2"
                />
                <motion.g
                  transform={`translate(${xPos2}, ${yPos2})`}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 110, delay: index * 0.04 }}
                >
                  <circle cx="0" cy="-2" r="2.2" className={petalColor} />
                  <circle cx="-2.2" cy="0" r="2.2" className={petalColor} />
                  <circle cx="2.2" cy="0" r="2.2" className={petalColor} />
                  <circle cx="0" cy="2.2" r="2.2" className={petalColor} />
                  <circle cx="0" cy="0" r="1.1" className="fill-white" />
                </motion.g>
              </g>
            );
          })}

          {/* Dynamic Flying Birds flock */}
          {showBirds && !reducedMotion && (
            <g>
              {[...Array(3)].map((_, i) => (
                <motion.g
                  key={`bird-${i}`}
                  animate={{
                    x: [-20, 420],
                    y: [60 + i * 15, 80 + i * 5, 60 + i * 15],
                  }}
                  transition={{
                    duration: 16 + i * 4,
                    repeat: Infinity,
                    ease: "linear",
                    delay: i * 3,
                  }}
                >
                  <path
                    d="M 8 8 Q 11 3 14 8 Q 17 3 20 8"
                    fill="none"
                    stroke={isTwilightMode ? "#94A3B8" : "#111827"}
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </motion.g>
              ))}
            </g>
          )}
        </svg>

        {/* Wildlife rabbit bunny hopping inside garden */}
        {showBunny && (
          <motion.div
            id="wildlife-bunny"
            className="absolute bottom-16 select-none pointer-events-none text-2xl z-20"
            animate={{
              x: ["10px", "320px", "10px"],
              y: ["0px", "-26px", "0px", "-26px", "0px"],
            }}
            transition={{
              x: { duration: 22, repeat: Infinity, ease: "easeInOut" },
              y: { duration: 1.3, repeat: Infinity, ease: "easeInOut" },
            }}
          >
            🐇
          </motion.div>
        )}

        {/* Click response coordinate splashes */}
        <AnimatePresence>
          {ripples.map((rip) => (
            <motion.div
              key={rip.id}
              className="absolute text-xl pointer-events-none z-30 select-none font-bold text-center"
              style={{ left: rip.x - 12, top: rip.y - 12 }}
              initial={{ scale: 0, opacity: 1, y: 0 }}
              animate={{ scale: 1.8, opacity: 0, y: -45 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.1, ease: "easeOut" }}
            >
              {rip.emoji}
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Real-time Weather Override Panel Overlay */}
        <div id="weather-controllers" className="absolute top-3 right-3 flex items-center gap-1 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md rounded-xl border border-stone-200/45 dark:border-zinc-800/40 p-1">
          <span className="text-[8px] font-bold text-slate-400 uppercase px-1 hidden lg:inline">
            Overlays:
          </span>
          {[
            { id: "auto", label: "Auto Match", icon: CloudSun },
            { id: "breeze", label: "Breeze", icon: Sun },
            { id: "cleansing_rain", label: "Rain", icon: CloudRain },
            { id: "industrial_smog", label: "Dust", icon: ShieldAlert },
            { id: "aurora", label: "Stars", icon: Sparkles },
          ].map((mode) => {
            const Icon = mode.icon;
            const isSelected = activeWeatherMode === mode.id;
            return (
              <button
                key={mode.id}
                id={`btn-weather-${mode.id}`}
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveWeatherMode(mode.id as any);
                }}
                className={`p-1.5 rounded-lg transition-all border border-transparent ${
                  isSelected
                    ? "bg-emerald-700 text-white shadow-sm"
                    : "text-slate-700 dark:text-zinc-300 hover:bg-black/5"
                }`}
                title={mode.label}
              >
                <Icon className="w-3.5 h-3.5" />
              </button>
            );
          })}
        </div>

        {/* Main interactive state information display on lower stage */}
        <div
          id="ecosystem-stats-pills"
          className={`absolute bottom-3 left-3 right-3 flex flex-col md:flex-row justify-between items-start md:items-center gap-2 px-4 py-2.5 rounded-2xl border text-xs transition-all ${
            isTwilightMode
              ? "bg-[#090D14]/90 border-[#1E252D] text-slate-100"
              : "bg-white/80 border-white/40 text-slate-700 backdrop-blur-md"
          }`}
        >
          <div className="flex items-center gap-2">
            <span className="font-semibold text-[10px] text-slate-400 uppercase tracking-wider">Mood:</span>
            <span
              className={`font-black uppercase tracking-wider flex items-center gap-1 ${
                currMood === "Happy" ? "text-emerald-600"
                : currMood === "Balanced" ? "text-emerald-500"
                : currMood === "Hopeful" ? "text-teal-500"
                : currMood === "Recovering" ? "text-blue-600"
                : currMood === "Stressed" ? "text-amber-500"
                : "text-rose-600 animate-pulse"
              }`}
            >
              {currMood === "Happy" && "😊"}
              {currMood === "Balanced" && "☀️"}
              {currMood === "Hopeful" && "🌱"}
              {currMood === "Recovering" && "🌈"}
              {currMood === "Stressed" && "⚠️"}
              {currMood === "Critical" && "🌫️"}
              {currMood} Earth
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-3 font-mono text-[11px] font-bold">
            <span>
              CO₂ footprint: <strong className="text-stone-900 dark:text-stone-100">{displayScore.toFixed(1)}t</strong>/yr
            </span>
            <span>
              Ecosystem Vitality: <strong className="text-emerald-600">+{displayPoints} pts</strong>
            </span>
            {memoryTimeline !== "live" && (
              <span className="bg-amber-400 text-stone-900 rounded font-bold px-1.5 py-0.5 text-[9px] uppercase tracking-wider animate-pulse">
                TIMELINE PREVIEW
              </span>
            )}
          </div>
        </div>

        {isSimulation && (
          <div
            id="simulation-view-indicator"
            className="absolute top-12 left-3 bg-teal-600 text-white font-bold text-[9px] uppercase tracking-widest px-3 py-1 rounded-full shadow-md flex items-center gap-1.5 animate-pulse"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-white block" />
            Ecosystem Foresight
          </div>
        )}
      </div>

      {/* Gamification progress tier ribbon bar */}
      <div className={`p-4 border-b flex flex-col md:flex-row items-center justify-between gap-3 text-xs transition-colors ${
        isTwilightMode ? "bg-[#141B26] border-[#202936] text-slate-300" : "bg-stone-50 border-stone-200 text-stone-700"
      }`}>
        <div className="flex items-center gap-3.5">
          <div className={`p-2 rounded-xl bg-gradient-to-r text-stone-950 font-black tracking-wider uppercase text-[10px] shadow-sm shrink-0 ${currentLevel.color}`}>
            <Award className="w-4 h-4 text-white inline-block mr-1.5 pb-0.5" />
            {currentLevel.title}
          </div>
          <div>
            <p className="font-extrabold uppercase text-[10px] text-slate-400">Ecosystem progression state</p>
            <p className="text-[11px] opacity-90 leading-tight pt-0.5">{currentLevel.desc}</p>
          </div>
        </div>

        {/* Small continuous point indicator bar */}
        <div className="w-full md:w-48 space-y-1">
          <div className="flex justify-between text-[9px] uppercase font-bold text-slate-400">
            <span>Progress to Guardian</span>
            <span>{displayPoints}/350 pts</span>
          </div>
          <div className="w-full h-1.5 bg-stone-200 dark:bg-stone-850 rounded-full overflow-hidden">
            <div 
              className="h-full bg-emerald-600 transition-all duration-305"
              style={{ width: `${Math.min(100, (displayPoints / 350) * 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Earth Memory Playback Slider (Witness Earth's evolution over a year) */}
      <div id="earth-memory-slider-panel" className={`p-4 space-y-2.5 transition-colors ${
        isTwilightMode ? "bg-[#111621] text-slate-300" : "bg-[#F5F2EA] text-stone-700"
      }`}>
        <div className="flex items-center justify-between">
          <p className="text-xs font-black uppercase tracking-wider flex items-center gap-1.5 text-stone-500 dark:text-slate-400">
            <Calendar className="w-3.5 h-3.5" /> Earth Memory evolution Playback
          </p>
          <span className="text-[10px] uppercase font-bold font-mono tracking-wider bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-450 px-2 py-0.5 rounded">
            {memoryTimeline === "day1" && "Day 1 (Barren Start)"}
            {memoryTimeline === "week1" && "Week 1 (Early Shoots)"}
            {memoryTimeline === "month1" && "Month 1 (Sprouting Canopy)"}
            {memoryTimeline === "live" && "Active Year (My Personal Earth Live)"}
          </span>
        </div>

        {/* Customized horizontal discrete timeline selector */}
        <div className="relative pt-1 flex items-center">
          <input
            id="timeline-playback-bar"
            type="range"
            min="0"
            max="3"
            step="1"
            value={memoryTimeline === "day1" ? 0 : memoryTimeline === "week1" ? 1 : memoryTimeline === "month1" ? 2 : 3}
            onChange={(e) => {
              const val = parseInt(e.target.value);
              if (val === 0) setMemoryTimeline("day1");
              else if (val === 1) setMemoryTimeline("week1");
              else if (val === 2) setMemoryTimeline("month1");
              else setMemoryTimeline("live");
            }}
            className="w-full h-1.5 bg-stone-300 dark:bg-stone-800 rounded-lg appearance-none cursor-pointer accent-emerald-600"
          />
        </div>

        <div className="flex justify-between text-[9px] font-bold uppercase text-slate-400 font-mono pt-1">
          <button onClick={() => setMemoryTimeline("day1")} className={`hover:text-stone-900 dark:hover:text-white ${memoryTimeline === "day1" ? "text-emerald-600 scale-105 font-black" : ""}`}>
            • Day 1 (Industrial Haze)
          </button>
          <button onClick={() => setMemoryTimeline("week1")} className={`hover:text-stone-900 dark:hover:text-white ${memoryTimeline === "week1" ? "text-emerald-600 scale-105 font-black" : ""}`}>
            • Week 1
          </button>
          <button onClick={() => setMemoryTimeline("month1")} className={`hover:text-stone-900 dark:hover:text-white ${memoryTimeline === "month1" ? "text-emerald-600 scale-105 font-black" : ""}`}>
            • Month 1
          </button>
          <button onClick={() => setMemoryTimeline("live")} className={`hover:text-stone-900 dark:hover:text-white ${memoryTimeline === "live" ? "text-emerald-600 scale-105 font-black" : ""}`}>
            • Live Personal Earth ✦
          </button>
        </div>
      </div>

      <div
        id="ecosystem-caption-box"
        className={`p-3 text-center text-xs italic rounded-b-[22px] transition-colors duration-500 border-t ${
          isTwilightMode ? "bg-[#121824]/60 text-slate-400 border-stone-850" : "bg-[#EDE8DE] text-stone-500 border-stone-200"
        }`}
      >
        &ldquo;Tap inside your Personal Earth representation to drop seed droplets. Adjust the Memory timeline to watch your ecological footprint heal the world!&rdquo;
      </div>
    </div>
  );
}
