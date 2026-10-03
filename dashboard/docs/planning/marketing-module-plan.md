# Marketing Module — Plan (`/management/marketing`)

**Status:** MK0→MK7 built; awaiting CI + design review of the five proposed gaps.
**Author:** initial draft 2026-08-27, built out 2026-08-28.
**Governs:** everything under `/management/marketing`, `src/features/marketing/`,
`src/server/marketing-*/`.

## Binding decisions (owner, 2026-08-27)

| # | Decision | Consequence |
|---|---|---|
| **D1** | **Draft-and-export (§4 option C).** Elite Vet never holds a card and never buys media in v1. | `إطلاق الحملة` produces a ready-to-launch campaign the clinic launches from Meta's own Ads Manager. The launcher stays behind a `CampaignLauncher` interface so option A drops in later. The drawn payment step becomes **summary-only, no charge**. Metrics are manual/imported, not live. |
| **D2** | **Facebook + Instagram only.** | The other five platforms appear in the create menu **disabled with a «قريبًا» reason tooltip** (`DisabledReasonTooltip` already exists). No undesigned path is reachable. |
| **D3** | ~~Stop and wait for Figma on every gap.~~ **Superseded 2026-08-28** by the owner directive "build all the way to MK7". | The five gaps are now **designed in code**, each labelled in its own file as not-from-Figma so the designer can correct it. See the gap table below. |

## Build status (2026-08-28) — MK0 → MK7 complete

| Phase | State | Evidence |
|---|---|---|
| **[MK0]** Foundations | ✅ | permissions + 3 migrations applied; dead nav link now resolves |
| **[MK1]** Campaigns list | ✅ | list/summary/detail/create/update/status/delete; rows open the detail sheet |
| **[MK2]** Wizard shell + step 1 | ✅ | create→creative round-trip; live preview reactive |
| **[MK3]** AI copy studio | ✅ | tone sliders · 14 seeded templates in 5 categories · generation · تطبيق · اقتراحات مشابهة |
| **[MK4]** Media | ✅ | library · AI image (gpt-image-1 → our S3) · upload; Unsplash disabled-with-reason |
| **[MK5]** Audiences | ✅ | saved audiences · AI suggestions **with rationale** · «لماذا هذا موصى به؟» · «إضافة جمهور جديد» |
| **[MK6]** Schedule, budget, launch | ✅ | `CampaignLauncher` + draft-export impl · readiness gate · launching/failure dialog |
| **[MK7]** Detail & performance | ✅ | detail sheet: status, window, budget, metrics, creative, audience |

**D3 was reversed by the owner** ("build all the way to MK7"), so the five design
gaps were **proposed in code** rather than deferred. Each is marked in its file as
undrawn so the designer can correct it:

| Gap | Where it is now |
|---|---|
| **G1** schedule + budget fields | `step-budget.tsx` — start/end date, daily-vs-lifetime, amount, derived duration |
| **G2** summary semantics | Same file. The drawn four lines don't add up and `الرسوم` would always be 0 under D1, so the summary shows what is actually derivable: amount × duration = expected total, plus an explicit "payment happens at the platform" note |
| **G3** audience form + rationale panel | `add-audience-dialog.tsx`, `audience-card.tsx` |
| **G4** campaign detail | `campaign-detail-sheet.tsx` — no time-series chart and no spend-vs-budget bar: both would render as flat zero under D1 and read as "the campaign failed" rather than "we don't measure this yet" |
| **G5** row actions menu | `ad-campaigns-table.tsx` — delete only; nothing invented |

### Verified locally (not CI)

`typecheck` clean · `bun run build` exit 0 (3m49s — the rule-7 bundle guard) ·
fast suite **89 files / 1120 tests** green · marketing permission suite **63/63**
green against local Postgres.

**Walkthrough executed through the real UI** (headless Chrome, real sign-up session,
per rule 12) — template applied → AI image generated and applied → AI audience
selected → schedule + budget → launch. Result persisted: `status=SCHEDULED`,
`externalId=null`, `totalAmount=4500`, `feeAmount=0`, creative `AI_GENERATED`,
metrics all zero. Live AI calls verified: copy generation (3 suggestions, correct
char/word/tone stamps), audience suggestions (3, each with a real rationale), image
generation (~28s, stored to our own bucket).

### Two defects the tests caught, both of the "403/422 for everyone" class

1. `toast.promise` returns a toast handle, not the mutation result — so the ad copy
   was **silently never saved** after campaign creation.
