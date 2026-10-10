import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const PetOwnerRequestStatus = t.Union(
  [
    t.Literal("NEW"),
    t.Literal("IN_REVIEW"),
    t.Literal("APPROVED"),
    t.Literal("DECLINED"),
    t.Literal("FULFILLED"),
    t.Literal("CANCELLED"),
  ],
  { additionalProperties: false },
);
