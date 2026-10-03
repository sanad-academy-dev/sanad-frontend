interface VisitReasonSectionProps {
	reason: string | null;
	// نص الدورة/الكشف — يُعرض كسبب الزيارة عند غياب سبب مكتوب
	serviceLabel?: string;
}

export function VisitReasonSection({ reason, serviceLabel = "" }: VisitReasonSectionProps) {
	// السبب المكتوب إن وُجد، وإلا اسم الدورة/الكشف
	const text = reason?.trim() || serviceLabel;

	return (
		<section className="flex flex-col gap-3">
			<p className="font-semibold text-base">سبب الزيارة</p>
			<div className="rounded-md border bg-card px-3 py-2.5">
				{text ? (
					<p className="whitespace-pre-wrap text-sm">{text}</p>
				) : (
					<p className="text-muted-foreground text-sm">لا يوجد سبب للزيارة</p>
				)}
			</div>
		</section>
	);
}
