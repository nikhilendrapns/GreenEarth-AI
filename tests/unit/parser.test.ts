import { describe, it, expect, vi } from "vitest";
import { responseParser } from "../../src/services/gemini/parser";

describe("Response Parser Service Engine", () => {
  it("should cleanly parse valid JSON", () => {
    const raw = '{"score": 9.5, "archetype": "Conservation Advocate"}';
    const parsed = responseParser.parseJSON<any>(raw, null);
    
    expect(parsed).toEqual({ score: 9.5, archetype: "Conservation Advocate" });
  });

  it("should strip markdown code blocks format prefix and suffixes cleanly", () => {
    const rawMarkdown = "```json\n{\n  \"status\": \"eco_friendly\"\n}\n```";
    const parsed = responseParser.parseJSON<any>(rawMarkdown, null);
    
    expect(parsed).toEqual({ status: "eco_friendly" });

    // Test simple ``` prefix
    const rawSimpleBlock = "```{\n  \"test\": true\n}```";
    expect(responseParser.parseJSON<any>(rawSimpleBlock, null)).toEqual({ test: true });
  });

  it("should fail-safe and return fallback values upon parsing malformed inputs", () => {
    const consoleSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
    
    const malformed = '{"score": 12.5, '; // Missing closing bracket
    const result = responseParser.parseJSON(malformed, { score: 0 });
    
    expect(result).toEqual({ score: 0 });
    expect(consoleSpy).toHaveBeenCalled();
    
    consoleSpy.mockRestore();
  });

  it("should instantly return fallback upon empty characters input", () => {
    const result = responseParser.parseJSON("", { defaultVal: true });
    expect(result).toEqual({ defaultVal: true });
  });
});
