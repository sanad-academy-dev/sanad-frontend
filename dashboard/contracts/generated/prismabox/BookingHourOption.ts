import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const BookingHourOption = t.Union([t.Literal("H12"), t.Literal("H24")], {
  additionalProperties: false,
});
