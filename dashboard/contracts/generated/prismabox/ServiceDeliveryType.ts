import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const ServiceDeliveryType = t.Union(
  [
    t.Literal("IN_CLINIC"),
    t.Literal("REMOTE"),
    t.Literal("MOBILE_CLINIC"),
    t.Literal("ALL"),
  ],
  { additionalProperties: false },
);
