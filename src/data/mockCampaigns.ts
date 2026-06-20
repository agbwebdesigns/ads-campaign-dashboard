export type CampaignStatus =
  | "draft"
  | "active"
  | "paused"
  | "completed"
  | "archived";

export type Campaign = {
  id: string;
  name: string;
  advertiserName: string;
  status: CampaignStatus;
  dailyBudget: number;
  totalBudget: number;
  spend: number;
  impressions: number;
  reach: number;
  clicks: number;
  startDate: string;
  endDate: string;
};

export const mockCampaigns: Campaign[] = [
  {
    id: "cmp_001",
    name: "Summer Movie Launch",
    advertiserName: "Acme Studios",
    status: "active",
    dailyBudget: 2500,
    totalBudget: 50000,
    spend: 18320,
    impressions: 1420000,
    reach: 620000,
    clicks: 18400,
    startDate: "2026-06-01",
    endDate: "2026-06-30",
  },
  {
    id: "cmp_002",
    name: "Streaming Device Promo",
    advertiserName: "Northstar Electronics",
    status: "paused",
    dailyBudget: 1000,
    totalBudget: 20000,
    spend: 7400,
    impressions: 510000,
    reach: 240000,
    clicks: 6300,
    startDate: "2026-06-05",
    endDate: "2026-07-05",
  },
  {
    id: "cmp_003",
    name: "Family Plan Awareness",
    advertiserName: "Bright Mobile",
    status: "active",
    dailyBudget: 1800,
    totalBudget: 36000,
    spend: 22100,
    impressions: 1900000,
    reach: 870000,
    clicks: 25600,
    startDate: "2026-05-20",
    endDate: "2026-06-25",
  },
  {
    id: "cmp_004",
    name: "Holiday Preview Campaign",
    advertiserName: "Metro Retail",
    status: "draft",
    dailyBudget: 3000,
    totalBudget: 90000,
    spend: 0,
    impressions: 0,
    reach: 0,
    clicks: 0,
    startDate: "2026-11-01",
    endDate: "2026-12-24",
  },
];
