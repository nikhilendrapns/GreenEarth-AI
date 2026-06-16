import { AssessmentAnswers, UserSessionState, CarbonReflection, Intervention, DailyMission } from "../../types/index";

/**
 * Programmatic Carbon Scoring & Calibration Engine
 */

export interface SectorBreakdown {
  transportation: number;
  food: number;
  energy: number;
  shopping: number;
  waste: number;
}

/**
 * Calculates current real-time carbon score after pledges / adopted interventions are subtracted
 */
export function calculateSimulatedScore(state: UserSessionState): number {
  if (!state.reflection) return 0;
  let base = state.reflection.estimatedTotalCO2;
  const interventions = state.reflection.interventions || [];
  interventions.forEach((item) => {
    if (state.adoptedInterventions && state.adoptedInterventions.includes(item.actionId)) {
      base = Math.max(0.5, base - item.co2Savings);
    }
  });
  return Math.round(base * 10) / 10;
}

/**
 * Calculates projected future carbon score based on a slide-reform progression input
 */
export function calculateFuturisticSimulationScore(state: UserSessionState, simulationPercent: number): number {
  if (!state.reflection) return 0;
  const base = state.reflection.estimatedTotalCO2;
  const interventions = state.reflection.interventions || [];
  const totalPotential = interventions.reduce((sum, item) => sum + item.co2Savings, 0);
  const reductionAmount = (totalPotential * simulationPercent) / 100;
  return Math.max(0.5, Math.round((base - reductionAmount) * 10) / 10);
}

/**
 * Translates carbon score into ecosystem mood taxonomy
 */
export function getEcosystemMood(score: number): "Lush Garden" | "Recovering Biome" | "Dimmed Forest" {
  if (score <= 6) return "Lush Garden";
  if (score > 14) return "Dimmed Forest";
  return "Recovering Biome";
}

/**
 * Standalone programmatic scoring fallback when the Gemini API is offline
 */
