# P12A — UI-only walkthrough evidence (pilot gate)

Screenshots from the **owner-delegated UI-only re-run** of the PR #96 walkthrough, executed
on head `51707a8` after the six `[P12A-fix*]` commits landed.

**Ground rules of that run:** every interaction was a real mouse/keyboard event driven
through headless Chrome over CDP. No `curl`, no direct service calls, no DB writes. A step
that could not be reached from the browser was recorded as a FAIL rather than worked around.
Database queries were used only as read-only corroboration of what the screens displayed.

## Which clinic these show

The run used a **fresh clinic** — «عيادة الاختبار» (`cmsvh6gzo0005bczlbt1qlkz6`) — created
through the app's own onboarding wizard, then set up with the two documented CLI steps
(`db:seed:accounting-demo`, `db:generate:operational-volume … 3000 2025 2`).

A fresh clinic was necessary and turned out to be better:

- `activeClinicId` is pinned to a user's **oldest** `clinic_user` row at session creation
  (`src/lib/auth/index.ts`), and **no clinic-switcher UI exists** — so the previously-used
  "Localhost" clinic was unreachable from a browser without a DB edit.
- The Localhost clinic still carried §4.1 defaults that had been set **by hand** during the
  earlier API-based run, which would have masked seed fix #2. A virgin clinic proves the
  seed provisions them itself.

Volume generated: 3,000 operational invoices (**1,644 PAID** — the adapter-eligible set)
and 180 expenses (**159 PAID**). Note 180, not the ~1,440 the PR body states; expenses are
pinned at 15/month × 12 and do not scale with the invoice count.

## Image → step map

### Test 1 — «الافتتاح» opening tool (was HTTP 403 for every user, incl. ADMIN/SYSTEM)

| File | Shows |
|---|---|
| `t1-01-opening-tab-empty.png` | Tab loads for an ADMIN — no 403. Empty grid, «حساب الافتتاح المؤقت» notice. |
| `t1-02-opening-rows-filled.png` | Two rows staged: a **sales** row (سالم القحطاني · 2025-06-05 · `INV-902` · 350) and a **purchase** row (شركة الأعلاف المتحدة · 2025-06-05 · `BILL-78` · 120). Party dropdown correctly switches to suppliers on the purchase row. |
| `t1-03-opening-result.png` | **«نتيجة آخر تشغيل: 2 فاتورة · 0 خطأ»** — `SINV-2025-00002 — 350`, `PINV-2025-00002 — 120`. Header counter reads «مبيعات 2 · مشتريات 2». |

> These three were **re-shot** after the run, because the scratchpad holding the originals
> was wiped mid-session. They are a third opening pair in the same clinic; the first pair
> (`SINV-2025-00001` / `PINV-2025-00001`) produced identical output, recorded in the run log.
> The purchase row is the path that was broken before the fix — it now needs no manual setup,
> because the seed sets `defaultPayableAccountId`.

### Test 2 — adapters + zero-diff report (run endpoint was HTTP 403)

| File | Shows |
|---|---|
| `t3-report.png` | «تقرير المطابقة» screen before an adapter is chosen. |
| `t3-clinicinv.png` | **clinic_invoice zero-diff: source 943,759.76 / posted 943,759.76 / GL 943,759.76 · الفرق المتبقي 0** · «مطابقة تامة» · both tables empty · 1,644 rows. |
| `t3-expense.png` | **expense zero-diff: 39,312 / 39,312 / 39,312 · الفرق المتبقي 0** · both tables empty · 159 rows. |

Both adapters were enabled and run from «الحوكمة → المحولات» with the date range set to
2025-01-01 → 2025-12-31; the confirm dialog named the real-GLE consequence. Results:
clinic_invoice **1644 ترحيل · 0 عكس · 0 خطأ**, expense **159**. «حساب ضريبة المحول» was
already pre-filled by the seed, so walkthrough step 2 required no manual action.

### Test 4 — reversal path — **FAILED**

