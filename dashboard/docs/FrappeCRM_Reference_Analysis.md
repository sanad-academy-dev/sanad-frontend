# تشريح Frappe CRM — وثيقة المرجع الكاملة
**المصدر:** github.com/frappe/crm — قراءة من الكود الفعلي (doctypes JSON + Python controllers + API + hooks + Vue frontend)، مش من التوثيق.
**الغرض:** المرجع الحاكم لبناء BRD موديول CRM كامل. كل بند هنا موجود فعليًا بالكود وبنقدر نرجعله ملف وسطر.

---

## 0. البنية المعمارية العامة

- **Backend:** Frappe app اسمها `crm`، الموديول `fcrm`. كل الكيانات Frappe DocTypes (JSON schema + Python controller). الـ API عبر `@frappe.whitelist()` — ملفات `crm/api/*` هي الـ surface الكامل.
- **Frontend:** Vue 3 SPA مستقلة (`frontend/`) على مكتبة `frappe-ui`، بتحكي مع الـ backend عبر REST + **socket.io** (realtime — إشعارات، تحديثات timeline لحظية).
- **الفلسفة المركزية:** كيانان أساسيان فقط (**Lead** و**Deal**) وكل شي تاني إما master خفيف، إما محرك أفقي (SLA، Views، Layouts، Assignment) بيشتغل على التنين بالتساوي، إما قناة تواصل (Email/WhatsApp/Calls) بترتبط فيهم بـ **reference_doctype + reference_docname** (نمط dynamic link موحّد).
- **قابلية التخصيص كمنتج:** الحقول المخصصة، تخطيط الفورم، الـ statuses، والـ views كلها **بيانات بتتحرر من الواجهة** مش كود — هاد نص قيمة المنتج.

## 1. خريطة الـ DocTypes الكاملة (38)

**النواة (2):** `CRM Lead` (66 حقل) · `CRM Deal` (75 حقل)

**Masters خفيفة (9):** `CRM Lead Status` / `CRM Deal Status` (اسم + لون + position — الـ pipeline نفسه بيانات) · `CRM Lead Source` · `CRM Industry` · `CRM Lost Reason` · `CRM Communication Status` · `CRM Territory` (شجرة nested-set مع مدير لكل إقليم) · `CRM Sales Hierarchy` (شجرة مندوبين: user + reports_to — أساس رؤية المدير لفريقه) · `CRM Organization` + `Contact` (فرابي الأساسي ممدود)

**المنتجات والتسعير (3):** `CRM Product` · `CRM Products` (child table على Lead وDeal: صنف/كمية/سعر/خصم) · مع `total` / `net_total` / `currency` / `exchange_rate` (API صرف) / `deal_value` / `expected_deal_value` (محسوب من probability)

**محرك SLA (6):** `CRM Service Level Agreement` (شروط تطبيق + أولويات) · `CRM Service Level Priority` · `CRM Service Day` (أيام العمل وساعاته) · `CRM Holiday List` + `CRM Holiday` · `CRM Rolling Response Time` (child — سجل كل دورة رد)

**الأنشطة والتواصل (5):** `FCRM Note` · `CRM Task` (priority/status/due/assigned) · `CRM Call Log` (اتجاه، حالة، مدة، تسجيل، وسيط) · `CRM Telephony Agent` + `CRM Telephony Phone`

**التخصيص Low-code (4):** `CRM Fields Layout` (تخطيط JSON لكل doctype × نوع عرض: Quick Entry / Side Panel / Data Fields) · `CRM Form Script` (حقن JS على Form أو List) · `CRM View Settings` (views محفوظة: أعمدة/فلاتر/ترتيب/kanban/group_by، خاصة أو عامة أو pinned) · `CRM Dropdown Item`

**النظام (9):** `FCRM Settings` · `CRM Global Settings` · `CRM Notification` (Mention/Task/Assignment/WhatsApp + dynamic reference) · `CRM Invitation` (دعوات بصلاحية وانتهاء) · `CRM Status Change Log` (child — تاريخ كل انتقال حالة بمدته) · `CRM Dashboard` · `CRM Twilio Settings` / `CRM Exotel Settings` · `ERPNext CRM Settings`

