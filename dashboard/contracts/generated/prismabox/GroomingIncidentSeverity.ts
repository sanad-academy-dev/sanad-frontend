import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const GroomingIncidentSeverity = t.Union(
  [t.Literal("MINOR"), t.Literal("MODERATE"), t.Literal("MAJOR")],
  { additionalProperties: false },
);