This is the most important sequence in the set: it is simultaneously the defect **and**
proof that the reconciliation instrument works.

| File | Shows |
|---|---|
| `t4-expenses.png` | Operational «المصروفات» list with the generated `GEN2-2025-E*` expenses. |
| `t4-menu.png` | Row options menu: **عرض / تعديل / تنزيل only — there is no cancel action.** |
| `t4-edit.png` | Expense detail for a PAID («تم الصرف») expense. Only destructive action is **«حذف الطلب»**. |
| `t4-confirm-delete.png` | Delete confirmation states «حذف طلب المصروف **نهائيًا** من النظام» — a hard delete, not a cancel. |
| `t4-deleted.png` | After deleting `GEN2-2025-E0002` (453): screen total drops 45,092 → 44,639. |
| **`t4-report-orphan.png`** | **The key image.** Residual **−453** in red; source 38,859 vs posted 39,312 vs GL 39,312; «الفرق المتبقي ≠ صفر» warning; unposted table empty; **«ترحيلات يتيمة: GEN2-2025-E0002 — 453»** — the report *names* the offending document. |
| `t4-rerun.png`, `t4-rerun2.png` | Re-running the expense adapter over the correct 2025 range returns **0 ترحيل · 0 عكس · 0 خطأ** — twice. The orphan is never healed. |

**Why it fails:** the adapter's reversal pass keys on source `status = CANCELED`. The UI
offers no way to reach that state for an expense — only a hard delete, which removes the
source entirely so the reversal pass never sees it. The posting stays active forever and
the residual can never return to 0 through the product's own surface.

### Test 3 — PE-from-transaction button (was HTTP 500)

| File | Shows |
|---|---|
| `t5-bankrec.png` | «التسوية البنكية» workspace with the seeded June-2025 feed (35 / 250 / 400 unmatched). |
| `t5-selected.png` | `BTR-2025-00003` (250 deposit) selected; matcher proposes `JV-2025-00003` scored **90** (`amount، date`). Actions: «سوِّ» · «قيد مصاريف/إيراد» · «سند قبض/صرف» · «تحويل داخلي». |
| `t5-pe-dialog.png` | The PE dialog opens (no 500) — «سند قبض … بمبلغ الحركة غير المخصص، ويُرحَّل ويُخصص لها فورًا». |
| `t5-pe-created.png`, `t5-after-pe.png` | `PAY-2025-00001` RECEIVE 250 SUBMITTED; `BTR-2025-00003` → RECONCILED (250 allocated / 0 unallocated) and gone from the unmatched feed. |

> ⚠️ **Caveat visible in `t5-selected.png`:** the transaction already had a book match
> scored 90, and the workspace offers «سوِّ» and «سند قبض/صرف» side by side with no warning.
> Taking the PE path created a **second** 250 receipt, so the books now hold that deposit
> twice — `JV-2025-00003` (250, uncleared forever) *and* `PAY-2025-00001` (250, cleared).

### Test 5 — bank rules + BRS

| File | Shows |
|---|---|
| `t7-rules.png` | «قواعد البنك» with the seeded rule «رسوم البنك (عرض)» (priority 1 · الوصف يحتوي «رسوم» · سحب فقط → مصروفات عرض التسوية) and the inline engine-flag switch, initially off. |
| `t7-rules-ran.png` | The «تشغيل القواعد الآن» confirm dialog. |
| `t7-ran.png` | **«فُحصت 2 حركة غير مسوّاة — سُوّيت 1 منها»** via the rule. `BTR-2025-00004` (the 35 fee) → **SETTLED** — distinguishable from hand reconciliation (decision D4). |
| `t6-brs.png` | «تقارير البنوك» before an account is chosen. |
| `t6-brs-baseline.png` | BRS baseline as of 2025-06-30: GL 1,600 / uncleared −150 / calculated 1,750 / feed 1,315 · **residual 435**. |
| `t8-matched.png`, `t8-matched2.png` | Matching `BTR-2025-00002` (400) to `JV-2025-00002` via «سوِّ»; feed then empty. |
| `t9-brs-final.png` | **BRS final: GL 1,565 / uncleared 250 / calculated 1,315 / feed 1,315 · الفرق المتبقي 0.** |

