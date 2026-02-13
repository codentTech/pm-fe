import Link from "next/link";
import { Controller } from "react-hook-form";
import { ExternalLink } from "lucide-react";
import SimpleSelect from "@/common/components/dropdowns/simple-select/simple-select.jsx";
import useWorkItemReferenceSelect from "./use-work-item-reference-select.hook";

export default function WorkItemReferenceSelect({
  form,
  baseName,
  itemErrors,
}) {
  const {
    isTicketType,
    isBidType,
    requiresReference,
    referenceOptions,
    loading,
    referenceId,
  } = useWorkItemReferenceSelect({ form, baseName });

  if (!requiresReference) {
    return null;
  }

  return (
    <div className="space-y-1">
      <Controller
        control={form.control}
        name={`${baseName}.ReferenceId`}
        render={({ field }) => (
          <SimpleSelect
            label={isTicketType ? "Ticket ID" : "Bid ID"}
            name="ReferenceId"
            placeholder={isTicketType ? "Search tickets..." : "Select bid..."}
            options={referenceOptions}
            value={field.value}
            onChange={field.onChange}
            loading={loading}
            errors={itemErrors}
            isRequired={requiresReference}
            noOptionsMessage={
              isTicketType ? "Start typing to search tickets" : "No bids found"
            }
          />
        )}
      />
      <div className="flex items-center justify-between">
        <p className="text-xs text-neutral-500">
          Please select the related ticket or bid.
        </p>
        {referenceId && isBidType && (
          <Link
            href={`/bids/${referenceId}`}
            className="inline-flex items-center gap-1 text-xs text-primary-600 hover:text-primary-700"
          >
            Open bid
            <ExternalLink className="h-3 w-3.5" />
          </Link>
        )}
      </div>
    </div>
  );
}
