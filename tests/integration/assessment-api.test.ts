import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { createAssessment } from "../../server/controllers/assessment.controller";
import { Request, Response } from "express";

function createMockReqRes(bodyData: any) {
  const req = {
    body: bodyData
  } as unknown as Request;

  let statusCode = 200;
  let jsonResponse: any = null;

  const res = {
    status(code: number) {
      statusCode = code;
      return this;
    },
    json(data: any) {
      jsonResponse = data;
      return this;
    }
  } as unknown as Response;

  return { req, res, getStatus: () => statusCode, getJson: () => jsonResponse };
}

describe("Assessment Server Controller Integration", () => {
  let originalKey: string | undefined;

  beforeAll(() => {
    originalKey = process.env.GEMINI_API_KEY;
    // Set to empty to instantly activate high-speed programmatic backup calculation
    process.env.GEMINI_API_KEY = "";
  });

  afterAll(() => {
    process.env.GEMINI_API_KEY = originalKey;
  });

  it("should process valid questionnaire answers and return calculated profile", async () => {
    const validPayload = {
      answers: {
        transportation: { commuteMethod: "ev", commuteMiles: 20, flightsLength: "none" },
        food: { dietType: "vegan", organicLocal: "mostly", foodWaste: "low" },
        energy: { homeSize: "apartment", heatingSource: "renewable", greenElectricity: true },
        shopping: { purchaseFrequency: "minimal", secondHand: "always" },
        waste: { recyclingLevel: "complete", composting: true, singleUsePlastics: "minimal" }
      }
    };

    const { req, res, getStatus, getJson } = createMockReqRes(validPayload);
    await createAssessment(req, res);

    expect(getStatus()).toBe(200);
    expect(getJson()).toBeDefined();
    expect(getJson().estimatedTotalCO2).toBeLessThan(10);
    expect(getJson().carbonIdentity.title).toBeDefined();
  });

  it("should return a 400 Bad Request if evaluation parameters are malformed", async () => {
    const invalidPayload = {
      answers: {
        transportation: { commuteMethod: "car_gas", commuteMiles: -50, flightsLength: "short" } // negative miles fail validation
      }
    };

    const { req, res, getStatus, getJson } = createMockReqRes(invalidPayload);
    await createAssessment(req, res);

    expect(getStatus()).toBe(400);
    expect(getJson().error).toContain("Malformed style answers payload");
  });

  it("should return 500 error if service layer crashes", async () => {
    const validPayload = {
      answers: {
        transportation: { commuteMethod: "ev", commuteMiles: 20, flightsLength: "none" },
        food: { dietType: "vegan", organicLocal: "mostly", foodWaste: "low" },
        energy: { homeSize: "apartment", heatingSource: "renewable", greenElectricity: true },
        shopping: { purchaseFrequency: "minimal", secondHand: "always" },
        waste: { recyclingLevel: "complete", composting: true, singleUsePlastics: "minimal" }
      }
    };

    const { req, res, getStatus, getJson } = createMockReqRes(validPayload);
    
    // Temporarily disrupt req.body to trigger throwing behaviour
    Object.defineProperty(req, 'body', {
      get() { throw new Error("Database network interruption mockup"); }
    });

    await createAssessment(req, res);
    expect(getStatus()).toBe(500);
    expect(getJson().error).toContain("Failed to compile AI carbon evaluation report");
  });
});
