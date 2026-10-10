import { RadiologyModality, SedationLevel } from "@/generated/prisma/enums";

// قدرات كل طريقة تصوير — المصدر الوحيد الذي تتكيّف عليه الشاشات.
// ملف بيانات/دوال نقية (بدون db) — يُستورد من الخادم والواجهة معًا.
//
// الفكرة: الفحص بالموجات فوق الصوتية لا جرعة إشعاعية له ولا سؤال حمل، والرنين
// المغناطيسي لا إشعاع فيه لكن الغرسات المعدنية خطر حقيقي، والأشعة السينية
// عكسهما. فبدل عرض كل الحقول لكل فحص ثم ترك المستخدم يتجاهل ما لا يعنيه،
// تُشتق كل شاشة ما تعرضه من هذه القدرات.

/** حقول الجرعة الممكنة — كل طريقة تعرض ما يخصّها وحده */
export type DoseField = "kvp" | "mas" | "doseDap" | "ctdiVol" | "dlp";

/** كم يحتاج هذا الفحص إلى تهدئة عادةً (في الطب البيطري) */
export type SedationNeed = "usually" | "sometimes" | "rarely";

export type ModalityCapabilities = {
	/** إشعاع مؤيّن — يُظهر توثيق الجرعة وسؤال احتمال الحمل */
	ionizing: boolean;
	/** حقول الجرعة المعروضة في خطوة الالتقاط */
	doseFields: DoseField[];
	/** يقبل مادة تباين — يُظهر كتلة التباين وسؤال التفاعل السابق */
	contrast: boolean;
	/** الغرسات المعدنية خطر سلامة (الرنين) لا مجرد أثر على الصورة */
	metalSafety: boolean;
	/** الحاجة المعتادة للتهدئة — تُبرز الحقل أو تُخفيه خلف تلميح */
	sedation: SedationNeed;
	/** تسمية مجموعة الالتقاط: إسقاطات للأشعة، تسلسلات للرنين، أطوار للمقطعية... */
	protocolLabel: string;
	/** تسمية مفردة تُستخدم في الجُمل ("أضف {term})" */
	protocolItemLabel: string;
	/** الخيارات المقترحة لتلك المجموعة، مصنّفة */
	protocolGroups: { label: string; options: string[] }[];
	/** يلتقط مقاطع متحركة (سينية) لا صورًا ساكنة فقط */
	cine: boolean;
};

// ── مجموعات البروتوكول لكل عائلة ────────────────────────────────────────────

/** الإسقاطات الشعاعية — الأشعة السينية والتنظير وتصوير الثدي */
const PROJECTION_GROUPS = [
	{
		label: "إسقاطات عامة",
		options: [
			"جانبي أيمن (Right lateral)",
			"جانبي أيسر (Left lateral)",
			"بطني ظهري (VD)",
			"ظهري بطني (DV)",
		],
	},
	{
		label: "الأطراف والمفاصل",
		options: [
			"أمامي خلفي (Craniocaudal)",
			"إنسي وحشي (Mediolateral)",
			"مائل (Oblique)",
			"محوري (Skyline)",
			"إسقاط مُجهَد (Stress view)",
		],
	},
	{
		label: "الرأس والأسنان",
		options: ["جانبي جمجمة", "ظهري بطني جمجمة", "مائل جمجمة", "داخل الفم (Intraoral)"],
	},
];

/** تسلسلات الرنين المغناطيسي */
const MRI_SEQUENCE_GROUPS = [
	{
		label: "التسلسلات الأساسية",
		options: [
			"T1-weighted",
			"T2-weighted",
			"FLAIR",
			"STIR",
			"Proton density (PD)",
			"GRE / T2*",
		],
	},
	{
		label: "بعد التباين والتسلسلات الخاصة",
		options: [
			"T1 بعد الجادولينيوم (T1+C)",
			"DWI / ADC",
			"MR ميلوغرام",
			"MR أنجيوغرام",
			"3D حجمي",
		],
	},
	{
		label: "المستويات",
		options: ["محوري (Transverse)", "سهمي (Sagittal)", "إكليلي (Dorsal)"],
	},
];

