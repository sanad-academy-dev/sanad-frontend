import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const MobileVisitServiceSource = t.Union(
  [t.Literal("SCHEDULED"), t.Literal("FIELD")],
  {
    additionalProperties: false,
    description: `من أين جاء سطر الخدمة: كان على الموعد قبل الانطلاق، أم أضافه الطاقم في الموقع.
التمييز هو ما يجعل تقرير «ما زاد عن المجدول» ممكنًا أصلًا.`,
  },
);