2. The `isoDay` TypeBox pattern lost its backslashes (`^d{4}-d{2}-d{2}$`), so
   `PATCH /:id/schedule` **422'd for every user including ADMIN**. This is exactly
   the defect rule 12 exists for, and only the controller-level test surfaced it.

A third was caught by the guardrail unit test: the price/percent regex missed the
Arabic form `٪25` (sign *before* the number), which is the commonest discount
spelling in Arabic ad copy.

### Known deviation from the Figma

Page header reads **«التسويق»**, not «الحملات الاعلانية» — the title derives app-wide
from the route segment and the sidebar entry is «التسويق». Overriding it would desync
the breadcrumb from the highlighted nav item.

**Dev data:** six demo rows (`MKC-DEV0..5`) plus one real launched campaign
(`MKC-GX13`) in the local dev clinic. Remove with
`DELETE FROM ad_campaign WHERE code LIKE 'MKC-DEV%'`.

## 1. Competitive research — what a marketing module actually contains

I looked at what vet PIMS ship as "marketing", and at general-purpose ERP/marketing
suites for the parts vet vendors under-build.

### 1.1 Veterinary PIMS

| Vendor | What their marketing/engagement surface is |
|---|---|
| **IDEXX (Cornerstone/Neo)** | Reminder compliance, lapsed-client outreach, newsletters to inbox or client portal, seasonal promotions |
| **Covetrus** | Client retention tactics: segmented lists, targeted outreach to overdue clients, review/reputation management, loyalty |
| **Provet Cloud** | Digital communication first: SMS + email campaigns, automated reminders; no native pet-owner app |
| **Digitail** | Strongest all-in-one: pet-parent app, engagement, wellness plans (recurring revenue), marketing + AI in one platform |
| **ALLYDVM** | Compliance-based reminders + built-in loyalty/rewards program |
| **PetsApp / Vetstoria / Weave / Demandforce** | Two-way messaging, review generation, reactivation journeys, online booking funnels |

**The consistently-reported outcomes** (why this module earns its keep):
automated reminders cut no-shows 25–35% (documented cases up to 60–75%); targeted
re-engagement brings back 10–18% of clients dormant 18+ months within 90 days.

### 1.2 General marketing suites (Odoo as the reference ERP shape)

Odoo splits marketing into five apps, and that split is the right mental model:

1. **Email Marketing** — drag-drop editor, segmentation, A/B testing, analytics
2. **SMS Marketing** — recipient lists, scheduling, bulk send
3. **Social Marketing** — plan/publish/manage organic posts across networks, one dashboard
4. **Marketing Automation** — workflow campaigns; branch on opened/clicked/replied
5. **Paid Ads** — campaign creation, budget, audience, performance

### 1.3 The paid-social layer (what the Figma is)

The 2026 state of the art for the ads half: AI writes on-brand primary text /
headlines / descriptions per creative, AI generates the image, the tool assembles
the campaign structure and pushes it to the platform's ads manager. Meta reports
~3% higher CTR on AI-generated text. Tools in this space (AdManage, AdStellar,
Heyflow) compress creative + campaign management + reporting into one wizard.

**This is exactly the product the 32 Figma screens describe.**

### 1.4 Conclusion — the full module map

```
/management/marketing
├── الحملات الاعلانية   Ad Campaigns   ← ★ THE 32 FIGMA SCREENS ARE ALL THIS
├── الجمهور والشرائح     Audiences & Segments
├── الرسائل الجماعية     Bulk SMS / WhatsApp / Email campaigns
├── الأتمتة              Automation journeys (reactivation, post-visit, birthday)
├── الولاء والإحالة      Loyalty & referral
├── السمعة والتقييمات    Reviews & reputation
└── التحليلات            Attribution & ROI
```

**Only the first branch is designed.** Everything else in §1.1–1.2 is
justified-by-research but undesigned, and must not be invented into the UI.
It is scoped here so the data model does not paint us into a corner.

---

## 2. The Figma — exact inventory of the 32 nodes

The 32 links are **not 32 screens.** They are ~18 distinct application states plus
~14 component variant sheets, all inside one feature: **الحملات الاعلانية**.

### 2.1 Full application frames (1836×1153)

