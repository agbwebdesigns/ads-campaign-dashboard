import {
  mockCampaigns,
  type Campaign,
  type CampaignStatus,
} from "../data/mockCampaigns.ts";
import type { CampaignEditFormValues } from "../features/campaigns/campaignValidation";

export type CampaignSortField =
  | "name"
  | "advertiserName"
  | "status"
  | "totalBudget"
  | "spend"
  | "impressions"
  | "reach"
  | "clicks"
  | "startDate"
  | "endDate";

export type SortDirection = "asc" | "desc";

export type CampaignFilters = {
  search?: string;
  status?: CampaignStatus | "all";
  sortBy?: CampaignSortField;
  sortDirection?: SortDirection;
  page?: number;
  pageSize?: number;
};

export type CampaignsResponse = {
  campaigns: Campaign[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
};

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function getCampaigns(
  filters: CampaignFilters,
): Promise<CampaignsResponse> {
  await wait(600);

  const search = filters.search?.toLowerCase().trim() ?? "";
  const status = filters.status ?? "all";
  const sortBy = filters.sortBy ?? "spend";
  const sortDirection = filters.sortDirection ?? "desc";
  const page = filters.page ?? 1;
  const pageSize = filters.pageSize ?? 10;

  const filteredCampaigns = mockCampaigns.filter((campaign) => {
    const matchesSearch =
      campaign.name.toLowerCase().includes(search) ||
      campaign.advertiserName.toLowerCase().includes(search);

    const matchesStatus = status === "all" || campaign.status === status;

    return matchesSearch && matchesStatus;
  });

  const sortedCampaigns = [...filteredCampaigns].sort((a, b) =>
    compareCampaigns(a, b, sortBy, sortDirection),
  );

  const totalCount = sortedCampaigns.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  const safePage = Math.min(Math.max(page, 1), totalPages);

  const startIndex = (safePage - 1) * pageSize;
  const endIndex = startIndex + pageSize;

  return {
    campaigns: sortedCampaigns.slice(startIndex, endIndex),
    totalCount,
    page: safePage,
    pageSize,
    totalPages,
  };
}

export async function updateCampaign(
  campaignId: string,
  values: CampaignEditFormValues,
): Promise<Campaign> {
  await wait(700);

  const campaign = mockCampaigns.find((item) => item.id === campaignId);

  if (!campaign) {
    throw new Error("Campaign not found");
  }

  if (values.name.toLowerCase().includes("fail")) {
    throw new Error("Test save failure");
  }

  campaign.name = values.name;
  campaign.status = values.status;
  campaign.dailyBudget = values.dailyBudget;
  campaign.totalBudget = values.totalBudget;
  campaign.startDate = values.startDate;
  campaign.endDate = values.endDate;

  return campaign;
}

function compareCampaigns(
  a: Campaign,
  b: Campaign,
  sortBy: CampaignSortField,
  sortDirection: SortDirection,
): number {
  const aValue = a[sortBy];
  const bValue = b[sortBy];

  let result = 0;

  if (typeof aValue === "number" && typeof bValue === "number") {
    result = aValue - bValue;
  } else {
    result = String(aValue).localeCompare(String(bValue));
  }

  return sortDirection === "asc" ? result : -result;
}
