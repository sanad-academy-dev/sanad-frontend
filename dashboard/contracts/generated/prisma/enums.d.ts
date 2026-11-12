export declare const PetOwnerAccountStatus: {
    readonly ACTIVE: "ACTIVE";
    readonly SUSPENDED: "SUSPENDED";
};
export type PetOwnerAccountStatus = (typeof PetOwnerAccountStatus)[keyof typeof PetOwnerAccountStatus];
export declare const PetOwnerLinkSource: {
    readonly PHONE_MATCH: "PHONE_MATCH";
    readonly STAFF_ISSUED: "STAFF_ISSUED";
};
export type PetOwnerLinkSource = (typeof PetOwnerLinkSource)[keyof typeof PetOwnerLinkSource];
export declare const PetNotificationCategory: {
    readonly APPOINTMENT: "APPOINTMENT";
    readonly REMINDER_DUE: "REMINDER_DUE";
    readonly RESULTS: "RESULTS";
    readonly BILLING: "BILLING";
    readonly CHAT: "CHAT";
    readonly MARKETING: "MARKETING";
};
export type PetNotificationCategory = (typeof PetNotificationCategory)[keyof typeof PetNotificationCategory];
export declare const PetDevicePlatform: {
    readonly IOS: "IOS";
    readonly ANDROID: "ANDROID";
    readonly WEB: "WEB";
};
export type PetDevicePlatform = (typeof PetDevicePlatform)[keyof typeof PetDevicePlatform];
export declare const PetOwnerRequestKind: {
    readonly REFILL: "REFILL";
    readonly RECORDS: "RECORDS";
    readonly CERTIFICATE: "CERTIFICATE";
    readonly CALLBACK: "CALLBACK";
    readonly QUESTION: "QUESTION";
    readonly CANCEL_APPOINTMENT: "CANCEL_APPOINTMENT";
};
export type PetOwnerRequestKind = (typeof PetOwnerRequestKind)[keyof typeof PetOwnerRequestKind];
export declare const PetOwnerRequestStatus: {
    readonly NEW: "NEW";
    readonly IN_REVIEW: "IN_REVIEW";
    readonly APPROVED: "APPROVED";
    readonly DECLINED: "DECLINED";
    readonly FULFILLED: "FULFILLED";
    readonly CANCELLED: "CANCELLED";
};
export type PetOwnerRequestStatus = (typeof PetOwnerRequestStatus)[keyof typeof PetOwnerRequestStatus];
export declare const AgentChatRole: {
    readonly USER: "USER";
    readonly ASSISTANT: "ASSISTANT";
};
export type AgentChatRole = (typeof AgentChatRole)[keyof typeof AgentChatRole];
export declare const DunningStatus: {
    readonly DRAFT: "DRAFT";
    readonly UNRESOLVED: "UNRESOLVED";
    readonly RESOLVED: "RESOLVED";
    readonly CANCELLED: "CANCELLED";
};
export type DunningStatus = (typeof DunningStatus)[keyof typeof DunningStatus];
export declare const RepostStatus: {
    readonly QUEUED: "QUEUED";
    readonly IN_PROGRESS: "IN_PROGRESS";
    readonly COMPLETED: "COMPLETED";
    readonly FAILED: "FAILED";
};
export type RepostStatus = (typeof RepostStatus)[keyof typeof RepostStatus];
export declare const PsoaReportType: {
    readonly PARTY_LEDGER: "PARTY_LEDGER";
    readonly RECEIVABLE_AGEING: "RECEIVABLE_AGEING";
};
export type PsoaReportType = (typeof PsoaReportType)[keyof typeof PsoaReportType];
export declare const PsoaFrequency: {
    readonly MANUAL: "MANUAL";
    readonly WEEKLY: "WEEKLY";
    readonly MONTHLY: "MONTHLY";
    readonly QUARTERLY: "QUARTERLY";
};
export type PsoaFrequency = (typeof PsoaFrequency)[keyof typeof PsoaFrequency];
export declare const SubscriptionStatus: {
    readonly TRIALING: "TRIALING";
    readonly ACTIVE: "ACTIVE";
    readonly PAST_DUE: "PAST_DUE";
    readonly UNPAID: "UNPAID";
    readonly CANCELLED: "CANCELLED";
    readonly COMPLETED: "COMPLETED";
};
export type SubscriptionStatus = (typeof SubscriptionStatus)[keyof typeof SubscriptionStatus];
export declare const SubscriptionInterval: {
    readonly DAY: "DAY";
    readonly WEEK: "WEEK";
    readonly MONTH: "MONTH";
    readonly YEAR: "YEAR";
};
export type SubscriptionInterval = (typeof SubscriptionInterval)[keyof typeof SubscriptionInterval];
export declare const PosShiftStatus: {
    readonly OPEN: "OPEN";
    readonly CLOSED: "CLOSED";
};
export type PosShiftStatus = (typeof PosShiftStatus)[keyof typeof PosShiftStatus];
export declare const ClinicSpecialtyType: {
    readonly VET_CLINIC: "VET_CLINIC";
    readonly VET_HOSPITAL: "VET_HOSPITAL";
    readonly GROOMING_CENTER: "GROOMING_CENTER";
    readonly MOBILE_SERVICES: "MOBILE_SERVICES";
    readonly SPECIALIZED_SURGERY: "SPECIALIZED_SURGERY";
    readonly MULTI_SERVICES: "MULTI_SERVICES";
};
export type ClinicSpecialtyType = (typeof ClinicSpecialtyType)[keyof typeof ClinicSpecialtyType];
export declare const ClinicMainGoal: {
    readonly APPOINTMENTS_MANAGEMENT: "APPOINTMENTS_MANAGEMENT";
    readonly PATIENTS_MANAGEMENT: "PATIENTS_MANAGEMENT";
    readonly INVENTORY_MANAGEMENT: "INVENTORY_MANAGEMENT";
    readonly BILLING_MANAGEMENT: "BILLING_MANAGEMENT";
    readonly REVENUE_IMPROVEMENT: "REVENUE_IMPROVEMENT";
    readonly WORKFLOW_AUTOMATION: "WORKFLOW_AUTOMATION";
    readonly PAPERWORK_REDUCTION: "PAPERWORK_REDUCTION";
    readonly CUSTOMER_EXPERIENCE: "CUSTOMER_EXPERIENCE";
};
export type ClinicMainGoal = (typeof ClinicMainGoal)[keyof typeof ClinicMainGoal];
export declare const ClinicSizeType: {
    readonly SOLO: "SOLO";
    readonly SMALL: "SMALL";
    readonly MEDIUM: "MEDIUM";
    readonly MEDICAL_CENTER: "MEDICAL_CENTER";
    readonly HOSPITAL: "HOSPITAL";
};
export type ClinicSizeType = (typeof ClinicSizeType)[keyof typeof ClinicSizeType];
export declare const ServiceDeliveryType: {
    readonly IN_CLINIC: "IN_CLINIC";
    readonly REMOTE: "REMOTE";
    readonly MOBILE_CLINIC: "MOBILE_CLINIC";
    readonly ALL: "ALL";
};
export type ServiceDeliveryType = (typeof ServiceDeliveryType)[keyof typeof ServiceDeliveryType];
export declare const MonthlyRangeType: {
    readonly UNDER_50: "UNDER_50";
    readonly RANGE_50_100: "RANGE_50_100";
    readonly RANGE_101_250: "RANGE_101_250";
    readonly OVER_1000: "OVER_1000";
};
export type MonthlyRangeType = (typeof MonthlyRangeType)[keyof typeof MonthlyRangeType];
export declare const ReferralSource: {
    readonly FRIEND: "FRIEND";
    readonly GOOGLE: "GOOGLE";
    readonly TWITTER: "TWITTER";
    readonly LINKEDIN: "LINKEDIN";
    readonly BLOG: "BLOG";
    readonly NEWSLETTER: "NEWSLETTER";
    readonly PODCAST: "PODCAST";
    readonly OTHER: "OTHER";
};
export type ReferralSource = (typeof ReferralSource)[keyof typeof ReferralSource];
export declare const PurchaseOrderStatus: {
    readonly DRAFT: "DRAFT";
    readonly ORDERED: "ORDERED";
    readonly PARTIALLY_RECEIVED: "PARTIALLY_RECEIVED";
    readonly RECEIVED: "RECEIVED";
    readonly CANCELLED: "CANCELLED";
};
export type PurchaseOrderStatus = (typeof PurchaseOrderStatus)[keyof typeof PurchaseOrderStatus];
export declare const StockVoucherType: {
    readonly OPENING: "OPENING";
    readonly RECEIPT: "RECEIPT";
    readonly ISSUE: "ISSUE";
    readonly SALE: "SALE";
    readonly SALE_RETURN: "SALE_RETURN";
    readonly ADJUSTMENT: "ADJUSTMENT";
    readonly TRANSFER: "TRANSFER";
    readonly CARE_PLAN: "CARE_PLAN";
    readonly VACCINATION: "VACCINATION";
    readonly MOBILE_CLINIC: "MOBILE_CLINIC";
    readonly PHARMACY_DISPENSE: "PHARMACY_DISPENSE";
    readonly INPATIENT_ADMINISTRATION: "INPATIENT_ADMINISTRATION";
};
export type StockVoucherType = (typeof StockVoucherType)[keyof typeof StockVoucherType];
export declare const DiscountType: {
    readonly PERCENTAGE: "PERCENTAGE";
    readonly FIXED: "FIXED";
};
export type DiscountType = (typeof DiscountType)[keyof typeof DiscountType];
export declare const DiscountStatus: {
    readonly ACTIVE: "ACTIVE";
    readonly INACTIVE: "INACTIVE";
    readonly EXPIRED: "EXPIRED";
    readonly SCHEDULED: "SCHEDULED";
};
export type DiscountStatus = (typeof DiscountStatus)[keyof typeof DiscountStatus];
export declare const ExpenseSource: {
    readonly MANUAL: "MANUAL";
    readonly PAYROLL_RUN: "PAYROLL_RUN";
    readonly END_OF_SERVICE: "END_OF_SERVICE";
    readonly PURCHASE_ORDER: "PURCHASE_ORDER";
};
export type ExpenseSource = (typeof ExpenseSource)[keyof typeof ExpenseSource];
export declare const ExpenseStatus: {
    readonly DRAFT: "DRAFT";
    readonly PENDING_REVIEW: "PENDING_REVIEW";
    readonly APPROVED: "APPROVED";
    readonly REJECTED: "REJECTED";
    readonly PAID: "PAID";
    readonly CANCELED: "CANCELED";
};
export type ExpenseStatus = (typeof ExpenseStatus)[keyof typeof ExpenseStatus];
export declare const ExpensePaymentMethod: {
    readonly CASH: "CASH";
    readonly BANK_TRANSFER: "BANK_TRANSFER";
    readonly CARD: "CARD";
    readonly CHEQUE: "CHEQUE";
    readonly TREASURY: "TREASURY";
};
export type ExpensePaymentMethod = (typeof ExpensePaymentMethod)[keyof typeof ExpensePaymentMethod];
export declare const ExpenseAttachmentKind: {
    readonly LINK: "LINK";
    readonly DOCUMENT: "DOCUMENT";
};
export type ExpenseAttachmentKind = (typeof ExpenseAttachmentKind)[keyof typeof ExpenseAttachmentKind];
export declare const ExpenseReminderOffset: {
    readonly ONE_DAY: "ONE_DAY";
    readonly TWO_DAYS: "TWO_DAYS";
    readonly THREE_DAYS: "THREE_DAYS";
};
export type ExpenseReminderOffset = (typeof ExpenseReminderOffset)[keyof typeof ExpenseReminderOffset];
export declare const ExpenseApprovalStepType: {
    readonly CREATED: "CREATED";
    readonly SENT_FOR_REVIEW: "SENT_FOR_REVIEW";
    readonly MANAGER_REVIEW: "MANAGER_REVIEW";
    readonly FINANCE_APPROVAL: "FINANCE_APPROVAL";
    readonly DISBURSEMENT: "DISBURSEMENT";
};
export type ExpenseApprovalStepType = (typeof ExpenseApprovalStepType)[keyof typeof ExpenseApprovalStepType];
export declare const ExpenseApprovalStepState: {
    readonly PENDING: "PENDING";
    readonly SENT: "SENT";
    readonly APPROVED: "APPROVED";
    readonly REJECTED: "REJECTED";
    readonly DONE: "DONE";
};
export type ExpenseApprovalStepState = (typeof ExpenseApprovalStepState)[keyof typeof ExpenseApprovalStepState];
export declare const CarePlanStatus: {
    readonly ACTIVE: "ACTIVE";
    readonly INACTIVE: "INACTIVE";
};
export type CarePlanStatus = (typeof CarePlanStatus)[keyof typeof CarePlanStatus];
export declare const CarePlanEnrollmentStatus: {
    readonly ACTIVE: "ACTIVE";
    readonly COMPLETED: "COMPLETED";
    readonly CANCELLED: "CANCELLED";
};
export type CarePlanEnrollmentStatus = (typeof CarePlanEnrollmentStatus)[keyof typeof CarePlanEnrollmentStatus];
export declare const CarePlanEnrollmentVisitStatus: {
    readonly PENDING: "PENDING";
    readonly COMPLETED: "COMPLETED";
    readonly SKIPPED: "SKIPPED";
};
export type CarePlanEnrollmentVisitStatus = (typeof CarePlanEnrollmentVisitStatus)[keyof typeof CarePlanEnrollmentVisitStatus];
export declare const CarePlanIntervalUnit: {
    readonly DAY: "DAY";
    readonly WEEK: "WEEK";
};
export type CarePlanIntervalUnit = (typeof CarePlanIntervalUnit)[keyof typeof CarePlanIntervalUnit];
export declare const Gender: {
    readonly MALE: "MALE";
    readonly FEMALE: "FEMALE";
    readonly UNKNOWN: "UNKNOWN";
};
export type Gender = (typeof Gender)[keyof typeof Gender];
export declare const OwnerType: {
    readonly ALL: "ALL";
    readonly VIP: "VIP";
    readonly LOYALTY: "LOYALTY";
    readonly NEW: "NEW";
    readonly CURRENT: "CURRENT";
};
export type OwnerType = (typeof OwnerType)[keyof typeof OwnerType];
export declare const OwnerRelationship: {
    readonly OWNER: "OWNER";
    readonly GUARDIAN: "GUARDIAN";
    readonly DELEGATE: "DELEGATE";
    readonly EMERGENCY: "EMERGENCY";
};
export type OwnerRelationship = (typeof OwnerRelationship)[keyof typeof OwnerRelationship];
export declare const InventoryCategory: {
    readonly ANTIBIOTIC: "ANTIBIOTIC";
    readonly ANTI_INFLAMMATORY: "ANTI_INFLAMMATORY";
    readonly VACCINE: "VACCINE";
    readonly HORMONE: "HORMONE";
    readonly SUPPLEMENT: "SUPPLEMENT";
    readonly CRUSTACEAN: "CRUSTACEAN";
    readonly SURGICAL_TOOLS: "SURGICAL_TOOLS";
    readonly SUPPLIES: "SUPPLIES";
};
export type InventoryCategory = (typeof InventoryCategory)[keyof typeof InventoryCategory];
export declare const StaffPrefix: {
    readonly MR: "MR";
    readonly MRS: "MRS";
    readonly MS: "MS";
    readonly DR: "DR";
    readonly PROF: "PROF";
};
export type StaffPrefix = (typeof StaffPrefix)[keyof typeof StaffPrefix];
export declare const StaffStatus: {
    readonly PENDING: "PENDING";
    readonly ACTIVE: "ACTIVE";
    readonly INACTIVE: "INACTIVE";
};
export type StaffStatus = (typeof StaffStatus)[keyof typeof StaffStatus];
export declare const SpecializationLevel: {
    readonly CATEGORY: "CATEGORY";
    readonly SUBCATEGORY: "SUBCATEGORY";
};
export type SpecializationLevel = (typeof SpecializationLevel)[keyof typeof SpecializationLevel];
export declare const BranchType: {
    readonly PRIMARY: "PRIMARY";
    readonly SUB: "SUB";
};
export type BranchType = (typeof BranchType)[keyof typeof BranchType];
export declare const RoomType: {
    readonly EXAMINATION: "EXAMINATION";
    readonly LABORATORY: "LABORATORY";
    readonly WAITING: "WAITING";
    readonly OPERATING: "OPERATING";
    readonly VACCINATION: "VACCINATION";
    readonly ICU: "ICU";
    readonly GROOMING: "GROOMING";
    readonly WARD: "WARD";
    readonly ISOLATION: "ISOLATION";
};
export type RoomType = (typeof RoomType)[keyof typeof RoomType];
export declare const CalendarType: {
    readonly GREGORIAN: "GREGORIAN";
    readonly HIJRI: "HIJRI";
};
export type CalendarType = (typeof CalendarType)[keyof typeof CalendarType];
export declare const AttendanceStatus: {
    readonly PRESENT: "PRESENT";
    readonly ABSENT: "ABSENT";
    readonly LATE: "LATE";
    readonly LEAVE: "LEAVE";
    readonly MISSION: "MISSION";
    readonly OVERTIME: "OVERTIME";
};
export type AttendanceStatus = (typeof AttendanceStatus)[keyof typeof AttendanceStatus];
export declare const LeaveRequestStatus: {
    readonly PENDING: "PENDING";
    readonly APPROVED: "APPROVED";
    readonly REJECTED: "REJECTED";
};
export type LeaveRequestStatus = (typeof LeaveRequestStatus)[keyof typeof LeaveRequestStatus];
export declare const TimeFormat: {
    readonly H12: "H12";
    readonly H24: "H24";
};
export type TimeFormat = (typeof TimeFormat)[keyof typeof TimeFormat];
export declare const Weekday: {
    readonly SUNDAY: "SUNDAY";
    readonly MONDAY: "MONDAY";
    readonly TUESDAY: "TUESDAY";
    readonly WEDNESDAY: "WEDNESDAY";
    readonly THURSDAY: "THURSDAY";
    readonly FRIDAY: "FRIDAY";
    readonly SATURDAY: "SATURDAY";
};
export type Weekday = (typeof Weekday)[keyof typeof Weekday];
export declare const StaffShift: {
    readonly MORNING: "MORNING";
    readonly EVENING: "EVENING";
    readonly BOTH: "BOTH";
};
export type StaffShift = (typeof StaffShift)[keyof typeof StaffShift];
export declare const ShiftType: {
    readonly MORNING: "MORNING";
    readonly EVENING: "EVENING";
    readonly NIGHT: "NIGHT";
};
export type ShiftType = (typeof ShiftType)[keyof typeof ShiftType];
export declare const EmploymentType: {
    readonly FULL_TIME: "FULL_TIME";
    readonly PART_TIME: "PART_TIME";
};
export type EmploymentType = (typeof EmploymentType)[keyof typeof EmploymentType];
export declare const PayrollPaymentMethod: {
    readonly TRANSFER: "TRANSFER";
    readonly CASH: "CASH";
    readonly CHECK: "CHECK";
};
export type PayrollPaymentMethod = (typeof PayrollPaymentMethod)[keyof typeof PayrollPaymentMethod];
export declare const PayrollRunType: {
    readonly REGULAR: "REGULAR";
    readonly OFF_CYCLE: "OFF_CYCLE";
};
export type PayrollRunType = (typeof PayrollRunType)[keyof typeof PayrollRunType];
export declare const PayrollRunStatus: {
    readonly DRAFT: "DRAFT";
    readonly CALCULATED: "CALCULATED";
    readonly PENDING_APPROVAL: "PENDING_APPROVAL";
    readonly APPROVED: "APPROVED";
    readonly PAID: "PAID";
    readonly CANCELLED: "CANCELLED";
};
export type PayrollRunStatus = (typeof PayrollRunStatus)[keyof typeof PayrollRunStatus];
export declare const PayrollApprovalState: {
    readonly PENDING: "PENDING";
    readonly APPROVED: "APPROVED";
    readonly REJECTED: "REJECTED";
};
export type PayrollApprovalState = (typeof PayrollApprovalState)[keyof typeof PayrollApprovalState];
export declare const PayrollScope: {
    readonly ALL: "ALL";
    readonly BRANCH: "BRANCH";
    readonly DEPARTMENT: "DEPARTMENT";
    readonly CONTRACT: "CONTRACT";
    readonly SPECIFIC: "SPECIFIC";
};
export type PayrollScope = (typeof PayrollScope)[keyof typeof PayrollScope];
export declare const EndOfServiceReason: {
    readonly END_OF_CONTRACT: "END_OF_CONTRACT";
    readonly EMPLOYER_TERMINATION: "EMPLOYER_TERMINATION";
    readonly RESIGNATION: "RESIGNATION";
    readonly SPECIAL: "SPECIAL";
};
export type EndOfServiceReason = (typeof EndOfServiceReason)[keyof typeof EndOfServiceReason];
export declare const EndOfServiceStatus: {
    readonly DRAFT: "DRAFT";
    readonly APPROVED: "APPROVED";
    readonly PAID: "PAID";
    readonly CANCELLED: "CANCELLED";
};
export type EndOfServiceStatus = (typeof EndOfServiceStatus)[keyof typeof EndOfServiceStatus];
export declare const PayrollDeductionType: {
    readonly ADVANCE: "ADVANCE";
    readonly LOAN_INSTALLMENT: "LOAN_INSTALLMENT";
    readonly PENALTY: "PENALTY";
    readonly OTHER: "OTHER";
};
export type PayrollDeductionType = (typeof PayrollDeductionType)[keyof typeof PayrollDeductionType];
export declare const PayrollEarningType: {
    readonly ALLOWANCE: "ALLOWANCE";
    readonly BONUS: "BONUS";
    readonly COMMISSION: "COMMISSION";
    readonly EXPENSE_REIMBURSEMENT: "EXPENSE_REIMBURSEMENT";
};
export type PayrollEarningType = (typeof PayrollEarningType)[keyof typeof PayrollEarningType];
export declare const OvertimeBase: {
    readonly BASIC: "BASIC";
    readonly TOTAL: "TOTAL";
};
export type OvertimeBase = (typeof OvertimeBase)[keyof typeof OvertimeBase];
export declare const AllowanceType: {
    readonly HOUSING: "HOUSING";
    readonly TRANSPORT: "TRANSPORT";
    readonly FOOD: "FOOD";
    readonly PHONE: "PHONE";
    readonly OTHER: "OTHER";
};
export type AllowanceType = (typeof AllowanceType)[keyof typeof AllowanceType];
export declare const BookingHourOption: {
    readonly H12: "H12";
    readonly H24: "H24";
};
export type BookingHourOption = (typeof BookingHourOption)[keyof typeof BookingHourOption];
export declare const ServiceLevel: {
    readonly CATEGORY: "CATEGORY";
    readonly SUBCATEGORY: "SUBCATEGORY";
    readonly ITEM: "ITEM";
};
export type ServiceLevel = (typeof ServiceLevel)[keyof typeof ServiceLevel];
export declare const Plan: {
    readonly FREE: "FREE";
    readonly BASIC: "BASIC";
    readonly PRO: "PRO";
};
export type Plan = (typeof Plan)[keyof typeof Plan];
export declare const Role: {
    readonly ADMIN: "ADMIN";
    readonly MEMBER: "MEMBER";
};
export type Role = (typeof Role)[keyof typeof Role];
export declare const PermissionScope: {
    readonly ALL: "ALL";
    readonly BRANCH: "BRANCH";
    readonly OWN: "OWN";
};
export type PermissionScope = (typeof PermissionScope)[keyof typeof PermissionScope];
export declare const TaskType: {
    readonly ADMINISTRATIVE: "ADMINISTRATIVE";
    readonly PHARMACEUTICALS: "PHARMACEUTICALS";
    readonly INVENTORY: "INVENTORY";
    readonly FINANCE: "FINANCE";
    readonly LABORATORY: "LABORATORY";
    readonly COSMETICS: "COSMETICS";
    readonly MEDICAL: "MEDICAL";
};
export type TaskType = (typeof TaskType)[keyof typeof TaskType];
export declare const TaskStatus: {
    readonly PENDING: "PENDING";
    readonly NOT_YET_STARTED: "NOT_YET_STARTED";
    readonly IN_PROGRESS: "IN_PROGRESS";
    readonly COMPLETED: "COMPLETED";
    readonly CANCELLED: "CANCELLED";
    readonly DUPLICATE: "DUPLICATE";
    readonly QUEUE: "QUEUE";
};
export type TaskStatus = (typeof TaskStatus)[keyof typeof TaskStatus];
export declare const TaskPriority: {
    readonly LOW: "LOW";
    readonly MEDIUM: "MEDIUM";
    readonly HIGH: "HIGH";
    readonly URGENT: "URGENT";
};
export type TaskPriority = (typeof TaskPriority)[keyof typeof TaskPriority];
export declare const TaskActivityType: {
    readonly STATUS_CHANGED: "STATUS_CHANGED";
    readonly COMMENT: "COMMENT";
    readonly TASK_ACCEPTED: "TASK_ACCEPTED";
    readonly TASK_DECLINED: "TASK_DECLINED";
};
export type TaskActivityType = (typeof TaskActivityType)[keyof typeof TaskActivityType];
export declare const InboxItemKind: {
    readonly NOTIFICATION: "NOTIFICATION";
    readonly APPROVAL: "APPROVAL";
};
export type InboxItemKind = (typeof InboxItemKind)[keyof typeof InboxItemKind];
export declare const InboxItemType: {
    readonly MEMBERSHIP: "MEMBERSHIP";
    readonly INSURANCE: "INSURANCE";
    readonly LEAD: "LEAD";
    readonly DEAL: "DEAL";
    readonly APPOINTMENT_CANCELLED: "APPOINTMENT_CANCELLED";
    readonly APPOINTMENT_NEW: "APPOINTMENT_NEW";
    readonly APPOINTMENT_PENDING: "APPOINTMENT_PENDING";
    readonly APPOINTMENT_CONFIRMED: "APPOINTMENT_CONFIRMED";
    readonly INVOICE: "INVOICE";
    readonly TASK: "TASK";
    readonly SYSTEM: "SYSTEM";
    readonly LAB: "LAB";
    readonly RADIOLOGY: "RADIOLOGY";
    readonly CARE: "CARE";
    readonly STOCK: "STOCK";
    readonly MENTION: "MENTION";
    readonly OPERATION: "OPERATION";
    readonly VACCINATION: "VACCINATION";
    readonly GROOMING: "GROOMING";
    readonly INPATIENT: "INPATIENT";
    readonly TRIAGE: "TRIAGE";
};
export type InboxItemType = (typeof InboxItemType)[keyof typeof InboxItemType];
export declare const InboxImportance: {
    readonly LOW: "LOW";
    readonly NORMAL: "NORMAL";
    readonly HIGH: "HIGH";
};
export type InboxImportance = (typeof InboxImportance)[keyof typeof InboxImportance];
export declare const InboxSoundName: {
    readonly CHIME: "CHIME";
    readonly PING: "PING";
    readonly MARIMBA: "MARIMBA";
    readonly KNOCK: "KNOCK";
};
export type InboxSoundName = (typeof InboxSoundName)[keyof typeof InboxSoundName];
export declare const InboxItemStatus: {
    readonly DRAFT: "DRAFT";
    readonly OPEN: "OPEN";
    readonly RESOLVED: "RESOLVED";
};
export type InboxItemStatus = (typeof InboxItemStatus)[keyof typeof InboxItemStatus];
export declare const ApprovalStatus: {
    readonly PENDING: "PENDING";
    readonly ACCEPTED: "ACCEPTED";
    readonly REJECTED: "REJECTED";
};
export type ApprovalStatus = (typeof ApprovalStatus)[keyof typeof ApprovalStatus];
export declare const InboxActivityType: {
    readonly CREATED: "CREATED";
    readonly COMMENT: "COMMENT";
    readonly ACCEPTED: "ACCEPTED";
    readonly REJECTED: "REJECTED";
    readonly STATUS_CHANGED: "STATUS_CHANGED";
};
export type InboxActivityType = (typeof InboxActivityType)[keyof typeof InboxActivityType];
export declare const AppointmentLocation: {
    readonly IN_CLINIC: "IN_CLINIC";
    readonly REMOTE: "REMOTE";
    readonly HOME_VISIT: "HOME_VISIT";
    readonly MOBILE_CLINIC: "MOBILE_CLINIC";
};
export type AppointmentLocation = (typeof AppointmentLocation)[keyof typeof AppointmentLocation];
export declare const AppointmentStatus: {
    readonly SCHEDULED: "SCHEDULED";
    readonly WAITING: "WAITING";
    readonly CHECK_IN: "CHECK_IN";
    readonly IN_SERVICE: "IN_SERVICE";
    readonly HOSPITALIZED: "HOSPITALIZED";
    readonly AWAITING_PAYMENT: "AWAITING_PAYMENT";
    readonly DONE: "DONE";
    readonly CANCELLED: "CANCELLED";
};
export type AppointmentStatus = (typeof AppointmentStatus)[keyof typeof AppointmentStatus];
export declare const LabTestStatus: {
    readonly QUEUE: "QUEUE";
    readonly SCHEDULED: "SCHEDULED";
    readonly SAMPLE_COLLECTION: "SAMPLE_COLLECTION";
    readonly IN_LAB: "IN_LAB";
    readonly UNDER_REVIEW: "UNDER_REVIEW";
    readonly COMPLETED: "COMPLETED";
    readonly CANCELLED: "CANCELLED";
};
export type LabTestStatus = (typeof LabTestStatus)[keyof typeof LabTestStatus];
export declare const LabSampleStage: {
    readonly NOT_COLLECTED: "NOT_COLLECTED";
    readonly COLLECTED: "COLLECTED";
    readonly QUALITY_CHECK: "QUALITY_CHECK";
    readonly LABEL_PRINT: "LABEL_PRINT";
    readonly ANALYZER_ASSIGNMENT: "ANALYZER_ASSIGNMENT";
    readonly HANDOVER_SUMMARY: "HANDOVER_SUMMARY";
    readonly ANALYZING: "ANALYZING";
    readonly RESULTS_READY: "RESULTS_READY";
};
export type LabSampleStage = (typeof LabSampleStage)[keyof typeof LabSampleStage];
export declare const LabParameterType: {
    readonly NUMERIC: "NUMERIC";
    readonly TEXT: "TEXT";
};
export type LabParameterType = (typeof LabParameterType)[keyof typeof LabParameterType];
export declare const LabActivityType: {
    readonly CREATED: "CREATED";
    readonly STATUS_CHANGED: "STATUS_CHANGED";
    readonly STAGE_CHANGED: "STAGE_CHANGED";
    readonly ASSIGNED: "ASSIGNED";
    readonly SAMPLE_COLLECTED: "SAMPLE_COLLECTED";
    readonly RESULTS_SAVED: "RESULTS_SAVED";
    readonly SENT_TO_REVIEW: "SENT_TO_REVIEW";
    readonly QC_REVIEWED: "QC_REVIEWED";
    readonly APPROVED: "APPROVED";
    readonly REJECTED: "REJECTED";
    readonly DECLINED: "DECLINED";
    readonly INVOICE_PAID: "INVOICE_PAID";
};
export type LabActivityType = (typeof LabActivityType)[keyof typeof LabActivityType];
export declare const LabResultFlag: {
    readonly NORMAL: "NORMAL";
    readonly LOW: "LOW";
    readonly HIGH: "HIGH";
};
export type LabResultFlag = (typeof LabResultFlag)[keyof typeof LabResultFlag];
export declare const LabFastingStatus: {
    readonly FASTED: "FASTED";
    readonly PARTIAL: "PARTIAL";
    readonly NOT_FASTED: "NOT_FASTED";
};
export type LabFastingStatus = (typeof LabFastingStatus)[keyof typeof LabFastingStatus];
export declare const LabTubeType: {
    readonly EDTA: "EDTA";
    readonly SST: "SST";
    readonly CITRATE: "CITRATE";
    readonly HEPARIN: "HEPARIN";
    readonly URINE: "URINE";
    readonly SWAB: "SWAB";
};
export type LabTubeType = (typeof LabTubeType)[keyof typeof LabTubeType];
export declare const LabSampleQuality: {
    readonly EXCELLENT: "EXCELLENT";
    readonly GOOD: "GOOD";
    readonly ACCEPTABLE: "ACCEPTABLE";
    readonly REJECTED: "REJECTED";
};
export type LabSampleQuality = (typeof LabSampleQuality)[keyof typeof LabSampleQuality];
export declare const RadiologyStatus: {
    readonly QUEUE: "QUEUE";
    readonly SCHEDULED: "SCHEDULED";
    readonly PREPARATION: "PREPARATION";
    readonly IMAGING: "IMAGING";
    readonly REPORTING: "REPORTING";
    readonly UNDER_REVIEW: "UNDER_REVIEW";
    readonly COMPLETED: "COMPLETED";
    readonly CANCELLED: "CANCELLED";
};
export type RadiologyStatus = (typeof RadiologyStatus)[keyof typeof RadiologyStatus];
export declare const RadiologyStage: {
    readonly SAFETY_SCREENING: "SAFETY_SCREENING";
    readonly PATIENT_PREP: "PATIENT_PREP";
    readonly ROOM_ASSIGNMENT: "ROOM_ASSIGNMENT";
    readonly READY_CHECK: "READY_CHECK";
    readonly ACQUISITION: "ACQUISITION";
    readonly IMAGE_UPLOAD: "IMAGE_UPLOAD";
    readonly IMAGE_QC: "IMAGE_QC";
};
export type RadiologyStage = (typeof RadiologyStage)[keyof typeof RadiologyStage];
export declare const RadiologyModality: {
    readonly XRAY: "XRAY";
    readonly CT: "CT";
    readonly MRI: "MRI";
    readonly ULTRASOUND: "ULTRASOUND";
    readonly FLUOROSCOPY: "FLUOROSCOPY";
    readonly MAMMOGRAPHY: "MAMMOGRAPHY";
    readonly NUCLEAR: "NUCLEAR";
    readonly PET: "PET";
    readonly DENTAL: "DENTAL";
    readonly OTHER: "OTHER";
};
export type RadiologyModality = (typeof RadiologyModality)[keyof typeof RadiologyModality];
export declare const RadiologyLaterality: {
    readonly NONE: "NONE";
    readonly LEFT: "LEFT";
    readonly RIGHT: "RIGHT";
    readonly BILATERAL: "BILATERAL";
};
export type RadiologyLaterality = (typeof RadiologyLaterality)[keyof typeof RadiologyLaterality];
export declare const ContrastRoute: {
    readonly IV: "IV";
    readonly ORAL: "ORAL";
    readonly RECTAL: "RECTAL";
    readonly INTRA_ARTICULAR: "INTRA_ARTICULAR";
    readonly OTHER: "OTHER";
};
export type ContrastRoute = (typeof ContrastRoute)[keyof typeof ContrastRoute];
export declare const SedationLevel: {
    readonly NONE: "NONE";
    readonly ANXIOLYSIS: "ANXIOLYSIS";
    readonly SEDATION: "SEDATION";
    readonly GENERAL_ANESTHESIA: "GENERAL_ANESTHESIA";
};
export type SedationLevel = (typeof SedationLevel)[keyof typeof SedationLevel];
export declare const OperationTier: {
    readonly MINOR: "MINOR";
    readonly INTERMEDIATE: "INTERMEDIATE";
    readonly MAJOR: "MAJOR";
};
export type OperationTier = (typeof OperationTier)[keyof typeof OperationTier];
export declare const OperationStatus: {
    readonly SCHEDULED: "SCHEDULED";
    readonly PREP: "PREP";
    readonly ANESTHESIA: "ANESTHESIA";
    readonly SURGERY: "SURGERY";
    readonly RECOVERY: "RECOVERY";
    readonly DISCHARGE: "DISCHARGE";
    readonly FOLLOW_UP: "FOLLOW_UP";
    readonly COMPLETED: "COMPLETED";
    readonly CANCELLED: "CANCELLED";
};
export type OperationStatus = (typeof OperationStatus)[keyof typeof OperationStatus];
export declare const OperationStage: {
    readonly CONSENT: "CONSENT";
    readonly FASTING_CHECK: "FASTING_CHECK";
    readonly ASSESSMENT: "ASSESSMENT";
    readonly PREMED: "PREMED";
    readonly SIGN_IN: "SIGN_IN";
    readonly INDUCTION: "INDUCTION";
    readonly MAINTENANCE: "MAINTENANCE";
    readonly TIME_OUT: "TIME_OUT";
    readonly IN_PROGRESS: "IN_PROGRESS";
    readonly CLOSING: "CLOSING";
    readonly SIGN_OUT: "SIGN_OUT";
    readonly MONITORING: "MONITORING";
    readonly READY_FOR_DISCHARGE: "READY_FOR_DISCHARGE";
};
export type OperationStage = (typeof OperationStage)[keyof typeof OperationStage];
export declare const OperationUrgency: {
    readonly IMMEDIATE: "IMMEDIATE";
    readonly URGENT: "URGENT";
    readonly EXPEDITED: "EXPEDITED";
    readonly ELECTIVE: "ELECTIVE";
};
export type OperationUrgency = (typeof OperationUrgency)[keyof typeof OperationUrgency];
export declare const WoundClass: {
    readonly CLEAN: "CLEAN";
    readonly CLEAN_CONTAMINATED: "CLEAN_CONTAMINATED";
    readonly CONTAMINATED: "CONTAMINATED";
    readonly DIRTY: "DIRTY";
};
export type WoundClass = (typeof WoundClass)[keyof typeof WoundClass];
export declare const ChecklistScope: {
    readonly OPERATION_SIGN_IN: "OPERATION_SIGN_IN";
    readonly OPERATION_TIME_OUT: "OPERATION_TIME_OUT";
    readonly OPERATION_SIGN_OUT: "OPERATION_SIGN_OUT";
    readonly OPERATION_MINOR_COMBINED: "OPERATION_MINOR_COMBINED";
};
export type ChecklistScope = (typeof ChecklistScope)[keyof typeof ChecklistScope];
export declare const SopDomain: {
    readonly LAB: "LAB";
    readonly RADIOLOGY: "RADIOLOGY";
    readonly OPERATION: "OPERATION";
};
export type SopDomain = (typeof SopDomain)[keyof typeof SopDomain];
export declare const ChecklistResponseType: {
    readonly CONFIRM: "CONFIRM";
    readonly YES_NO_NA: "YES_NO_NA";
    readonly TEXT: "TEXT";
    readonly NUMBER: "NUMBER";
};
export type ChecklistResponseType = (typeof ChecklistResponseType)[keyof typeof ChecklistResponseType];
export declare const OperationLaterality: {
    readonly NONE: "NONE";
    readonly LEFT: "LEFT";
    readonly RIGHT: "RIGHT";
    readonly BILATERAL: "BILATERAL";
};
export type OperationLaterality = (typeof OperationLaterality)[keyof typeof OperationLaterality];
export declare const OperationTeamRole: {
    readonly PRIMARY_SURGEON: "PRIMARY_SURGEON";
    readonly ASSISTANT_SURGEON: "ASSISTANT_SURGEON";
    readonly ANESTHETIST: "ANESTHETIST";
    readonly ANESTHESIA_TECH: "ANESTHESIA_TECH";
    readonly SCRUB_NURSE: "SCRUB_NURSE";
    readonly CIRCULATOR: "CIRCULATOR";
    readonly OBSERVER: "OBSERVER";
};
export type OperationTeamRole = (typeof OperationTeamRole)[keyof typeof OperationTeamRole];
export declare const OperationActivityType: {
    readonly CREATED: "CREATED";
    readonly STATUS_CHANGED: "STATUS_CHANGED";
    readonly STAGE_CHANGED: "STAGE_CHANGED";
    readonly SCHEDULE_CHANGED: "SCHEDULE_CHANGED";
    readonly TEAM_CHANGED: "TEAM_CHANGED";
    readonly URGENCY_CHANGED: "URGENCY_CHANGED";
    readonly GATE_OVERRIDDEN: "GATE_OVERRIDDEN";
    readonly CANCELLED: "CANCELLED";
    readonly NOTE: "NOTE";
    readonly CONSENT_SIGNED: "CONSENT_SIGNED";
    readonly CONSENT_REVOKED: "CONSENT_REVOKED";
    readonly ASSESSMENT_UPDATED: "ASSESSMENT_UPDATED";
    readonly CHECKLIST_COMPLETED: "CHECKLIST_COMPLETED";
    readonly NOTE_SIGNED: "NOTE_SIGNED";
};
export type OperationActivityType = (typeof OperationActivityType)[keyof typeof OperationActivityType];
export declare const OperationCancelKind: {
    readonly OWNER: "OWNER";
    readonly CLINIC: "CLINIC";
    readonly CLINICAL: "CLINICAL";
};
export type OperationCancelKind = (typeof OperationCancelKind)[keyof typeof OperationCancelKind];
export declare const ConsentType: {
    readonly SURGICAL: "SURGICAL";
    readonly ANESTHESIA: "ANESTHESIA";
    readonly BLOOD_PRODUCTS: "BLOOD_PRODUCTS";
    readonly EUTHANASIA: "EUTHANASIA";
    readonly FINANCIAL_ESTIMATE: "FINANCIAL_ESTIMATE";
    readonly HIGH_RISK_SURGICAL: "HIGH_RISK_SURGICAL";
    readonly HOSPITALIZATION: "HOSPITALIZATION";
    readonly DISCHARGE_HEALTHY: "DISCHARGE_HEALTHY";
    readonly DISCHARGE_HOME_TREATMENT: "DISCHARGE_HOME_TREATMENT";
    readonly DISCHARGE_AGAINST_ADVICE: "DISCHARGE_AGAINST_ADVICE";
    readonly BOARDING: "BOARDING";
    readonly GROOMING: "GROOMING";
    readonly EMERGENCY_TREATMENT: "EMERGENCY_TREATMENT";
};
export type ConsentType = (typeof ConsentType)[keyof typeof ConsentType];
export declare const ConsentStatus: {
    readonly DRAFT: "DRAFT";
    readonly AWAITING_SIGNATURE: "AWAITING_SIGNATURE";
    readonly SIGNED: "SIGNED";
    readonly REVOKED: "REVOKED";
};
export type ConsentStatus = (typeof ConsentStatus)[keyof typeof ConsentStatus];
export declare const ConsentLocale: {
    readonly AR: "AR";
    readonly EN: "EN";
    readonly BOTH: "BOTH";
};
export type ConsentLocale = (typeof ConsentLocale)[keyof typeof ConsentLocale];
export declare const SignatureMethod: {
    readonly DRAWN: "DRAWN";
    readonly TYPED: "TYPED";
    readonly UPLOADED: "UPLOADED";
    readonly VERBAL_WITNESSED: "VERBAL_WITNESSED";
};
export type SignatureMethod = (typeof SignatureMethod)[keyof typeof SignatureMethod];
export declare const ChecklistItemResponse: {
    readonly CONFIRMED: "CONFIRMED";
    readonly YES: "YES";
    readonly NO: "NO";
    readonly NA: "NA";
};
export type ChecklistItemResponse = (typeof ChecklistItemResponse)[keyof typeof ChecklistItemResponse];
export declare const AnesthesiaEventKind: {
    readonly DRUG: "DRUG";
    readonly ABX_PROPHYLAXIS: "ABX_PROPHYLAXIS";
    readonly FLUID: "FLUID";
    readonly POSITION: "POSITION";
    readonly EVENT: "EVENT";
    readonly NOTE: "NOTE";
};
export type AnesthesiaEventKind = (typeof AnesthesiaEventKind)[keyof typeof AnesthesiaEventKind];
export declare const DrugRoute: {
    readonly IV: "IV";
    readonly IM: "IM";
    readonly SC: "SC";
    readonly PO: "PO";
    readonly INHALATION: "INHALATION";
    readonly TOPICAL: "TOPICAL";
    readonly EPIDURAL: "EPIDURAL";
    readonly OTHER: "OTHER";
};
export type DrugRoute = (typeof DrugRoute)[keyof typeof DrugRoute];
export declare const CountType: {
    readonly SPONGE: "SPONGE";
    readonly NEEDLE: "NEEDLE";
    readonly INSTRUMENT: "INSTRUMENT";
};
export type CountType = (typeof CountType)[keyof typeof CountType];
export declare const PainScale: {
    readonly GLASGOW_CMPS: "GLASGOW_CMPS";
    readonly NRS: "NRS";
    readonly VAS: "VAS";
    readonly FLACC: "FLACC";
    readonly OTHER: "OTHER";
};
export type PainScale = (typeof PainScale)[keyof typeof PainScale];
export declare const OperationConsumableType: {
    readonly KIT: "KIT";
    readonly BURNED: "BURNED";
    readonly ADDITIONAL: "ADDITIONAL";
};
export type OperationConsumableType = (typeof OperationConsumableType)[keyof typeof OperationConsumableType];
export declare const ComplicationPhase: {
    readonly INTRA_OP: "INTRA_OP";
    readonly RECOVERY: "RECOVERY";
    readonly POST_OP: "POST_OP";
};
export type ComplicationPhase = (typeof ComplicationPhase)[keyof typeof ComplicationPhase];
export declare const ClavienDindo: {
    readonly GRADE_I: "GRADE_I";
    readonly GRADE_II: "GRADE_II";
    readonly GRADE_IIIA: "GRADE_IIIA";
    readonly GRADE_IIIB: "GRADE_IIIB";
    readonly GRADE_IVA: "GRADE_IVA";
    readonly GRADE_IVB: "GRADE_IVB";
    readonly GRADE_V: "GRADE_V";
};
export type ClavienDindo = (typeof ClavienDindo)[keyof typeof ClavienDindo];
export declare const PostOpOrderKind: {
    readonly MEDICATION: "MEDICATION";
    readonly MONITORING: "MONITORING";
    readonly FEEDING: "FEEDING";
    readonly ACTIVITY: "ACTIVITY";
    readonly WOUND_CARE: "WOUND_CARE";
    readonly FOLLOW_UP: "FOLLOW_UP";
    readonly SUTURE_REMOVAL: "SUTURE_REMOVAL";
};
export type PostOpOrderKind = (typeof PostOpOrderKind)[keyof typeof PostOpOrderKind];
export declare const RadiologyImageKind: {
    readonly DICOM: "DICOM";
    readonly IMAGE: "IMAGE";
};
export type RadiologyImageKind = (typeof RadiologyImageKind)[keyof typeof RadiologyImageKind];
export declare const RadiologyImageQuality: {
    readonly DIAGNOSTIC: "DIAGNOSTIC";
    readonly LIMITED: "LIMITED";
    readonly NON_DIAGNOSTIC: "NON_DIAGNOSTIC";
};
export type RadiologyImageQuality = (typeof RadiologyImageQuality)[keyof typeof RadiologyImageQuality];
export declare const RadiologyActivityType: {
    readonly CREATED: "CREATED";
    readonly STATUS_CHANGED: "STATUS_CHANGED";
    readonly STAGE_CHANGED: "STAGE_CHANGED";
    readonly ASSIGNED: "ASSIGNED";
    readonly SAFETY_COMPLETED: "SAFETY_COMPLETED";
    readonly MACHINE_ASSIGNED: "MACHINE_ASSIGNED";
    readonly IMAGES_UPLOADED: "IMAGES_UPLOADED";
    readonly REPORT_SAVED: "REPORT_SAVED";
    readonly SENT_TO_REVIEW: "SENT_TO_REVIEW";
    readonly APPROVED: "APPROVED";
    readonly REJECTED: "REJECTED";
    readonly DECLINED: "DECLINED";
    readonly CRITICAL_FLAGGED: "CRITICAL_FLAGGED";
    readonly INVOICE_PAID: "INVOICE_PAID";
    readonly RESCHEDULED: "RESCHEDULED";
    readonly ADDENDUM_ADDED: "ADDENDUM_ADDED";
};
export type RadiologyActivityType = (typeof RadiologyActivityType)[keyof typeof RadiologyActivityType];
export declare const AppointmentActivityType: {
    readonly CREATED: "CREATED";
    readonly STATUS_CHANGED: "STATUS_CHANGED";
    readonly COMMENT: "COMMENT";
    readonly DOCUMENT_ADDED: "DOCUMENT_ADDED";
    readonly DOCUMENT_REMOVED: "DOCUMENT_REMOVED";
    readonly RESCHEDULED: "RESCHEDULED";
    readonly OWNER_REASSIGNED: "OWNER_REASSIGNED";
    readonly STAFF_REASSIGNED: "STAFF_REASSIGNED";
    readonly EXAM_STARTED: "EXAM_STARTED";
    readonly EXAM_COMPLETED: "EXAM_COMPLETED";
};
export type AppointmentActivityType = (typeof AppointmentActivityType)[keyof typeof AppointmentActivityType];
export declare const PatientActivityType: {
    readonly OWNERSHIP_TRANSFERRED: "OWNERSHIP_TRANSFERRED";
    readonly GROOMING_FINDING: "GROOMING_FINDING";
};
export type PatientActivityType = (typeof PatientActivityType)[keyof typeof PatientActivityType];
export declare const DocumentKind: {
    readonly FILE: "FILE";
    readonly LINK: "LINK";
};
export type DocumentKind = (typeof DocumentKind)[keyof typeof DocumentKind];
export declare const StaffDocumentCategory: {
    readonly DOCUMENT: "DOCUMENT";
    readonly CERTIFICATE: "CERTIFICATE";
    readonly IMAGE: "IMAGE";
};
export type StaffDocumentCategory = (typeof StaffDocumentCategory)[keyof typeof StaffDocumentCategory];
export declare const ClinicDocumentCategory: {
    readonly LICENSE: "LICENSE";
    readonly REGISTRATION: "REGISTRATION";
    readonly CONTRACT: "CONTRACT";
    readonly INSURANCE: "INSURANCE";
    readonly POLICY: "POLICY";
    readonly FINANCIAL: "FINANCIAL";
    readonly OTHER: "OTHER";
};
export type ClinicDocumentCategory = (typeof ClinicDocumentCategory)[keyof typeof ClinicDocumentCategory];
export declare const QueueStatus: {
    readonly ON_HOLD: "ON_HOLD";
    readonly NO_SHOW: "NO_SHOW";
    readonly CONFIRMED: "CONFIRMED";
};
export type QueueStatus = (typeof QueueStatus)[keyof typeof QueueStatus];
export declare const HairType: {
    readonly LONG_THICK: "LONG_THICK";
    readonly SHORT_THICK: "SHORT_THICK";
    readonly LIGHT: "LIGHT";
    readonly MEDIUM: "MEDIUM";
    readonly DOUBLE_COAT: "DOUBLE_COAT";
    readonly NONE: "NONE";
};
export type HairType = (typeof HairType)[keyof typeof HairType];
export declare const ActivityLevel: {
    readonly LOW: "LOW";
    readonly MEDIUM: "MEDIUM";
    readonly HIGH: "HIGH";
};
export type ActivityLevel = (typeof ActivityLevel)[keyof typeof ActivityLevel];
export declare const GroomingNeeds: {
    readonly LOW: "LOW";
    readonly MEDIUM: "MEDIUM";
    readonly HIGH: "HIGH";
};
export type GroomingNeeds = (typeof GroomingNeeds)[keyof typeof GroomingNeeds];
export declare const ClinicalSymptom: {
    readonly VOMITING: "VOMITING";
    readonly DIARRHEA: "DIARRHEA";
    readonly COUGH: "COUGH";
    readonly SNEEZING: "SNEEZING";
    readonly LETHARGY: "LETHARGY";
};
export type ClinicalSymptom = (typeof ClinicalSymptom)[keyof typeof ClinicalSymptom];
export declare const ClinicalLevel: {
    readonly NORMAL: "NORMAL";
    readonly INCREASED: "INCREASED";
    readonly DECREASED: "DECREASED";
    readonly ABSENT: "ABSENT";
};
export type ClinicalLevel = (typeof ClinicalLevel)[keyof typeof ClinicalLevel];
export declare const ExamCondition: {
    readonly NORMAL: "NORMAL";
    readonly ABNORMAL: "ABNORMAL";
    readonly NOT_EXAMINED: "NOT_EXAMINED";
};
export type ExamCondition = (typeof ExamCondition)[keyof typeof ExamCondition];
export declare const DiagnosisSeverity: {
    readonly MILD: "MILD";
    readonly MODERATE: "MODERATE";
    readonly SEVERE: "SEVERE";
    readonly CRITICAL: "CRITICAL";
};
export type DiagnosisSeverity = (typeof DiagnosisSeverity)[keyof typeof DiagnosisSeverity];
export declare const ClinicalNoteStatus: {
    readonly DRAFT: "DRAFT";
    readonly FINAL: "FINAL";
    readonly AMENDED: "AMENDED";
};
export type ClinicalNoteStatus = (typeof ClinicalNoteStatus)[keyof typeof ClinicalNoteStatus];
export declare const DiagnosisKind: {
    readonly DIFFERENTIAL: "DIFFERENTIAL";
    readonly WORKING: "WORKING";
    readonly FINAL: "FINAL";
};
export type DiagnosisKind = (typeof DiagnosisKind)[keyof typeof DiagnosisKind];
export declare const VitalSignsSource: {
    readonly MANUAL: "MANUAL";
    readonly VISIT: "VISIT";
    readonly LAB: "LAB";
    readonly RADIOLOGY: "RADIOLOGY";
    readonly OPERATION: "OPERATION";
    readonly GROOMING: "GROOMING";
    readonly INPATIENT: "INPATIENT";
    readonly TRIAGE: "TRIAGE";
};
export type VitalSignsSource = (typeof VitalSignsSource)[keyof typeof VitalSignsSource];
export declare const MucousMembrane: {
    readonly PINK: "PINK";
    readonly PALE: "PALE";
    readonly CYANOTIC: "CYANOTIC";
    readonly ICTERIC: "ICTERIC";
    readonly CONGESTED: "CONGESTED";
    readonly MUDDY: "MUDDY";
};
export type MucousMembrane = (typeof MucousMembrane)[keyof typeof MucousMembrane];
export declare const InvoiceStatus: {
    readonly PENDING: "PENDING";
    readonly PARTIAL: "PARTIAL";
    readonly PAID: "PAID";
    readonly VOIDED: "VOIDED";
    readonly REFUNDED: "REFUNDED";
};
export type InvoiceStatus = (typeof InvoiceStatus)[keyof typeof InvoiceStatus];
export declare const PaymentMethod: {
    readonly CASH: "CASH";
    readonly CARD: "CARD";
    readonly TRANSFER: "TRANSFER";
};
export type PaymentMethod = (typeof PaymentMethod)[keyof typeof PaymentMethod];
export declare const SaleStatus: {
    readonly PENDING: "PENDING";
    readonly PAID: "PAID";
    readonly REFUNDED: "REFUNDED";
};
export type SaleStatus = (typeof SaleStatus)[keyof typeof SaleStatus];
export declare const SaleFulfillment: {
    readonly AT_PAYMENT: "AT_PAYMENT";
    readonly ON_DISPENSE: "ON_DISPENSE";
};
export type SaleFulfillment = (typeof SaleFulfillment)[keyof typeof SaleFulfillment];
export declare const RepeatUnit: {
    readonly DAY: "DAY";
    readonly WEEK: "WEEK";
    readonly TWO_WEEKS: "TWO_WEEKS";
    readonly MONTH: "MONTH";
    readonly YEAR: "YEAR";
};
export type RepeatUnit = (typeof RepeatUnit)[keyof typeof RepeatUnit];
export declare const CourseType: {
    readonly INTERNAL: "INTERNAL";
    readonly WORKSHOP: "WORKSHOP";
    readonly ONLINE: "ONLINE";
    readonly CERTIFICATION: "CERTIFICATION";
    readonly CONFERENCE: "CONFERENCE";
};
export type CourseType = (typeof CourseType)[keyof typeof CourseType];
export declare const CourseStatus: {
    readonly DRAFT: "DRAFT";
    readonly PUBLISHED: "PUBLISHED";
    readonly ARCHIVED: "ARCHIVED";
};
export type CourseStatus = (typeof CourseStatus)[keyof typeof CourseStatus];
export declare const LessonType: {
    readonly TEXT: "TEXT";
    readonly PAGE: "PAGE";
    readonly VIDEO: "VIDEO";
    readonly DOCUMENT: "DOCUMENT";
    readonly QUIZ: "QUIZ";
    readonly SURVEY: "SURVEY";
    readonly AUDIO: "AUDIO";
};
export type LessonType = (typeof LessonType)[keyof typeof LessonType];
export declare const LessonMediaSource: {
    readonly DEVICE: "DEVICE";
    readonly URL: "URL";
};
export type LessonMediaSource = (typeof LessonMediaSource)[keyof typeof LessonMediaSource];
export declare const CoursePriority: {
    readonly URGENT: "URGENT";
    readonly NORMAL: "NORMAL";
};
export type CoursePriority = (typeof CoursePriority)[keyof typeof CoursePriority];
export declare const CourseLanguage: {
    readonly AR: "AR";
    readonly EN: "EN";
};
export type CourseLanguage = (typeof CourseLanguage)[keyof typeof CourseLanguage];
export declare const CourseOrderMode: {
    readonly SEQUENTIAL: "SEQUENTIAL";
    readonly FREE: "FREE";
};
export type CourseOrderMode = (typeof CourseOrderMode)[keyof typeof CourseOrderMode];
export declare const CourseLocationMode: {
    readonly ONSITE: "ONSITE";
    readonly ONLINE: "ONLINE";
    readonly HYBRID: "HYBRID";
};
export type CourseLocationMode = (typeof CourseLocationMode)[keyof typeof CourseLocationMode];
export declare const CourseContentType: {
    readonly PAGE: "PAGE";
    readonly LESSON: "LESSON";
    readonly QUIZ: "QUIZ";
};
export type CourseContentType = (typeof CourseContentType)[keyof typeof CourseContentType];
export declare const ContentStatus: {
    readonly DRAFT: "DRAFT";
    readonly PUBLISHED: "PUBLISHED";
};
export type ContentStatus = (typeof ContentStatus)[keyof typeof ContentStatus];
export declare const AssignmentSource: {
    readonly MANUAL: "MANUAL";
    readonly AUTO: "AUTO";
    readonly ENROLL_ALL: "ENROLL_ALL";
};
export type AssignmentSource = (typeof AssignmentSource)[keyof typeof AssignmentSource];
export declare const AssignmentStatus: {
    readonly ASSIGNED: "ASSIGNED";
    readonly IN_PROGRESS: "IN_PROGRESS";
    readonly COMPLETED: "COMPLETED";
};
export type AssignmentStatus = (typeof AssignmentStatus)[keyof typeof AssignmentStatus];
export declare const AutoAssignEntity: {
    readonly BRANCH: "BRANCH";
    readonly ROLE: "ROLE";
    readonly SPECIALIZATION: "SPECIALIZATION";
};
export type AutoAssignEntity = (typeof AutoAssignEntity)[keyof typeof AutoAssignEntity];
export declare const ReEnrollMode: {
    readonly NONE: "NONE";
    readonly AFTER_COMPLETION: "AFTER_COMPLETION";
    readonly BEFORE_EXPIRY: "BEFORE_EXPIRY";
};
export type ReEnrollMode = (typeof ReEnrollMode)[keyof typeof ReEnrollMode];
export declare const QuizStatus: {
    readonly DRAFT: "DRAFT";
    readonly PUBLISHED: "PUBLISHED";
    readonly ARCHIVED: "ARCHIVED";
};
export type QuizStatus = (typeof QuizStatus)[keyof typeof QuizStatus];
export declare const QuizAnswerType: {
    readonly SINGLE: "SINGLE";
    readonly MULTIPLE: "MULTIPLE";
    readonly TEXT: "TEXT";
};
export type QuizAnswerType = (typeof QuizAnswerType)[keyof typeof QuizAnswerType];
export declare const QuizGradingStatus: {
    readonly AUTO_DONE: "AUTO_DONE";
    readonly NEEDS_MANUAL: "NEEDS_MANUAL";
    readonly GRADED: "GRADED";
};
export type QuizGradingStatus = (typeof QuizGradingStatus)[keyof typeof QuizGradingStatus];
export declare const DocStatus: {
    readonly DRAFT: "DRAFT";
    readonly SUBMITTED: "SUBMITTED";
    readonly CANCELLED: "CANCELLED";
};
export type DocStatus = (typeof DocStatus)[keyof typeof DocStatus];
export declare const AccountingJobStatus: {
    readonly QUEUED: "QUEUED";
    readonly IN_PROGRESS: "IN_PROGRESS";
    readonly COMPLETED: "COMPLETED";
    readonly FAILED: "FAILED";
};
export type AccountingJobStatus = (typeof AccountingJobStatus)[keyof typeof AccountingJobStatus];
export declare const AccountRootType: {
    readonly ASSET: "ASSET";
    readonly LIABILITY: "LIABILITY";
    readonly INCOME: "INCOME";
    readonly EXPENSE: "EXPENSE";
    readonly EQUITY: "EQUITY";
};
export type AccountRootType = (typeof AccountRootType)[keyof typeof AccountRootType];
export declare const AccountReportType: {
    readonly BALANCE_SHEET: "BALANCE_SHEET";
    readonly PROFIT_AND_LOSS: "PROFIT_AND_LOSS";
};
export type AccountReportType = (typeof AccountReportType)[keyof typeof AccountReportType];
export declare const AccountType: {
    readonly BANK: "BANK";
    readonly CASH: "CASH";
    readonly RECEIVABLE: "RECEIVABLE";
    readonly PAYABLE: "PAYABLE";
    readonly TAX: "TAX";
    readonly STOCK: "STOCK";
    readonly FIXED_ASSET: "FIXED_ASSET";
    readonly ACCUMULATED_DEPRECIATION: "ACCUMULATED_DEPRECIATION";
    readonly DEPRECIATION: "DEPRECIATION";
    readonly EXPENSE_ACCOUNT: "EXPENSE_ACCOUNT";
    readonly INCOME_ACCOUNT: "INCOME_ACCOUNT";
    readonly CHARGEABLE: "CHARGEABLE";
    readonly ROUND_OFF: "ROUND_OFF";
    readonly ROUND_OFF_FOR_OPENING: "ROUND_OFF_FOR_OPENING";
    readonly TEMPORARY: "TEMPORARY";
    readonly EQUITY: "EQUITY";
    readonly DIRECT_INCOME: "DIRECT_INCOME";
    readonly INDIRECT_INCOME: "INDIRECT_INCOME";
    readonly DIRECT_EXPENSE: "DIRECT_EXPENSE";
    readonly INDIRECT_EXPENSE: "INDIRECT_EXPENSE";
    readonly COST_OF_GOODS_SOLD: "COST_OF_GOODS_SOLD";
    readonly CURRENT_ASSET: "CURRENT_ASSET";
    readonly CURRENT_LIABILITY: "CURRENT_LIABILITY";
    readonly CAPITAL_WORK_IN_PROGRESS: "CAPITAL_WORK_IN_PROGRESS";
    readonly ASSET_RECEIVED_BUT_NOT_BILLED: "ASSET_RECEIVED_BUT_NOT_BILLED";
    readonly STOCK_RECEIVED_BUT_NOT_BILLED: "STOCK_RECEIVED_BUT_NOT_BILLED";
    readonly SERVICE_RECEIVED_BUT_NOT_BILLED: "SERVICE_RECEIVED_BUT_NOT_BILLED";
    readonly STOCK_ADJUSTMENT: "STOCK_ADJUSTMENT";
};
export type AccountType = (typeof AccountType)[keyof typeof AccountType];
export declare const BalanceMustBe: {
    readonly NONE: "NONE";
    readonly DEBIT: "DEBIT";
    readonly CREDIT: "CREDIT";
};
export type BalanceMustBe = (typeof BalanceMustBe)[keyof typeof BalanceMustBe];
export declare const BudgetAction: {
    readonly STOP: "STOP";
    readonly WARN: "WARN";
    readonly IGNORE: "IGNORE";
};
export type BudgetAction = (typeof BudgetAction)[keyof typeof BudgetAction];
export declare const BudgetAgainst: {
    readonly COST_CENTER: "COST_CENTER";
    readonly PROJECT: "PROJECT";
};
export type BudgetAgainst = (typeof BudgetAgainst)[keyof typeof BudgetAgainst];
export declare const BankTransactionStatus: {
    readonly PENDING: "PENDING";
    readonly UNRECONCILED: "UNRECONCILED";
    readonly RECONCILED: "RECONCILED";
    readonly SETTLED: "SETTLED";
    readonly CANCELLED: "CANCELLED";
};
export type BankTransactionStatus = (typeof BankTransactionStatus)[keyof typeof BankTransactionStatus];
export declare const BankRuleDirection: {
    readonly ANY: "ANY";
    readonly DEPOSIT: "DEPOSIT";
    readonly WITHDRAWAL: "WITHDRAWAL";
};
export type BankRuleDirection = (typeof BankRuleDirection)[keyof typeof BankRuleDirection];
export declare const ModeOfPaymentType: {
    readonly CASH: "CASH";
    readonly BANK: "BANK";
    readonly GENERAL: "GENERAL";
    readonly PHONE: "PHONE";
};
export type ModeOfPaymentType = (typeof ModeOfPaymentType)[keyof typeof ModeOfPaymentType];
export declare const TaxChargeType: {
    readonly ACTUAL: "ACTUAL";
    readonly ON_NET_TOTAL: "ON_NET_TOTAL";
    readonly ON_PREVIOUS_ROW_AMOUNT: "ON_PREVIOUS_ROW_AMOUNT";
    readonly ON_PREVIOUS_ROW_TOTAL: "ON_PREVIOUS_ROW_TOTAL";
    readonly ON_ITEM_QUANTITY: "ON_ITEM_QUANTITY";
};
export type TaxChargeType = (typeof TaxChargeType)[keyof typeof TaxChargeType];
export declare const TaxRowCategory: {
    readonly TOTAL: "TOTAL";
    readonly VALUATION: "VALUATION";
    readonly VALUATION_AND_TOTAL: "VALUATION_AND_TOTAL";
};
export type TaxRowCategory = (typeof TaxRowCategory)[keyof typeof TaxRowCategory];
export declare const TaxAddDeduct: {
    readonly ADD: "ADD";
    readonly DEDUCT: "DEDUCT";
};
export type TaxAddDeduct = (typeof TaxAddDeduct)[keyof typeof TaxAddDeduct];
export declare const DueDateBasis: {
    readonly DAYS_AFTER_INVOICE_DATE: "DAYS_AFTER_INVOICE_DATE";
    readonly DAYS_AFTER_INVOICE_MONTH_END: "DAYS_AFTER_INVOICE_MONTH_END";
    readonly MONTHS_AFTER_INVOICE_MONTH_END: "MONTHS_AFTER_INVOICE_MONTH_END";
};
export type DueDateBasis = (typeof DueDateBasis)[keyof typeof DueDateBasis];
export declare const PaymentDiscountType: {
    readonly PERCENTAGE: "PERCENTAGE";
    readonly AMOUNT: "AMOUNT";
};
export type PaymentDiscountType = (typeof PaymentDiscountType)[keyof typeof PaymentDiscountType];
export declare const TaxWithholdingBasis: {
    readonly GROSS: "GROSS";
    readonly NET: "NET";
};
export type TaxWithholdingBasis = (typeof TaxWithholdingBasis)[keyof typeof TaxWithholdingBasis];
export declare const SalesInvoiceStatus: {
    readonly DRAFT: "DRAFT";
    readonly SUBMITTED: "SUBMITTED";
    readonly UNPAID: "UNPAID";
    readonly PAID: "PAID";
    readonly PARTLY_PAID: "PARTLY_PAID";
    readonly OVERDUE: "OVERDUE";
    readonly RETURN: "RETURN";
    readonly CREDIT_NOTE_ISSUED: "CREDIT_NOTE_ISSUED";
    readonly INTERNAL_TRANSFER: "INTERNAL_TRANSFER";
    readonly CONSOLIDATED: "CONSOLIDATED";
    readonly CANCELLED: "CANCELLED";
};
export type SalesInvoiceStatus = (typeof SalesInvoiceStatus)[keyof typeof SalesInvoiceStatus];
export declare const ApplyDiscountOn: {
    readonly GRAND_TOTAL: "GRAND_TOTAL";
    readonly NET_TOTAL: "NET_TOTAL";
};
export type ApplyDiscountOn = (typeof ApplyDiscountOn)[keyof typeof ApplyDiscountOn];
export declare const MarginType: {
    readonly PERCENTAGE: "PERCENTAGE";
    readonly AMOUNT: "AMOUNT";
};
export type MarginType = (typeof MarginType)[keyof typeof MarginType];
export declare const ConversationKind: {
    readonly DIRECT: "DIRECT";
    readonly GROUP: "GROUP";
};
export type ConversationKind = (typeof ConversationKind)[keyof typeof ConversationKind];
export declare const PurchaseInvoiceStatus: {
    readonly DRAFT: "DRAFT";
    readonly SUBMITTED: "SUBMITTED";
    readonly UNPAID: "UNPAID";
    readonly PAID: "PAID";
    readonly PARTLY_PAID: "PARTLY_PAID";
    readonly OVERDUE: "OVERDUE";
    readonly RETURN: "RETURN";
    readonly DEBIT_NOTE_ISSUED: "DEBIT_NOTE_ISSUED";
    readonly INTERNAL_TRANSFER: "INTERNAL_TRANSFER";
    readonly CANCELLED: "CANCELLED";
};
export type PurchaseInvoiceStatus = (typeof PurchaseInvoiceStatus)[keyof typeof PurchaseInvoiceStatus];
export declare const DeferredType: {
    readonly REVENUE: "REVENUE";
    readonly EXPENSE: "EXPENSE";
};
export type DeferredType = (typeof DeferredType)[keyof typeof DeferredType];
export declare const CatalogSpecies: {
    readonly DOG: "DOG";
    readonly CAT: "CAT";
    readonly HORSE: "HORSE";
    readonly CATTLE: "CATTLE";
    readonly SHEEP: "SHEEP";
    readonly GOAT: "GOAT";
    readonly CAMEL: "CAMEL";
    readonly POULTRY: "POULTRY";
    readonly RABBIT: "RABBIT";
    readonly SWINE: "SWINE";
    readonly FISH: "FISH";
    readonly BEE: "BEE";
};
export type CatalogSpecies = (typeof CatalogSpecies)[keyof typeof CatalogSpecies];
export declare const PaymentType: {
    readonly RECEIVE: "RECEIVE";
    readonly PAY: "PAY";
    readonly INTERNAL_TRANSFER: "INTERNAL_TRANSFER";
};
export type PaymentType = (typeof PaymentType)[keyof typeof PaymentType];
export declare const PaymentEntryStatus: {
    readonly DRAFT: "DRAFT";
    readonly SUBMITTED: "SUBMITTED";
    readonly CANCELLED: "CANCELLED";
};
export type PaymentEntryStatus = (typeof PaymentEntryStatus)[keyof typeof PaymentEntryStatus];
export declare const VaccineKind: {
    readonly MODIFIED_LIVE: "MODIFIED_LIVE";
    readonly KILLED: "KILLED";
    readonly RECOMBINANT: "RECOMBINANT";
    readonly TOXOID: "TOXOID";
    readonly SUBUNIT: "SUBUNIT";
    readonly OTHER: "OTHER";
};
export type VaccineKind = (typeof VaccineKind)[keyof typeof VaccineKind];
export declare const VaccineRoute: {
    readonly SUBCUTANEOUS: "SUBCUTANEOUS";
    readonly INTRAMUSCULAR: "INTRAMUSCULAR";
    readonly INTRANASAL: "INTRANASAL";
    readonly ORAL: "ORAL";
    readonly INTRADERMAL: "INTRADERMAL";
    readonly TOPICAL: "TOPICAL";
    readonly OTHER: "OTHER";
};
export type VaccineRoute = (typeof VaccineRoute)[keyof typeof VaccineRoute];
export declare const InjectionSite: {
    readonly LEFT_SHOULDER: "LEFT_SHOULDER";
    readonly RIGHT_SHOULDER: "RIGHT_SHOULDER";
    readonly LEFT_HIND_LIMB: "LEFT_HIND_LIMB";
    readonly RIGHT_HIND_LIMB: "RIGHT_HIND_LIMB";
    readonly INTERSCAPULAR: "INTERSCAPULAR";
    readonly LEFT_FLANK: "LEFT_FLANK";
    readonly RIGHT_FLANK: "RIGHT_FLANK";
    readonly NASAL: "NASAL";
    readonly ORAL: "ORAL";
    readonly OTHER: "OTHER";
};
export type InjectionSite = (typeof InjectionSite)[keyof typeof InjectionSite];
export declare const VaccinationDoseKind: {
    readonly PRIMARY: "PRIMARY";
    readonly BOOSTER: "BOOSTER";
    readonly ANNUAL: "ANNUAL";
    readonly CATCH_UP: "CATCH_UP";
};
export type VaccinationDoseKind = (typeof VaccinationDoseKind)[keyof typeof VaccinationDoseKind];
export declare const AdverseReactionSeverity: {
    readonly NONE: "NONE";
    readonly MILD: "MILD";
    readonly MODERATE: "MODERATE";
    readonly SEVERE: "SEVERE";
    readonly ANAPHYLACTIC: "ANAPHYLACTIC";
};
export type AdverseReactionSeverity = (typeof AdverseReactionSeverity)[keyof typeof AdverseReactionSeverity];
export declare const MobileUnitStatus: {
    readonly OFFLINE: "OFFLINE";
    readonly AVAILABLE: "AVAILABLE";
    readonly EN_ROUTE: "EN_ROUTE";
    readonly ON_SITE: "ON_SITE";
    readonly RETURNING: "RETURNING";
    readonly ON_BREAK: "ON_BREAK";
    readonly OUT_OF_SERVICE: "OUT_OF_SERVICE";
};
export type MobileUnitStatus = (typeof MobileUnitStatus)[keyof typeof MobileUnitStatus];
export declare const MobileUnitCrewRole: {
    readonly DRIVER: "DRIVER";
    readonly VET: "VET";
    readonly TECHNICIAN: "TECHNICIAN";
    readonly GROOMER: "GROOMER";
    readonly ASSISTANT: "ASSISTANT";
};
export type MobileUnitCrewRole = (typeof MobileUnitCrewRole)[keyof typeof MobileUnitCrewRole];
export declare const MobileUnitActivityType: {
    readonly CREATED: "CREATED";
    readonly UPDATED: "UPDATED";
    readonly ENABLED: "ENABLED";
    readonly DISABLED: "DISABLED";
    readonly DELETED: "DELETED";
    readonly STATUS_CHANGED: "STATUS_CHANGED";
    readonly CREW_ADDED: "CREW_ADDED";
    readonly CREW_REMOVED: "CREW_REMOVED";
    readonly DEVICE_PAIRED: "DEVICE_PAIRED";
    readonly DEVICE_REVOKED: "DEVICE_REVOKED";
    readonly SHIFT_STARTED: "SHIFT_STARTED";
    readonly SHIFT_ENDED: "SHIFT_ENDED";
    readonly STOCK_RECEIVED: "STOCK_RECEIVED";
    readonly VISIT_ASSIGNED: "VISIT_ASSIGNED";
    readonly VISIT_UNASSIGNED: "VISIT_UNASSIGNED";
};
export type MobileUnitActivityType = (typeof MobileUnitActivityType)[keyof typeof MobileUnitActivityType];
export declare const MobileVisitServiceSource: {
    readonly SCHEDULED: "SCHEDULED";
    readonly FIELD: "FIELD";
};
export type MobileVisitServiceSource = (typeof MobileVisitServiceSource)[keyof typeof MobileVisitServiceSource];
export declare const GeocodeSource: {
    readonly MANUAL_PIN: "MANUAL_PIN";
    readonly NOMINATIM: "NOMINATIM";
    readonly DEVICE_GPS: "DEVICE_GPS";
};
export type GeocodeSource = (typeof GeocodeSource)[keyof typeof GeocodeSource];
export declare const MobileDispatchStage: {
    readonly PENDING: "PENDING";
    readonly ASSIGNED: "ASSIGNED";
    readonly EN_ROUTE: "EN_ROUTE";
    readonly ARRIVED: "ARRIVED";
    readonly IN_SERVICE: "IN_SERVICE";
    readonly COMPLETED: "COMPLETED";
    readonly FAILED: "FAILED";
    readonly CANCELLED: "CANCELLED";
};
export type MobileDispatchStage = (typeof MobileDispatchStage)[keyof typeof MobileDispatchStage];
export declare const MobileVisitFailureReason: {
    readonly NO_ANSWER: "NO_ANSWER";
    readonly ADDRESS_NOT_FOUND: "ADDRESS_NOT_FOUND";
    readonly ACCESS_DENIED: "ACCESS_DENIED";
    readonly PET_UNAVAILABLE: "PET_UNAVAILABLE";
    readonly OWNER_CANCELLED: "OWNER_CANCELLED";
    readonly VEHICLE_ISSUE: "VEHICLE_ISSUE";
    readonly WEATHER: "WEATHER";
    readonly OTHER: "OTHER";
};
export type MobileVisitFailureReason = (typeof MobileVisitFailureReason)[keyof typeof MobileVisitFailureReason];
export declare const PreferredWindow: {
    readonly MORNING: "MORNING";
    readonly AFTERNOON: "AFTERNOON";
    readonly EVENING: "EVENING";
    readonly ANY: "ANY";
};
export type PreferredWindow = (typeof PreferredWindow)[keyof typeof PreferredWindow];
export declare const MobileBookingRequestStatus: {
    readonly NEW: "NEW";
    readonly CONTACTED: "CONTACTED";
    readonly SCHEDULED: "SCHEDULED";
    readonly REJECTED: "REJECTED";
    readonly SPAM: "SPAM";
};
export type MobileBookingRequestStatus = (typeof MobileBookingRequestStatus)[keyof typeof MobileBookingRequestStatus];
export declare const ServiceZoneShape: {
    readonly CIRCLE: "CIRCLE";
    readonly POLYGON: "POLYGON";
};
export type ServiceZoneShape = (typeof ServiceZoneShape)[keyof typeof ServiceZoneShape];
export declare const PatientPolicyStatus: {
    readonly ACTIVE: "ACTIVE";
    readonly EXPIRED: "EXPIRED";
    readonly SUSPENDED: "SUSPENDED";
    readonly CANCELLED: "CANCELLED";
};
export type PatientPolicyStatus = (typeof PatientPolicyStatus)[keyof typeof PatientPolicyStatus];
export declare const InsuranceClaimStatus: {
    readonly DRAFT: "DRAFT";
    readonly SUBMITTED: "SUBMITTED";
    readonly APPROVED: "APPROVED";
    readonly PARTIALLY_APPROVED: "PARTIALLY_APPROVED";
    readonly REJECTED: "REJECTED";
    readonly SETTLED: "SETTLED";
    readonly CANCELLED: "CANCELLED";
};
export type InsuranceClaimStatus = (typeof InsuranceClaimStatus)[keyof typeof InsuranceClaimStatus];
export declare const ClaimRejectionResolution: {
    readonly REBILL_OWNER: "REBILL_OWNER";
    readonly WRITE_OFF: "WRITE_OFF";
};
export type ClaimRejectionResolution = (typeof ClaimRejectionResolution)[keyof typeof ClaimRejectionResolution];
export declare const GroomingLane: {
    readonly COSMETIC: "COSMETIC";
    readonly MEDICAL: "MEDICAL";
};
export type GroomingLane = (typeof GroomingLane)[keyof typeof GroomingLane];
export declare const GroomingServiceKind: {
    readonly BATH: "BATH";
    readonly FULL_GROOM: "FULL_GROOM";
    readonly TIDY_UP: "TIDY_UP";
    readonly DESHED: "DESHED";
    readonly NAIL_TRIM: "NAIL_TRIM";
    readonly EAR_CLEAN: "EAR_CLEAN";
    readonly ANAL_GLANDS: "ANAL_GLANDS";
    readonly TEETH_BRUSH: "TEETH_BRUSH";
    readonly DEMATTING: "DEMATTING";
    readonly SHAVE_DOWN: "SHAVE_DOWN";
    readonly MEDICATED_BATH: "MEDICATED_BATH";
    readonly PARASITE_DIP: "PARASITE_DIP";
    readonly WOUND_CARE_CLIP: "WOUND_CARE_CLIP";
    readonly SPA_ADDON: "SPA_ADDON";
    readonly OTHER: "OTHER";
};
export type GroomingServiceKind = (typeof GroomingServiceKind)[keyof typeof GroomingServiceKind];
export declare const GroomingSizeBand: {
    readonly TOY: "TOY";
    readonly SMALL: "SMALL";
    readonly MEDIUM: "MEDIUM";
    readonly LARGE: "LARGE";
    readonly GIANT: "GIANT";
};
export type GroomingSizeBand = (typeof GroomingSizeBand)[keyof typeof GroomingSizeBand];
export declare const GroomingModifierCode: {
    readonly MATTING: "MATTING";
    readonly SHAVE_DOWN: "SHAVE_DOWN";
    readonly BEHAVIOR: "BEHAVIOR";
    readonly SENIOR: "SENIOR";
    readonly FLEA: "FLEA";
    readonly SECOND_PET: "SECOND_PET";
    readonly EXPRESS: "EXPRESS";
    readonly OUT_OF_HOURS: "OUT_OF_HOURS";
};
export type GroomingModifierCode = (typeof GroomingModifierCode)[keyof typeof GroomingModifierCode];
export declare const GroomingModifierCalc: {
    readonly PERCENT: "PERCENT";
    readonly FIXED: "FIXED";
    readonly PER_MINUTE: "PER_MINUTE";
};
export type GroomingModifierCalc = (typeof GroomingModifierCalc)[keyof typeof GroomingModifierCalc];
export declare const GroomingStatus: {
    readonly SCHEDULED: "SCHEDULED";
    readonly CHECK_IN: "CHECK_IN";
    readonly INTAKE: "INTAKE";
    readonly IN_PROGRESS: "IN_PROGRESS";
    readonly FINISHING: "FINISHING";
    readonly READY: "READY";
    readonly PICKED_UP: "PICKED_UP";
    readonly COMPLETED: "COMPLETED";
    readonly CANCELLED: "CANCELLED";
    readonly NO_SHOW: "NO_SHOW";
    readonly ESCALATED: "ESCALATED";
};
export type GroomingStatus = (typeof GroomingStatus)[keyof typeof GroomingStatus];
export declare const GroomingStage: {
    readonly QUOTE_APPROVAL: "QUOTE_APPROVAL";
    readonly BATH: "BATH";
    readonly DRYING: "DRYING";
    readonly CLIP: "CLIP";
    readonly SCISSOR: "SCISSOR";
    readonly NAILS_EARS: "NAILS_EARS";
    readonly FINISH_CHECK: "FINISH_CHECK";
    readonly PHOTOS: "PHOTOS";
};
export type GroomingStage = (typeof GroomingStage)[keyof typeof GroomingStage];
export declare const GroomingDryingMethod: {
    readonly HAND_ROOM_TEMP: "HAND_ROOM_TEMP";
    readonly FAN_ONLY: "FAN_ONLY";
    readonly CAGE_UNHEATED: "CAGE_UNHEATED";
    readonly FORCED_AIR: "FORCED_AIR";
    readonly CAGE_HEATED: "CAGE_HEATED";
};
export type GroomingDryingMethod = (typeof GroomingDryingMethod)[keyof typeof GroomingDryingMethod];
export declare const MattingGrade: {
    readonly NONE: "NONE";
    readonly LIGHT: "LIGHT";
    readonly MODERATE: "MODERATE";
    readonly SEVERE: "SEVERE";
    readonly PELTED: "PELTED";
};
export type MattingGrade = (typeof MattingGrade)[keyof typeof MattingGrade];
export declare const GroomingBehaviorScore: {
    readonly GREEN: "GREEN";
    readonly YELLOW: "YELLOW";
    readonly RED: "RED";
};
export type GroomingBehaviorScore = (typeof GroomingBehaviorScore)[keyof typeof GroomingBehaviorScore];
export declare const ParasiteFinding: {
    readonly NONE: "NONE";
    readonly FLEAS: "FLEAS";
    readonly TICKS: "TICKS";
    readonly LICE: "LICE";
    readonly MITES_SUSPECTED: "MITES_SUSPECTED";
    readonly MULTIPLE: "MULTIPLE";
};
export type ParasiteFinding = (typeof ParasiteFinding)[keyof typeof ParasiteFinding];
export declare const NutritionPlanStatus: {
    readonly DRAFT: "DRAFT";
    readonly ACTIVE: "ACTIVE";
    readonly COMPLETED: "COMPLETED";
    readonly DISCONTINUED: "DISCONTINUED";
};
export type NutritionPlanStatus = (typeof NutritionPlanStatus)[keyof typeof NutritionPlanStatus];
export declare const NutritionGoal: {
    readonly MAINTENANCE: "MAINTENANCE";
    readonly WEIGHT_LOSS: "WEIGHT_LOSS";
    readonly WEIGHT_GAIN: "WEIGHT_GAIN";
    readonly GROWTH: "GROWTH";
    readonly GESTATION: "GESTATION";
    readonly LACTATION: "LACTATION";
    readonly RECOVERY: "RECOVERY";
};
export type NutritionGoal = (typeof NutritionGoal)[keyof typeof NutritionGoal];
export declare const NutritionLifeStage: {
    readonly GROWTH_UNDER_4M: "GROWTH_UNDER_4M";
    readonly GROWTH_OVER_4M: "GROWTH_OVER_4M";
    readonly ADULT: "ADULT";
    readonly SENIOR: "SENIOR";
};
export type NutritionLifeStage = (typeof NutritionLifeStage)[keyof typeof NutritionLifeStage];
export declare const NutritionActivity: {
    readonly INACTIVE: "INACTIVE";
    readonly LOW: "LOW";
    readonly MODERATE: "MODERATE";
    readonly HIGH: "HIGH";
    readonly WORK_LIGHT: "WORK_LIGHT";
    readonly WORK_MODERATE: "WORK_MODERATE";
    readonly WORK_HEAVY: "WORK_HEAVY";
};
export type NutritionActivity = (typeof NutritionActivity)[keyof typeof NutritionActivity];
export declare const MuscleConditionScore: {
    readonly NORMAL: "NORMAL";
    readonly MILD_LOSS: "MILD_LOSS";
    readonly MODERATE_LOSS: "MODERATE_LOSS";
    readonly SEVERE_LOSS: "SEVERE_LOSS";
};
export type MuscleConditionScore = (typeof MuscleConditionScore)[keyof typeof MuscleConditionScore];
export declare const FeedingMethod: {
    readonly MEAL_FED: "MEAL_FED";
    readonly FREE_CHOICE: "FREE_CHOICE";
    readonly COMBINATION: "COMBINATION";
};
export type FeedingMethod = (typeof FeedingMethod)[keyof typeof FeedingMethod];
export declare const DietFoodForm: {
    readonly DRY: "DRY";
    readonly WET: "WET";
    readonly RAW: "RAW";
    readonly HOME_COOKED: "HOME_COOKED";
    readonly TREAT: "TREAT";
    readonly SUPPLEMENT: "SUPPLEMENT";
};
export type DietFoodForm = (typeof DietFoodForm)[keyof typeof DietFoodForm];
export declare const DietFoodKind: {
    readonly MAINTENANCE: "MAINTENANCE";
    readonly THERAPEUTIC: "THERAPEUTIC";
    readonly TREAT: "TREAT";
    readonly SUPPLEMENT: "SUPPLEMENT";
};
export type DietFoodKind = (typeof DietFoodKind)[keyof typeof DietFoodKind];
export declare const DietMeasureUnit: {
    readonly GRAM: "GRAM";
    readonly CUP: "CUP";
    readonly CAN: "CAN";
    readonly SCOOP: "SCOOP";
    readonly PIECE: "PIECE";
};
export type DietMeasureUnit = (typeof DietMeasureUnit)[keyof typeof DietMeasureUnit];
export declare const NutritionRecheckOutcome: {
    readonly ON_TRACK: "ON_TRACK";
    readonly TOO_FAST: "TOO_FAST";
    readonly TOO_SLOW: "TOO_SLOW";
    readonly STALLED: "STALLED";
    readonly REVERSED: "REVERSED";
    readonly GOAL_REACHED: "GOAL_REACHED";
};
export type NutritionRecheckOutcome = (typeof NutritionRecheckOutcome)[keyof typeof NutritionRecheckOutcome];
export declare const GroomingAdjustmentSource: {
    readonly AUTO_INTAKE: "AUTO_INTAKE";
    readonly MANUAL: "MANUAL";
    readonly PACKAGE: "PACKAGE";
    readonly OVERRIDE: "OVERRIDE";
};
export type GroomingAdjustmentSource = (typeof GroomingAdjustmentSource)[keyof typeof GroomingAdjustmentSource];
export declare const GroomingCancelKind: {
    readonly OWNER_CANCELLED: "OWNER_CANCELLED";
    readonly CLINIC_CANCELLED: "CLINIC_CANCELLED";
    readonly NO_SHOW: "NO_SHOW";
    readonly HEALTH_REFUSAL: "HEALTH_REFUSAL";
    readonly BEHAVIOR_REFUSAL: "BEHAVIOR_REFUSAL";
};
export type GroomingCancelKind = (typeof GroomingCancelKind)[keyof typeof GroomingCancelKind];
export declare const GroomingPhotoKind: {
    readonly BEFORE: "BEFORE";
    readonly AFTER: "AFTER";
    readonly CONDITION: "CONDITION";
    readonly INCIDENT: "INCIDENT";
};
export type GroomingPhotoKind = (typeof GroomingPhotoKind)[keyof typeof GroomingPhotoKind];
export declare const GroomingIncidentKind: {
    readonly CLIPPER_BURN: "CLIPPER_BURN";
    readonly NICK_CUT: "NICK_CUT";
    readonly QUICKED_NAIL: "QUICKED_NAIL";
    readonly HEAT_STRESS: "HEAT_STRESS";
    readonly MEDICAL_EVENT: "MEDICAL_EVENT";
    readonly ESCAPE: "ESCAPE";
    readonly BITE_TO_STAFF: "BITE_TO_STAFF";
    readonly EQUIPMENT_FAILURE: "EQUIPMENT_FAILURE";
    readonly OTHER: "OTHER";
};
export type GroomingIncidentKind = (typeof GroomingIncidentKind)[keyof typeof GroomingIncidentKind];
export declare const GroomingIncidentSeverity: {
    readonly MINOR: "MINOR";
    readonly MODERATE: "MODERATE";
    readonly MAJOR: "MAJOR";
};
export type GroomingIncidentSeverity = (typeof GroomingIncidentSeverity)[keyof typeof GroomingIncidentSeverity];
export declare const GroomingFindingCategory: {
    readonly SKIN: "SKIN";
    readonly EARS: "EARS";
    readonly EYES: "EYES";
    readonly NAILS: "NAILS";
    readonly DENTAL: "DENTAL";
    readonly LUMP: "LUMP";
    readonly PARASITE: "PARASITE";
    readonly WEIGHT: "WEIGHT";
    readonly PAIN: "PAIN";
    readonly BEHAVIOR: "BEHAVIOR";
    readonly OTHER: "OTHER";
};
export type GroomingFindingCategory = (typeof GroomingFindingCategory)[keyof typeof GroomingFindingCategory];
export declare const GroomingFindingSeverity: {
    readonly INFO: "INFO";
    readonly ATTENTION: "ATTENTION";
    readonly URGENT: "URGENT";
};
export type GroomingFindingSeverity = (typeof GroomingFindingSeverity)[keyof typeof GroomingFindingSeverity];
export declare const GroomingMoodScore: {
    readonly CALM: "CALM";
    readonly HAPPY: "HAPPY";
    readonly ANXIOUS: "ANXIOUS";
    readonly STRESSED: "STRESSED";
    readonly AGGRESSIVE: "AGGRESSIVE";
};
export type GroomingMoodScore = (typeof GroomingMoodScore)[keyof typeof GroomingMoodScore];
export declare const ReportCardChannel: {
    readonly WHATSAPP: "WHATSAPP";
    readonly EMAIL: "EMAIL";
    readonly SMS: "SMS";
    readonly IN_APP: "IN_APP";
    readonly PRINTED: "PRINTED";
};
export type ReportCardChannel = (typeof ReportCardChannel)[keyof typeof ReportCardChannel];
export declare const CoatCondition: {
    readonly HEALTHY: "HEALTHY";
    readonly DRY: "DRY";
    readonly GREASY: "GREASY";
    readonly DANDRUFF: "DANDRUFF";
    readonly SHEDDING_HEAVY: "SHEDDING_HEAVY";
    readonly DAMAGED: "DAMAGED";
};
export type CoatCondition = (typeof CoatCondition)[keyof typeof CoatCondition];
export declare const EarCondition: {
    readonly NORMAL: "NORMAL";
    readonly WAXY: "WAXY";
    readonly REDNESS: "REDNESS";
    readonly ODOR: "ODOR";
    readonly DISCHARGE: "DISCHARGE";
    readonly PAINFUL: "PAINFUL";
};
export type EarCondition = (typeof EarCondition)[keyof typeof EarCondition];
export declare const NailCondition: {
    readonly NORMAL: "NORMAL";
    readonly OVERGROWN: "OVERGROWN";
    readonly SPLIT: "SPLIT";
    readonly INGROWN: "INGROWN";
    readonly MISSING: "MISSING";
};
export type NailCondition = (typeof NailCondition)[keyof typeof NailCondition];
export declare const GroomingActivityType: {
    readonly CREATED: "CREATED";
    readonly STATUS_CHANGED: "STATUS_CHANGED";
    readonly STAGE_CHANGED: "STAGE_CHANGED";
    readonly GATE_OVERRIDDEN: "GATE_OVERRIDDEN";
    readonly QUOTE_RECALCULATED: "QUOTE_RECALCULATED";
    readonly QUOTE_APPROVED: "QUOTE_APPROVED";
    readonly LANE_ESCALATED: "LANE_ESCALATED";
    readonly INTAKE_RECORDED: "INTAKE_RECORDED";
    readonly ITEM_CHANGED: "ITEM_CHANGED";
    readonly PRODUCT_ISSUED: "PRODUCT_ISSUED";
    readonly PHOTO_ADDED: "PHOTO_ADDED";
    readonly FINDING_ADDED: "FINDING_ADDED";
    readonly FINDING_ESCALATED: "FINDING_ESCALATED";
    readonly INCIDENT_REPORTED: "INCIDENT_REPORTED";
    readonly INCIDENT_RESOLVED: "INCIDENT_RESOLVED";
    readonly REPORT_CARD_SENT: "REPORT_CARD_SENT";
    readonly INVOICE_ISSUED: "INVOICE_ISSUED";
    readonly INVOICE_PAID: "INVOICE_PAID";
    readonly COMMENT: "COMMENT";
};
export type GroomingActivityType = (typeof GroomingActivityType)[keyof typeof GroomingActivityType];
export declare const AdPlatform: {
    readonly FACEBOOK: "FACEBOOK";
    readonly INSTAGRAM: "INSTAGRAM";
    readonly LINKEDIN: "LINKEDIN";
    readonly TIKTOK: "TIKTOK";
    readonly X: "X";
    readonly PINTEREST: "PINTEREST";
    readonly SNAPCHAT: "SNAPCHAT";
};
export type AdPlatform = (typeof AdPlatform)[keyof typeof AdPlatform];
export declare const AdCampaignStatus: {
    readonly DRAFT: "DRAFT";
    readonly PENDING: "PENDING";
    readonly SCHEDULED: "SCHEDULED";
    readonly ACTIVE: "ACTIVE";
    readonly PAUSED: "PAUSED";
    readonly COMPLETED: "COMPLETED";
    readonly FAILED: "FAILED";
};
export type AdCampaignStatus = (typeof AdCampaignStatus)[keyof typeof AdCampaignStatus];
export declare const AdObjective: {
    readonly BRAND_AWARENESS: "BRAND_AWARENESS";
    readonly LEAD_GENERATION: "LEAD_GENERATION";
    readonly STORE_VISITS: "STORE_VISITS";
    readonly CUSTOMER_FEEDBACK: "CUSTOMER_FEEDBACK";
    readonly SALES: "SALES";
    readonly PRODUCT_AWARENESS: "PRODUCT_AWARENESS";
};
export type AdObjective = (typeof AdObjective)[keyof typeof AdObjective];
export declare const AdCreativeSource: {
    readonly AI_GENERATED: "AI_GENERATED";
    readonly LIBRARY: "LIBRARY";
    readonly UPLOAD: "UPLOAD";
    readonly TEMPLATE: "TEMPLATE";
};
export type AdCreativeSource = (typeof AdCreativeSource)[keyof typeof AdCreativeSource];
export declare const AdBudgetKind: {
    readonly DAILY: "DAILY";
    readonly LIFETIME: "LIFETIME";
};
export type AdBudgetKind = (typeof AdBudgetKind)[keyof typeof AdBudgetKind];
export declare const AdTemplateCategory: {
    readonly SEO: "SEO";
    readonly PAID_ADS: "PAID_ADS";
    readonly SALES: "SALES";
    readonly SOCIAL: "SOCIAL";
    readonly EMAIL: "EMAIL";
};
export type AdTemplateCategory = (typeof AdTemplateCategory)[keyof typeof AdTemplateCategory];
export declare const MembershipPlanStatus: {
    readonly ACTIVE: "ACTIVE";
    readonly INACTIVE: "INACTIVE";
};
export type MembershipPlanStatus = (typeof MembershipPlanStatus)[keyof typeof MembershipPlanStatus];
export declare const MembershipStatus: {
    readonly PENDING_PAYMENT: "PENDING_PAYMENT";
    readonly ACTIVE: "ACTIVE";
    readonly PAST_DUE: "PAST_DUE";
    readonly LAPSED: "LAPSED";
    readonly CANCELLED: "CANCELLED";
    readonly EXPIRED: "EXPIRED";
};
export type MembershipStatus = (typeof MembershipStatus)[keyof typeof MembershipStatus];
export declare const MembershipBenefitType: {
    readonly SERVICE_DISCOUNT: "SERVICE_DISCOUNT";
    readonly PRODUCT_DISCOUNT: "PRODUCT_DISCOUNT";
    readonly INCLUDED_UNITS: "INCLUDED_UNITS";
    readonly PRIORITY_BOOKING: "PRIORITY_BOOKING";
    readonly PERK: "PERK";
};
export type MembershipBenefitType = (typeof MembershipBenefitType)[keyof typeof MembershipBenefitType];
export declare const CrmLeadStatusKind: {
    readonly OPEN: "OPEN";
    readonly CONVERTED: "CONVERTED";
    readonly LOST: "LOST";
};
export type CrmLeadStatusKind = (typeof CrmLeadStatusKind)[keyof typeof CrmLeadStatusKind];
export declare const CrmDealStatusKind: {
    readonly OPEN: "OPEN";
    readonly WON: "WON";
    readonly LOST: "LOST";
};
export type CrmDealStatusKind = (typeof CrmDealStatusKind)[keyof typeof CrmDealStatusKind];
export declare const CrmWhatsappProvider: {
    readonly MANUAL: "MANUAL";
    readonly GREEN_API: "GREEN_API";
};
export type CrmWhatsappProvider = (typeof CrmWhatsappProvider)[keyof typeof CrmWhatsappProvider];
export declare const CrmReferenceType: {
    readonly LEAD: "LEAD";
    readonly DEAL: "DEAL";
};
export type CrmReferenceType = (typeof CrmReferenceType)[keyof typeof CrmReferenceType];
export declare const CrmTaskPriority: {
    readonly LOW: "LOW";
    readonly MEDIUM: "MEDIUM";
    readonly HIGH: "HIGH";
};
export type CrmTaskPriority = (typeof CrmTaskPriority)[keyof typeof CrmTaskPriority];
export declare const CrmTaskStatus: {
    readonly BACKLOG: "BACKLOG";
    readonly TODO: "TODO";
    readonly IN_PROGRESS: "IN_PROGRESS";
    readonly DONE: "DONE";
    readonly CANCELLED: "CANCELLED";
};
export type CrmTaskStatus = (typeof CrmTaskStatus)[keyof typeof CrmTaskStatus];
export declare const CrmSlaStatus: {
    readonly DUE: "DUE";
    readonly FULFILLED: "FULFILLED";
    readonly FAILED: "FAILED";
};
export type CrmSlaStatus = (typeof CrmSlaStatus)[keyof typeof CrmSlaStatus];
export declare const CrmSlaAppliesTo: {
    readonly LEAD: "LEAD";
    readonly DEAL: "DEAL";
    readonly BOTH: "BOTH";
};
export type CrmSlaAppliesTo = (typeof CrmSlaAppliesTo)[keyof typeof CrmSlaAppliesTo];
export declare const CrmViewLayout: {
    readonly LIST: "LIST";
    readonly KANBAN: "KANBAN";
};
export type CrmViewLayout = (typeof CrmViewLayout)[keyof typeof CrmViewLayout];
export declare const CrmDealProductItemType: {
    readonly SERVICE: "SERVICE";
    readonly MEMBERSHIP_PLAN: "MEMBERSHIP_PLAN";
    readonly FREE_TEXT: "FREE_TEXT";
};
export type CrmDealProductItemType = (typeof CrmDealProductItemType)[keyof typeof CrmDealProductItemType];
export declare const CrmEmailStatus: {
    readonly SENT: "SENT";
    readonly FAILED: "FAILED";
};
export type CrmEmailStatus = (typeof CrmEmailStatus)[keyof typeof CrmEmailStatus];
export declare const CrmWhatsappStatus: {
    readonly SENT: "SENT";
    readonly DELIVERED: "DELIVERED";
    readonly READ: "READ";
    readonly FAILED: "FAILED";
};
export type CrmWhatsappStatus = (typeof CrmWhatsappStatus)[keyof typeof CrmWhatsappStatus];
export declare const CrmWhatsappDirection: {
    readonly OUTBOUND: "OUTBOUND";
    readonly INBOUND: "INBOUND";
};
export type CrmWhatsappDirection = (typeof CrmWhatsappDirection)[keyof typeof CrmWhatsappDirection];
export declare const PrescriptionStatus: {
    readonly DRAFT: "DRAFT";
    readonly ACTIVE: "ACTIVE";
    readonly COMPLETED: "COMPLETED";
    readonly CANCELLED: "CANCELLED";
};
export type PrescriptionStatus = (typeof PrescriptionStatus)[keyof typeof PrescriptionStatus];
export declare const DoseSource: {
    readonly CALCULATED: "CALCULATED";
    readonly MANUAL: "MANUAL";
    readonly OVERRIDE: "OVERRIDE";
};
export type DoseSource = (typeof DoseSource)[keyof typeof DoseSource];
export declare const ControlledSource: {
    readonly CLINIC: "CLINIC";
    readonly SCHEDULE_PACK: "SCHEDULE_PACK";
};
export type ControlledSource = (typeof ControlledSource)[keyof typeof ControlledSource];
export declare const ControlledMovementType: {
    readonly RECEIPT: "RECEIPT";
    readonly DISPENSE: "DISPENSE";
    readonly WASTE: "WASTE";
    readonly ADJUSTMENT: "ADJUSTMENT";
    readonly TRANSFER: "TRANSFER";
};
export type ControlledMovementType = (typeof ControlledMovementType)[keyof typeof ControlledMovementType];
export declare const InpatientStayKind: {
    readonly MEDICAL: "MEDICAL";
    readonly SURGICAL: "SURGICAL";
    readonly ICU: "ICU";
    readonly ISOLATION: "ISOLATION";
    readonly BOARDING: "BOARDING";
};
export type InpatientStayKind = (typeof InpatientStayKind)[keyof typeof InpatientStayKind];
export declare const InpatientStayStatus: {
    readonly REQUESTED: "REQUESTED";
    readonly ADMITTED: "ADMITTED";
    readonly IN_CARE: "IN_CARE";
    readonly DISCHARGE_PENDING: "DISCHARGE_PENDING";
    readonly DISCHARGED: "DISCHARGED";
    readonly CANCELLED: "CANCELLED";
};
export type InpatientStayStatus = (typeof InpatientStayStatus)[keyof typeof InpatientStayStatus];
export declare const InpatientAcuity: {
    readonly LOW: "LOW";
    readonly MEDIUM: "MEDIUM";
    readonly HIGH: "HIGH";
    readonly CRITICAL: "CRITICAL";
};
export type InpatientAcuity = (typeof InpatientAcuity)[keyof typeof InpatientAcuity];
export declare const DischargeKind: {
    readonly ROUTINE: "ROUTINE";
    readonly AGAINST_MEDICAL_ADVICE: "AGAINST_MEDICAL_ADVICE";
    readonly TRANSFERRED: "TRANSFERRED";
    readonly DIED: "DIED";
    readonly EUTHANIZED: "EUTHANIZED";
};
export type DischargeKind = (typeof DischargeKind)[keyof typeof DischargeKind];
export declare const InpatientOrderKind: {
    readonly MEDICATION: "MEDICATION";
    readonly FLUID: "FLUID";
    readonly MONITORING: "MONITORING";
    readonly FEEDING: "FEEDING";
    readonly ACTIVITY: "ACTIVITY";
    readonly WOUND_CARE: "WOUND_CARE";
    readonly LAB: "LAB";
    readonly IMAGING: "IMAGING";
    readonly OTHER: "OTHER";
};
export type InpatientOrderKind = (typeof InpatientOrderKind)[keyof typeof InpatientOrderKind];
export declare const InpatientOrderStatus: {
    readonly ACTIVE: "ACTIVE";
    readonly PAUSED: "PAUSED";
    readonly COMPLETED: "COMPLETED";
    readonly DISCONTINUED: "DISCONTINUED";
};
export type InpatientOrderStatus = (typeof InpatientOrderStatus)[keyof typeof InpatientOrderStatus];
export declare const InpatientAdministrationStatus: {
    readonly PENDING: "PENDING";
    readonly GIVEN: "GIVEN";
    readonly SKIPPED: "SKIPPED";
    readonly HELD: "HELD";
};
export type InpatientAdministrationStatus = (typeof InpatientAdministrationStatus)[keyof typeof InpatientAdministrationStatus];
export declare const InpatientActivityType: {
    readonly ADMITTED: "ADMITTED";
    readonly STATUS_CHANGED: "STATUS_CHANGED";
    readonly CAGE_ASSIGNED: "CAGE_ASSIGNED";
    readonly CAGE_MOVED: "CAGE_MOVED";
    readonly ACUITY_CHANGED: "ACUITY_CHANGED";
    readonly ATTENDING_CHANGED: "ATTENDING_CHANGED";
    readonly ORDER_CREATED: "ORDER_CREATED";
    readonly ORDER_DISCONTINUED: "ORDER_DISCONTINUED";
    readonly ADMINISTRATION: "ADMINISTRATION";
    readonly VITALS_RECORDED: "VITALS_RECORDED";
    readonly ALERT: "ALERT";
    readonly NOTE: "NOTE";
    readonly HANDOVER: "HANDOVER";
    readonly COMPLICATION: "COMPLICATION";
    readonly INVOICE_PAID: "INVOICE_PAID";
    readonly DISCHARGED: "DISCHARGED";
};
export type InpatientActivityType = (typeof InpatientActivityType)[keyof typeof InpatientActivityType];
export declare const CageSizeClass: {
    readonly SMALL: "SMALL";
    readonly MEDIUM: "MEDIUM";
    readonly LARGE: "LARGE";
    readonly WALK_IN: "WALK_IN";
};
export type CageSizeClass = (typeof CageSizeClass)[keyof typeof CageSizeClass];
export declare const TriageCategory: {
    readonly RED: "RED";
    readonly ORANGE: "ORANGE";
    readonly YELLOW: "YELLOW";
    readonly GREEN: "GREEN";
    readonly BLUE: "BLUE";
};
export type TriageCategory = (typeof TriageCategory)[keyof typeof TriageCategory];
export declare const ArrivalStatus: {
    readonly EN_ROUTE: "EN_ROUTE";
    readonly ARRIVED: "ARRIVED";
    readonly TRIAGED: "TRIAGED";
    readonly DISPOSED: "DISPOSED";
    readonly LEFT_WITHOUT_TRIAGE: "LEFT_WITHOUT_TRIAGE";
    readonly CANCELLED: "CANCELLED";
};
export type ArrivalStatus = (typeof ArrivalStatus)[keyof typeof ArrivalStatus];
export declare const ArrivalSource: {
    readonly WALK_IN: "WALK_IN";
    readonly PHONE: "PHONE";
    readonly PUBLIC_BOOKING: "PUBLIC_BOOKING";
    readonly PET_PORTAL: "PET_PORTAL";
    readonly AGENT: "AGENT";
    readonly REFERRAL: "REFERRAL";
    readonly MOBILE_REQUEST: "MOBILE_REQUEST";
    readonly SCHEDULED_VISIT: "SCHEDULED_VISIT";
};
export type ArrivalSource = (typeof ArrivalSource)[keyof typeof ArrivalSource];
export declare const DispositionKind: {
    readonly DISCHARGED: "DISCHARGED";
    readonly ADMITTED: "ADMITTED";
    readonly TO_SURGERY: "TO_SURGERY";
    readonly TRANSFERRED: "TRANSFERRED";
    readonly LEFT_AGAINST_ADVICE: "LEFT_AGAINST_ADVICE";
    readonly DIED: "DIED";
    readonly EUTHANIZED: "EUTHANIZED";
};
export type DispositionKind = (typeof DispositionKind)[keyof typeof DispositionKind];
export declare const EmergencyStability: {
    readonly STABLE: "STABLE";
    readonly UNSTABLE: "UNSTABLE";
    readonly CRITICAL: "CRITICAL";
};
export type EmergencyStability = (typeof EmergencyStability)[keyof typeof EmergencyStability];
export declare const PatientAlertKind: {
    readonly ALLERGY: "ALLERGY";
    readonly CHRONIC_CONDITION: "CHRONIC_CONDITION";
    readonly BITE_RISK: "BITE_RISK";
    readonly CODE_STATUS: "CODE_STATUS";
    readonly OTHER: "OTHER";
};
export type PatientAlertKind = (typeof PatientAlertKind)[keyof typeof PatientAlertKind];
export declare const AlertSeverity: {
    readonly MILD: "MILD";
    readonly MODERATE: "MODERATE";
    readonly SEVERE: "SEVERE";
};
export type AlertSeverity = (typeof AlertSeverity)[keyof typeof AlertSeverity];
export declare const ScheduledJobStatus: {
    readonly QUEUED: "QUEUED";
    readonly IN_PROGRESS: "IN_PROGRESS";
    readonly COMPLETED: "COMPLETED";
    readonly FAILED: "FAILED";
    readonly CANCELLED: "CANCELLED";
};
export type ScheduledJobStatus = (typeof ScheduledJobStatus)[keyof typeof ScheduledJobStatus];
export declare const NotificationChannel: {
    readonly INBOX: "INBOX";
    readonly EMAIL: "EMAIL";
    readonly WHATSAPP: "WHATSAPP";
    readonly SMS: "SMS";
    readonly PUSH: "PUSH";
};
export type NotificationChannel = (typeof NotificationChannel)[keyof typeof NotificationChannel];
export declare const OutboxStatus: {
    readonly QUEUED: "QUEUED";
    readonly SENDING: "SENDING";
    readonly SENT: "SENT";
    readonly FAILED: "FAILED";
    readonly SKIPPED: "SKIPPED";
    readonly CANCELLED: "CANCELLED";
    readonly AWAITING_MANUAL: "AWAITING_MANUAL";
};
export type OutboxStatus = (typeof OutboxStatus)[keyof typeof OutboxStatus];
export declare const OutboxRecipientKind: {
    readonly OWNER: "OWNER";
    readonly USER: "USER";
    readonly CLINIC: "CLINIC";
};
export type OutboxRecipientKind = (typeof OutboxRecipientKind)[keyof typeof OutboxRecipientKind];
export declare const ReminderTrigger: {
    readonly VACCINATION_DUE: "VACCINATION_DUE";
    readonly GROOMING_DUE: "GROOMING_DUE";
    readonly NUTRITION_RECHECK_DUE: "NUTRITION_RECHECK_DUE";
    readonly APPOINTMENT_UPCOMING: "APPOINTMENT_UPCOMING";
    readonly APPOINTMENT_NO_SHOW: "APPOINTMENT_NO_SHOW";
    readonly CARE_PLAN_VISIT_DUE: "CARE_PLAN_VISIT_DUE";
    readonly INVOICE_OVERDUE: "INVOICE_OVERDUE";
    readonly MEMBERSHIP_RENEWAL: "MEMBERSHIP_RENEWAL";
    readonly POST_OP_FOLLOW_UP: "POST_OP_FOLLOW_UP";
};
export type ReminderTrigger = (typeof ReminderTrigger)[keyof typeof ReminderTrigger];
export declare const RecallContactChannel: {
    readonly PHONE: "PHONE";
    readonly WHATSAPP: "WHATSAPP";
    readonly EMAIL: "EMAIL";
    readonly SMS: "SMS";
    readonly IN_PERSON: "IN_PERSON";
    readonly INBOX: "INBOX";
};
export type RecallContactChannel = (typeof RecallContactChannel)[keyof typeof RecallContactChannel];
export declare const RecallOutcome: {
    readonly BOOKED: "BOOKED";
    readonly NO_ANSWER: "NO_ANSWER";
    readonly CALLBACK_REQUESTED: "CALLBACK_REQUESTED";
    readonly DECLINED: "DECLINED";
    readonly WRONG_NUMBER: "WRONG_NUMBER";
    readonly SNOOZED: "SNOOZED";
    readonly INFORMED: "INFORMED";
};
export type RecallOutcome = (typeof RecallOutcome)[keyof typeof RecallOutcome];
export declare const LoyaltyRoundingMode: {
    readonly FLOOR: "FLOOR";
};
export type LoyaltyRoundingMode = (typeof LoyaltyRoundingMode)[keyof typeof LoyaltyRoundingMode];
export declare const LoyaltyLedgerKind: {
    readonly EARN: "EARN";
    readonly REDEEM: "REDEEM";
    readonly EXPIRY: "EXPIRY";
    readonly REVERSAL: "REVERSAL";
    readonly REDEMPTION_RESTORE: "REDEMPTION_RESTORE";
    readonly ADJUSTMENT: "ADJUSTMENT";
};
export type LoyaltyLedgerKind = (typeof LoyaltyLedgerKind)[keyof typeof LoyaltyLedgerKind];
export declare const LoyaltyLedgerSourceType: {
    readonly CLINIC_INVOICE: "CLINIC_INVOICE";
    readonly POS_SALE: "POS_SALE";
    readonly MANUAL: "MANUAL";
};
export type LoyaltyLedgerSourceType = (typeof LoyaltyLedgerSourceType)[keyof typeof LoyaltyLedgerSourceType];
export declare const RegistrationCampaignStatus: {
    readonly DRAFT: "DRAFT";
    readonly ACTIVE: "ACTIVE";
    readonly COMPLETED: "COMPLETED";
    readonly CLOSED: "CLOSED";
};
export type RegistrationCampaignStatus = (typeof RegistrationCampaignStatus)[keyof typeof RegistrationCampaignStatus];
export declare const RegistrationRequestStatus: {
    readonly QUEUE: "QUEUE";
    readonly SHORTLIST: "SHORTLIST";
    readonly INTERVIEW: "INTERVIEW";
    readonly ACCEPTED: "ACCEPTED";
    readonly AWAITING_PAYMENT: "AWAITING_PAYMENT";
    readonly REJECTED: "REJECTED";
    readonly DUPLICATE: "DUPLICATE";
    readonly IN_EVALUATION: "IN_EVALUATION";
    readonly WAITLIST: "WAITLIST";
    readonly EVALUATION: "EVALUATION";
    readonly REVIEW: "REVIEW";
    readonly AWAITING_REPLY: "AWAITING_REPLY";
};
export type RegistrationRequestStatus = (typeof RegistrationRequestStatus)[keyof typeof RegistrationRequestStatus];
export declare const RegistrationSource: {
    readonly WEBSITE: "WEBSITE";
    readonly DIRECT_LINK: "DIRECT_LINK";
    readonly REFERRAL: "REFERRAL";
    readonly SOCIAL: "SOCIAL";
    readonly OTHER: "OTHER";
};
export type RegistrationSource = (typeof RegistrationSource)[keyof typeof RegistrationSource];
export declare const RegistrationDocumentType: {
    readonly BIRTH_CERTIFICATE: "BIRTH_CERTIFICATE";
    readonly VACCINATION_CARD: "VACCINATION_CARD";
    readonly GUARDIAN_ID: "GUARDIAN_ID";
    readonly MEDICAL_REPORT: "MEDICAL_REPORT";
    readonly OTHER: "OTHER";
};
export type RegistrationDocumentType = (typeof RegistrationDocumentType)[keyof typeof RegistrationDocumentType];
