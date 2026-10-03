import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const CrmViewLayout = t.Union([t.Literal("LIST"), t.Literal("KANBAN")], {
  additionalProperties: false,
  description: `[CRM-P5] §11.2 — الشكل الذي يفتح به العرض المحفوظ.`,
});
