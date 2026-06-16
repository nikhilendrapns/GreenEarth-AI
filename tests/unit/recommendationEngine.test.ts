import { describe, it, expect } from "vitest";
import { getDefaultInterventions, getDefaultMissions } from "../../src/services/carbon/recommendation";
import { generateNarrativeReportFallback } from "../../src/services/carbon/narrative";

describe("Recommendation & Narrative Fallback Engines", () => {
  it("should return valid default proposed interventions lists", () => {
    const list = getDefaultInterventions();
    expect(list.length).toEqual(2);
    expect(list[0].actionId).toBe("transit_group");
    expect(list[1].actionId).toBe("meat_limit");
  });

  it("should return valid default daily missions list", () => {
    const list = getDefaultMissions();
    expect(list.length).toEqual(2);
    expect(list[0].id).toBe("mission_ref_1");
    expect(list[1].id).toBe("mission_ref_2");
  });

  it("should generate proper narrative reflections using default parameters and fallbacks", () => {
    const customReport = generateNarrativeReportFallback({
      identityTitle: "Global Regenerator",
      co2Value: 3.8,
      actionsAdoptedCount: 3,
      totalPoints: 240,
      ecoMood: "Blooming Bliss"
    });
    
    expect(customReport).toContain("Global Regenerator");
    expect(customReport).toContain("3.8 metric tons");
    expect(customReport).toContain("3 critical interventions");
    expect(customReport).toContain("240");
    expect(customReport).toContain("Blooming Bliss");

    const fallbackReport = generateNarrativeReportFallback({});
    expect(fallbackReport).toContain("A Conscious Explorer");
    expect(fallbackReport).toContain("4.2 metric tons");
    expect(fallbackReport).toContain("0 critical");
    expect(fallbackReport).toContain("Vibrant");
  });
});
