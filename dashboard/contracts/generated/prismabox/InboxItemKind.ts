import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const InboxItemKind = t.Union(
  [t.Literal("NOTIFICATION"), t.Literal("APPROVAL")],
  { additionalProperties: false },
);
