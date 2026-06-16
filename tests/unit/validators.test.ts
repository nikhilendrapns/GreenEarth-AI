import { describe, it, expect } from "vitest";
import { 
  AssessmentAnswersSchema, 
  NarrativeReportRequestSchema,
  CoachChatRequestSchema,
  JournalAnalysisRequestSchema,
  NudgesRequestSchema
} from "../../server/validators/assessment.validator";

describe("Unified Model Input Zod Validation Schemas", () => {
  const validAnswers = {
    transportation: {
      commuteMethod: "car_gas",
      commuteMiles: 45.5,
      flightsLength: "short"
    },
    food: {
      dietType: "vegan",
      organicLocal: "mostly",
      foodWaste: "low"
    },
    energy: {
      homeSize: "apartment",
      heatingSource: "renewable",
      greenElectricity: true
    },
    shopping: {
      purchaseFrequency: "minimal",
      secondHand: "always"
    },
    waste: {
      recyclingLevel: "complete",
      composting: true,
      singleUsePlastics: "minimal"
    }
  };

  it("successfully passes validation for compliant complete user assessment inputs", () => {
    const parse = AssessmentAnswersSchema.safeParse(validAnswers);
    expect(parse.success).toBe(true);
  });

  it("rejects incomplete or invalid schema properties dynamically", () => {
    // Bad commuteMethod type
    const badCommute = {
      ...validAnswers,
      transportation: {
        commuteMethod: "unicycle_jet_thruster",
        commuteMiles: 10,
        flightsLength: "none"
      }
    };
    expect(AssessmentAnswersSchema.safeParse(badCommute).success).toBe(false);

    // Negative miles
    const badMiles = {
      ...validAnswers,
      transportation: {
        commuteMethod: "car_gas",
        commuteMiles: -5,
        flightsLength: "none"
      }
    };
    expect(AssessmentAnswersSchema.safeParse(badMiles).success).toBe(false);
  });

  it("validates NarrativeReportRequestSchema handles both empty and loaded formats", () => {
    const validReport = {
      identityTitle: "Solar Voyager",
      co2Value: 12.4,
      actionsAdoptedCount: 2,
      totalPoints: 180,
      ecoMood: "Balanced"
    };
    expect(NarrativeReportRequestSchema.safeParse(validReport).success).toBe(true);
    expect(NarrativeReportRequestSchema.safeParse({}).success).toBe(true); // all fields optional
    expect(NarrativeReportRequestSchema.safeParse({ co2Value: -1 }).success).toBe(false); // cannot be negative
  });

  it("enforces CoachChatRequestSchema boundaries", () => {
    const validChat = {
      history: [
        { role: "user", text: "Hello" },
        { role: "model", text: "Welcome" }
      ],
      message: "What's my carbon count?",
      identityTitle: "Lush Protector",
      estimatedTotalCO2: 8.4
    };
    expect(CoachChatRequestSchema.safeParse(validChat).success).toBe(true);
    expect(CoachChatRequestSchema.safeParse({ message: "" }).success).toBe(false); // min length 1
  });

  it("checks JournalAnalysisRequestSchema rules", () => {
    const validJournal = {
      entry: "I setup a worm farm countertop compost!",
      identityTitle: "Ecominimalist"
    };
    expect(JournalAnalysisRequestSchema.safeParse(validJournal).success).toBe(true);
    expect(JournalAnalysisRequestSchema.safeParse({ entry: "" }).success).toBe(false); // min length 1
  });

  it("handles NudgesRequestSchema payloads", () => {
    const validNudge = {
      identityTitle: "Urban Cyclist",
      breakdown: { transportation: 4.5, food: 2.1 },
      adoptedIds: ["smart_thermostat", "meatless_bowl"]
    };
    expect(NudgesRequestSchema.safeParse(validNudge).success).toBe(true);
    expect(NudgesRequestSchema.safeParse({}).success).toBe(true); // fields optional
  });
});