/** أطوار ونوافذ التصوير المقطعي */
const CT_PHASE_GROUPS = [
	{
		label: "الأطوار",
		options: [
			"بدون تباين (Pre-contrast)",
			"طور شرياني",
			"طور وريدي",
			"طور متأخر",
			"دراسة أنجيو (CTA)",
		],
	},
	{
		label: "نوافذ إعادة البناء",
		options: [
			"نافذة أنسجة رخوة",
			"نافذة عظمية",
			"نافذة رئوية",
			"إعادة بناء متعدد المستويات (MPR)",
		],
	},
];

/** مقاطع ونوافذ الموجات فوق الصوتية */
const ULTRASOUND_GROUPS = [
	{
		label: "أعضاء البطن",
		options: [
			"كبد ومرارة",
			"طحال",
			"كلية يمنى",
			"كلية يسرى",
			"مثانة",
			"بنكرياس",
			"غدد كظرية",
			"أمعاء ومعدة",
			"عقد لمفية",
		],
	},
	{
		label: "الجهاز التناسلي",
		options: ["رحم", "مبايض", "حمل — عدد الأجنّة", "بروستاتا", "خصيتان"],
	},
	{
		label: "القلب (إيكو)",
		options: [
			"محور طويل أيمن",
			"محور قصير أيمن",
			"رباعي الحجرات",
			"دوبلر ملوّن",
			"دوبلر نبضي/مستمر",
			"M-mode",
		],
	},
	{
		label: "مقاطع ونوافذ",
		options: ["مقطع طولي", "مقطع عرضي", "نافذة موجّهة للطوارئ (FAST)"],
	},
];

/** دراسات التنظير الإشعاعي الديناميكية */
const FLUOROSCOPY_GROUPS = [
	{
		label: "الدراسات الديناميكية",
		options: [
			"بلع الباريوم",
			"مرور معوي بالباريوم",
			"حقنة باريوم شرجية",
			"تصوير مثانة راجع",
			"ميلوغرام",
			"تقييم انهيار الرغامى",
		],
	},
	...PROJECTION_GROUPS,
];

/** دراسات الطب النووي */
const NUCLEAR_GROUPS = [
	{
		label: "نمط الدراسة",
		options: [
			"مسح ساكن (Static)",
			"مسح ديناميكي (Dynamic)",
			"مسح كامل الجسم",
			"مسح عظام",
			"مسح درقية",
			"مسح كلوي",
		],
	},
];

/** الأسنان داخل الفم */
const DENTAL_GROUPS = [
	{
		label: "إسقاطات داخل الفم",
		options: [
			"منصّف الزاوية (Bisecting angle)",
			"موازٍ (Parallel)",
			"إطباقي علوي",
			"إطباقي سفلي",
			"الربع الأيمن العلوي",
			"الربع الأيسر العلوي",
			"الربع الأيمن السفلي",
			"الربع الأيسر السفلي",
		],
	},
];

// ── جدول القدرات ────────────────────────────────────────────────────────────

