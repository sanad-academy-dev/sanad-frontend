import { IconAlertTriangle, IconCircleCheck, IconClock } from "@tabler/icons-react";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

/**
 * [CRM-P5] §10.4 — شارة الاستجابة على القوائم واللوحات وصفحة الكيان.
 *
 * **تُشتقّ عند الرسم، لا تُقرأ من العمود وحده.** العمود يُثبَّت ليلًا بمهمّةٍ لا يشغّلها
 * شيءٌ في الإنتاج بعد ([P13.12])، فالاعتماد عليه كان سيعني شارةً «مستحقّة» على سجلٍّ
 * تجاوز مهلته منذ يومين. المنطق هو نفسه `deriveSlaStatus` على الخادم — والتكرار هنا
 * مقصود وصغير: بديله تمرير «الآن» إلى الخادم في كل قراءة.
 */
export const SlaBadge = ({
	responseBy,
	firstRespondedAt,
	className,
}: {
	responseBy: string | Date | null;
	firstRespondedAt: string | Date | null;
	className?: string;
}) => {
	if (!responseBy) return null;

	const due = new Date(responseBy);
	const responded = firstRespondedAt ? new Date(firstRespondedAt) : null;

	if (responded) {
		const late = responded > due;
		return (
			<Badge
				variant={late ? "destructive" : "primary"}
				className={cn("gap-1", className)}
			>
				{late ? (
					<IconAlertTriangle className="size-3" />
				) : (
					<IconCircleCheck className="size-3" />
				)}
				{late ? "رُدّ متأخرًا" : "تم الرد"}
			</Badge>
		);
	}

	const breached = new Date() > due;
	return (
		<Badge
			variant={breached ? "destructive" : "secondary"}
			className={cn("gap-1", className)}
			title={`المهلة: ${due.toLocaleString("ar", { dateStyle: "short", timeStyle: "short" })}`}
		>
			{breached ? <IconAlertTriangle className="size-3" /> : <IconClock className="size-3" />}
			{breached ? "تجاوز المهلة" : "بانتظار الرد"}
		</Badge>
	);
};
