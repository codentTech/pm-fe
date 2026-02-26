"use client";

import CustomButton from "@/common/components/custom-button/custom-button.component";
import PageHeader from "@/common/components/page-header/page-header.component";
import { Bar, Pie } from "react-chartjs-2";
import { AlertTriangle, ClipboardList, ListChecks, Target } from "lucide-react";
import ProjectsDashboardFilterBar from "./components/projects-dashboard-filter-bar.component";
import useProjectsDashboardLogic from "./use-projects-dashboard.hook";

export default function ProjectsDashboard() {
  const {
    analyticsSummary,
    fetchState,
    statusPieData,
    projectsByDateData,
    deliveryTypeBarData,
    pieOptions,
    barOptions,
    selectedFromDate,
    selectedToDate,
    selectedStatus,
    selectedDeliveryType,
    selectedRiskLevel,
    setSelectedFromDate,
    setSelectedToDate,
    setSelectedStatus,
    setSelectedDeliveryType,
    setSelectedRiskLevel,
    statusOptions,
    deliveryTypeOptions,
    riskLevelOptions,
    handleCreateProject,
    handleViewProjects,
  } = useProjectsDashboardLogic();

  const isLoading = fetchState?.isLoading;

  return (
    <div className="min-h-full">
      <PageHeader
        title="Projects Dashboard"
        subtitle="Overview of projects by status, delivery type, and risk"
        actions={
          <div className="flex items-center gap-2">
            <CustomButton
              text="View all"
              variant="secondary"
              onClick={handleViewProjects}
            />
            <CustomButton
              text="Create project"
              variant="primary"
              onClick={handleCreateProject}
            />
          </div>
        }
      />

      <div className="space-y-4 px-4 pb-10 sm:px-5">
        {/* Summary cards — same pattern as Daily Updates / Bid Dashboard */}
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              label: "Total projects",
              value: analyticsSummary.totalProjects,
              icon: ClipboardList,
              bg: "bg-indigo-100 border-indigo-200",
            },
            {
              label: "Active",
              value: analyticsSummary.activeCount,
              icon: ListChecks,
              bg: "bg-sky-100 border-sky-200",
            },
            {
              label: "Completed",
              value: analyticsSummary.completedCount,
              icon: Target,
              bg: "bg-emerald-100 border-emerald-200",
            },
            {
              label: "High risk",
              value: analyticsSummary.highRiskCount,
              icon: AlertTriangle,
              bg: "bg-rose-100 border-rose-200",
            },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.label}
                className={`rounded-lg border px-4 py-3 shadow-sm ${item.bg}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm font-semibold text-neutral-600">
                    <Icon className="h-4 w-4 text-indigo-600" />
                    {item.label}
                  </div>
                  <div className="text-2xl font-semibold text-neutral-800">
                    {item.value}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Filters */}
        <ProjectsDashboardFilterBar
          selectedFromDate={selectedFromDate}
          selectedToDate={selectedToDate}
          selectedStatus={selectedStatus}
          selectedDeliveryType={selectedDeliveryType}
          selectedRiskLevel={selectedRiskLevel}
          statusOptions={statusOptions}
          deliveryTypeOptions={deliveryTypeOptions}
          riskLevelOptions={riskLevelOptions}
          setSelectedFromDate={setSelectedFromDate}
          setSelectedToDate={setSelectedToDate}
          setSelectedStatus={setSelectedStatus}
          setSelectedDeliveryType={setSelectedDeliveryType}
          setSelectedRiskLevel={setSelectedRiskLevel}
        />

        {/* Charts */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-lg border border-neutral-200 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-neutral-800">
                Status distribution
              </p>
              {isLoading && (
                <span className="text-xs text-neutral-500">Loading…</span>
              )}
            </div>
            <div className="mt-4 h-56">
              <Pie data={statusPieData} options={pieOptions} />
            </div>
          </div>

          <div className="rounded-lg border border-neutral-200 bg-white p-4 shadow-sm">
            <p className="text-sm font-semibold text-neutral-800">
              Projects by start date
            </p>
            <div className="mt-4 h-56">
              <Bar data={projectsByDateData} options={barOptions} />
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-neutral-200 bg-white p-4 shadow-sm">
          <p className="text-sm font-semibold text-neutral-800">
            Projects by delivery type
          </p>
          <div className="mt-4 h-64">
            <Bar data={deliveryTypeBarData} options={barOptions} />
          </div>
        </div>
      </div>
    </div>
  );
}
