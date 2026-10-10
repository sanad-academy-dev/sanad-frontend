## WIP — Translation Rollout

### Phase 1 — Dashboard + Shared Shell

- [x] Foundation: add translation namespaces/keys for `dashboard`, `common`, `toasts`, `errors`, `actions`, `emptyStates`, `dates`, and shared enum labels
- [x] Global direction: make `<Toaster />` in `src/routes/__root.tsx` use dynamic `dir` and language-aware position instead of hardcoded RTL
- [x] Global direction: audit hardcoded `dir="rtl"` and fixed `text-right` / `text-left`; replace with `isRtl`, logical classes (`text-start`, `text-end`, `ms-*`, `me-*`), and dynamic Radix `dir`
- [x] Global formatting: add a small locale-aware date/time formatter helper and replace inline `lang === "ar" ? "ar-SA" : "en-US"` formatting
- [x] Shared shell: translate and verify page title generation in `src/routes/_pathless-layout.tsx`
- [x] Shared shell: add translated accessible labels/tooltips for the header icon buttons (video, invoice, search, add)
- [x] Sidebar: verify dynamic side/direction behavior in `src/components/sidebar/app-sidebar.tsx`
- [x] Sidebar: make nav layout/classes direction-safe in `src/components/sidebar/nav-sections.tsx`
- [x] Common stats: make `src/components/common/stats.tsx` direction-neutral and remove hardcoded `dir="rtl"` from the inventory variant
- [x] Dashboard stats: convert `src/features/dashboard/data/stats.ts` into translated data, likely `getDashboardStats(t)`
- [x] Dashboard cards: convert `src/features/dashboard/data/card-labels.ts` into translated labels, likely `getCardLabels(t)`
- [x] Dashboard header: update `src/features/dashboard/components/header.tsx` and `src/features/dashboard/utils/header.ts` to use translated greetings and locale-aware dates
- [x] Dashboard cards: translate card action menu labels (filter, half width, full width, hide)
- [x] Dashboard customize sheet: translate title, description, color theme, widget order, drag/drop helper, hidden/visible state labels, and aria labels
- [x] Dashboard appointments card: translate filter tabs, appointment status labels, empty/error states, and action menu labels
- [x] Dashboard tasks card: translate empty/error states, `unassigned`, `late`, and any task fallback labels
- [x] Dashboard critical alerts card: translate empty/error states and action labels
- [x] Dashboard inventory alerts card: translate empty/error states, action labels, and product navigation labels
- [x] Dashboard performance distribution card: translate chart center label, tab labels, and card action labels
- [x] Dashboard card layout: replace fixed card internals like `text-right` with `text-start` / `text-end`
- [x] Dashboard mutation toasts: update `src/features/dashboard/hooks/use-add-task.ts` to use translated loading/success/error copy
- [ ] Dashboard validation/errors: add translated fallback errors for task creation and any schema messages used by the dashboard task modal
- [x] Translation files: add matching keys to `src/locales/ar/translation.json` and `src/locales/en/translation.json`
- [x] Verification: run `bun run typecheck`
- [x] Verification: run `bun run format`
- [ ] Verification: manually check Arabic RTL and English LTR dashboard in browser
- [ ] Follow-up: add or document a translation audit check to catch hardcoded user-facing strings later

### Phase 2 — Tasks + Appointments

- [x] Tasks page: translate `src/routes/_pathless-layout/tasks.tsx` stats, tooltips, views, filters, and route-level labels
- [x] Tasks module: translate `src/features/tasks/**` components, task sheet, add task modal, kanban columns, status/priority/type labels, copy buttons, subtasks, accept/decline flows, and all toast messages
- [x] Tasks direction: replace fixed RTL classes/directions in task cards, task sheet, menus, and kanban controls with dynamic RTL/LTR behavior
- [x] Tasks validation/errors: move hardcoded form/schema fallback messages into translation keys where client-side copy is shown
- [ ] Appointments page: translate `src/routes/_pathless-layout/appointments.tsx` stats, period filters, toolbar labels, alert strip copy, and route-level empty states
- [ ] Appointments module: translate `src/features/appointments/**` sheet tabs, queue/kanban columns, visit details, diagnosis, vitals, symptoms/history, treatment plan, internal notes, documents, invoices, recurrence, reassignment, and appointment services
- [ ] Appointments modals: translate add/reschedule appointment modals, add document modal, owner reassignment flows, and confirmation/error states
- [ ] Appointments toasts: translate all appointment mutation `toast.promise`, `toast.success`, and `toast.error` messages
- [ ] Appointments direction: make sheets, dropdowns, tabs, kanban, and invoice layouts dynamic for RTL/LTR
- [ ] Verification: run `bun run typecheck`, `bun run format`, and manually check Tasks + Appointments in Arabic and English

