import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CampaignEditForm } from "./CampaignEditForm";
import type { Campaign } from "../../data/mockCampaigns";

const campaign: Campaign = {
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
};

describe("CampaignEditForm", () => {
  it("renders campaign values", () => {
    render(
      <CampaignEditForm
        campaign={campaign}
        isSaving={false}
        onCancel={vi.fn()}
        onSubmit={vi.fn()}
      />,
    );

    expect(screen.getByDisplayValue("Summer Movie Launch")).toBeInTheDocument();
    expect(screen.getByDisplayValue("2500")).toBeInTheDocument();
    expect(screen.getByDisplayValue("50000")).toBeInTheDocument();
  });

  it("shows validation error for empty campaign name", async () => {
    const user = userEvent.setup();

    render(
      <CampaignEditForm
        campaign={campaign}
        isSaving={false}
        onCancel={vi.fn()}
        onSubmit={vi.fn()}
      />,
    );

    const nameInput = screen.getByLabelText(/campaign name/i);

    await user.clear(nameInput);
    await user.click(screen.getByRole("button", { name: /save changes/i }));

    expect(
      await screen.findByText(/campaign name is required/i),
    ).toBeInTheDocument();
  });

  it("calls onSubmit with valid changed values", async () => {
    const user = userEvent.setup();
    const handleSubmit = vi.fn();

    render(
      <CampaignEditForm
        campaign={campaign}
        isSaving={false}
        onCancel={vi.fn()}
        onSubmit={handleSubmit}
      />,
    );

    const nameInput = screen.getByLabelText(/campaign name/i);

    await user.clear(nameInput);
    await user.type(nameInput, "Updated Campaign");
    await user.click(screen.getByRole("button", { name: /save changes/i }));

    expect(handleSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        name: "Updated Campaign",
      }),
      expect.anything(),
    );
  });

  it("disables save button while saving", () => {
    render(
      <CampaignEditForm
        campaign={campaign}
        isSaving={true}
        onCancel={vi.fn()}
        onSubmit={vi.fn()}
      />,
    );

    expect(screen.getByRole("button", { name: /saving/i })).toBeDisabled();
  });
});
