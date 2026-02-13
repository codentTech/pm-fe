import * as yup from "yup";
import {
  DAILY_TIME_CAP_HOURS,
  WORK_ITEM_TYPES_BID,
  WORK_ITEM_TYPES_TICKET,
} from "./daily-update.constant";

export const WORK_ITEM_SCHEMA = yup.object({
  Type: yup.string().required("Work item type is required"),
  ReferenceId: yup
    .string()
    .transform((value) => (value === "" ? null : value))
    .nullable()
    .when("Type", (value, schema) => {
      if (WORK_ITEM_TYPES_TICKET.has(value)) {
        return schema.required("Ticket is required");
      }
      if (WORK_ITEM_TYPES_BID.has(value)) {
        return schema.required("Bid is required");
      }
      return schema.optional();
    }),
  Description: yup.string().trim().required("Description is required"),
  Status: yup.string().required("Status is required"),
  TimeSpent: yup
    .number()
    .transform((value, originalValue) =>
      originalValue === "" || originalValue == null ? null : value,
    )
    .nullable()
    .min(0, "Time spent must be 0 or more")
    .max(DAILY_TIME_CAP_HOURS, `Time spent cannot exceed ${DAILY_TIME_CAP_HOURS}h`),
  BlockerReason: yup.string().when("Status", {
    is: "blocked",
    then: (schema) => schema.required("Blocker reason is required"),
    otherwise: (schema) => schema.optional(),
  }),
  BlockerType: yup.string().nullable(),
  ExpectedResolutionDate: yup.string().nullable(),
  Comments: yup.string().nullable(),
});

export const DAILY_UPDATE_FORM_SCHEMA = yup.object({
  Date: yup.string().required("Date is required"),
  Role: yup.string().required("Role is required"),
  OverallStatus: yup.string().required("Overall status is required"),
  TotalTimeSpent: yup
    .number()
    .transform((value, originalValue) =>
      originalValue === "" || originalValue == null ? null : value,
    )
    .nullable()
    .required("Total time is required")
    .min(0, "Total time must be 0 or more"),
  Notes: yup.string().nullable(),
  NextDayPlan: yup.string().nullable(),
  WorkItems: yup.array().of(WORK_ITEM_SCHEMA).min(1, "At least one work item is required"),
});
