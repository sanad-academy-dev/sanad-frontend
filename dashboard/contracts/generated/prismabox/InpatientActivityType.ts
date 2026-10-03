import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const InpatientActivityType = t.Union(
  [
    t.Literal("ADMITTED"),
    t.Literal("STATUS_CHANGED"),
    t.Literal("CAGE_ASSIGNED"),
    t.Literal("CAGE_MOVED"),
    t.Literal("ACUITY_CHANGED"),
    t.Literal("ATTENDING_CHANGED"),
    t.Literal("ORDER_CREATED"),
    t.Literal("ORDER_DISCONTINUED"),
    t.Literal("ADMINISTRATION"),
    t.Literal("VITALS_RECORDED"),
    t.Literal("ALERT"),
    t.Literal("NOTE"),
    t.Literal("HANDOVER"),
    t.Literal("COMPLICATION"),
    t.Literal("INVOICE_PAID"),
    t.Literal("DISCHARGED"),
  ],
  { additionalProperties: false },
);
