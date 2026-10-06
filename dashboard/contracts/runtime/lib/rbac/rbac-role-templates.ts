import { ALL_CATALOGUE_PERMISSIONS, findCataloguePermission } from "./rbac-catalogue";
import type { PermissionScope, RbacGroup } from "./rbac-registry";

/**
 * [RBAC P6] Ready-made roles, one or more per module.
 *
 * A blank role and 447 checkboxes is a correct system that nobody can actually use: the
 * person configuring a clinic knows "this is our receptionist", not "this role needs
 * appointments.check_in at BRANCH". Templates encode the job, and stay editable afterwards
 * — applying one writes ordinary grants, it does not create a special kind of role.
 *
 * ── The grant grammar ────────────────────────────────────────────────────────────────
 * `"patients.read"`        → granted at ALL
 * `"appointments.read@BRANCH"` → granted at BRANCH
 * `"attendance.read@OWN"`  → granted at OWN
 *
 * Every key and every scope is validated against the catalogue by
 * `rbac-role-templates.test.ts`. A typo cannot ship: it fails the suite rather than
 * silently producing a role that grants less than its name promises.
 *
 * Pure module — safe for the client bundle, like the rest of `src/lib/rbac`.
 */

export type RoleTemplate = {
	key: string;
	labelAr: string;
	labelEn: string;
	descriptionAr: string;
	/** which module this role belongs to, for grouping in the picker */
	group: RbacGroup;
	grants: readonly string[];
};

/**
 * What every employee gets regardless of job: their own inbox, their own attendance and
 * leave, the tasks assigned to them, and the SOPs they must acknowledge. All at `OWN`
 * scope — this baseline must never widen anyone's view of colleagues.
 */
const BASE: readonly string[] = [
	"dashboard.read",
	"inbox.read@OWN",
	"inbox.update@OWN",
	"notifications.read@OWN",
	"chat.read@OWN",
	"chat.create@OWN",
	"tasks.read@OWN",
	"tasks.update@OWN",
	"tasks.complete@OWN",
	"tasks.comment@OWN",
	"attendance.read@OWN",
	"leave_requests.read@OWN",
	"leave_requests.create@OWN",
	"leave_requests.cancel@OWN",
	"staff.read@OWN",
	"training.read@OWN",
	"quizzes.read@OWN",
	"sops.read",
	"sops.acknowledge",
];

const t = (
	key: string,
	labelAr: string,
	labelEn: string,
	descriptionAr: string,
	group: RbacGroup,
	grants: readonly string[],
): RoleTemplate => ({
	key,
	labelAr,
	labelEn,
	descriptionAr,
	group,
	grants: [...BASE, ...grants],
});

