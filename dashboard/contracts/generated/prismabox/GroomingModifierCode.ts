import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const GroomingModifierCode = t.Union(
  [
    t.Literal("MATTING"),
    t.Literal("SHAVE_DOWN"),
    t.Literal("BEHAVIOR"),
    t.Literal("SENIOR"),
    t.Literal("FLEA"),
    t.Literal("SECOND_PET"),
    t.Literal("EXPRESS"),
    t.Literal("OUT_OF_HOURS"),
  ],
  {
    additionalProperties: false,
    description: `رموز الرسوم/الخصوم المشروطة (§5).`,
  },
);
