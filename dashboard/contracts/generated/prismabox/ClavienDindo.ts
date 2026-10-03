import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const ClavienDindo = t.Union(
  [
    t.Literal("GRADE_I"),
    t.Literal("GRADE_II"),
    t.Literal("GRADE_IIIA"),
    t.Literal("GRADE_IIIB"),
    t.Literal("GRADE_IVA"),
    t.Literal("GRADE_IVB"),
    t.Literal("GRADE_V"),
  ],
  { additionalProperties: false },
);
