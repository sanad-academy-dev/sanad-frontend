import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const AdverseReactionSeverity = t.Union(
  [
    t.Literal("NONE"),
    t.Literal("MILD"),
    t.Literal("MODERATE"),
    t.Literal("SEVERE"),
    t.Literal("ANAPHYLACTIC"),
  ],
  { additionalProperties: false },
);
