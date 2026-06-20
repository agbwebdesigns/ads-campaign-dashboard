import { describe, expect, it } from "vitest";
import { getCampaigns } from "../../api/campaignsApi.ts";

describe("campaignsApi", () => {
  it("returns paginated campaign results", async () => {
    const response = await getCampaigns({
      page: 1,
      pageSize: 2,
      sortBy: "spend",
      sortDirection: "desc",
    });

    expect(response.campaigns.length).toBeLessThanOrEqual(2);
    expect(response.page).toBe(1);
    expect(response.pageSize).toBe(2);
    expect(response.totalCount).toBeGreaterThan(0);
    expect(response.totalPages).toBeGreaterThan(0);
  });

  it("filters campaigns by status", async () => {
    const response = await getCampaigns({
      status: "active",
      page: 1,
      pageSize: 25,
    });

    expect(
      response.campaigns.every((campaign) => campaign.status === "active"),
    ).toBe(true);
  });

  it("filters campaigns by search term", async () => {
    const response = await getCampaigns({
      search: "summer",
      page: 1,
      pageSize: 25,
    });

    expect(
      response.campaigns.every(
        (campaign) =>
          campaign.name.toLowerCase().includes("summer") ||
          campaign.advertiserName.toLowerCase().includes("summer"),
      ),
    ).toBe(true);
  });

  it("sorts campaigns by spend descending", async () => {
    const response = await getCampaigns({
      sortBy: "spend",
      sortDirection: "desc",
      page: 1,
      pageSize: 25,
    });

    const spends = response.campaigns.map((campaign) => campaign.spend);

    expect(spends).toEqual([...spends].sort((a, b) => b - a));
  });
});
