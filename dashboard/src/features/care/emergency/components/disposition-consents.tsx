import { IconCircleCheckFilled, IconFileText, IconSignature } from "@tabler/icons-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { ConsentSheet } from "@/features/services/consents/components/consent-sheet";
import {
	useConsentTemplates,
	usePatientConsentMutations,
	usePatientConsents,
} from "@/features/services/consents/hooks/use-patient-consents";
import { ConsentStatus } from "@/generated/prisma/enums";
import { cn } from "@/lib/utils";

/**
 * [E5.2] إقرارات المآل — تُنشأ وتُعبَّأ وتُوقَّع من داخل ورقة القرار.
 *
 * الإنشاء والتعبئة والتوقيع كلّها من وحدة الإقرارات كما هي: `createConsent` يُنشئ
 * مسودّةً مربوطة بالزيارة، و`ConsentSheet` (ورقة الوحدة نفسها، بحقولها وتوقيعها
 * وشاهدها) تُفتح فوق هذه الورقة. لا نصّ قانوني ولا نموذج توقيع ثانٍ هنا.
 *
 * **مقترحة لا حاجزة، وهذا قرار سريريّ.** طفلٌ ينزف لا ينتظر توقيعًا، وحبسُ القرار
 * على ورقة يعني إمّا تأخير العلاج وإمّا توقيعًا صوريًّا. فالنقص يُقال بوضوح، والقرار
 * يمرّ، ويبقى النقص مرئيًّا في ملفّ الطفل.
 */
export const DispositionConsents = ({
	patientId,
	appointmentId,
	templateKeys,
	gapNote,
}: {
	patientId: string | null;
	appointmentId: string | null;
	templateKeys: readonly string[];
	/** مآلٌ يقتضي إقرارًا ولا قالب له — يُعرض بدل الصمت */
	gapNote?: string;
}) => {
	const { templates, isLoading: templatesLoading } = useConsentTemplates();
	const { consents } = usePatientConsents(patientId ?? undefined);
	const mutations = usePatientConsentMutations(patientId ?? "");
	const [openConsentId, setOpenConsentId] = useState<string | null>(null);

	if (templateKeys.length === 0) {
		if (!gapNote) return null;
		return (
			<p className="rounded-md border border-amber-500/30 bg-amber-500/5 px-3 py-2 text-amber-800 text-xs dark:text-amber-200">
				{gapNote}
			</p>
		);
	}

	if (!patientId) {
		return (
			<p className="rounded-md border border-dashed px-3 py-2 text-muted-foreground text-xs">
				الإقرار يُربط بملفّ الطفل — سجّل الطفل أوّلًا
			</p>
		);
	}

	if (templatesLoading) {
		return <Skeleton className="h-16 w-full rounded-md" />;
	}

	// الموقَّعة سارية لهذا القالب — لا يُعاد إنشاؤها، تُفتح
	const liveByKey = new Map(
		consents
			.filter((c) => c.status !== ConsentStatus.REVOKED)
			.map((c) => [c.templateKey, c] as const),
	);

	const suggested = templateKeys
		.map((key) => templates.find((t) => t.key === key))
		.filter((t): t is NonNullable<typeof t> => !!t);

	// قوالب مطلوبة ولا وجود لها في الأكاديمية: يُقال ذلك لا يُسكَت عنه. الصمت هنا يُقرأ
	// «لا إقرار لهذا المآل» — وهو عكس الحقيقة لمآلٍ كالقتل الرحيم.
	if (suggested.length === 0) {
		return (
			<p className="rounded-md border border-dashed px-3 py-2 text-muted-foreground text-xs">
				لا قالب إقرار لهذا المآل في الأكاديمية بعد — يُضاف من الإعدادات ← الإقرارات، ويظهر هنا
				تلقائيًّا.
			</p>
		);
	}

	const signedCount = suggested.filter(
		(t) => liveByKey.get(t.key)?.status === ConsentStatus.SIGNED,
	).length;
	const allSigned = signedCount === suggested.length;

	return (
		<div className="flex flex-col gap-2">
			<div className="flex items-center gap-2">
				<Label>الإقرارات</Label>
				<span
					className={cn(
						"rounded px-1.5 py-0.5 text-[11px] leading-none tabular-nums",
						allSigned
							? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
							: "bg-amber-500/10 text-amber-700 dark:text-amber-300",
					)}
				>
					{signedCount} من {suggested.length} موقَّع
				</span>
			</div>

			<div className="rounded-md border px-4">
				{suggested.map((template) => {
					const existing = liveByKey.get(template.key);
					const signed = existing?.status === ConsentStatus.SIGNED;
					return (
						<div
							key={template.key}
							className="flex min-h-13 items-center gap-3 border-b py-3 last:border-b-0"
						>
							<span
								className={cn(
									"flex size-7 shrink-0 items-center justify-center rounded-lg",
									signed ? "bg-emerald-500/10 text-emerald-600" : "bg-muted",
								)}
							>
								{signed ? (
									<IconCircleCheckFilled className="size-4" />
								) : (
									<IconFileText className="size-4" />
								)}
							</span>
							<span className="flex min-w-0 flex-1 flex-col gap-0.5">
								<span className="font-bold text-foreground text-xs">
									{template.titleAr ?? template.key}
								</span>
								<span className="text-[11px] text-muted-foreground">
									{signed
										? "موقَّع وساري"
										: existing
											? "مسودّة — بانتظار التوقيع"
											: "لم يُنشأ بعد"}
								</span>
							</span>
							<Button
								type="button"
								size="sm"
								variant={signed ? "ghost" : "outline"}
								className="h-7 gap-1 text-xs"
								disabled={mutations.isPending}
								onClick={() => {
									if (existing) {
										setOpenConsentId(existing.id);
										return;
									}
									void mutations
										.createConsent({ templateKey: template.key, appointmentId })
										.then((consent) => setOpenConsentId(consent.id))
										.catch(() => {});
								}}
							>
								<IconSignature className="size-3.5" />
								{signed ? "عرض" : existing ? "توقيع" : "إنشاء وتوقيع"}
							</Button>
						</div>
					);
				})}
			</div>

			{!allSigned ? (
				<p className="text-muted-foreground text-xs">
					الإقرار الناقص لا يمنع القرار — يبقى مرئيًّا في ملفّ الطفل ويُستكمل بعد استقرار الحالة.
				</p>
			) : null}

			{/* ورقة الإقرار من وحدتها — تُفتح فوق ورقة المآل من الجهة نفسها */}
			<ConsentSheet
				consentId={openConsentId}
				patientId={patientId}
				open={openConsentId !== null}
				onOpenChange={(open) => {
					if (!open) setOpenConsentId(null);
				}}
			/>
		</div>
	);
};
