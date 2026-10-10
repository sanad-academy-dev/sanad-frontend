# المصروفات (Expenses) Tab — Workflow

> Living document. Updated as the feature evolves through implementation. Latest change at the top of the Changelog.

## Goal

Add a new **المصروفات (Expenses)** tab to the finance management page (`/management/finance`), implemented from the Figma design:

- Figma: `Elite-Vet-SaaS-OS-Design`, node `2928-39100`
- The provided frame shows the **empty state** of the tab.

## Scope (current pass)

- **Frontend UI only** — no Prisma model, migration, or API layer yet. Uses placeholder/mock data (all stats show `0`, table empty → empty state).
- Tab is **appended last** in the finance header (after invoices / discounts / care-plans / enrollments).

Deferred to later passes:
- Prisma `Expense` model + migration
- Server module (`controller` / `model` / `dao` / `type`)
- Real data wiring (stats, list, create/edit/delete)
- "إنشاء مصروف" create form/sheet
- Filter / export / view menu behavior
- Stock alerts (`تنبيهات المخزون`) + reports (`التقارير`) buttons behavior

## Design breakdown (from Figma `2928-39100`)

The tab content (below the shared finance header) consists of three stacked sections:

1. **Stats row** — 4 stat cards, all `0` in the empty state:
   - `مرفوضة` (Rejected)
   - `قيد المراجعة` (Under review)
   - `معتمدة` (Approved)
   - `إجمالي المصروفات` (Total expenses)
2. **Toolbar** — two clusters:
   - Right (RTL start): `إنشاء مصروف` (primary create button), `تنبيهات المخزون` (badge "3"), `التقارير`
   - Left (RTL end): `نساعدك`, `تصدير`, `العرض`, `فلترة`, search input (`ابحث عن مريض...`)
3. **Empty state** — wallet illustration + heading `لا يوجد مصروفات حتى الآن` + subtext `ابدأ بإضافة أول مصروف لتتبع نفقاتك وإدارة مصروفاتك بسهولة من مكان واحد.` + `إنشاء مصروف` button.

### Header tab entry

New tab label: `المصروفات` (value `expenses`). Uses the existing `FinanceHeader` / `FINANCE_TABS` mechanism (portal into `#page-header-slot`).

## Implementation plan

Following existing finance-feature conventions (mirroring `discounts`):

```
src/features/finance/expenses/
  components/
    expenses-tab.tsx        # container: stats + toolbar + empty/table switch
    expenses-toolbar.tsx    # search + filter/view/export + create/reports/stock-alerts
    expenses-empty.tsx      # empty-state illustration + CTA
  types/
    expenses.types.ts       # UI-only mock types (until schema exists)
```

Wiring:
- `finance-tabs.types.ts` — add `expenses` to `FinanceTab` union + `FINANCE_TABS` array (appended).
- `finance.tsx` — render `<ExpensesTab />` when `tab === "expenses"`.

### Conventions honored
- Tailwind CSS 4 utility classes only.
- `Stats` common component with `variant="inventory"` and same padding as other tabs.
- `<hr className="my-2" />` separators between stats / toolbar / content (matches other tabs).
- Named exports, kebab-case files, PascalCase components.
- Arabic RTL copy matching Figma text.
- Icons from `@tabler/icons-react`.

## Open questions / assumptions

- Mock stats are hardcoded to `0` to match the empty-state design.
- "إنشاء مصروف", filter, export, view, stock-alerts, reports buttons are rendered but non-functional (no handlers) this pass.
- Search input is rendered but not wired to any data (no list yet).

## RTL & reference conventions (خطط الرعاية)

Reference feature: `src/features/finance/care-plans/` (خطط الرعاية / `CarePlansTab`). Decisions adopted:

