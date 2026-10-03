import { useEffect, useState } from "react";

import { Skeleton } from "@/components/ui/skeleton";
import {
	InpatientCard,
	type InpatientCardData,
} from "@/features/care/inpatients/components/inpatient-card";
import { INPATIENT_BOARD_COLUMNS } from "@/features/care/inpatients/data/inpatients-data";
import { cn } from "@/lib/utils";

/**
 * لوحة العنبر — أعمدة بحالات الإقامة.
 *
 * ليست لوحة سحب وإفلات كلوحة العمليات: نقل الإقامة يمرّ ببوابات تُقيَّم على
 * الخادم (قفص، وزن، إقرار، أمر جارٍ)، والسحب يوحي بأن النقل مجّاني ثم يرتدّ
 * برسالة رفض — فالانتقال يقع من ورقة الإقامة حيث يُعرض المتطلَّب الناقص.
 *
 * الفرز داخل العمود بالإلحاح: الخادم يعيدها مرتّبة بـ`nextDueAt`، فمن يحتاج
 * شيئًا الآن يتصدّر بلا أن يبحث عنه أحد.
 */

const CLIENT_TICK_MS = 30_000;

export function InpatientsBoard({
	stays,
	isLoading,
	onOpen,
}: {
	stays: InpatientCardData[];
	isLoading: boolean;
	onOpen: (id: string) => void;
}) {
	// مؤقّت العميل — يجعل «تأخّر ١٢ دقيقة» يتقدّم بلا إعادة جلب
	const [now, setNow] = useState(() => Date.now());
	useEffect(() => {
		const timer = setInterval(() => setNow(Date.now()), CLIENT_TICK_MS);
		return () => clearInterval(timer);
	}, []);

	if (isLoading) {
		return (
			<div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
				{INPATIENT_BOARD_COLUMNS.map((c) => (
					<div
						key={c.id}
						className="space-y-2"
					>
						<Skeleton className="h-8 w-full" />
						<Skeleton className="h-24 w-full" />
						<Skeleton className="h-24 w-full" />
					</div>
				))}
			</div>
		);
	}

	return (
		<div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
			{INPATIENT_BOARD_COLUMNS.map((column) => {
				const items = stays.filter((s) => s.status === column.id);
				return (
					<section
						key={column.id}
						className="flex min-h-24 flex-col gap-2"
					>
						<header className="flex items-baseline justify-between border-b px-1 pb-1.5">
							<div>
								<h3 className="text-sm font-medium">{column.label}</h3>
								<p className="text-[11px] text-muted-foreground">{column.hint}</p>
							</div>
							<span
								className={cn(
									"rounded bg-muted px-1.5 py-0.5 text-xs tabular-nums text-muted-foreground",
								)}
							>
								{items.length}
							</span>
						</header>

						<div className="flex flex-col gap-2">
							{items.length === 0 ? (
								<p className="rounded border border-dashed px-3 py-6 text-center text-xs text-muted-foreground">
									لا إقامات هنا
								</p>
							) : (
								items.map((stay) => (
									<InpatientCard
										key={stay.id}
										stay={stay}
										onOpen={onOpen}
										now={now}
									/>
								))
							)}
						</div>
					</section>
				);
			})}
		</div>
	);
}
