import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const InventoryCategory = t.Union(
  [
    t.Literal("ANTIBIOTIC"),
    t.Literal("ANTI_INFLAMMATORY"),
    t.Literal("VACCINE"),
    t.Literal("HORMONE"),
    t.Literal("SUPPLEMENT"),
    t.Literal("CRUSTACEAN"),
    t.Literal("SURGICAL_TOOLS"),
    t.Literal("SUPPLIES"),
  ],
  { additionalProperties: false },
);
