import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const RadiologyImageKind = t.Union(
  [t.Literal("DICOM"), t.Literal("IMAGE")],
  { additionalProperties: false },
);
