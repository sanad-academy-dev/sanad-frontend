export declare const PERMISSIONS: {
    readonly PATIENTS_OWNERS_VIEW_LIMITED: "patients_owners.view_limited";
    readonly PATIENTS_OWNERS_VIEW_FULL: "patients_owners.view_full";
    readonly PATIENTS_OWNERS_CREATE: "patients_owners.create";
    readonly PATIENTS_OWNERS_EDIT: "patients_owners.edit";
    readonly PATIENTS_OWNERS_DELETE: "patients_owners.delete";
    readonly APPOINTMENTS_VIEW_LIMITED: "appointments.view_limited";
    readonly APPOINTMENTS_VIEW_FULL: "appointments.view_full";
    readonly APPOINTMENTS_CREATE: "appointments.create";
    readonly APPOINTMENTS_EDIT: "appointments.edit";
    readonly APPOINTMENTS_DELETE: "appointments.delete";
    readonly APPOINTMENTS_SEND_REMINDERS: "appointments.send_reminders";
    readonly TASKS_VIEW_LIMITED: "tasks.view_limited";
    readonly TASKS_VIEW_FULL: "tasks.view_full";
    readonly TASKS_CREATE: "tasks.create";
    readonly TASKS_EDIT: "tasks.edit";
    readonly TASKS_DELETE: "tasks.delete";
    readonly TASKS_ASSIGN: "tasks.assign";
    readonly STAFF_VIEW_LIMITED: "staff.view_limited";
    readonly STAFF_VIEW_FULL: "staff.view_full";
    readonly STAFF_CREATE: "staff.create";
    readonly STAFF_EDIT: "staff.edit";
    readonly STAFF_DELETE: "staff.delete";
    readonly STAFF_INVITE: "staff.invite";
    readonly INVENTORY_VIEW_LIMITED: "inventory.view_limited";
    readonly INVENTORY_VIEW_FULL: "inventory.view_full";
    readonly INVENTORY_CREATE: "inventory.create";
    readonly INVENTORY_EDIT: "inventory.edit";
    readonly INVENTORY_DELETE: "inventory.delete";
    readonly INVENTORY_SALES_REFUND: "inventory.sales_refund";
    readonly FINANCE_INVOICES_VIEW_LIMITED: "finance_invoices.view_limited";
    readonly FINANCE_INVOICES_VIEW_FULL: "finance_invoices.view_full";
    readonly FINANCE_INVOICES_REFUND: "finance_invoices.refund";
    readonly FINANCE_DISCOUNTS_VIEW_LIMITED: "finance_discounts.view_limited";
    readonly FINANCE_DISCOUNTS_VIEW_FULL: "finance_discounts.view_full";
    readonly FINANCE_CARE_PLANS_VIEW_LIMITED: "finance_care_plans.view_limited";
    readonly FINANCE_CARE_PLANS_VIEW_FULL: "finance_care_plans.view_full";
    readonly FINANCE_EXPENSES_VIEW_LIMITED: "finance_expenses.view_limited";
    readonly FINANCE_EXPENSES_VIEW_FULL: "finance_expenses.view_full";
    readonly DOCUMENTS_VIEW_LIMITED: "documents.view_limited";
    readonly DOCUMENTS_VIEW_FULL: "documents.view_full";
    readonly DOCUMENTS_CREATE: "documents.create";
    readonly DOCUMENTS_EDIT: "documents.edit";
    readonly DOCUMENTS_DELETE: "documents.delete";
    readonly GROOMING_VIEW_LIMITED: "grooming.view_limited";
    readonly GROOMING_VIEW_FULL: "grooming.view_full";
    readonly GROOMING_CREATE: "grooming.create";
    readonly GROOMING_EDIT: "grooming.edit";
    readonly GROOMING_DELETE: "grooming.delete";
    readonly MOBILE_CLINICS_VIEW_LIMITED: "mobile_clinics.view_limited";
    readonly MOBILE_CLINICS_VIEW_FULL: "mobile_clinics.view_full";
    readonly MOBILE_CLINICS_CREATE: "mobile_clinics.create";
    readonly MOBILE_CLINICS_EDIT: "mobile_clinics.edit";
    readonly MOBILE_CLINICS_DELETE: "mobile_clinics.delete";
    readonly MOBILE_CLINICS_DISPATCH: "mobile_clinics.dispatch";
    readonly MOBILE_CLINICS_MANAGE_DEVICES: "mobile_clinics.manage_devices";
    readonly CRM_SETTINGS_VIEW_FULL: "crm_settings.view_full";
    readonly CRM_SETTINGS_CREATE: "crm_settings.create";
    readonly CRM_SETTINGS_EDIT: "crm_settings.edit";
    readonly CRM_LEADS_VIEW_LIMITED: "crm_leads.view_limited";
    readonly CRM_LEADS_VIEW_FULL: "crm_leads.view_full";
    readonly CRM_LEADS_CREATE: "crm_leads.create";
    readonly CRM_LEADS_EDIT: "crm_leads.edit";
    readonly CRM_LEADS_DELETE: "crm_leads.delete";
    readonly CRM_LEADS_ASSIGN: "crm_leads.assign";
    readonly LOYALTY_SETTINGS_VIEW_FULL: "loyalty_settings.view_full";
    readonly LOYALTY_SETTINGS_CREATE: "loyalty_settings.create";
    readonly LOYALTY_SETTINGS_EDIT: "loyalty_settings.edit";
    readonly LOYALTY_LEDGER_VIEW_FULL: "loyalty_ledger.view_full";
    readonly CRM_DEALS_VIEW_LIMITED: "crm_deals.view_limited";
    readonly CRM_DEALS_VIEW_FULL: "crm_deals.view_full";
    readonly CRM_DEALS_CREATE: "crm_deals.create";
    readonly CRM_DEALS_EDIT: "crm_deals.edit";
    readonly CRM_DEALS_DELETE: "crm_deals.delete";
    readonly CRM_DEALS_ASSIGN: "crm_deals.assign";
    readonly CRM_TASKS_VIEW_LIMITED: "crm_tasks.view_limited";
    readonly CRM_TASKS_VIEW_FULL: "crm_tasks.view_full";
    readonly CRM_TASKS_CREATE: "crm_tasks.create";
    readonly CRM_TASKS_EDIT: "crm_tasks.edit";
    readonly CRM_TASKS_DELETE: "crm_tasks.delete";
    readonly CRM_TASKS_ASSIGN: "crm_tasks.assign";
    readonly MARKETING_VIEW_LIMITED: "marketing.view_limited";
    readonly MARKETING_VIEW_FULL: "marketing.view_full";
    readonly MARKETING_CREATE: "marketing.create";
    readonly MARKETING_EDIT: "marketing.edit";
    readonly MARKETING_DELETE: "marketing.delete";
    readonly MARKETING_LAUNCH: "marketing.launch";
    readonly PHARMACY_VIEW: "pharmacy.view";
    readonly PHARMACY_PRESCRIBE: "pharmacy.prescribe";
    readonly PHARMACY_DISPENSE: "pharmacy.dispense";
    readonly PHARMACY_FORMULARY_EDIT: "pharmacy.formulary_edit";
    readonly PHARMACY_CONTROLLED_VIEW: "pharmacy.controlled_view";
    readonly PHARMACY_CONTROLLED_RECORD: "pharmacy.controlled_record";
};
export type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];
/**
 * Resource ids of the legacy operational-billing destinations, for `canView(resource)`.
 * The unified finance nav gates its legacy items with these; accounting items gate on
 * `accounting.{doctype}.read` instead (see `finance-nav.ts`).
 */
