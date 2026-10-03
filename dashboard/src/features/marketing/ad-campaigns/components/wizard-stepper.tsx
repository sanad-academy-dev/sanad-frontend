import type { Icon } from "@tabler/icons-react";
import { IconCalendarDollar, IconSpeakerphone, IconUsersGroup } from "@tabler/icons-react";

import { cn } from "@/lib/utils";

export const WIZARD_STEPS = [
	{ key: "ad", label: "إنشاء الإعلان", icon: IconSpeakerphone },
	{ key: "audience", label: "إنشاء الجمهور", icon: IconUsersGroup },
	{ key: "budget", label: "الجدول والميزانية", icon: IconCalendarDollar },
] as const satisfies readonly { key: string; label: string; icon: Icon }[];

export type WizardStepKey = (typeof WIZARD_STEPS)[number]["key"];

/**
 * مؤشّر خطوات المعالج (يمين شاشات 538216 وما بعدها).
 *
 * الحاوية ترث `rtl` من الصفحة، فأوّل عنصر في DOM يقع **يمينًا** — وهذا هو المطلوب:
 * «إنشاء الإعلان» أوّل خطوة وهي في أقصى اليمين في التصميم. لا `flex-row-reverse`
 * ولا `justify-end` هنا؛ ترتيب الـ DOM وحده يضع الخطوات في مواضعها.
 */
export function WizardStepper({
	current,
	className,
}: {
	current: WizardStepKey;
	className?: string;
}) {
	const currentIndex = WIZARD_STEPS.findIndex((s) => s.key === current);

	return (
		<div className={cn("flex items-start", className)}>
			{WIZARD_STEPS.map((step, index) => {
				const Icon = step.icon;
				const isDone = index < currentIndex;
				const isCurrent = index === currentIndex;
				const isReached = isDone || isCurrent;

				return (
					<div
						key={step.key}
						className={cn("flex items-start", index === 0 ? "shrink-0" : "min-w-0 flex-1")}
					>
						{/* الوصلة تسبق الأيقونة في DOM لكل خطوة بعد الأولى، فتقع بينها وبين
						    سابقتها — أي إلى يسارها في RTL، وهو اتجاه تقدّم الخطوات هنا */}
						{index > 0 && (
							<span
								className={cn(
									"mt-[18px] h-0.5 min-w-6 flex-1",
									// الوصلة تخصّ الخطوة السابقة لا هذه: تُضاء متى بلغها التقدّم،
									// فتمتدّ خطًّا أزرق من الخطوة الحالية كما في التصميم
									index - 1 <= currentIndex ? "bg-primary" : "bg-border",
								)}
							/>
						)}

						<div className="flex w-[104px] shrink-0 flex-col items-center gap-1.5">
							<span
								className={cn(
									"flex size-9 items-center justify-center rounded-full border transition-colors",
									isCurrent && "border-primary bg-primary text-primary-foreground",
									isDone && "border-primary bg-primary/10 text-primary",
									!isReached && "border-border bg-background text-muted-foreground",
								)}
							>
								<Icon className="size-4" />
							</span>
							<span
								className={cn(
									"text-center text-xs leading-4",
									isCurrent ? "font-medium text-foreground" : "text-muted-foreground",
								)}
							>
								{step.label}
							</span>
						</div>
					</div>
				);
			})}
		</div>
	);
}