### Phase 3 — Services: Patients, Owners, Staff

- [ ] Patients page: translate `src/routes/_pathless-layout/services/patients.tsx` and `src/features/services/patients/**` tables, filters, forms, sheets, status labels, empty states, and mutation toasts
- [ ] Owners page: translate `src/routes/_pathless-layout/services/owners.tsx` and `src/features/services/owners/**` tables, filters, owner forms, patient linking, disable/delete flows, and mutation toasts
- [ ] Staff page: translate `src/routes/_pathless-layout/services/staff.tsx` stats, tabs, attendance section, shifts/payroll/jobs/training placeholders, and staff table
- [ ] Staff module: translate `src/features/services/staff/**` staff sheet, invite dialog, scheduling/working-hours UI, services assignment, attendance leave dialog, booking setup copy, copy-link messages, and autosave errors
- [ ] Services direction: make patient/owner/staff tables, sheets, dialogs, tabs, and attendance cards dynamic for RTL/LTR
- [ ] Shared veterinary labels: centralize animal type/strain, owner relationship, staff prefix/status, gender, and employment-type translations
- [ ] Verification: run `bun run typecheck`, `bun run format`, and manually check Patients, Owners, and Staff in Arabic and English

### Phase 4 — Management: Inventory

- [ ] Inventory route: translate `src/routes/_pathless-layout/management/inventory.tsx` page-level tabs, actions, stats, and header slot content
- [ ] Inventory module: translate `src/features/inventory/**` product tables, filters, item sheets, supplier flows, warehouse/bin flows, stock ledger, movements, reconciliation, purchase requests, purchase orders, receiving, write-offs, POS, invoice modal, and restock dialog
- [ ] Inventory custom toasts: translate `toast.custom` confirmation UIs, undo/delete messages, purchase request prompts, POS payment messages, and supplier/order mutation feedback
- [ ] Inventory enums: centralize translations for stock movement types, product categories, supplier types, order statuses, warehouse statuses, payment methods, and inventory alert labels
- [ ] Inventory direction: remove hardcoded `dir="rtl"` / `dir="ltr"` and fixed left/right positioning in sheets, drawers, POS panels, and purchase/order flows
- [ ] Verification: run `bun run typecheck`, `bun run format`, and manually check Inventory in Arabic and English

### Phase 5 — Management Settings

- [ ] Settings shell: translate `src/routes/_pathless-layout/management/settings.tsx`, settings index, settings sidebar, breadcrumbs, section labels, and placeholders
- [ ] Clinic information: translate clinic profile/settings forms, validation messages, file upload copy, city/country/timezone labels, and save toasts
- [ ] Branches & teams: translate branch forms, room forms, room/branch status toggles, emergency notifications, copy actions, and mutation toasts
- [ ] Scheduling: translate scheduling settings, appointment availability, online booking settings, duration/price labels, time selectors, and mutation toasts
- [ ] Services settings: translate service categories, subcategories, service items, consultation types, prices/durations, enable/disable labels, and mutation toasts
- [ ] Specialties/animals: translate specialization category/subcategory flows, animal type/strain settings, status toggles, and mutation toasts
- [ ] Notifications/email: translate notification preferences, email settings, channel labels, enable/disable states, and mutation toasts
- [ ] Roles & permissions/security: translate roles, permissions, access/security screens, permission descriptions, create/update/delete flows, and mutation toasts
- [ ] Medical protocols: translate protocol settings, protocol forms, empty states, and mutation toasts
- [ ] Settings direction: verify every sheet/table/form in settings uses dynamic RTL/LTR and logical alignment
- [ ] Verification: run `bun run typecheck`, `bun run format`, and manually check all settings pages in Arabic and English

