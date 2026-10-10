import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const TaxRowCategory = t.Union(
  [
    t.Literal("TOTAL"),
    t.Literal("VALUATION"),
    t.Literal("VALUATION_AND_TOTAL"),
  ],
  { additionalProperties: false },
);
