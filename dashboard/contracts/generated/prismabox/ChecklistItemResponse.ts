import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const ChecklistItemResponse = t.Union(
  [t.Literal("CONFIRMED"), t.Literal("YES"), t.Literal("NO"), t.Literal("NA")],
  { additionalProperties: false },
);
