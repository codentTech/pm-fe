"use client";

import CustomInput from "@/common/components/custom-input/custom-input.component";
import SimpleSelect from "@/common/components/dropdowns/simple-select/simple-select";
import { CalendarDays } from "lucide-react";

export default function ProjectsDashboardFilterBar({
  selectedFromDate,
  selectedToDate,
  selectedStatus,
  selectedDeliveryType,
  selectedRiskLevel,
  statusOptions,
  deliveryTypeOptions,
  riskLevelOptions,
  setSelectedFromDate,
  setSelectedToDate,
  setSelectedStatus,
  setSelectedDeliveryType,
  setSelectedRiskLevel,
}) {
  return (
    <div className="grid gap-3 rounded-lg border-y bg-gray-100 p-4 sm:grid-cols-2 lg:grid-cols-5">
      <div className="w-full">
        <CustomInput
          label="From"
          size="sm"
          labelClassName="text-[11px] font-semibold uppercase tracking-wide text-neutral-500"
          variant="bordered"
          type="date"
          name="fromDateFilter"
          value={selectedFromDate}
          onChange={(e) => setSelectedFromDate(e.target.value)}
          startIcon={<CalendarDays className="h-4 w-4 text-neutral-400" />}
        />
      </div>
      <div className="w-full">
        <CustomInput
          label="To"
          size="sm"
          labelClassName="text-[11px] font-semibold uppercase tracking-wide text-neutral-500"
          variant="bordered"
          type="date"
          name="toDateFilter"
          value={selectedToDate}
          onChange={(e) => setSelectedToDate(e.target.value)}
          startIcon={<CalendarDays className="h-4 w-4 text-neutral-400" />}
        />
      </div>
      <div className="w-full">
        <SimpleSelect
          label="Status"
          size="sm"
          labelClassName="text-[11px] font-semibold uppercase tracking-wide text-neutral-500"
          variant="bordered"
          placeholder="All statuses"
          value={selectedStatus}
          options={statusOptions}
          onChange={(value) => setSelectedStatus(value)}
        />
      </div>
      <div className="w-full">
        <SimpleSelect
          label="Delivery type"
          size="sm"
          labelClassName="text-[11px] font-semibold uppercase tracking-wide text-neutral-500"
          variant="bordered"
          placeholder="All types"
          value={selectedDeliveryType}
          options={deliveryTypeOptions}
          onChange={(value) => setSelectedDeliveryType(value)}
        />
      </div>
      <div className="w-full">
        <SimpleSelect
          label="Risk level"
          size="sm"
          labelClassName="text-[11px] font-semibold uppercase tracking-wide text-neutral-500"
          variant="bordered"
          placeholder="All risk levels"
          value={selectedRiskLevel}
          options={riskLevelOptions}
          onChange={(value) => setSelectedRiskLevel(value)}
        />
      </div>
    </div>
  );
}
