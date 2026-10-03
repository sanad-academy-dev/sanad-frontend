import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const GroomingPhotoKind = t.Union(
  [
    t.Literal("BEFORE"),
    t.Literal("AFTER"),
    t.Literal("CONDITION"),
    t.Literal("INCIDENT"),
  ],
  { additionalProperties: false },
);
