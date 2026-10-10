import type { ReportLabel } from "@/server/reports/reports.type";

/**
 * The report catalogue — the single source of truth for *which* reports exist.
 *
 * Reports are authored by developers, not by users: a report is a catalogue entry here plus
 * a builder in `builders/`. Nothing in the UI can create, rename or delete one, which is why
 * this file (not a database table) is the registry. It is imported by BOTH sides — the
 * server validates `:reportId` against it, the client renders the list and the widget grid
 * from it — so a report can never drift between the two.
 *
 * To add a report:
 *   1. add an entry below (ids are kebab-case and permanent — they are URLs),
 *   2. add a builder in `builders/<id>.builder.ts` returning a payload keyed by these widget
 *      keys,
 *   3. register the builder in `reports.dao.ts`.
 * `reports.catalog.test.ts` fails the build if the three ever disagree.
 */

/** Grid width of a widget inside the report page — two half widgets share a row. */
export type ReportWidgetSpan = "full" | "half";

export type ReportWidgetDef = {
	/** Matches the key the builder writes into `widgets`. */
	key: string;
	title: ReportLabel;
	span: ReportWidgetSpan;
};

export type ReportCategoryId = "operations" | "clinical" | "financial" | "inventory" | "hr";

export type ReportDef = {
	id: string;
	title: ReportLabel;
	description: ReportLabel;
	category: ReportCategoryId;
	/**
	 * Permission resource checked with `canView(resource)`. Reports that surface money or
	 * personnel data reuse the resource of the module they read from, so a role that cannot
	 * open the module cannot read it through a report either. `undefined` ⇒ no extra gate.
	 */
	gate?: string;
	/** ISO day this definition last changed — maintained by whoever edits the entry. */
	updatedAt: string;
	widgets: readonly ReportWidgetDef[];
};

export const REPORT_CATEGORIES: readonly { id: ReportCategoryId; label: ReportLabel }[] = [
	{ id: "operations", label: { ar: "التشغيل", en: "Operations" } },
	{ id: "clinical", label: { ar: "الطبي", en: "Clinical" } },
	{ id: "financial", label: { ar: "المالي", en: "Financial" } },
	{ id: "inventory", label: { ar: "المخزون", en: "Inventory" } },
	{ id: "hr", label: { ar: "الموارد البشرية", en: "People" } },
];

/**
 * `as const` here exists only to derive {@link ReportId} from the literal ids — it is
 * immediately re-exported through `ReportDef[]` below so consumers see the declared shape
 * (with its optional `gate`) rather than ten divergent literal object types.
 */
