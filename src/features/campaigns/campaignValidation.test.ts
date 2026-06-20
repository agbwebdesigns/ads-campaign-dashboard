import { describe, expect, it } from "vitest";
import { campaignEditSchema } from "./campaignValidation";

const validCampaignForm = {
  name: "Summer Movie Launch",
  status: "active",
  dailyBudget: 1000,
  totalBudget: 50000,
  startDate: "2026-06-01",
  endDate: "2026-06-30",
};

describe("campaignEditSchema", () => {
  it("accepts valid campaign edit values", () => {
    const result = campaignEditSchema.safeParse(validCampaignForm);

    expect(result.success).toBe(true);
  });

  it("rejects an empty campaign name", () => {
    const result = campaignEditSchema.safeParse({
      ...validCampaignForm,
      name: "",
    });

    expect(result.success).toBe(false);
  });

  it("rejects a daily budget less than or equal to 0", () => {
    const result = campaignEditSchema.safeParse({
      ...validCampaignForm,
      dailyBudget: 0,
    });

    expect(result.success).toBe(false);
  });

  it("rejects a total budget below the daily budget", () => {
    const result = campaignEditSchema.safeParse({
      ...validCampaignForm,
      dailyBudget: 5000,
      totalBudget: 1000,
    });

    expect(result.success).toBe(false);
  });

  it("rejects an end date before the start date", () => {
    const result = campaignEditSchema.safeParse({
      ...validCampaignForm,
      startDate: "2026-07-01",
      endDate: "2026-06-01",
    });

    expect(result.success).toBe(false);
  });
});
