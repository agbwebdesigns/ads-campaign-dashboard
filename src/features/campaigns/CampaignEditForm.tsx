import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Campaign } from "../../data/mockCampaigns";
import {
  campaignEditSchema,
  type CampaignEditFormValues,
} from "./campaignValidation";

type CampaignEditFormProps = {
  campaign: Campaign;
  isSaving: boolean;
  onCancel: () => void;
  onSubmit: (values: CampaignEditFormValues) => void;
};

export function CampaignEditForm({
  campaign,
  isSaving,
  onCancel,
  onSubmit,
}: CampaignEditFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<CampaignEditFormValues>({
    resolver: zodResolver(campaignEditSchema),
    defaultValues: {
      name: campaign.name,
      status: campaign.status,
      dailyBudget: campaign.dailyBudget,
      totalBudget: campaign.totalBudget,
      startDate: campaign.startDate,
      endDate: campaign.endDate,
    },
  });

  return (
    <form className="edit-form" onSubmit={handleSubmit(onSubmit)}>
      <label>
        Campaign Name
        <input {...register("name")} />
        {errors.name && <span>{errors.name.message}</span>}
      </label>

      <label>
        Status
        <select {...register("status")}>
          <option value="draft">Draft</option>
          <option value="active">Active</option>
          <option value="paused">Paused</option>
          <option value="completed">Completed</option>
          <option value="archived">Archived</option>
        </select>
        {errors.status && <span>{errors.status.message}</span>}
      </label>

      <label>
        Daily Budget
        <input type="number" {...register("dailyBudget")} />
        {errors.dailyBudget && <span>{errors.dailyBudget.message}</span>}
      </label>

      <label>
        Total Budget
        <input type="number" {...register("totalBudget")} />
        {errors.totalBudget && <span>{errors.totalBudget.message}</span>}
      </label>

      <label>
        Start Date
        <input type="date" {...register("startDate")} />
        {errors.startDate && <span>{errors.startDate.message}</span>}
      </label>

      <label>
        End Date
        <input type="date" {...register("endDate")} />
        {errors.endDate && <span>{errors.endDate.message}</span>}
      </label>

      <div className="form-actions">
        <button type="button" onClick={onCancel} disabled={isSaving}>
          Cancel
        </button>

        <button type="submit" disabled={isSaving || !isDirty}>
          {isSaving ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </form>
  );
}
