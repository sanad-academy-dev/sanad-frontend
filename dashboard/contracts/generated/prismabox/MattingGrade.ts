import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const MattingGrade = t.Union(
  [
    t.Literal("NONE"),
    t.Literal("LIGHT"),
    t.Literal("MODERATE"),
    t.Literal("SEVERE"),
    t.Literal("PELTED"),
  ],
  {
    additionalProperties: false,
    description: `درجة تعقّد الفرو — سلّم 0–4 المتعارف عليه في الصناعة.`,
  },
);
