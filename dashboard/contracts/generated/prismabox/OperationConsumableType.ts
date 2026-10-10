import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const OperationConsumableType = t.Union(
  [t.Literal("KIT"), t.Literal("BURNED"), t.Literal("ADDITIONAL")],
  { additionalProperties: false },
);
