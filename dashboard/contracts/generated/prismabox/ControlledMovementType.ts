import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const ControlledMovementType = t.Union(
  [
    t.Literal("RECEIPT"),
    t.Literal("DISPENSE"),
    t.Literal("WASTE"),
    t.Literal("ADJUSTMENT"),
    t.Literal("TRANSFER"),
  ],
  { additionalProperties: false },
);
