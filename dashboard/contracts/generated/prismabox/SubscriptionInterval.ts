import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const SubscriptionInterval = t.Union(
  [t.Literal("DAY"), t.Literal("WEEK"), t.Literal("MONTH"), t.Literal("YEAR")],
  { additionalProperties: false },
);
