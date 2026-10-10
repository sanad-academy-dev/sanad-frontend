import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const AccountReportType = t.Union(
  [t.Literal("BALANCE_SHEET"), t.Literal("PROFIT_AND_LOSS")],
  { additionalProperties: false },
);