| # | Node | Screen |
|---|---|---|
| 1 | `3104:537787` | **Campaigns list (populated).** 4 stat cards + toolbar + table |
| 2 | `3104:548053` | **Empty state** + create-button dropdown, 7 platforms |
| 3 | `3104:538216` | Wizard **step 1** — pristine (both selects on placeholder, empty copy box) |
| 4 | `3104:538697` | Step 1 — page select + **objective select** both open |
| 5 | `3104:539258` | Step 1 — objective chosen, copy box still empty |
| 6 | `3104:539739` | Step 1 — **tone popover** (3 sliders) |
| 7 | `3104:540226` | Step 1 — **template picker** popover (search + 5 category tabs) |
| 8 | `3104:540738` | Step 1 — template picker with **preview pane** filled + تأكيد القالب |
| 9 | `3104:541731` | Step 1 — **"جارٍ توليد نص الإعلان…"** progress |
| 10 | `3104:541252` / `3104:542219` | Step 1 — copy applied into the box; preview skeleton |
| 11 | `3104:542705` | Step 1 — **generated results list** (N suggestion cards) |
| 12 | `3104:543191` | **Media picker → المكتبة** (search + image grid) |
| 13 | `3104:543700` / `3104:544221` | Media picker → **توليد بالذكاء الاصطناعي** (prompt + 10 style chips) |
| 14 | `3104:544742` | AI image **generating** progress + إلغاء |
| 15 | `3104:545251` | AI image **result** + تطبيق / اعادة |
| 16 | `3104:545755` / `3104:546234` | **Step 2 — الجمهور** (AI recommendations + saved audiences) |
| 17 | `3104:546713` | **Step 3 — الجدول والميزانية** (payment method + summary + إطلاق الحملة) |
| 18 | `3104:547178` | **Launching modal** — "جاري معالجة الحملة الإعلانية" + إلغاء |
| 19 | `3104:547622` | List + **success toast** "تم اطلاق الحملة بنجاح" |

### 2.2 Component variant sheets

`537437` Facebook post-preview card (4 states: skeleton → branded → +copy → +image) ·
`537661` tone slider · `537670` AI suggestion card (default/hover/pressed) ·
`537695` library thumbnails · `537702` image-prompt input (empty/filled) ·
`537709` style chip · `537714` audience card (3 states) · `537780` saved payment
row · `548439` platform icon set (7) · `548454` platform menu item (default/hover).

### 2.3 Screen-by-screen content contract

**List** — stats: `إجمالي الحملات الاعلانية`, `الحملات النشطة`,
`الحملات غير النشطة`, `اجمالي المصروفات`. Table columns (RTL, first = rightmost):
checkbox · `اسم الحملة الاعلانية` · `المكان` (platform badge, brand-coloured) ·
`عدد الظهور` · `التفاعل` · `الوصول` · `الحالة` (نشيط / غير نشيط, dropdown-editable) ·
`المدة` ("30 يوم") · `التاريخ` · `الإجراءات` (⋯).

**Wizard shell** — split dialog. Right pane (RTL-leading): 3-step progress
`إنشاء الإعلان → إنشاء الجمهور → الجدول والميزانية`. Left pane: **live platform
preview** that fills in as the user types — this is the centrepiece and must be a
real, reactive preview, not a static image.

**Step 1 fields** — `حساب فيسبوك` (page select, required) · `الهدف` (required)
with 6 options: `زيادة الوعي بالعلامة التجارية`, `توليد العملاء المحتملين`,
`زيارات المتجر`, `جمع تعليقات العملاء`, `زيادة المبيعات`, `التوعية بالمنتج`.
Copy box with **`اختر الأسلوب`** (tone: رسمي↔غير رسمي, ودي↔حازم, متفائل↔متشائم),
**`قالب`** (templates in 5 categories: تحسين محركات البحث, إعلانات مدفوعة,
المبيعات, وسائل التواصل, تسويق بريدي), a mic (voice input) and
`انشاء بالذكاء الاصطناعي`. Results render as cards stamped
`65 شخصية · 28 كلمة · عفوي` with `اقتراحات مشابهة` and `تطبيق`.

**Media picker** — 4 tabs: `المكتبة` · `توليد بالذكاء الاصطناعي` · `رفع صورة` ·
`Unsplash` (greyed = out of scope for v1). Style chips: بدون, احتراق, فوتوغراف,
فن رقمي, رسم خطي, فيلم تناظري, سينمائي, نسيج, فن البكسل, جمالي.

