# DESIGN SYSTEM CONTRACT — Accounting Module

> **Status:** DISCOVERY / awaiting approval. This is the output of STEP 0 of the
> Accounting Module kickoff. It is the **law for UI** exactly as
> `BRD_Accounting_Module.md` is the **law for logic and data**, and
> `IMPLEMENTATION_PHASES.md` is the **law for build order**.
>
> **Rule of thumb:** Reuse before build. Never import a new UI kit. Never hardcode
> colors, spacing, or fonts — design tokens only. Approved gap components are built
> **once** under the design-system folders, then reused.
>
> **Phase discipline:** every implementation commit references its phase task ID
> `[Px.n]` from `IMPLEMENTATION_PHASES.md` plus the BRD sections it satisfies (e.g.
> `feat(accounting): gl_entry table [P2.1] (BRD §5.1)`). Phases run in order; the
> ledger-safety invariant (drafts never touch `gl_entry`/`payment_ledger_entry`;
> submitted vouchers balance; cancels only append) holds in every phase.

---

## 1. Stack Summary & Repo Conventions

### 1.1 Stack (verified)

| Concern | Choice | Notes |
|---|---|---|
| Framework | TanStack Start (React 19) | File-based routing in `src/routes/` |
| Server | Nitro (SSR) + **Elysia** mounted at `/api` | `src/routes/api.$.ts` → `app.fetch()` |
| DB | PostgreSQL via **Prisma** + Neon adapter | Singleton `src/lib/db.ts`; generated client in `generated/prisma/` |
| Validation (API) | **TypeBox** (`elysia`'s `t`) + prismabox enums | `generated/prismabox/*` |
| Validation (forms) | **Zod v4** + `@hookform/resolvers` | schema lives in `[resource].type.ts` |
| Auth | **better-auth** (email/pass + Google + emailOTP) | session carries `activeClinicId`, `role`, `permissions`, `currencyCode` |
| UI kit | **shadcn** `radix-nova` style + `radix-ui` + **Tabler** icons | `components.json`, `"rtl": true` |
| CSS | **Tailwind CSS 4 (CSS-first, NO `tailwind.config`)** | tokens in `src/styles.css` |
| i18n | **i18next**, cookie-driven locale, AR (default, RTL) + EN | `src/hooks/use-i18n.ts` |
| API client | **Elysia Treaty** (`@elysiajs/eden`) | `src/lib/api.ts`, typed on `App` |
| State | **TanStack Query** + **Zustand** (persist) | |
| Tests | **vitest**, serial, hit **real Postgres** | `src/**/*.test.ts`, Arabic `it()` names |
| Package manager | **Bun** | `bun dev`, `bun test`, `bun run typecheck` |
| Linter/formatter | **Biome** (tabs, 95 cols) | `bun run format` |

### 1.2 Backend resource pattern (rigid, copy per resource)

Each resource is `src/server/[resource]/` with four files, registered by one
`.use(xController)` line in `src/server/index.ts`:

| File | Contents |
|---|---|
| `[resource].controller.ts` | Elysia sub-app: `prefix`, `tags`, `.use(model)`, inline `requireClinic` macro, route handlers |
| `[resource].model.ts` | `new Elysia({ name: "model/x" }).model({ "x.create": t.Object({...}) })` using TypeBox + prismabox enums + `__nullable__` |
| `[resource].dao.ts` | Prisma queries only, plain object of async methods, every `where` scoped by `clinicId`, `const xSelect = {...} satisfies Prisma.XSelect` |
| `[resource].type.ts` | `Prisma.XGetPayload<{ select }>` response types, `Pick`/`Partial` DAO input types, Zod schema + `z.infer` form types |

**`requireClinic` macro** — copy-pasted verbatim into every clinic-scoped controller
(there is no shared helper; ~61 controllers duplicate it). It reads the better-auth
session, returns `status(401, { message: "غير مصرح" })` if no `activeClinicId`, and
injects `{ clinicId, userId }` into handler context.

**Error convention (`src/server/app.ts` `onError`):** user-facing failures are thrown
as plain `Error` **with an Arabic message** (`/[؀-ۿ]/` gate) or returned as
`status(4xx, { message: "عربي" })`. Prisma errors are always suppressed to a generic
500. Never leak raw errors.

**Human codes:** `generateUniqueCode({ prefix, isUnique })` from `@/lib/generate-code`
(e.g. `INV`, `SALE`, `EXP`, `PO`). Never inline random-code logic.

### 1.3 DB conventions (DECISIVE mapping fact)

- Models `PascalCase`; **columns are camelCase** (Prisma default — there are **zero**
  `@map()` field mappings); **tables are snake_case** via `@@map("...")` on every model.
- IDs: `id String @id @default(cuid())` uniformly. No int/UUID PKs.
- Money: `Decimal @db.Decimal(10, 2)`; rates `Decimal(5,2)`; unit cost / valuation
  `Decimal(12,4)`. Not integer cents, not a Money type. `currencyCode String @default("SAR")`.
- Multi-tenancy: `clinicId String` + `@@index([clinicId])` on every tenant model;
  `branchId String?` (optional, `onDelete: SetNull`) where branch-scoped. Isolation is
  enforced in application code, not RLS.
- Timestamps: `createdAt @default(now())` + `updatedAt @updatedAt` (ledger/read-only
  models omit `updatedAt`).
- Enums: `PascalCase` name, `UPPER_SNAKE` members. Imported from
  `@/generated/prisma/enums` (TS) / `@/generated/prismabox/*` (TypeBox).
- Migrations: `prisma/migrations/<YYYYMMDDHHMMSS>_<snake_name>/`. Use
  `bunx prisma migrate dev --name ...` (NEVER `db:push` to a shared DB — see AGENTS.md).

> **BRD naming → repo naming:** the BRD writes canonical `snake_case` columns
> (`posting_date`, `debit_in_account_currency`). **In this repo those become
> camelCase columns** (`postingDate`, `debitInAccountCurrency`) with a snake_case
> `@@map` table name (`@@map("gl_entry")`). The BRD field tables remain the semantic
> source of truth; only the casing is translated. Full map in §6.
>
> The phases file (line 10) mandates **DB snake_case** and **voucher naming series
> `{prefix}-{YYYY}-{#####}` per company** (`JV-2026-00001`). Reconciliation with the
> repo: snake_case applies to `@@map` **table** names (already the repo idiom);
> **columns stay camelCase** per the standing rule "follow the repo, record the
> mapping." The sequential per-year **naming series is a new requirement** — the repo's
> `generateUniqueCode` produces random suffixes (`INV-A3F9`), not gapless sequences, so
> P0.1's `naming_series` counter table (BRD Appendix A) must be built; do NOT reuse
> `generateUniqueCode` for voucher numbers. See conflict C7.

### 1.4 Frontend conventions

- Features in `src/features/[feature]/{components,hooks,stores,utils,data,types}/`.
- Data hooks: `useQuery<TResponse>({ queryKey, queryFn, staleTime })` returning a
  **named object** (`{ invoices, isLoading, refetch }`), never a tuple. Response types
  imported from `src/server/[resource]/[resource].type.ts`, never redeclared.
- Mutation hooks: `useMutation` + `onSuccess: invalidate`, public wrappers call
  `toast.promise(mutateAsync(...), { loading, success, error })`. Components `catch {}`
  (the hook owns the toast). Never call `toast.success/error` manually.
- Forms: `react-hook-form` + `zodResolver`; `register()` for native inputs,
  `<Controller>` for Radix/custom; wrap in `<Field data-invalid>` + `<FieldError>`.
- `@/*` → `src/*`. Prefer `@/features/...` over deep relative imports.

---

## 2. Design Tokens (`src/styles.css`)

**No `tailwind.config` exists.** Tokens are CSS-first: `:root` / `.dark` variable
blocks + one `@theme inline` mapping them to Tailwind utilities. **Consume tokens via
Tailwind classes only** (`bg-primary`, `text-muted-foreground`, `border-border`).

- **Brand:** `--primary: #4f6ae0` (indigo). `--primary-foreground` near-white.
- **Surfaces:** `--background`, `--card`, `--popover` (dialogs/sheets/popovers all use
  `bg-popover`). Surfaces separated by `ring-1 ring-foreground/10` — **almost no
  box-shadows**.
- **Neutrals:** `--secondary`, `--muted` / `--muted-foreground`, `--accent`, `--border`,
  `--input`, `--ring`. All `oklch`, with `.dark` overrides.
- **Status:** `--destructive` exists. **There is NO `--success` / `--warning` / `--info`
  token.** Sonner hardcodes emerald/blue/amber/red. **Accounting status colors (posted /
  draft / overdue / cancelled) must come from `--chart-1..8` or agreed semantic classes —
  do NOT invent new hex.** (See gap G8.)
- **Charts:** `--chart-1..8` (8-slot palette, light+dark).
- **Radius:** `--radius: 4px` and **every** step (`sm`…`4xl`) is pinned to 4px. Use
  `rounded-md`/`rounded-sm` (all render 4px); `rounded-full` stays circular.
- **Fonts:** `--font-sans` / `--font-heading` = `'IBM Plex Sans Arabic', 'Inter
  Variable', sans-serif`. `font-heading` used on Dialog/Sheet titles.
- **Dark mode:** class-based (`@custom-variant dark (&:is(.dark *))`).

---

## 3. Component Inventory

Import primitives from `@/components/ui/*`, composites from `@/components/common/*`.

### 3.1 `src/components/ui/` (primitives)

| Component | Path | Key props / variants | When to use |
|---|---|---|---|
| Button | `ui/button` | `variant`: default·outline·secondary·ghost·destructive·link; `size`: default(h10)·xs·sm·lg·icon·icon-xs·icon-sm·icon-lg; `asChild` | all actions; `buttonVariants` exported |
| Input | `ui/input` | native wrapper, h-10, `aria-invalid` ring | text/number fields (use `register`) |
| Textarea | `ui/textarea` | native wrapper | remarks/notes |
| Label | `ui/label` | radix Label | via Field |
| Select | `ui/select` | `SelectTrigger size`: sm·default; pass `dir="rtl"` on root | enum pickers (use `Controller`) |
| Combobox | `ui/combobox` | custom (Popover-based); `value`, `onValueChange`, `multiple`; Chips parts | account/party/item pickers, multi-select |
| Calendar | `ui/calendar` | react-day-picker; `mode`, `selected`, `onSelect`, `locale`; RTL chevrons built in | raw date/range; prefer DateField |
| Checkbox | `ui/checkbox` | radix, size-4 | booleans in grids/filters |
| Switch | `ui/switch` | `size`: sm·default | settings toggles (use `Controller`) |
| Radio Group | `ui/radio-group` | `RadioGroup` + `RadioGroupItem` | small exclusive choices |
| Dialog | `ui/dialog` | `DialogContent` is **grid**, `showCloseButton`(true), `max-w-sm`; widen via className + `max-h-[..vh]` + `overflow-y-auto` body | confirmations, payment/allocation modals |
| Sheet | `ui/sheet` | `side`(right default), `showCloseButton`, `showOverlay`; Title uses `font-heading` | create/edit forms (`side="left" dir="rtl"`) |
| Table | `ui/table` | primitives w/ logical padding + auto x-scroll | raw tables; usually via TableDataView |
| Tabs | `ui/tabs` | `TabsList variant`: default(pill)·line(underline) | invoice sub-sections, report toggles |
| Badge | `ui/badge` | `variant`: default·primary·sub·secondary·destructive·outline·ghost·link (⚠ `sub`/`secondary` carry hardcoded hex) | status pills |
| Field | `ui/field` | `Field`(orientation), `FieldError({errors})`, `FieldContent/Label/Title/Description/Set/Group` | RHF field scaffolding |
| Sonner | `ui/sonner` | pre-themed `Toaster`, `dir="rtl"` | via `toast.promise` |
| Skeleton | `ui/skeleton` | `bg-muted animate-pulse` | loading (TableDataView auto-renders) |
| Spinner | `ui/spinner` | svg | inline loaders |
| Pagination | `ui/pagination` | shadcn nav/link (⚠ superseded by common/table-pagination) | rarely direct |
| Breadcrumb | `ui/breadcrumb` | full set, RTL separator flip | header trails |
| Popover | `ui/popover` | `align`, `sideOffset`; Header/Title/Description | date pickers, filter pops |
| Dropdown Menu | `ui/dropdown-menu` | full set, `Item variant`: default·destructive; pass `dir="rtl"` | row actions, view menus |
| Tooltip | `ui/tooltip` | `TooltipProvider(delay=0)` | stat/info hints |
| Separator | `ui/separator` | `orientation`, `decorative` | toolbar/section dividers |
| Scroll Area | `ui/scroll-area` | custom thin thumb | long panes |
| Stepper | `ui/stepper` | context wizard; `Stepper`, `StepperNav/Item/Trigger/Indicator/Panel/Content`; `useStepper` | multi-step voucher wizards |
| Card | `ui/card` | `size`: default·sm; Header/Title/Content/Footer | report cards, summaries |
| Avatar | `ui/avatar` | `Avatar/Image/Fallback/Badge/Group` | party chips |
| Collapsible | `ui/collapsible` | radix passthrough | **tree rows (gap G1)** |
| Input Group | `ui/input-group` | `InputGroupAddon align`: inline-start/end/block-*; `InputGroupInput/Button/Text` | currency/unit suffixes, search |
| Toggle / Toggle Group | `ui/toggle`, `ui/toggle-group` | `variant`/`size`, shared `toggleVariants` | segmented controls |
| Progress | `ui/progress` | `value` | job progress (PCV/reconcile) |
| File Upload | `ui/file-upload` | Dropzone/List/Item/Preview/Progress/Delete | CoA/statement CSV import |
| Phone Input | `ui/phone-input` | `react-phone-number-input` | party contacts |
| Kbd | `ui/kbd` | `Kbd`, `KbdGroup` | shortcut hints |
| Sidebar | `ui/sidebar` | full shadcn sidebar; `SidebarMenuSub*` | app shell (+ tree reference) |
| Chart | `ui/chart` + `chart-area-default`/`chart-bar-multiple`/`chart-pie-donut` | Recharts wrappers, `ChartConfig` | report visuals |

### 3.2 `src/components/common/` (composites — the "list page kit")

| Component | Path | Key props | When to use |
|---|---|---|---|
| **TableDataView** | `common/table-data-view` | `table`, `columns`, `isPending`, `onRowClick`, `emptyState:{title,description,icon,action}`, `renderAfterRow`, `keepHeaderOnEmpty` | **primary list surface** — sortable headers, skeletons, empty state, embedded pagination |
| **TablePagination** | `common/table-pagination` | `page`, `pageCount`, `totalRows`, `fromRow`, `toRow`, `onPageChange`, `pageSize`, `pageSizeOptions` | standalone (non-TanStack) lists; auto-used by TableDataView |
| **TableToolbar** | `common/table-toolbar` | `searchValue`, `onSearchChange`, `searchPlaceholder`, `showFilter/Help/Export/View`, `leftExtra`, `actions` | list-page toolbar |
| **NoResultsTableView** | `common/table-no-results` | — (uses `t("table.noResults")`) | filtered-empty fallback |
| **DateField** | `common/date-field` | `value:"yyyy-MM-dd"`, `onChange`, `invalid`, `disabled` | **canonical date input** (Popover+Calendar, TZ-neutral string) |
| **TimeSelect** | `common/time-select` | `value:number(min)`, `onValueChange`, `format` | time-of-day |
| **Stats** | `common/stats` | `stats: StatItem[]`, `variant`: default·inventory·compact | KPI card row atop list/report screens |
| **FiltersMenu** | `common/filters-menu` | `groups: FilterGroup[]` | multi-select filter dropdown |
| **ViewOptionsMenu** | `common/view-options-menu` | `options`, `view`, `onViewChange` | grid/list + sort toggle |
| **Container / ContainerRow** | `common/container` | `{title,action,children}` / row | settings-style stacked rows |
| **FieldLabel** | `common/field-label` | `{required, action}` (adds "مطلوب" pill) | dialog form labels |
| Toast helpers | `common/{success-toast,undo-toast,feature-locked-toast}` | `toast.custom` wrappers | success/undo/locked feedback |
| `HEADER_ICON_BUTTON` | `common/header-icon-button` | class-string constants | feature `*-header.tsx` |

---

## 4. Screen Recipes (use the real components above)

### 4.0 Shell (never re-implemented by a page)

Authenticated pages live under `src/routes/_pathless-layout/`. The layout
(`_pathless-layout.tsx`) renders the sidebar + a fixed h-10 header with portal slots
(`#page-header-slot`, `#page-header-center-slot`) and the `<Outlet/>` (with a table
`PageSkeleton` while loading). **Pages do NOT render their own top header/breadcrumb** —
they inject tabs/title into the header slot via `createPortal` (see `finance-header.tsx`).
Locale/`dir` are set on `<html>` in `__root.tsx` from `useI18n().lang`.

### 4.1 List screen (= ledger list, invoice list, CoA importer preview, AR/AP)

```
Stats (variant="inventory")
<hr className="my-2" />
TableToolbar   ← search + FiltersMenu + actions:<Button><IconPlus/>…</Button>
<hr className="my-2" />
{ empty ? <FeatureEmpty/> : <TableDataView table={tanstack} columns=… isPending=… onRowClick=… emptyState=…/> }
+ create/edit Sheet and confirm Dialogs mounted at the bottom, driven by useState<Response|null> targets
```

Two allowed table conventions: **TanStack + `TableDataView`** (default — sorting, global
filter, pagination, skeleton, empty built in — model on
`features/services/owners/components/owners-table.tsx`) or **raw `ui/table`** for small
fully-custom tables (model on
`features/finance/discounts/components/discounts-table.tsx`). Prefer TableDataView.

> **Invoice-list carve-out (owner-approved, P5-UI-fix — do not re-decide per phase.)**
> Invoice-type screens are the twin of the legacy invoices table
> (`features/finance/invoices/components/invoices-table.tsx`) in **anatomy and behavior**:
> raw `ui/table` with `table-fixed` + proportional widths, a leading selection column, 12px
> semibold muted headers, `py-2` rows with a hover wash, skeleton rows while loading, an
> in-table empty row, and an actions column pairing a contextual inline button with the ⋯
> menu. Reference implementation:
> `features/accounting/sales-invoices/components/sales-invoices-table.tsx`.
> **Purchase Invoice (P6) reuses that file's anatomy rather than re-deriving it.**
>
> Twin means *structure and behavior*, **not** pixels: the legacy table hardcodes hex
> (`#08090A`, `#F9F9F9`, `#5C5C5E`, …) and arbitrary spacing (`pe-4.75`, `ps-2.75`). That
> is pre-existing debt and is **not** copied forward — standing rule #1 (tokens only) wins,
> so the accounting twin resolves every colour from a token. Converging the legacy table
> onto tokens is on the §10.5 cleanup list.
>
> Masters and vouchers (CoA, fiscal years, cost centers, JE, payment terms, currency
> exchange, parties…) keep the list-row recipe above — they are **not** in this carve-out.
>
> Note the recipe already mandates `FiltersMenu` for filtering. A per-screen chip/pill row
> is **not** an allowed third pattern (P5.7 shipped one; P5-UI-fix removed it). If a screen
> needs status filtering, it goes in the التصفية menu.

### 4.2 Form screen (= JE, Sales/Purchase Invoice, Payment Entry, masters)

`Sheet side="left" dir="rtl"` with a scrollable body + pinned footer:

```tsx
<Sheet open onOpenChange>
  <SheetContent side="left" dir="rtl" className="w-full gap-0 p-0 sm:max-w-xl!">
    <form onSubmit={handleSubmit(onSubmit)} className="flex min-h-0 flex-1 flex-col">
      <div className="flex-1 space-y-5 overflow-y-auto p-4"> … Field blocks … </div>
      <div className="border-t px-4 py-2"> cancel + submit </div>
    </form>
  </SheetContent>
</Sheet>
```

- `useForm<Input, unknown, Output>({ resolver: zodResolver(schema), defaultValues })`;
  `reset()` in `useEffect([open, record])` to populate edit vs create.
- `register()` for `Input`/`Textarea`/number; `<Controller>` for `Select`(+`dir="rtl"`),
  `Switch`, `Combobox`, `DateField`, `RadioGroup`.
- Every field: `<Field data-invalid={!!errors.x}>` + label (+ required `*`) + input
  `aria-invalid` + `<FieldError errors={[errors.x]} />`.
- Submit calls a mutation-hook method (which owns `toast.promise`); `disabled={isSaving}`
  on every input + buttons; submit also `disabled={!isValid}`.
- Big multi-step vouchers → wrap the body in `ui/stepper` (model on
  `features/services/training/components/sheet-stepper.tsx`).
- Confirmations/destructive → small `Dialog` (model on
  `features/appointments/components/invoice/payment-modal.tsx`).

### 4.3 Report screen (= Trial Balance, P&L, GL, ageing)

Header tabs via portal (`finance-header.tsx` pattern) → `Stats` row → filter bar
(`Popover`/`DateField`/`Select`/`Combobox`) → data. Tabular reports use `TableDataView`
(with `renderAfterRow` for drill-down, see gap G5); chart summaries use `ui/chart*`
inside `Card`. Model on `routes/_pathless-layout/management/finance.tsx` +
`features/dashboard/components/revenue-card.tsx`.

### 4.4 Tree screen (= Chart of Accounts, Cost Centers) — NEW pattern (gap G1)

Recursive `ui/collapsible` rows with logical indentation (`ps-*` per depth),
`IconChevronLeft` that gets `rtl:rotate-180`, group vs leaf styling, inline row actions
via `DropdownMenu dir="rtl"`. Compose over the sidebar `SidebarMenuSub*` visual language.
No new library.

---

## 5. GAP LIST — BRD UI needs with no existing component

Each gap is built **once** in the design system (`src/components/common/` for
cross-feature, or `src/features/accounting/components/` for accounting-only) using only
existing tokens + primitives. No new UI kit, no restyle.

| # | Gap | BRD screens | Build from |
|---|---|---|---|
| **G1** | **Chart-of-Accounts / Cost-Center tree** | §4.3, §4.4 | Recursive `ui/collapsible` + logical `ps-*` indent + `IconChevron*` (`rtl:rotate-180`) + `Badge` for `account_type`/`root_type` + row `DropdownMenu`. Selection/expand state via a small Zustand store or TanStack Table expansion. Reference: `ui/sidebar` `SidebarMenuSub*`. |
| **G2** | **Editable journal-entry grid** (add/remove rows, per-cell debit/credit/account/party, running totals, balance check) | §7.1 JE, §7.4 PE references, §7.2/7.3 item & tax grids | Raw `ui/table` + `useFieldArray` (RHF) + `Combobox` (account/party), `Input` (`register`) for amounts, `DateField`, an "add row" `Button`, a sticky footer totals row with a live `Σdebit − Σcredit` badge. No spreadsheet lib. |
| **G3** | **Invoice item grid** (item, qty, rate, discount, tax template, amount; live totals) | §7.2, §7.3, §8 calculator | Same as G2 pattern; totals/tax computed by the shared calculator (§8) and shown read-only in a `Card` summary beside the grid. |
| **G4** | **Two-pane payment / bank reconciliation** (payments left, invoices right, allocation rows) | §10, §14.2 | Flex/grid two-column layout, each column a `TableDataView` (or `ScrollArea` + raw table) with `Checkbox` selection; a middle/bottom "allocation" strip with allocated-amount `Input`s + a difference/EGL `Combobox`. No resizable-pane primitive exists — fixed 2-col grid. |
| **G5** | **Statement report with drill-down** (GL/TB/ageing expandable rows) | §18 | `TableDataView` + TanStack `getExpandedRowModel` + `renderAfterRow` to inject child rows; indent via `ps-*`; opening/total/closing rows styled with `bg-muted`. |
| **G6** | **Status ribbon / lifecycle bar** (Draft→Submitted→Cancelled, invoice statuses) | AR-1, §7.2 statuses | `Badge` (mapped variant per status) + optional `ui/stepper` in read-only mode for the docstatus lifecycle. Status→variant map defined once (see G8). |
| **G7** | **PageHeader (accounting)** | all screens | No shared PageHeader exists; follow `finance-header.tsx`: `createPortal` into `#page-header-slot`, compose `Breadcrumb` + `Tabs`(line) + `Button` using `HEADER_ICON_BUTTON` constants. |
| **G8** | **Semantic status color map** | statuses everywhere | No `--success/--warning/--info` tokens. Define ONE `accountingStatus.ts` mapping each status → an existing `Badge variant` and/or `--chart-*`/`text-emerald-*`-style class (matching Sonner's existing hardcoded status palette). Never scatter ad-hoc hex. |
| **G9** | **Standalone EmptyState** | empty ledgers/lists | Only exists inline in `TableDataView.emptyState`. For non-table empties, lift that markup into `common/empty-state.tsx` (icon-in-circle + title + description + CTA `Button`), mirroring `discounts-empty.tsx`. |
| **G10** | **Date-range picker** | report filters, ageing | No range wrapper exists. Compose `Popover` + `Calendar mode="range"` into `common/date-range-field.tsx`, mirroring `common/date-field.tsx`'s string-value contract. |
| **G11** | **CSV/XLSX import + validation preview** | §4.3.5 CoA importer, §14.1 bank import | `ui/file-upload` (dropzone) → parse client-side → preview in `TableDataView` with per-row error `Badge`s → confirm `Button`. Reuse existing bulk-parse test patterns. |

**Not a gap (reuse as-is):** Button, Input, Select, Combobox, Checkbox, Switch, Dialog,
Sheet, Tabs, Badge, Field, Toast, Skeleton, Pagination, Toolbar, Stats, Breadcrumb,
Popover, DropdownMenu, Tooltip, Separator, ScrollArea, Stepper, Card, Progress,
FileUpload, Chart, DateField, TableDataView.

---

## 6. BRD → Repo Naming Map (casing + entity)

- **Columns:** BRD `snake_case` → repo **camelCase** Prisma fields (`posting_date` →
  `postingDate`, `is_cancelled` → `isCancelled`, `debit_in_account_currency` →
  `debitInAccountCurrency`).
- **Tables:** keep BRD `snake_case` as `@@map` only (`@@map("gl_entry")`,
  `@@map("payment_ledger_entry")`, `@@map("journal_entry")`).
- **IDs:** BRD "PK / name" → `id String @id @default(cuid())` (+ optional `code @unique`
  via `generateUniqueCode`).
- **Money:** BRD `decimal(21,9)` → decide once: accounting ledger needs more precision
  than the repo's `Decimal(10,2)`. **Recommendation:** use `@db.Decimal(21, 9)` for GL/PLE
  amount columns (BRD NFR-2) while operational docs keep `Decimal(10,2)`. Flagged for
  approval (§7 conflict C2).
- **"company" (BRD multi-company):** the repo's tenant is **`clinicId`** (+ optional
  `branchId`). Map BRD `company` → `clinicId`. Record this mapping; do not introduce a
  separate Company entity unless approved.
- **"party" (Customer/Supplier/Employee):** repo has `Owner` (pet owner = customer-ish),
  `Supplier`, `Staff`. BRD party model is polymorphic (`party_type` + `party`).
  Integration strategy pending (conflict C3).
- **Existing entities that overlap** (do NOT silently duplicate): `Invoice`
  (appointment/lab-bound billing), `Sale`/`SaleItem` (POS), `Expense` (de-facto A/P
  roll-up, idempotent `@@unique([source, sourceId])`), `Supplier`, `PurchaseOrder`,
  `Discount`, `StockLedgerEntry` (the one existing immutable ledger — a good structural
  reference for `gl_entry`).

---

## 7. EXISTING MODULE INTEGRATION MAP

**This repo is NOT greenfield.** A lightweight operational-billing layer already
exists. The BRD's accounting module is a *new double-entry core* that these modules
must **post into** (per AR-4, "one posting engine"), not a rewrite of them. The
governing principle already stated in the code is *"المالية هي السجل الوحيد للمال"*
(finance is the single record of money) — today that "finance" is the flat `Expense`
table; the BRD upgrades it to a real GL.

**Decision key:** REUSE (keep as-is, no change) · EXTEND (keep + add columns/links to
GL) · WRAP (keep the doc, add a posting adapter that emits a `gl_map`, no schema
disruption) · REPLACE (supersede — highest migration cost).

> None of the REPLACE options below are chosen unilaterally — they are presented as
> options with a recommendation. Architectural calls are flagged in §8.

### 7.1 `invoices` — existing `Invoice`

- **Today:** `Invoice` (`@@map("invoice")`) is a billing record bound **1:1 to an
  `Appointment` or a `LabTestOrder`** (`appointmentId`/`labOrderId`, both `@unique`,
  exactly one set). Fields: `subtotal, vatRate, vatAmount, discount, total, amountPaid,
  currencyCode, status(PENDING/PARTIAL/PAID/VOIDED), paymentMethod, paidAt,
  stripePaymentIntentId`. Consumed by `src/features/finance/invoices/*`, revenue stats,
  `invoice-sections.ts` (partial/section payments). No GL, no customer ledger, no tax
  template, no line-item table of its own (lines come from the appointment/lab order).
- **Decision: WRAP (v1), converge later.** Keep `Invoice` as the appointment/lab billing
  doc. Add a posting adapter (P5) that, on payment/finalization, builds a `gl_map`
  (Dr AR / Cr Income / Cr VAT) and calls `make_gl_entries`. Do **not** fold appointment
  invoices into the BRD `sales_invoice` table in v1 — their lifecycle is
  appointment-driven. The BRD `sales_invoice` (P5) is a **new** standalone table for
  direct/manual sales; over time appointment billing can emit a `sales_invoice` instead
  of a bespoke adapter (revisit at P12).
- **Field-level map (existing `Invoice` → BRD `sales_invoice`, §7.2):**
  | Existing `Invoice` | BRD `sales_invoice` | Note |
  |---|---|---|
  | `total` | `grand_total` / `rounded_total` | existing has no rounding split |
  | `subtotal` | `net_total` | |
  | `vatRate` / `vatAmount` | (derived from `taxes[]` rows) | BRD uses a tax-rows child table, not a single rate |
  | `discount` | `discount_amount` | BRD adds `apply_discount_on`, discount account |
  | `amountPaid` | `paid_amount` (derived) | BRD derives from PLE, not a stored column |
  | `status` (4 states) | `status` (14 states) | needs mapping table; BRD statuses are PLE-driven |
  | `currencyCode` | `currency` + `conversion_rate` | BRD adds base-currency mirrors (C4) |
  | — | `customer`, `debit_to`, `payment_schedule[]`, `taxes[]`, `items[]`, `advances[]` | net-new |
- **Migration implication (WRAP = low):** none to `invoice` schema in v1; only additive
  `gl_entry`/`payment_ledger_entry` rows produced going forward. Optional backfill:
  replay historical paid invoices into opening GL via the Opening Invoice tool (P12.1) —
  offline, non-destructive.
- **Naming & user-facing coexistence (logged at P5-UI-fix, owner-directed):** as of P5 the
  two documents are visible side by side — «الفواتير» (operational, `Invoice`, under
  العمليات اليومية) and «فواتير المبيعات» (accounting, `sales_invoice`, same group). Two
  screens with near-identical names is a real discoverability cost, accepted for now
  because WRAP forbids merging them in v1. Mitigation shipped: each screen carries a
  one-line scope statement under its title —
  - operational → «فواتير الحجوزات والخدمات — التشغيل اليومي للعيادة.»
  - accounting → «الفوترة المحاسبية — تُرحَّل إلى دفتر الأستاذ وسجل الذمم.»
  **Revisit trigger:** when the clinic-invoice posting adapter lands (this section's WRAP
  adapter, P5→P12 convergence), re-decide *final naming and whether the two lists merge*.
  Do not rename either screen before then — the adapter's parallel-run reconciliation is
  what tells us whether one list can serve both.

### 7.2 `sales` — existing `Sale` / `SaleItem` (POS)

- **Today:** standalone POS invoice **not** linked to an appointment. `Sale` (subtotal,
  discount, discountCode(text tag), taxRate(15), taxAmount, total, paymentMethod,
  customerName snapshot, status PENDING→PAID) + `SaleItem` (name snapshot, unitPrice,
  quantity, lineTotal, inventoryItemId). On payment, decrements stock via `issueStock`.
  Revenue stats union `Sale`(PAID) + `Invoice`.
- **Decision: WRAP → migrate to POS path (P12.4).** Keep `Sale`/`SaleItem` operating and
  wrap it with a posting adapter (Dr Cash/Bank, Cr Income, Cr VAT, Cr/Dr stock via COGS).
  When the BRD POS path lands (P12.4, `is_pos` Sales Invoice), `Sale` becomes the POS
  front-end that emits an `is_pos` `sales_invoice`. `SaleItem` maps to `sales_invoice_item`.
- **Field-level map (`Sale` → BRD `sales_invoice` with `is_pos=1`):** `total`→
  `grand_total`; `taxRate`/`taxAmount`→ a single "On Net Total" tax row; `customerName`→
  `customer` (POS may allow a walk-in snapshot); `paymentMethod`→ POS `payments[]` row +
  `mode_of_payment`; `discountCode`→ keep as label (BRD pricing rules are out of scope
  §1.3). `SaleItem.unitPrice/quantity/lineTotal`→ `rate/qty/amount`; needs `income_account`
  + `cost_center` (new, defaulted from POS Profile / company defaults).
- **Migration implication (WRAP = low; convergence = medium):** v1 additive only. The
  eventual POS convergence needs a data move `sale`→`sales_invoice`(+items) — scriptable,
  behind the P12.4 flag; keep `sale` readable for historical POS receipts.

### 7.3 `expenses` — existing `Expense` (de-facto A/P roll-up)

- **Today:** the closest thing to a GL today. `Expense` (`@@map("expense")`) is a flat
  disbursement row: `amount, source(MANUAL/PAYROLL_RUN/END_OF_SERVICE/PURCHASE_ORDER),
  sourceId, @@unique([source, sourceId])` (idempotent posting), multi-step approval
  (`DRAFT→PENDING_REVIEW→APPROVED→PAID/REJECTED/CANCELED`), `expenseDate` (accounting
  period), optional `staffId/supplierId/branchId`, immutable once posted
  (`PostedExpenseImmutableError`). Payroll & Purchasing post into it. **No account codes,
  no debit/credit, one amount per row.**
- **Decision: EXTEND + WRAP (do NOT replace in v1).** This is the load-bearing "money
  out" table; ripping it out would break payroll, purchasing, end-of-service. Instead:
  (a) WRAP — add a posting adapter so an approved/paid `Expense` emits a `gl_map`
  (Dr expense account / Cr payable-or-cash), reusing the existing `@@unique([source,
  sourceId])` idempotency to guarantee one GL batch per expense; (b) EXTEND — add nullable
  `accountId` (expense account) + `costCenterId` + `glVoucherId` link columns so an expense
  chooses its GL account. The BRD `purchase_invoice` (P6) remains a **separate, richer**
  A/P document for supplier bills that need tax rows / bill numbers / holds; simple
  operational expenses stay on `Expense`.
- **Field-level map (`Expense` → BRD `purchase_invoice`/`journal_entry`):** a supplier
  `Expense` ≈ a one-line `purchase_invoice` (amount→`grand_total`, supplierId→`supplier`,
  supplier→`credit_to`(payable), expenseDate→`posting_date`, categoryLabel→ item
  `expense_account`). A non-supplier `Expense` ≈ a `journal_entry` (Debit
  Note/Bank/Cash). The posting adapter picks the shape by `source`/`supplierId`.
- **Migration implication (EXTEND = medium):** additive nullable columns only (safe
  migration, no backfill required — existing rows keep NULL account and post to a default
  expense account until edited). No destructive change. **Option B (REPLACE)** — retire
  `Expense`, route everything through `purchase_invoice`/`journal_entry` — is higher value
  long-term but breaks 3 posting services and needs a full data migration; **not
  recommended for v1** (see §8 C3).

### 7.4 `purchasing` — existing `PurchaseOrder` / `PurchaseOrderItem`

- **Today:** supplier POs against a `Warehouse` (`DRAFT→ORDERED→PARTIALLY_RECEIVED→
  RECEIVED→CANCELLED`). On full receipt, writes `RECEIPT` stock ledger entries **and**
  posts to finance as an `Expense` via `postPurchaseOrderToFinance` (amount =
  Σ qtyReceived×unitCost).
- **Decision: REUSE + re-target posting.** Keep PO/POItem entirely (they are procurement,
  not accounting). Only change: when GL exists, the receipt posting should target the GL
  (Dr Stock/Inventory, Cr "Stock Received But Not Billed") per BRD §7.3 row 4, and the
  supplier bill becomes a `purchase_invoice` that clears SRBNB. In v1 (stock GL legs are
  phase-gated in the BRD) it continues posting to `Expense` via the §7.3 WRAP adapter.
- **Field-level map:** `PurchaseOrder`→ BRD **Purchase Order** (a dependency doc, §1.4;
  not itself a voucher). `PurchaseOrderItem.qtyOrdered/qtyReceived/unitCost`→ used by the
  `purchase_invoice_item` billing-status linkage (`po_detail`). No column rename needed.
- **Migration implication (REUSE = none):** zero schema change; only the posting *target*
  moves from `Expense` to GL when the stock-GL phase activates. Keep the `Expense` path
  behind the same feature flag for rollback.

### 7.5 `suppliers` — existing `Supplier`

- **Today:** vendor master (`legalName, type, commercialReg, categories[], products[],
  leadTimeDays, rating, contact/address, active, isDeleted`). Referenced by PO & Expense.
- **Decision: EXTEND.** This IS the BRD Supplier/Party (payable side). Add the BRD §4.10
  party-accounting fields as new nullable columns / child tables: per-company payable
  account (`party_account` child), `default_currency`, `payment_terms_template`,
  `credit_limit` child, `tax_category`, `tax_withholding_category`, `is_internal` +
  `represents_company`, `is_frozen`. No renames.
- **Field-level map:** `Supplier.legalName`→ party display name; `Supplier.id`→ GLE
  `party` (with `partyType="Supplier"`); new child `supplier_account {clinicId, account}`
  = BRD `party_account`.
- **Migration implication (EXTEND = low):** additive columns + one child table; existing
  rows valid with NULL accounting fields (fall back to company defaults per BR-4.10.1).
  Owner (pet owner) is the **customer/receivable** party and gets the mirror treatment in
  P3 (see §8 C6).

### 7.6 `stock` — existing `StockLedgerEntry` (+ Warehouse/Bin/Batch)

- **Today:** the **one true append-only ledger** already in the app — immutable,
  `qtyChange/balanceQty/valuationRate(Decimal(12,4))/voucherType/voucherId`, moving-average
  valuation, per-item×warehouse `StockBin` cache, `StockBatch` FEFO. Structurally this is
  exactly how `gl_entry` should behave.
- **Decision: REUSE as-is + use as the structural template for `gl_entry`.** Do not touch
  stock. It is the *quantity/cost* ledger; `gl_entry` is the *money* ledger. The link:
  when `update_stock` invoices / receipts post, the stock valuation (`valuationRate`)
  feeds the COGS/inventory GL legs (BRD §7.2 row 5, §7.3 row 4) — **phase-gated** in both
  BRD and phases file. Mirror its immutability discipline, `voucherType`/`voucherId`
  pattern, and index style in `gl_entry` (§5.1).
- **Field-level map:** `StockLedgerEntry.voucherType/voucherId`→ `gl_entry.voucherType/
  voucherNo`; `valuationRate`→ source for COGS amount. No changes to stock tables.
- **Migration implication (REUSE = none):** zero.

### 7.7 `finance` feature (frontend) & Payroll

- **`src/features/finance/*`** is a UI shell (invoices/discounts/care-plans/expenses tabs
  via `finance-header.tsx` portal). **Decision: EXTEND** — add accounting tabs/screens
  (Chart of Accounts, Journal Entry, reports) under the same header pattern; do not fork a
  new shell. Route new pages under `src/routes/_pathless-layout/management/` and features
  under a new `src/features/accounting/` (server under `src/server/accounting/*` or
  per-resource `src/server/gl`, `src/server/journal-entry`, etc. following the 4-file
  pattern).
  > **How EXTEND is honoured (§10):** code stays split — `features/accounting/*` for the
  > double-entry screens, `features/finance/*` for legacy billing — but the **navigation is
  > one world**: one «المالية» entry, one nav config, one sub-sidebar shell mounted by both
  > route trees. "Do not fork a new shell" is a statement about the *user-visible* area, not
  > about folder layout. P1 briefly forked a second sidebar entry; §10 closes that.
- **Payroll** (`PayrollRun`…): **REUSE + WRAP** — on approval it already posts to
  `Expense`; the same WRAP adapter (§7.3) carries it into GL (Dr salary expense / Cr
  payable). No payroll schema change.

### 7.8 Summary table

| Module | Existing model(s) | Decision | Migration cost | BRD target |
|---|---|---|---|---|
| invoices | `Invoice` | **WRAP** (converge P12) | low (additive) | `sales_invoice` posting |
| sales (POS) | `Sale`, `SaleItem` | **WRAP** → POS path P12.4 | low→med | `is_pos` `sales_invoice` |
| expenses | `Expense` | **EXTEND + WRAP** | med (nullable cols) | `purchase_invoice`/`journal_entry` |
| purchasing | `PurchaseOrder(Item)` | **REUSE** (re-target posting) | none | PO dependency + SRBNB |
| suppliers | `Supplier` | **EXTEND** | low (party fields) | Party (payable) |
| stock | `StockLedgerEntry` +… | **REUSE** (template for GL) | none | COGS/inventory legs |
| payroll | `PayrollRun`… | **REUSE + WRAP** | none | GL salary expense |
| finance (UI) | feature shell | **EXTEND** | n/a | accounting screens |

---

## 7.9 GL engine hooks — deferred-validation ledger (BINDING checklist)

The §6 posting engine (`src/server/accounting/gl/gl-engine.service.ts` /
`gl-cancel.service.ts`) ships with named hook seams whose CALL ORDER is fixed but whose
bodies land in later phases. **Each phase's self-audit MUST check its hook off this table —
a stubbed validation is never silently forgotten.** Mark the row done (✅ + commit) in the
phase that implements it.

| §6 hook / validation | Seam | Owning phase | Status |
|---|---|---|---|
| Budget Stop/Warn/Ignore (§13) | `validateBudgetHook` | P10.3 | ✅ **live** (P10.3 — annual + accumulated-monthly vs submitted budgets, CC-subtree containment, PCV exempt AND closing rows excluded from booked actuals; WARN = server-side log, no messaging bus — logged) |
| Dimension offsetting (BR-4.5.3) | `dimensionOffsettingHook` | P10.4 | ✅ **live** (P10.4 — per-company defaults filled, then one offset row per imbalanced dimension value, party stripped; verified per-value debit=credit) |
| Accounting Period (§12) | `validateAccountingPeriodHook` | P10.1 | ✅ **live** (P10.1 — submitted period + closed doc-type blocks posting AND cancelling in-range; cancel path checks the REVERSAL date per BR-3.1) |
| PCV guard (non-opening ≤ last PCV) | `validatePcvHook` | P10.2 | ✅ **live** (P10.2 — posting AND cancel paths; PCV's own rows exempt; all-opening batches pass only with `ignore_is_opening_check_for_reporting` — ERPNext parity, see KL-3) |
| PLE derivation (BR-5.2.1) | `createPaymentLedgerEntriesHook` | P3.2 | ✅ **live** (P3.2 — signed per the §5.2 matrix, PCV exempt, own-row against=self) |
| PLE delink/reversal (BR-3.2) | `reversePaymentLedgerEntriesHook` (cancel path) | P3.2 | ✅ **live** (P3.2 — legacy: delink+delinked mirrors at original date; immutable: live negations at cancel date; partialCancel honored) |
| Party rules on AR/AP accounts (BR-4.3.3) | engine step 7 — `assertPartyRules` | P3.3 | ✅ **live** (P3.3 — party mandatory on AR/AP + forbidden elsewhere, incl. §4.10 exists/frozen/disabled/currency guards; doc-level mirror in JE rules) |
| Dimension filters + mandatory-BS/PL (BR-4.5.2) | engine step 7 | P10.4 | ✅ **live** (P10.4 — report type from the account's rootType; allow/deny value lists per (dimension, account) via `accounting_dimension_filter`) |
| Disabled accounts (§6 step 4) | inline | P2.2 | ✅ live |
| Cost-center allocation split (BR-4.4.1) | `applyCostCenterAllocationSplit` | P2.2 | ✅ live |
| Merge + `_skip_merge` + zero-drop (§6 5b) | `mergeSimilar` | P2.2 | ✅ live |
| Negative toggling (§6 5c) | `toggleNegatives` | P2.2 | ✅ live |
| Postable account / frozen / fiscal year / frozen-upto+role / remarks cap (§6 step 7) | insert loop | P2.2 | ✅ live |
| **balance_must_be (post-batch per account)** | engine step 7 | P2.2 | ✅ **live** |
| Debit=credit + allowance + auto round-off incl. opening branch (§6 step 8) | `decideRoundOff`/`applyRoundOff` | P2.2 | ✅ live |
| Row locking on cancel (SELECT … FOR UPDATE) | `makeReverseGlEntries` first statement | P2.3 | ✅ live |
| Both AR-2 cancel modes (default: legacy/OFF — pinned by a DB test) | `makeReverseGlEntries` | P2.3 | ✅ live |
| FX gain/loss JE lifecycle + auto-cancel on unlink/unreconcile (BR-7.4.4) | `bookEgolJeInTx`/`cancelEgolJesInTx` wired at the four settlement sites: PE submit + cancel, BR-11.2 relink, FR-10.3 unreconcile, BR-10.4 interlock | P8.2 | ✅ **live** (P8.2 — settings-driven vehicle: `Payment` = in-map row, JE modes = system "Exchange Gain Or Loss" JEs booked atomically via `submitVoucherInTx`, cancelled by linkage-column lookup) |

## 8. Decisions (RESOLVED — approved 2026-08-03)

All open items are decided. These are now binding on every accounting phase.

**C1 — RESOLVED.** `IMPLEMENTATION_PHASES.md` is in the repo (P0→P13; M1@P2, M2@P7,
M3@P10, M4@P12). Every implementation commit carries a `[Px.n]` tag + BRD sections.

**C2 — RESOLVED: `Decimal(21,9)` for all new accounting money AND exchange rates.**
- All NEW accounting tables use Prisma `Decimal @db.Decimal(21, 9)` for money columns and
  for exchange-rate columns (BRD NFR-2). Existing operational tables keep their precision
  (`Decimal(10,2)`) until their own EXTEND migration.
- **Runtime arithmetic uses a decimal library only — JS floats are forbidden in
  accounting services.** (Pick one decimal lib in P0 and standardize; no `number` math on
  money anywhere under `src/server/accounting|gl|...`.)
- Rounding to a currency's fraction units happens **only at document boundaries**
  (BR-8.1); intermediate ledger/tax math stays full-precision decimal.
- Adapters (§7) convert at the boundary with **explicit** rounding when lifting an
  operational `Decimal(10,2)` amount into the ledger.

**C3 — RESOLVED: strangler pattern, WRAP/EXTEND/REUSE exactly as §7 (no REPLACE in v1).**
Accounting core is built standalone per the phases; existing modules post *into* it via
adapters. **Wiring sequence:**
1. Core built P0→ per phases.
2. **After P2 (M1):** `Expense` adapter → `gl_map` (`voucherType = "Expense"`, no party).
3. **After P5:** clinic `Invoice` adapter → `gl_map` + PLE (`voucherType = "Clinic
   Invoice"`, `party = Owner`); the payment side wires after P7.
4. **After P6:** `PurchaseOrder` billing posts through the new purchase path instead of
   the legacy `postPurchaseOrderToFinance` → `Expense` path.
5. **`Sale` (POS)** waits for P12.4.
- **Per-adapter deliverable (DoD):** a **parallel-run reconciliation report** (operational
  totals vs GL, per day). An adapter is **not done** until it shows **zero diff** on seeded
  data. (Mirrors the existing `*-posting.test.ts` discipline.)

**C4 — RESOLVED: SUPERSEDE ADR-0001 → see `docs/adr/0002-full-multi-currency-accounting-
ledger.md`.** The accounting ledger is fully multi-currency (ILS/USD/JOD is a hard market
requirement).
- `gl_entry` carries the **full tri-currency column set from P2** (schema day-1, BRD §5.1).
- **P0–P7 run operationally single-currency** (`transactionExchangeRate = 1`, account
  currency = base, all three triplets equal). **Full FX activates at P8** (foreign
  accounts, per-doc conversion rate, realized/unrealized G/L, revaluation, rate provider).
- Existing operational screens stay display-only (ADR-0001 semantics) until their adapters
  are wired. ADR-0001 has been annotated as partially superseded.

**C5 — RESOLVED: BRD `company` → `clinicId`.** company = **legal entity**. **Multiple
branches of one legal entity are `cost_center`s (or an accounting dimension), never
separate companies.** No Company master is introduced; do not conflate `branchId` with
`company`. (An accounting `cost_center` tree per §4.4 covers branch-level P&L.)

**C6 — RESOLVED: polymorphic party (`partyType` + `partyId`).** Register party types
**Owner** (Customer/receivable), **Supplier** (payable), **Staff** (Employee), each with
per-company default receivable/payable accounts. BR-4.10.1 resolution order still applies
(doc-level account → party per-company account → company default). No unified Party master.

**C7 — RESOLVED: two identifiers per voucher.**
1. **PK** = repo-standard `cuid()` — internal only, never shown as the legal number.
2. **`documentNo`** = legal number from the P0 `naming_series` counters,
   `{PREFIX}-{YYYY}-{#####}`, scoped per **(company, doctype, year)**, unique-indexed,
   **assigned on submit inside the submit transaction** so tax-invoice sequences are
   gap-free. Drafts show a `DRAFT` placeholder (no number consumed until submit).
- `generateUniqueCode` is NOT used for voucher numbers (random ≠ sequential). It may still
  be used for non-voucher masters.
- **Existing clinic `Invoice` numbering is untouched** (keeps its `code`/`generateUniqueCode`).

**C8 — LOGGED (2026-08-15, extended 2026-08-19): C3 adapter kill-switches.** Adapter runs
are gated by one §19 accounts-settings flag each (default **OFF**; OFF freezes ledger
posting without touching operations), per the owner's additive-and-reversible directive:

| Adapter | Flag | Account legs it needs |
|---|---|---|
| `clinic_invoice` [P12A.2] | `enable_clinic_invoice_adapter` | §4.1 cash/bank/income + `adapter_vat_account_id` |
| `expense` [P12A.2] | `enable_expense_adapter` | §4.1 cash/bank/expense |
| `pos_sale` [P12B.4] | `enable_pos_sale_adapter` | §4.1 cash/bank/income, each sale's own tax-row account heads, + `adapter_cogs_account_id` / `adapter_stock_account_id` (BRD §7.2 row 5) |

All three are surfaced in the «الحوكمة ← المحولات» tab, whose list is **derived from the
adapter registry** — a fourth adapter needs no UI change. The §C3 zero-diff report lives at
«تقرير المطابقة (المحولات)». Note the POS adapter credits **each tax row's own account
head** rather than one VAT leg: that is only possible because [P12B.3] gave POS sales real
per-row tax detail instead of a single blended percentage.

---

## 8.1 Known limitations (owner-accepted, discoverable by design)

| # | Limitation | Reason | Accepted |
|---|---|---|---|
| KL-1 | Reconciling a **JE-sourced credit** against an invoice books NO automatic exchange gain/loss JE (BR-7.4.4 applies only to PE-sourced settlements and invoice advances). | A JE credit has no document row to carry the `exchangeGainLossJeId` linkage, and a reference on the EGOL JE's expense row would violate the reference-shape rule. Auto-cancel would need search-not-lookup — rejected. Workaround: book the difference manually as a JE, or route the credit through a Payment Entry. | P8 exit (2026-08-12) — revisit if it bites in practice |
| KL-2 | AR/AP ageing's **Bill-date basis falls back to Posting** — the «أعمار الذمم» selector offers Posting \| Due only. | The [P7.1] `PE_REFERENCE_LOADERS` snapshot (`loadReferenceSnapshot`) does not carry `billDate`; ageing reads dates exclusively through that seam. Enabler: extend the purchase-invoice loader to return `billDate` (the PI row already stores it), then add "Bill" to `AgeingBasedOn` and the screen selector. | M3 exit (2026-08-15) — schedule with the loader change |
| KL-3 | A backdated **all-opening batch posted through `ignore_is_opening_check_for_reporting`** after a submitted PCV leaves that PCV's §5.3 closing snapshots STALE (the BS fast-path misses the new rows until the close is cancelled and re-submitted). | Snapshots are written once at close time; live maintenance on backdated inserts is P13-scale machinery for a corrections-only escape hatch. Operational rule: after opening corrections, re-run the close. | P10.2 (2026-08-15) |
| KL-4 | ✅ **RESOLVED [P12B.1] (2026-08-19).** _Was:_ **Adapter-posted clinic invoices cannot currently be reversed.** The `clinic_invoice` adapter's reversal fires on operational status `VOIDED`, but the operational module (correctly) refuses to void a PAID invoice — and the adapter only ever posts PAID invoices. So a paid clinic invoice that turns out to be wrong (service not rendered, wrong amount) leaves its revenue in the ledger permanently. **Only the expense adapter has a reachable reversal trigger today** — and as of [P12A-fix5] it is genuinely reachable: the expense screens hid «إلغاء» once an expense was PAID and offered a hard DELETE instead (the review panel derived its lock from `reviewSent` alone), so the one working reversal path in the product was invisible while a data-destroying one sat in its place. Cancel is now offered on PAID expenses, delete is refused while a live `adapter_posting` exists, and the adapter reverses a VANISHED source too, so a database already holding an orphan from the old behaviour can be brought back to zero. Owner directive 2026-08-15: this must be SOLVED, not left dormant — the operational module needs a refund/credit path for paid invoices producing a state the adapter recognises, and the adapter then posts an AR-2 append reversal exactly as the expense path does. Scheduled as **[P12B.1]**, the first task of Phase 12B, because it changes operational-module behaviour (new state + screen + permissions), not just accounting. Until it ships: pilots must be told that a wrong paid invoice cannot be reversed through the product. | P12A review (2026-08-15) | **Resolution:** `PUT /api/invoices/:id/refund` moves a PAID invoice to the new `REFUNDED` state with a mandatory reason, timestamp and operator, gated on a new un-backfilled `finance_invoices.refund` permission; the `clinic_invoice` adapter treats `REFUNDED` as reversal-eligible, and because REFUNDED also leaves `eligibleWhere`, the zero-diff report's source total falls by exactly what the GL reversal removes and the residual returns to 0. `voidInvoice` became an allow-list (PENDING/PARTIAL only) so a refund cannot be voided on top of and lose its trail.
| KL-5 | ✅ **RESOLVED [P12B.2]–[P12B.5] (2026-08-19).** _Was:_ **POS sales are invisible to the ledger, taxed by their own arithmetic, and unreversible.** The app's POS (`src/server/sales/` — `Sale`/`SaleItem`, cashier tab inside Inventory) writes a document that is NEVER an `Invoice`, so the [P12A.2] adapters post **zero counter revenue**. Its tax is computed in the DAO against a rate hardcoded in three unlinked places (schema `@default(15)`, dao `?? 15`, UI `TAX_RATE = 15`) instead of the P4 §8 calculator + Sales Taxes & Charges template + Item Tax Template overrides — so a mixed basket (some items exempt/zero-rated) can never be right, and the rate ignores the clinic's jurisdiction. `SaleStatus` is `PENDING\|PAID` only: no void/refund/return, no restock — a mis-keyed PAID sale is terminal. No COGS is captured at issue, so gross profit on counter sales is fiction. Scheduled as [P12B.2] (reversal, ships with KL-4's fix), [P12B.3] (tax through the P4 engine — all three constants deleted, unconfigured rate becomes a surfaced setup error), [P12B.4] (POS adapter as the third registry entry), [P12B.5] (COGS, bucket TBD). **If any clinic is transacting on POS today, [P12B.0] is a hotfix ahead of everything.** | P12 POS scoping (2026-08-15) | **Resolution:** the rate was hardcoded in FOUR places, not three (the audit missed `taxRate: z.coerce.number().default(15)` on the create schema) — and worse, the create endpoint TRUSTED the browser's rate, so any client could sell at 0%. All four are deleted: POS prices through `runInvoiceCalculation` (the same §8 engine and the same 45 golden fixtures as sales invoices) against a Sales Taxes and Charges Template resolved by the P4.1 rule engine, with **no fallback rate** — an unconfigured clinic is refused, naming «المحاسبة ← الضرائب», because any default would be the fifth copy. Per the owner's acceptance conditions (2026-08-19) the refusal names what to configure and where, and **onboarding now guarantees a default template exists** (`ensureDefaultSalesTaxTemplate`, called at clinic creation) so a fresh clinic can never reach the counter unable to sell — its rate is read from the clinic's own `ClinicSettings.vatRate`, introducing no new constant. Per-item overrides needed a new link (`InventoryItem.itemTaxTemplateId` + a picker on the product form): a sales invoice takes an Item Tax Template per line by user choice, and a cashier has no such field, so without it a mixed basket would still have carried one blended rate. `SaleStatus` gained `REFUNDED` with restock that reverses the sale's OWN stock-ledger rows (batch and warehouse included, since FEFO can split a line across batches). COGS is captured at issue from each movement's `valuationRate` and posted by the new `pos_sale` adapter — the third registry entry, no new pipeline — on the SAME voucher as the revenue rows, which is what makes "COGS survives the return" structural. `markPaid` became PENDING-only so a refunded sale cannot be re-paid and issue stock twice.
| KL-6 | **The CLINIC-invoice side still prices tax outside the P4 engine, on a per-clinic single rate with a hardcoded 15 fallback.** Found while closing KL-5 and recorded rather than silently absorbed — [P12B.3]'s scope was POS. Four modules (`invoices.dao.ts`, `lab-invoice.service.ts`, `radiology-invoice.service.ts`, `operations-invoice.service.ts`) each carry their own `const DEFAULT_VAT_RATE = new Prisma.Decimal(15)` and compute `vatAmount` themselves from `ClinicSettings.vatRate` (`@default(15.00)`). This is **materially less bad than the POS case was** — the rate IS a per-clinic setting an owner can change, and 15 is only the fallback when it is unset — but it means: a mixed basket of exempt and standard-rated services cannot be right (one blended rate per invoice, no Item Tax Template path); the Sales Taxes and Charges template, tax rules and per-item overrides do not apply; and there are still five copies of the number 15 across the schema and those four files. The adapter posts these invoices on `total` and `vatAmount` as computed, so **the ledger faithfully reflects whatever those files decide** — the risk is upstream of accounting, not in it. **Priority raised by the owner (2026-08-19): scheduled as Phase 12C / [P12C.1], the FIRST item after Phase 12B merges — before Extended, before P13** — because the same class of bug just fixed for POS still lives in the path that generates most clinic revenue. Note the ordering constraint: `Invoice` carries `vatRate`/`vatAmount` scalars and no tax child table, so it needs the `SaleTax` treatment before the adapter can credit each charge to its own head. **RESOLVED in [P12C.1] (2026-08-19).** All four constants deleted; the four services now price through `priceClinicInvoice` → `runInvoiceCalculation`, against a template resolved by the shared `resolveSalesTaxTemplateOrThrow` (one implementation, extracted from the POS copy so the rule cannot drift again). `Invoice` gained `taxTemplateId` + an `InvoiceTax` child table, and the clinic-invoice adapter credits **each row to its own account head** — falling back to the single `adapter_vat_account_id` leg only for invoices paid before the migration, which have no rows and would otherwise put a permanent residual in the zero-diff report on every existing clinic. **Per-line overrides land on `ClinicServiceConfig.itemTaxTemplateId`**, not on `Service`: all four order-item tables carry `serviceId`, but a `Service` row may be global (`clinicId = null`) while an Item Tax Template belongs to one clinic — and that config row is already "this service, priced for this clinic". Products reuse `InventoryItem.itemTaxTemplateId` from [P12B.3]. The consultation fee has no master and takes the template rate, which is correct: it is the clinic's own fee, not a catalogued item. `Invoice.vatRate` survives as a DERIVED display figure (tax ÷ net), the same call as `Sale.taxRate` — two screens and the print layout still read it, and dropping it is a destructive migration for a field that is now merely a summary of the rows. | P12B (2026-08-19) · resolved P12C |
| KL-7 | **Accounting setup is fully reachable from the product but entirely unguided — there is no "is this clinic ready to post?" surface.** Checked at the owner's prompt after [P12B.3-fix] found that onboarding provisions no chart of accounts (2026-08-19). The good news first: it is **NOT CLI-only**, so this is not the launch blocker it looked like. Every step has a real screen and a real button — «شجرة الحسابات» has «تطبيق الشجرة القياسية» (`POST /accounts/import/seed-standard`), «السنوات المالية» has a create sheet, and «إعدادات الشركة» edits the §4.1 defaults, with the adapter legs and flags on «الحوكمة ← المحولات». What does NOT exist is any ordering, prompting or completeness check: a new owner must know, unaided, to seed the chart → create a fiscal year → set the §4.1 cash/bank/income/expense/payable defaults → set the adapter legs → enable the flags, across four screens. Nothing surfaces what is missing, and most gaps announce themselves only at the moment of posting, as an Arabic error naming a screen («لا حساب نقد/بنك افتراضي…», «لا حساب ذمم دائنة للطرف»). The P12A review already paid for one instance of this shape. Pilot risk is real but is *guidance*, not *capability*. Scoped as **[P12C.2]** alongside the KL-6 work, since both touch first-run correctness. **Addendum (same day, after the owner's pass):** the fiscal year belongs on that list of four steps — a clinic with a chart of accounts but no fiscal year covering today refuses every posting with «لا توجد سنة مالية تغطي التاريخ …». [P12B.6-fix] closed it for **both** first-run paths, at the owner's direction — real onboarding and the demo seed now make the same call, `provisionClinicFirstRun`, which guarantees a fiscal year covering today (year derived from the date, flagged `autoCreated`) and the default sales tax template. **Provisioning was chosen over reporting**: both are derivable, not business decisions an owner should have to make before their first document, so the readiness panel lists them as ✅ rather than as tasks. What [P12C.2] must genuinely REPORT is the chart of accounts and the §4.1 posting defaults, which are real choices. Cost stated rather than hidden: a clinic on a non-calendar fiscal year must delete the auto-created one before creating its own (BR-4.2.1 forbids overlap), which `autoCreated` makes visible on «السنوات المالية». Future first-run guarantees go in `provisionClinicFirstRun` and reach both paths — a structural test asserts neither path re-implements them. **RESOLVED in [P12C.2] (2026-08-19).** `GET /accounting/readiness` + tab «الجاهزية» on «الحوكمة», now the hub's DEFAULT tab — nothing else there means anything to an owner who cannot post yet. Five items read real state and each links to the screen that already fixes it; the panel writes nothing. Severity is load-bearing: `blocking` (chart of accounts, fiscal year, §4.1 defaults, tax template) means no document posts, `warning` (adapter legs) means the ledger lags while the clinic keeps working — reporting an optional leg as a blocker would train the owner to ignore the panel. Routes live in the UI, keyed off the item's `key`, so a route rename is a compile error rather than a dead button. | P12B (2026-08-19) · resolved P12C |

| KL-6 | **A zero Bank Reconciliation Statement residual does not mean the books are correct.** It means the bank balance agrees with what is *cleared* in the books. A duplicate or plainly wrong voucher that is still UNCLEARED sits outside the comparison entirely, so the statement can read `0` over books that double-count a payment — which is exactly what the P12A UI pass produced. The screen now states this under a zero residual and points at «السندات غير المُقاصّة»; the arithmetic itself is right and is not changing. Detecting duplicate bookings is the matcher's job, not the statement's — see the [P12A-fix5] `DUPLICATE_CANDIDATE_SCORE` guard on «سند قبض/صرف». | P12A UI re-run (2026-08-16) |

## 9. RTL / i18n Rules (observed)

- Locale is **cookie-driven** (`locale` cookie), AR default & RTL; `<html dir>` set in
  `__root.tsx`. Never build URL-based locale routes.
- **Portaled Radix content does NOT inherit `<html dir>`** — every `Select`,
  `DropdownMenu`, `Combobox`, `Dialog`/`Sheet` content, `Popover` that portals must pass
  `dir="rtl"` (or `dir={isRtl?"rtl":"ltr"}`) explicitly.
- Use **logical properties** everywhere: `ps/pe`, `ms/me`, `start/end`, `text-start/end`,
  `border-s/e`, `InputGroupAddon align="inline-start|inline-end"`. Physical
  (`pl/pr/left/right/text-right`) only for deliberately-fixed corners (comment them).
- Directional icons flip with `rtl:rotate-180` (chevrons, sort, expand). Deliberate LTR
  islands (amounts nav, code, IBAN, emails) use `dir="ltr"`.
- Create/edit sheets use `Sheet side="left" dir="rtl"`.
- **Mandatory accounting list-screen anatomy (EVERY accounting screen, current and
  future — P2 Journal Entries onward inherit this automatically):**
  1. **Stats bar** — `components/common/stats.tsx`, default variant,
     `className="px-4 grid-cols-N"`, counts computed from the screen's real query
     (never hardcoded zeros), one tooltip per card;
  2. **Table toolbar** — `components/common/table-toolbar.tsx` with
     `className="border-t"` + `buttonSize="xs"`, search WIRED to the body (tables filter
     rows; trees prune to matches + ancestors and expand to reveal), functional **export**
     (CSV via `features/accounting/utils/export-csv.ts`; CoA exports the P1.3
     import-format columns so it round-trips) passed through `leftExtra` with
     `showExport={false}` — exactly the staff-screen pattern (`staff-table.tsx`), and the
     primary "+ إضافة" button in `actions`;
  3. **body** — `TableDataView`/`ui/table`/tree, full-bleed under a `border-t`;
  4. **create/edit** — the standard side Sheet (next bullet);
  5. **delete** — the standard confirm dialog.
  The settings area (`/management/settings/*`) keeps the settings-page anatomy instead.
- **ALL accounting create/edit flows open in the standard side Sheet — no exceptions.**
  The one shared shell is `features/accounting/components/accounting-form-sheet.tsx`
  (extracted from the CoA account sheet: `side="left" dir="rtl"`, `sm:max-w-md!`,
  `border-b p-4` header, scrollable `space-y-4 p-4` body, pinned `border-t px-4 py-3`
  footer with outline-cancel + primary-submit). Screens supply only the `Field` blocks.
  No inline forms, no centered modals, no page-level forms for create/edit — the ONLY
  page-level form exception is the settings area (`/management/settings/*`), which
  follows the app's settings-page convention. Destructive confirmations use the small
  shared confirm Dialog (`accounting-confirm-dialog.tsx`), never a Sheet and never an
  unconfirmed row button.
- **ONE unified financial navigation — see §10.** There is a single «المالية» entry under
  التشغيل covering legacy operational billing AND double-entry accounting; a second money
  entry is a contract violation.
- **i18n reality:** shared/common components use `t()` keys
  (`src/locales/{ar,en}/translation.json`); many feature components currently inline
  Arabic strings. **For the accounting module, prefer `t()` keys** (NFR-6 requires full
  AR/EN) — add `accounting.*` keys to both locale files. Arabic number-to-words for
  `in_words` (NFR-6) has no existing helper → small util needed.
- Server business errors are **Arabic literals** thrown as `Error` (gated by the Arabic
  regex in `app.ts`). Follow that convention for accounting API errors.

---

## 10. UNIFIED FINANCIAL NAVIGATION (standing law — approved 2026-08-04, RENDERING
## amended 2026-08-05 [NAV-2], FINAL rendering [NAV-3] — **FROZEN 2026-08-05**)

> **🔒 NAVIGATION FREEZE (owner directive, 2026-08-05 — after the NAV-3 visual pass).**
> The NAV-3 rendering — **sidebar sub-menu owns the groups, single-row header owns the
> tabs** (+ the NAV-4 in-workspace إعدادات المحاسبة) — is the LOCKED standing law. **No
> further nav restructuring of any kind without an explicit contract amendment issued by
> the owner.** The ONLY nav decision any future phase makes is answered by the §10.3
> placement law: *which group, which tab position*. Adding renderers, moving levels,
> re-styling the chrome, or reorganizing groups is out of scope for every phase P3–P13.
>
> Superseded history (kept for archaeology, not authority): **NAV-1** = finance
> sub-sidebar shell (P1, deleted at NAV-2) · **NAV-2** = two-level header workspace with a
> Level-1 segmented control (deleted at NAV-3). Neither may be reintroduced.

**The problem this closes.** P1 shipped «المحاسبة» as a second money entry beside the
legacy «المالية». To a clinic accountant that reads as two disconnected financial systems,
and it contradicted §7.7 (`finance` UI shell = **EXTEND**, "do not fork a new shell"). The
two are now ONE area. §7.7 stands as written; this section is how it is honoured in the nav
layer, and it supersedes the earlier "accounting navigation lives in ONE config" bullet.

> **[NAV-3] FINAL rendering (approved 2026-08-05) — supersedes NAV-2's Level 1.**
> The grouping below STANDS; only its renderers are fixed here:
>
> **The sidebar owns the GROUPS. The header owns ONLY the tabs.**
>
> - **Main sidebar** — «المالية» is an **expandable entry** whose sub-menu lists the four
>   groups directly beneath it, in the same main sidebar (`SidebarMenuSub` + `Collapsible`,
>   the app's first real sidebar sub-menu). The parent row toggles open/closed and never
>   navigates; each group links to its remembered destination, else its first permitted tab.
>   It auto-opens whenever a child is active and can still be collapsed by hand. Active
>   treatment is asymmetric on purpose: the active CHILD takes the filled `primary/10` pill,
>   the parent only tints its text — filling both reads as two selections.
> - **Header** — ONE row: the active group's screen tabs in the exact legacy
>   `finance-header.tsx` pill treatment, at most 6, the rest in a «المزيد ▾» pill that
>   adopts the active treatment and names the tab when the active one lives inside it.
>
> **NAV-2's header Level-1 segmented control is SUPERSEDED and deleted** — two levels of
> chrome crowded the header and left the workspace map invisible from the sidebar.
>
> Unchanged from NAV-2: URLs and `?tab=` deep-linking; active states derive from the route;
> the persisted store remembers the last destination per group (the SIDEBAR now consumes it
> for landing); State-4 degradation — a user with one
> visible group gets a **plain** «المالية» link (no one-child tree) and a header identical
> to the pre-workspace finance header. The sub-sidebar rule stays REMOVED.

### 10.1 Depth the design system actually supports

| Layer | Source | Capability |
|---|---|---|
| Main sidebar — sections | `nav-sections.tsx` | section header → items. |
| Main sidebar — **sub-menu** | `nav-sections.tsx` (`NavSectionExpandableItem`) | **[NAV-3] an item with `subItems` becomes a `Collapsible` + `SidebarMenuSub` tree.** The `ui/sidebar.tsx` primitives were audited at NAV-3 and ARE production-viable: logical `border-s`, explicit `rtl:` translate overrides, `data-active` states, `asChild` for `Link`. They are now used in production here, not only in dead boilerplate. |
| Header — tab row | `finance-workspace-header.tsx` | screen tabs of the active group — the proven `finance-header.tsx` pill pattern, config-driven, 6 + «المزيد ▾». |
| `nav-main.tsx` | — | still dead shadcn boilerplate (zero imports); delete it (cleanup item 3). |

**Maximum depth without inventing a pattern: `sidebar entry → sidebar group → header tab`.**
A deeper level is NOT approved; needing one means the grouping is wrong. A sidebar sub-menu
with a single child is not allowed — collapse it to a plain link.

### 10.2 The tree (workflow-first)

One entry, **«المالية»**, under التشغيل. Single-noun name matching every sibling entry
(المخزون، التسويق، التقارير…) and the governing principle *«المالية هي السجل الوحيد للمال»*.

```
المالية
├── العمليات اليومية   الفواتير · المصروفات · خطط الرعاية · الاشتراكات
├── الدفاتر            شجرة الحسابات · مراكز التكلفة · توزيع مراكز التكلفة
├── التقارير المالية    (declared, empty until P2)
└── الإعدادات المالية   السنوات المالية · أسعار الصرف · طرق الدفع
```

### 10.3 Placement law for future phases — DO NOT re-decide per phase

A new money screen joins the group named here — post-[NAV-3] that answers **which sidebar
group it appears under and which header-tab position it takes** (appended after the
existing tabs unless stated). Adding a group, a top-level entry, or a nav level instead is
a contract violation.

| Phase | Destination | Group |
|---|---|---|
| P2 | قيود اليومية | الدفاتر |
| P2 | دفتر الأستاذ العام · ميزان المراجعة | التقارير المالية |
| P3 | حسابات الأطراف | الدفاتر |
| P3 | قوالب شروط الدفع | الإعدادات المالية |
| P3 | سجل الذمم · ميزان مراجعة الأطراف | التقارير المالية |
| P4 | قوالب الضرائب (مبيعات/مشتريات/أصناف/فئات/قواعد) | الإعدادات المالية — ONE «الضرائب» hub, tabs per template |
| P5/P6 | فواتير المبيعات/المشتريات · الإشعارات الدائنة/المدينة | العمليات اليومية (tabs of الفواتير) |
| P5/P6 | سجل المبيعات · سجل المشتريات | التقارير المالية |
| P7 | سندات القبض/الصرف · تسوية المدفوعات | العمليات اليومية — ONE «المدفوعات» hub |
| P8 | إعادة تقييم أسعار الصرف | الإعدادات المالية |
| P9 | الميزانية العمومية · قائمة الدخل · التدفقات النقدية · أعمار الذمم · الملخصات | التقارير المالية |
| P10 | الفترات المحاسبية · سند إقفال الفترة · الموازنات | الدفاتر |
| P10 | الأبعاد المحاسبية | الإعدادات المالية |
| P10 | تباين الموازنة | التقارير المالية |
| P11 | البنوك · الحسابات البنكية | الإعدادات المالية |
| P11 | الحركات البنكية · التسوية البنكية | العمليات اليومية |
| P11 | كشف التسوية البنكية | التقارير المالية |
| P12 | نقاط البيع · المطالبات · الاشتراكات المتكررة | العمليات اليومية |
| P12 | الأرصدة الافتتاحية · الإيرادات المؤجلة · ضريبة الاستقطاع | الإعدادات المالية |

**Hub rule.** التقارير المالية and the P4/P7/P11 hubs cap sidebar length: when a group would
exceed ~8 items, the phase adds a hub page with the `finance-header.tsx` tab strip rather
than more sidebar rows. Hub tabs are addressable by `?tab=` so every destination deep-links.

### 10.4 Where the code lives

- **ONE config:** `features/finance/navigation/finance-nav.ts` — groups, items, gates,
  landing. Nothing else may declare a money link. (Replaces `accounting-nav.ts`.)
- **TWO renderers, one config ([NAV-3]) — groups and tabs render in different places:**
  - *groups* → `components/sidebar/nav-sections.tsx` (`NavSectionExpandableItem`), fed by
    `app-sidebar.tsx` from the pure `workspaceGroupLinks()` helper;
  - *tabs* → `features/finance/navigation/finance-workspace-header.tsx`, mounted through
    `features/finance/components/finance-area-layout.tsx` by **both** `finance.tsx` and the
    `accounting.tsx` layout route.
  Shared, renderer-agnostic logic stays in `finance-workspace.ts` (active-group resolution,
  `landingFor`, `workspaceGroupLinks`, `splitOverflow`) with last-visited memory in
  `finance-workspace.store.ts` — both renderers read the same store. The former finance
  sub-sidebar and NAV-2's header segmented control are both deleted.
- **Gating is per item, and the two halves gate differently** (C3 strangler — neither is
  rewritten in v1): accounting items on `accounting.{doctype}.read`; legacy billing items on
  the repo's `canView(resource)` view-level model over `finance_invoices`,
  `finance_discounts`, `finance_care_plans`, `finance_expenses`. A group with no visible item
  renders nothing, so a receptionist holding invoices only sees ONE group with ONE item —
  locked by `finance-nav.test.ts` and, for the sidebar tree, `finance-workspace.test.ts`
  (`workspaceGroupLinks` returns `null` below two visible groups).
- The legacy tab strip filters on the **same** resources as the sidebar: a tab the sidebar
  refuses to link must not be reachable by clicking.
- The P0.2 voucher demo (`/management/accounting/vouchers`) stays out of the nav.
- **[NAV-4] No link-out tabs — a workspace tab must never eject the user from the
  workspace.** «إعدادات المحاسبة» used to point at `/management/settings/accounts`, a child
  of the settings layout route, so opening it swapped the whole shell for the settings
  sub-sidebar. File-based routing cannot opt one child out of its parent layout, so the
  screen MOVED to `/management/accounting/settings` (under the accounting layout) and the old
  path is a redirect. It is also removed from the settings sub-sidebar — listing it in both
  places would jump the user out of settings, the same defect in reverse. **Any future screen
  that belongs to a financial group must live under a route whose layout is the finance
  area**; declaring a nav item that points outside it is a contract violation.

### 10.5 Cleanup list (deliberate debt, not defects)

1. `/management/finance` is ONE route with a `?tab=` strip. Split it into deep-linkable
   child routes (`/management/finance/invoices`…) and make `finance.tsx` a real layout route
   — then the shell mounts once instead of twice. Deferred to avoid route churn mid-review.
2. `finance_*` resources ship **read-level only** (nav + tab visibility). Row-level
   create/edit/delete toggles for the legacy screens are not modelled yet.
3. `nav-main.tsx` is dead shadcn boilerplate — delete it, or the `SidebarMenuSub` primitives
   will keep reading as an approved pattern.
4. The legacy invoices table (`features/finance/invoices/components/invoices-table.tsx`)
   hardcodes hex and arbitrary spacing throughout. The P5 accounting twin deliberately did
   **not** copy it forward (see the §4.1 carve-out). Converge: extract the shared invoice
   table anatomy into `components/common/`, express it in tokens, and migrate the legacy
   table onto it — deleting the hex rather than letting a second copy of it spread.
