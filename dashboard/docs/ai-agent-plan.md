# Elite Vet — AI Agent ("Agent") Plan

> Status: **Draft for discussion**. This is a thinking document, not a final spec. Tweak freely.
> Owner: TBD · Last updated: 2026-07-15
> Design reference: Figma "Elite Vet SaaS OS Design" — frames `4060-407849` (launcher), `4230-589021` (command library), `4063-415518` (inline prompt w/ field chips), `4090-430178` (working state), `4096-432029` (action-taken result card).

---

## 1. What we're building (in one paragraph)

A chat-style **Agent** (branded **"أوكس AI" / Oaks AI**, Beta) docked as a side panel over the app that can take *real actions* in the system. The user picks a **preset command** ("skill") or types in natural language. The chosen preset renders **as a ready sentence with editable field-chips embedded inline** (mad-libs style) — some slots pre-filled from context, some placeholders to pick. The Agent (1) searches our own DB for the best-matching entities (owner, patient, doctor, service, room, slot) to fill slots, (2) shows the completed prompt for review, (3) on send, executes through the *existing* backend, and (4) streams back a **result card** showing exactly what was created (with its generated code, e.g. `#GAM-21`, and an execution time like "4 ثوانٍ"). The Agent **knows the current page** (e.g. "الموارد البشرية > الموظفين") and suggests context-relevant presets. A per-clinic **guardrails/settings** layer constrains what it may do.

The design frames the product to the user as: *"أنشئ المهارات لتمكين الوكلاء AI من القيام بالمهام بدلاً منك"* — **"create skills that let AI agents do tasks for you."** Our **action presets** *are* those skills.

Three pillars, decided:

| Pillar | Decision |
|---|---|
| **Autonomy** | **Propose → human confirms.** Reads may auto-run; every write requires an explicit send/confirm. Nothing hits the DB unconfirmed. |
| **LLM provider** | **Multi-provider, user-selectable** via the Vercel AI SDK — OpenAI (`@ai-sdk/openai`) **and** Anthropic (`@ai-sdk/anthropic`), chosen per-conversation from the model picker (the design shows "Sonnet 4.2" selected). Behind a provider registry so adding/removing a model is config, not code. |
| **Action model** | **Hybrid, template-first.** A catalog of typed **action presets**. Each preset carries a **prompt template with typed field-slots** (the inline mad-libs UI) *and* an input schema. The LLM (or a preset pick) selects the action; resolvers fill slots from DB search; the schema constrains, validates, and gates it. |

---

## 2. What the design tells us (frame-by-frame)

The Figma flow is more specific than a generic chatbot — it drives several core decisions:

