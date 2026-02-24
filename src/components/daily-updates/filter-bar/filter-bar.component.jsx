"use client";

import CustomInput from "@/common/components/custom-input/custom-input.component";
import SimpleSelect from "@/common/components/dropdowns/simple-select/simple-select";
import { CalendarDays } from "lucide-react";

export default function DailyUpdatesFilterBar({
  selectedFromDate,
  selectedToDate,
  selectedUserId,
  selectedRole,
  selectedStatus,
  memberOptions,
  roleOptions,
  statusOptions,
  setSelectedFromDate,
  setSelectedToDate,
  setSelectedUserId,
  setSelectedRole,
  setSelectedStatus,
  showUserFilter = true,
}) {
  return (
    <div className={`grid gap-3 sm:grid-cols-2 ${showUserFilter ? "lg:grid-cols-5" : "lg:grid-cols-4"}`}>
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
      {showUserFilter && (
        <div className="w-full">
          <SimpleSelect
            label="User"
            size="sm"
            labelClassName="text-[11px] font-semibold uppercase tracking-wide text-neutral-500"
            variant="bordered"
            placeholder="All users"
            value={selectedUserId}
            options={memberOptions}
            onChange={(value) => setSelectedUserId(value)}
          />
        </div>
      )}
      <div className="w-full">
        <SimpleSelect
          label="Role"
          size="sm"
          labelClassName="text-[11px] font-semibold uppercase tracking-wide text-neutral-500"
          variant="bordered"
          placeholder="All roles"
          value={selectedRole}
          options={roleOptions}
          onChange={(value) => setSelectedRole(value)}
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
    </div>
  );
}
