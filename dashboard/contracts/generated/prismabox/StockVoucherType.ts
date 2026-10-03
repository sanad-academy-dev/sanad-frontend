import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const StockVoucherType = t.Union(
  [
    t.Literal("OPENING"),
    t.Literal("RECEIPT"),
    t.Literal("ISSUE"),
    t.Literal("SALE"),
    t.Literal("SALE_RETURN"),
    t.Literal("ADJUSTMENT"),
    t.Literal("TRANSFER"),
    t.Literal("CARE_PLAN"),
    t.Literal("VACCINATION"),
    t.Literal("MOBILE_CLINIC"),
    t.Literal("PHARMACY_DISPENSE"),
    t.Literal("INPATIENT_ADMINISTRATION"),
  ],
  { additionalProperties: false },
);