const CATALOG = [
	{
		id: "clinic-overview",
		title: { ar: "الأداء العام للأكاديمية", en: "Clinic Performance Overview" },
		description: {
			ar: "الزيارات والإيراد المحصّل وتوزيع الحالات وحمل الفروع في نطاق واحد.",
			en: "Visits, collected revenue, case mix and branch load in one window.",
		},
		category: "operations",
		updatedAt: "2026-08-12",
		widgets: [
			{ key: "visitsTrend", title: { ar: "حركة الزيارات", en: "Visit trend" }, span: "full" },
			{
				key: "revenueTrend",
				title: { ar: "الإيراد المحصّل", en: "Collected revenue" },
				span: "half",
			},
			{
				key: "appointmentStatus",
				title: { ar: "توزيع حالات الجلسات", en: "Appointment status mix" },
				span: "half",
			},
			{
				key: "branchLoad",
				title: { ar: "الزيارات حسب الفرع", en: "Visits by branch" },
				span: "half",
			},
			{
				key: "topServices",
				title: { ar: "أكثر الدورات طلبًا", en: "Most requested services" },
				span: "half",
			},
		],
	},
	{
		id: "appointments",
		title: { ar: "تقرير الجلسات", en: "Appointments Report" },
		description: {
			ar: "حجم الجلسات وحالاتها وساعات الذروة وأداء المدرّبين ونسبة عدم الحضور.",
			en: "Volume, statuses, peak hours, doctor performance and no-show rate.",
		},
		category: "operations",
		updatedAt: "2026-08-12",
		widgets: [
			{
				key: "volumeTrend",
				title: { ar: "حجم الجلسات", en: "Appointment volume" },
				span: "full",
			},
			{ key: "statusMix", title: { ar: "توزيع الحالات", en: "Status mix" }, span: "half" },
			{ key: "byHour", title: { ar: "ساعات الذروة", en: "Peak hours" }, span: "half" },
			{ key: "byDoctor", title: { ar: "الجلسات حسب المدرّب", en: "By doctor" }, span: "half" },
			{
				key: "byLocation",
				title: { ar: "نوع الزيارة", en: "Visit location" },
				span: "half",
			},
			{
				key: "doctorTable",
				title: { ar: "أداء المدرّبين", en: "Doctor performance" },
				span: "full",
			},
		],
	},
	{
		id: "emergency",
		title: { ar: "تقرير الطوارئ والفرز", en: "Emergency & Triage Report" },
		description: {
			ar: "حركة صالة الطوارئ: الوصول، زمن الباب إلى الفرز وإلى المدرّب، الالتزام بأهداف الانتظار، ومعدّل تغيير اللون المقترح.",
			en: "ER flow: arrivals, door-to-triage and door-to-doctor times, wait-target compliance, and the triage override rate.",
		},
		category: "operations",
		// من لا يرى الطوارئ في الوحدة لا يقرؤها عبر تقرير أيضًا
		gate: "emergency",
		updatedAt: "2026-09-03",
		widgets: [
			{
				key: "categoryMix",
				title: { ar: "توزيع ألوان الفرز", en: "Triage colour mix" },
				span: "half",
			},
			{ key: "bySource", title: { ar: "مصدر الوصول", en: "Arrival source" }, span: "half" },
			{
				key: "byHour",
				title: { ar: "الوصول حسب الساعة", en: "Arrivals by hour" },
				span: "full",
			},
			{
				key: "doorToDoctorByCategory",
				title: { ar: "من الباب إلى المدرّب حسب اللون", en: "Door-to-doctor by colour" },
				span: "half",
			},
			{ key: "dispositions", title: { ar: "مآل الحالات", en: "Dispositions" }, span: "half" },
		],
	},
	{
		id: "inpatients",
		title: { ar: "تقرير التنويم", en: "Inpatients Report" },
		description: {
			ar: "حركة العنبر: الإدخالات والخروج، متوسّط مدّة الإقامة، الالتزام بالجرعات، وإشغال الأقفاص.",
			en: "Ward flow: admissions and discharges, average length of stay, dose compliance and cage occupancy.",
		},
		category: "operations",
		// من لا يرى التنويم في الوحدة لا يقرؤه عبر تقرير أيضًا
		gate: "inpatients",
		updatedAt: "2026-09-01",
		widgets: [
			{
				key: "flowTrend",
				title: { ar: "الإدخالات والخروج", en: "Admissions & discharges" },
				span: "full",
			},
			{ key: "kindMix", title: { ar: "نوع التنويم", en: "Stay kind" }, span: "half" },
			{ key: "acuityMix", title: { ar: "درجة الحرجية", en: "Acuity" }, span: "half" },
			{ key: "speciesMix", title: { ar: "الأنواع", en: "Species" }, span: "half" },
			{ key: "outcomes", title: { ar: "طرق الخروج", en: "Discharge outcomes" }, span: "half" },
		],
	},
	{
		id: "revenue",
		title: { ar: "الإيرادات والتحصيل", en: "Revenue & Collection" },
		description: {
			ar: "المفوتر مقابل المحصّل، حالة الفواتير، طرق الدفع، ومصادر الإيراد.",
			en: "Invoiced vs collected, invoice status, payment methods and revenue sources.",
		},
		category: "financial",
		gate: "finance_invoices",
		updatedAt: "2026-08-12",
		widgets: [
			{
				key: "revenueTrend",
				title: { ar: "المفوتر مقابل المحصّل", en: "Invoiced vs collected" },
				span: "full",
			},
			{ key: "statusMix", title: { ar: "حالة الفواتير", en: "Invoice status" }, span: "half" },
			{ key: "paymentMix", title: { ar: "طرق الدفع", en: "Payment methods" }, span: "half" },
			{
				key: "bySource",
				title: { ar: "مصدر الفاتورة", en: "Invoice source" },
				span: "half",
			},
			{
				key: "posTrend",
				title: { ar: "مبيعات نقطة البيع", en: "Point-of-sale revenue" },
				span: "half",
			},
			{
				key: "topServices",
				title: { ar: "أعلى الدورات إيرادًا", en: "Top services by revenue" },
				span: "full",
			},
		],
	},
	{
		id: "patients",
		title: { ar: "الأطفال وأولياء الأمور", en: "Patients & Owners" },
		description: {
			ar: "نمو قاعدة الأطفال وتوزيعها حسب النوع والسلالة والجنس، وأنشط أولياء الأمور.",
			en: "Patient base growth by species, breed and sex, plus the most active owners.",
		},
		category: "clinical",
		gate: "patients_owners",
		updatedAt: "2026-08-12",
		widgets: [
			{
				key: "newPatientsTrend",
				title: { ar: "التسجيلات الجديدة", en: "New registrations" },
				span: "full",
			},
			{ key: "byAnimalType", title: { ar: "حسب النوع", en: "By species" }, span: "half" },
			{ key: "byGender", title: { ar: "حسب الجنس", en: "By sex" }, span: "half" },
			{ key: "topStrains", title: { ar: "أكثر السلالات", en: "Top breeds" }, span: "half" },
			{
				key: "visitsPerPatient",
				title: { ar: "كثافة الزيارات", en: "Visit density" },
				span: "half",
			},
			{
				key: "topOwners",
				title: { ar: "أنشط أولياء الأمور", en: "Most active owners" },
				span: "full",
			},
		],
	},
	{
		id: "inventory",
		title: { ar: "المخزون والاستهلاك", en: "Stock & Consumption" },
		description: {
			ar: "قيمة المخزون حسب الفئة، حركة الوارد والصادر، الأصناف تحت الحد وقرب الانتهاء.",
			en: "Stock value by category, in/out movement, below-reorder and expiring items.",
		},
		category: "inventory",
		gate: "inventory",
		updatedAt: "2026-08-12",
		widgets: [
			{
				key: "movementTrend",
				title: { ar: "حركة المخزون", en: "Stock movement" },
				span: "full",
			},
			{
				key: "valueByCategory",
				title: { ar: "القيمة حسب الفئة", en: "Value by category" },
				span: "half",
			},
			{ key: "stockValue", title: { ar: "قيمة المخزون", en: "Stock value" }, span: "half" },
			{
				key: "topConsumed",
				title: { ar: "الأكثر صرفًا", en: "Most consumed" },
				span: "half",
			},
			{
				key: "lowStock",
				title: { ar: "تحت نقطة الطلب", en: "Below reorder point" },
				span: "half",
			},
			{
				key: "expiring",
				title: { ar: "قرب انتهاء الصلاحية", en: "Expiring soon" },
				span: "full",
			},
		],
	},
	{
		id: "staff",
		title: { ar: "الحضور والانصراف", en: "Attendance & Workforce" },
		description: {
			ar: "نسبة الالتزام بالحضور، الغياب والتأخير، وساعات العمل لكل موظف.",
			en: "Attendance compliance, absence and lateness, and hours worked per employee.",
		},
		category: "hr",
		gate: "staff",
		updatedAt: "2026-08-12",
		widgets: [
			{
				key: "attendanceTrend",
				title: { ar: "نسبة الحضور والانصراف", en: "Attendance trend" },
				span: "full",
			},
			{ key: "statusMix", title: { ar: "توزيع الحضور", en: "Attendance mix" }, span: "half" },
			{
				key: "totalHours",
				title: { ar: "إحصائيات الدوام", en: "Working hours" },
				span: "half",
			},
			{
				key: "hoursByStaff",
				title: { ar: "ساعات العمل حسب الموظف", en: "Hours by employee" },
				span: "half",
			},
			{ key: "leaveMix", title: { ar: "طلبات الإجازة", en: "Leave requests" }, span: "half" },
			{
				key: "staffTable",
				title: { ar: "سجل الموظفين", en: "Employee register" },
				span: "full",
			},
		],
	},
	{
		id: "diagnostics",
		title: { ar: "التحاليل والأشعة", en: "Lab & Radiology" },
		description: {
			ar: "حجم الطلبات وحالات البنود وأنواع التصوير ومتوسط زمن إنجاز الفحص.",
			en: "Order volume, item statuses, imaging modalities and average turnaround time.",
		},
		category: "clinical",
		updatedAt: "2026-08-12",
		widgets: [
			{ key: "ordersTrend", title: { ar: "حجم الطلبات", en: "Order volume" }, span: "full" },
			{ key: "labStatus", title: { ar: "حالة التحاليل", en: "Lab status" }, span: "half" },
			{
				key: "radiologyStatus",
				title: { ar: "حالة الأشعة", en: "Radiology status" },
				span: "half",
			},
			{ key: "byModality", title: { ar: "أنواع التصوير", en: "Modalities" }, span: "half" },
			{ key: "turnaround", title: { ar: "زمن الإنجاز", en: "Turnaround time" }, span: "half" },
			{
				key: "topTests",
				title: { ar: "أكثر الفحوصات طلبًا", en: "Most requested tests" },
				span: "full",
			},
		],
	},
	{
		id: "vaccinations",
		title: { ar: "تغطية التطعيم", en: "Vaccination Coverage" },
		description: {
			ar: "الجرعات المُعطاة وتغطية كل مرض وتتبّع الدُفعات، مع قائمة المتأخّرين الآن.",
			en: "Doses given, per-disease coverage and lot traceability, with who is overdue now.",
		},
		category: "clinical",
		updatedAt: "2026-08-17",
		widgets: [
			{ key: "dosesTrend", title: { ar: "حجم الجرعات", en: "Dose volume" }, span: "full" },
			{
				key: "antigenCoverage",
				title: { ar: "التغطية لكل مرض", en: "Coverage by disease" },
				span: "half",
			},
			{ key: "speciesMix", title: { ar: "توزيع الأنواع", en: "Species mix" }, span: "half" },
			{
				key: "topVaccines",
				title: { ar: "أكثر اللقاحات استخدامًا", en: "Most used vaccines" },
				span: "half",
			},
			{
				key: "traceability",
				title: { ar: "تتبّع الدُفعات", en: "Lot traceability" },
				span: "half",
			},
			{
				key: "reactionMix",
				title: { ar: "التفاعلات العكسية", en: "Adverse reactions" },
				span: "half",
			},
			{
				key: "overdueList",
				title: { ar: "المتأخّرون والمستحقّون الآن", en: "Overdue and due now" },
				span: "full",
			},
		],
	},
	{
		id: "operations-surgical",
		title: { ar: "العمليات الجراحية", en: "Surgical Operations" },
		description: {
			ar: "الحالات ودرجاتها ودرجة الاستعجال ومعدل الإلغاء والمضاعفات المسجّلة.",
			en: "Cases by tier and urgency, cancellation rate and recorded complications.",
		},
		category: "clinical",
		updatedAt: "2026-08-12",
		widgets: [
			{ key: "casesTrend", title: { ar: "حجم الحالات", en: "Case volume" }, span: "full" },
			{ key: "statusMix", title: { ar: "حالة العمليات", en: "Case status" }, span: "half" },
			{ key: "tierMix", title: { ar: "درجة العملية", en: "Case tier" }, span: "half" },
			{ key: "urgencyMix", title: { ar: "درجة الاستعجال", en: "Urgency" }, span: "half" },
			{ key: "complications", title: { ar: "المضاعفات", en: "Complications" }, span: "half" },
			{
				key: "topProcedures",
				title: { ar: "أكثر الإجراءات", en: "Most performed procedures" },
				span: "full",
			},
		],
	},
	{
		id: "expenses",
		title: { ar: "المصروفات", en: "Expenses" },
		description: {
			ar: "المصروفات حسب الحالة والفئة والفرع والمصدر، وأعلى بنود الصرف.",
			en: "Spend by status, category, branch and source, plus the largest line items.",
		},
		category: "financial",
		gate: "finance_expenses",
		updatedAt: "2026-08-12",
		widgets: [
			{ key: "trend", title: { ar: "حركة المصروفات", en: "Expense trend" }, span: "full" },
			{ key: "statusMix", title: { ar: "حالة المصروفات", en: "Status mix" }, span: "half" },
			{ key: "bySource", title: { ar: "مصدر المصروف", en: "Expense source" }, span: "half" },
			{ key: "byCategory", title: { ar: "حسب الفئة", en: "By category" }, span: "half" },
			{ key: "byBranch", title: { ar: "حسب الفرع", en: "By branch" }, span: "half" },
			{
				key: "topExpenses",
				title: { ar: "أعلى المصروفات", en: "Largest expenses" },
				span: "full",
			},
		],
	},
	{
		id: "training",
		title: { ar: "التدريب والتأهيل", en: "Training & Development" },
		description: {
			ar: "تعيينات الدورات ونسب الإكمال وأداء المتدرّبين والشهادات الصادرة.",
			en: "Course assignments, completion rates, trainee performance and certificates.",
		},
		category: "hr",
		gate: "staff",
		updatedAt: "2026-08-12",
		widgets: [
			{
				key: "assignmentsTrend",
				title: { ar: "حركة التعيينات", en: "Assignment trend" },
				span: "full",
			},
			{
				key: "statusMix",
				title: { ar: "حالة التعيينات", en: "Assignment status" },
				span: "half",
			},
			{
				key: "completionRate",
				title: { ar: "نسبة الإكمال", en: "Completion rate" },
				span: "half",
			},
			{ key: "byCourseType", title: { ar: "نوع الدورة", en: "Course type" }, span: "half" },
			{ key: "topStaff", title: { ar: "أنشط المتدرّبين", en: "Top trainees" }, span: "half" },
			{ key: "byCourse", title: { ar: "الدورات", en: "Courses" }, span: "full" },
		],
	},
] as const satisfies readonly ReportDef[];

export type ReportId = (typeof CATALOG)[number]["id"];

export const REPORT_CATALOG: readonly ReportDef[] = CATALOG;

export const REPORT_IDS: ReportId[] = CATALOG.map((report) => report.id);

export const isReportId = (value: string): value is ReportId =>
	REPORT_IDS.includes(value as ReportId);

export const findReport = (id: string): ReportDef | undefined =>
	REPORT_CATALOG.find((report) => report.id === id);
