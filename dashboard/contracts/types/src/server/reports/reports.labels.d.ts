import type { AppointmentLocation, AppointmentStatus, AssignmentStatus, AttendanceStatus, CourseType, ExpenseSource, ExpenseStatus, Gender, InventoryCategory, InvoiceStatus, LabTestStatus, LeaveRequestStatus, OperationStatus, OperationTier, OperationUrgency, PaymentMethod, RadiologyModality, RadiologyStatus } from "@/generated/prisma/enums";
import type { ReportLabel } from "@/server/reports/reports.type";
/**
 * Bilingual display names for the enums reports group by.
 *
 * Reports are the one place that renders *every* value of these enums side by side, so the
 * labels live here rather than being scraped from each module's own constants file — those
 * are Arabic-only and often omit values a module never shows (a cancelled lab item, say).
 * `Record<Enum, …>` means a new enum member fails the type-check until it is named here.
 */
export declare const APPOINTMENT_STATUS_LABELS: Record<AppointmentStatus, ReportLabel>;
export declare const APPOINTMENT_LOCATION_LABELS: Record<AppointmentLocation, ReportLabel>;
export declare const INVOICE_STATUS_LABELS: Record<InvoiceStatus, ReportLabel>;
export declare const PAYMENT_METHOD_LABELS: Record<PaymentMethod, ReportLabel>;
export declare const ATTENDANCE_STATUS_LABELS: Record<AttendanceStatus, ReportLabel>;
export declare const LEAVE_STATUS_LABELS: Record<LeaveRequestStatus, ReportLabel>;
export declare const INVENTORY_CATEGORY_LABELS: Record<InventoryCategory, ReportLabel>;
export declare const LAB_STATUS_LABELS: Record<LabTestStatus, ReportLabel>;
export declare const RADIOLOGY_STATUS_LABELS: Record<RadiologyStatus, ReportLabel>;
export declare const MODALITY_LABELS: Record<RadiologyModality, ReportLabel>;
export declare const OPERATION_STATUS_LABELS: Record<OperationStatus, ReportLabel>;
export declare const OPERATION_TIER_LABELS: Record<OperationTier, ReportLabel>;
export declare const OPERATION_URGENCY_LABELS: Record<OperationUrgency, ReportLabel>;
export declare const EXPENSE_STATUS_LABELS: Record<ExpenseStatus, ReportLabel>;
export declare const EXPENSE_SOURCE_LABELS: Record<ExpenseSource, ReportLabel>;
export declare const ASSIGNMENT_STATUS_LABELS: Record<AssignmentStatus, ReportLabel>;
export declare const COURSE_TYPE_LABELS: Record<CourseType, ReportLabel>;
export declare const GENDER_LABELS: Record<Gender, ReportLabel>;
/** Fallback for a grouping key with no row in the clinic's reference tables. */
export declare const UNKNOWN_LABEL: ReportLabel;
