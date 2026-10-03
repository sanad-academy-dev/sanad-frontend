import { IconAlertTriangle, IconChevronLeft } from "@tabler/icons-react";
import { useState } from "react";

import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { DispositionFormPane } from "@/features/care/emergency/components/disposition-form-pane";
import { TriageBadge } from "@/features/care/emergency/components/triage-badge";
import { DISPOSITION_FORMS } from "@/features/care/emergency/data/disposition-forms";
import type { DispositionKind, TriageCategory } from "@/generated/prisma/enums";
import { useI18n } from "@/hooks/use-i18n";
import { cn } from "@/lib/utils";
import {
	DISPOSITION_KIND_LABELS,
	DISPOSITION_KIND_ORDER,
	dispositionAllowedBeforeService,
} from "@sanad/contracts/runtime/server/emergency/emergency.workflow";

/**
 * [E5.5] قرار المآل — **ورقة الاختيار، ولوح المآل لوحًا منفصلًا إلى يمينها**.
 *
 * ── النمط مأخوذ من ورقة التحاليل حرفيًّا ────────────────────────────────────
 *
 * `lab-test-sheet.tsx` تحلّ المسألة نفسها: ورقة Radix واحدة (`side` يتبع الاتجاه)،
 * وعمود التعليقات **ليس ورقة ثانية** بل `aside` بموضع `fixed` وz-50 إلى جانبها.
 * وهذا هو الفرق الذي يجعله يعمل: ورقة Radix ثانية modal تفرش تعتيمًا فوق الأولى
 * وتضع `pointer-events: none` على كل ما خارجها، فتبقى الأولى مرئية ولا تُلمَس. أمّا
 * اللوح الحرّ فلا تعتيم له ولا حبس تركيز، فاللوحان حيّان معًا.
 *
 * فالاختيار في الورقة (يسار الشاشة كورقة التحاليل في RTL)، ولوح المآل إلى يمينها
 * لوحًا مستقلًّا بحدّه وظلّه. ومفتاح الهروب يُغلق الأعمق أوّلًا كما تفعل التحاليل.
 */

type DispositionSheetProps = {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	appointmentId: string | null;
	appointmentStatus: string | null;
	category: TriageCategory | null;
	patientId?: string | null;
	patientLabel?: string | null;
};

export const DispositionSheet = ({
	open,
	onOpenChange,
	appointmentId,
	appointmentStatus,
	category,
	patientId,
	patientLabel,
}: DispositionSheetProps) => {
	const { isRtl } = useI18n();
	const dir = isRtl ? "rtl" : "ltr";
	const [kind, setKind] = useState<DispositionKind | null>(null);
	const inService = appointmentStatus === "IN_SERVICE";

	const close = () => {
		setKind(null);
		onOpenChange(false);
	};

	return (
		<Sheet
			open={open}
			onOpenChange={(next) => {
				if (!next) close();
			}}
		>
			<SheetContent
				side="left"
				dir={dir}
				className="flex w-full flex-col gap-0 p-0 sm:max-w-md!"
				showCloseButton={false}
				// الهروب يُغلق الأعمق أوّلًا: لوح المآل ثم الورقة (نمط ورقة التحاليل)
				onEscapeKeyDown={(e) => {
					if (kind) {
						e.preventDefault();
						setKind(null);
					}
				}}
			>
				<div className="flex min-h-0 flex-1">
					<aside className="flex min-h-0 flex-1 flex-col">
						<div className="flex items-center gap-2 border-b px-4 py-2">
							<SheetTitle className="text-sm">قرار مآل الحالة</SheetTitle>
							{patientLabel ? (
								<span className="truncate text-muted-foreground text-xs">{patientLabel}</span>
							) : null}
							{category ? (
								<span className="ms-auto shrink-0">
									<TriageBadge category={category} />
								</span>
							) : null}
						</div>

						<div className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto p-4">
							{!inService ? (
								<p className="flex items-start gap-1.5 rounded-md border border-dashed px-3 py-2 text-muted-foreground text-xs">
									<IconAlertTriangle className="mt-0.5 size-3.5 shrink-0" />
									<span>
										الدورة لم تبدأ — المتاح الآن: مغادرة على مسؤولية وليّ الأمر، نفوق، قتل رحيم
									</span>
								</p>
							) : null}

							<div className="rounded-md border px-4">
								{DISPOSITION_KIND_ORDER.map((k) => {
									const spec = DISPOSITION_FORMS[k];
									const Icon = spec.icon;
									const blocked = !inService && !dispositionAllowedBeforeService(k);
									const active = kind === k;
									return (
										<button
											key={k}
											type="button"
											disabled={blocked}
											onClick={() => setKind(k)}
											className={cn(
												"flex min-h-13 w-full items-center gap-3 border-b py-3 text-start transition-colors last:border-b-0",
												blocked ? "cursor-not-allowed opacity-50" : "hover:bg-muted/30",
												active && "bg-muted/50",
											)}
										>
											{/* السهم أوّلًا في DOM = يمين الصفّ في RTL، ويشير يسارًا حيث يُفتح اللوح */}
											<IconChevronLeft
												className={cn(
													"size-3.5 shrink-0",
													blocked ? "invisible" : "text-muted-foreground",
												)}
											/>
											<span
												className={cn(
													"flex size-7 shrink-0 items-center justify-center rounded-lg",
													spec.grave ? "bg-destructive/10 text-destructive" : "bg-muted",
												)}
											>
												<Icon className="size-4" />
											</span>
											<span className="flex min-w-0 flex-col gap-0.5">
												<span className="font-bold text-foreground text-xs">
													{DISPOSITION_KIND_LABELS[k]}
												</span>
												<span className="text-[11px] text-muted-foreground">
													{spec.effect}
												</span>
											</span>
										</button>
									);
								})}
							</div>
						</div>
					</aside>
				</div>
			</SheetContent>

			{/*
			  لوح المآل — `fixed` مستقلّ إلى يمين الورقة، لا ورقة Radix ثانية.
			  الورقة تشغل 8..456 تقريبًا (max-w-md + إزاحة)، فاللوح يبدأ بعدها.
			*/}
			{open && kind ? (
				<aside
					dir={dir}
					aria-label={DISPOSITION_KIND_LABELS[kind]}
					className="fixed inset-y-2 left-[29.5rem] z-50 flex w-[min(40rem,calc(100vw-31rem))] flex-col gap-0 overflow-hidden rounded-lg border bg-popover text-popover-foreground text-sm shadow-lg"
				>
					<DispositionFormPane
						key={kind}
						kind={kind}
						dir={dir}
						onBack={() => setKind(null)}
						onDone={close}
						appointmentId={appointmentId}
						appointmentStatus={appointmentStatus}
						category={category}
						patientId={patientId ?? null}
					/>
				</aside>
			) : null}
		</Sheet>
	);
};
