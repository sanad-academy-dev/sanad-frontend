import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const PainScale = t.Union(
  [
    t.Literal("GLASGOW_CMPS"),
    t.Literal("NRS"),
    t.Literal("VAS"),
    t.Literal("FLACC"),
    t.Literal("OTHER"),
  ],
  { additionalProperties: false },
);