**مزامنة الليدات (5 تحت `lead_syncing`):** `Lead Sync Source` · `Facebook Page` · `Facebook Lead Form` + أسئلته · `Failed Lead Sync Log`

## 2. الكيان Lead — الجوهر

**الحقول بالمجموعات:** هوية الشخص (salutation/first/middle/last/gender/image/job_title) · التواصل (email/mobile/phone/website + سوشال: linkedin/twitter/facebook) · الشركة (organization نصي + logo + وصف + no_of_employees + annual_revenue + industry + territory) · التأهيل (status ← master، source، lead_owner) · SLA (sla + sla_creation + sla_status[First Response Due/Rolling Response Due/Fulfilled/Failed] + response_by + first_response_time + first_responded_on + rolling_responses + last_response_time) · communication_status · المنتجات (products + total/net_total) · الخسارة (lost_reason إلزامي عند حالة Lost + lost_notes) · التحويل (converted flag) · فيسبوك (facebook_lead_id/form_id) · status_change_log.

**سلوك الـ controller (crm_lead.py):**
- `before_validate`: set_full_name، set_lead_name (fallback: الاسم ← الشركة ← الإيميل)، set_title
- `validate`: بريد صالح، **validate_lost_reason** (حالة "Lost" بدون سبب = رفض)، validate_status
- `after_insert`: **apply_sla** (أول SLA سارية شرطها بينطبق) + تسجيل أول status_change_log
- `assign_agent` / `share_with_agent`: إسناد + مشاركة docshare
- **التحويل convert_to_deal** — أهم عملية بالنظام: (1) contact_exists؟ وإلا create_contact من حقول الليد، (2) create_organization (أو ربط بموجودة)، (3) create_deal بنسخ الحقول **بمطابقة الأسماء including custom fields** (`get_matching_custom_deal_field` — الحقول المخصصة المتطابقة الاسم والنوع بتنتقل تلقائيًا)، (4) `converted=1`. عملية ذرية بواجهة modal بتسمحلك تعدّل قبل التأكيد.

## 3. الكيان Deal

نفس بنية الليد + إضافاته: `organization` link حقيقي · `contacts` (child table متعددة مع **primary contact** واحد — `set_primary_email_mobile_no` بيسحب بريد/جوال الـ primary لحقول الصف) · **forecasting**: probability % + expected_deal_value (محسوب: deal_value × probability عند التحديث) + expected_closure_date · `close­d_date` (بينكتب آليًا عند حالة won) · `update_default_probability` (البروبابيلتي الافتراضية بتيجي من حالة الـ Deal Status نفسها) · exchange_rate بيتحدث آليًا عند تغيير العملة · نفس SLA ونفس lost_reason الإلزامي.

**Hook إنتاجي:** `CRM Deal on_update → create_customer_in_erpnext` — فوز الصفقة بينشئ عميل بـ ERPNext (والعكس: Sales Order بينشئ العميل عند الحاجة).

## 4. المحركات الأفقية (هون نص قيمة المنتج)

### 4.1 محرك SLA (الأكثر تعقيدًا — 280 سطر)
- الاتفاقية: شرط تطبيق (condition Python-like على الحقول) + default واحدة + أولويات (لكل أولوية: first response time)
- **أيام خدمة وساعات عمل + قوائم عطل** — الحساب `calc_time` بيمشي على ساعات العمل فقط ويتخطى العطل
- **دورتان:** First Response (من الإنشاء لأول رد صادر) ثم **Rolling Response** — كل رسالة واردة من العميل بتفتح دورة رد جديدة بموعد استحقاق، وكل رد صادر بيقفلها ويسجلها بـ rolling_responses. sla_status بيتنقل: First Response Due → Fulfilled/Failed → Rolling Response Due...
- المشغّل: `communication_status` + إشارات الـ Communication (on_communication_insert بالـ hooks)