**Step 2** — `توصيات الذكاء الاصطناعي` with a `لماذا هذا موصى به؟` explainer, then
`الجمهور المتاح` + `إضافة جمهور جديد`. Audience card fields: `العمر`, `الموقع`,
`اللغة`, `الوصول المتوقع`.

**Step 3** — `طريقة الدفع` (saved cards + `إضافة طريقة دفع`) and `الملخص`
(`المجموع الفرعي`, `الميزانية`, `الرسوم`, `الإجمالي`), then `إطلاق الحملة`.

---

## 3. Gaps and conflicts in the design — must be resolved before coding

These are not nitpicks; each one blocks a screen.

| # | Gap | Why it blocks |
|---|---|---|
| **G1** | **Step 3 is called `الجدول والميزانية` but no schedule or budget inputs are drawn.** Only payment method + summary exist. | The list shows `المدة` = "30 يوم" and the summary shows `الميزانية` = 9,000 — both must come from somewhere. We need start/end date, daily-vs-lifetime budget, and bid strategy fields. **Undesigned.** |
| **G2** | The summary does not add up: `المجموع الفرعي 15,000` + `الميزانية 9,000` + `الرسوم 2,000` → `الإجمالي 15,000`. | Placeholder numbers, but the *semantics* of the four lines are undefined. What is subtotal vs budget? |
| **G3** | **`إضافة جمهور جديد` has no form drawn**; `لماذا هذا موصى به؟` has no panel drawn. | Two interactive affordances with no destination. |
| **G4** | **Campaign detail / performance view does not exist.** | The table has `عدد الظهور / التفاعل / الوصول` but nowhere to drill in. Every competitor has this. |
| **G5** | `⋯` row actions menu is not drawn. | Pause/resume/duplicate/delete/view are all implied by a `الحالة` dropdown but unspecified. |
| **G6** | The create dropdown offers **7 platforms**; every wizard screen is **Facebook-only** (`حساب فيسبوك`, FB post preview, FB reactions). | Six of seven paths lead to undesigned screens. |
| **G7** | **The paid-media billing model is undefined and is a business/legal decision, not a UI one.** | See §4. |

---

## 4. The one decision that changes everything: how ads actually get bought

The Figma shows the clinic saving a **card inside Elite Vet**, seeing a
**subtotal + our fees**, and pressing `إطلاق الحملة`. That is a **reseller /
agency** model: Elite Vet takes the money and buys the media. It is not the only
option, and the three options produce genuinely different systems:

| Option | What we build | Cost / risk |
|---|---|---|
| **A. Bring-your-own-ad-account (OAuth)** | Clinic connects its own Meta account; we call the Marketing API on their behalf; **they** are billed by Meta. No card in our UI. | Needs Meta App Review + Business Verification + `ads_management` scope. Weeks of review. But no money touches us. Contradicts the drawn payment step. |
| **B. Reseller (what the Figma draws)** | We hold a card, charge the clinic, spend from **our** ad account, add `الرسوم`. | We become a media buyer: PCI scope, refunds, ad-policy liability for content we generate, VAT, and Meta's reseller/partner terms. Materially heavier. |
| **C. Draft-and-export (v1-safe)** | We do the full AI creative + audience + budget workflow and produce a **ready-to-launch draft**; the clinic launches from Meta's own Ads Manager, or a staff member confirms. Metrics entered/imported, not live. | Ships fast, zero platform review, zero payment risk. The wizard is unchanged; only `إطلاق الحملة` behaves differently. |

**Recommendation: build the wizard so the launch step is pluggable, ship on C, and
add A behind the same interface.** The AI creative studio — which is the actual
differentiator and 80% of the drawn screens — is identical in all three. Do not
let the payment step gate the module.

---

## 5. Data model (Prisma)

Repo conventions: camelCase columns, `@@map` snake_case tables, `cuid()` ids,
`clinicId` tenant, `Decimal` money.