> ⚠️ **A zero BRS does not prove clean books.** The final residual is 0 *despite* the
> duplicated 250 above, because `غير المُقاصّ 250` excludes `JV-2025-00003` from the bank
> comparison. The arithmetic is internally consistent (1,565 − 250 = 1,315 = feed) but it
> conceals a real double-booking. Read 0 as "bank agrees with books", not "books are correct".
>
> The baseline is **435**, not the 185 the PR body predicts, for the same reason — the PE
> double-book inflated GL before the rules step. The *shape* of 185 → 150 → 0 held (the rule
> settles only the fee; matching closes the rest to 0) but the intermediate figures depend on
> which of the two offered actions you take on the 250.

## Verdict recorded at the time

Posting and reconciliation hold through the UI: all four previously-broken items work from
screens, both reports read a literal **0** across 1,644 + 159 documents with source = posted
= GL to the cent, and the full ledger foots to zero (Σdebit = Σcredit = 998,176.76).

**Reversal does not hold.** There is no UI path to a cancelled expense, and the delete that
does exist creates a permanent orphan the adapter refuses to reverse. That branch remains
verified only by CI calling services directly — the same blind spot that produced the earlier
403/400/409 defects.

Two follow-ups suggested: give the expense module a real cancel action (status → `CANCELED`,
not delete) **or** make the adapter treat a vanished source as reversal-eligible; and guard
the PE button when a high-scoring match already exists.


---

# Round 2 — re-verification of the failing items (`1d76d80`)

After the `[P12A-fix5]` push, the three previously-failing items were re-run **through the
UI only**, same conditions (real CDP events; no curl, no service calls, no DB writes), in the
same clinic «عيادة الاختبار» — **on the existing damaged data, with no repair or re-seed**.

| Item | Verdict | From the screen |
|---|---|---|
| Expense cancel exists; delete gone for PAID | ✅ | Row menu: عرض · تعديل · تنزيل · **«إلغاء المصروف وعكس القيد»**; no delete anywhere |
| Reversal posts with a named reason | ✅ | «0 ترحيل · **2 عكس** · 0 خطأ» |
| Report heals to literal 0 | ✅ | **−779 → 0** |
| Pre-existing orphan reverses | ✅ | `GEN2-2025-E0002: عُكس القيد — **المستند المصدر محذوف**` |
| Delete a posted expense refused | ✅ (stronger) | Affordance **removed**, not refused — see note |
| PE duplicate guard | ✅ | Names `PAY-2025-00001 — 250 · درجة التطابق 130`; submit disabled until «أؤكّد» |
| Zero-BRS caveat on screen | ✅ | Caveat text now rendered whenever residual = 0 |

