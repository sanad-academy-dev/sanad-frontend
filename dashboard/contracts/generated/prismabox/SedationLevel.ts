import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const SedationLevel = t.Union(
  [
    t.Literal("NONE"),
    t.Literal("ANXIOLYSIS"),
    t.Literal("SEDATION"),
    t.Literal("GENERAL_ANESTHESIA"),
  ],
  { additionalProperties: false },
);
