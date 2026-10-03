import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const SignatureMethod = t.Union(
  [
    t.Literal("DRAWN"),
    t.Literal("TYPED"),
    t.Literal("UPLOADED"),
    t.Literal("VERBAL_WITNESSED"),
  ],
  { additionalProperties: false },
);
