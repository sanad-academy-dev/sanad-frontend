import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const ExpenseAttachmentKind = t.Union(
  [t.Literal("LINK"), t.Literal("DOCUMENT")],
  { additionalProperties: false },
);
