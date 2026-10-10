import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const AdObjective = t.Union(
  [
    t.Literal("BRAND_AWARENESS"),
    t.Literal("LEAD_GENERATION"),
    t.Literal("STORE_VISITS"),
    t.Literal("CUSTOMER_FEEDBACK"),
    t.Literal("SALES"),
    t.Literal("PRODUCT_AWARENESS"),
  ],
  {
    additionalProperties: false,
    description: `أهداف الحملة الستة كما في التصميم (شاشة 538697)`,
  },
);
