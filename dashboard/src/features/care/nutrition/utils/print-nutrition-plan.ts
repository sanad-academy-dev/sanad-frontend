import {
	FOOD_FORM_LABELS,
	GOAL_LABELS,
	MEASURE_UNIT_LABELS,
	type NutritionPlanDetailResponse,
} from "@sanad/contracts/runtime/server/nutrition/nutrition.type";

// نشرة التغذية — مستند A4 يُسلَّم للوليّ أمر.
//
// هذه ليست نسخة من الشاشة. الشاشة تخاطب مدرّبًا يريد الاشتقاق (RER، المعامل،
// المدى المرجعي)؛ والورقة تخاطب وليّ أمرًا يريد جوابًا واحدًا: **كم أُطعمه، ومتى.**
// لذلك:
//   • الكمّية اليومية هي أكبر رقم في الصفحة، وبوحدة المنزل قبل الجرام.
//   • مصطلحات الحساب لا تُطبع إطلاقًا — لا RER ولا DER ولا معامل.
//   • جدول الوجبات يُفصّل «كم في كل وجبة» لأن هذا ما يفعله وليّ الأمر فعلًا.
//   • الملاحظات الداخلية (`clinicalNotes`) لا تُطبع — ورقة وليّ الأمر ليست الملف.
//   • تُطبع بالأبيض والأسود بلا خسارة: التمييز بالحدود والوزن لا باللون وحده.

const escapeHtml = (value: string) =>
	value
		.replaceAll("&", "&amp;")
		.replaceAll("<", "&lt;")
		.replaceAll(">", "&gt;")
		.replaceAll('"', "&quot;");

const dateFmt = new Intl.DateTimeFormat("ar", { dateStyle: "long" });
const at = (v: Date | string | null | undefined) => (v ? dateFmt.format(new Date(v)) : "—");

const n = (v: unknown, digits = 1): string => {
	if (v == null) return "—";
	const num = Number(v);
	if (!Number.isFinite(num)) return "—";
	return Number.isInteger(num) ? String(num) : num.toFixed(digits).replace(/\.0$/, "");
};

/** «كوب ونصف» أقرب للوليّ أمر من «١٫٥ كوب» — الكسور الشائعة تُنطق لا تُقرأ */
const friendlyUnits = (value: number, unitLabel: string): string => {
	const whole = Math.floor(value);
	const frac = Math.round((value - whole) * 4) / 4;
	const fracWord =
		frac === 0.25 ? "وربع" : frac === 0.5 ? "ونصف" : frac === 0.75 ? "وثلاثة أرباع" : "";
	if (whole === 0 && fracWord) return `${fracWord.replace("و", "")} ${unitLabel}`.trim();
	if (!fracWord) return `${whole} ${unitLabel}`;
	return `${whole} ${fracWord} ${unitLabel}`;
};

type Item = NutritionPlanDetailResponse["items"][number];

/** سطر الكمّية اليومية كما يقرؤه وليّ الأمر */
const dailyAmount = (item: Item): string => {
	const grams = Number(item.gramsPerDay);
	const units = item.householdUnitsPerDay != null ? Number(item.householdUnitsPerDay) : null;
	const unitLabel = MEASURE_UNIT_LABELS[item.householdUnit];

	if (units != null && item.householdUnit !== "GRAM")
		return `${friendlyUnits(units, unitLabel)} <span class="muted">(${n(grams)} جم)</span>`;
	return `${n(grams)} جم`;
};

/** الكمّية لكل وجبة — الرقم الذي يُنفَّذ فعليًا عند الوعاء */
const perMealAmount = (item: Item, meals: number): string => {
	if (meals <= 0) return "—";
	const grams = Number(item.gramsPerDay) / meals;
	const units =
		item.householdUnitsPerDay != null ? Number(item.householdUnitsPerDay) / meals : null;
	const unitLabel = MEASURE_UNIT_LABELS[item.householdUnit];

	if (units != null && item.householdUnit !== "GRAM")
		return `${friendlyUnits(units, unitLabel)} <span class="muted">(${n(grams)} جم)</span>`;
	return `${n(grams)} جم`;
};

