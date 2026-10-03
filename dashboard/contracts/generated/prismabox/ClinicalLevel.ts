import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const ClinicalLevel = t.Union(
  [
    t.Literal("NORMAL"),
    t.Literal("INCREASED"),
    t.Literal("DECREASED"),
    t.Literal("ABSENT"),
  ],
  { additionalProperties: false },
);