export declare const FINANCE_RESOURCES: {
    readonly invoices: "finance_invoices";
    readonly discounts: "finance_discounts";
    readonly carePlans: "finance_care_plans";
    readonly expenses: "finance_expenses";
};
export type FinanceResource = (typeof FINANCE_RESOURCES)[keyof typeof FINANCE_RESOURCES];
/**
 * Granted to every pre-existing role by the [P1-NAV] backfill migration: these permissions
 * did not exist before, so every role implicitly had access to the finance tabs. Gating is
 * an opt-in restriction — nobody loses access on migration day.
 */
export declare const FINANCE_DEFAULT_GRANT: string[];
/**
 * نفس منطق `FINANCE_DEFAULT_GRANT` لوحدة المستندات: هذه الصلاحيات لم تكن موجودة قبل
 * الوحدة، فكل دور قائم كان يملك الوصول ضمنًا. ترحيل التعبئة الرجعية يمنح القراءة
 * الكاملة للأدوار القائمة — التقييد قرار لاحق يتخذه وليّ الأمر، لا أثر جانبي للترحيل.
 */
export declare const DOCUMENTS_DEFAULT_GRANT: string[];
/**
 * نفس المنطق لوحدة التجميل: الوجهة `/care/grooming` معلنة في الشريط الجانبي منذ
 * ما قبل الوحدة، فبوابة صلاحية جديدة بلا تعبئة رجعية تُغلق شاشةً كان الجميع
 * يراها. القراءة الكاملة تُمنح لكل دور قائم؛ الإنشاء والتعديل والحذف تبدأ فارغة
 * وتُمنح صراحةً — التعديل تحديدًا يحمل حقّ تجاوز البوابات.
 */