export const printNutritionPlan = (plan: NutritionPlanDetailResponse, clinicName: string) => {
	const win = window.open("", "_blank", "width=900,height=1000");
	if (!win) return;

	const meals = plan.mealsPerDay;
	const staples = plan.items.filter((i) => !i.isTreat);
	const treats = plan.items.filter((i) => i.isTreat);

	const itemRow = (item: Item) => `
		<tr>
			<td>
				<strong>${escapeHtml(item.nameSnapshot)}</strong>
				<div class="muted small">${escapeHtml(FOOD_FORM_LABELS[item.formSnapshot])}</div>
			</td>
			<td class="amount">${dailyAmount(item)}</td>
			<td class="amount">${perMealAmount(item, meals)}</td>
		</tr>`;

	const treatRow = (item: Item) => `
		<tr>
			<td><strong>${escapeHtml(item.nameSnapshot)}</strong></td>
			<td class="amount" colspan="2">${dailyAmount(item)} <span class="muted">— بحدّ أقصى</span></td>
		</tr>`;

	// خطوات التحويل التدريجي — نسب صريحة بدل «زِد تدريجيًا»
	const transitionSteps = plan.transitionDays
		? (() => {
				const days = plan.transitionDays as number;
				const q = Math.max(1, Math.round(days / 4));
				return [
					{ range: `١ – ${q}`, mix: "٢٥٪ جديد + ٧٥٪ قديم" },
					{ range: `${q + 1} – ${q * 2}`, mix: "٥٠٪ جديد + ٥٠٪ قديم" },
					{ range: `${q * 2 + 1} – ${q * 3}`, mix: "٧٥٪ جديد + ٢٥٪ قديم" },
					{ range: `${q * 3 + 1} – ${days}`, mix: "١٠٠٪ جديد" },
				]
					.map((s) => `<tr><td class="daycell">اليوم ${s.range}</td><td>${s.mix}</td></tr>`)
					.join("");
			})()
		: "";

	const instructions = plan.feedingInstructions
		? plan.feedingInstructions
				.split("\n")
				.map((line) => line.trim())
				.filter(Boolean)
				.map((line) => `<li>${escapeHtml(line.replace(/^[-*•]\s*/, ""))}</li>`)
				.join("")
		: "";

	const isWeightProgram = plan.goal === "WEIGHT_LOSS" || plan.goal === "WEIGHT_GAIN";

	win.document.write(`<!doctype html>
<html lang="ar" dir="rtl">
<head>
<meta charset="utf-8" />
<title>خطة التغذية — ${escapeHtml(plan.patient.name)}</title>
<style>
	@page { size: A4; margin: 14mm; }
	* { box-sizing: border-box; }
	body {
		font-family: "Segoe UI", Tahoma, sans-serif;
		color: #111827; line-height: 1.65; margin: 0; font-size: 12px;
	}
	.head { display: flex; justify-content: space-between; align-items: flex-start;
		border-bottom: 2px solid #111827; padding-bottom: 10px; margin-bottom: 14px; }
	.head h1 { font-size: 19px; margin: 0 0 3px; }
	.head .sub { color: #6b7280; font-size: 11px; }
	.head .clinic { text-align: end; font-size: 11px; color: #6b7280; }
	.head .clinic strong { display: block; font-size: 13px; color: #111827; }

	/* الرقم البطل — أول ما تقع عليه العين */
	.hero { border: 2px solid #111827; border-radius: 6px; padding: 12px 14px;
		display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px; }
	.hero .big { font-size: 30px; font-weight: 800; line-height: 1; font-variant-numeric: tabular-nums; }
	.hero .cap { font-size: 11px; color: #6b7280; margin-bottom: 4px; }
	.hero .side { text-align: end; font-size: 11px; color: #374151; }
	.hero .side b { font-variant-numeric: tabular-nums; }

	h2 { font-size: 12px; margin: 0 0 6px; text-transform: none;
		border-inline-start: 3px solid #111827; padding-inline-start: 7px; }
	section { margin-bottom: 13px; break-inside: avoid; }

	table { width: 100%; border-collapse: collapse; }
	th, td { border-bottom: 1px solid #e5e7eb; padding: 7px 6px; text-align: start; vertical-align: top; }
	th { background: #f3f4f6; font-weight: 700; font-size: 11px; }
	.amount { font-variant-numeric: tabular-nums; font-weight: 600; white-space: nowrap; }
	.muted { color: #6b7280; font-weight: 400; }
	.small { font-size: 10px; }
	.daycell { width: 34%; font-weight: 600; }

	.grid2 { display: grid; grid-template-columns: 1fr 1fr; gap: 4px 18px; font-size: 11.5px; }
	.grid2 > div { display: flex; justify-content: space-between; border-bottom: 1px dotted #e5e7eb; padding: 2px 0; }
	.grid2 .k { color: #6b7280; }
	.grid2 b { font-variant-numeric: tabular-nums; }

	ul { margin: 0; padding-inline-start: 17px; }
	li { margin-bottom: 3px; }

	.warn { border: 1px solid #111827; border-radius: 4px; padding: 8px 10px; font-size: 11px; }
	.warn b { display: block; margin-bottom: 3px; }

	.foot { margin-top: 14px; border-top: 1px solid #e5e7eb; padding-top: 8px;
		display: flex; justify-content: space-between; font-size: 10px; color: #6b7280; }
	.sign { margin-top: 16px; display: flex; gap: 40px; font-size: 11px; }
	.sign div { flex: 1; border-top: 1px solid #9ca3af; padding-top: 4px; color: #6b7280; }
</style>
</head>
<body>

<div class="head">
	<div>
		<h1>خطة التغذية — ${escapeHtml(plan.patient.name)}</h1>
		<div class="sub">
			${escapeHtml(plan.patient.animalType?.arName ?? "")}
			${plan.patient.owner?.name ? `· وليّ الأمر: ${escapeHtml(plan.patient.owner.name)}` : ""}
			· ${escapeHtml(GOAL_LABELS[plan.goal])}
		</div>
	</div>
	<div class="clinic">
		<strong>${escapeHtml(clinicName)}</strong>
		${escapeHtml(plan.code)}<br />${at(plan.startedAt ?? plan.createdAt)}
	</div>
</div>

<div class="hero">
	<div>
		<div class="cap">إجمالي ما يأكله في اليوم</div>
		<div class="big">${n(plan.derKcal, 0)} <span style="font-size:14px;font-weight:600">سعرة</span></div>
	</div>
	<div class="side">
		موزّعة على <b>${meals}</b> ${meals === 2 ? "وجبتين" : "وجبات"}<br />
		المكافآت لا تتجاوز <b>${n(plan.treatKcalAllowance, 0)}</b> سعرة
	</div>
</div>

<section>
	<h2>الطعام والكمّيات</h2>
	<table>
		<thead>
			<tr><th>الغذاء</th><th>في اليوم</th><th>في كل وجبة</th></tr>
		</thead>
		<tbody>
			${staples.map(itemRow).join("")}
			${
				treats.length
					? `<tr><th colspan="3" style="background:#fafafa">المكافآت — تُحسب من الإجمالي أعلاه</th></tr>${treats.map(treatRow).join("")}`
					: ""
			}
		</tbody>
	</table>
</section>

${
	isWeightProgram && plan.idealWeightKg
		? `<section>
	<h2>هدف الوزن</h2>
	<div class="grid2">
		<div><span class="k">الوزن اليوم</span><b>${n(plan.currentWeightKg)} كجم</b></div>
		<div><span class="k">الوزن المستهدف</span><b>${n(plan.idealWeightKg)} كجم</b></div>
		<div><span class="k">التغيّر المتوقّع أسبوعيًا</span><b>${n(plan.targetWeeklyRatePercent)}٪</b></div>
		<div><span class="k">المدّة المتوقّعة</span><b>${plan.estimatedWeeks ?? "—"} أسبوعًا</b></div>
	</div>
</section>`
		: ""
}

${
	transitionSteps
		? `<section>
	<h2>التحويل التدريجي عن الغذاء السابق</h2>
	<table><tbody>${transitionSteps}</tbody></table>
	<p class="muted small" style="margin:5px 0 0">
		التحويل المفاجئ يسبّب إسهالًا أو رفضًا للطعام — التزم بالنسب أعلاه.
	</p>
</section>`
		: ""
}

${instructions ? `<section><h2>تعليمات</h2><ul>${instructions}</ul></section>` : ""}

<section>
	<h2>المتابعة</h2>
	<div class="grid2">
		<div><span class="k">الوزن كل</span><b>${plan.recheckIntervalDays} يومًا</b></div>
		<div><span class="k">الموعد القادم</span><b>${at(plan.nextRecheckAt)}</b></div>
	</div>
	<p style="margin:6px 0 0">
		أحضِر الطفل للوزن في موعده. <strong>لا تغيّر الكمّيات من تلقاء نفسك</strong> —
		أي تعديل يُقرَّر بعد وزنة في الأكاديمية.
	</p>
</section>

<section>
	<div class="warn">
		<b>راجع الأكاديمية فورًا إذا:</b>
		امتنع عن الأكل أكثر من ٢٤ ساعة · تقيّأ أو أصابه إسهال متكرّر ·
		فقد أو اكتسب وزنًا بسرعة غير متوقّعة · تغيّر نشاطه أو سلوكه بوضوح.
	</div>
</section>

<div class="sign">
	<div>توقيع المدرّب${plan.prescriber ? ` — ${escapeHtml(plan.prescriber.name)}` : ""}</div>
	<div>استلمها وليّ الأمر</div>
</div>

<div class="foot">
	<span>هذه الخطة خاصّة بـ${escapeHtml(plan.patient.name)} وحده ولا تصلح لطفل آخر.</span>
	<span>${escapeHtml(plan.code)}</span>
</div>

<script>window.onload = () => { window.print(); };</script>
</body>
</html>`);
	win.document.close();
};
