import { Prisma } from "@/generated/prisma/client";
import type { DueDateBasis } from "@/generated/prisma/enums";
/** Last day of the date's month (UTC). */
export declare function endOfMonth(date: Date): Date;
/** Add N days (UTC). */
export declare function addDays(date: Date, days: number): Date;
/** §4.9 — the due date of one payment term against a posting date. */
export declare function computeDueDate(postingDate: Date, basis: DueDateBasis, creditDays: number, creditMonths: number): Date;
/** §4.9 — the early-discount validity date mirrors the due-date bases. */
export declare function computeDiscountValidity(postingDate: Date, basis: DueDateBasis, validity: number): Date;
/** BR-4.9.2 — a due date may never precede the posting date. */
export declare function assertDueDateNotBeforePosting(dueDate: Date, postingDate: Date): void;
/** Template rule (BR-4.9.1's precondition): portions of its terms must total 100%. */
export declare function assertPortionsTotal100(portions: (string | Prisma.Decimal)[]): void;
