import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const LabActivityType = t.Union(
  [
    t.Literal("CREATED"),
    t.Literal("STATUS_CHANGED"),
    t.Literal("STAGE_CHANGED"),
    t.Literal("ASSIGNED"),
    t.Literal("SAMPLE_COLLECTED"),
    t.Literal("RESULTS_SAVED"),
    t.Literal("SENT_TO_REVIEW"),
    t.Literal("QC_REVIEWED"),
    t.Literal("APPROVED"),
    t.Literal("REJECTED"),
    t.Literal("DECLINED"),
    t.Literal("INVOICE_PAID"),
  ],
  { additionalProperties: false },
);