export declare const GROOMING_DEFAULT_GRANT: string[];
/**
 * [MC0.3] نفس منطق `DOCUMENTS_DEFAULT_GRANT`: عنصر «الأكاديمية المتنقلة» موجود في الشريط
 * الجانبي منذ ما قبل الوحدة، فحارسٌ جديد بلا تعبئة رجعيّة يقفل شاشةً يراها المستخدم
 * معروضة أمامه. تُمنح القراءة الكاملة فقط — أمّا `dispatch` و `manage_devices` و
 * إنشاء/تعديل/حذف المركبات فتبدأ فارغة للجميع وتُمنح صراحةً.
 */
export declare const MOBILE_CLINICS_DEFAULT_GRANT: string[];
/**
 * [MK0.1] نفس منطق `MOBILE_CLINICS_DEFAULT_GRANT`: عنصر «التسويق» معلن في الشريط الجانبي
 * منذ ما قبل الوحدة (`app-sidebar.tsx`) — الرابط يشير اليوم إلى مسار غير موجود. بوابة
 * صلاحية جديدة بلا تعبئة رجعيّة تُحوّل الرابط المكسور إلى رابط ممنوع، وهذا أسوأ. تُمنح
 * القراءة الكاملة لكل دور قائم؛ أمّا الإنشاء والتعديل والحذف والإطلاق فتبدأ فارغة
 * للجميع وتُمنح صراحةً.
 */
export declare const MARKETING_DEFAULT_GRANT: string[];
/**
 * [PH0.1] **الصيدلية بلا تعبئة رجعيّة — وهذا مقصود، وليس سهوًا.**
 *
 * كل تعبئة رجعيّة أعلاه لها سبب واحد: الوجهة كانت **مرئيّة** في الشريط الجانبي قبل
 * الوحدة، فبوابة جديدة بلا منح رجعيّ تُحوّل شاشةً كان الجميع يراها إلى «ممنوع». أمّا
 * الصيدلية فلا عنصر لها في `app-sidebar.tsx` اليوم ولا مسار — لا أحد يفقد شيئًا، فلا
 * شيء يُعوَّض.
 *
 * والفرق هنا ليس شكليًّا: `pharmacy.prescribe` يكتب جرعة دواء، و`pharmacy.dispense`
 * يُخرج مادةً من المخزون إلى طفل حيّ، و`pharmacy.controlled_record` يُقرّ إتلاف مادة
 * مراقبة. منحُ أيٍّ من هذه لكل دور قائم «حفاظًا على الوصول» يمنح صلاحية سريرية لموظف
 * استقبال. تبدأ الستّ **فارغة للجميع** وتُمنح صراحةً لكل دور.
 *
 * لذلك لا يوجد `PHARMACY_DEFAULT_GRANT`، ولا ترحيل تعبئة رجعيّة في [PH0]. إن أضيف
 * عنصر «الصيدلية» إلى الشريط الجانبي لاحقًا فهو يظهر لمن مُنح `pharmacy.view` فقط —
 * وهو السلوك الصحيح لوحدة جديدة خلف راية مطفأة (BRD §0.3).
 */
/**
 * The grantable permission catalogue. `staff-roles.type.ts` validates against this list, so
 * a slug missing here can never be saved on a `StaffRole` — which is why the accounting
 * matrix ([P0.3], BRD NFR-5) is merged in rather than kept in a parallel registry. The
 * accounting module owns its own slugs (`@/server/accounting/permissions/`); that module is
 * pure string constants, safe to pull into client bundles alongside this file.
 */
export declare const ALL_PERMISSIONS: string[];
