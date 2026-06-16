import { describe, it, expect } from "vitest";
import { 
  calculateSimulatedScore, 
  calculateFuturisticSimulationScore, 
  getEcosystemMood, 
  getProgrammaticAssessment 
} from "../../src/services/carbon/calculator";
import { UserSessionState } from "../../src/types/index";

describe("Stateful Carbon Simulator Engine", () => {
  const dummyState: UserSessionState = {
    theme: "light",
    isFirstLaunch: false,
    adoptedInterventions: ["transit_pooling", "smart_grid_energy"],
    totalPoints: 200,
    reflection: {
      carbonIdentity: {
        title: "Explorer",
        description: "",
        dominantHabit: "",
        contributorExplanation: ""
      },
      estimatedTotalCO2: 12.5,
      breakdown: {
        transportation: 4.0,
        food: 3.5,
        energy: 2.5,
        shopping: 1.5,
        waste: 1.0,
      },
      reasoning: "Test",
      empatheticAnalysis: "Good job",
      interventions: [
        {
          actionId: "transit_pooling",
          title: "Transit pooling",
          category: "transportation",
          co2Savings: 1.5,
          investmentEffort: "Low",
          costSavings: "High",
          empatheticExplanation: "",
          steps: [],
          isAdopted: false
        },
        {
          actionId: "smart_grid_energy",
          title: "Toggle green loops",
          category: "energy",
          co2Savings: 0.8,
          investmentEffort: "Low",
          costSavings: "High",
          empatheticExplanation: "",
          isAdopted: false,
          steps: []
        },
        {
          actionId: "plant_diet",
          title: "Swap protein",
          category: "food",
          co2Savings: 1.2,
          investmentEffort: "Low",
          costSavings: "High",
          empatheticExplanation: "",
          isAdopted: false,
          steps: []
        }
      ],
      dailyMissions: []
    }
  };

  it("calculates current simulated score, subtracting adopted actions", () => {
    // Should subtract 1.5 and 0.8 from 12.5 -> 12.5 - 2.3 = 10.2
    const currentScore = calculateSimulatedScore(dummyState);
    expect(currentScore).toBe(10.2);

    // If reflection is null
    expect(calculateSimulatedScore({ ...dummyState, reflection: null })).toBe(0);
    // If no adopted interventions
    expect(calculateSimulatedScore({ ...dummyState, adoptedInterventions: [] })).toBe(12.5);
  });

  it("calculates future projection percentage simulations", () => {
    // Total co2Savings potential is 1.5 + 0.8 + 1.2 = 3.5
    // at 100% simulation, it should subtract 3.5 from 12.5 -> 9.0
    const score100 = calculateFuturisticSimulationScore(dummyState, 100);
    expect(score100).toBe(9.0);

    const score50 = calculateFuturisticSimulationScore(dummyState, 50);
    // subtracts 1.75 -> 12.5 - 1.75 = 10.75 -> rounded to 10.8
    expect(score50).toBe(10.8);

    // If reflection is null
    expect(calculateFuturisticSimulationScore({ ...dummyState, reflection: null }, 50)).toBe(0);
  });

  it("handles clamp thresholds correctly so scores never go below 0.5", () => {
    const lowBaseState = {
      ...dummyState,
      reflection: {
        ...dummyState.reflection!,
        estimatedTotalCO2: 1.2,
        interventions: [
          { actionId: "a", title: "", category: "food", co2Savings: 2.0, investmentEffort: "Low", costSavings: "High", empatheticExplanation: "", steps: [] }
        ]
      },
      adoptedInterventions: ["a"]
    };
    expect(calculateSimulatedScore(lowBaseState)).toBe(0.5);
    expect(calculateFuturisticSimulationScore(lowBaseState, 100)).toBe(0.5);
  });

  it("maps numeric scoring thresholds into ecosystem taxonomy", () => {
    expect(getEcosystemMood(4.2)).toBe("Lush Garden");
    expect(getEcosystemMood(10.0)).toBe("Recovering Biome");
    expect(getEcosystemMood(16.5)).toBe("Dimmed Forest");
  });
});