### Phase 6 — Auth, Onboarding, Public Booking, Clinic Profile

- [ ] Auth pages: finish translation coverage for login, register, forgot password, success, invite acceptance, validation errors, OAuth errors, and toast messages
- [ ] Onboarding: translate `src/routes/_onboarding-layout/onboarding.tsx` all steps, country/clinic settings, validation messages, upload copy, completion states, and toasts
- [ ] Public booking: translate `src/routes/book.$slug.tsx` and `src/features/booking/**` wizard steps, service/staff/date/time selection, patient/owner inputs, confirmation/error states, and request toasts
- [ ] Public clinic profile: translate clinic profile copy, empty states, service/staff labels, booking CTAs, and legacy care/profile placeholders where applicable
- [ ] Public direction: verify public booking/profile layouts work in Arabic RTL and English LTR, especially cards, wizard navigation, date/time controls, and phone input
- [ ] Verification: run `bun run typecheck`, `bun run format`, and manually check auth, onboarding, booking, and public profile in Arabic and English

### Phase 7 — API Errors, Server Copy, Emails

- [ ] API errors: audit `src/server/**` and move user-facing Arabic error messages to a locale-aware error strategy or stable error codes mapped on the client
- [ ] Better-auth copy: review `src/lib/data/better-auth-translations.ts` and align auth/server messages with app translation keys
- [ ] Emails: translate `src/lib/email/templates/**` and any invite/notification email subjects, preview text, body copy, and CTA labels
- [ ] Public/server validation: ensure TypeBox/Zod messages that reach the UI have Arabic and English fallbacks
- [ ] Error handling: verify global API error handler conventions in `src/server/app.ts` still return safe, localizable messages
- [ ] Verification: test representative API failures in Arabic and English and confirm UI displays translated fallback copy

### Phase 8 — Shared Components, Utilities, Data Constants

- [ ] UI/common components: audit `src/components/ui/**`, `src/components/common/**`, `src/components/kanban.tsx`, password strength, pagination, table empty states, file upload, phone input, calendar, combobox, and time select for user-facing copy
- [ ] Data constants: translate or make locale-aware `src/lib/data/constants.ts`, `cities.ts`, `time-zones.ts`, seed/default display names where they appear in UI, and static option arrays
- [ ] Formatters: ensure currency, dates, numbers, percentages, relative time, and plural-ish labels are locale-aware
- [ ] Accessibility copy: translate aria-labels, screen-reader-only descriptions, tooltips, command labels, and drag/drop announcements
- [ ] Direction system: document preferred RTL/LTR patterns: `dir`, `side`, `align`, logical spacing, `text-start/end`, icon order, and sheet side behavior
- [ ] Verification: run a hardcoded-string audit and fix shared-component misses before final page QA

### Phase 9 — QA, Regression, And Translation Governance

- [ ] Add a repeatable hardcoded string audit for TS/TSX files and document how to classify false positives
- [ ] Add a missing-key/parity check so `ar` and `en` translation files stay structurally aligned
- [ ] Add a visual QA checklist for each module: Arabic RTL, English LTR, toaster position, sheet side, dropdown alignment, table alignment, form errors, empty states, loading states
- [ ] Add browser smoke tests or manual screenshots for critical pages after translation phases
- [ ] Run full verification: `bun run typecheck`, `bun run format`, `bun test`, and `bun run build`
- [ ] Final copy review: normalize Arabic tone, English tone, veterinary terminology, medical terms, and product naming across modules
- [ ] Final UX review: confirm no clipped text, overlapping labels, broken buttons, reversed icons, or awkward start/end alignment on mobile and desktop

### مسير الرواتب — بنود مؤجّلة

