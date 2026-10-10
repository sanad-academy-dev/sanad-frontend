import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const MobileVisitFailureReason = t.Union(
  [
    t.Literal("NO_ANSWER"),
    t.Literal("ADDRESS_NOT_FOUND"),
    t.Literal("ACCESS_DENIED"),
    t.Literal("PET_UNAVAILABLE"),
    t.Literal("OWNER_CANCELLED"),
    t.Literal("VEHICLE_ISSUE"),
    t.Literal("WEATHER"),
    t.Literal("OTHER"),
  ],
  { additionalProperties: false },
);
