import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const ComplicationPhase = t.Union(
  [t.Literal("INTRA_OP"), t.Literal("RECOVERY"), t.Literal("POST_OP")],
  { additionalProperties: false },
);
