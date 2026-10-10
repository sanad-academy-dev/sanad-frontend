import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const InpatientStayStatus = t.Union(
  [
    t.Literal("REQUESTED"),
    t.Literal("ADMITTED"),
    t.Literal("IN_CARE"),
    t.Literal("DISCHARGE_PENDING"),
    t.Literal("DISCHARGED"),
    t.Literal("CANCELLED"),
  ],
  {
    additionalProperties: false,
    description: `حالات الإقامة. المسار خطّي قصير عمدًا: الإقامة ليست سير عمل بمراحل، بل مدّة
زمنية لها بداية ونهاية وما بينهما رعاية متكرّرة.`,
  },
);
