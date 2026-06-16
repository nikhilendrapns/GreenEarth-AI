import { describe, it, expect, beforeAll, afterAll } from "vitest";
import nudgesRouter from "../../server/routes/nudges.route";
import { Request, Response, NextFunction } from "express";

function runMiddleware(middleware: any, bodyData: any) {
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

  return new Promise<{ statusCode: number; jsonResponse: any }>(async (resolve) => {
    // Find the handler inside express router stack
    const handler = middleware.stack[0].route.stack[0].handle;
    await handler(req, res, () => {});
    resolve({ statusCode, jsonResponse });
  });
}

describe("Behavioral Nudges Server Route Integration", () => {
  let originalKey: string | undefined;

  beforeAll(() => {
    originalKey = process.env.GEMINI_API_KEY;
    // Mock the api key to run API pathways
    process.env.GEMINI_API_KEY = "mock_key";
  });

  afterAll(() => {
    process.env.GEMINI_API_KEY = originalKey;
  });

  it("should serve beautiful behavioral nudges when valid parameters are passed", async () => {
    const payload = {
      identityTitle: "Active Pedalian",
      breakdown: { transportation: 2.1, food: 3.5, energy: 0.8 },
      adoptedIds: ["smart_thermostat"]
    };

    const { statusCode, jsonResponse } = await runMiddleware(nudgesRouter, payload);

    expect(statusCode).toBe(200);
    expect(jsonResponse.nudges).toBeDefined();
    expect(jsonResponse.nudges.length).toBeGreaterThan(0);
    expect(jsonResponse.nudges[0].title).toBeDefined();
  });

  it("should reject nudges request with a 400 Bad Request error on invalid breakdown formats", async () => {
    const payload = {
      breakdown: "not-an-object" // mismatch schemas type
    };

    const { statusCode, jsonResponse } = await runMiddleware(nudgesRouter, payload);

    expect(statusCode).toBe(400);
    expect(jsonResponse.error).toContain("Malformed user nudge credentials");
  });

  it("should gracefully deliver beautiful default fallback nudges when GEMINI_API_KEY is not defined", async () => {
    process.env.GEMINI_API_KEY = ""; // clear keys

    const payload = {
      identityTitle: "Solar Explorer"
    };

    const { statusCode, jsonResponse } = await runMiddleware(nudgesRouter, payload);

    expect(statusCode).toBe(200);
    expect(jsonResponse.nudges).toBeDefined();
    expect(jsonResponse.nudges.length).toBe(3);
    expect(jsonResponse.nudges[0].title).toBe("Plan Seasonal Salad Bowls");

    process.env.GEMINI_API_KEY = "mock_key"; // restore
  });
});
