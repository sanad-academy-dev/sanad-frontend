import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const InpatientStayKind = t.Union(
  [
    t.Literal("MEDICAL"),
    t.Literal("SURGICAL"),
    t.Literal("ICU"),
    t.Literal("ISOLATION"),
    t.Literal("BOARDING"),
  ],
  {
    additionalProperties: false,
    description: `نوع الإقامة — يقرّر البوابات الإلزامية وقواعد الإسكان لا شكل السجل.`,
  },
);
