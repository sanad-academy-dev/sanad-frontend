import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const InpatientOrderKind = t.Union(
  [
    t.Literal("MEDICATION"),
    t.Literal("FLUID"),
    t.Literal("MONITORING"),
    t.Literal("FEEDING"),
    t.Literal("ACTIVITY"),
    t.Literal("WOUND_CARE"),
    t.Literal("LAB"),
    t.Literal("IMAGING"),
    t.Literal("OTHER"),
  ],
  {
    additionalProperties: false,
    description: `نوع الأمر الطبي. متطابق عمدًا مع \`PostOpOrderKind\` في مواضعه المشتركة، فتحويل
أوامر ما بعد العملية إلى أوامر تنويم يبقى ترجمةً واحدة لواحد.`,
  },
);
