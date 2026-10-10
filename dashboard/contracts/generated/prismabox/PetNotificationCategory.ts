import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const PetNotificationCategory = t.Union(
  [
    t.Literal("APPOINTMENT"),
    t.Literal("REMINDER_DUE"),
    t.Literal("RESULTS"),
    t.Literal("BILLING"),
    t.Literal("CHAT"),
    t.Literal("MARKETING"),
  ],
  { additionalProperties: false },
);