export function getProgrammaticAssessment(answers: AssessmentAnswers): CarbonReflection {
  const t = (answers.transportation || {}) as any;
  const f = (answers.food || {}) as any;
  const e = (answers.energy || {}) as any;
  const s = (answers.shopping || {}) as any;
  const w = (answers.waste || {}) as any;

  // Transportation CO2 tons calculating
  let transCO2 = 1.2;
  const miles = Number(t.commuteMiles) || 0;
  
  if (t.commuteMethod === "car") {
    transCO2 += (miles * 52 * 0.4) / 1000;
  } else if (t.commuteMethod === "hybrid") {
    transCO2 += (miles * 52 * 0.2) / 1000;
  } else if (t.commuteMethod === "ev") {
    transCO2 += (miles * 52 * 0.08) / 1000;
  } else if (t.commuteMethod === "public") {
    transCO2 += (miles * 52 * 0.12) / 1000;
  }
  
  if (t.flightsLength === "heavily") {
    transCO2 += 6.5;
  } else if (t.flightsLength === "sometimes") {
    transCO2 += 2.2;
  } else if (t.flightsLength === "rarely") {
    transCO2 += 0.8;
  }

  // Food CO2 tons
  let foodCO2 = 1.0;
  if (f.dietType === "Meat-rich") {
    foodCO2 += 2.3;
  } else if (f.dietType === "Balanced") {
    foodCO2 += 1.1;
  } else if (f.dietType === "Vegetarian") {
    foodCO2 += 0.4;
  } else if (f.dietType === "Vegan") {
    foodCO2 += 0.1;
  }
  
  if (f.organicLocal === "Never") {
    foodCO2 += 0.4;
  } else if (f.organicLocal === "Sometimes") {
    foodCO2 += 0.2;
  }
  
  if (f.foodWaste === "High") {
    foodCO2 += 0.5;
  } else if (f.foodWaste === "Medium") {
    foodCO2 += 0.25;
  }

  // Energy CO2 tons
  let energyCO2 = 0.5;
  if (e.homeSize === "Large Mansion") {
    energyCO2 += 4.5;
  } else if (e.homeSize === "Medium Suburban") {
    energyCO2 += 2.5;
  } else if (e.homeSize === "Apartment") {
    energyCO2 += 1.0;
  }
  
  if (e.heatingSource === "Gas") {
    energyCO2 += 1.2;
  } else if (e.heatingSource === "Coal") {
    energyCO2 += 2.2;
  } else if (e.heatingSource === "Electric") {
    energyCO2 += 0.6;
  }
  
  if (e.greenElectricity) {
    energyCO2 *= 0.15;
  }

  // Shopping CO2 tons
  let shoppingCO2 = 0.4;
  if (s.purchaseFrequency === "heavily") {
    shoppingCO2 += 2.1;
  } else if (s.purchaseFrequency === "Moderate") {
    shoppingCO2 += 1.0;
  }
  
  if (s.secondHand === "Never") {
    shoppingCO2 += 0.4;
  } else if (s.secondHand === "Sometimes") {
    shoppingCO2 += 0.2;
  }

  // Waste CO2 tons
  let wasteCO2 = 0.3;
  if (w.recyclingLevel === "None") {
    wasteCO2 += 0.6;
  } else if (w.recyclingLevel === "Partial") {
    wasteCO2 += 0.3;
  }
  
  if (!w.composting) {
    wasteCO2 += 0.20;
  }
  
  if (w.singleUsePlastics === "heavily") {
    wasteCO2 += 0.3;
  } else if (w.singleUsePlastics === "Moderate") {
    wasteCO2 += 0.15;
  }

  // Round values
  transCO2 = Math.round(transCO2 * 10) / 10;
  foodCO2 = Math.round(foodCO2 * 10) / 10;
  energyCO2 = Math.round(energyCO2 * 10) / 10;
  shoppingCO2 = Math.round(shoppingCO2 * 10) / 10;
  wasteCO2 = Math.round(wasteCO2 * 10) / 10;

  const estimatedTotalCO2 = Math.round((transCO2 + foodCO2 + energyCO2 + shoppingCO2 + wasteCO2) * 10) / 10;

  // Find max contributor
  const breakdown: SectorBreakdown = {
    transportation: transCO2,
    food: foodCO2,
    energy: energyCO2,
    shopping: shoppingCO2,
    waste: wasteCO2,
  };

  let maxCat = "transportation";
  let maxVal = transCO2;
  if (foodCO2 > maxVal) { maxCat = "food"; maxVal = foodCO2; }
  if (energyCO2 > maxVal) { maxCat = "energy"; maxVal = energyCO2; }
  if (shoppingCO2 > maxVal) { maxCat = "shopping"; maxVal = shoppingCO2; }
  if (wasteCO2 > maxVal) { maxCat = "waste"; maxVal = wasteCO2; }

  let title = "The Conscious Urbanite";
  let description = "You maintain a mindful awareness of your footprint with strong foundations in low-waste habits, yet room to optimize high-impact areas like transit and energy.";
  let dominantHabit = "Home Energy & Climate Control";
  let contributorExplanation = "Residential heating and appliance usage are primary grid draws representing carbon footprint overhead. Offsetting with insulation or smart thermostats reduces this easily.";

  if (maxCat === "transportation") {
    title = "The High-Flyer Navigator";
    description = "Your heavy reliance on road commutes or multiple long-range air travel flights is the principal driver of your footprint. Every effort to group journeys or utilize active transport heals this rapidly.";
    dominantHabit = "High Transit Emissions";
    contributorExplanation = "Internal combustion commuting or commercial airplanes release major metric ton fractions of hydrocarbons. Public or active choices create immediate relief.";
  } else if (maxCat === "food") {
    title = "The Meat-Rich Connoisseur";
    description = "A strong palette for livestock-based products or heavy food packaging drives food carbon indicators up. Transitioning locally or using seasonal products heals your biome soils immediately.";
    dominantHabit = "Agricultural Demand footprint";
    contributorExplanation = "Livestock agriculture demands significant methane buffers and vast land resources. Shifting just some meals per week to organic plants significantly minimizes this.";
  } else if (maxCat === "shopping") {
    title = "The Modern Retail Voyager";
    description = "New material acquisitions and high rate fashion consumption represent latent greenhouse emissions in manufacturing and packaging networks.";
    dominantHabit = "Manufacturing Consumerism";
    contributorExplanation = "Sourcing pristine items entails international pipeline shipping. Second-hand loops represent zero net additions.";
  } else if (maxCat === "waste") {
    title = "The Single-Use Enthusiast";
    description = "High rate landfill trash output and low composting rates restrict biome recycling efficiency. Simple recycling sorting gives immediate relief.";
    dominantHabit = "Landfill Organic Decay";
    contributorExplanation = "Organic material decaying in airtight municipal garbage bags releases methane. Compost filters feed the soils directly.";
  }

  const empatheticAnalysis = `Your current score of ${estimatedTotalCO2} metric tons represents a wonderful starting canvas. By recognizing where your daily inputs originate, you hold the absolute keys to healing your virtual ecosystem biome. Small, non-judgmental habits make the world a highly sustainable garden.`;

  const defaultInterventions: Intervention[] = [
    {
      actionId: "transit_pooling",
      title: "Shared Transit Commuting",
      category: "transportation",
      co2Savings: 1.2,
      investmentEffort: "Low",
      costSavings: "High",
      empatheticExplanation: "Carpooling, groupings, or light electric transit alternatives scale back direct emission metrics easily.",
      steps: ["Map safe transit paths", "Coordinate schedules", "Initiate two shared commutes weekly"],
      isAdopted: false,
    },
    {
      actionId: "smart_grid_energy",
      title: "Smart Thermostat Balance",
      category: "energy",
      co2Savings: 0.8,
      investmentEffort: "Medium",
      costSavings: "Medium",
      empatheticExplanation: "Regulate seasonal heating zones to trim standby thermal release load of power suppliers.",
      steps: ["Acquire smart learning thermostat", "Set eco zones down 2 degrees during empty hours", "Monitor energy reports"],
      isAdopted: false,
    },
    {
      actionId: "plant_focused_diet",
      title: "Introduce Low-Meat Days",
      category: "food",
      co2Savings: 0.6,
      investmentEffort: "Low",
      costSavings: "High",
      empatheticExplanation: "Substituting high footprint livestock entries for beautiful local crop solutions offers immediate soil-buffering savings.",
      steps: ["Substitute lunch inputs twice a week", "Locate delicious local seasonal plant alternatives", "Track wellness and vibrancy feel"],
      isAdopted: false,
    },
    {
      actionId: "mindful_circular_shopping",
      title: "Circular Supply Sourcing",
      category: "shopping",
      co2Savings: 0.5,
      investmentEffort: "Low",
      costSavings: "High",
      empatheticExplanation: "Sourcing premium pre-owned garments and repairing goods reduces factory raw extraction demand.",
      steps: ["Identify quality vintage centers", "Participate in clothing/appliance repair swaps", "Select durable materials built to last"],
      isAdopted: false,
    },
    {
      actionId: "compost_and_recycle_sorting",
      title: "High Precision Sorting",
      category: "waste",
      co2Savings: 0.4,
      investmentEffort: "Medium",
      costSavings: "Medium",
      empatheticExplanation: "Correct sorting minimizes municipal anaerobic decay rates in airtight landfills.",
      steps: ["Deploy organic countertop aeration bins", "Align with municipal local code directories", "Promote single-use material restriction"],
      isAdopted: false,
    }
  ];

  const defaultMissions: DailyMission[] = [
    {
      id: "mission_lights_out",
      title: "Complete Phantom-Load Audit",
      description: "Unplug standby electronic equipment or unused chargers for a full evening.",
      category: "energy",
      impactLevel: "Low",
      isCompleted: false,
      pointsReward: 15,
    },
    {
      id: "mission_cold_wash",
      title: "Active Cold Sump Wash",
      description: "Clean modern garments at low wash temperature increments to protect fiber matrices.",
      category: "energy",
      impactLevel: "Low",
      isCompleted: false,
      pointsReward: 15,
    },
    {
      id: "mission_green_mile",
      title: "Un-fuel The Short Commutes",
      description: "Substitute any car commute less than 1.5 miles with a peaceful active walk or wheel.",
      category: "transportation",
      impactLevel: "Medium",
      isCompleted: false,
      pointsReward: 25,
    },
    {
      id: "mission_zero_food_waste",
      title: "Empty Plate Challenge",
      description: "Plan delicious meal portions carefully to achieve zero organic decay leftovers today.",
      category: "food",
      impactLevel: "Medium",
      isCompleted: false,
      pointsReward: 20,
    }
  ];

  return {
    carbonIdentity: {
      title,
      description,
      dominantHabit,
      contributorExplanation,
    },
    estimatedTotalCO2,
    breakdown,
    reasoning: "Programmatic calculation completed using sector coefficients.",
    empatheticAnalysis,
    interventions: defaultInterventions,
    dailyMissions: defaultMissions,
  };
}
