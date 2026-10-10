import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const ArrivalSource = t.Union(
  [
    t.Literal("WALK_IN"),
    t.Literal("PHONE"),
    t.Literal("PUBLIC_BOOKING"),
    t.Literal("PET_PORTAL"),
    t.Literal("AGENT"),
    t.Literal("REFERRAL"),
    t.Literal("MOBILE_REQUEST"),
    t.Literal("SCHEDULED_VISIT"),
  ],
  { additionalProperties: false },
);
