import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const EndOfServiceReason = t.Union(
  [
    t.Literal("END_OF_CONTRACT"),
    t.Literal("EMPLOYER_TERMINATION"),
    t.Literal("RESIGNATION"),
    t.Literal("SPECIAL"),
  ],
  { additionalProperties: false },
);
