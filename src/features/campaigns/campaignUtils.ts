import type { Campaign } from "../../data/mockCampaigns";

export function calculateCpm(spend: number, impressions: number): number {
  if (impressions <= 0) return 0;
  return (spend / impressions) * 1000;
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat("en-US").format(value);
}

export function getTotalSpend(campaigns: Campaign[]): number {
  return campaigns.reduce((total, campaign) => total + campaign.spend, 0);
}

export function getTotalImpressions(campaigns: Campaign[]): number {
  return campaigns.reduce((total, campaign) => total + campaign.impressions, 0);
}

export function getTotalReach(campaigns: Campaign[]): number {
  return campaigns.reduce((total, campaign) => total + campaign.reach, 0);
}

export function getActiveCampaignCount(campaigns: Campaign[]): number {
  return campaigns.filter((campaign) => campaign.status === "active").length;
}
