import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const GroomingIncidentKind = t.Union(
  [
    t.Literal("CLIPPER_BURN"),
    t.Literal("NICK_CUT"),
    t.Literal("QUICKED_NAIL"),
    t.Literal("HEAT_STRESS"),
    t.Literal("MEDICAL_EVENT"),
    t.Literal("ESCAPE"),
    t.Literal("BITE_TO_STAFF"),
    t.Literal("EQUIPMENT_FAILURE"),
    t.Literal("OTHER"),
  ],
  {
    additionalProperties: false,
    description: `نوع الحادثة — الإبلاغ إلزامي والسجل إلحاقي (البوابة G10)`,
  },
);