- [ ] **التدرّج التراكمي للإجازة المرضية (المادة 117)**: النظام يجعلها متدرّجة عبر السنة التعاقدية — أول 30 يومًا بأجر كامل، ثم 60 يومًا بـ 75%، ثم 30 يومًا بلا أجر. الحالي: `ClinicLeaveType.payPercent` نسبة واحدة ثابتة لكل نوع (المرضية مزروعة بـ 100)، والتعديل اليدوي في خطوة الاحتساب يغطي الحالة مؤقتًا. المطلوب لاحقًا: تتبّع الأيام المرضية المستهلكة لكل موظف خلال السنة التعاقدية وتقسيم أيام الفترة على الشرائح الثلاث.
- [ ] **الاعتماد المتأخر للإجازات لا يسري بأثر رجعي** (known limitation): تجميع مدخلات المسير يقرأ `LeaveRequest.status = APPROVED` **لحظة الاحتساب**. طلب إجازة يُعتمد بعد تشغيل مسير الفترة لن يُعدّل ذلك المسير، والفارق يُسوّى يدويًا في المسير التالي. البديل مستقبلًا: تسوية تلقائية في الفترة اللاحقة أو إعادة فتح المسير قبل الاعتماد النهائي.
- [ ] **الأزرار المعطّلة في شاشة الرواتب**: "إرسال للموظف" (قسيمة الراتب)، أزرار التصدير الثلاثة، وأزرار التولبار الأربعة (نساعدك/تصدير/العرض/فلترة) — كلها بلا `onClick` أو توست "قريبًا".
- [ ] **نطاق التشغيل CONTRACT**: خيار "نوع عقد معيّن" مخفي حاليًا من الواجهة لعدم وجود حقل نوع عقد على `Staff` (`employmentType` يحمل FULL_TIME/PART_TIME فقط).
- [ ] **انزياح المنطقة الزمنية في `serviceDuration`** (`end-of-service.ts`): توابع التوقيت المحلي على تاريخ متحلّل كـ UTC تزيح تفكيك سنوات/أشهر/أيام يومًا في المناطق السالبة عن UTC. المبالغ سليمة (من فرق `getTime()`)، والأثر على العرض فقط.
- [ ] **شاشة إعدادات `ClinicPayrollSettings`**: النِسَب والسقف وأساس الإضافي قابلة للضبط في قاعدة البيانات لكن بلا واجهة في v1 — الافتراضيات المزروعة كافية. المرجع: `docs/payroll-schema.md`.
- [x] **فلو المسير الاستثنائي (Off-Cycle)**: مبالغ يدوية صافية عبر `POST /payroll/runs/off-cycle` و`OffCycleDialog`. لا يمرّ بالمحرك (بلا حضور/إجازات/تأمينات) ويُنشأ بحالة `CALCULATED`. المسار عبر المعالج الكامل بنوع OFF_CYCLE ما زال متاحًا من `createRun({ type })` لكن بلا زر مخصّص.

## ربط الموارد البشرية بالمالية (منجز)

- [x] **ترحيل تلقائي للمصروفات**: اعتماد مسير الرواتب / تسوية نهاية الخدمة / استلام أمر الشراء
      يُنشئ مصروفًا مرتبطًا داخل نفس المعاملة. `Expense.source` + `sourceId` مع
      `@@unique([source, sourceId])` يجعل الترحيل idempotent على مستوى قاعدة البيانات.
      المصروف المُرحَّل يُقرأ فقط (`PostedExpenseImmutableError` → 422).
- [x] **استرداد السلف من الراتب**: مصروف بـ`staffId` و`recoverFromPayroll` يُخصم من صافي
      المسير التالي عبر `PayrollLineDeduction`. الخصم بعد التأمينات (السلفة ليست أجرًا)،
      و`sourceExpenseId` فريد يمنع الاسترداد المزدوج.
- [x] **تسوية نهاية الخدمة تُحفظ**: كانت حاسبة تنسى الرقم؛ صارت `EndOfServiceSettlement`
      بلقطة كاملة (الأجر والمدة والنسبة) تُعتمد وتُرحَّل للمالية.
- [x] **توحيد العملة**: كل شاشات الرواتب تمرّ عبر `useCurrency()` (ADR-0001) بدل «ر.س» ثابتة.

- [x] **شاشة تسويات نهاية الخدمة**: تبويب «التسويات المحفوظة» داخل الحاسبة يعرض المحفوظ
      بحالته ومدّته ومكافأته.
- [x] **مبيعات نقاط البيع في الإيراد**: `getStats` و`getMonthlyRevenue` صارا يجمعان
      `Sale` المدفوعة مع الفواتير، والاستجابة تفصّل `invoiceRevenue` و`salesRevenue`
      ليكون الإجمالي قابلًا للتفسير.
