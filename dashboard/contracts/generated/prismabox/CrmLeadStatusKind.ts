import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const CrmLeadStatusKind = t.Union(
  [t.Literal("OPEN"), t.Literal("CONVERTED"), t.Literal("LOST")],
  { additionalProperties: false },
);