- **RTL comes from the document root.** `__root.tsx` renders `<html dir={dir}>` (`rtl` for Arabic), so tab/toolbar components inherit RTL from the ancestor and do **not** set their own `dir`. Only the empty-state sets `dir="rtl"` explicitly, mirroring `CarePlansEmpty` (harmless, keeps the block self-descriptive).
- **Empty-state illustration is a static asset in `public/illustrations/`, loaded via `<img>`** — not an inlined React SVG. Matches `CarePlansEmpty` (`/illustrations/care-plans-empty.svg`). Ours: `/illustrations/expenses-empty.svg`.
- **Toolbar button placement follows Figma for this screen**: primary `إنشاء مصروف` on the RTL start (right), search on the RTL end (left). (Care-plans places its primary button on the left/RTL-end — that's its own Figma; we follow the expenses Figma.)
- Stats use the shared `Stats` component `variant="inventory"`, `<hr className="my-2" />` separators, `@tabler/icons-react`, named exports — all identical to care-plans.

## Status: ✅ Pass 1 complete (frontend UI)

Files added:
- `src/features/finance/expenses/components/expenses-tab.tsx`
- `src/features/finance/expenses/components/expenses-toolbar.tsx`
- `src/features/finance/expenses/components/expenses-empty.tsx`
- `public/illustrations/expenses-empty.svg` — exact wallet SVG from Figma node `2928-39226` (CSS `var(--fill-0, …)` wrappers flattened to their hex fallbacks so it renders inside `<img>`).

Files edited:
- `src/features/finance/invoices/types/finance-tabs.types.ts` — added `expenses` tab (appended last).
- `src/routes/_pathless-layout/management/finance.tsx` — render `<ExpensesTab />` on `tab === "expenses"`.

Verification:
- `bun run typecheck` (`tsc --noEmit`) — passes.
- `bunx biome format` — clean.
- All three new modules requested through the running Vite dev server (`http://localhost:3000/src/.../expenses-*.tsx`) — each returned valid transformed JS (no compile/import errors). This exercises the exact module the browser executes.
- Not done: logged-in browser screenshot. The `/management/finance` page sits behind `_pathless-layout`'s auth guard (redirects to `/login`), and the seed script provisions no login user, so an automated authenticated screenshot was disproportionate for a static, data-free UI change. Empty state renders unconditionally (`expenses` is a hardcoded `[]`), so there is no runtime data path to fail.

## Pass 2 — Create-expense side sheet (طلب مصروف)

Implemented the create-expense side sheet from **5 Figma states** (nodes `2928-39479`, `2928-40041`, `2928-40443`, `2928-40845`, `2928-41247`) — which are all states of one sheet, not five sheets. Reference for structure/conventions: `create-care-plan-sheet.tsx` (خطط الرعاية).

Files added:
- `src/features/finance/expenses/data/expenses.ts` — UI-only form types (`CreateExpenseFormValues`, defaults, required fields, field labels, option lists, attachment factories). No Prisma model exists yet, so these are hand-written per the CLAUDE.md UI-only exception; structured to swap to `Prisma.ExpenseUncheckedCreateInput` + `z.infer` when the backend lands.
- `src/features/finance/expenses/components/create-expense-sheet.tsx` — the sheet.

Files edited:
- `expenses-tab.tsx` — added `sheetOpen` state; `handleCreate` opens the sheet; renders `<CreateExpenseSheet>`. The toolbar `إنشاء مصروف` and empty-state CTA both open it.

Sheet spec captured from Figma (RTL right→left, top→bottom):
- Header `المصروفات ‹ طلب مصروف` + required-field progress bar (mirrors care-plans header).
- Fields: `اسم المصروف`* | `مقدم الطلب`* · `القسم` | `الفئة` · `المبلغ (ريال سعودي)`* | `طريقة الدفع` · `الفرع`* (`*` = مطلوب).
- `المستندات والروابط` — popover `أضف مستندًا أو رابطًا...` → `إضافة رابط` / `إضافة مستند`; link chip (purple pill + X) and document row (icon + filename + date + view/download/remove).
- `ملاحظات` textarea.
- `تفعيل التذكير` Switch → when ON reveals `وقت الإشعار` 3-way segmented (`قبل يوم واحد` / `قبل يومين` / `قبل 3 أيام`).
- Footer: `إضافة المزيد` checkbox + `إرسال أشعار` switch | `حفظ كمسودة` | `مراجعة الطلب` (disabled until required fields filled).

RTL: inherits `dir="rtl"` from `<html>`; the sheet + inner containers set `dir="rtl"` explicitly exactly like the care-plans sheet. Select/Popover content also `dir="rtl"`.

Still frontend-only: `مراجعة الطلب` / `حفظ كمسودة` don't persist; `إضافة مستند` inserts a demo document (no real upload); option lists (departments/categories/payment methods) are placeholder data. Deferred: Prisma `Expense` model + API, real requester/branch data, unsaved-changes dialog, file upload.

Verification (Pass 2):
- `bun run typecheck` — passes.
- `biome format` — clean.
- `create-expense-sheet.tsx`, `expenses.ts`, `expenses-tab.tsx` all transform cleanly through the Vite dev server (every import resolves, JSX compiles).
- Not done: logged-in interactive screenshot (auth wall + no seed login user). This sheet is interactive (progress, reminder expand, attachment add/remove, submit gating) so a real screenshot would add value — offer to seed a login and drive it if pixel confirmation is wanted.

## Pass 3 — Review / approval-chain view (مراجعة الطلب)

After clicking **مراجعة الطلب** the request is "saved" (a local record is built) and the sheet switches — in place — to the review view (Figma node `2928-43993`): request summary + documents + the **مسار الموافقات** approval timeline + a comment box + a share/print/export footer.

Files added:
- `src/features/finance/expenses/data/expense-review.ts` — UI-only review types: `SubmittedExpenseRequest`, `ApprovalStep`/`ApprovalStepAction`/status enums, `EXPENSE_STATUS_LABELS`, `SEED_APPROVAL_STEPS` (6 steps matching the design), and `buildSubmittedExpenseRequest(values, attachments, code)` which maps form values → display labels.
- `src/features/finance/expenses/components/expense-review-panel.tsx` — the review panel.

Files edited:
- `create-expense-sheet.tsx` — added `submittedRequest` + `approvalSteps` state; `مراجعة الطلب` now builds the record (`EXP-####` local code) and renders `<ExpenseReviewPanel>` instead of the form; `تعديل الطلب` returns to the form; approval action chips mark their step done (demo). Reset on sheet open.

Review view spec (from Figma, RTL):
- Header breadcrumb `المصروفات › طلب مصروف › مراجعة الطلب`.
- Title `مراجعة … . EXP-####` + status pill `قيد المراجعة`.
- Read-only detail rows (icon+label right, value left): مقدم الطلب، القسم، الفئة، الفرع، المورد، المبلغ، طريقة الدفع، التاريخ.
- `المستندات والروابط` with the same attachment rows.
- `مسار الموافقات` vertical timeline; each step = icon+connector (right), title, actor + date, and either a status badge (`تم الارسال`) or action chips (`رفض` rose / `اعتماد`,`صرف المصروف` emerald). Last node is a comment with an avatar. Comment input `اضافة تعليق...` + upload/emoji/@/link toolbar.
- Footer: `تعديل الطلب` / `حفظ كمسودة` | `مشاركة` / `طباعة` / `تنزيل PDF`.

Still frontend-only: the record is in component state (not persisted); approval chips, share/print/PDF, and the comment box are non-functional demos. Deferred to the backend pass: real Expense + ApprovalStep models, actual actor data, persistence, PDF export.

Verification (Pass 3):
- `bun run typecheck` — passes.
- `biome format` — clean.
- `expense-review-panel.tsx`, `expense-review.ts`, `create-expense-sheet.tsx` all transform cleanly through Vite.
- Not done: logged-in interactive screenshot (auth wall + no seed login) — the review flow (submit → panel switch → approve/reject a step → edit back) is interactive, so a real screenshot would add value; offer to seed a login and drive it.

## Pass 4 — Send-review-request dialog + approval gating

The "ارسال طلب المصروف للمراجعة" step no longer shows a static `تم الارسال` badge — it shows an **إرسال للمراجعة** button that opens a send-request dialog (email-composer style, Figma nodes `2963-837922`, `2963-840131`, `2984-57466`). Until the request is sent, all approval action chips (`رفض`/`اعتماد`/`صرف المصروف`) are **disabled**. On send: the step flips to `تم الارسال`, the chips become clickable, and a success toast fires (`تم إرسال طلب الصرف بنجاح...`).

Files added:
- `src/features/finance/expenses/components/send-review-request-dialog.tsx` — the dialog (header breadcrumb, `إلى:` recipients with chips + `أضف مسؤول` popover picker, `الموضوع`, body with AI sparkle, PDF attachment chip, `قالب البريد` template dropdown + formatting toolbar, footer `إرسال الطلب`/`إلغاء`).

Files edited:
- `data/expense-review.ts` — `ApprovalStep.hasSendButton`; the seed "sent" step now uses `hasSendButton` (state `pending`) instead of a `تم الارسال` badge; added `SendReviewRequestValues` + `ReviewRequestRecipient`, seed recipients/options, `buildSendReviewRequestDefaults`, and email-template list.
- `expense-review-panel.tsx` — renders the send button for `hasSendButton` steps (→ `تم الارسال` badge once sent); `ActionChip` gains a `disabled` prop; all action chips are disabled while `!reviewSent`; new `reviewSent` + `onSendReview` props.
- `create-expense-sheet.tsx` — `sendDialogOpen` + `reviewSent` state; the send button opens `<SendReviewRequestDialog>`; on send marks the step done, enables chips, and toasts; approval actions no-op until sent.

Design mapping:
- Dialog #`2963-837922` = composed state; #`2963-840131` = recipient dropdown open (implemented as the `أضف مسؤول` popover with checkable options); #`2984-57466` = post-send success toast.

Still frontend-only: recipients/templates are seed data; the AI sparkle, formatting toolbar, print/attach, and the email itself are non-functional; nothing is persisted.

Verification (Pass 4):
- `bun run typecheck` — passes.
- `biome format` — clean.
- `send-review-request-dialog.tsx`, `expense-review-panel.tsx`, `expense-review.ts`, `create-expense-sheet.tsx` all transform cleanly through Vite.
- Not done: logged-in interactive screenshot (auth wall + no seed login). The gating flow (open dialog → send → chips enable + toast) is interactive; offer to seed a login and drive it for pixel confirmation.

## Pass 4b — Dialog RTL fixes (user-reported)

Two bugs reported after Pass 4, fixed against Figma `2963-840581`:
- **Duplicate close X**: the header's second button used `IconPlus` rotated 45° (renders as a ✕). Replaced with `IconArrowsDiagonal` (the ⤢ expand icon from the design) — now exactly one X + one expand icon.
- **Broken RTL layout**: the dialog forced `flex flex-col`/`flex-1` inside `DialogContent`'s base `grid`, which broke height/scroll. Removed the flex override (block flow inside the grid, `max-h-[85vh]` + body `overflow-y-auto`, matching `payment-modal.tsx`). Toolbar and footer re-aligned to the design (`قالب البريد` + formatting icons on the left; `إرسال الطلب`/`إلغاء` on the left) via `flex-row-reverse` + `justify-end`. Added an sr-only `DialogTitle` for a11y.

A second round of user feedback (side-by-side with the correct design) surfaced row-alignment bugs I then fixed:
- **إلى:** row — label now rightmost, recipient chip beside it, `أضف مسؤول` on the far left (was: chip on the left, label far right).
- **الموضوع** row — label rightmost with the subject text hugging it (was: full-width input pushing the label to the opposite edge).

Verified visually: rendered the dialog and review panel through a throwaway `/dialog-preview` route (deleted after) and captured screenshots with headless Chrome over CDP (the app's auth wall blocks the real route, but these components render standalone). Final dialog screenshot matches the correct design row-for-row; the `إرسال للمراجعة` button shows on the timeline and the approval chips are correctly dimmed/disabled until sent.

## Pass 5 — Exact timeline icons + card/list views

**Exact مسار الموافقات icons** (Figma nodes `2928-44068/44085/44105/44125/44145`, `2963-840580`): the timeline was using Tabler approximations. Extracted the real HugeIcons SVGs from Figma and inlined them as `approval-step-icons.tsx` (`IconFileAdd`, `IconMailSend`, `IconDocumentValidation`, `IconValidationApproval`, `IconWebValidation`). `STEP_ICONS` now maps to these. Badge coloring matches the design: the `created` step is filled blue (`#4f6ae0`), the rest are light grey (`#f4f4f4`).

**Card/list views + العرض toggle** (Figma `2928-38741`): the expenses tab now shows records (seed data) as a 4-column card grid by default, toggleable to a list via the **العرض** dropdown (بطاقات / قائمة).
- `data/expense-records.ts` — `ExpenseRecord`, `ExpenseCardStatus` (+ colored badge meta), mini-stepper model, `ExpensesViewMode`, `SEED_EXPENSE_RECORDS`.
- `expense-card.tsx` — status badge (top-left), title/subtitle, meta row (requester/code/amount/date), a mini horizontal stepper (إرسال → المدير العام → المدير المالي → الدفع with a blue connector over active nodes), and رفض/اعتماد/قبول action chips.
- `expenses-grid.tsx` / `expenses-list.tsx` — the two views.
- `expenses-toolbar.tsx` — العرض is now a `DropdownMenu` toggling grid/list.
- `expenses-tab.tsx` — holds `view` state, filters by search, renders empty/grid/list.

Verified with real headless-Chrome screenshots (throwaway `/dialog-preview` route + CDP): both the timeline icons and the card grid match the Figma.

Still frontend-only: records are seed data; card action chips and the `...` menu are non-functional.

### Card RTL fix (important)
The card grid rendered fully flipped at first because the Figma card is **not** an RTL component — it's an **LTR flex layout with right-aligned content** (`items-end`, `text-right`, `justify-between`, value-first DOM). Inside the app's `<html dir="rtl">` it inherited RTL and mirrored every row. Fix: `dir="ltr"` on the card root (Arabic words still render correctly via browser bidi; only the box layout stays LTR). This is now **Rule 0** in AGENTS.md → RTL Layout Rules: *read the design's actual flex direction via `get_design_context` first; some components need explicit `dir="ltr"`.*

## Pass 6 — اعتماد dialog + success toast

**Approve dialog** (Figma `2963-841834`): clicking an `اعتماد` action chip on a `مراجعة المدير العام`/`اعتماد المدير المالي` step opens a confirmation dialog.
- `approve-expense-dialog.tsx` — header breadcrumb (`اعتماد المدير العام › طلب مصروف › شراء … . EXP-#####`), intro question, a read-only details box (المبلغ/المصروف/القسم), `ملاحظات إضافية` textarea (prefilled), a `التوقيع` (`مطلوب`) signature drop-zone with `+ إضافة توقيع`, and a footer with the green `اعتماد المصروف` button + `إشعار المدير عبر البريد` toggle.
- **RTL**: this dialog is also LTR-flow-with-right-alignment (confirmed via `get_design_context` — details rows are `justify-between`, value-first). Applied `dir="ltr"` to an **inner wrapper** (not `DialogContent`, so the dialog's centering transform still works). Verified centered + correct via screenshot.
- Wiring (`create-expense-sheet.tsx`): `handleStepAction` opens the dialog for `approve` (reject applies directly); `handleConfirmApprove` marks the step done and fires the success toast.

**Success toast** (Figma `2963-837906`): on confirm → `toast.success("تم اعتماد المصروف بنجاح", { description: "تمت مراجعة واعتماد …", action: { label: "تراجع", onClick } })`. The `تراجع` action restores the step's pending actions.

Still frontend-only: no persistence; the signature is a demo toggle; the "notify manager" switch is non-functional.

### Pass 6 follow-ups
- **Footer + switch fix**: the footer's decision button belongs on the **right** (RTL primary-action position) with the notify toggle on its left. Since the dialog body is `dir="ltr"`, the footer needs its own `dir="rtl"`. The `Switch`'s RTL thumb-translation variants only work inside an RTL subtree, so this also fixed the toggle animating the wrong way.
- **Reject variant**: generalized `approve-expense-dialog.tsx` → **`review-decision-dialog.tsx`** with a `decision: "approve" | "reject"` prop (`ReviewDecisionDialog`). Config-driven per decision: header label/color (`اعتماد المدير العام` green / `رفض المدير العام` rose), intro text, prefilled notes, button label/color/icon (`اعتماد المصروف` green + check / `رفض المصروف` rose + X-circle). Both `اعتماد` and `رفض` chips now open the dialog; on confirm, `handleConfirmDecision` marks the step done and fires the matching toast (`toast.success` for approve, `toast.error` for reject), each with a `تراجع` action that restores the step. Verified both variants by screenshot.

## Pass 7 — Delete-request dialog

**Delete dialog** (Figma `2987-69379`): a `حذف الطلب` button (destructive, outline) added to the review panel footer opens a confirmation dialog.
- `delete-expense-request-dialog.tsx` — red header (`حذف طلب مصروف` + trash icon, right) with breadcrumb; intro warning (`… لا يمكن التراجع عن هذا الإجراء`); a full read-only details box (status badge + 8 rows: مقدم الطلب/القسم/الفئة/الفرع/المورد/المبلغ/طريقة الدفع/التاريخ, value left / label+icon right); a rose **النتائج المترتبة** consequences box with two bullet points; footer with red `حذف الطلب` (⌘↵) button on the right + `ارسل اشعار` toggle on the left.
- **RTL**: same LTR-flow-with-right-alignment pattern (confirmed via `get_design_context` — detail rows are `justify-between`, value-first). `dir="ltr"` inner wrapper + `dir="rtl"` footer. Verified centered & correct by screenshot.
- Wiring: `ExpenseReviewPanel` gains an `onDelete` prop (new footer button); `create-expense-sheet.tsx` holds `deleteDialogOpen`, renders `DeleteExpenseRequestDialog`, and on confirm closes the sheet + toasts `تم حذف طلب المصروف`.

Still frontend-only: no persistence; the `ارسل اشعار` toggle is non-functional.

## Pass 8 — Rejection summary (after رفض)

**Rejection summary panel** (Figma `2973-56076`): after confirming رفض in the decision dialog, the sheet switches from the approval timeline to a read-only rejection summary.
- `expense-rejection-summary.tsx` — red header (`رفض طلب المصروف`, right); a hero with the red rejection illustration + `تم رفض طلب الصرف وتحديث حالتها إلى مرفوضة` + subtext + `مقدم الطلب: … · 12 مايو 2026`; a **ملخص الطلب** order-summary table (البند/السعر); a **تفاصيل الطلب** box (7 rows: إجمالي المصروف/القسم/الفرع/طريقة الصرف/الحالة=مرفوضة in red/تاريخ القرار/اعتمد بواسطة, value left / label right); a rose **سبب الرفض** box; a footnote; footer with `تعديل الطلب` (right) + `إلغاء` (left).
- Illustration: extracted the Figma SVG → `public/illustrations/expense-rejected.svg` (var() fills flattened to hex).
- **RTL**: same LTR-flow pattern (confirmed via `get_design_context` — detail rows `justify-between`, value-first). `dir="ltr"` on the panel + `dir="rtl"` footer. Verified by screenshot.
- Wiring (`create-expense-sheet.tsx`): a `rejectionReason` state; confirming رفض in `handleConfirmDecision` marks the step `مرفوض`, sets the reason, and fires the error toast. The panel renders when `submittedRequest && rejectionReason` (before the review panel branch); `تعديل الطلب` clears it and returns to the form.

Still frontend-only: no persistence; some summary fields (order-summary line, طريقة الصرف=خزينة, decision date, approver) are seed values from the design.

---

# Backend Wiring Plan

Everything above is **frontend-only** — all data is seed/UI state, and the UI-only types in `src/features/finance/expenses/data/*` violate the repo's "types must derive from the source of truth" rule as a deliberate stopgap. This plan replaces that stopgap with a real Prisma model + Elysia server module + Treaty-typed hooks, then rewires each screen. **Reference module to mirror throughout: `src/server/discounts/` (clinic-scoped CRUD with a status enum, unique code, Zod-in-`.type.ts`, TypeBox model).**

## Guiding rules (from AGENTS.md — do not skip)
- **Migrations, never `db:push`** on shared DBs. Every schema change: edit `prisma/schema.prisma` → `bunx prisma migrate dev --name <change>` → commit schema + migration together. CI runs `prisma migrate diff` and fails on drift.
- **Types derive from the source of truth**: response types = `Prisma.XGetPayload<{ select }>`; DAO input = `Pick`/`Omit`/`Partial` of `Prisma.XUncheckedCreateInput`; enums = re-export from `@/generated/prisma/enums`; form types = `z.infer`. No hand-written shapes once the model exists.
- **`requireClinic` macro** on every route (returns 401 without `activeClinicId`); scope every query by `clinicId`.
- **Arabic error messages**; `generateUniqueCode({ prefix: "EXP", isUnique })` for the human code; register the controller in `src/server/index.ts`.
- **Toast + hooks conventions**: `toast.promise` around mutations; `useQuery`/`useMutation` hooks return named objects; Treaty client from `@/lib/api`.

---

## Phase 1 — Data model (Prisma)

Add to `prisma/schema.prisma` (mirroring the `Discount` model's conventions: `code @unique`, `clinicId` + `Clinic` relation with `onDelete: Cascade`, `@@map`, `status` enum, timestamps).

### Enums
```prisma
enum ExpenseStatus {
  DRAFT          // مسودة
  PENDING_REVIEW // بانتظار المراجعة / قيد المراجعة
  APPROVED       // معتمد
  REJECTED       // مرفوض
  PAID           // تم الصرف
}

enum ExpenseApprovalStepType {
  CREATED           // تم إنشاء المصروف
  SENT_FOR_REVIEW   // ارسال طلب المصروف للمراجعة
  MANAGER_REVIEW    // مراجعة المدير العام
  FINANCE_APPROVAL  // اعتماد المدير المالي
  DISBURSEMENT      // تأكيد الصرف
}

enum ExpenseApprovalStepState {
  PENDING
  SENT
  APPROVED
  REJECTED
  DONE
}

enum ExpensePaymentMethod { CASH BANK_TRANSFER CARD CHEQUE TREASURY }

enum ExpenseAttachmentKind { LINK DOCUMENT }

enum ExpenseReminderOffset { ONE_DAY TWO_DAYS THREE_DAYS }
```

### Models
```prisma
model Expense {
  id              String               @id @default(cuid())
  code            String               @unique          // EXP-XXXX
  clinicId        String
  name            String                                // اسم المصروف
  status          ExpenseStatus        @default(DRAFT)
  amount          Decimal              @db.Decimal(10, 2)
  paymentMethod   ExpensePaymentMethod?
  categoryId      String?                               // FK → existing category/settings (TBD, see open questions)
  departmentId    String?                               // FK or free enum (TBD)
  branchId        String?
  requesterId     String                                // FK → User (member who created it)
  supplierId      String?                               // FK → Supplier (المورد)
  notes           String?
  reminderEnabled Boolean              @default(false)
  reminderOffset  ExpenseReminderOffset?
  rejectionReason String?
  decisionAt      DateTime?
  decidedById     String?                               // FK → User (اعتمد/رفض بواسطة)
  createdAt       DateTime             @default(now())
  updatedAt       DateTime             @updatedAt

  clinic      Clinic                 @relation(fields: [clinicId], references: [id], onDelete: Cascade)
  requester   User                   @relation("ExpenseRequester", fields: [requesterId], references: [id])
  decidedBy   User?                  @relation("ExpenseDecider",   fields: [decidedById], references: [id])
  branch      Branch?                @relation(fields: [branchId],  references: [id])
  supplier    Supplier?              @relation(fields: [supplierId], references: [id])
  attachments ExpenseAttachment[]
  steps       ExpenseApprovalStep[]

  @@index([clinicId, status])
  @@map("expense")
}

model ExpenseAttachment {
  id             String                @id @default(cuid())
  expenseId      String
  kind           ExpenseAttachmentKind
  label          String
  url            String                                 // link URL or uploaded file path
  sizeBytes      Int?
  uploadedAtLabel DateTime            @default(now())
  expense        Expense               @relation(fields: [expenseId], references: [id], onDelete: Cascade)
  @@map("expense_attachment")
}

model ExpenseApprovalStep {
  id        String                   @id @default(cuid())
  expenseId String
  type      ExpenseApprovalStepType
  state     ExpenseApprovalStepState @default(PENDING)
  order     Int
  actorId   String?                  // FK → User (بواسطة)
  actedAt   DateTime?
  comment   String?
  expense   Expense                  @relation(fields: [expenseId], references: [id], onDelete: Cascade)
  actor     User?                    @relation(fields: [actorId], references: [id])
  @@map("expense_approval_step")
}
```
Add the reverse relations on `Clinic`, `User`, `Branch`, `Supplier` (Prisma requires both sides).

**Migration:** `bunx prisma migrate dev --name add_expense_models`. Commit schema + migration together. The prismabox generators produce `generated/prismabox/ExpenseStatus` etc. for the TypeBox model automatically on generate.

---

## Phase 2 — Server module (`src/server/expenses/`)

Four files, mirroring `discounts/`:

### `expenses.type.ts`
- `export type { ExpenseStatus, ExpensePaymentMethod, ... }` re-exported from `@/generated/prisma/enums`.
- `expenseSelect` (`satisfies Prisma.ExpenseSelect`) including `attachments`, `steps` (ordered), `requester { id, name }`, `decidedBy { id, name }`, `branch`, `supplier` — then `export type ExpenseResponse = Prisma.ExpenseGetPayload<{ select: typeof expenseSelect }>`.
- `ExpenseListItemResponse` (lighter select for cards/list), `ExpenseStatsResponse` (`{ rejected, pendingReview, approved, total, totalAmount }` → drives the 4 stat cards).
- **Zod form schema** `createExpenseSchema` (source of truth for the create sheet — replaces `data/expenses.ts`'s hand-written type). `CreateExpenseFormInput = z.infer<...>`.
- DAO input types derived from `Prisma.ExpenseUncheckedCreateInput` via `Pick` (+ `attachments?: ...`, `steps?: ...`).

### `expenses.model.ts` (TypeBox, prismabox enums)
- `expenses.create`, `expenses.update`, `expenses.setStatus`, `expenses.decision` (`{ decision: "approve"|"reject", reason?, signature?, notify? }`), `expenses.sendReview` (`{ recipientIds, subject, body }`), `expenses.addAttachment`.

### `expenses.dao.ts` (Prisma only, no business logic in controller)
- `list(clinicId, { status?, search? })`, `getStats(clinicId)`, `getById(id, clinicId)`.
- `create(clinicId, requesterId, input)` → `generateUniqueCode({ prefix: "EXP", isUnique })`, seed the `steps` (CREATED done, SENT_FOR_REVIEW pending, MANAGER_REVIEW, FINANCE_APPROVAL, DISBURSEMENT) in a nested `create`.
- `update`, `remove` (returns `"not-found"` sentinel like discounts).
- `sendForReview(id, clinicId, actorId, payload)` → set `status=PENDING_REVIEW`, mark the SENT step `SENT`.
- `applyDecision(id, clinicId, stepId, actorId, { decision, reason })` → mark step `APPROVED`/`REJECTED`, set `Expense.status`, `decisionAt`, `decidedById`, `rejectionReason`; a rejection ends the chain.

### `expenses.controller.ts` (Elysia + `requireClinic` macro, copy from discounts)
Routes: `GET /` (list, `?status`/`?search`), `GET /stats`, `GET /:id`, `POST /`, `PATCH /:id`, `PATCH /:id/status`, `POST /:id/send-review`, `POST /:id/steps/:stepId/decision`, `POST /:id/attachments`, `DELETE /:id`. Arabic error messages; `status(404/409/201)` sentinels like discounts.

**Register** in `src/server/index.ts`: import `expensesController`, add `.use(expensesController)`.

---

## Phase 3 — Client hooks (`src/features/finance/expenses/hooks/`)

Treaty client (`@/lib/api`), TanStack Query, named-object returns, `toast.promise` on mutations (Arabic messages), invalidate `["expenses"]` / `["expense-stats"]` on success:
- `use-expenses.ts` — `useQuery(["expenses", { status, search }])`.
- `use-expense-stats.ts` — drives the 4 stat cards (replaces the hardcoded `0`s in `expenses-tab.tsx`).
- `use-expense.ts` — single expense (for the review panel / rejection summary).
- `use-expense-mutations.ts` — `create`, `update`, `remove`, `sendReview`, `decide` (approve/reject), `addAttachment`.

---

## Phase 4 — Rewire the UI (delete the stopgaps)

Replace UI-only data with real types/data, keeping components' markup/RTL intact (they already match Figma):
1. **`expenses-tab.tsx`** — `useExpenses()` + `useExpenseStats()`; remove `SEED_EXPENSE_RECORDS` and the hardcoded stats; keep grid/list/empty switch. Search → server `?search` (debounced) or keep client-side filter initially.
2. **`create-expense-sheet.tsx`** — form uses `createExpenseSchema` via `zodResolver` (per the Forms convention — currently it's manual `useState`); `مراجعة الطلب` calls `create`; the review panel reads the created expense; `إرسال للمراجعة` → `sendReview`; approve/reject chips → `decide`; delete → `remove`. Real `EXP-####` from the server (drop the local `Math.random()` code).
3. **Card/list/review/rejection/dialogs** — swap `ExpenseRecord`/`SubmittedExpenseRequest`/`ApprovalStep` (UI-only) for the derived server types (`ExpenseListItemResponse`, `ExpenseResponse`, and a step type from the payload). Component props change type; JSX stays.
4. **Attachments** — wire `إضافة مستند` to the existing `src/server/uploads/` flow (real file upload) instead of the demo insert; `إضافة رابط` persists via `addAttachment`.
5. **Delete `src/features/finance/expenses/data/expenses.ts`, `expense-records.ts`, and the UI-only parts of `expense-review.ts`** once every consumer imports the server types — this is the point where the repo's type-reuse rule is satisfied again.

---

## Phase 5 — Verify
- `bun run typecheck` + `bun run format`.
- `bunx prisma migrate diff --from-config-datasource --to-schema prisma/schema.prisma --exit-code` → 0 (no drift).
- Drive the full flow through the real app (needs an authed session — see the auth note below): create → review → send → approve/reject → rejection summary / delete. Screenshot-verify RTL as before.
- Add DAO unit tests (vitest) for `create` (code + seeded steps), `applyDecision` (status transitions), `getStats`.

## Decisions made
- **No roles for now (single admin).** The app has no proper roles system yet, so we do **not** model `المدير العام` / `المدير المالي` as roles. All approval actions are performed by the one current admin user. `ExpenseApprovalStep.actorId` is simply the acting user (the admin), filled on action; the step *labels* (مراجعة المدير العام, اعتماد المدير المالي…) stay as display text. **Roles are a placeholder** — when a real roles system lands, revisit `applyDecision` to enforce which role may act on which step. Do not build role-gating now.

## Open questions (resolve before / during Phase 1)
- **Category / department**: FKs to existing models, new lookup tables, or plain enums? (The UI currently uses placeholder option lists.) — pick the lightest that fits `settings`. *Leaning: nullable string label columns for now, upgrade to FKs later.*
- **Signature** (اعتماد/رفض dialogs): store as an uploaded image (uploads flow) or a boolean "signed" flag for now? *Leaning: boolean flag for now.*
- **Stats semantics**: is `إجمالي المصروفات` a count or a summed amount? (UI shows a `ر.س` amount → summed amount.)
- **Auth/seed for testing**: the app is behind `_pathless-layout`'s auth guard and the seed provisions no login user — add a dev-seed member so the flow (and screenshots) can be driven end-to-end.

## Suggested commit sequence
1. `feat(expenses): add Expense/ExpenseAttachment/ExpenseApprovalStep models + migration`
2. `feat(expenses): add server module (type/model/dao/controller) + register`
3. `feat(expenses): add client hooks (list/stats/detail/mutations)`
4. `refactor(expenses): wire tab + create sheet to real API; drop seed data`
5. `refactor(expenses): wire review/decision/rejection/delete to API; remove UI-only types`
6. `feat(expenses): real attachment upload`
7. `test(expenses): DAO tests for create/decision/stats`

## Implementation progress

- **Phase 1 ✅** — `Expense`, `ExpenseAttachment`, `ExpenseApprovalStep` models + 6 enums added to `schema.prisma` (no roles; step labels are display-only, `actorId` = acting admin). Reverse relations on `Clinic`/`User`/`Branch`/`Supplier`. Migration `20260713091725_add_expense_models` created & applied; `prisma generate` ran (client + prismabox). Category/department are nullable label columns for now; signature is a `signed` boolean.
- **Phase 2 ✅** — `src/server/expenses/` (`type`/`model`/`dao`/`controller`) mirroring `discounts/`. DAO seeds the 5 approval steps on create, `sendForReview`, `applyDecision` (approve/reject → status + decidedBy + reason). Routes: list/stats/:id/create/update/send-review/steps/:stepId/decision/attachments/delete, all behind `requireClinic`. Registered in `src/server/index.ts`. Typechecks.
- **Phase 3 ✅** — hooks in `src/features/finance/expenses/hooks/`: `use-expenses`, `use-expense-stats`, `use-expense-mutations` (create/sendReview/decide/remove, `toast.promise`). Treaty types resolve end-to-end (typecheck clean).
- **Phase 4 ✅** — UI rewired to the API via **view-model mappers** (the design-shaped UI types now derive from server types instead of duplicating the schema):
  - `expense-records.ts` → `fromExpenseListItem(ExpenseListItemResponse) → ExpenseRecord` (dropped `SEED_EXPENSE_RECORDS`); card/list JSX untouched.
  - `expense-review.ts` → `fromExpenseResponse(ExpenseResponse) → { request, steps, reviewSent }` (dropped `SEED_APPROVAL_STEPS` + the form-based builder); review panel/rejection summary/dialogs keep their view-model props, data comes from the real payload.
  - `expenses.ts` → added `toCreateExpensePayload(values, attachments) → ExpensePayload` mapper.
  - `expenses-tab.tsx` → `useExpenses(search)` + `useExpenseStats()` (real stat cards).
  - `create-expense-sheet.tsx` → stores the created `ExpenseResponse`; `مراجعة الطلب` = `create()`, `إرسال للمراجعة` = `sendReview()`, approve/reject = `decide()`, delete = `remove()`. All views derive from the saved response via `fromExpenseResponse`.
  - Removed dead exports (`getModifiedExpenseFields`, `EXPENSE_FIELD_LABELS`, `EXPENSE_STATUS_LABELS`, `CARD_TO_REQUEST_STATUS`).
  - **Deliberately deferred** (follow-up): converting the create form from `useState<CreateExpenseFormValues>` to `zodResolver(createExpenseSchema)` — larger change, current form works. And `الفرع`/`المورد` selects still send `null` (form uses stub option values, not real branch/supplier ids) — wire when branch/supplier pickers use real data.
- **Phase 5 ✅** — `tsc --noEmit` clean; `prisma migrate diff … --exit-code` → **0 (no drift)**; `GET /api/expenses` → **401** (route registered + `requireClinic` works, i.e. the module mounted with no runtime error); all rewired client modules transform through Vite. *Not done:* driving the logged-in UI flow end-to-end (auth wall + no seed login user) and DAO unit tests — both still pending a dev-seed member.

## Testability & follow-ups (fixing "no E2E / no DAO tests")

- **Dev login seed** (`prisma/seed-dev-user.ts`, `bun run db:seed:dev`) — `dev@elite.test` / `devpassword123`. Creates the user via better-auth (correct hash); the auth `user.create.after` hook auto-makes a Clinic + ADMIN membership + staff, so the seed **reuses that clinic** and marks it `onboardingCompleted: true` (creating a second clinic caused the auth session hook to pick the wrong, un-onboarded one → onboarding redirect loop; fixed). On login the session hook auto-sets `activeClinicId`.
- **Logged-in E2E verified** (headless Chrome via CDP): sign-in → past onboarding guard → المصروفات tab renders → create sheet opens → `مقدم الطلب` lists real users and defaults to the current user (`(أنا)`) → required-field validation correctly gates `مراجعة الطلب` (branch still required — see below). `POST /api/uploads/presign` returns 201 with a real presigned S3 URL for the session.
- **مقدم الطلب wired** — `use-clinic-users` (reuses `GET /users` = all clinic members), Select defaults to the current user via `useSession()`; server honors the form's `requesterId` only if that user is a member of the clinic, else falls back to the authed user.
- **File upload on المستندات والروابط** — `إضافة مستند` now opens a real file picker and uploads via the existing `useUploadFile` (presign → PUT to S3 → store the key); attachment stores the S3 key in `value`. `إضافة رابط` unchanged.
- **DAO tests** — `vitest.config.ts` (`vite-tsconfig-paths`, serial, `NODE_ENV=development`) + `src/server/expenses/expenses.dao.test.ts`: **6 passing** against the real DB (create+seeded steps, sendForReview, approve/reject transitions, getStats, remove clinic-scoping). Self-cleans via cascade delete. Run: `bun run test`.

Still deferred: the create form's **الفرع/المورد** selects use stub option values (not real ids) so branch is sent as `null` and blocks `مراجعة الطلب` until a real branch picker is wired; converting the form to `zodResolver(createExpenseSchema)`.

## Fixes: file upload, reopen record, card/list actions

- **File upload (403 / "failed to fetch") → fixed via local MinIO.** Root cause was **stub S3 credentials** in `.env` (`stub-bucket` / `stub-access-key`) — presign signed a URL locally but the browser PUT to a non-existent AWS bucket 403'd. Added a **MinIO** (S3-compatible) service + bucket-init to `docker-compose.yml` (S3 API `:9100`, console `:9101`, bucket `elite-vet` with download + CORS). Pointed `.env` `S3_*` at it (`S3_ENDPOINT=http://localhost:9100`). Verified end-to-end: `presign 201, PUT 200`. `إضافة مستند` now really uploads (this fixes uploads app-wide, not just expenses). Start with `docker compose up -d`.
- **Reopen a created record → fixed.** Cards/list rows had no click handler. Added `use-expense.ts` (`GET /expenses/:id`); `CreateExpenseSheet` gains an optional `expenseId` prop — when set it fetches the expense and shows the review panel (via `fromExpenseResponse`) instead of the create form. `ExpensesTab` tracks `openExpenseId`; clicking a card/row opens it. Verified E2E: created an expense via API → clicked its card → review panel reopened with the real data + approval path.
- **Card `...` menu + list actions → fixed.** The card `...` is now a real `DropdownMenu` (عرض التفاصيل / حذف الطلب); the card body is a clickable button that opens the review; action chips (رفض/اعتماد) open the review to make the decision. The list gained an الإجراءات column with the same menu and clickable rows. `onDelete` wired to `useExpenseMutations().remove` (with toast).

## Send-review dialog made functional (was all placeholders)

Everything in `send-review-request-dialog.tsx` was UI-only; now it's real:
- **Schema**: added `reviewSubject`, `reviewBody`, `reviewRecipientIds String[]`, `reviewSentAt` to `Expense` (migration `20260713112412_expense_review_request_fields`) + surfaced them in the response select.
- **Server** (`sendForReview`): now accepts `{ recipientIds, subject, body }`, persists them + `status=PENDING_REVIEW` + marks the SENT step, then **best-effort emails** the chosen recipients via `sendEmail()` (resolves their `User.email` server-side; wrapped in try/catch so stub SMTP creds don't break the flow — logs and continues).
- **Dialog**: recipients now come from **real clinic users** (`useClinicUsers` → `GET /users`), not the fake أحمد محمد seeds. Header (requester + code), subject, body, and the attachment list are all derived from the real expense. `قالب البريد` templates now actually rewrite subject/body; `إضافة موظف جديد` navigates to `/services/staff`. Dropped the purely-cosmetic toolbar icons (bold/align/emoji/AI sparkle) and the fake attachment.
- **Client**: `useExpenseMutations.sendReview` + the sheet's `onSend` now pass `{ recipientIds, subject, body }` through.
- **Verified E2E**: create → send-review with a real recipient → read back shows `status=PENDING_REVIEW`, `reviewSubject="موضوع حقيقي"`, `reviewBody="نص الرسالة الحقيقي"`, `reviewRecipientIds=[realUserId]`, `reviewSentAt` set; SENT step = `SENT`. Dialog screenshot confirms real requester/subject/body + real user in the recipient picker.

Note: `EMAIL_USER` in `.env` is a stub, so real email delivery won't happen in dev (same situation S3 had before MinIO) — the send still records everything and doesn't error. Wire real SMTP (or a local mailhog) to actually deliver.

## Disbursement flow + step gating + disbursed receipt

Four fixes to the approval path (`expense-review.ts` mapper, `review-decision-dialog.tsx`, `expense-review-panel.tsx`, server `applyDecision`):
1. **تأكيد الصرف now has a button** — the `DISBURSEMENT` step shows a single green **`صرف المصروف`** button (not the approve/reject pair). `STEP_META.actionable` is now `"approve" | "disburse" | false`; disburse → `DISBURSE_ACTION` (`kind: "disburse"`).
2. **Step ordering enforced** — a step's action buttons only appear after **all prior actionable steps are done** (`priorActionableDone`). So `اعتماد المدير المالي` is not actionable until `مراجعة المدير العام` is approved.
3. **Disburse reuses the decision dialog** with a new **`disburse`** variant — same dialog, header changes to **`تأكيد الصرف`** (green), intro/notes/button = صرف المصروف, check icon. `ReviewDecision` is now `approve | reject | disburse`.
4. **Server**: `applyDecision` handles `disburse` → step `DONE` + expense **`PAID`** (model literal union + `ExpenseDecision` extended). The disbursement step badge reads **`تم الصرف`**.

**Disbursed receipt** (Figma `2987-76797`): when the expense is `PAID`, the review panel's comment box is replaced by a receipt — caption `هذا الإيصال وثيقة رسمية صادرة عن نظام إدارة المصروفات` + a dashed-circle green **`تم الصرف ✓`** stamp.

Verified E2E (headless Chrome + API): full flow create → send → approve manager → approve finance → **disburse → 200, status PAID, disbursement step DONE**; the `صرف المصروف` button and the `تأكيد الصرف` dialog render; the disbursed receipt replaces the comment section.

## Changelog

- **2026-07-13** — Added **طلبات الاعتمادات** (approval requests): the old تنبيهات المخزون button was moved to the left group beside إنشاء مصروف, relabeled, and repurposed to open a side sheet (Figma `2928-42467`) listing the requests **awaiting my action** — i.e. expenses where the current user is a review-request recipient (`reviewRecipientIds` contains their id) and the request is still in-flight (status PENDING_REVIEW/APPROVED, not paid/rejected/canceled). New `GET /expenses/approvals` + `expensesDao.listPendingApprovals` + `usePendingApprovals`. The button shows a count badge; each card has the labeled path stepper, a تتبع حالة الطلب link (opens the review panel), and رفض/قبول chips that reuse the decision dialog. Verified E2E (only my records appear, count badge correct, قبول opens the signature dialog). 6 DAO tests still pass.
- **2026-07-13** — List action buttons are now **step-aware** instead of status-based: `cardActions` reads the approval steps and shows اعتماد+رفض while the current pending step is مراجعة المدير العام **or** اعتماد المدير المالي (fixes the bug where اعتماد vanished after manager approval even though finance approval was still pending), صرف المصروف at the disbursement step, and nothing once paid/rejected/canceled/not-yet-sent. The tab now also handles the `disburse` decision from the list. Verified E2E across the full flow (sent→both, after-manager→both, after-finance→صرف, after-disburse→none).
- **2026-07-13** — More small fixes: (a) the table المسار mini-stepper now reads **right→left** (إرسال node on the right → الدفع on the left) by reversing the steps in the RTL cell; (b) the **حذف** action in the table/card kebab is now context-aware like inside the panel — **حذف الطلب** (hard delete) for a draft, **إلغاء الطلب** (cancel with a required reason) once sent, and **hidden** for terminal records (PAID/REJECTED/CANCELED). Added `rawStatus` to the list view-model so the view can tell PAID from APPROVED. Verified E2E (draft→delete, sent→cancel dialog with required reason, PAID→no destructive item).
- **2026-07-13** — Small fixes: (a) تعديل الطلب is hidden once the expense is disbursed (PAID) — a completed record can't be edited; (b) the expenses toolbar RTL was corrected to match خطط الرعاية — search on the far right, utility buttons flowing right→left, and the primary "إنشاء مصروف" on the far left (was mirrored before). Verified by screenshot comparison.
- **2026-07-13** — Rejection summary is now the single canonical rejected-view: (a) it opens after **any** reject — from the list (tab sets `rejectedId`) and from inside the sheet (new `onRejected` handoff closes the sheet and opens the dialog); (b) it's reachable **anytime** by clicking a **مرفوض** status pill in the table, the card, or the review panel (`onOpenRejection`/`onViewRejection`). The old in-sheet `ExpenseRejectionSummary` **panel** was removed (dialog is the single source). Also wired the reject decision dialog's notes → `rejectionReason` so the summary shows the real reason instead of "لم يُذكر سبب الرفض". Verified E2E (list reject shows reason; status-pill reopens it without the sheet).
- **2026-07-13** — List-actions + panel-footer pass (6 fixes): (1) رفض/اعتماد chips on the table/grid now open the **decision dialog directly** (no side sheet) — the tab fetches the expense, resolves the current actionable step via `findCurrentActionableStep`, and shows `ReviewDecisionDialog`; chips are hidden until the request is **sent for review** (`PENDING_REVIEW`/`APPROVED` only), so drafts show none. (2) Cancel is blocked once the request is terminal (تم الصرف/مرفوض/ملغى). (3) Removed the redundant الغاء (close) button from the panel footer. (4) طباعة/تنزيل PDF now open a clean self-contained **print receipt** window (`printExpenseReceipt`) instead of printing the whole page (which was blank). (5) مشاركة/طباعة/تنزيل PDF show **only after تم الصرف** (PAID). (6) After a reject from the list, the **rejection-summary dialog** (Figma `2973-56432`, new `ExpenseRejectionSummaryDialog`) appears. All verified E2E. Known gap: the reject decision dialog's notes field isn't yet persisted as `rejectionReason` (summary shows "لم يُذكر سبب الرفض").
- **2026-07-13** — Review-panel lifecycle pass (10 fixes): (1) header pill shows the **real** status (مسودة/قيد المراجعة/معتمد/مرفوض/تم الصرف/ملغى) via `REQUEST_STATUS_META` instead of a hardcoded "قيد المراجعة"; (2) مسار الموافقات step badges highlight blue for every completed step (`state !== "pending"`), not only the created step; (3) "أضف مستندًا أو رابطًا" is disabled once the request is sent for review; (4) اعتماد/رفض swapped so **اعتماد is on the right**, رفض on the left; (6) "إضافة توقيع" now stamps the **current user's name** and the confirm button is gated on it (توقيع مطلوب) — persisted as `signatureName`; (7) طباعة and تنزيل PDF call `window.print()` on a formatted receipt; (8) حذف الطلب is hidden after send; (9) after send the destructive action becomes **إلغاء الطلب** → status `CANCELED` with a required reason (new `CancelExpenseRequestDialog`, `cancelReason`, `POST /expenses/:id/cancel`), shown as a cancel-reason box in the panel; (10) تعديل الطلب repopulates the form and, on re-save of an already-sent request, **resets the approval path** from the start (server `update` clears steps → `DRAFT`). New schema: `ExpenseStatus.CANCELED` + `cancelReason` + `signatureName` (migration `20260713124907_expense_cancel_and_signature`). Verified E2E (draft vs sent panel states, decision-dialog signature gating) + 6 DAO tests pass, no migration drift.
- **2026-07-13** — Completed records (PAID/REJECTED/CANCELED) hide رفض/اعتماد chips in the grid/table via `cardActions(rawStatus)`.
- **2026-07-13** — Records table (Figma `2984-61708`) rebuilt and made the **default** view (was grid): 10 columns (اسم المصروف/المصروف · مقدم الطلب · الفئة · القسم · الفرع · المبلغ · الحالة · المسار · التاريخ · الإجراءات) + a select checkbox, status pill with a colored dot, an inline المسار mini-stepper, and an actions column (kebab: عرض/تعديل/تنزيل/حذف + رفض/اعتماد chips). Extracted the shared `ExpenseMiniStepper` (used by both card and table; `showLabels` toggle) and added `branch` to `expenseListSelect` → `branchLabel`. Typecheck clean; verified E2E (list is default, 9 rows, stepper direction correct).
- **2026-07-13** — Disbursement: `صرف المصروف` button on the DISBURSEMENT step, step-order gating (finance after manager), `تأكيد الصرف` dialog variant, server disburse→PAID, and the `تم الصرف` receipt replacing the comment box when paid (Figma `2987-76797`). Verified E2E.
- **2026-07-13** — Send-review dialog made fully functional: real clinic-user recipients, real header/subject/body/attachments, working قالب البريد templates + إضافة موظف link, cosmetic icons dropped; server persists subject/body/recipients + best-effort email. Verified E2E.
- **2026-07-13** — UX fixes: local MinIO for real file uploads (was stub S3 → 403), reopen a record by clicking its card/row (fetches `GET /expenses/:id` → review panel), and working card `...` menu + list actions column with delete. All verified E2E via headless Chrome.
- **2026-07-13** — Testability pass: dev login seed (`db:seed:dev`), logged-in E2E verified (headless Chrome), مقدم الطلب wired to all clinic users (default = me), real file upload on المستندات والروابط, and 6 passing DAO tests (`vitest`). Typecheck clean.
- **2026-07-13** — Backend Phases 4–5: rewired the expenses UI to the real API through view-model mappers (`fromExpenseListItem`/`fromExpenseResponse`/`toCreateExpensePayload`); dropped all seed data + dead exports. Verified: typecheck clean, no migration drift, `/api/expenses` returns 401 (route mounted), modules transform. Deferred: zodResolver form conversion, real branch/supplier ids, DAO tests, logged-in E2E.
- **2026-07-13** — Backend Phases 1–3 implemented: Prisma models + migration, `src/server/expenses/` module (registered), and client hooks. All typecheck clean. Frontend rewire (Phase 4) pending.
- **2026-07-12** — Added the **Backend Wiring Plan** (Prisma model + migration → `src/server/expenses/` module → client hooks → UI rewire → verify), grounded in the `discounts/` reference module. Includes enums/models, phased steps, open questions, and a commit sequence.
- **2026-07-12** — Pass 8: after رفض, the sheet shows the rejection summary panel (Figma `2973-56076`) — hero + illustration, order summary, details (status مرفوضة), سبب الرفض, footer. Verified by screenshot.
- **2026-07-12** — Pass 7: added the حذف طلب مصروف confirmation dialog (Figma `2987-69379`) with the full details + النتائج المترتبة consequences box, opened from a new `حذف الطلب` button in the review panel footer. Verified by screenshot.
- **2026-07-12** — Pass 6b: reject variant of the decision dialog (`ReviewDecisionDialog`, approve/reject); fixed the footer (primary button on the right via footer `dir="rtl"`) and the switch direction. Verified by screenshot.
- **2026-07-12** — Pass 6: added the اعتماد confirmation dialog (Figma `2963-841834`) opened from approve chips, plus the success toast with تراجع (Figma `2963-837906`). LTR-flow dialog handled via `dir="ltr"` inner wrapper; verified centered & correct by screenshot.
- **2026-07-12** — Card RTL fix: the card grid was fully flipped because the Figma card is LTR-flow with right alignment, not RTL — fixed with `dir="ltr"` on the card root. Added Rule 0 to AGENTS.md RTL rules.
- **2026-07-12** — Pass 5: replaced timeline icons with exact HugeIcons extracted from Figma; added the card-grid + list views for expense records with an العرض toggle (Figma `2928-38741`). Verified with screenshots.
- **2026-07-12** — Pass 4b: fixed the send-request dialog's duplicate close-X (rotated plus → expand icon) and broken RTL layout (grid/flex conflict; toolbar/footer alignment) per Figma `2963-840581`. Verified with real headless-Chrome screenshots of the dialog and review panel.
- **2026-07-12** — Pass 4: replaced the `تم الارسال` badge with an `إرسال للمراجعة` button opening a send-request dialog (Figma `2963-837922`/`2963-840131`/`2984-57466`); approval chips gated until sent; success toast on send. Typecheck/format clean; verified via Vite transform.
- **2026-07-12** — Pass 3: after مراجعة الطلب the sheet saves the record and switches to the approval-chain review view (Figma `2928-43993`) — summary, documents, مسار الموافقات timeline, comment box, footer. Typecheck/format clean; verified via Vite transform.
- **2026-07-12** — Pass 2: built the create-expense side sheet from 5 Figma states, mirroring the خطط الرعاية sheet. Typecheck/format clean; modules verified via Vite transform.
- **2026-07-12** — Swapped the empty-state icon for the exact Figma wallet SVG (node `2928-39226`), saved as `public/illustrations/expenses-empty.svg` and loaded via `<img>` to match the خطط الرعاية convention. Documented RTL/reference conventions; confirmed all components inherit RTL from `<html dir>` (no per-component `dir` needed except the empty state, matching the reference). Verified: typecheck clean, empty-state + tab modules transform through Vite, SVG serves as `image/svg+xml`.
- **2026-07-12** — Pass 1 implemented and verified via typecheck + Vite transform. Tab, stats, toolbar, empty state built per Figma `2928-39100`.
- **2026-07-12** — Initial workflow drafted. Scope: frontend-only, tab appended last. Plan documented; implementation starting.