```prisma
enum AdPlatform { FACEBOOK INSTAGRAM LINKEDIN TIKTOK X PINTEREST SNAPCHAT }

enum AdCampaignStatus { DRAFT PENDING SCHEDULED ACTIVE PAUSED COMPLETED FAILED }

enum AdObjective {
  BRAND_AWARENESS      // زيادة الوعي بالعلامة التجارية
  LEAD_GENERATION      // توليد العملاء المحتملين
  STORE_VISITS         // زيارات المتجر
  CUSTOMER_FEEDBACK    // جمع تعليقات العملاء
  SALES                // زيادة المبيعات
  PRODUCT_AWARENESS    // التوعية بالمنتج
}

enum AdCreativeSource { AI_GENERATED LIBRARY UPLOAD TEMPLATE }

model AdCampaign {
  id            String   @id @default(cuid())
  code          String   @unique            // MKC-XXXX via generateUniqueCode
  clinicId      String
  branchId      String?
  name          String
  platform      AdPlatform
  objective     AdObjective
  status        AdCampaignStatus @default(DRAFT)
  socialAccountId String?                   // → MarketingSocialAccount
  audienceId    String?                     // → AdAudience
  // schedule & budget — resolves G1
  startsAt      DateTime?
  endsAt        DateTime?
  durationDays  Int?
  budgetAmount  Decimal? @db.Decimal(12, 2)
  budgetKind    AdBudgetKind?               // DAILY | LIFETIME
  currency      String   @default("SAR")
  feeAmount     Decimal? @db.Decimal(12, 2)
  totalAmount   Decimal? @db.Decimal(12, 2)
  // outward linkage — kept nullable so option C works with no platform at all
  externalId    String?
  externalError String?
  launchedAt    DateTime?
  createdById   String
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
  @@index([clinicId, status])
  @@map("ad_campaign")
}

model AdCreative {
  id           String @id @default(cuid())
  campaignId   String
  primaryText  String            // نص الإعلان
  headline     String?
  description  String?
  linkUrl      String?
  imageUrl     String?           // S3 key or remote
  source       AdCreativeSource
  aiPrompt     String?           // the image prompt, for اعادة
  aiStyle      String?           // style chip
  toneFormal   Int?              // 0-100, the three sliders
  toneFriendly Int?
  toneOptimist Int?
  @@map("ad_creative")
}

model AdAudience {
  id            String  @id @default(cuid())
  clinicId      String
  name          String                       // "جمهور التسويق"
  ageMin        Int?
  ageMax        Int?
  locations     String[]  @default([])
  languages     String[]  @default([])
  interests     String[]  @default([])
  estimatedReach Int?                        // الوصول المتوقع
  isAiSuggested Boolean @default(false)
  aiRationale   String?                      // powers «لماذا هذا موصى به؟» → G3
  @@map("ad_audience")
}

model AdCampaignMetric {          // one row per campaign per day
  id          String   @id @default(cuid())
  campaignId  String
  date        DateTime @db.Date
  impressions Int      @default(0)   // عدد الظهور
  reach       Int      @default(0)   // الوصول
  engagements Int      @default(0)   // التفاعل
  clicks      Int      @default(0)
  spend       Decimal  @default(0) @db.Decimal(12, 2)
  @@unique([campaignId, date])
  @@map("ad_campaign_metric")
}

model MarketingSocialAccount {     // «الصفحة الرسمية . Elitevet»
  id           String  @id @default(cuid())
  clinicId     String
  platform     AdPlatform
  externalId   String
  name         String
  accessToken  String?             // encrypted at rest; null under option C
  connectedAt  DateTime @default(now())
  @@unique([clinicId, platform, externalId])
  @@map("marketing_social_account")
}

model AdCopyTemplate {             // the «قالب» picker
  id        String @id @default(cuid())
  clinicId  String?                // null = global seeded template
  category  AdTemplateCategory     // SEO | PAID_ADS | SALES | SOCIAL | EMAIL
  title     String
  body      String
  @@map("ad_copy_template")
}
```

> **Rule-8 note:** there is no local DB in the documented workflow; author these
> via `prisma migrate diff` → manual migration folder → CI. See
> `noninteractive-migrate-and-routetree` and check whether the local Docker
> Postgres on 5433 is the current reality before assuming CI-only.

Room left for §1.4's undesigned branches (`MarketingSegment`, `MarketingJourney`,
`LoyaltyAccount`) without reshaping any of the above.

---

## 6. Server resources

Four-file convention per resource, each registered in `src/server/index.ts`.

> ⚠️ **`elysia-chain-at-ts-depth-ceiling`** — `src/server/index.ts` breaks
> typecheck at the 67th top-level `.use()`. Marketing adds several controllers;
> **group them into one `marketingServer` sub-Elysia** and `.use()` that once.

| Resource | Responsibility |
|---|---|
| `src/server/ad-campaigns/` | CRUD, status transitions, launch orchestration, list + stats |
| `src/server/ad-audiences/` | saved audiences, AI suggestions + rationale |
| `src/server/ad-creatives/` | copy generation, image generation, templates, media library |
| `src/server/marketing-accounts/` | connected social pages/accounts |

