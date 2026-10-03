import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const ApprovalStatus = t.Union(
  [t.Literal("PENDING"), t.Literal("ACCEPTED"), t.Literal("REJECTED")],
  { additionalProperties: false },
);
