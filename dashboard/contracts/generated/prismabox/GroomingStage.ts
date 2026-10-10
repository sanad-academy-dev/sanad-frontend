import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const GroomingStage = t.Union(
  [
    t.Literal("QUOTE_APPROVAL"),
    t.Literal("BATH"),
    t.Literal("DRYING"),
    t.Literal("CLIP"),
    t.Literal("SCISSOR"),
    t.Literal("NAILS_EARS"),
    t.Literal("FINISH_CHECK"),
    t.Literal("PHOTOS"),
  ],
  {
    additionalProperties: false,
    description: `المرحلة الفرعية داخل الجلسة — تقود لوحة العمل.`,
  },
);
