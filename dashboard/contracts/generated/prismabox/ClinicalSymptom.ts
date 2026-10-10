import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const ClinicalSymptom = t.Union(
  [
    t.Literal("VOMITING"),
    t.Literal("DIARRHEA"),
    t.Literal("COUGH"),
    t.Literal("SNEEZING"),
    t.Literal("LETHARGY"),
  ],
  { additionalProperties: false },
);