| Frame | What it shows | Consequence for the build |
|---|---|---|
| `4060-407849` **Launcher** | Greeting + subtitle ("skills that let agents do tasks for you"), a row of **quick-action chips** (`إضافة موظفين`, `ملخص أسبوعي`, `إنشاء زيارات`, `عرض جميع الأوامر`), a **model picker** ("Sonnet 4.2"), and a composer breadcrumb showing the **current page** ("الموارد البشرية > الموظفين"). | Empty state = curated preset chips, not a blank box. Model picker is real (multi-provider). Context breadcrumb → §7 context contract. |
| `4230-589021` **Command Library** | Agent is a **docked right-side panel** (Beta) over the live employees table; a **"مكتبة الأوامر" (Command Library)** popover with search + list (`إضافة موظف`, `إنشاء هيئة`, `إضافة مريض`, `إنشاء زيارة`). | Presets are a **browsable, searchable catalog** — first-class UI, not just LLM-internal tools. The panel overlays real pages (doesn't navigate away). |
| `4063-415518` **Inline prompt** | The preset renders as a sentence with **editable field-chips**: *"أضف موظفًا باسم `[أحمد محمد]`, بتخصص `[حدد التخصص]`, بدوام `[حدد الدوام]`, بفرع `[حدد الفرع]`, وطبّق له دور `[حدد الدور]`, مع إرسال دعوة."* Some slots pre-filled, some placeholder. | **The signature interaction.** Preset = template string + typed slots. Slots are the schema fields; pre-fill comes from resolvers/context; placeholders are pickers. See §3.1. |
| `4090-430178` **Working state** | Filled prompt shows as a user bubble; assistant shows *"جاري العمل، يرجى الانتظار..."* with **skeleton loaders**. | Streaming/pending UX. The stream carries status → skeleton → result. |
| `4096-432029` **Result card** | Collapsible header *"استغرق التنفيذ 4 ثوانٍ"* (took 4s); *"تم إنشاء ملف للموظف #GAM-21"* (created record #GAM-21); an entity card (name, `D-1234`, "غير مفعل" badge) + a **details table** (phone, email, specialization, role, employment type, dates). | Result card shows the **generated code** (our `generateUniqueCode`), an **execution duration**, entity summary + field table, and a **status badge**. This is the post-write confirmation of what actually happened. |

---

## 3. Where this fits the existing codebase

We are **greenfield** on AI — no `ai`, `@ai-sdk/*`, `openai`, `@anthropic-ai/*`, or streaming infra exists yet. But the surrounding architecture is a clean fit:

- **API layer:** Elysia at `src/routes/api.$.ts` → `src/server/app.ts` (prefix `/api`) → `src/server/index.ts` chains controllers. We add one new resource: `src/server/agent/`.
- **Elysia ↔ AI SDK:** Elysia streams AI SDK responses natively (`return stream.toTextStreamResponse()` / `sse(stream.textStream)`). This is our transport.
- **Actions = existing controllers.** The Agent does **not** get its own write paths. Every action calls the *same* DAOs/controllers the UI uses, so it inherits `clinicId` scoping, conflict checks, invoice locks, exam-completion rules, and Arabic error messages for free.
- **Multi-tenancy:** the `requireClinic` macro already resolves `{ clinicId, userId }` from the better-auth session. The Agent runs **inside** that macro — it can only ever see/act on the active clinic.
- **"Visit" = `Appointment`.** There is no `Visit` model. Everything visit-related maps to the `Appointment` resource (`src/server/appointments/`). See §7.
- **Codes:** result cards show human codes (`#GAM-21`, `D-1234`) — exactly the `generateUniqueCode` outputs the DAOs already produce. Nothing new needed; we surface what the create returns.
- **Guardrails settings:** the per-clinic `Clinic*Settings` pattern already exists (`ClinicSettings`, `ClinicSchedulingSettings`, …). We add `ClinicAgentSettings` the same way. See §9.
- **Types:** all agent I/O types derive from Zod schemas (`z.infer`) or Prisma payloads (`Prisma.XGetPayload`) per `AGENTS.md`. No hand-written response interfaces.

---

## 4. Core concept: the Action Preset (a "skill")

The heart of the design. An **action preset** is a typed, self-describing unit of "something the Agent can do" — what the UI calls a *مهارة/أمر* (skill/command) in the Command Library. It is the bridge between the inline-prompt UX and safe, validated writes.

Each preset declares:

```ts
// src/server/agent/actions/action.type.ts  (shape, illustrative)
type ActionPreset<TInput> = {
  key: string;                    // "create-visit", "add-employee", "find-patient"
  subAgent: SubAgentKey;          // "hr" | "visits" | "inventory" | "workflow" | "reports" | "general"
  kind: "read" | "write";         // gates autonomy: reads may auto-run, writes always confirm
  title: string;                  // Arabic label shown in the Command Library
  description: string;            // fed to the LLM so it knows when to pick this action
  icon?: string;                  // Tabler icon for the chip/library row

  // Where this preset is most relevant — used for context-aware ranking (§7):
  contexts?: string[];            // e.g. ["hr.employees"] → surfaced on the employees page

  inputSchema: z.ZodType<TInput>; // required + optional fields (source of truth for validation)

  // THE INLINE PROMPT (frame 4063): a sentence template with typed slots.
  // Slots reference schema fields; each renders as an editable chip.
  promptTemplate: PromptTemplate<TInput>;   // see §4.1

  // How the Agent fills slots it wasn't given, by searching our DB:
  resolvers: FieldResolver<TInput>[];   // resolve ownerId from "Rex's owner", staffId from "Dr. Sara", …

  // Guardrail hook — can this clinic/user run this now?
  guard: (ctx: AgentContext, input: Partial<TInput>) => GuardResult;

  // The actual effect — calls the existing DAO/controller. ONLY runs post-confirmation.
  execute: (ctx: AgentContext, input: TInput) => Promise<ActionResult>;

  // Builds the post-execution result card (frame 4096): code, duration, entity + field table, badge.
  toResultCard: (result: ActionResult, input: TInput) => ResultCard;
};
```

Why presets (vs. exposing raw endpoints to the LLM):
- **Predictable & auditable** — a fixed, browsable catalog (the Command Library), each with its own guard, validation, template, and card.
- **The inline-prompt UX** — a preset's `promptTemplate` *is* the mad-libs sentence; slots map 1:1 to schema fields.
- **Schema-constrained tool-calling** — the LLM still orchestrates freely, but its output validates against `inputSchema` before we build a prompt or execute. Bad/hallucinated fields fail closed.
- **Guardrails per action** — a clinic can disable `create-visit` for MEMBER role without touching the model.

### 4.1 The prompt template & field-slots (frame `4063-415518`)

This is the signature interaction. A `promptTemplate` is a localized sentence with **typed slots** interleaved:

```ts
// Illustrative — "add-employee" preset
promptTemplate: {
  ar: [
    text("أضف موظفًا باسم "),
    slot("name",           { kind: "text",   placeholder: "أدخل الاسم" }),
    text("، بتخصص "),
    slot("specializationId", { kind: "select", source: "specializations", placeholder: "حدد التخصص" }),
    text("، بدوام "),
    slot("employmentType", { kind: "enum",   enum: "EmploymentType", placeholder: "حدد الدوام" }),
    text("، بفرع "),
    slot("branchId",       { kind: "select", source: "branches",       placeholder: "حدد الفرع" }),
    text("، وطبّق له دور "),
    slot("roleId",         { kind: "select", source: "staffRoles",     placeholder: "حدد الدور" }),
    text("، مع إرسال دعوة."),
  ],
}
```

Slot `kind`s cover the field types we need: `text`, `select` (async-sourced from a DAO, scoped to `clinicId`), `enum` (from a Prisma enum via prismabox), `date`/`datetime` (slot picker backed by `getSlots` for visits), `entity-ref` (resolved patient/owner/staff). Each slot's **value** may arrive pre-filled (from a resolver or page context) or empty (renders as the Arabic placeholder chip, e.g. `حدد التخصص`).

The template lives **in the preset definition** (server-authoritative), so the frontend renders chips from a declarative spec rather than hard-coding each sentence. Arabic/English strings come from `translation.json`; RTL chip layout follows `AGENTS.md` rules.

### 4.2 The "auto-fill best matches" mechanic (field resolvers)

Your "fills the rest auto by finding the best matches on the system." A **resolver** turns a fuzzy reference into a concrete slot value by searching our DB (scoped to `clinicId`):

- `"ركس"` → search `patient` by `nameNormalized` → 1 strong match fills `patientId` + `ownerId`; several → pick-list; none → offer `create-patient`.
- `"دكتورة سارة"` → search `staff` where `prefix = DR` + name match **and** provides the requested service (reuse `findStaffByServices`).
- `"بكرة الصبح"` → resolve to a concrete slot via `getSlots` (`staffId` + `date` + `durationMinutes`).
- **Page context** (§7) pre-fills too — on the employees page, `branchId` may default to the active branch.

Resolvers return `{ status: "resolved" | "ambiguous" | "not-found", candidates, value }`. Ambiguity becomes a slot the user picks — never a silent guess. This serves "give the choice for the user to take."

---

## 5. High-level architecture

```
┌────────────────────────────────────────────────────────────────┐
│  Client — docked side panel (src/features/agent/)              │
│  • Launcher: greeting + preset chips + Command Library         │
│  • Inline prompt renderer: template → editable field-chips     │
│  • Streams tokens/status over SSE (working → skeleton → card)  │
│  • Result card: code, duration, entity + field table, badge    │
│  • Model picker (multi-provider)                               │
│  • Sends current-page context with every request               │
└───────────────┬────────────────────────────────────────────────┘
                │  SSE (text + structured action/result events)
┌───────────────▼────────────────────────────────────────────────┐
│  Elysia:  src/server/agent/agent.controller.ts                 │
│  requireClinic → { clinicId, userId }                          │
│                                                                │
│  GET  /agent/presets?context=hr.employees  → ranked catalog   │
│  POST /agent/chat            → run LLM turn, stream response   │
│  POST /agent/actions/:id/confirm  → execute a drafted action  │
│  GET  /agent/actions/:id     → fetch a drafted/pending action │
└───────────────┬────────────────────────────────────────────────┘
                │
   ┌────────────▼───────────┐     ┌───────────────────────────┐
   │  Agent Core            │     │  Guardrails               │
   │  (Vercel AI SDK)       │────▶│  ClinicAgentSettings +    │
   │  • provider registry   │     │  role/permission checks   │
   │    (OpenAI | Anthropic)│     └───────────────────────────┘
   │  • streamText          │
   │  • tools = preset      │     ┌───────────────────────────┐
   │    catalog (per clinic,│────▶│  Existing DAOs (read)     │
   │    ranked by context)  │     │  patients/staff/slots/…   │
   │  • field resolvers ────┼────▶└───────────────────────────┘
   │  • system prompt (AR)  │
   └────────────┬───────────┘     ┌───────────────────────────┐
                │  drafts a write  │  Existing controllers/DAO │
                ▼                  │  (write) — appointments,  │
   ┌────────────────────────┐  on │  staff, patients, …       │
   │  AgentAction (pending) │────▶│  inherits ALL validation  │
   │  DRAFT → CONFIRMED →    │confirm└─────────────────────────┘
   │  EXECUTED (+duration)   │
   └────────────────────────┘
```

**Key rule:** the LLM turn can *read* and *draft*, but the **`execute()`** of any `kind: "write"` preset runs only from `/confirm`, after the user sends the filled prompt. The write goes through the existing DAO — all current guarantees hold. Execution **duration** is measured server-side and returned for the card header.

---

## 6. Request lifecycle (add-employee walkthrough — matches the frames)

1. **Launcher (frame 1):** user is on `الموارد البشرية > الموظفين`. The panel shows context-ranked chips; user opens the **Command Library (frame 2)** and picks `إضافة موظف`.
2. **`GET /api/agent/presets?context=hr.employees`** already returned the ranked catalog; the chosen preset's `promptTemplate` renders **inline (frame 3)** with `name` pre-filled ("أحمد محمد") and the rest as placeholder chips. Page context pre-fills `branchId` where possible.
3. User fills the chips (`select` chips fetch options from the relevant DAO, `clinicId`-scoped). Optionally edits the sentence in natural language.
4. **Send → `POST /api/agent/chat`** with the message/filled input + context + history. `requireClinic` injects `{ clinicId, userId }`. Assistant streams *"جاري العمل..."* with **skeletons (frame 4)**.
5. **Resolvers** finalize any fuzzy slots (all reads, `clinicId`-scoped); ambiguities surface as picks.
6. **Guard** checks `ClinicAgentSettings`: is `add-employee` enabled? role allowed? within limits?
7. Agent **drafts an `AgentAction`** (`DRAFT`). For a write, the filled prompt *is* the confirmation — sending it is the confirm. (Optionally a lightweight "confirm" step for destructive/high-risk presets.)
8. **`/confirm`** re-validates against `inputSchema`, re-runs the guard, times the call, then invokes **`staffDao.create(...)`** — the *same* path the Staff UI uses. Arabic errors, unique-code generation (`#GAM-21`), and validation come for free.
9. **Result card (frame 5)** streams back: header "استغرق التنفيذ 4 ثوانٍ", "تم إنشاء ملف للموظف #GAM-21", entity summary (name, `D-1234`, "غير مفعل" badge), and the details table. On a `409`/validation error, the Agent shows the Arabic error and can propose a fix (e.g. next open slot for visits).

---

## 7. Context-awareness (core v1)

The chat **knows where you are** (frame 1 breadcrumb) and suggests suitable actions.

- **Context contract:** every request carries a small, typed context object — `{ route, entityType?, entityId?, branchId? }` — derived client-side from the TanStack route (e.g. `/_pathless-layout/hr/employees` → `{ route: "hr.employees" }`; a patient detail page → `{ route: "patients.detail", entityType: "patient", entityId }`).
- **Preset ranking:** `GET /agent/presets?context=…` returns the catalog ordered so `contexts`-matching presets lead (employees page → `add-employee`, `عرض جميع الأوامر`; appointments page → `create-visit`, `list-visits`).
- **Slot pre-fill:** context seeds resolvers — on a patient's page, `create-visit` pre-fills `patientId`/`ownerId`; on the employees page, `add-employee` pre-fills `branchId`.
- **System prompt** includes the current context so free-form asks resolve against the page the user is looking at.

Context is a **hint, never an authority** — it can pre-fill and rank, but every write still validates and guards server-side.

---

## 8. Action catalog (v1 proposal), grouped by sub-agent

The settings page (frame `4103-546221`) organizes actions into named **sub-agents** — مساعد أوكس العام (general), وكيل الموارد البشرية (HR), وكيل الزيارات (visits), وكيل المخزون (inventory), وكيل سير العمل (workflow), وكيل التقارير (reports), … — each with its own **enable toggle** and **connection status**. So a preset is the execution unit, but every preset belongs to a **sub-agent** used for: settings toggles, the Command Library's grouped sections, and the usage-log "الوكيل" column (frame `4170-550398`).

Grounded in real endpoints and the Command Library in frame 2. "Visit" = `Appointment`.

| Preset key | Sub-agent | Kind | Backed by | Contexts | Required (resolved where possible) |
|---|---|---|---|---|---|
| `find-patient` | general | read | `patientsDao.list`/`findById` | any | query |
| `find-owner` | general | read | `ownersDao` | any | query |
| `weekly-summary` (`ملخص أسبوعي`) | reports | read | dashboard/appointments DAOs | dashboard | period=week |
| `list-visits` | visits | read | `appointmentsDao.list` | appointments, dashboard | period, view? |
| `visit-details` | visits | read | `appointmentsDao.findById` | appointments | appointmentId |
| **`create-visit`** (`إنشاء زيارة`) | visits | **write** | `appointmentsDao.create` | appointments, patients | ownerId, patientId, staffId, serviceIds[], startsAt |
| `reschedule-visit` | visits | write | `PATCH …/reschedule` | appointments | appointmentId, startsAt |
| `change-visit-status` | visits | write | `PATCH …/status` | appointments | appointmentId, status |
| **`add-employee`** (`إضافة موظف`) | hr | **write** | `staffDao.create` | hr.employees | name, email, roleId, branchId (+specialization, employmentType) |
| `create-owner` | general | write | `ownersDao.create` | owners, patients | name, phone |
| `create-patient` (`إضافة مريض`) | general | write | `patientsDao.create` | patients | name, gender, animalTypeId (+ownerId) |
| `create-task` | workflow | write | `tasksDao.create` | any | title, type |

> `إنشاء هيئة` from the library (frame 2) maps to a body/committee resource — confirm which model before including; parked pending clarification. `وكيل المخزون`/`وكيل التمريض` (inventory/nursing sub-agents in the settings) are shown in the design but have no presets in v1 — they appear disabled until we add their actions.

**Explicitly out of scope for v1** (revisit later): invoices/payments, clinical-exam data entry, care-plan enrollment, expenses — anything financial or a clinical record-of-truth. Start with scheduling + HR + lookups.

Each preset is one file: `src/server/agent/actions/<sub-agent>/<key>.action.ts`. A registry (`actions/index.ts`) assembles the catalog, groups by sub-agent, and filters/ranks by guardrails + context per request. **A disabled sub-agent disables all its presets** at once (the settings toggle).

---

## 9. Server module layout

Standard four-file resource pattern (`AGENTS.md`), plus `core/` and `actions/`.

```
src/server/agent/
  agent.controller.ts     # Elysia routes; requireClinic; SSE streaming
  agent.model.ts          # TypeBox request schemas (chat body, confirm body, context)
  agent.dao.ts            # AgentConversation / AgentMessage / AgentAction persistence
  agent.type.ts           # Zod schemas + Prisma payload types (shared client/server)
  core/
    provider.ts           # AI SDK provider registry (OpenAI + Anthropic; user-selectable)
    run-turn.ts           # streamText wiring, tool catalog assembly, system prompt
    system-prompt.ts      # Arabic, RTL-aware, confirm-first, context- & guardrail-aware
    resolvers.ts          # field resolvers (patient/owner/staff/slot/service)
    context.ts            # route-context → preset ranking + slot pre-fill
  actions/
    action.type.ts        # ActionPreset<T>, PromptTemplate, GuardResult, ResultCard types
    index.ts              # registry + per-request guardrail filtering + context ranking
    create-visit.action.ts
    add-employee.action.ts
    ... (one per preset)
```

Register in `src/server/index.ts`: `.use(agentController)`.

**Client feature:** `src/features/agent/`
- components: `agent-panel` (docked), `agent-launcher` (greeting + chips), `command-library` (searchable preset list, grouped by sub-agent), `inline-prompt` (template → field-chips), `field-chip` (per-slot renderer), `working-skeleton`, `result-card`, `model-picker`.
- settings components: `agent-settings-page` (sub-agent toggles + behavioral guardrails), `wallet-card` (balance + add-balance), `add-balance-modal` (frame 3), `usage-chart` (spend over time), `usage-log-table` (frame 2).
- hooks: `use-agent-chat` (SSE stream — first SSE consumer in the app), `use-agent-presets` (context-ranked catalog), `use-route-context`, `use-agent-wallet`, `use-agent-usage`.
- types imported from `agent.type.ts`.

---

## 10. Guardrails ("settings for guard lines")

A new per-clinic settings model, mirroring `ClinicSchedulingSettings`.

```prisma
model ClinicAgentSettings {
  id                      String   @id @default(cuid())
  clinicId                String   @unique
  enabled                 Boolean  @default(true)
  enabledSubAgents        String[] // which sub-agents are on (settings toggles): ["general","hr","visits",…]
  enabledActions          String[] // optional finer gate: specific preset keys off within an enabled sub-agent
  autoRunReads            Boolean  @default(true)
  requireConfirmForWrites Boolean  @default(true)   // v1: effectively always true
  allowMemberWrites       Boolean  @default(false)  // MEMBER role write gate
  defaultProvider         String?  // "openai" | "anthropic" — default model per clinic
  instructions            String?  @db.Text         // free-text "الحواجز السلوكية" → system prompt + guards
  autoRefillEnabled       Boolean  @default(false)  // "إعادة شحن الرصيد تلقائي"
  autoRefillAmountSar     Decimal? @db.Decimal(10, 2)
  autoRefillThresholdSar  Decimal? @db.Decimal(10, 2)  // refill when balance drops below this
  maxActionsPerDay        Int?
  createdAt               DateTime @default(now())
  updatedAt               DateTime @updatedAt
  clinic                  Clinic   @relation(fields: [clinicId], references: [id], onDelete: Cascade)
  @@map("clinic_agent_settings")
}
```

The settings page (frame `4103-546221`) exposes these as: the **per-sub-agent enable toggles**, the **"الحواجز السلوكية" (behavioral guardrails)** free-text (→ `instructions`), **"أوامر سير العمل"** (workflow prompts), **"سوق مهارات الـAI"** (skills marketplace — future), and **"التكاملات الخارجية"** (external integrations — future). Auto-refill lives on the balance detail page (frame `4170-550398`).

Guardrails apply at **three** points, defensively:
1. **Catalog assembly** — presets in a disabled sub-agent (or explicitly disabled, or role-gated) are never offered to the LLM or shown in the Command Library.
2. **Balance check** — before a metered write executes, the wallet must have sufficient (or any) balance (§14). No balance → the action is blocked with an Arabic "أضف رصيدًا" prompt.
3. **`execute()` / `/confirm`** — the guard re-runs server-side before the write. LLM output is never trusted to have respected the rules.

`instructions` (free text — e.g. "لا تحجز زيارات بعد الساعة 8 مساءً", "الطوارئ دائمًا للدكتور خالد") is injected into the system prompt **and**, where machine-checkable, encoded as hard guards. Prompt text alone is not a security boundary.

DB discipline: add models to `schema.prisma`, then `bunx prisma migrate dev --name add_agent_models`, commit schema + migration together. **Never `db:push`** (per `AGENTS.md`).

---

## 11. Data model additions

Beyond settings, for persistence + auditability (the result cards imply we track outcomes):

```prisma
model AgentConversation {
  id        String   @id @default(cuid())
  clinicId  String
  userId    String
  provider  String?  // model chosen for this conversation
  title     String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  messages  AgentMessage[]
  actions   AgentAction[]
  clinic    Clinic @relation(fields: [clinicId], references: [id], onDelete: Cascade)
  @@index([clinicId, userId])
  @@map("agent_conversation")
}

model AgentMessage {
  id             String @id @default(cuid())
  conversationId String
  role           String            // "user" | "assistant" | "tool"
  content        String @db.Text
  createdAt      DateTime @default(now())
  conversation   AgentConversation @relation(fields: [conversationId], references: [id], onDelete: Cascade)
  @@map("agent_message")
}

model AgentAction {
  id             String   @id @default(cuid())
  conversationId String
  clinicId       String
  subAgent       String              // "hr" | "visits" | "inventory" | … (usage-log "الوكيل" column)
  actionKey      String              // "add-employee"
  status         AgentActionStatus @default(DRAFT)   // DRAFT | CONFIRMED | EXECUTED | REJECTED | FAILED
  inputDraft     Json                // filled slot values for the inline prompt / card
  resultRef      String?             // created entity id (e.g. staff id)
  resultCode     String?             // human code shown on the card (e.g. "GAM-21")
  durationMs     Int?                // "استغرق التنفيذ 4 ثوانٍ"
  // Metering (real-token pricing → SAR) — see §14:
  inputTokens    Int?
  outputTokens   Int?
  cachedTokens   Int?                // cache-read tokens (billed ~10%)
  costUsd        Decimal? @db.Decimal(10, 6)   // computed provider cost
  costSar        Decimal? @db.Decimal(10, 2)   // charged to the wallet (shown in usage log)
  error          String?
  createdBy      String
  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt
  conversation   AgentConversation @relation(fields: [conversationId], references: [id], onDelete: Cascade)
  @@index([clinicId, status])
  @@index([clinicId, createdAt])   // usage-log queries
  @@map("agent_action")
}
// enum AgentActionStatus { DRAFT CONFIRMED EXECUTED REJECTED FAILED }
```

`AgentAction` is the audit trail, the source for the result card (code, duration, result ref, status), **and** the source rows for the usage log + spend chart (§14) — one row per executed action carries its user, timestamp, sub-agent, command, and SAR cost.

### The wallet (prepaid balance per clinic)

The balance ("الرصيد") is a **prepaid SAR wallet** each clinic tops up and the Agent draws down per action. Two models: a wallet (current balance, cached) and an immutable **ledger** (every credit/debit), so the balance is always reconstructable and auditable.

```prisma
model AgentWallet {
  id            String   @id @default(cuid())
  clinicId      String   @unique
  balanceSar    Decimal  @default(0) @db.Decimal(10, 2)   // "متاح 100.00 ر.س" — cached running balance
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
  clinic        Clinic   @relation(fields: [clinicId], references: [id], onDelete: Cascade)
  ledger        AgentWalletEntry[]
  @@map("agent_wallet")
}

model AgentWalletEntry {
  id            String   @id @default(cuid())
  walletId      String
  clinicId      String
  type          AgentWalletEntryType   // CREDIT (top-up) | DEBIT (action) | ADJUSTMENT
  amountSar     Decimal  @db.Decimal(10, 2)   // + for credit, − for debit
  balanceAfter  Decimal  @db.Decimal(10, 2)   // running balance snapshot
  actionId      String?  // for DEBIT: links to the AgentAction it paid for
  paymentMethod String?  // for CREDIT: "cash" | … (frame 4172 "حدد طريقة الدفع"); null while unpaid/testing
  createdBy     String
  createdAt     DateTime @default(now())
  wallet        AgentWallet @relation(fields: [walletId], references: [id], onDelete: Cascade)
  @@index([clinicId, createdAt])
  @@map("agent_wallet_entry")
}
// enum AgentWalletEntryType { CREDIT DEBIT ADJUSTMENT }
```

Credit and debit **always** go through the ledger inside a transaction that also updates `AgentWallet.balanceSar`; never mutate the balance directly. A DEBIT row and its `AgentAction` are written in the *same* transaction as the metered result, so spend and audit can never drift.

---

## 12. Provider abstraction (multi-provider)

The model picker is a real feature (frame 1 shows "Sonnet 4.2").

- `core/provider.ts` exposes a **registry**: `{ id, label, model }` entries built from the AI SDK — `@ai-sdk/openai` and `@ai-sdk/anthropic`. `run-turn.ts` selects one per conversation from the picker (falling back to `ClinicAgentSettings.defaultProvider`, then a global default).
- Tool-calling is expressed once (AI SDK tools = our preset catalog) and works across providers — no per-provider action code.
- **Arabic quality caveat:** validate tool-calling + Arabic on each model before enabling it in the picker; the registry makes enabling/disabling a model a config change.

Env (`src/env.ts`, t3-env, server-side): `OPENAI_API_KEY`, `ANTHROPIC_API_KEY` (each optional but at least one required at boot), optional `AGENT_DEFAULT_PROVIDER`. **No client-side keys** — the browser never calls a provider directly; all LLM traffic goes through Elysia so auth, clinic scoping, and guardrails always apply.

---

## 13. Streaming & transport

- Elysia + Vercel AI SDK: `streamText({...})` in `run-turn.ts`, returned via `toTextStreamResponse()` / `sse()`.
- The stream carries: (a) assistant **text** deltas, (b) a **working/status** signal (drives the skeleton in frame 4), (c) structured **action events** (drafted → render inline prompt/card; executed → render result card with code + duration). Encode structured events as AI SDK data parts or a light second channel — decide during the Phase-0 spike.
- **Frontend has no streaming infra today** — `use-agent-chat` is the first SSE consumer; keep it isolated in the feature folder.

---

## 14. Billing, metering & cost

The design bills clinics through a **prepaid SAR wallet** (frames `4103-546221`, `4170-550398`, `4172-552391`): a clinic tops up a balance, the Agent **debits per action**, and a usage log + spend chart show where it went. Decided pricing model: **metered by real token cost** (not a flat per-action price), converted to SAR with a markup.

### The metering pipeline (per executed action)

1. **Capture usage.** The AI SDK returns token usage per call (`inputTokens`, `outputTokens`, `cachedTokens`). Sum across the action's round-trips → totals on `AgentAction`.
2. **Cost in USD.** `costUsd = Σ (tokens × model rate)` using the provider's per-token price for the model that ran (cached tokens billed at the ~10% cache-read rate). Rates live in the provider registry (§12) so they update in one place.
3. **Convert to SAR + markup.** `costSar = round(costUsd × USD_SAR_FX × MARKUP, 2)`. `USD_SAR_FX` and `MARKUP` are config (env or a small `AgentPricing` config). Markup is where your margin lives; FX is ~3.75 (SAR is pegged).
4. **Debit the wallet transactionally.** In one DB transaction: write the `AgentAction` (with `costSar`), append a `DEBIT` `AgentWalletEntry`, and decrement `AgentWallet.balanceSar`. Spend and audit can never drift.
5. **Surface it.** `costSar` shows in the result card and the **usage log** (frame 2: user · timestamp · sub-agent · command · cost). The **spend chart** aggregates `AgentAction.costSar` by day.

> The mock shows a flat "10 ر.س" per row — that's placeholder. With real metering, rows show the actual computed SAR (rounded), which varies by action complexity. If a fixed per-action price is ever wanted, it's a one-line swap in step 2–3.

### Balance & refill

- **Balance check before write** (guard point 2, §10): if `balanceSar` ≤ 0 (or below the action's estimated cost), the write is blocked with an Arabic "أضف رصيدًا" prompt instead of executing. Reads may be exempt or near-free.
- **Add balance** (frame 3): credits the wallet via a `CREDIT` ledger entry. **v1 = no real payment** — amount chips (50 / 100 / custom) + a payment-method field that's recorded but not charged (cash/manual/testing). The consent checkbox ("سياسة الاستخدام لشركة أونكس") is captured. Real payment gateway is a later phase — the ledger already models it (`paymentMethod`).
- **Auto-refill** (frame 2 "إعادة شحن الرصيد تلقائي"): when balance drops below `autoRefillThresholdSar`, credit `autoRefillAmountSar` (§10). In v1 (no payment) this is a manual/testing convenience; wire it to the gateway later.

### API surface (adds to §5)

- `GET  /agent/wallet` → `{ balanceSar, autoRefill… }`
- `POST /agent/wallet/credit` → add balance (amount, paymentMethod) → `CREDIT` entry
- `GET  /agent/usage?from&to` → spend chart series + paginated usage log (from `AgentAction`)
- Debits happen **inside** the action-execute path, not a separate call.

### Underlying LLM cost (what you actually pay the provider)

This is what `MARKUP` must clear. Reference per 1M tokens: Claude Sonnet ≈ $3 in / $15 out; Claude Haiku ≈ $1 / $5; GPT-4o-class ≈ $2.50 / $10; mini ≈ $0.15 / $0.60. One *completed* action ≈ 2–4 round-trips (~15K input + ~1–2K output total):

| Model | Provider cost / action | ≈ SAR before markup |
|---|---|---|
| Claude Sonnet | ~$0.05–0.08 | ~0.19–0.30 ر.س |
| GPT-4o-class | ~$0.04–0.06 | ~0.15–0.23 ر.س |
| Haiku / mini | ~$0.01–0.02 | ~0.04–0.08 ر.س |

So the design's "10 ر.س"/action would be a **large** markup over raw cost — good for margin, but set `MARKUP` deliberately and transparently.

### Build & infra cost (one-time)

- **Engineering ≈ 2.5–3 engineer-months** for v1 now (the wallet/metering/usage-log/chart adds ~0.5 month on top of the earlier estimate). The inline field-chip renderer + streaming UI remain the heaviest single piece.
- **Infra ≈ $0 net-new** — runs inside the existing Nitro/Elysia server; no new service. **No vector DB / embeddings** — "search our DB" is plain Prisma queries (§4.2).
- **Payment gateway** — deferred; $0 in v1.

### Cost-control levers (design requirements, not afterthoughts)

1. **Prompt-cache the stable prefix.** System prompt + preset catalog (~5–8K tokens) is identical every call; both providers cache it at ~10% input price → cuts input cost **~50–70%** on a 3-call action. Keep the prefix byte-stable (frozen prompt, deterministic tool order, volatile context after the breakpoint). **Build into `run-turn.ts` day one** — it directly lowers `costSar`.
2. **Complexity-based model routing.** Cheap model for lookups/resolution, strong model only for ambiguous intent. The registry (§12) supports per-call model choice.
3. **Keep resolvers deterministic.** Field resolvers (§4.2) are plain DB queries, not LLM calls — fewer round-trips = lower `costSar`. Cheapest lever.
4. **Balance + `maxActionsPerDay`** are the hard caps: a clinic can never spend beyond its wallet, and daily action count is bounded.

---

## 15. RTL / i18n

- All Agent strings (greeting, chip labels, slot placeholders like `حدد التخصص`, card labels, errors) in Arabic, from `translation.json`.
- The **docked panel**, **inline field-chips**, and **result table** follow `AGENTS.md` RTL rules (logical properties, DOM order per flow direction, one close button). Verify chip layout visually via the throwaway-route + headless-Chrome method in `AGENTS.md`.
- Server errors already return Arabic (global handler surfaces only Arabic messages) — relayed verbatim in the result/error card.

---

## 16. Security & safety posture

- **Confirm-first for all writes** — sending the filled prompt is the confirm; the model cannot mutate data on its own.
- **No new write paths** — actions call existing hardened DAOs; tenant scoping, conflict/lock/exam rules, soft-delete all still apply.
- **Guardrails enforced in code**, not just prompt text.
- **Every write audited** via `AgentAction` (who, what, when, result code, duration).
- **Clinic isolation** — the whole flow runs inside `requireClinic`; resolvers/executes are `clinicId`-scoped.
- **Context & DB content are untrusted** — page context and resolved rows can pre-fill and rank, never silently escalate a guard. Ambiguity → ask.

---

## 17. Phased delivery

**Phase 0 — Spike (throwaway).** One read action (`find-patient`) end-to-end: Elysia route → provider registry (both OpenAI + Anthropic) → tool-call → resolver → streamed answer. Proves transport, multi-provider tool-calling, clinic scoping, and the structured-event stream shape. No persistence, no UI polish.

**Phase 1 — Foundation.**
- `ClinicAgentSettings`, `AgentConversation/Message/Action`, `AgentWallet/WalletEntry` models + migrations.
- Preset framework (`action.type.ts` incl. `PromptTemplate`, sub-agent grouping, registry, guard + context ranking).
- Provider registry (with per-model rates) + system prompt + resolver library + context contract.
- **Metering pipeline** (token capture → `costUsd` → `costSar` → transactional wallet debit) wired into the execute path.
- Read actions: `find-patient`, `find-owner`, `list-visits`, `weekly-summary`, `visit-details`.

**Phase 2 — The UI shell + flagship write.**
- Docked panel, launcher (chips), **Command Library** (grouped by sub-agent), **inline-prompt renderer + field-chips**, working-skeleton, **result card**, model picker.
- `add-employee` **or** `create-visit` (pick one) with full resolver chain + inline prompt + balance-check + `/confirm` execute + metered debit + result card (code, duration, cost, badge, field table). RTL-verified.
- Audit trail + wallet debit wired to `AgentAction`/ledger.

**Phase 3 — Billing UI + more writes.**
- **AI & Agents settings page**: sub-agent toggles, behavioral-guardrails free-text, default provider.
- **Wallet UI**: balance card, add-balance modal (no real payment), auto-refill toggle, **spend chart**, **usage log** table.
- The other flagship + `reschedule-visit`, `change-visit-status`, `create-owner`, `create-patient`, `create-task`.

**Phase 4 — Hardening.**
- Rate limits / daily caps, richer ambiguity UX, conversation history, error recovery (auto-propose next slot on conflict), eval harness for action-selection + slot-fill accuracy, per-model Arabic validation.

**Phase 5 — Real payment (later).**
- Payment-gateway integration behind the existing `CREDIT` ledger + add-balance flow; real auto-refill charges.

---

## 18. Open questions (for us to decide)

1. **Conversation memory scope** — per-user, per-clinic, or per-user-per-clinic?
2. **Default models per provider** — which OpenAI and which Anthropic model seed the picker? Balance Arabic tool-calling vs. cost/latency. ("Sonnet 4.2" in the mock is a label — confirm the real ids.)
3. **Structured action events over the stream** — AI SDK data parts vs. a side channel? (Phase-0 spike decides.)
4. **Ambiguity UX** — inline pick-list in the chat bubble, or resolve within the field-chip itself?
5. **`إنشاء هيئة`** (create body/committee) from the Command Library — which model backs it? Include in v1 or park?
6. **Confirm step for writes** — is "send the filled prompt" a sufficient confirm for all writes, or do destructive presets (cancel visit, disable owner) need an extra explicit confirm?
7. **Undo** — since writes are audited, offer a lightweight "undo last action" for reversible ops?
8. **Voice input** — the composer shows a mic icon; is speech-to-text in scope, and via which service?
9. **Markup & FX** — what `MARKUP` multiplier over raw provider cost, and is `USD_SAR_FX` fixed (~3.75) or configurable? (Sets clinic-facing pricing and margin.)
10. **Read pricing** — are read actions free, near-free, or metered like writes? (Affects the balance-check exemption.)
11. **Reads and balance** — should reads also be blocked at zero balance, or always allowed?

---

## 19. TL;DR for a skim

- Docked chat **Agent** ("Oaks AI") that **proposes** actions and **never writes without confirmation**.
- Actions are **typed presets** ("skills") grouped under **sub-agents** (HR, Visits, Inventory, Reports…) in a browsable **Command Library**, backed by our **existing DAOs** — so all current validation/tenant/Arabic-error guarantees hold.
- Each preset renders as an **inline sentence with editable field-chips** (mad-libs); **resolvers** search our DB to auto-fill slots and surface ambiguities as choices.
- The chat is **context-aware** — it knows the current page and ranks/pre-fills accordingly.
- **Multi-provider** (OpenAI + Anthropic) behind a registry, user-selectable from the model picker.
- After a write, a **result card** shows the generated code (`#GAM-21`), execution duration, **cost**, entity summary, and a field table.
- **Billing = prepaid SAR wallet per clinic.** Each action is **metered by real token cost → SAR** (× FX × markup), **debited transactionally** from the wallet; a usage log + spend chart show where it went. v1 tops up with **no real payment** (testing); gateway is Phase 5.
- **Guardrails** live in a per-clinic `ClinicAgentSettings` (sub-agent toggles + behavioral rules), enforced in code — plus a **balance check** before every write.
- New models: `ClinicAgentSettings`, `AgentConversation/Message/Action` (audit + result-card + usage-log source), `AgentWallet`/`AgentWalletEntry` (balance + immutable ledger).
- Ship read actions + metering (Phase 1), then UI shell + one flagship write (Phase 2), then billing UI + more writes (Phase 3), then hardening (4) and real payment (5).