### 4.2 محرك الحالات (Pipeline كبيانات)
statuses = صفوف بمواضع وألوان، الـ Kanban بيرتب عليها، `status_change_log` بيسجل كل انتقال (من/إلى/مين/إمتى/**المدة بالحالة السابقة**) — هاد مصدر تقارير سرعة الـ pipeline.

### 4.3 محرك الـ Views (doc.py — 700 سطر، عمود فقري للواجهة)
API عام لأي doctype: `get_data` (فلاتر + ترتيب + group_by + kanban columns + pagination) · `get_filterable_fields` / `sort_options` / `group_by_fields` / `quick_filters` من الـ meta ديناميكيًا · **CRM View Settings** بتحفظ view كامل (أعمدة بعرضها، صفوف، فلاتر، ترتيب، نوع list/kanban/group_by، حقول كرت الكانبان) لكل مستخدم، مع public وpinned وdefault. النتيجة: المستخدم بيبني شاشاته بنفسه.

### 4.4 محرك التخطيط (Fields Layout) — Low-code
لكل doctype تخطيطات JSON منفصلة: **Quick Entry** (فورم الإنشاء السريع) · **Side Panel** (لوحة التفاصيل يمين صفحة الليد/الديل بأقسام قابلة للطي) · **Data Fields**. + محرر مرئي (FieldLayoutEditor.vue). الحقول المخصصة (Custom Field تبع فرابي) بتظهر فورًا بالمحرر.

### 4.5 Form Scripts
JS يُحقن على Form أو List لكل doctype — نقطة تمديد للعميل بدون نشر كود.

### 4.6 Assignment Rules
بيستخدم `Assignment Rule` تبع فرابي الأساسي مفلترًا على CRM Lead/Deal: شرط + مستخدمون + توزيع (round robin/load balancing) + أولوية. API خاص للإدارة والتكرار.

## 5. الأنشطة والتواصل (صفحة الليد/الديل الموحدة)

`get_activities(name)` بيبني timeline موحّد من: **Versions** (تغييرات الحقول مجمّعة ومفسّرة) + **Communications** (الإيميلات كاملة بمرفقاتها) + **Comments** (مع mentions ← إشعار) + **Calls** + **Notes** + **Tasks** + **Attachments** + **WhatsApp**. التبويبات بصفحة الكيان: Activity / Emails / Comments / Data / Calls / Tasks / Notes / Attachments / WhatsApp.

- **الإيميل:** Communication تبع فرابي + **Email Templates** بمتغيرات Jinja من الكيان + EmailEditor بالواجهة (رد/رد على الكل/تحويل، CC/BCC)
- **WhatsApp:** تكامل مع تطبيق `frappe_whatsapp` إذا منصّب — رسائل مرتبطة بالكيان، قوالب، إشعار للـ agent عند وارد جديد
- **الهاتفية:** Twilio (مكالمات من المتصفح — WebRTC device token) + Exotel (click-to-dial) → `CRM Call Log` بالتسجيل والمدة، بينربط تلقائيًا بالليد/الديل حسب الرقم، مع ملاحظة ومهمة من نافذة المكالمة
- **الإشعارات:** CRM Notification (mention/task/assignment/whatsapp) + realtime عبر socket، وصفحة موبايل مخصصة

## 6. مزامنة الليدات من الخارج

`Lead Sync Source` + تكامل **Facebook Lead Forms** كامل (صفحات، فورمات، أسئلة، تحويل الإجابات لحقول) — scheduler بكادنسات 5/10/15 دقيقة وساعي ويومي وشهري + `Failed Lead Sync Log` لكل فشل. البنية عامة (source types قابلة للتوسيع).

## 7. تكامل ERPNext (جسر CRM ↔ ERP)

- فوز deal → إنشاء Customer (وقيمة الصفقة بتظهر عنده)
- **Mirror sync للأصناف:** Item بـ ERPNext ↔ CRM Product (after_insert/update/rename/trash — مزامنة كاملة الاتجاهين مع سجل مشاكل `CRM Product Sync Issue`)
- مزامنة DocShare وUser Permission
- عرض Quotations/Sales Orders الخاصة بالعميل من داخل الـ CRM

## 8. الداشبورد (dashboard.py — كل المقاييس موجودة كدوال)

أرقام: total_leads · ongoing_deals · won_deals · avg ongoing/won/overall deal value · **avg time to close** (lead & deal — من status_change_log) — كلها بفترة ومستخدم (والمدير بيشوف فريقه عبر sales hierarchy).
رسوم: **sales trend** · **forecasted revenue** (مرجّح بالـ probability) · **funnel conversion** (المراحل بمعدلات التحويل) · deals by stage (أعمدة + donut) · **lost deal reasons**. + إمكانية تخصيص الداشبورد وإرجاعه للافتراضي.

## 9. ملحقات المنتج

Contacts وOrganizations كصفحات كاملة بـ views خاصة · **Calendar** (أحداث بتذكيرات offset/hourly/daily/weekly عبر scheduler) · **Data Import** (صفحة استيراد) · **Onboarding** wizard · **Invitations** بصلاحيات وانتهاء · صفحات **Mobile** منفصلة (MobileLead/Deal/Contact/Organization/Notification) · **i18n** كامل (crowdin) · **Telemetry** · أدوار: System Manager / Sales Manager / Sales User + Territory وHierarchy للرؤية.

## 10. القواعد السلوكية المستخرجة (بذور الـ BR-numbers بالـ BRD)

1. حالة Lost بدون lost_reason = رفض (ليد وديل)
2. التحويل بينشئ/بيربط Contact وOrganization وبينقل الحقول المخصصة المتطابقة تلقائيًا، وبيعلّم converted (الليد المحوّل بيختفي من القوائم الافتراضية — non_filterable)
3. أول SLA سارية شرطها بينطبق بتتطبق تلقائيًا عند الإنشاء؛ الحساب على ساعات العمل ناقص العطل؛ الرد الوارد بيفتح دورة rolling جديدة
4. كل انتقال حالة بينسجل بمدة الحالة السابقة (وقود تقارير السرعة)
5. probability الافتراضية من حالة الديل؛ expected_value = deal_value × probability؛ closed_date بينكتب عند الفوز؛ exchange_rate بيتحدث عند تغيير العملة
6. الـ primary contact واحد إلزامًا بالديل، وبريده/جواله بينعكسوا على حقول الصف
7. الإشعار realtime عند mention/إسناد/مهمة/واتساب وارد
8. كل قناة تواصل بترتبط بالكيان بـ dynamic reference موحّد

---

## 11. قرارات مفتوحة قبل كتابة الـ BRD (بدها كلمتك)

- **O-CRM-1 (الأهم):** وين بينبني؟ (أ) موديول جوا **elite-vet** بنفس نمط MI (TypeScript/Prisma/TanStack، فيزات ببوابات CI) — والليدات هون أصحاب حيوانات محتملون والـ Deal ممكن يرتبط بباقات العضوية اللي بنيناها؟ (ب) تطبيق **Frappe مخصص** لـ KanaanERP (وساعتها في سؤال: ليش مش fork للمرجع نفسه؟)؟ (ج) منتج **standalone** بستاك الويب تبعك؟ — كل الـ BRD (المعمارية، الـ seams، التكاملات) بيتفرع من هالجواب.
- **O-CRM-2:** نطاق v1 — النواة (Lead/Deal/تحويل/statuses/kanban/notes/tasks/activities) واضحة؛ بس شو مصير: الهاتفية (Twilio/Exotel)، مزامنة فيسبوك، WhatsApp، محرك SLA الكامل بالـ rolling responses؟ اقتراحي: v1 = نواة + email + WhatsApp (لأنه قناتك الأساسية) + SLA مبسّط (first response فقط)، والباقي [P2].
- **O-CRM-3:** التكامل المقابل لـ "ERPNext bridge" — عندك بيتحول لإيش؟ (elite-vet: deal won ← إنشاء Owner؟ / KanaanERP: عميل ERPNext؟)
- **O-CRM-4:** عربي أولًا RTL (زي elite-vet) ولا ثنائي اللغة زي المرجع؟
