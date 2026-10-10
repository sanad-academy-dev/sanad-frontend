import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const InboxItemStatus = t.Union(
  [t.Literal("DRAFT"), t.Literal("OPEN"), t.Literal("RESOLVED")],
  { additionalProperties: false },
);