export const ROLE_TEMPLATES: readonly RoleTemplate[] = [
	// ── الرعاية الطبية ───────────────────────────────────────────────────────────────
	t(
		"veterinarian",
		"مدرّب",
		"Veterinarian",
		"يفحص ويشخّص ويطلب التحاليل والأشعة ويكتب الخطط العلاجية. يعتمد نتائج المختبر ولا يُدخلها.",
		"clinical",
		[
			"patients.read",
			"patients.update",
			"patients.view_medical_history",
			"owners.read",
			"owners.view_contact",
			"appointments.read@BRANCH",
			"appointments.update@BRANCH",
			"appointments.complete@BRANCH",
			"appointments.view_internal_notes@BRANCH",
			"vital_signs.read@BRANCH",
			"vital_signs.create@BRANCH",
			// [S2] السجل الطبي: المدرّب وحده يوثّق — التوثيق إقفالٌ قانوني لا حفظ
			"clinical_notes.read",
			"clinical_notes.create",
			"clinical_notes.update",
			"clinical_notes.finalize",
			"clinical_notes.amend",
			"vaccinations.read@BRANCH",
			"vaccinations.create@BRANCH",
			"vaccinations.administer@BRANCH",
			"vaccinations.issue_certificate@BRANCH",
			"lab_tests.read@BRANCH",
			"lab_tests.order@BRANCH",
			// المدرّب يعتمد النتيجة فتصير رسمية؛ إدخالها عمل الفنّي
			"lab_tests.verify_results@BRANCH",
			"radiology.read@BRANCH",
			"radiology.order@BRANCH",
			"radiology.report@BRANCH",
			"radiology.addendum@BRANCH",
			"operations.read@BRANCH",
			"operations.create@BRANCH",
			"operations.schedule@BRANCH",
			"operations.manage_team@BRANCH",
			"operations.complete@BRANCH",
			"care_plans.read",
			"care_plans.create",
			"care_plans.update",
			"care_plans.activate",
			"care_plans.close",
			"nutrition.read",
			"nutrition.create",
			"nutrition.update",
			"patient_consents.read",
			"patient_consents.create",
			"patient_consents.witness",
			"drug_catalog.read",
			"protocols.read",
			"video_calls.read@OWN",
			"video_calls.create@OWN",
			"video_calls.join@OWN",
			"video_calls.admit_guest@OWN",
			"documents.read@BRANCH",
		],
	),
	t(
		"vet_technician",
		"مساعد بيطري",
		"Veterinary Technician",
		"يجهّز الطفل ويأخذ العلامات الحيوية ويسحب العيّنات ويُدخل النتائج — بلا اعتماد ولا تشخيص.",
		"clinical",
		[
			"patients.read",
			"patients.view_medical_history",
			"owners.read",
			"appointments.read@BRANCH",
			"appointments.check_in@BRANCH",
			"vital_signs.read@BRANCH",
			"vital_signs.create@BRANCH",
			"vital_signs.update@BRANCH",
			// [S2] يكتب المسوّدة ولا يوثّقها — وهو وصف الدور أعلاه حرفيًّا
			"clinical_notes.read",
			"clinical_notes.create",
			"clinical_notes.update",
			"vaccinations.read@BRANCH",
			"vaccinations.administer@BRANCH",
			"lab_tests.read@BRANCH",
			"lab_tests.collect_sample@BRANCH",
			"lab_tests.enter_results@BRANCH",
			"radiology.read@BRANCH",
			"radiology.perform@BRANCH",
			"operations.read@BRANCH",
			"nutrition.read",
			"drug_catalog.read",
		],
	),
	t(
		"receptionist",
		"موظف استقبال",
		"Receptionist",
		"يستقبل المراجعين ويحجز الجلسات ويصدر الفواتير ويحصّل. لا يرى السجل الطبي.",
		"clinical",
		[
			// لاحظ: لا `patients.view_medical_history` — الاسم والهاتف يكفيان للاستقبال
			"patients.read",
			"patients.create",
			"patients.update",
			"owners.read",
			"owners.create",
			"owners.update",
			"owners.view_contact",
			"appointments.read",
			"appointments.create",
			"appointments.update",
			"appointments.reschedule",
			"appointments.cancel",
			"appointments.check_in",
			"appointments.send_reminders",
			// [RC0] الاستقبال هو من يعمل على طاولة الاستدعاء فعليًّا: يقرأ القائمة،
			// يتّصل، ويسجّل النتيجة. ولا يملك تحرير القواعد ولا تشغيل المُجدوِل —
			// «اتّصل بهذا وليّ الأمر» عملٌ يوميّ، و«غيّر نصّ ما يُرسَل لكل أولياء الأمور» ليس كذلك.
			"reminders.read",
			"reminders.send_reminders",
			"invoices.read",
			"invoices.create",
			"invoices.issue",
			"invoices.collect_payment",
			"pos_sales.read@OWN",
			"pos_sales.create@OWN",
			"pos_sales.open_shift@OWN",
			"pos_sales.close_shift@OWN",
			"public_bookings.read",
			"public_bookings.approve",
			"public_bookings.reject",
			"services.read",
			"consultation_types.read",
			"branches.read",
			"kiosk.read",
			"kiosk.run",
		],
	),
	t(
		"lab_technician",
		"فني مختبر",
		"Lab Technician",
		"ينفّذ طلبات التحاليل ويُدخل نتائجها. الاعتماد للمدرّب.",
		"clinical",
		[
			"lab_tests.read@BRANCH",
			"lab_tests.create@BRANCH",
			"lab_tests.update@BRANCH",
			"lab_tests.collect_sample@BRANCH",
			"lab_tests.enter_results@BRANCH",
			"lab_test_parameters.read",
			"patients.read",
			"patients.view_medical_history",
			"appointments.read@BRANCH",
		],
	),
	t(
		"radiology_technician",
		"فني أشعة",
		"Radiology Technician",
		"ينفّذ فحوص الأشعة ويرفع الصور. كتابة التقرير للمدرّب.",
		"clinical",
		[
			"radiology.read@BRANCH",
			"radiology.create@BRANCH",
			"radiology.update@BRANCH",
			"radiology.perform@BRANCH",
			"radiology_exams.read",
			"patients.read",
			"patients.view_medical_history",
			"appointments.read@BRANCH",
		],
	),
	t(
		"groomer",
		"مُجمِّل",
		"Groomer",
		"ينفّذ جلسات التجميل الخاصة به. لا يتجاوز بوابات الأمان.",
		"clinical",
		[
			// بلا `grooming.override_gate` عمدًا — التجاوز صلاحية المشرف
			"grooming.read@OWN",
			"grooming.create@OWN",
			"grooming.update@OWN",
			"grooming.check_in@OWN",
			"grooming.complete@OWN",
			"grooming_definitions.read",
			"patients.read",
			"owners.read",
			"appointments.read@BRANCH",
		],
	),
	t(
		"grooming_supervisor",
		"مشرف تجميل",
		"Grooming Supervisor",
		"يدير جلسات التجميل كلها ويملك تجاوز بوابات الأمان المسجَّل.",
		"clinical",
		[
			"grooming.read@BRANCH",
			"grooming.create@BRANCH",
			"grooming.update@BRANCH",
			"grooming.delete@BRANCH",
			"grooming.check_in@BRANCH",
			"grooming.complete@BRANCH",
			"grooming.override_gate@BRANCH",
			"grooming_definitions.read",
			"grooming_definitions.create",
			"grooming_definitions.update",
			"patients.read",
			"owners.read",
		],
	),
	t(
		"mobile_unit_driver",
		"سائق وحدة متنقلة",
		"Mobile Unit Driver",
		"يقود المركبة وينفّذ الزيارات المسندة إليه ويقفلها.",
		"clinical",
		[
			"mobile_clinics.read@BRANCH",
			"mobile_clinics.track@BRANCH",
			"mobile_clinics.close_visit@BRANCH",
			"patients.read",
			"owners.read",
			"owners.view_contact",
			"appointments.read@BRANCH",
		],
	),
	t(
		"mobile_coordinator",
		"منسّق الأكاديميات المتنقلة",
		"Mobile Clinics Coordinator",
		"يوزّع الزيارات على المركبات ويتابع الأسطول. إصدار رموز الأجهزة ليس من عمله.",
		"clinical",
		[
			// بلا `manage_devices` — إصدار رمز مركبة فعلٌ أمني يعادل تسليم مفتاح
			"mobile_clinics.read",
			"mobile_clinics.create",
			"mobile_clinics.update",
			"mobile_clinics.dispatch",
			"mobile_clinics.track",
			"mobile_clinics.close_visit",
			"patients.read",
			"owners.read",
			"owners.view_contact",
			"appointments.read",
		],
	),

	// ── المالية ──────────────────────────────────────────────────────────────────────
	t(
		"cashier",
		"كاشير",
		"Cashier",
		"يبيع بنقطة البيع ويحصّل الفواتير ويفتح ورديته ويقفلها. لا يُرجع ولا يُبطل.",
		"finance",
		[
			// بلا `refund` و`void` — عكسُ عمليةٍ مُرحَّلة ليس عملًا يوميًّا للكاشير
			"pos_sales.read@OWN",
			"pos_sales.create@OWN",
			"pos_sales.open_shift@OWN",
			"pos_sales.close_shift@OWN",
			"invoices.read",
			"invoices.issue",
			"invoices.collect_payment",
			"owners.read",
			"owners.view_contact",
			"patients.read",
			"inventory.read",
			"services.read",
		],
	),
	t(
		"accountant",
		"محاسب",
		"Accountant",
		"يمسك الدفاتر: قيود اليومية وفواتير البيع والشراء وسندات القبض والصرف والتسويات البنكية.",
		"finance",
		[
			"invoices.read",
			"invoices.create",
			"invoices.issue",
			"invoices.collect_payment",
			"invoices.export",
			"expenses.read",
			"expenses.create",
			"expenses.update",
			"expenses.export",
			"discounts.read",
			"purchasing.read",
			"suppliers.read",
			"reports.read",
			"reports.export",
			"accounting.gl_entry.read",
			"accounting.payment_ledger_entry.read",
			"accounting.journal_entry.read",
			"accounting.journal_entry.write",
			"accounting.journal_entry.submit",
			"accounting.sales_invoice.read",
			"accounting.sales_invoice.write",
			"accounting.sales_invoice.submit",
			"accounting.purchase_invoice.read",
			"accounting.purchase_invoice.write",
			"accounting.purchase_invoice.submit",
			"accounting.payment_entry.read",
			"accounting.payment_entry.write",
			"accounting.payment_entry.submit",
			"accounting.bank_transaction.read",
			"accounting.bank_transaction.write",
			"accounting.account.read",
			"accounting.cost_center.read",
			"accounting.fiscal_year.read",
			"accounting.mode_of_payment.read",
			"accounting.party_account.read",
			"accounting.clinic_invoice.read",
			"accounting.expense.read",
		],
	),
	t(
		"finance_manager",
		"مدير مالي",
		"Finance Manager",
		"يعتمد المصروفات والمشتريات، ويُلغي ويُرجع، ويقفل الفترات المحاسبية.",
		"finance",
		[
			"invoices.read",
			"invoices.create",
			"invoices.update",
			"invoices.issue",
			"invoices.void",
			"invoices.refund",
			"invoices.apply_discount",
			"invoices.collect_payment",
			"invoices.export",
			"expenses.read",
			"expenses.create",
			"expenses.update",
			"expenses.approve",
			"expenses.export",
			"discounts.read",
			"discounts.create",
			"discounts.update",
			"discounts.approve",
			"purchasing.read",
			"purchasing.approve",
			"suppliers.read",
			"pos_sales.read",
			"pos_sales.refund",
			"pos_sales.void",
			"reports.read",
			"reports.export",
			"accounting.gl_entry.read",
			"accounting.payment_ledger_entry.read",
			"accounting.journal_entry.read",
			"accounting.journal_entry.write",
			"accounting.journal_entry.submit",
			"accounting.journal_entry.cancel",
			"accounting.sales_invoice.read",
			"accounting.sales_invoice.cancel",
			"accounting.purchase_invoice.read",
			"accounting.purchase_invoice.cancel",
			"accounting.payment_entry.read",
			"accounting.payment_entry.cancel",
			"accounting.accounting_period.read",
			"accounting.accounting_period.write",
			"accounting.accounting_period.submit",
			"accounting.period_closing_voucher.read",
			"accounting.period_closing_voucher.write",
			"accounting.period_closing_voucher.submit",
			"accounting.budget.read",
			"accounting.budget.write",
			"accounting.budget.submit",
			"accounting.account.read",
			"accounting.account.write",
			"accounting.cost_center.read",
			"accounting.cost_center.write",
			"accounting.role.credit_controller",
		],
	),

	// ── المخزون ──────────────────────────────────────────────────────────────────────
	t(
		"inventory_keeper",
		"أمين مخزن",
		"Inventory Keeper",
		"يستلم ويصرف ويجرد. التسوية والإتلاف وأسعار التكلفة ليست من عمله.",
		"inventory",
		[
			// بلا `stock.adjust` و`write_off` و`inventory.view_cost` — تغيير الكمية بلا
			// مستند بابُ إخفاء عجز، وسعر التكلفة رقم تفاوضي مع المورّد
			"inventory.read",
			"inventory.create",
			"inventory.update",
			"stock.read",
			"stock.create",
			"stock.receive",
			"stock.issue_out",
			"stock.count",
			"stock.transfer",
			"product_comments.read@OWN",
			"product_comments.create@OWN",
			"suppliers.read",
		],
	),
	t(
		"inventory_manager",
		"مدير المخزون",
		"Inventory Manager",
		"يملك المخزون كاملًا: التسوية والإتلاف وأسعار التكلفة.",
		"inventory",
		[
			"inventory.read",
			"inventory.create",
			"inventory.update",
			"inventory.delete",
			"inventory.view_cost",
			"inventory.export",
			"stock.read",
			"stock.create",
			"stock.update",
			"stock.receive",
			"stock.issue_out",
			"stock.count",
			"stock.transfer",
			"stock.adjust",
			"stock.write_off",
			"product_comments.read",
			"product_comments.create",
			"suppliers.read",
			"suppliers.create",
			"suppliers.update",
			"purchasing.read",
			"purchasing.create",
			"purchasing.receive",
		],
	),
	t(
		"purchasing_officer",
		"مسؤول مشتريات",
		"Purchasing Officer",
		"يُعدّ أوامر الشراء ويستلمها. الاعتماد لغيره.",
		"finance",
		[
			// بلا `purchasing.approve` — من يُعدّ الأمر لا يعتمده
			"purchasing.read",
			"purchasing.create",
			"purchasing.update",
			"purchasing.receive",
			"purchasing.export",
			"suppliers.read",
			"suppliers.create",
			"suppliers.update",
			"inventory.read",
			"inventory.view_cost",
			"stock.read",
			"stock.receive",
		],
	),

	// ── الموارد البشرية ──────────────────────────────────────────────────────────────
	t(
		"hr_officer",
		"موظف موارد بشرية",
		"HR Officer",
		"يدير ملفات الموظفين والحضور والإجازات. لا يرى الأجور.",
		"hr",
		[
			// بلا `staff_compensation.*` — الراتب يُرى بإذن مستقلّ
			"staff.read",
			"staff.create",
			"staff.update",
			"staff.view_contact",
			"staff.view_documents",
			"staff.invite",
			"attendance.read",
			"attendance.create",
			"attendance.update",
			"attendance.manual_entry",
			"leave_requests.read",
			"leave_requests.create",
			"leave_requests.update",
			"leave_types.read",
			"compensatory.read",
			"shifts.read",
			"shifts.create",
			"shifts.update",
			"shifts.assign",
			"shifts.publish",
			"specializations.read",
			"documents.read",
		],
	),
	t(
		"hr_manager",
		"مدير الموارد البشرية",
		"HR Manager",
		"كل ما سبق، إضافةً إلى الأجور واعتماد الإجازات والرواتب ونهاية الدورة.",
		"hr",
		[
			"staff.read",
			"staff.create",
			"staff.update",
			"staff.delete",
			"staff.view_contact",
			"staff.view_documents",
			"staff.invite",
			"staff.terminate",
			"staff.export",
			"staff_compensation.read",
			"staff_compensation.create",
			"staff_compensation.update",
			"staff_compensation.approve",
			"staff_compensation.export",
			"attendance.read",
			"attendance.update",
			"attendance.manual_entry",
			"attendance.export",
			"leave_requests.read",
			"leave_requests.update",
			"leave_requests.approve",
			"leave_requests.cancel",
			"leave_types.read",
			"leave_types.create",
			"leave_types.update",
			"compensatory.read",
			"compensatory.approve",
			"payroll.read",
			"payroll.create",
			"payroll.run",
			"payroll.approve",
			"payroll.export",
			"end_of_service.read",
			"end_of_service.calculate",
			"end_of_service.approve",
			"shifts.read",
			"shifts.create",
			"shifts.update",
			"shifts.assign",
			"shifts.publish",
			"specializations.read",
			"documents.read",
		],
	),
	t(
		"training_coordinator",
		"منسّق التدريب",
		"Training Coordinator",
		"يبني الدورات والاختبارات ويُسندها ويصحّح ويصدر الشهادات.",
		"hr",
		[
			"training.read",
			"training.create",
			"training.update",
			"training.assign",
			"training.publish",
			"training.issue_certificate",
			"quizzes.read",
			"quizzes.create",
			"quizzes.update",
			"quizzes.assign",
			"quizzes.publish",
			"quizzes.grade",
			"quizzes.view_results",
			"sops.read",
			"sops.create",
			"sops.update",
			"sops.publish",
			"staff.read",
		],
	),

	// ── التشغيل والإدارة ─────────────────────────────────────────────────────────────
	t(
		"branch_manager",
		"مدير فرع",
		"Branch Manager",
		"يدير فرعه: جلساته وموظفوه ومستنداته وتقاريره — بنطاق الفرع لا الأكاديمية كلها.",
		"operations",
		[
			"patients.read",
			"owners.read",
			"owners.view_contact",
			"appointments.read@BRANCH",
			"appointments.create@BRANCH",
			"appointments.update@BRANCH",
			"appointments.reschedule@BRANCH",
			"appointments.cancel@BRANCH",
			"staff.read@BRANCH",
			"staff.view_contact@BRANCH",
			"attendance.read",
			"leave_requests.read",
			"leave_requests.approve",
			"shifts.read",
			"shifts.assign",
			"tasks.read",
			"tasks.create",
			"tasks.assign",
			"documents.read@BRANCH",
			"documents.create@BRANCH",
			"reports.read",
			"reports.export",
			"branches.read",
			"branches.manage_rooms",
			"inventory.read",
			"stock.read",
			"invoices.read",
			"expenses.read@BRANCH",
			"expenses.create@BRANCH",
		],
	),
	t(
		"clinic_manager",
		"مدير الأكاديمية",
		"Clinic Manager",
		"يدير التشغيل اليومي للأكاديمية كلها. لا يملك تعديل الأدوار والصلاحيات.",
		"operations",
		[
			// بلا `rbac.*` — إدارة التشغيل شيء وتوزيع السلطة شيء آخر
			"patients.read",
			"owners.read",
			"owners.view_contact",
			"appointments.read",
			"appointments.create",
			"appointments.update",
			"appointments.reschedule",
			"appointments.cancel",
			"staff.read",
			"staff.view_contact",
			"attendance.read",
			"leave_requests.read",
			"leave_requests.approve",
			"shifts.read",
			"shifts.create",
			"shifts.assign",
			"shifts.publish",
			"tasks.read",
			"tasks.create",
			"tasks.assign",
			"documents.read",
			"documents.create",
			"documents.update",
			"reports.read",
			"reports.export",
			"branches.read",
			"branches.manage_rooms",
			"services.read",
			"services.update",
			"consultation_types.read",
			"inventory.read",
			"stock.read",
			"invoices.read",
			"expenses.read",
			"expenses.approve",
			"public_bookings.read",
			"public_bookings.approve",
			"public_bookings.reject",
			"notifications.broadcast",
			// [RC0] مدير الأكاديمية يملك التذكيرات كاملةً بما فيها تشغيل المُجدوِل:
			// هو من يقرّر متى تبدأ الأكاديمية بمراسلة ملّاكها وبأيّ نصّ.
			"reminders.read",
			"reminders.create",
			"reminders.update",
			"reminders.delete",
			"reminders.send_reminders",
			"reminders.run",
		],
	),
] as const;

