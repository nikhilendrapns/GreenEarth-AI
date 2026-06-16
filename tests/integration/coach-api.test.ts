import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { coachChat } from "../../server/controllers/coach.controller";
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

describe("Coach Chat Server Controller Integration", () => {
  let originalKey: string | undefined;

  beforeAll(() => {
    originalKey = process.env.GEMINI_API_KEY;
    // Set a mock key so that it runs the logic after checking the key threshold
    process.env.GEMINI_API_KEY = "mock_key";
  });

  afterAll(() => {
    process.env.GEMINI_API_KEY = originalKey;
  });

  it("returns contextual guidance message on food queries when API fails or falls back", async () => {
    const payload = {
      message: "How does eating meat affect greenhouse gas indicators?",
      identityTitle: "Conscious Herbivore",
      estimatedTotalCO2: 5.5,
      history: []
    };

    const { req, res, getStatus, getJson } = createMockReqRes(payload);
    await coachChat(req, res);

    expect(getStatus()).toBe(200);
    expect(getJson().reply).toContain("Food represents a major pillar");
    expect(getJson().reply).toContain("lentils");
  });

  it("returns transit guidance message on commute and gas driving queries", async () => {
    const payload = {
      message: "Tell me about commuting with my electric car vs flying",
      identityTitle: "Commute Explorer",
      estimatedTotalCO2: 8.9
    };

    const { req, res, getStatus, getJson } = createMockReqRes(payload);
    await coachChat(req, res);

    expect(getStatus()).toBe(200);
    expect(getJson().reply).toContain("Transit matters significantly");
  });

  it("returns energy guidelines on electricity or heating power queries", async () => {
    const payload = {
      message: "What is power phantom drawing?",
      identityTitle: "Power Auditor"
    };

    const { req, res, getStatus, getJson } = createMockReqRes(payload);
    await coachChat(req, res);

    expect(getStatus()).toBe(200);
    expect(getJson().reply).toContain("phantom loads");
  });

  it("returns recycling guidelines on waste sorting queries", async () => {
    const payload = {
      message: "Should I compost my kitchen scraps?",
      identityTitle: "Composting Hero"
    };

    const { req, res, getStatus, getJson } = createMockReqRes(payload);
    await coachChat(req, res);

    expect(getStatus()).toBe(200);
    expect(getJson().reply).toContain("Sorting our waste stream");
  });

  it("returns general friendly guidance on general conversation messages", async () => {
    const payload = {
      message: "Hello coach, what are you doing today?",
      identityTitle: "Conscious Explorer",
      estimatedTotalCO2: 6.2
    };

    const { req, res, getStatus, getJson } = createMockReqRes(payload);
    await coachChat(req, res);

    expect(getStatus()).toBe(200);
    expect(getJson().reply).toContain("motivated to guide your journey");
  });

  it("rejects chat request with 400 Bad Request if message is empty", async () => {
    const payload = {
      message: "" // invalid input
    };

    const { req, res, getStatus } = createMockReqRes(payload);
    await coachChat(req, res);

    expect(getStatus()).toBe(400);
  });

  it("correctly handles fail-fast mirror response if apiKey is absent", async () => {
    process.env.GEMINI_API_KEY = ""; // Temporarily blank out api key

    const payload = {
      message: "How features run?",
    };

    const { req, res, getStatus, getJson } = createMockReqRes(payload);
    await coachChat(req, res);

    expect(getStatus()).toBe(200);
    expect(getJson().reply).toContain("connection mirror is sleeping");

    process.env.GEMINI_API_KEY = "mock_key"; // Restore
  });

  it("should return a 500 server error when coach handler suffers unexpected crashes", async () => {
    const { req, res, getStatus, getJson } = createMockReqRes({ message: "Hello Coach" });
    
    // Disrupt req.body property read access to throw error
    Object.defineProperty(req, 'body', {
      get() { throw new Error("Hard driver memory fault simulation"); }
    });

    await coachChat(req, res);
    expect(getStatus()).toBe(500);
    expect(getJson().error).toContain("communicate with AI Coach");
  });
});
