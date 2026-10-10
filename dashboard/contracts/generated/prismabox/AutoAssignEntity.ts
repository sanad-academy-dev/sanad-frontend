import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const AutoAssignEntity = t.Union(
  [t.Literal("BRANCH"), t.Literal("ROLE"), t.Literal("SPECIALIZATION")],
  { additionalProperties: false },
);
