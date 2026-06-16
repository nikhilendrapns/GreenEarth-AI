import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { AssessmentAnswers } from "../types";
import { Sparkles, ArrowRight, ArrowLeft, Save, RotateCcw, AlertCircle, Sun, Cloud, TreePine, Bird } from "lucide-react";

interface ConversationalAssessmentProps {
  onSubmit: (answers: AssessmentAnswers) => void;
  isLoading: boolean;
  isTwilightMode?: boolean;
}

const INITIAL_ANSWERS: AssessmentAnswers = {
  transportation: {
    commuteMethod: "none",
    commuteMiles: 0,
    flightsLength: "none",
  },
  food: {
    dietType: "balanced",
    organicLocal: "sometimes",
    foodWaste: "medium",
  },
  energy: {
    homeSize: "apartment",
    heatingSource: "electric",
    greenElectricity: false,
  },
  shopping: {
    purchaseFrequency: "moderate",
    secondHand: "sometimes",
  },
  waste: {
    recyclingLevel: "partial",
    composting: false,
    singleUsePlastics: "moderate",
  },
};

export default function ConversationalAssessment({
  onSubmit,
  isLoading,
  isTwilightMode = false,
}: ConversationalAssessmentProps) {
  const [step, setStep] = useState<number>(0);
  const [answers, setAnswers] = useState<AssessmentAnswers>(INITIAL_ANSWERS);
  const [hasSavedState, setHasSavedState] = useState<boolean>(false);
  const [showsSavedNotification, setShowsSavedNotification] = useState<boolean>(false);
  const [cinematicStep, setCinematicStep] = useState<number>(-1); // -1 = normal, 0+ = cinematic phase

  // Checks for pre-saved draft session on mount (Resume Later logic)
  useEffect(() => {
    const savedAns = localStorage.getItem("lens_ai_onboarding_answers");
    const savedStp = localStorage.getItem("lens_ai_onboarding_step");
    if (savedAns && savedStp) {
      setHasSavedState(true);
    }
  }, []);

  // Autosave answers when updated (Auto Save requirement)
  useEffect(() => {
    localStorage.setItem("lens_ai_onboarding_answers", JSON.stringify(answers));
    localStorage.setItem("lens_ai_onboarding_step", String(step));
  }, [answers, step]);

  const handleResume = () => {
    const savedAns = localStorage.getItem("lens_ai_onboarding_answers");
    const savedStp = localStorage.getItem("lens_ai_onboarding_step");
    if (savedAns && savedStp) {
      try {
        setAnswers(JSON.parse(savedAns));
        setStep(parseInt(savedStp));
      } catch (e) {
        console.error("Failed to parse saved onboarding progress", e);
      }
    }
    setHasSavedState(false);
  };

  const handleStartFresh = () => {
    localStorage.removeItem("lens_ai_onboarding_answers");
    localStorage.removeItem("lens_ai_onboarding_step");
    setAnswers(INITIAL_ANSWERS);
    setStep(0);
    setHasSavedState(false);
  };

  const handleSaveProgress = () => {
    localStorage.setItem("lens_ai_onboarding_answers", JSON.stringify(answers));
    localStorage.setItem("lens_ai_onboarding_step", String(step));
    setShowsSavedNotification(true);
    setTimeout(() => setShowsSavedNotification(false), 3000);
  };

  const handleNext = () => {
    if (step < 4) {
      setStep((p) => p + 1);
    } else {
      // Trigger cinematic onboarding sequence before submitting
      startCinematicExperience();
    }
  };

  const startCinematicExperience = () => {
    setCinematicStep(0);
  };

  // Cinematic sequence orchestration step-by-step
  useEffect(() => {
    if (cinematicStep < 0) return;

    const timings = [1500, 1800, 1800, 1500, 1800]; // timer delay for each beautiful phase
    if (cinematicStep < timings.length) {
      const timer = setTimeout(() => {
        setCinematicStep((p) => p + 1);
      }, timings[cinematicStep]);
      return () => clearTimeout(timer);
    } else {
      // Cinematic sequence completely processed -> submit answers to parents!
      onSubmit(answers);
    }
  }, [cinematicStep]);

  const handlePrev = () => {
    if (step > 0) {
      setStep((p) => p - 1);
    }
  };

  const updateSubField = (
    category: keyof AssessmentAnswers,
    field: string,
    value: any
  ) => {
    setAnswers((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [field]: value,
      },
    }));
  };

  const stepsInfo = [
    { 
      title: "Atmosphere & Mobility", 
      question: "How do you navigate your world daily?",
      description: "Getting from place to place represents our single most immediate connection to Earth's atmospheric blanket." 
    },
    { 
      title: "Biological Nourishment", 
      question: "What feeds your body, and how is it sourced?",
      description: "Our nutrition habits shape our soil fertility, land usage, carbon-absorbing forests, and wildlife populations." 
    },
    { 
      title: "Shelter & Energy Core", 
      question: "How is your living sanctuary powered and warmed?",
      description: "The electricity, standard grids, or renewable generators you rely on active our domestic footprints." 
    },
    { 
      title: "Consumption & Lifecycles", 
      question: "What is your relationship with newly sourced goods?",
      description: "Material products, textiles, and devices leave a dynamic chain of production that changes environments." 
    },
    { 
      title: "System Restoration", 
      question: "How do you restore discarded elements back to nature?",
      description: "Choosing to recycle, composting, or minimizing plastics preserves fertile fields and prevents methane build-up." 
    },
  ];

  // Helper selectors for buttons styling
  const buttonStyleFor = (category: keyof AssessmentAnswers, field: string, val: any) => {
    const isSelected = (answers[category] as any)[field] === val;
    if (isSelected) {
      return isTwilightMode
        ? "bg-amber-500/15 border-amber-400 text-amber-300 ring-2 ring-amber-400/20 font-bold"
        : "bg-emerald-500/10 border-emerald-800 text-emerald-900 ring-2 ring-emerald-800/10 font-bold shadow-sm";
    }
    return isTwilightMode
      ? "bg-[#161D26] border-[#232A31] text-slate-350 hover:bg-[#1C2633] hover:border-slate-700"
      : "bg-white border-[#E4E2DB] text-stone-800 hover:bg-stone-50 hover:border-stone-400 font-medium";
  };

  const labelClass = isTwilightMode ? "text-slate-300 font-bold" : "text-stone-800 font-semibold";

  const renderStepContent = () => {
    switch (step) {
      case 0:
        return (
          <div id="step-0-mobility" className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="commuteMethod" className={`block text-xs uppercase tracking-widest ${labelClass}`}>
                Primary Commute Method
              </label>
              <div id="commuteMethod-group" className="grid grid-cols-1 sm:grid-cols-2 gap-3" role="group">
                {[
                  { id: "none", label: "No Commute / Work From Home" },
                  { id: "active", label: "Active Way (Walking or Cycling) 🚲" },
                  { id: "public_transit", label: "Public Transport (Train, Bus) 🚇" },
                  { id: "car_ev", label: "Electric Vehicle (EV) ⚡" },
                  { id: "car_hybrid", label: "Hybrid Automobile 🚗" },
                  { id: "car_gas", label: "Traditional Gasoline Car ⛽" },
                ].map((opt) => (
                  <button
                    key={opt.id}
                    id={`btn-commute-${opt.id}`}
                    type="button"
                    onClick={() => updateSubField("transportation", "commuteMethod", opt.id)}
                    className={`px-4 py-3 text-left text-sm rounded-xl border transition-all min-h-[50px] focus:outline-none ${buttonStyleFor("transportation", "commuteMethod", opt.id)}`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {answers.transportation.commuteMethod !== "none" && (
              <div id="commuteMiles-wrapper" className="space-y-2 bg-stone-100/50 dark:bg-black/15 p-4 rounded-xl">
                <div className="flex justify-between text-xs font-semibold uppercase tracking-wider">
                  <label htmlFor="commuteMiles" className={labelClass}>Weekly Commute Distance</label>
                  <span className={`${isTwilightMode ? "text-amber-300" : "text-emerald-800"} font-mono font-black`}>
                    {answers.transportation.commuteMiles} miles
                  </span>
                </div>
                <input
                  id="commuteMiles"
                  type="range"
                  min="0"
                  max="400"
                  step="10"
                  value={answers.transportation.commuteMiles}
                  onChange={(e) =>
                    updateSubField("transportation", "commuteMiles", parseInt(e.target.value))
                  }
                  className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-700"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                  <span>0 mi</span>
                  <span>100 mi</span>
                  <span>200 mi</span>
                  <span>400+ mi</span>
                </div>
              </div>
            )}

            <div className="space-y-2">
              <label htmlFor="flightsLength" className={`block text-xs uppercase tracking-widest ${labelClass}`}>
                Annual Plane Flights Intake
              </label>
              <div id="flights-group" className="grid grid-cols-2 sm:grid-cols-5 gap-2" role="group">
                {[
                  { id: "none", label: "None 🚫" },
                  { id: "short", label: "1-2 Short" },
                  { id: "medium", label: "3-5 Med" },
                  { id: "long", label: "1-2 Long" },
                  { id: "frequent", label: "Frequent" },
                ].map((opt) => (
                  <button
                    key={opt.id}
                    id={`btn-flights-${opt.id}`}
                    type="button"
                    onClick={() => updateSubField("transportation", "flightsLength", opt.id)}
                    className={`px-1 py-3.5 text-center text-xs font-bold rounded-xl border transition-all min-h-[46px] focus:outline-none ${buttonStyleFor("transportation", "flightsLength", opt.id)}`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      case 1:
        return (
          <div id="step-1-nourishment" className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="dietType" className={`block text-xs uppercase tracking-widest ${labelClass}`}>
                Primary Dietary Habit
              </label>
              <div id="diet-group" className="grid grid-cols-1 sm:grid-cols-5 gap-2" role="group">
                {[
                  { id: "heavy_meat", title: "Heavy Meat", desc: "Red meat daily" },
                  { id: "balanced", title: "Balanced", desc: "Mixed meat/veg" },
                  { id: "low_meat", title: "Low Meat", desc: "Poultry & fish mostly" },
                  { id: "vegetarian", title: "Vegetarian 🥦", desc: "No meat, eats dairy" },
                  { id: "vegan", title: "Vegan 🌱", desc: "100% plant-sourced" },
                ].map((opt) => (
                  <button
                    key={opt.id}
                    id={`btn-diet-${opt.id}`}
                    type="button"
                    onClick={() => updateSubField("food", "dietType", opt.id)}
                    className={`p-3 text-center rounded-xl border transition-all min-h-[70px] flex flex-col justify-center items-center focus:outline-none ${buttonStyleFor("food", "dietType", opt.id)}`}
                  >
                    <span className="text-xs font-bold block">{opt.title}</span>
                    <span className="text-[9px] opacity-75 block mt-0.5 leading-tight">{opt.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="organicLocal" className={`block text-xs uppercase tracking-widest ${labelClass}`}>
                  Organic & Local Procurement
                </label>
                <div id="organic-group" className="grid grid-cols-3 gap-2" role="group">
                  {[
                    { id: "rarely", label: "Rarely 🛒" },
                    { id: "sometimes", label: "Sometimes" },
                    { id: "mostly", label: "Mostly local" },
                  ].map((opt) => (
                    <button
                      key={opt.id}
                      id={`btn-org-${opt.id}`}
                      type="button"
                      onClick={() => updateSubField("food", "organicLocal", opt.id)}
                      className={`px-1 py-3 text-xs font-bold rounded-xl border transition-all min-h-[44px] focus:outline-none ${buttonStyleFor("food", "organicLocal", opt.id)}`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="foodWaste" className={`block text-xs uppercase tracking-widest ${labelClass}`}>
                  Household Food Waste Rate
                </label>
                <div id="waste-group" className="grid grid-cols-3 gap-2" role="group">
                  {[
                    { id: "low", label: "Very Low 🗑️" },
                    { id: "medium", label: "Moderate" },
                    { id: "high", label: "High Discard" },
                  ].map((opt) => (
                    <button
                      key={opt.id}
                      id={`btn-waste-${opt.id}`}
                      type="button"
                      onClick={() => updateSubField("food", "foodWaste", opt.id)}
                      className={`px-1 py-3 text-xs font-bold rounded-xl border transition-all min-h-[44px] focus:outline-none ${buttonStyleFor("food", "foodWaste", opt.id)}`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div id="step-2-shelter" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="homeSize" className={`block text-xs uppercase tracking-widest ${labelClass}`}>
                  Sanctuary Grid Footprint
                </label>
                <div id="homesize-group" className="grid grid-cols-1 gap-2" role="group">
                  {[
                    { id: "apartment", label: "Apartment / Studio" },
                    { id: "townhouse", label: "Townhouse / Duplex" },
                    { id: "house_medium", label: "Medium Single Family" },
                    { id: "house_large", label: "Large Multi-Floor House" },
                  ].map((opt) => (
                    <button
                      key={opt.id}
                      id={`btn-home-${opt.id}`}
                      type="button"
                      onClick={() => updateSubField("energy", "homeSize", opt.id)}
                      className={`px-4 py-3 text-left text-sm rounded-xl border transition-all min-h-[44px] focus:outline-none ${buttonStyleFor("energy", "homeSize", opt.id)}`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="heatingSource" className={`block text-xs uppercase tracking-widest ${labelClass}`}>
                  Main Thermal Heating Source
                </label>
                <div id="heat-group" className="grid grid-cols-1 gap-2" role="group">
                  {[
                    { id: "gas", label: "Fossil Gas Furnace" },
                    { id: "electric", label: "Standard Electric Heater" },
                    { id: "heat_pump", label: "Highly-Efficient Heat Pump" },
                    { id: "renewable", label: "Solar or Geothermal active" },
                  ].map((opt) => (
                    <button
                      key={opt.id}
                      id={`btn-heat-${opt.id}`}
                      type="button"
                      onClick={() => updateSubField("energy", "heatingSource", opt.id)}
                      className={`px-4 py-3 text-left text-sm rounded-xl border transition-all min-h-[44px] focus:outline-none ${buttonStyleFor("energy", "heatingSource", opt.id)}`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Checkbox for Green Power */}
            <div
              id="green-power-toggle"
              onClick={() => updateSubField("energy", "greenElectricity", !answers.energy.greenElectricity)}
              className={`p-4 rounded-xl border cursor-pointer flex justify-between items-center transition-all ${
                answers.energy.greenElectricity
                  ? isTwilightMode ? "bg-amber-500/10 border-amber-400 text-amber-300 font-bold" : "bg-emerald-50/70 border-emerald-400 text-slate-800 font-bold shadow-sm"
                  : isTwilightMode ? "bg-[#161D26] border-[#232A31] text-slate-400" : "bg-white border-[#E4E2DB] text-stone-600 hover:border-stone-400"
              }`}
            >
              <div>
                <span className="font-bold text-sm block">Renewable Power Subscription ☀️</span>
                <span className="text-xs opacity-85 block">Your house standard draws from solar, wind or certificates</span>
              </div>
              <div
                className={`w-11 h-6 rounded-full p-0.5 transition-all duration-300 ${
                  answers.energy.greenElectricity ? "bg-emerald-600" : "bg-stone-300 dark:bg-slate-700"
                }`}
              >
                <div
                  className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-all duration-300 ${
                    answers.energy.greenElectricity ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div id="step-3-consumption" className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="purchaseFrequency" className={`block text-xs uppercase tracking-widest ${labelClass}`}>
                Frequency of Newly Sourced Items
              </label>
              <div id="retail-group" className="grid grid-cols-1 gap-2" role="group">
                {[
                  { id: "minimal", label: "Minimalist (Sparing purchases, longevity mindset)" },
                  { id: "moderate", label: "Moderate (Occasional style, devices if vital)" },
                  { id: "frequent", label: "Recreational shopper (Regular monthly items)" },
                  { id: "excessive", label: "Fast Fashion & Rapid Retail (Weekly courier bundles)" },
                ].map((opt) => (
                  <button
                    key={opt.id}
                    id={`btn-purchase-${opt.id}`}
                    type="button"
                    onClick={() => updateSubField("shopping", "purchaseFrequency", opt.id)}
                    className={`px-4 py-3 text-left text-sm rounded-xl border transition-all min-h-[44px] focus:outline-none ${buttonStyleFor("shopping", "purchaseFrequency", opt.id)}`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="secondHand" className={`block text-xs uppercase tracking-widest ${labelClass}`}>
                Second-Hand, Vintage, or Restored Sourcing Preference
              </label>
              <div id="secondhand-group" className="grid grid-cols-4 gap-2" role="group">
                {[
                  { id: "never", label: "Never ❌" },
                  { id: "sometimes", label: "Sometimes" },
                  { id: "often", label: "Often ✨" },
                  { id: "always", label: "Always ♻️" },
                ].map((opt) => (
                  <button
                    key={opt.id}
                    id={`btn-sh-${opt.id}`}
                    type="button"
                    onClick={() => updateSubField("shopping", "secondHand", opt.id)}
                    className={`px-1 py-3 text-center text-xs font-bold rounded-xl border transition-all min-h-[44px] focus:outline-none ${buttonStyleFor("shopping", "secondHand", opt.id)}`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div id="step-4-waste" className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="recyclingLevel" className={`block text-xs uppercase tracking-widest ${labelClass}`}>
                Recycling sorting rigor
              </label>
              <div id="recycling-group" className="grid grid-cols-3 gap-2" role="group">
                {[
                  { id: "none", label: "None / Single Trash Bin" },
                  { id: "partial", label: "Partial separation" },
                  { id: "complete", label: "Extremely meticulous sorting ♻️" },
                ].map((opt) => (
                  <button
                    key={opt.id}
                    id={`btn-rcy-${opt.id}`}
                    type="button"
                    onClick={() => updateSubField("waste", "recyclingLevel", opt.id)}
                    className={`px-1 py-3 text-center text-xs font-bold rounded-xl border transition-all min-h-[50px] focus:outline-none ${buttonStyleFor("waste", "recyclingLevel", opt.id)}`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="singleUsePlastics" className={`block text-xs uppercase tracking-widest ${labelClass}`}>
                Single-Use Plastics Frequency
              </label>
              <div id="plastics-group" className="grid grid-cols-3 gap-2" role="group">
                {[
                  { id: "minimal", label: "Minimal (Reusable cups-only) 🥤" },
                  { id: "moderate", label: "Moderate (Occasional takeouts)" },
                  { id: "high", label: "High (Bottled fluids daily) 🧴" },
                ].map((opt) => (
                  <button
                    key={opt.id}
                    id={`btn-plastic-${opt.id}`}
                    type="button"
                    onClick={() => updateSubField("waste", "singleUsePlastics", opt.id)}
                    className={`px-1 py-3.5 text-center text-xs font-bold rounded-xl border transition-all min-h-[50px] focus:outline-none ${buttonStyleFor("waste", "singleUsePlastics", opt.id)}`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <div
              id="composting-toggle"
              onClick={() => updateSubField("waste", "composting", !answers.waste.composting)}
              className={`p-4 rounded-xl border cursor-pointer flex justify-between items-center transition-all ${
                answers.waste.composting
                  ? isTwilightMode ? "bg-amber-500/10 border-amber-400 text-amber-300 font-bold" : "bg-emerald-50/70 border-emerald-400 text-slate-800 font-bold shadow-sm"
                  : isTwilightMode ? "bg-[#161D26] border-[#232A31] text-slate-400" : "bg-white border-[#E4E2DB] text-stone-600 hover:border-stone-400"
              }`}
            >
              <div>
                <span className="font-bold text-sm block">Domestic Food Composting 🌱</span>
                <span className="text-xs opacity-85 block">Organic kitchen wastes are safely turned, reducing terminal landfills methane gas</span>
              </div>
              <div
                className={`w-11 h-6 rounded-full p-0.5 transition-all duration-300 ${
                  answers.waste.composting ? "bg-emerald-600" : "bg-stone-300 dark:bg-slate-700"
                }`}
              >
                <div
                  className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-all duration-300 ${
                    answers.waste.composting ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  // Rendering of the Cinematic Creation Sequence after completing questions (Signature moment)
  if (cinematicStep >= 0) {
    const cinematicPhases = [
      { text: "Reading your unique parameters...", icon: "📖" },
      { text: "Understanding your lifestyle carbon habits...", icon: "🧠" },
      { text: "Bathing atmosphere with solar sunlight...", icon: "☀️" },
      { text: "Sprouting pristine virtual forest canopies...", icon: "🌲" },
      { text: "Reintroducing local avian families and wildlife...", icon: "🐦" },
    ];

    const currentPhaseMsg = cinematicPhases[Math.min(cinematicStep, cinematicPhases.length - 1)];

    return (
      <div
        id="conversational-cinematic-pane"
        className={`w-full max-w-4xl mx-auto rounded-3xl border px-8 py-20 text-center shadow-xl flex flex-col items-center justify-center space-y-8 transition-all duration-500 bg-gradient-to-b ${
          isTwilightMode 
            ? "from-[#0F141C] via-[#101925] to-[#0A0D14] border-[#232A31]" 
            : "from-[#FCFAF6] via-[#EFECE6] to-[#E5E0D5] border-[#E4E2DB]"
        }`}
      >
        <motion.div
          key={`cinematic-icon-${cinematicStep}`}
          initial={{ scale: 0.3, rotate: -40, opacity: 0 }}
          animate={{ scale: 1, rotate: 0, opacity: 1 }}
          exit={{ scale: 1.4, opacity: 0 }}
          className="text-7xl block drop-shadow-[0_10px_15px_rgba(0,0,0,0.15)] filter"
        >
          {currentPhaseMsg.icon}
        </motion.div>

        <div className="space-y-3.5">
          <span className={`text-[10px] font-bold tracking-widest uppercase block ${
            isTwilightMode ? "text-amber-400" : "text-emerald-800"
          }`}>
            GreenEarthAI Signature Sequence
          </span>
          <motion.h2 
            key={`cinematic-text-${cinematicStep}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`text-2xl md:text-3xl font-black font-sans tracking-tight min-h-[40px] ${
              isTwilightMode ? "text-[#EBF1FA]" : "text-[#2B3545]"
            }`}
          >
            {currentPhaseMsg.text}
          </motion.h2>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Please pause while GreenEarthAI constructs your live, dynamic Personal Earth representation. Every answer you gave has actively shaped this environment.
          </p>
        </div>

        {/* Cinematic circular or linear loading visual */}
        <div className="w-64 h-2 bg-stone-200/50 dark:bg-black/20 rounded-full overflow-hidden relative">
          <motion.div
            className="h-full bg-emerald-600 rounded-full"
            initial={{ width: "0%" }}
            animate={{ width: `${((cinematicStep + 1) / cinematicPhases.length) * 100}%` }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
          />
        </div>

        <div className="flex gap-2">
          {cinematicPhases.map((_, idx) => (
            <div
              key={`dot-${idx}`}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                idx === cinematicStep 
                  ? "bg-amber-400 scale-125 shadow-[0_0_8px_#FBBF24]" 
                  : idx < cinematicStep 
                  ? "bg-emerald-600" 
                  : "bg-stone-300 dark:bg-stone-800"
              }`}
            />
          ))}
        </div>
      </div>
    );
  }

  // Normal loading panel
  if (isLoading) {
    return (
      <div
        id="conversational-loading-pane"
        className={`w-full max-w-2xl mx-auto rounded-3xl border px-8 py-14 text-center shadow-lg flex flex-col items-center justify-center space-y-6 transition-all duration-500 ${
          isTwilightMode ? "bg-[#12181F] border-[#232A31]" : "bg-[#FCFAF6] border-[#E4E2DB]"
        }`}
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          className="p-4 bg-emerald-700/10 rounded-full text-emerald-600 animate-pulse"
        >
          <Sparkles className="w-10 h-10" />
        </motion.div>

        <div className="space-y-2">
          <h2 className={`text-xl font-bold font-sans ${isTwilightMode ? "text-stone-100" : "text-stone-900"}`}>
            Scribing Your Living Sanctuary...
          </h2>
          <p className="text-sm text-slate-400 max-w-sm mx-auto leading-relaxed">
            Our AI engine is evaluating your answers to generate your Personal Earth configurations, metrics, and custom transition milestones.
          </p>
        </div>

        <div className="w-48 h-1 bg-slate-200 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-emerald-600"
            animate={{ x: [-120, 120] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
      </div>
    );
  }

  const currentInfo = stepsInfo[step];

  // Logic to calculate values for the "Reactive Onboarding Earth Visualizer" on the right side
  const computeReactiveEarthAttributes = () => {
    let trees = 1;
    let birds = false;
    let atmosphere = "moderate";
    let sunlight = "normal";

    const comm = answers.transportation.commuteMethod;
    if (comm === "active" || comm === "public_transit") {
      atmosphere = "pristine";
    } else if (comm === "car_gas") {
      atmosphere = "smoggy";
    }

    const diet = answers.food.dietType;
    if (diet === "vegetarian" || diet === "vegan") {
      birds = true;
    }

    if (answers.energy.greenElectricity) {
      sunlight = "brilliant";
    }

    if (answers.shopping.purchaseFrequency === "minimal") {
      trees += 2;
    }
    if (answers.waste.composting) {
      trees += 2;
    }
    if (answers.waste.recyclingLevel === "complete") {
      trees += 1;
    }

    return { trees, birds, atmosphere, sunlight };
  };

  const reactiveEarth = computeReactiveEarthAttributes();

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      {/* Resume Assessment Banner */}
      {hasSavedState && (
        <div id="resume-later-banner" className={`p-4 rounded-2xl border flex flex-col sm:flex-row items-center justify-between gap-4 transition-all ${
          isTwilightMode ? "bg-[#1E2530] border-amber-400/30" : "bg-emerald-50 border-emerald-300"
        }`}>
          <div className="flex items-center gap-3">
            <AlertCircle className={`w-5 h-5 shrink-0 ${isTwilightMode ? "text-amber-400" : "text-emerald-700"}`} />
            <div>
              <p className={`text-xs font-bold ${isTwilightMode ? "text-slate-100" : "text-emerald-950"}`}>
                Unfinished GreenEarthAI Assessment Detected
              </p>
              <p className="text-[11px] text-slate-400">
                You have a saved companion calibration draft. Resume now, or start fresh.
              </p>
            </div>
          </div>
          <div className="flex gap-2 shrink-0">
            <button
              onClick={handleResume}
              className={`px-4 py-1.5 text-xs font-bold rounded-lg cursor-pointer flex items-center gap-1 shadow-sm transition-all ${
                isTwilightMode ? "bg-amber-400 text-stone-900 font-extrabold hover:bg-amber-300" : "bg-emerald-700 text-white hover:bg-emerald-800"
              }`}
            >
              Resume Assessment
            </button>
            <button
              onClick={handleStartFresh}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg cursor-pointer flex items-center gap-1 transition-all text-slate-400 hover:text-slate-200 border ${
                isTwilightMode ? "border-[#232A31] hover:bg-[#161D26]" : "border-stone-200 hover:bg-stone-100"
              }`}
            >
              Start Fresh
            </button>
          </div>
        </div>
      )}

      {/* Splitted Interface: Left for Question Wizard, Right for Reactive Live Earth Visual */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Left Side: Onboarding card */}
        <div
          id="conversational-assessment-box"
          className={`lg:col-span-7 rounded-3xl border p-6 md:p-8 shadow-xl relative transition-all duration-500 flex flex-col justify-between ${
            isTwilightMode ? "bg-[#0F141C]/90 border-[#232A31] text-stone-100" : "bg-[#FCFAF6]/90 border-[#E4E2DB] text-stone-900"
          }`}
        >
          <div>
            {/* Header / Continuous elegant linear progress bar */}
            <div id="assessment-steps-header" className="space-y-3 mb-6">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-widest text-[#9A9892]">
                  Parameter {step + 1} of 5
                </span>
                <button
                  onClick={handleSaveProgress}
                  type="button"
                  className={`text-xs flex items-center gap-1.5 font-medium transition-colors hover:text-emerald-600 ${
                    isTwilightMode ? "text-slate-400" : "text-stone-500"
                  }`}
                  title="Save assessment state to finish later"
                >
                  <Save className="w-3.5 h-3.5" /> Save progress
                </button>
              </div>

              {/* Polished continuous visual progress line */}
              <div className="w-full h-1.5 bg-stone-200 dark:bg-stone-850 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-emerald-650 tracking-wide transition-all duration-300"
                  style={{ width: `${((step + 1) / 5) * 100}%` }}
                />
              </div>
            </div>

            <div id="assessment-content-question" className="space-y-1 mb-6">
              <h3 className={`text-[11px] font-extrabold uppercase tracking-widest ${
                isTwilightMode ? "text-amber-400" : "text-emerald-800"
              }`}>
                {currentInfo?.title}
              </h3>
              <h2 className="text-2xl font-black font-sans tracking-tight leading-tight">
                {currentInfo?.question}
              </h2>
              <p className="text-xs italic text-slate-400 leading-normal pt-1">
                {currentInfo?.description}
              </p>
            </div>

            <div id="assessment-form-container" className="min-h-[220px] mb-8">
              <AnimatePresence mode="wait">
                <motion.div
                  key={`step-${step}`}
                  initial={{ opacity: 0, x: 8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -8 }}
                  transition={{ duration: 0.2 }}
                >
                  {renderStepContent()}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Symmetrical Action Wizard control row */}
          <div id="assessment-navigation-controls" className="flex justify-between items-center border-t border-slate-200/20 pt-5 mt-auto">
            <button
              id="btn-prev-step"
              type="button"
              onClick={handlePrev}
              disabled={step === 0}
              className={`px-4 py-2.5 rounded-xl border flex items-center gap-2 text-sm font-bold transition-all min-h-[44px] ${
                step === 0
                  ? "opacity-30 cursor-not-allowed"
                  : isTwilightMode ? "border-[#232A31] text-slate-300 bg-[#161D26] hover:bg-[#1C2530]" : "border-[#E4E2DB] text-stone-700 bg-white hover:bg-stone-50"
              }`}
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </button>

            {showsSavedNotification && (
              <span className="text-xs font-mono font-bold text-emerald-600 animate-pulse">
                ✓ Draft Auto-Saved
              </span>
            )}

            <button
              id="btn-next-step"
              type="button"
              onClick={handleNext}
              className="px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 font-bold text-sm text-stone-100 flex items-center gap-2 active:scale-95 shadow-md transition-all cursor-pointer min-h-[44px]"
            >
              {step === 4 ? "Complete reflection" : "Next"} <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Right Side: Reactive Mini-Earth display "My Personal Earth reacting" */}
        <div
          id="reactive-onboarding-earth-visual"
          className={`lg:col-span-5 rounded-3xl border p-6 shadow-xl relative overflow-hidden transition-all duration-500 flex flex-col justify-between ${
            isTwilightMode ? "bg-[#0F141C]/90 border-[#232A31] text-stone-100" : "bg-[#FCFAF6]/90 border-[#E4E2DB] text-stone-900"
          }`}
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-stone-200/20 pb-3">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest block text-slate-400">
                  Real-Time Projection
                </span>
                <span className="text-sm font-extrabold tracking-tight">
                  Your Personal Earth
                </span>
              </div>
              <div className="flex gap-1.5">
                <span className="w-2.5 h-2.5 bg-brand rounded-full bg-emerald-500 animate-ping" />
                <span className="text-[10px] font-bold font-mono uppercase bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-400 px-2 py-0.5 rounded">
                  Active Reaction
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-normal">
              Every habit you share changes this environment instantly. Watch vegetation shoot up, skies clear, and local birds appear as your lifestyle choices map into GreenEarthAI's living model.
            </p>

            {/* Simulated mini CSS/SVG Earth circle canvas */}
            <div className="relative w-full h-56 flex items-center justify-center pt-2">
              
              {/* Dynamic Atmospheric Sky Circle */}
              <div className={`w-48 h-48 rounded-full border border-dashed flex items-center justify-center transition-all duration-700 p-2 ${
                reactiveEarth.atmosphere === "pristine"
                  ? "bg-gradient-to-tr from-sky-400 via-emerald-100 to-amber-200 border-sky-400/40"
                  : reactiveEarth.atmosphere === "smoggy"
                  ? "bg-gradient-to-tr from-amber-700 via-[#4A3B32] to-stone-800 border-orange-500/30"
                  : "bg-gradient-to-tr from-[#90A4AE] via-emerald-50 to-[#CFD8DC] border-stone-300 dark:border-stone-800"
              }`}>
                
                {/* Visual content of Earth Biome Center */}
                <div className="relative w-40 h-40 rounded-full overflow-hidden flex flex-col justify-end bg-gradient-to-b from-[#80DEEA] via-[#E0F7FA] to-[#C8E6C9] p-3 shadow-inner">
                  
                  {/* Sunny celestial light flare */}
                  <motion.div
                    className={`absolute top-4 right-4 rounded-full transition-all duration-[1000ms] ${
                      reactiveEarth.sunlight === "brilliant"
                        ? "w-12 h-12 bg-yellow-300 blur-[2px] shadow-[0_0_20px_#FBBF24,inset_-2px_-2px_0px_#F59E0B]"
                        : "w-8 h-8 bg-amber-100 shadow-[0_0_8px_white]"
                    }`}
                    animate={{ rotate: 360 }}
                    transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                  />

                  {/* Atmospheric particle clouds floating */}
                  {reactiveEarth.atmosphere === "smoggy" ? (
                    <motion.div 
                      className="absolute inset-0 bg-[#3E2723]/35 backdrop-blur-[0.5px] z-10 flex flex-col items-center justify-center"
                      animate={{ opacity: [0.6, 0.8, 0.6] }}
                      transition={{ duration: 4, repeat: Infinity }}
                    >
                      <Cloud className="w-8 h-8 text-amber-900 opacity-60 animate-bounce" />
                      <span className="text-[7.5px] font-mono uppercase bg-black text-white px-1.5 rounded tracking-widest mt-1">
                        CARBON BLANKET
                      </span>
                    </motion.div>
                  ) : reactiveEarth.atmosphere === "pristine" ? (
                    <div className="absolute inset-x-0 top-10 flex justify-center z-10">
                      <div className="flex gap-1.5 text-[10px] animate-pulse">
                        <span>✨</span>
                        <span>❇️</span>
                        <span>✨</span>
                      </div>
                    </div>
                  ) : null}

                  {/* Ground grass layer */}
                  <div className="w-full h-16 bg-[#a1887f] dark:bg-[#7d665b] relative rounded-b-full flex flex-col justify-end p-2 border-t-4 border-[#33691E]/30">
                    <div className="absolute inset-0 bg-[#689F38]/40 blur-[1px] rounded-b-full" />
                    
                    {/* Rendered Forest saplings reacting */}
                    <div className="flex justify-around items-end relative z-10 overflow-visible min-h-[40px] px-2">
                      {[...Array(reactiveEarth.trees)].map((_, idx) => (
                        <motion.div
                          key={`mini-tree-${idx}`}
                          initial={{ scale: 0, y: 15 }}
                          animate={{ scale: 1, y: 0 }}
                          className="flex flex-col items-center flex-shrink-0"
                          title="Growing Tree represents your low carbon pledges"
                        >
                          <TreePine className="w-6 h-6 text-emerald-800 drop-shadow-sm" />
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Reactive Wildlife Birds representing vegan/vegetarian decisions */}
                  {reactiveEarth.birds && (
                    <motion.div 
                      className="absolute top-12 left-6 z-10"
                      animate={{ y: [0, -8, 0], x: [0, 4, 0] }}
                      transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
                    >
                      <div className="flex flex-col items-center justify-center text-center">
                        <Bird className="w-5 h-5 text-[#0D47A1]" />
                        <span className="text-[7px] font-mono bg-blue-100 text-[#0D47A1] rounded px-1 scale-90">Diet Birder</span>
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>
            </div>

            {/* Custom Interactive Reaction Guide Indicator Cards */}
            <div className={`p-4 rounded-2xl border ${
              isTwilightMode ? "bg-[#161D26] border-[#232A31]" : "bg-stone-50 border-[#E4E2DB]"
            }`}>
              <h5 className="text-[10px] uppercase tracking-widest font-bold text-slate-400 mb-2">
                Reaction Checklist Map
              </h5>
              <div className="grid grid-cols-2 gap-2 text-[10px]">
                <div className={`flex items-center gap-1.5 py-1 ${answers.transportation.commuteMethod === "active" || answers.transportation.commuteMethod === "public_transit" ? "text-emerald-600 font-bold" : "text-stone-400"}`}>
                  <span className="text-sm">🚇</span> cleaner atmosphere
                </div>
                <div className={`flex items-center gap-1.5 py-1 ${reactiveEarth.birds ? "text-emerald-600 font-bold" : "text-stone-400"}`}>
                  <span className="text-sm">🐦</span> birds appear (vegan/veg)
                </div>
                <div className={`flex items-center gap-1.5 py-1 ${answers.energy.greenElectricity ? "text-emerald-600 font-bold" : "text-stone-400"}`}>
                  <span className="text-sm">☀️</span> brighter sunlight (solar)
                </div>
                <div className={`flex items-center gap-1.5 py-1 ${reactiveEarth.trees > 1 ? "text-emerald-600 font-bold" : "text-stone-400"}`}>
                  <span className="text-sm">🌲</span> lush forest canopies
                </div>
              </div>
            </div>
          </div>

          <div className="text-center pt-4 border-t border-stone-200/20 text-[10px] text-slate-400 italic font-serif">
            &ldquo;Every positive ecosystem response reflects your personal sustainability progression.&rdquo;
          </div>
        </div>

      </div>
    </div>
  );
}