const CAPABILITIES: Record<RadiologyModality, ModalityCapabilities> = {
	[RadiologyModality.XRAY]: {
		ionizing: true,
		doseFields: ["kvp", "mas", "doseDap"],
		// دراسات التباين الشعاعية موجودة (باريوم، ميلوغرام) وإن قلّت
		contrast: true,
		metalSafety: false,
		sedation: "sometimes",
		protocolLabel: "الإسقاطات",
		protocolItemLabel: "إسقاط",
		protocolGroups: PROJECTION_GROUPS,
		cine: false,
	},
	[RadiologyModality.CT]: {
		ionizing: true,
		doseFields: ["kvp", "mas", "ctdiVol", "dlp"],
		contrast: true,
		metalSafety: false,
		sedation: "usually",
		protocolLabel: "الأطوار وإعادة البناء",
		protocolItemLabel: "طور",
		protocolGroups: CT_PHASE_GROUPS,
		cine: false,
	},
	[RadiologyModality.MRI]: {
		// لا إشعاع مؤيّن — لا جرعة ولا سؤال حمل، لكن الغرسات المعدنية خطر حقيقي
		ionizing: false,
		doseFields: [],
		contrast: true,
		metalSafety: true,
		sedation: "usually",
		protocolLabel: "التسلسلات",
		protocolItemLabel: "تسلسل",
		protocolGroups: MRI_SEQUENCE_GROUPS,
		cine: false,
	},
	[RadiologyModality.ULTRASOUND]: {
		ionizing: false,
		doseFields: [],
		// التباين بالموجات فوق الصوتية نادر جدًا في الطب البيطري
		contrast: false,
		metalSafety: false,
		sedation: "rarely",
		protocolLabel: "المقاطع والأعضاء",
		protocolItemLabel: "مقطع",
		protocolGroups: ULTRASOUND_GROUPS,
		cine: true,
	},
	[RadiologyModality.FLUOROSCOPY]: {
		ionizing: true,
		doseFields: ["kvp", "mas", "doseDap"],
		contrast: true,
		metalSafety: false,
		sedation: "sometimes",
		protocolLabel: "الدراسة والإسقاطات",
		protocolItemLabel: "دراسة",
		protocolGroups: FLUOROSCOPY_GROUPS,
		cine: true,
	},
	[RadiologyModality.MAMMOGRAPHY]: {
		ionizing: true,
		doseFields: ["kvp", "mas", "doseDap"],
		contrast: false,
		metalSafety: false,
		sedation: "sometimes",
		protocolLabel: "الإسقاطات",
		protocolItemLabel: "إسقاط",
		protocolGroups: PROJECTION_GROUPS,
		cine: false,
	},
	[RadiologyModality.NUCLEAR]: {
		ionizing: true,
		// الجرعة هنا نشاط إشعاعي للمستحضر لا معاملات أنبوب — تُوثَّق في الملاحظات
		doseFields: [],
		contrast: false,
		metalSafety: false,
		sedation: "usually",
		protocolLabel: "نمط الدراسة",
		protocolItemLabel: "مسح",
		protocolGroups: NUCLEAR_GROUPS,
		cine: true,
	},
	[RadiologyModality.PET]: {
		ionizing: true,
		doseFields: ["ctdiVol", "dlp"],
		contrast: true,
		metalSafety: false,
		sedation: "usually",
		protocolLabel: "نمط الدراسة",
		protocolItemLabel: "مسح",
		protocolGroups: NUCLEAR_GROUPS,
		cine: false,
	},
	[RadiologyModality.DENTAL]: {
		ionizing: true,
		doseFields: ["kvp", "mas"],
		contrast: false,
		metalSafety: false,
		// الأسنان في الطب البيطري تُصوَّر تحت تخدير دائمًا تقريبًا
		sedation: "usually",
		protocolLabel: "الإسقاطات",
		protocolItemLabel: "إسقاط",
		protocolGroups: DENTAL_GROUPS,
		cine: false,
	},
	[RadiologyModality.OTHER]: {
		ionizing: false,
		doseFields: [],
		contrast: true,
		metalSafety: false,
		sedation: "sometimes",
		protocolLabel: "الإسقاطات",
		protocolItemLabel: "إسقاط",
		protocolGroups: PROJECTION_GROUPS,
		cine: false,
	},
};

// ── استنتاج طريقة التصوير من الأسماء ────────────────────────────────────────
// شبكة أمان حين لا تعريف للفحص بعد: الكتالوج نفسه يحمل الدلالة («التصوير
// المقطعي (CT)» ← CT)، فلا يسقط فحص مقطعية إلى «أشعة سينية» لمجرد أن أحدًا
// لم يفتح لوحة التعريف. اسم الفحص يُفحص قبل اسم مجموعته لأنه الأدق
// («مسح PET» داخل مجموعة «الطب النووي و PET»).

