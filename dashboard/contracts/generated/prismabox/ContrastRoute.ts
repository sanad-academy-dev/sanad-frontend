import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const ContrastRoute = t.Union(
  [
    t.Literal("IV"),
    t.Literal("ORAL"),
    t.Literal("RECTAL"),
    t.Literal("INTRA_ARTICULAR"),
    t.Literal("OTHER"),
  ],
  { additionalProperties: false },
);
