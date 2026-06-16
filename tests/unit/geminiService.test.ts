import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { getCarbonAssessmentReflection, generateContentWithRetry } from "../../src/services/gemini/gemini.service";
import { generateContentWithRetry as serverGenerateContent } from "../../server/services/gemini.service";

// Mock @google/genai by declaring mock structure directly inside hoisted block
vi.mock("@google/genai", () => {
  class MockGoogleGenAI {
    models = {
      generateContent: async (params: any) => {
        if (params.contents === "FORCE_FAILURE") {
          throw new Error("Simulated transient RPC cluster timeout");
        }
        if (params.contents === "FORCE_EXHAUSTED" || (params.config?.systemInstruction && params.config.systemInstruction.includes("FORCE_EXHAUSTED"))) {
          const err = new Error("Resource exhausted") as any;
          err.status = 429;
          throw err;
        }
        return {
          text: `{
            "carbonIdentity": {
              "title": "Digital Alchemist",
              "description": "Mindful processing energy",
              "dominantHabit": "Tech infrastructure",
              "contributorExplanation": "Local CPU cores"
            },
            "estimatedTotalCO2": 3.4,
            "breakdown": {
              "transportation": 0.5,
              "food": 0.5,
              "energy": 2.0,
              "shopping": 0.2,
              "waste": 0.2
            },
            "reasoning": "Mock evaluation",
            "empatheticAnalysis": "Mindful digital usage",
            "interventions": [],
            "dailyMissions": []
          }`
        };
      }
    };
  }

  return {
    GoogleGenAI: MockGoogleGenAI,
    Type: {
      OBJECT: "OBJECT",
      STRING: "STRING",
      NUMBER: "NUMBER",
      ARRAY: "ARRAY",
      BOOLEAN: "BOOLEAN"
    }
  };
});

describe("Google GenAI Integration Service Layers", () => {
  let originalKey: string | undefined;

  beforeEach(() => {
    originalKey = process.env.GEMINI_API_KEY;
    process.env.GEMINI_API_KEY = "mock_secure_ai_wars_key_1234567";
  });

  afterEach(() => {
    process.env.GEMINI_API_KEY = originalKey;
    vi.restoreAllMocks();
  });

  it("should calculate correct assessment results using mocked Gemini AI response", async () => {
    const dummyAnswers = {
      transportation: { commuteMethod: "ev", commuteMiles: 40, flightsLength: "none" },
      food: { dietType: "vegan", organicLocal: "mostly", foodWaste: "low" },
      energy: { homeSize: "apartment", heatingSource: "renewable", greenElectricity: true },
      shopping: { purchaseFrequency: "minimal", secondHand: "always" },
      waste: { recyclingLevel: "complete", composting: true, singleUsePlastics: "minimal" }
    };

    const result = await getCarbonAssessmentReflection(dummyAnswers);
    expect(result.estimatedTotalCO2).toBe(3.4);
    expect(result.carbonIdentity.title).toBe("Digital Alchemist");
  });

  it("should retry transient API faults up to configured thresholds", async () => {
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
    
    await expect(
      generateContentWithRetry({ contents: "FORCE_FAILURE" }, 2, 10)
    ).rejects.toThrow("Simulated transient RPC cluster");

    expect(warnSpy).toHaveBeenCalled();
    warnSpy.mockRestore();
  });

  it("should fail-fast immediately on auth or quota failures instead of retrying", async () => {
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

    await expect(
      generateContentWithRetry({ contents: "FORCE_EXHAUSTED" }, 3, 10)
    ).rejects.toThrow("Resource exhausted");

    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining("Fail-fast triggered"));
    warnSpy.mockRestore();
  });

  it("should support server-side generateContent with standard parameters", async () => {
    const response = await serverGenerateContent({ contents: "standard_prompt" });
    expect(response.text).toContain("Digital Alchemist");
  });

  it("should support server-side generateContent retries on transient errors", async () => {
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
    
    await expect(
      serverGenerateContent({ contents: "FORCE_FAILURE" }, 2, 10)
    ).rejects.toThrow("Simulated transient RPC cluster");

    expect(warnSpy).toHaveBeenCalled();
    warnSpy.mockRestore();
  });

  it("should support server-side generateContent fail-fast on auth/quota errors", async () => {
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

    await expect(
      serverGenerateContent({ contents: "FORCE_EXHAUSTED" }, 3, 10)
    ).rejects.toThrow("Resource exhausted");

    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining("Fail-fast triggered"));
    warnSpy.mockRestore();
  });
});
