import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { simulateEcosystem } from "../../server/controllers/simulator.controller";
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

describe("Ecosystem Simulation Server Controller Integration", () => {
  let originalKey: string | undefined;

  beforeAll(() => {
    originalKey = process.env.GEMINI_API_KEY;
    // Set a mock key to trigger prompt building and generation fallbacks
    process.env.GEMINI_API_KEY = "mock_key";
  });

  afterAll(() => {
    process.env.GEMINI_API_KEY = originalKey;
  });

  it("should successfully compile narrative when valid simulator stats are provided", async () => {
    const payload = {
      identityTitle: "Solar Guardian",
      co2Value: 4.8,
      actionsAdoptedCount: 3,
      totalPoints: 280,
      ecoMood: "Blooming Garden"
    };

    const { req, res, getStatus, getJson } = createMockReqRes(payload);
    await simulateEcosystem(req, res);

    expect(getStatus()).toBe(200);
    expect(getJson().narrative).toBeDefined();
    expect(getJson().narrative).toContain("Solar Guardian");
    expect(getJson().narrative).toContain("4.8 metric tons");
    expect(getJson().narrative).toContain("Blooming Garden");
  });

  it("should return a 400 Bad Request error if inputs are invalid or negative", async () => {
    const payload = {
      co2Value: -2.5 // invalid negative footprint
    };

    const { req, res, getStatus, getJson } = createMockReqRes(payload);
    await simulateEcosystem(req, res);

    expect(getStatus()).toBe(400);
    expect(getJson().error).toContain("Invalid report configuration");
  });

  it("should immediately serve static reflection block when GEMINI_API_KEY is not configured", async () => {
    process.env.GEMINI_API_KEY = ""; // clear key

    const payload = {
      identityTitle: "Offline Warrior",
      co2Value: 3.2,
      actionsAdoptedCount: 1,
      totalPoints: 50,
      ecoMood: "Sprouting Seed"
    };

    const { req, res, getStatus, getJson } = createMockReqRes(payload);
    await simulateEcosystem(req, res);

    expect(getStatus()).toBe(200);
    expect(getJson().narrative).toContain("Offline Warrior");
    expect(getJson().narrative).toContain("3.2 metric tons");

    process.env.GEMINI_API_KEY = "mock_key"; // restore
  });

  it("should return a 500 server error when simulator handler suffers unexpected crashes", async () => {
    const { req, res, getStatus, getJson } = createMockReqRes({ identityTitle: "Test Guardian" });
    
    // Disrupt req.body property read access to throw error
    Object.defineProperty(req, 'body', {
      get() { throw new Error("Hard driver memory fault simulation"); }
    });

    await simulateEcosystem(req, res);
    expect(getStatus()).toBe(500);
    expect(getJson().error).toContain("Failed to compile AI narrative report");
  });
});