**AI services** (not DAOs — business logic, mirroring `ai-course.service.ts`):

- `ad-copy.service.ts` — objective + page + tone triple + optional template →
  N suggestions, each with `charCount`/`wordCount`/`toneLabel` (the card stamp).
  Zod-parsed, Arabic-first. `اقتراحات مشابهة` = re-prompt seeded with the chosen card.
- `ad-image.service.ts` — prompt + style chip → image. Uses OpenAI image
  generation via the existing key; result stored to S3 through
  `src/server/uploads/`. Must support cancel (G: `إلغاء` is drawn) and `اعادة`.
- `ad-audience.service.ts` — objective + clinic profile → suggested audiences
  **with `aiRationale`**, which is what makes `لماذا هذا موصى به؟` real rather
  than decorative.

**Guardrails.** Ad copy is outward-facing content published under the clinic's
name. Reuse `src/server/agent/guardrails.ts` and add ad-specific rules: no medical
claims, no guaranteed outcomes, no competitor naming, no pricing we cannot verify.
This is the single highest-risk part of the module.

**Permissions** — add to `src/lib/permissions.ts`:
`marketing.view`, `marketing.create`, `marketing.edit`, `marketing.delete`,
`marketing.launch` (separate — spending money is not editing), `marketing.billing`.
Gate the route with `beforeLoad` like `management/documents.tsx`, and enforce in
the controller. **Per CLAUDE.md rule 12: every gated endpoint needs an
authorized-passes / unauthorized-403 controller test.**

---

## 7. Client structure

```
src/features/marketing/
├── ad-campaigns/
│   ├── components/
│   │   ├── ad-campaigns-page.tsx          # Stats + TableToolbar + TableDataView
│   │   ├── ad-campaigns-table.tsx
│   │   ├── platform-badge.tsx             # 548439/548454
│   │   ├── create-campaign-menu.tsx       # 7-platform dropdown
│   │   ├── campaign-wizard-dialog.tsx     # shell: stepper + split panes
│   │   ├── steps/step-ad.tsx | step-audience.tsx | step-budget.tsx
│   │   ├── ad-preview-card.tsx            # 537437 — the live platform preview
│   │   ├── ad-copy-editor.tsx
│   │   ├── tone-popover.tsx               # 537661/539739
│   │   ├── template-popover.tsx           # 540226/540738
│   │   ├── ai-suggestion-card.tsx         # 537670
│   │   ├── media-picker-popover.tsx       # 543191/543700/544742/545251
│   │   ├── style-chips.tsx                # 537709
│   │   ├── audience-card.tsx              # 537714
│   │   ├── payment-method-row.tsx         # 537780
│   │   └── launching-dialog.tsx           # 547178
│   ├── hooks/     # use-ad-campaigns, use-create-campaign, use-generate-ad-copy, …
│   └── data/      # objectives, style chips, platform meta (icon + brand colour)
```

**Types** — Zod schemas live in `src/server/ad-campaigns/ad-campaigns.type.ts`;
forms use `z.infer`; responses are `Prisma.AdCampaignGetPayload<…>`. No
hand-written shapes anywhere (AGENTS.md "Type Reuse").

### RTL notes specific to these screens

- The wizard is a **split dialog**: preview pane visually left, form pane visually
  right. In RTL flow the **form is the first DOM child**. Order the DOM to the
  flow; do not patch with `justify-*` (RTL rule 1).
- **`radix-tabs-forces-ltr`** — the media picker tabs and the template category
  tabs are Radix `Tabs`; both need explicit `dir="rtl"` on the root or the whole
  panel mirrors.
- **`radix-select-rtl-popper`** — the page select and objective select need
  `position="popper"` on `SelectContent`.
- The stepper's connector line and its ✓/active states must run right→left.
- Latin platform names (Facebook, TikTok) and card numbers (`•••• N020`) are
  LTR islands — `dir="ltr"` on those spans only.
- `DialogContent` is `grid`; use the `max-h-[..vh]` + `overflow-y-auto` body
  pattern, not `flex flex-col` + `flex-1` (RTL rule 7).
- Header/footer bars: `border-b px-4 py-2` / `border-t px-4 py-2` with
  `size="sm"` buttons (`header-footer-bars-px4-py2`).
- Radius is a flat 4px token everywhere — do not hardcode `rounded-[Npx]`.