// ── resolution ─────────────────────────────────────────────────────────────────────────

export type ResolvedGrant = { key: string; scope: PermissionScope };

/** Parse `"key"` or `"key@SCOPE"` into a grant. */
export function parseGrantSpec(spec: string): ResolvedGrant {
	const [key, scope] = spec.split("@");
	return {
		key: key ?? spec,
		scope: (scope as PermissionScope | undefined) ?? "ALL",
	};
}

/**
 * A template's grants, deduplicated (the BASE block can overlap a role's own list) keeping
 * the widest scope, so a role never ends up narrower than either half promised.
 */
export function resolveTemplateGrants(template: RoleTemplate): ResolvedGrant[] {
	const width: Record<PermissionScope, number> = { ALL: 3, BRANCH: 2, OWN: 1 };
	const merged = new Map<string, PermissionScope>();

	for (const spec of template.grants) {
		const { key, scope } = parseGrantSpec(spec);
		const existing = merged.get(key);
		if (!existing || width[scope] > width[existing]) merged.set(key, scope);
	}

	return [...merged].map(([key, scope]) => ({ key, scope }));
}

export function findRoleTemplate(key: string): RoleTemplate | undefined {
	return ROLE_TEMPLATES.find((template) => template.key === key);
}

/** Templates that reference a permission — useful for "who can do this?" in the editor. */
export function templatesGranting(permissionKey: string): RoleTemplate[] {
	return ROLE_TEMPLATES.filter((template) =>
		template.grants.some((spec) => parseGrantSpec(spec).key === permissionKey),
	);
}

/** Permissions in the catalogue that no template grants — a coverage signal, not an error. */
export function permissionsWithoutTemplate(): string[] {
	const granted = new Set(
		ROLE_TEMPLATES.flatMap((template) =>
			template.grants.map((spec) => parseGrantSpec(spec).key),
		),
	);
	return ALL_CATALOGUE_PERMISSIONS.map((p) => p.key).filter((key) => !granted.has(key));
}

/** Catalogue entry for a template grant, or `undefined` if the key is unknown. */
export const lookupGrant = findCataloguePermission;
