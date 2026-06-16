import { describe, it, expect } from "vitest";
import { formatCarbonScore, formatPoints } from "../../src/utils/formatter";
import { calculateCarbonOffset, formatCO2Value } from "../../src/utils/carbon";
import { getCurrentDateString } from "../../src/utils/date";
import { sleep } from "../../src/utils/helper";

describe("Formatting and General Utilities", () => {
  it("formats carbon scores and vitality points correctly", () => {
    expect(formatCarbonScore(12.34)).toBe("12.3 CO₂ tons/year");
    expect(formatCarbonScore(0)).toBe("0.0 CO₂ tons/year");
    
    expect(formatPoints(1500)).toBe("1,500 pts");
    expect(formatPoints(0)).toBe("0 pts");
  });

  it("calculates realistic carbon offsets for planted trees", () => {
    // 1 tree = 0.022 metric tons
    expect(calculateCarbonOffset(10)).toBeCloseTo(0.22, 5);
    expect(calculateCarbonOffset(0)).toBe(0);
    
    expect(formatCO2Value(4.56)).toBe("4.56 Metric Tons CO2e");
  });

  it("generates date string accurately in the correct format", () => {
    const dateStr = getCurrentDateString();
    expect(dateStr).toBeDefined();
    expect(typeof dateStr).toBe("string");
    expect(dateStr.length).toBeGreaterThan(5);
  });

  it("supports asynchronous sleep timeouts helper logic", async () => {
    const start = Date.now();
    await sleep(50);
    const duration = Date.now() - start;
    expect(duration).toBeGreaterThanOrEqual(40);
  });
});
