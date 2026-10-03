import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const StaffPrefix = t.Union(
  [
    t.Literal("MR"),
    t.Literal("MRS"),
    t.Literal("MS"),
    t.Literal("DR"),
    t.Literal("PROF"),
  ],
  { additionalProperties: false },
);
