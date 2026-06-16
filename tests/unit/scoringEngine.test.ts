import { describe, it, expect } from "vitest";
import { getStandardScoringBenchmark } from "../../src/services/carbon/scoring";
import { evaluateCarbonAnswers, getCarbonBenchmark } from "../../server/services/carbon.service";

describe("Scoring and Backend Delegator Services", () => {
  it("resolves basic carbon score benchmarks", () => {
    expect(getStandardScoringBenchmark()).toBe(16.0);
    expect(getCarbonBenchmark()).toBe(16.0);
  });

  it("delegates carbon calculations from server correctly", () => {
    const dummyAnswers = {
      transportation: { commuteMethod: "ev", commuteMiles: 15, flightsLength: "none" },
      food: { dietType: "Vegan", organicLocal: "Mostly", foodWaste: "Low" },
      energy: { homeSize: "Apartment", heatingSource: "Electric", greenElectricity: true },
      shopping: { purchaseFrequency: "minimal", secondHand: "Always" },
      waste: { recyclingLevel: "Complete", composting: true, singleUsePlastics: "Minimal" }
    };
    
    const evaluation = evaluateCarbonAnswers(dummyAnswers);
    expect(evaluation.estimatedTotalCO2).toBeLessThan(10);
    expect(evaluation.carbonIdentity.title).toBeDefined();
  });
});
