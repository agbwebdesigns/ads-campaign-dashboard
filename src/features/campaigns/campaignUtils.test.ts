import { describe, expect, it } from "vitest";
import {
  calculateCpm,
  getActiveCampaignCount,
  getTotalImpressions,
  getTotalReach,
  getTotalSpend,
} from "./campaignUtils";
import type { Campaign } from "../../data/mockCampaigns";

const campaigns: Campaign[] = [
  {
    id: "cmp_001",
    name: "Test Campaign One",
    advertiserName: "Acme",
    status: "active",
    dailyBudget: 100,
    totalBudget: 1000,
    spend: 500,
    impressions: 100000,
    reach: 50000,
    clicks: 1000,
    startDate: "2026-06-01",
    endDate: "2026-06-30",
  },
  {
    id: "cmp_002",
    name: "Test Campaign Two",
    advertiserName: "Northstar",
    status: "paused",
    dailyBudget: 200,
    totalBudget: 2000,
    spend: 250,
    impressions: 50000,
    reach: 25000,
    clicks: 400,
    startDate: "2026-07-01",
    endDate: "2026-07-31",
  },
];

describe("campaignUtils", () => {
  it("calculates CPM", () => {
    expect(calculateCpm(500, 100000)).toBe(5);
  });

  it("returns 0 CPM when impressions are 0", () => {
    expect(calculateCpm(500, 0)).toBe(0);
  });

  it("totals campaign spend", () => {
    expect(getTotalSpend(campaigns)).toBe(750);
  });

  it("totals impressions", () => {
    expect(getTotalImpressions(campaigns)).toBe(150000);
  });

  it("totals reach", () => {
    expect(getTotalReach(campaigns)).toBe(75000);
  });

  it("counts active campaigns", () => {
    expect(getActiveCampaignCount(campaigns)).toBe(1);
  });
});
