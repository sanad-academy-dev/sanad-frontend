import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const GeocodeSource = t.Union(
  [t.Literal("MANUAL_PIN"), t.Literal("NOMINATIM"), t.Literal("DEVICE_GPS")],
  { additionalProperties: false },
);
