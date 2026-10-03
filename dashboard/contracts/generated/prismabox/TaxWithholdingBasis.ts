import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const TaxWithholdingBasis = t.Union(
  [t.Literal("GROSS"), t.Literal("NET")],
  { additionalProperties: false },
);
