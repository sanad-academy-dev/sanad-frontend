import {
	InpatientAdministrationStatus,
	type InpatientOrderKind,
} from "@/generated/prisma/enums";

/**
 * [IP2] محرّك الاستحقاق — «من يحتاج شيئًا الآن؟».
 *
 * نقيّ تمامًا: لا قاعدة بيانات، ولا ساعة داخلية (اللحظة تُمرَّر دائمًا). هذا هو
 * الملفّ الذي يقرّر ترتيب لوحة العنبر، وهو أهمّ سطر في الوحدة كلّها: عنبرٌ مرتّب
 * أبجديًّا يجعل الطاقم يبحث عمّن يحتاجه، وعنبرٌ مرتّب بالاستحقاق يقول له.
 *
 * ── المبدأ المستعار من محرّك استحقاق اللقاحات ────────────────────────────────
 *
 * الحالة تُصنَّف ولا تُخمَّن. غياب البيانات حالةٌ باسمها (`NO_BASELINE`) لا
 * «سليم»: عنبرٌ لم يُقَس فيه شيء منذ الدخول ليس عنبرًا منضبطًا، وقراءته كذلك
 * تُخفي بالضبط ما وُجد النظام ليُظهره.
 *
 * ── لماذا لا يوجد `MISSED` مخزَّنًا ────────────────────────────────────────
 *
 * «الجرعة فاتت» اشتقاقٌ من (`dueAt` + المهلة < الآن) على صفٍّ ما زال PENDING.
 * تخزينه يستلزم وظيفة دوريّة تكتبه، ولا مجدول في هذا المستودع (الخطة §4.7) —
 * فيصير العمود صادقًا فقط حين يكون أحدٌ مفتوحًا للشاشة، وهي اللحظة التي لا نحتاجه
 * فيها أصلًا. الاشتقاق عند القراءة يبقى صحيحًا دائمًا.
 */

// ── العتبات ────────────────────────────────────────────────────────────────

/**
 * مهلة السماح للجرعة بالدقائق. الرقم ليس اعتباطيًّا: قاعدة «الثلاثين دقيقة»
 * ممارسة تطفلية قياسية — الجرعة «في موعدها» ضمن ±٣٠ دقيقة من الوقت المجدول،
 * وما بعدها انحرافٌ يُسجَّل. جعلها صفرًا يجعل كل جرعة متأخّرة إنذارًا، فيتعلّم
 * الطاقم تجاهل اللون الأحمر — وهو أسوأ ما يمكن أن يفعله نظام إنذار.
 */
export const DEFAULT_ADMINISTRATION_GRACE_MINUTES = 30;

/** نافذة «يقترب موعده» — ما يظهر أصفر على اللوحة قبل أن يستحقّ */
export const DEFAULT_DUE_SOON_MINUTES = 30;

/** أقلّ مهلة سماح مهما ضاقت دورية المراقبة */
const MIN_GRACE_MINUTES = 5;

const MINUTE_MS = 60_000;

// ── الأنواع ────────────────────────────────────────────────────────────────

export type InpatientDueStatus = "ON_TRACK" | "DUE_SOON" | "DUE" | "OVERDUE";

/** ترتيب الشدّة — الأعلى رقمًا يَجُبّ ما دونه عند التجميع */
const DUE_STATUS_RANK: Record<InpatientDueStatus, number> = {
	ON_TRACK: 0,
	DUE_SOON: 1,
	DUE: 2,
	OVERDUE: 3,
};

export const INPATIENT_DUE_STATUS_LABELS: Record<InpatientDueStatus, string> = {
	ON_TRACK: "منضبط",
	DUE_SOON: "يقترب موعده",
	DUE: "مستحقّ الآن",
	OVERDUE: "فات موعده",
};

export const worstDueStatus = (statuses: readonly InpatientDueStatus[]): InpatientDueStatus =>
	statuses.reduce<InpatientDueStatus>(
		(worst, s) => (DUE_STATUS_RANK[s] > DUE_STATUS_RANK[worst] ? s : worst),
		"ON_TRACK",
	);

/** ما يحتاجه المحرّك من صفّ الإعطاء — لا يستورد النموذج كي يبقى نقيًّا */
export type DueAdministrationInput = {
	id: string;
	orderId: string;
	dueAt: Date;
	status: InpatientAdministrationStatus;
	orderKind: InpatientOrderKind;
	/** اسم المادة/الأمر كما يُعرض في القائمة */
	label: string;
};

export type EvaluatedAdministration = DueAdministrationInput & {
	dueStatus: InpatientDueStatus;
	/** دقائق التأخّر عن الموعد — موجبة فقط للمتأخّر، وإلا صفر */
	minutesLate: number;
};

