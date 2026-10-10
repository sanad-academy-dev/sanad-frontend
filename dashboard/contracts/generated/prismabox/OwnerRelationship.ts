import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const OwnerRelationship = t.Union(
  [
    t.Literal("OWNER"),
    t.Literal("GUARDIAN"),
    t.Literal("DELEGATE"),
    t.Literal("EMERGENCY"),
  ],
  { additionalProperties: false },
);