| File | Shows |
|---|---|
| `r1-row-menu.png` | PAID expense row menu — **«إلغاء المصروف وعكس القيد»** present, delete gone. |
| `r6-menu-unposted.png` | An APPROVED (unposted) expense gets «إلغاء الطلب» instead — no ledger wording, still no delete. |
| `r7-detail-paid.png` | Detail dialog of a PAID/posted expense: «حذف الطلب» is **gone**, replaced by «إلغاء الطلب». |
| `r2-cancel-confirm.png` | Cancel confirmation, reason required, and it states the consequence: «عكس القيد المحاسبي عند تشغيل محول المصروفات — قيد عكسي جديد يُلغي الأثر دون حذف أي حركة (AR-2)». |
| `r3-report-before.png` | **Before:** source 38,533 / posted 39,312 / GL 39,312 · **residual −779**, orphans `GEN2-2025-E0002` (453) + `GEN2-2025-E0003` (326). |
| `r4-adapter-reversal.png` | Adapter run: «0 ترحيل · **2 عكس** · 0 خطأ» — `GEN2-2025-E0002: عُكس القيد — المستند المصدر محذوف`, `GEN2-2025-E0003: عُكس القيد — المستند المصدر ملغى`. |
| `r5-report-after.png` | **After:** 38,533 / 38,533 / 38,533 · **الفرق المتبقي 0** · «مطابقة تامة» · both tables empty. |
| `r10-pe-guard.png` | PE dialog on a transaction with a candidate: names **`PAY-2025-00001 — 250 · درجة التطابق 130`**, warns «إنشاء سند جديد سيُسجّل المبلغ مرتين», and gates on «أؤكّد أن هذه دفعة منفصلة». |
| `r11-guard-blocks.png` | Party chosen, confirmation unticked → «إنشاء السند» **disabled**; clicking books nothing (PE count stayed 1). |
| `r11-guard-armed.png` | After ticking the confirmation the button enables — the guard is a gate, not a block. |
| `r12-brs-caveat.png` | BRS at residual **0** now carries: «الفرق المتبقي = صفر يعني أن رصيد البنك يوافق ما هو مُقاصّ في الدفاتر — **لا أنّ الدفاتر صحيحة**… راجع «السندات غير المُقاصّة» أدناه» — demonstrated live, with the duplicate `JV-2025-00003` listed directly beneath. |

**Note on the delete refusal.** The brief expected a 400 telling the user to cancel instead.
The shipped behaviour is stronger: the delete affordance is **removed entirely** for expenses
(row menu and detail dialog alike), so the refusal is unreachable from the browser. The 400
itself could only be observed with a direct HTTP call, which this run forbade — recorded as
PASS on intent, not observed as a status code.

**Ledger integrity after the reversals:** both reversed documents net to zero by AR-2 append
rather than deletion — `GEN2-2025-E0002` 4 rows Dr 906 = Cr 906, `GEN2-2025-E0003` 4 rows
Dr 652 = Cr 652 — and the clinic's full ledger foots at Σdebit = Σcredit = **997,867.76**.
Active postings: clinic_invoice 1,644 · expense 157 (2 reversed).

**The duplicate from round 1 is still present and now visible.** `JV-2025-00003` (250) remains
uncleared beside `PAY-2025-00001`; the BRS reads 0 *and* says why that does not mean the books
are clean. The guard prevents creating new duplicates; it does not retro-clean this one.

---

## ⚠️ This clinic is NOT a clean reference dataset

The test clinic used for these runs carries a **known double-booking** from round 1:
`JV-2025-00003` (250, uncleared forever) and `PAY-2025-00001` (250, cleared) are the same
bank deposit recorded twice. It was created *by* the defect this phase fixed — the PE button
offered itself beside «سوِّ» with no warning — and the `[P12A-fix5]` guard prevents new ones
without retro-cleaning old ones.

So: **do not use this clinic's figures as a baseline for anything.** Its bank-side totals are
overstated by 250, and its BRS reads a legitimate 0 only because the duplicate JV is uncleared
and therefore outside the bank comparison (contract **KL-6**). Every figure quoted in this
README is correct *for this clinic as it stands* — they are evidence that the fixes behave,
not reference values for a healthy ledger.

To clean it if it ever matters: unallocate `PAY-2025-00001` from its bank transaction, cancel
it, and settle the transaction against `JV-2025-00003` via «سوِّ» instead. Nothing in the
product requires this — the clinic is a scratch dataset.

## Follow-up closed: the delete refusal now has its own proof

The note above records that the 400 could not be observed from the browser, because the
delete affordance is gone. That gap is closed in code rather than by another manual run:
`src/server/expenses/expenses-delete-guard.controller.test.ts` drives
`DELETE /api/expenses/:id` over real HTTP as an authorized ADMIN against a posted expense and
pins the **400**, the «ألغِ المصروف» message, that the expense is **still present** after the
refusal, that cancel then succeeds on that same expense, and that deletion is allowed again
once the posting is reversed. Screens and server are now each proved by the layer that can
actually see them.