describe("Standone Diagnostic Assessment Math Tests", () => {
  it("computes baseline profiles with food, transit, and shopping combinations", () => {
    // High impact transport contributor profile
    const inputTransitMax = {
      transportation: { commuteMethod: "car", commuteMiles: 200, flightsLength: "heavily" },
      food: { dietType: "Vegan", organicLocal: "Mostly", foodWaste: "Low" },
      energy: { homeSize: "Apartment", heatingSource: "Electric", greenElectricity: true },
      shopping: { purchaseFrequency: "minimal", secondHand: "always" },
      waste: { recyclingLevel: "Complete", composting: true, singleUsePlastics: "Minimal" }
    };
    const transResult = getProgrammaticAssessment(inputTransitMax);
    expect(transResult.carbonIdentity.title).toBe("The High-Flyer Navigator");
    expect(transResult.estimatedTotalCO2).toBeGreaterThan(6.0);
    expect(transResult.breakdown.transportation).toBeGreaterThan(transResult.breakdown.food);

    // High food contributor profile
    const inputFoodMax = {
      transportation: { commuteMethod: "active", commuteMiles: 0, flightsLength: "none" },
      food: { dietType: "Meat-rich", organicLocal: "Never", foodWaste: "High" },
      energy: { homeSize: "Apartment", heatingSource: "Electric", greenElectricity: true },
      shopping: { purchaseFrequency: "minimal", secondHand: "always" },
      waste: { recyclingLevel: "Complete", composting: true, singleUsePlastics: "Minimal" }
    };
    const foodResult = getProgrammaticAssessment(inputFoodMax);
    expect(foodResult.carbonIdentity.title).toBe("The Meat-Rich Connoisseur");
    expect(foodResult.breakdown.food).toBeGreaterThan(foodResult.breakdown.transportation);

    // High energy contributor profile
    const inputEnergyMax = {
      transportation: { commuteMethod: "active", commuteMiles: 0, flightsLength: "none" },
      food: { dietType: "Vegan", organicLocal: "Mostly", foodWaste: "Low" },
      energy: { homeSize: "Large Mansion", heatingSource: "Coal", greenElectricity: false },
      shopping: { purchaseFrequency: "minimal", secondHand: "always" },
      waste: { recyclingLevel: "Complete", composting: true, singleUsePlastics: "Minimal" }
    };
    const energyResult = getProgrammaticAssessment(inputEnergyMax);
    expect(energyResult.carbonIdentity.title).toBe("The Conscious Urbanite");
    expect(energyResult.breakdown.energy).toBeGreaterThan(energyResult.breakdown.food);

    // High shopping contributor profile
    const inputShoppingMax = {
      transportation: { commuteMethod: "active", commuteMiles: 0, flightsLength: "none" },
      food: { dietType: "Vegan", organicLocal: "Mostly", foodWaste: "Low" },
      energy: { homeSize: "Apartment", heatingSource: "Electric", greenElectricity: true },
      shopping: { purchaseFrequency: "heavily", secondHand: "Never" },
      waste: { recyclingLevel: "Complete", composting: true, singleUsePlastics: "Minimal" }
    };
    const shopResult = getProgrammaticAssessment(inputShoppingMax);
    expect(shopResult.carbonIdentity.title).toBe("The Modern Retail Voyager");
    expect(shopResult.breakdown.shopping).toBeGreaterThan(shopResult.breakdown.energy);

    // High waste contributor profile
    const inputWasteMax = {
      transportation: { commuteMethod: "active", commuteMiles: 0, flightsLength: "none" },
      food: { dietType: "Vegan", organicLocal: "Mostly", foodWaste: "Low" },
      energy: { homeSize: "Apartment", heatingSource: "Electric", greenElectricity: true },
      shopping: { purchaseFrequency: "minimal", secondHand: "always" },
      waste: { recyclingLevel: "None", composting: false, singleUsePlastics: "heavily" }
    };
    const wasteResult = getProgrammaticAssessment(inputWasteMax);
    expect(wasteResult.carbonIdentity.title).toBe("The Single-Use Enthusiast");
    expect(wasteResult.breakdown.waste).toBeGreaterThan(wasteResult.breakdown.shopping);
  });

  it("handles different types of input values (hybrid/ev commuter, sometimes/rarely flights, Balanced diet)", () => {
    const mixedInput = {
      transportation: { commuteMethod: "hybrid", commuteMiles: 50, flightsLength: "sometimes" },
      food: { dietType: "Balanced", organicLocal: "Sometimes", foodWaste: "Medium" },
      energy: { homeSize: "Medium Suburban", heatingSource: "Gas", greenElectricity: false },
      shopping: { purchaseFrequency: "Moderate", secondHand: "Sometimes" },
      waste: { recyclingLevel: "Partial", composting: false, singleUsePlastics: "Moderate" }
    };
    const result = getProgrammaticAssessment(mixedInput);
    expect(result.estimatedTotalCO2).toBeDefined();
    expect(result.interventions.length).toBe(5);
    expect(result.dailyMissions.length).toBe(4);
  });

  it("handles EV commuting, rarely flights, vegetarian diet, electric heat, often secondHand, composting true", () => {
    const greenInput = {
      transportation: { commuteMethod: "ev", commuteMiles: 10, flightsLength: "rarely" },
      food: { dietType: "Vegetarian", organicLocal: "Sometimes", foodWaste: "Low" },
      energy: { homeSize: "Apartment", heatingSource: "Electric", greenElectricity: true },
      shopping: { purchaseFrequency: "minimal", secondHand: "Often" },
      waste: { recyclingLevel: "Partial", composting: true, singleUsePlastics: "Minimal" }
    };
    const result = getProgrammaticAssessment(greenInput as any);
    expect(result.estimatedTotalCO2).toBeLessThan(10.0);
  });
});