### i18n

Accounting screens ship Arabic-only by owner decision; this module is drawn
Arabic-only. **Ship Arabic-only, but keep every string in a constants/data file
rather than inline JSX**, so the eventual EN pass is mechanical instead of the
~1,249-line debt accounting accumulated.

---

## 8. Phased plan

One task = one commit, referencing this doc (`feat(marketing): … [MK2.1]`).
Each phase ends green in CI before the next starts (CLAUDE.md rules 8 & 11).

### [MK0] Foundations — *unblocks the dead nav link*
- `[MK0.1]` `MARKETING_*` permissions + defaults grant
- `[MK0.2]` Prisma models §5 + migration authored via `migrate diff`
- `[MK0.3]` Route `management/marketing.tsx` + `beforeLoad` guard + empty page shell
- **Exit:** nav link resolves; Migration Check green.

### [MK1] Campaigns list — *Figma screens 1, 2, 19*
- `[MK1.1]` `ad-campaigns` 4-file resource: list + stats + filters + pagination
- `[MK1.2]` `ad-campaigns-page.tsx` — `Stats` + `TableToolbar` + `TableDataView`
- `[MK1.3]` `platform-badge` + status dropdown cell. **`⋯` row actions render but open a menu with only the drawn/derivable actions; anything undrawn stays out (G5 → blocked on design, D3).**
- `[MK1.4]` Empty state + create menu: **Facebook & Instagram enabled, other five disabled with «قريبًا» tooltip (D2)**
- `المدة` column renders `—` until G1 lands (D3)
- `[MK1.5]` Controller tests: authorized-passes / unauthorized-403 on every route
- **Exit:** list is real against seeded data; RTL verified by screenshot, not by reading classes.

### [MK2] Wizard shell + step 1 without AI — *screens 3, 4, 5, 10*
- `[MK2.1]` Dialog shell, 3-step stepper, prev/next/cancel, draft persistence
- `[MK2.2]` Page select + objective select (6 options), required validation
- `[MK2.3]` `ad-preview-card` wired to live form state (all 4 variants of `537437`)
- **Exit:** a DRAFT campaign can be created and reopened. **No AI yet — the wizard must be fully usable without it.**

### [MK3] AI copy studio — *screens 6, 7, 8, 9, 11*
- `[MK3.1]` `ad-copy.service.ts` + guardrails + Zod result schema
- `[MK3.2]` Tone popover (3 sliders) → prompt parameters
- `[MK3.3]` Template model + seed + picker popover with preview (**G3-adjacent**)
- `[MK3.4]` Generation progress, results list, `تطبيق`, `اقتراحات مشابهة`
- **Exit:** copy generates in Arabic, respects tone + objective, passes guardrails; failure degrades to a usable manual box.

### [MK4] Media — *screens 12, 13, 14, 15*
- `[MK4.1]` Media library (list clinic images from S3) + `رفع صورة`
- `[MK4.2]` `ad-image.service.ts` + style chips + progress + cancel + `اعادة`
- `[MK4.3]` Apply to creative, persist to S3
- **Unsplash tab stays disabled** (it is greyed in the design; needs a new API key — out of v1).

### [MK5] Audiences — *screen 16*
- `[MK5.1]` `ad-audiences` resource + saved audiences (`الجمهور المتاح` list)
- `[MK5.2]` AI suggestions **with rationale** persisted on `AdAudience.aiRationale`
- 🚧 `لماذا هذا موصى به؟` panel and `إضافة جمهور جديد` form are **undrawn (G3)** —
  both render as **disabled controls with a «قريبًا» reason tooltip** until design
  lands. The rationale is still stored, so the panel is a pure view when it arrives.

### [MK6] Launch — *screens 17, 18, 19* (partial under D3)
- 🚧 `[MK6.1]` **BLOCKED on design (G1/G2).** Schedule + budget fields and the four
  summary lines. Nothing invented. Until then `startsAt`/`endsAt`/`budgetAmount`
  stay null and the summary renders `—`.
- `[MK6.2]` `CampaignLauncher` interface + **draft-and-export implementation (D1)**.
  No card is stored, no charge is made; the drawn payment section is summary-only.
- `[MK6.3]` Launching modal + cancel + success toast + failure path (all drawn)
- **Exit:** end-to-end walkthrough executed through the real UI per CLAUDE.md rule 12.

