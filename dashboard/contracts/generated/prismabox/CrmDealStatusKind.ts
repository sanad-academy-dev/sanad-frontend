import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const CrmDealStatusKind = t.Union(
  [t.Literal("OPEN"), t.Literal("WON"), t.Literal("LOST")],
  { additionalProperties: false },
);
