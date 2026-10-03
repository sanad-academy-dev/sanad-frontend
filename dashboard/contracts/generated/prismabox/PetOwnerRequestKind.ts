import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const PetOwnerRequestKind = t.Union(
  [
    t.Literal("REFILL"),
    t.Literal("RECORDS"),
    t.Literal("CERTIFICATE"),
    t.Literal("CALLBACK"),
    t.Literal("QUESTION"),
    t.Literal("CANCEL_APPOINTMENT"),
  ],
  { additionalProperties: false },
);
