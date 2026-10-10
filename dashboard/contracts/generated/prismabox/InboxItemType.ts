import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const InboxItemType = t.Union(
  [
    t.Literal("MEMBERSHIP"),
    t.Literal("INSURANCE"),
    t.Literal("LEAD"),
    t.Literal("DEAL"),
    t.Literal("APPOINTMENT_CANCELLED"),
    t.Literal("APPOINTMENT_NEW"),
    t.Literal("APPOINTMENT_PENDING"),
    t.Literal("APPOINTMENT_CONFIRMED"),
    t.Literal("INVOICE"),
    t.Literal("TASK"),
    t.Literal("SYSTEM"),
    t.Literal("LAB"),
    t.Literal("RADIOLOGY"),
    t.Literal("CARE"),
    t.Literal("STOCK"),
    t.Literal("MENTION"),
    t.Literal("OPERATION"),
    t.Literal("VACCINATION"),
    t.Literal("GROOMING"),
    t.Literal("INPATIENT"),
    t.Literal("TRIAGE"),
  ],
  { additionalProperties: false },
);
