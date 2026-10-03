import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const MembershipBenefitType = t.Union(
  [
    t.Literal("SERVICE_DISCOUNT"),
    t.Literal("PRODUCT_DISCOUNT"),
    t.Literal("INCLUDED_UNITS"),
    t.Literal("PRIORITY_BOOKING"),
    t.Literal("PERK"),
  ],
  { additionalProperties: false },
);
