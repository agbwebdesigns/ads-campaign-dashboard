import { z } from "zod";

export const campaignEditSchema = z
  .object({
    name: z.string().min(1, "Campaign name is required"),
    status: z.enum(["draft", "active", "paused", "completed", "archived"]),
    dailyBudget: z.number().positive("Daily budget must be greater than 0"),
    totalBudget: z.number().positive("Total budget must be greater than 0"),
    startDate: z.string().min(1, "Start date is required"),
    endDate: z.string().min(1, "End date is required"),
  })
  .refine((data) => data.totalBudget >= data.dailyBudget, {
    message: "Total budget must be greater than or equal to daily budget",
    path: ["totalBudget"],
  })
  .refine((data) => new Date(data.endDate) >= new Date(data.startDate), {
    message: "End date must be after start date",
    path: ["endDate"],
  });

export type CampaignEditFormValues = z.infer<typeof campaignEditSchema>;
