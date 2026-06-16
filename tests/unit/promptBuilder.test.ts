import { describe, it, expect } from "vitest";
import { promptBuilder as clientPromptBuilder } from "../../src/services/gemini/promptBuilder";
import { promptBuilder as serverPromptBuilder } from "../../server/services/prompt.service";

describe("Unified LLM Prompt Builder Services", () => {
  const dummyAnswers = {
    transportation: { commuteMethod: "ev", commuteMiles: 40, flightsLength: "rarely" },
    food: { dietType: "vegan", organicLocal: "mostly", foodWaste: "low" },
    energy: { homeSize: "apartment", heatingSource: "renewable", greenElectricity: true },
    shopping: { purchaseFrequency: "minimal", secondHand: "always" },
    waste: { recyclingLevel: "complete", composting: true, singleUsePlastics: "minimal" }
  };

  it("builds correct client carbon assessment prompts", () => {
    const prompt = clientPromptBuilder.buildAssessmentPrompt(dummyAnswers);
    expect(prompt).toContain("GreenEarthAI");
    expect(prompt).toContain("Transportation Commute Method: ev");
    expect(prompt).toContain("Composting At Home: Yes");
  });

  it("builds correct client weekly narrative simulation prompts", () => {
    const params = {
      identityTitle: "Eco Pioneer",
      co2Value: 4.8,
      actionsAdoptedCount: 2,
      totalPoints: 120,
      ecoMood: "Thriving"
    };
    const prompt = clientPromptBuilder.buildNarrativeReportPrompt(params);
    expect(prompt).toContain("Eco Pioneer");
    expect(prompt).toContain("4.8 metric tons");
    expect(prompt).toContain("Thriving");
  });

  it("builds correct client journal prompts", () => {
    const prompt = clientPromptBuilder.buildJournalPrompt("I walked to work today!", "Urban Walker");
    expect(prompt).toContain("I walked to work today!");
    expect(prompt).toContain("Urban Walker");
  });

  it("builds correct client nudges prompts", () => {
    const prompt = clientPromptBuilder.buildNudgesPrompt("Urban Walker", { transportation: 1.0 }, ["meat_less"]);
    expect(prompt).toContain("Urban Walker");
    expect(prompt).toContain("transportation");
  });

  // Server Prompts Core Testing
  it("builds correct server carbon assessment prompts", () => {
    const prompt = serverPromptBuilder.buildAssessmentPrompt(dummyAnswers);
    expect(prompt).toContain("sustainability expert");
    expect(prompt).toContain("Green Electricity Subscription: Yes");
  });

  it("builds correct server narrative prompts", () => {
    const prompt = serverPromptBuilder.buildNarrativeReportPrompt({
      identityTitle: "Server Pioneer",
      co2Value: 6.2,
      actionsAdoptedCount: 1,
      totalPoints: 80,
      ecoMood: "Hopeful"
    });
    expect(prompt).toContain("Server Pioneer");
    expect(prompt).toContain("6.2 metric tons");
  });

  it("builds correct server journal prompts", () => {
    const prompt = serverPromptBuilder.buildJournalPrompt("Setting up renewable energy", "Solar Warrior");
    expect(prompt).toContain("Setting up renewable energy");
    expect(prompt).toContain("Solar Warrior");
  });

  it("builds correct server nudges prompts", () => {
    const prompt = serverPromptBuilder.buildNudgesPrompt("Solar Warrior", { energy: 3.5 }, ["solar_tap"]);
    expect(prompt).toContain("Solar Warrior");
    expect(prompt).toContain("3.5");
  });
});
