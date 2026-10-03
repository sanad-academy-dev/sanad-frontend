import {
	IconBedFlat,
	IconDoorExit,
	IconFeather,
	IconHeartBroken,
	IconHome,
	IconScissors,
	IconTruck,
} from "@tabler/icons-react";

import { DispositionKind } from "@/generated/prisma/enums";

/**
 * [E5.1] وصف كل مآل: أيقونته، وما سيحدث للزيارة، والإقرارات التي يقتضيها.
 *
 * بيانات لا شيفرة، لأنها تُقرأ في ثلاثة أماكن: شبكة الاختيار، ورقة المآل نفسها،
 * ومربّع التأكيد. ونسخُها في كلٍّ منها كان سيجعل مآلًا يُضاف بلا إقراره.
 *
 * ── لماذا مفاتيح القوالب هنا لا أنواع `ConsentType` ──────────────────────────
 *
 * وحدة الإقرارات تُعرّف بالقالب (`HOSPITALIZATION_V1`) لا بالنوع، لأن النصّ
 * القانوني يُصدَّر بنسخة: تعديله يُنشئ نسخة جديدة ولا يمسّ ما وُقّع على السابقة.
 * فالربط بالمفتاح هو الربط الصحيح، والنوع تفصيل داخليّ للقالب.
 */

export type DispositionFormSpec = {
	icon: typeof IconHome;
	/** ما سيحدث للزيارة — يُعرض قبل الضغط لا بعده */
	effect: string;
	/**
	 * قوالب الإقرارات المقترحة. **مقترحة لا حاجزة**: الطوارئ لا تُحبس على توقيع،
	 * وطفلٌ ينزف لا ينتظر ورقة. الشاشة تُظهر ما ينقص بوضوح، والقرار يمرّ.
	 */
	consentTemplateKeys: readonly string[];
	/**
	 * مآلٌ **يقتضي إقرارًا** ولا قالب له في النظام بعد. الفراغ وحده يُقرأ «لا إقرار
	 * لهذا المآل»، وهو عكس الحقيقة للقتل الرحيم؛ فهذا النصّ يجعل الغياب مرئيًّا
	 * وقابلًا للتصرّف بدل أن يمرّ صامتًا. ولا يُلفَّق نصّ قانونيّ هنا: النموذج
	 * الموقَّع من الأكاديمية هو مصدره الوحيد (نفس قاعدة `DrugMonograph`).
	 */
	consentGapNote?: string;
	/** نبرة تحذيرية للمآلات التي لا رجعة فيها */
	grave?: boolean;
};

export const DISPOSITION_FORMS: Record<DispositionKind, DispositionFormSpec> = {
	[DispositionKind.DISCHARGED]: {
		icon: IconHome,
		effect: "تُقفل الزيارة إلى «بانتظار الدفع». يشترط اكتمال الفحص السريري.",
		// الخروج السليم أو استكمال العلاج بالمنزل — المدرّب يختار الأنسب
		consentTemplateKeys: ["DISCHARGE_HEALTHY_V1", "DISCHARGE_HOME_TREATMENT_V1"],
	},
	[DispositionKind.ADMITTED]: {
		icon: IconBedFlat,
		effect: "يُكتب طلب تنويم ويستقبله العنبر. الزيارة تبقى مفتوحة.",
		consentTemplateKeys: ["HOSPITALIZATION_V1"],
	},
	[DispositionKind.TO_SURGERY]: {
		icon: IconScissors,
		effect: "تُفتح حالة عملية بالإلحاح الموروث من اللون. الزيارة تبقى مفتوحة.",
		consentTemplateKeys: ["SURGICAL_V1", "ANESTHESIA_V1"],
	},
	[DispositionKind.TRANSFERRED]: {
		icon: IconTruck,
		effect: "تُقفل الزيارة إلى «بانتظار الدفع» وتُسجَّل الوجهة.",
		// لا قالب تحويل في النظام بعد — يُضاف مع وحدة الإحالات
		consentTemplateKeys: [],
	},
	[DispositionKind.LEFT_AGAINST_ADVICE]: {
		icon: IconDoorExit,
		effect: "إن لم تبدأ الدورة تُلغى الزيارة؛ وإن بدأت تُقفل إلى «بانتظار الدفع» بما قُدِّم.",
		consentTemplateKeys: ["DISCHARGE_AGAINST_ADVICE_V1"],
	},
	[DispositionKind.DIED]: {
		icon: IconHeartBroken,
		effect:
			"يُختَم الفحص بالمآل وتُقفل الزيارة إلى «بانتظار الدفع». الفاتورة تبقى وتُحصَّل بمسارها.",
		consentTemplateKeys: [],
		grave: true,
	},
	[DispositionKind.EUTHANIZED]: {
		icon: IconFeather,
		effect:
			"يُختَم الفحص بالمآل وتُقفل الزيارة إلى «بانتظار الدفع». الفاتورة تبقى وتُحصَّل بمسارها.",
		// النوع `EUTHANASIA` موجود في التعداد بلا قالب نصّ بعد — يُضاف حين يصل
		// النموذج القانوني الموقَّع من الأكاديمية، ولا يُلفَّق نصّ إقرارٍ في هذه الأثناء.
		consentTemplateKeys: [],
		consentGapNote:
			"القتل الرحيم يقتضي إقرارًا موقَّعًا من وليّ الأمر، ولا قالب له في النظام بعد. " +
			"أرفِق نموذج الأكاديمية المعتمد من الإعدادات ← الإقرارات ليظهر هنا — ولن يُكتب نصّ " +
			"قانونيّ نيابةً عن الأكاديمية.",
		grave: true,
	},
};