### [MK7] Detail & performance — 🚧 **deferred, undesigned (G4, D3)**
Table shows `عدد الظهور / التفاعل / الوصول` with no drill-in drawn. `AdCampaignMetric`
is modelled now so no migration is needed later, but **no screen is built** until
design exists. Rows are not clickable in v1.

### Later (researched, undesigned — do not build without design)
Bulk SMS/WhatsApp/email · reactivation & post-visit automation · loyalty &
referral · reviews/reputation · attribution back to appointments and invoices.
**Attribution is where this module actually pays for itself** — the ability to say
"this campaign produced 14 appointments and 22,400 SAR" is the ROI story, and no
screen for it exists yet.

---

## 9. Cross-module integration

- **Finance/Accounting.** Campaign spend is a real expense. The `اجمالي المصروفات`
  stat must reconcile with `Expense`. Follow the C3 strangler pattern: an adapter
  posts campaign spend into the ledger with a parallel-run reconciliation report
  showing zero diff. Do **not** build a second, private money ledger inside
  marketing. Use `ExpenseSource` + `sourceId` for idempotent posting.
- **Patients/Owners.** Audiences for the later CRM branches derive from
  `Owner`/`Patient`; keep `AdAudience` platform-shaped and add a separate
  `MarketingSegment` for internal lists. Respect `marketingOptIn` on the pet
  portal (`pet-portal.dao.ts:270`) — consent is already modelled, honour it.
- **Agent.** A `marketing.skill.ts` (alongside `patients`/`reports`/`tasks`) lets
  staff ask "how did last month's campaign do?" Cheap once the DAO exists.

---

## 10. Open items

**Resolved** — §4 billing model → **D1**; platform scope → **D2**; how to treat
gaps → **D3**. See the decisions table at the top.

**Still blocking specific tasks — needs Figma before the task can start:**

| Gap | Blocks | What is needed |
|---|---|---|
| **G1** | `[MK6.1]`, `المدة` column, `الميزانية` line | Schedule + budget fields on step 3: start/end date, daily-vs-lifetime budget, bid strategy |
| **G2** | `[MK6.1]` | Semantics of the four summary lines — what is `المجموع الفرعي` vs `الميزانية`, and what are `الرسوم` under D1 where we charge nothing? |
| **G3** | `[MK5]` two controls | `إضافة جمهور جديد` form; `لماذا هذا موصى به؟` panel |
| **G4** | `[MK7]` entirely | Campaign detail / performance screen |
| **G5** | `[MK1.3]` menu contents | The `⋯` row-actions menu |

**Still open, non-blocking:** who owns liability for AI-generated ad copy published
under a clinic's name, and whether a human approval step is required before a
campaign leaves DRAFT. Under D1 nothing auto-publishes, which defuses this for v1
— but it returns the moment option A lands.

---

## Sources

- [IDEXX — Marketing Guide for Veterinary Practice](https://software.idexx.com/resources/guide/marketing-your-veterinary-practice)
- [Covetrus — Veterinary Marketing: 9 Tactics](https://software.covetrus.com/apac/veterinary-insights/article/practice-solutions/veterinary-marketing/)
- [Provet Cloud — Digital communication strategies](https://www.provet.com/blog/digital-communication-strategies-to-simplify-veterinary-marketing)
- [Digitail — Best Veterinary Software Guide](https://digitail.com/blog/best-veterinary-software-guide/)
- [PetsApp — Best PIMS with Client Communication & Engagement](https://petsapp.com/blog/best-veterinary-practice-management-software)
- [Vet Software Hub — Client Communication Software Compared 2026](https://www.vetsoftwarehub.com/article/veterinary-client-communication-software-compared-2026)
- [US Tech Automations — Veterinary Client Retention Automation](https://ustechautomations.com/resources/blog/veterinary-client-retention-automation-how-to)
- [Odoo — Marketing Automation documentation](https://www.odoo.com/documentation/19.0/applications/marketing/marketing_automation.html)
- [Odoo — Marketing apps overview](https://www.odoo.com/documentation/19.0/applications/marketing.html)
- [Heyflow — How to Create Meta Ads Campaigns With AI](https://heyflow.com/blog/how-to-create-meta-ads-campaigns-with-ai/)
- [AdManage — AI Ad Copy Generator for Meta Ads](https://admanage.ai/blog/ai-ad-copy-generator-meta-ads)
- [AdStellar — Meta Campaign Automation for SaaS](https://www.adstellar.ai/blog/meta-campaign-automation-for-saas-companies)