/** حالة استحقاق القياس الدوري — منفصلة لأن غياب خطّ الأساس حالة قائمة بذاتها */
export type VitalsDueState = "NOT_SCHEDULED" | "NO_BASELINE" | "ON_TRACK" | "DUE" | "OVERDUE";

export const VITALS_DUE_STATE_LABELS: Record<VitalsDueState, string> = {
	NOT_SCHEDULED: "لا مراقبة دوريّة مضبوطة",
	NO_BASELINE: "لم تُسجَّل علامات حيوية بعد",
	ON_TRACK: "القياس منضبط",
	DUE: "القياس مستحقّ الآن",
	OVERDUE: "فات موعد القياس",
};

export type InpatientDueEvaluation = {
	/** الحالة المجمَّعة — أسوأ ما في الإقامة، وهي ما يُلوَّن به كرت اللوحة */
	status: InpatientDueStatus;
	/** أقرب استحقاق قادم أو فائت — هو ما يُخزَّن كاشًا في `InpatientStay.nextDueAt` */
	nextDueAt: Date | null;
	overdue: readonly EvaluatedAdministration[];
	due: readonly EvaluatedAdministration[];
	dueSoon: readonly EvaluatedAdministration[];
	vitals: {
		state: VitalsDueState;
		dueAt: Date | null;
		minutesLate: number;
	};
};

export type DueEvaluationOptions = {
	graceMinutes?: number;
	dueSoonMinutes?: number;
};

// ── الاشتقاقات المفردة ─────────────────────────────────────────────────────

/**
 * هل فات هذا الصفّ موعده؟ الشرطان معًا: معلَّق، ومضى موعده ومهلته.
 *
 * الصفّ المُعطى أو المتخطَّى أو الموقوف ليس فائتًا مهما قدُم — قرارٌ اتُّخذ
 * وسُجِّل، والفوات غياب قرار لا قدَم تاريخ.
 */
export const isAdministrationMissed = (
	admin: Pick<DueAdministrationInput, "dueAt" | "status">,
	at: Date,
	graceMinutes: number = DEFAULT_ADMINISTRATION_GRACE_MINUTES,
): boolean =>
	admin.status === InpatientAdministrationStatus.PENDING &&
	admin.dueAt.getTime() + graceMinutes * MINUTE_MS < at.getTime();

export const administrationDueStatus = (
	admin: Pick<DueAdministrationInput, "dueAt" | "status">,
	at: Date,
	options: DueEvaluationOptions = {},
): InpatientDueStatus => {
	if (admin.status !== InpatientAdministrationStatus.PENDING) return "ON_TRACK";
	const grace = options.graceMinutes ?? DEFAULT_ADMINISTRATION_GRACE_MINUTES;
	const soon = options.dueSoonMinutes ?? DEFAULT_DUE_SOON_MINUTES;
	const now = at.getTime();
	const due = admin.dueAt.getTime();

	if (due + grace * MINUTE_MS < now) return "OVERDUE";
	if (due <= now) return "DUE";
	if (due <= now + soon * MINUTE_MS) return "DUE_SOON";
	return "ON_TRACK";
};

const minutesLateOf = (dueAt: Date, at: Date): number => {
	const diff = at.getTime() - dueAt.getTime();
	return diff > 0 ? Math.floor(diff / MINUTE_MS) : 0;
};

/**
 * موعد القياس الدوري القادم = آخر قياس + الدورية.
 *
 * دوريّة غير موجبة تعني «لا مراقبة مجدولة» لا «كل صفر دقيقة»: إقامة فندقية أو
 * حالة مستقرّة قد تُضبط بلا جدولة، وقسمةُ ذلك على نفسه تُنتج إنذارًا كل ثانية.
 */
export const nextVitalsDueAt = (
	lastVitalsAt: Date | null,
	monitoringIntervalMinutes: number,
): Date | null => {
	if (!Number.isFinite(monitoringIntervalMinutes) || monitoringIntervalMinutes <= 0)
		return null;
	if (!lastVitalsAt) return null;
	return new Date(lastVitalsAt.getTime() + monitoringIntervalMinutes * MINUTE_MS);
};

/**
 * حالة استحقاق القياس. مهلة السماح تضيق مع ضيق الدورية: مهلة ٣٠ دقيقة على
 * مراقبة كل ساعة تعني نصف الفترة، وهو ما يُفرغ الجدولة من معناها في العناية
 * المركّزة — حيث الدقائق هي المقصود أصلًا.
 */
