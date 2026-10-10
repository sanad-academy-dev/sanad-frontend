import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const CountType = t.Union(
  [t.Literal("SPONGE"), t.Literal("NEEDLE"), t.Literal("INSTRUMENT")],
  { additionalProperties: false },
);
