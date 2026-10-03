import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const InpatientAdministrationStatus = t.Union(
  [
    t.Literal("PENDING"),
    t.Literal("GIVEN"),
    t.Literal("SKIPPED"),
    t.Literal("HELD"),
  ],
  {
    additionalProperties: false,
    description: `حالة صفّ الإعطاء الواحد. لا قيمة MISSED هنا عمدًا: الفائت اشتقاق من
(\`dueAt\` + المهلة < الآن) على صفٍّ ما زال PENDING. تخزينه يحتاج وظيفةً دوريّة
تكتبه — ولا مجدول في هذا المستودع — فيصبح الحقل كذبةً كلما نام النظام.`,
  },
);
