import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { analyzeJournal } from "../../server/controllers/journal.controller";
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

describe("Journal Analysis Server Controller Integration", () => {
  let originalKey: string | undefined;

  beforeAll(() => {
    originalKey = process.env.GEMINI_API_KEY;
    // Set a mock key to test both key blocks and fallback error catching lines
    process.env.GEMINI_API_KEY = "mock_key";
  });

  afterAll(() => {
    process.env.GEMINI_API_KEY = originalKey;
  });

  it("extracts positive 'Hopeful' mood and guidance analysis from keywords like 'completed'", async () => {
    const payload = {
      entry: "Today I completed my daily challenge and felt great!",
      identityTitle: "Hope Pioneer"
    };

    const { req, res, getStatus, getJson } = createMockReqRes(payload);
    await analyzeJournal(req, res);

    expect(getStatus()).toBe(200);
    expect(getJson().vitalityMood).toBe("Hopeful");
    expect(getJson().analysis).toContain("sustainable habits lock in");
    expect(getJson().microTip).toBeDefined();
  });

  it("extracts cautious 'Reflective' mood and guidance analysis from keywords like 'failed'", async () => {
    const payload = {
      entry: "I had a hard time today and failed to avoid using single-use packaging",
      identityTitle: "Resolute Wanderer"
    };

    const { req, res, getStatus, getJson } = createMockReqRes(payload);
    await analyzeJournal(req, res);

    expect(getStatus()).toBe(200);
    expect(getJson().vitalityMood).toBe("Reflective");
    expect(getJson().analysis).toContain("Patience is a primary element");
  });

  it("returns default 'Reflective' mood and generic tips for neutral or standard entries", async () => {
    const payload = {
      entry: "I am writing down general notes about sustainability.",
      identityTitle: "Lush Citizen"
    };

    const { req, res, getStatus, getJson } = createMockReqRes(payload);
    await analyzeJournal(req, res);

    expect(getStatus()).toBe(200);
    expect(getJson().vitalityMood).toBe("Reflective");
    expect(getJson().analysis).toContain("daily journal entries represent high levels");
  });

  it("rejects journal request with 400 Bad Request if the entry input is blank", async () => {
    const payload = {
      entry: "", // malformed validation trigger
    };

    const { req, res, getStatus } = createMockReqRes(payload);
    await analyzeJournal(req, res);

    expect(getStatus()).toBe(400);
  });

  it("delivers static JSON values directly when GEMINI_API_KEY is not defined at all", async () => {
    process.env.GEMINI_API_KEY = ""; // Blank out keys

    const payload = {
      entry: "Feeling happy",
    };

    const { req, res, getStatus, getJson } = createMockReqRes(payload);
    await analyzeJournal(req, res);

    expect(getStatus()).toBe(200);
    expect(getJson().vitalityMood).toBe("Hopeful");

    process.env.GEMINI_API_KEY = "mock_key"; // Restore
  });

  it("should return a 500 server error when journal handler suffers unexpected crashes", async () => {
    const { req, res, getStatus, getJson } = createMockReqRes({ entry: "A good morning" });
    
    // Disrupt req.body property read access to throw error
    Object.defineProperty(req, 'body', {
      get() { throw new Error("Hard driver memory fault simulation"); }
    });

    await analyzeJournal(req, res);
    expect(getStatus()).toBe(500);
    expect(getJson().error).toContain("analyze journal");
  });
});
