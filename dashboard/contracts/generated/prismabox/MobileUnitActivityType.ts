import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const MobileUnitActivityType = t.Union(
  [
    t.Literal("CREATED"),
    t.Literal("UPDATED"),
    t.Literal("ENABLED"),
    t.Literal("DISABLED"),
    t.Literal("DELETED"),
    t.Literal("STATUS_CHANGED"),
    t.Literal("CREW_ADDED"),
    t.Literal("CREW_REMOVED"),
    t.Literal("DEVICE_PAIRED"),
    t.Literal("DEVICE_REVOKED"),
    t.Literal("SHIFT_STARTED"),
    t.Literal("SHIFT_ENDED"),
    t.Literal("STOCK_RECEIVED"),
    t.Literal("VISIT_ASSIGNED"),
    t.Literal("VISIT_UNASSIGNED"),
  ],
  { additionalProperties: false },
);