export const evaluateVitalsDue = (input: {
	lastVitalsAt: Date | null;
	monitoringIntervalMinutes: number;
	at: Date;
	graceMinutes?: number;
}): { state: VitalsDueState; dueAt: Date | null; minutesLate: number } => {
	const { lastVitalsAt, monitoringIntervalMinutes, at } = input;

	if (!Number.isFinite(monitoringIntervalMinutes) || monitoringIntervalMinutes <= 0) {
		return { state: "NOT_SCHEDULED", dueAt: null, minutesLate: 0 };
	}
	// لا قياس منذ الدخول: حالةٌ باسمها لا «منضبط». الفرق عمليّ لا لفظي — الأولى
	// تُقرأ «اذهب وقِس الآن»، والثانية تُقرأ «لا شيء مطلوب».
	if (!lastVitalsAt) return { state: "NO_BASELINE", dueAt: null, minutesLate: 0 };

	const dueAt = new Date(lastVitalsAt.getTime() + monitoringIntervalMinutes * MINUTE_MS);
	const grace = Math.max(
		MIN_GRACE_MINUTES,
		Math.min(
			input.graceMinutes ?? DEFAULT_ADMINISTRATION_GRACE_MINUTES,
			Math.floor(monitoringIntervalMinutes / 2),
		),
	);
	const now = at.getTime();
	const minutesLate = minutesLateOf(dueAt, at);

	if (dueAt.getTime() + grace * MINUTE_MS < now)
		return { state: "OVERDUE", dueAt, minutesLate };
	if (dueAt.getTime() <= now) return { state: "DUE", dueAt, minutesLate };
	return { state: "ON_TRACK", dueAt, minutesLate: 0 };
};

const VITALS_STATE_TO_DUE_STATUS: Record<VitalsDueState, InpatientDueStatus> = {
	NOT_SCHEDULED: "ON_TRACK",
	// غياب خطّ الأساس مستحقٌّ الآن لا فائت: لم يمضِ موعد بعد، لكن شيئًا مطلوبًا.
	NO_BASELINE: "DUE",
	ON_TRACK: "ON_TRACK",
	DUE: "DUE",
	OVERDUE: "OVERDUE",
};

// ── التقييم المجمَّع ───────────────────────────────────────────────────────

/**
 * تقييم إقامة واحدة. المخرجات ثلاث قوائم مفصولة (فائت/مستحقّ/يقترب) لأن الواجهة
 * تعرض الثلاث مختلفةً، ودمجُها يجبر كل مستدعٍ على إعادة الفرز.
 */
export const evaluateInpatientDue = (input: {
	administrations: readonly DueAdministrationInput[];
	monitoringIntervalMinutes: number;
	lastVitalsAt: Date | null;
	at: Date;
	options?: DueEvaluationOptions;
}): InpatientDueEvaluation => {
	const { administrations, at } = input;
	const options = input.options ?? {};

	const pending = administrations.filter(
		(a) => a.status === InpatientAdministrationStatus.PENDING,
	);

	const evaluated: EvaluatedAdministration[] = pending.map((a) => ({
		...a,
		dueStatus: administrationDueStatus(a, at, options),
		minutesLate: minutesLateOf(a.dueAt, at),
	}));

	// الأقدم أولًا داخل كل مجموعة — الجرعة التي فاتت منذ ساعتين قبل التي فاتت منذ عشر دقائق
	const byDueAt = (a: EvaluatedAdministration, b: EvaluatedAdministration) =>
		a.dueAt.getTime() - b.dueAt.getTime();

	const overdue = evaluated.filter((a) => a.dueStatus === "OVERDUE").sort(byDueAt);
	const due = evaluated.filter((a) => a.dueStatus === "DUE").sort(byDueAt);
	const dueSoon = evaluated.filter((a) => a.dueStatus === "DUE_SOON").sort(byDueAt);

	const vitals = evaluateVitalsDue({
		lastVitalsAt: input.lastVitalsAt,
		monitoringIntervalMinutes: input.monitoringIntervalMinutes,
		at,
		graceMinutes: options.graceMinutes,
	});

	const status = worstDueStatus([
		...evaluated.map((a) => a.dueStatus),
		VITALS_STATE_TO_DUE_STATUS[vitals.state],
	]);

	// أقرب لحظة تحتاج فعلًا — الجرعات المعلَّقة والقياس القادم معًا. الفائت يُقدَّم
	// دائمًا لأن ماضيه أصغر من أي مستقبل، وهو المطلوب: الكاش يفرز بالإلحاح.
	const candidates: number[] = pending.map((a) => a.dueAt.getTime());
	if (vitals.dueAt) candidates.push(vitals.dueAt.getTime());
	const nextDueAt = candidates.length > 0 ? new Date(Math.min(...candidates)) : null;

	return { status, nextDueAt, overdue, due, dueSoon, vitals };
};

// ── توليد الجلسات ─────────────────────────────────────────────────────────

