"use client";

import CustomInput from "@/common/components/custom-input/custom-input.component";
import SimpleSelect from "@/common/components/dropdowns/simple-select/simple-select";
import { CalendarDays } from "lucide-react";

export default function BidDashboardFilterBar({
  selectedFromDate,
  selectedToDate,
  selectedStatus,
  selectedPlatform,
  statusOptions,
  platformOptions,
  setSelectedFromDate,
  setSelectedToDate,
  setSelectedStatus,
  setSelectedPlatform,
}) {
  return (
    <div className="grid gap-3 rounded-lg border-y bg-gray-100 p-4 sm:grid-cols-2 lg:grid-cols-4">
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
          label="Platform"
          size="sm"
          labelClassName="text-[11px] font-semibold uppercase tracking-wide text-neutral-500"
          variant="bordered"
          placeholder="All platforms"
          value={selectedPlatform}
          options={platformOptions}
          onChange={(value) => setSelectedPlatform(value)}
        />
      </div>
    </div>
  );
}
