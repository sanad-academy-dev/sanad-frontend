import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const SaleFulfillment = t.Union(
  [t.Literal("AT_PAYMENT"), t.Literal("ON_DISPENSE")],
  { additionalProperties: false },
);