/**
 * جلسات الجرعات المشتقّة من جدول الأمر ضمن نافذة زمنية.
 *
 * دالّة نقيّة تُستدعى مرّتين: عند إنشاء الأمر (لتوليد صفوفه)، وعند تمديد الأفق
 * (لتوليد ما بعده). لا تُنشئ صفوفًا ولا تعرف عن قاعدة بيانات شيئًا — تُعيد لحظات
 * فقط، فيمكن اختبارها ومقارنة مخرجها بالمخزَّن بلا أثر جانبي.
 *
 * الجدولان لا يجتمعان: `scheduleTimes` (أوقات ثابتة من اليوم) يَجُبّ
 * `scheduleIntervalHours` حين يوجد — لأن «كل ٨ ساعات» و«٨ص و٤م و١٢م» جدولان
 * مختلفان لا يُدمجان، وطلبُ الاثنين خطأُ إدخال لا نيّةُ مضاعفة.
 */
export const generateAdministrationDueTimes = (input: {
	startAt: Date;
	endAt: Date | null;
	scheduleIntervalHours: number | null;
	/** "HH:mm" بتوقيت الأكاديمية */
	scheduleTimes: readonly string[];
	prn: boolean;
	/** آخر لحظة يُولَّد إليها — أفق التوليد */
	horizonEnd: Date;
	/** لا تُولَّد جلسات قبل هذه اللحظة (تمديد أفق أمر قائم) */
	generateAfter?: Date | null;
	/** سقف أمان لعدد الصفوف في الاستدعاء الواحد */
	maxOccurrences?: number;
}): Date[] => {
	// «عند اللزوم» بلا جدول أصلًا: صفّه يُنشأ لحظة إعطائه لا قبله.
	if (input.prn) return [];

	const limit = input.maxOccurrences ?? 500;
	const hardEnd = Math.min(
		input.horizonEnd.getTime(),
		input.endAt ? input.endAt.getTime() : Number.POSITIVE_INFINITY,
	);
	const after = input.generateAfter?.getTime() ?? Number.NEGATIVE_INFINITY;
	const out: Date[] = [];

	if (input.scheduleTimes.length > 0) {
		const parsed = input.scheduleTimes
			.map(parseClockTime)
			.filter((t): t is { hours: number; minutes: number } => t !== null)
			.sort((a, b) => a.hours * 60 + a.minutes - (b.hours * 60 + b.minutes));
		if (parsed.length === 0) return [];

		// يبدأ المسح من يوم البداية، ويمرّ يومًا بيوم حتى الأفق
		const cursor = new Date(input.startAt);
		cursor.setHours(0, 0, 0, 0);

		while (cursor.getTime() <= hardEnd && out.length < limit) {
			for (const t of parsed) {
				const at = new Date(cursor);
				at.setHours(t.hours, t.minutes, 0, 0);
				const ms = at.getTime();
				if (ms < input.startAt.getTime()) continue;
				if (ms > hardEnd) continue;
				if (ms <= after) continue;
				out.push(at);
				if (out.length >= limit) break;
			}
			cursor.setDate(cursor.getDate() + 1);
		}
		return out;
	}

	const hours = input.scheduleIntervalHours;
	if (!hours || !Number.isFinite(hours) || hours <= 0) return [];

	const stepMs = hours * 60 * MINUTE_MS;
	for (let ms = input.startAt.getTime(); ms <= hardEnd && out.length < limit; ms += stepMs) {
		if (ms <= after) continue;
		out.push(new Date(ms));
	}
	return out;
};

/** "HH:mm" → أجزاء، أو null لصيغة غير صالحة (لا تُخمَّن ولا تُصحَّح) */
export const parseClockTime = (value: string): { hours: number; minutes: number } | null => {
	const match = /^(\d{1,2}):(\d{2})$/.exec(value.trim());
	if (!match) return null;
	const hours = Number(match[1]);
	const minutes = Number(match[2]);
	if (!Number.isInteger(hours) || hours < 0 || hours > 23) return null;
	if (!Number.isInteger(minutes) || minutes < 0 || minutes > 59) return null;
	return { hours, minutes };
};

/**
 * أفق التوليد الافتراضي بالأيام. يومان يكفيان لوردية ونصف ويُبقيان عدد الصفوف
 * معقولًا؛ التمديد يجري تلقائيًّا عند كل قراءة للورقة، فلا حاجة إلى مجدول.
 */
export const DEFAULT_GENERATION_HORIZON_DAYS = 2;

export const generationHorizonEnd = (
	from: Date,
	days = DEFAULT_GENERATION_HORIZON_DAYS,
): Date => new Date(from.getTime() + days * 24 * 60 * MINUTE_MS);
