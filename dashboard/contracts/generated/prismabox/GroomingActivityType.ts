import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const GroomingActivityType = t.Union(
  [
    t.Literal("CREATED"),
    t.Literal("STATUS_CHANGED"),
    t.Literal("STAGE_CHANGED"),
    t.Literal("GATE_OVERRIDDEN"),
    t.Literal("QUOTE_RECALCULATED"),
    t.Literal("QUOTE_APPROVED"),
    t.Literal("LANE_ESCALATED"),
    t.Literal("INTAKE_RECORDED"),
    t.Literal("ITEM_CHANGED"),
    t.Literal("PRODUCT_ISSUED"),
    t.Literal("PHOTO_ADDED"),
    t.Literal("FINDING_ADDED"),
    t.Literal("FINDING_ESCALATED"),
    t.Literal("INCIDENT_REPORTED"),
    t.Literal("INCIDENT_RESOLVED"),
    t.Literal("REPORT_CARD_SENT"),
    t.Literal("INVOICE_ISSUED"),
    t.Literal("INVOICE_PAID"),
    t.Literal("COMMENT"),
  ],
  {
    additionalProperties: false,
    description: `نوع حدث في سجل نشاط الجلسة — السجل إلحاقي لا يُعدَّل ولا يُحذف`,
  },
);
