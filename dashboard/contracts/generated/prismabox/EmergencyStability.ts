import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const EmergencyStability = t.Union(
  [t.Literal("STABLE"), t.Literal("UNSTABLE"), t.Literal("CRITICAL")],
  {
    additionalProperties: false,
    description: `[E5] استقرار الحالة كما قدّره آخر تقييم — يُغيّر «جاهز للقرار» على اللوحة.`,
  },
);
