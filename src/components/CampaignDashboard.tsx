import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  mockCampaigns,
  type Campaign,
  type CampaignStatus,
} from "../data/mockCampaigns.ts";
import {
  calculateCpm,
  formatCurrency,
  formatNumber,
  getActiveCampaignCount,
  getTotalImpressions,
  getTotalReach,
  getTotalSpend,
} from "../features/campaigns/campaignUtils.ts";
import { getCampaigns } from "../api/campaignsApi.ts";
import { useDebouncedValue } from "../hooks/useDebouncedValue.ts";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateCampaign } from "../api/campaignsApi";
import { CampaignEditForm } from "../features/campaigns/CampaignEditForm";
import type { CampaignEditFormValues } from "../features/campaigns/campaignValidation.ts";
import { useSearchParams } from "react-router-dom";
import type { CampaignSortField, SortDirection } from "../api/campaignsApi";

export function CampaignDashboard() {
  const [searchParams, setSearchParams] = useSearchParams();
  const search = searchParams.get("search") ?? "";
  const statusFilter =
    (searchParams.get("status") as CampaignStatus | "all" | null) ?? "all";
  const debouncedSearch = useDebouncedValue(search, 300);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(
    null,
  );
  const [isEditing, setIsEditing] = useState(false);
  const [sortBy, setSortBy] = useState<CampaignSortField>("spend");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const { data, isLoading, isError, isFetching } = useQuery({
    queryKey: [
      "campaigns",
      {
        search: search,
        status: statusFilter,
        sortBy,
        sortDirection,
        page,
        pageSize,
      },
    ],
    queryFn: () =>
      getCampaigns({
        search: search,
        status: statusFilter,
        sortBy,
        sortDirection,
        page,
        pageSize,
      }),
  });

  const campaigns = data?.campaigns ?? [];
  const totalCount = data?.totalCount ?? 0;
  const currentPage = data?.page ?? page;
  const totalPages = data?.totalPages ?? 1;

  const queryClient = useQueryClient();

  const updateCampaignMutation = useMutation({
    mutationFn: ({
      campaignId,
      values,
    }: {
      campaignId: string;
      values: CampaignEditFormValues;
    }) => updateCampaign(campaignId, values),

    onSuccess: (updatedCampaign) => {
      setSelectedCampaign(updatedCampaign);
      setIsEditing(false);

      queryClient.invalidateQueries({
        queryKey: ["campaigns"],
      });
    },
  });

  const filteredCampaigns = useMemo(() => {
    return mockCampaigns.filter((campaign) => {
      const matchesSearch =
        campaign.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        campaign.advertiserName
          .toLowerCase()
          .includes(debouncedSearch.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || campaign.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [debouncedSearch, statusFilter]);

  function handleSortByChange(value: CampaignSortField) {
    setSortBy(value);
    setPage(1);
  }

  function handleSortDirectionChange(value: SortDirection) {
    setSortDirection(value);
    setPage(1);
  }

  function handlePageSizeChange(value: number) {
    setPageSize(value);
    setPage(1);
  }

  return (
    <main className="dashboard">
      <header className="dashboard-header">
        <div>
          <p className="eyebrow">Ads Engineering</p>
          <h1>Campaign Console</h1>
        </div>
      </header>

      <section className="metric-grid">
        <article className="metric-card">
          <span>Total Spend</span>
          <strong>{formatCurrency(getTotalSpend(campaigns))}</strong>
        </article>

        <article className="metric-card">
          <span>Impressions</span>
          <strong>{formatNumber(getTotalImpressions(campaigns))}</strong>
        </article>

        <article className="metric-card">
          <span>Reach</span>
          <strong>{formatNumber(getTotalReach(campaigns))}</strong>
        </article>

        <article className="metric-card">
          <span>Active Campaigns</span>
          <strong>{getActiveCampaignCount(campaigns)}</strong>
        </article>
      </section>

      <section className="toolbar">
        <input
          value={search}
          onChange={(event) => {
            const nextSearch = event.target.value;

            setSearchParams((currentParams) => {
              const nextParams = new URLSearchParams(currentParams);

              if (nextSearch) {
                nextParams.set("search", nextSearch);
              } else {
                nextParams.delete("search");
              }

              return nextParams;
            });
          }}
          placeholder="Search campaigns or advertisers..."
        />

        <select
          value={statusFilter}
          onChange={(event) => {
            const nextStatus = event.target.value as CampaignStatus | "all";

            setSearchParams((currentParams) => {
              const nextParams = new URLSearchParams(currentParams);

              if (nextStatus === "all") {
                nextParams.delete("status");
              } else {
                nextParams.set("status", nextStatus);
              }

              return nextParams;
            });
          }}
        >
          <option value="all">All statuses</option>
          <option value="draft">Draft</option>
          <option value="active">Active</option>
          <option value="paused">Paused</option>
          <option value="completed">Completed</option>
          <option value="archived">Archived</option>
        </select>
      </section>

      {isLoading && <div className="state-message">Loading campaigns...</div>}

      {isError && (
        <div className="state-message error">Unable to load campaigns.</div>
      )}

      {isFetching && !isLoading && (
        <div className="state-message subtle">Refreshing campaign data...</div>
      )}

      {!isLoading && !isError && campaigns.length === 0 && (
        <div className="empty-state">
          No campaigns match your current filters.
        </div>
      )}

      <div className="sort-controls">
        <label>
          Sort by
          <select
            value={sortBy}
            onChange={(event) =>
              handleSortByChange(event.target.value as CampaignSortField)
            }
          >
            <option value="spend">Spend</option>
            <option value="impressions">Impressions</option>
            <option value="reach">Reach</option>
            <option value="clicks">Clicks</option>
            <option value="totalBudget">Total Budget</option>
            <option value="name">Campaign Name</option>
            <option value="advertiserName">Advertiser</option>
            <option value="status">Status</option>
            <option value="startDate">Start Date</option>
            <option value="endDate">End Date</option>
          </select>
        </label>

        <label>
          Direction
          <select
            value={sortDirection}
            onChange={(event) =>
              handleSortDirectionChange(event.target.value as SortDirection)
            }
          >
            <option value="desc">Descending</option>
            <option value="asc">Ascending</option>
          </select>
        </label>

        <label>
          Rows
          <select
            value={pageSize}
            onChange={(event) =>
              handlePageSizeChange(Number(event.target.value))
            }
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={25}>25</option>
          </select>
        </label>
      </div>

      <section className="table-card">
        <table>
          <thead>
            <tr>
              <th>Campaign</th>
              <th>Advertiser</th>
              <th>Status</th>
              <th>Budget</th>
              <th>Spend</th>
              <th>Impressions</th>
              <th>CPM</th>
            </tr>
          </thead>

          <tbody>
            {campaigns.map((campaign) => (
              <tr
                key={campaign.id}
                onClick={() => setSelectedCampaign(campaign)}
                className="clickable-row"
              >
                <td>{campaign.name}</td>
                <td>{campaign.advertiserName}</td>
                <td>
                  <span className={`status-badge status-${campaign.status}`}>
                    {campaign.status}
                  </span>
                </td>
                <td>{formatCurrency(campaign.totalBudget)}</td>
                <td>{formatCurrency(campaign.spend)}</td>
                <td>{formatNumber(campaign.impressions)}</td>
                <td>
                  {formatCurrency(
                    calculateCpm(campaign.spend, campaign.impressions),
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="pagination">
          <span>
            Page {currentPage} of {totalPages} — {totalCount} campaigns
          </span>

          <div className="pagination-actions">
            <button
              type="button"
              onClick={() => setPage((current) => Math.max(current - 1, 1))}
              disabled={currentPage <= 1 || isFetching}
            >
              Previous
            </button>

            <button
              type="button"
              onClick={() =>
                setPage((current) => Math.min(current + 1, totalPages))
              }
              disabled={currentPage >= totalPages || isFetching}
            >
              Next
            </button>
          </div>
        </div>

        {filteredCampaigns.length === 0 && (
          <div className="empty-state">
            No campaigns match your current filters.
          </div>
        )}
      </section>

      {selectedCampaign && (
        <aside className="detail-panel">
          <header className="detail-panel-header">
            <div className="detail-panel-title-group">
              <h2>{isEditing ? "Edit Campaign" : selectedCampaign.name}</h2>
              <p>{selectedCampaign.advertiserName}</p>
            </div>

            <div className="detail-panel-actions">
              {!isEditing && (
                <button
                  className="primary-button"
                  onClick={() => setIsEditing(true)}
                >
                  Edit
                </button>
              )}

              <button
                className="close-button"
                onClick={() => {
                  setSelectedCampaign(null);
                  setIsEditing(false);
                }}
                aria-label="Close campaign detail panel"
              >
                ×
              </button>
            </div>
          </header>

          <div className="detail-panel-body">
            {!isEditing ? (
              <dl className="detail-list">
                <div className="detail-item">
                  <dt>Status</dt>
                  <dd>{selectedCampaign.status}</dd>
                </div>

                <div className="detail-item">
                  <dt>Total Budget</dt>
                  <dd>{formatCurrency(selectedCampaign.totalBudget)}</dd>
                </div>

                <div className="detail-item">
                  <dt>Daily Budget</dt>
                  <dd>{formatCurrency(selectedCampaign.dailyBudget)}</dd>
                </div>

                <div className="detail-item">
                  <dt>Spend</dt>
                  <dd>{formatCurrency(selectedCampaign.spend)}</dd>
                </div>

                <div className="detail-item">
                  <dt>Impressions</dt>
                  <dd>{formatNumber(selectedCampaign.impressions)}</dd>
                </div>

                <div className="detail-item">
                  <dt>Reach</dt>
                  <dd>{formatNumber(selectedCampaign.reach)}</dd>
                </div>

                <div className="detail-item">
                  <dt>Clicks</dt>
                  <dd>{formatNumber(selectedCampaign.clicks)}</dd>
                </div>

                <div className="detail-item">
                  <dt>CPM</dt>
                  <dd>
                    {formatCurrency(
                      calculateCpm(
                        selectedCampaign.spend,
                        selectedCampaign.impressions,
                      ),
                    )}
                  </dd>
                </div>

                <div className="detail-item full-width">
                  <dt>Flight Dates</dt>
                  <dd>
                    {selectedCampaign.startDate} — {selectedCampaign.endDate}
                  </dd>
                </div>
              </dl>
            ) : (
              <CampaignEditForm
                campaign={selectedCampaign}
                isSaving={updateCampaignMutation.isPending}
                onCancel={() => setIsEditing(false)}
                onSubmit={(values) =>
                  updateCampaignMutation.mutate({
                    campaignId: selectedCampaign.id,
                    values,
                  })
                }
              />
            )}

            {updateCampaignMutation.isError && (
              <div className="state-message error">
                Unable to save campaign changes. Please try again.
              </div>
            )}
          </div>
        </aside>
      )}
    </main>
  );
}