const MODALITY_KEYWORDS: [RadiologyModality, RegExp][] = [
	// PET قبل النووي — مجموعتهما مشتركة والاسم يفصل بينهما.
	// هذا النمط وحده حسّاس لحالة الأحرف بلا i: «PET» اختصار طبي، بينما «Pet»
	// كلمة شائعة في تطبيق بيطري («Pet X-Ray»)، فالتمييز بينهما بحالة الأحرف.
	[RadiologyModality.PET, /\bPET\b|بوزيترون/],
	[RadiologyModality.NUCLEAR, /نووي|nuclear|scint/i],
	[RadiologyModality.MRI, /رنين|مغناطيسي|mri/i],
	[RadiologyModality.CT, /مقطعية|محوسب|\bct\b/i],
	[RadiologyModality.ULTRASOUND, /سونار|موجات|إيكو|ايكو|دوبلر|ultra\s*sound|echo/i],
	[RadiologyModality.FLUOROSCOPY, /تنظير|باريوم|fluoro/i],
	[RadiologyModality.MAMMOGRAPHY, /ثدي|mammo/i],
	// الأسنان قبل السينية — «أشعة أسنان» فحص أسنان لا أشعة عامة
	[RadiologyModality.DENTAL, /أسنان|اسنان|dental|داخل الفم/i],
	[RadiologyModality.XRAY, /سيني|x-?ray/i],
];

/**
 * يستنتج طريقة التصوير من أسماء تُفحص بالترتيب (الاسم الأدق أولًا).
 * null يعني أن الأسماء لا تدل — والمستدعي يقرّر البديل.
 */
export const inferModalityFromNames = (
	...names: (string | null | undefined)[]
): RadiologyModality | null => {
	for (const name of names) {
		if (!name) continue;
		for (const [modality, pattern] of MODALITY_KEYWORDS) {
			if (pattern.test(name)) return modality;
		}
	}
	return null;
};

/** قدرات طريقة التصوير — المصدر الذي تتكيّف عليه كل شاشات سير العمل */
export const modalityCapabilities = (modality: RadiologyModality): ModalityCapabilities =>
	CAPABILITIES[modality] ?? CAPABILITIES[RadiologyModality.OTHER];

// ── تسميات مساعدة ───────────────────────────────────────────────────────────

export const DOSE_FIELD_META: Record<
	DoseField,
	{ label: string; unit: string; step: string }
> = {
	kvp: { label: "جهد الأنبوب", unit: "kVp", step: "0.1" },
	mas: { label: "شدة التيار الزمنية", unit: "mAs", step: "0.1" },
	doseDap: { label: "حاصل الجرعة والمساحة", unit: "dGy·cm²", step: "0.0001" },
	ctdiVol: { label: "مؤشر جرعة المقطعية", unit: "CTDIvol mGy", step: "0.0001" },
	dlp: { label: "حاصل الجرعة والطول", unit: "DLP mGy·cm", step: "0.0001" },
};

export const SEDATION_NEED_HINT: Record<SedationNeed, string> = {
	usually: "هذا الفحص يتطلب تخديرًا أو تهدئة في الغالب — الحركة تُفسد الصور.",
	sometimes: "قد يحتاج تهدئة حسب تعاون الطفل وموضع التصوير.",
	rarely: "نادرًا ما يحتاج تهدئة — يُجرى والطفل مستيقظ في الغالب.",
};

/** التهدئة الافتراضية المقترحة لطريقة التصوير — تُستخدم في تعريف الفحص */
export const suggestedSedation = (modality: RadiologyModality): SedationLevel => {
	const need = modalityCapabilities(modality).sedation;
	if (need === "usually") return SedationLevel.SEDATION;
	return SedationLevel.NONE;
};
