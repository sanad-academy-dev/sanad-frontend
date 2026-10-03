import { IconChevronLeft, IconInfoCircle } from "@tabler/icons-react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import type { CarePlanListItemResponse } from "@/server/care-plans/care-plans.type";

const CONSEQUENCES = [
	"منع استخدام الخطة أو تطبيقها على أطفال جدد.",
	"إخفاء الخطة من قوائم الاختيار أثناء إنشاء أو تحديث خطط الأطفال.",
	"إيقاف إنشاء أي زيارات جديدة مرتبطة بالخطة.",
];

export function DisableCarePlanDialog({
	plan,
	onOpenChange,
	onConfirm,
	isPending,
}: {
	plan: CarePlanListItemResponse | null;
	onOpenChange: (open: boolean) => void;
	onConfirm: () => void;
	isPending: boolean;
}) {
	return (
		<Dialog
			open={!!plan}
			onOpenChange={onOpenChange}
		>
			<DialogContent
				dir="rtl"
				className="gap-0 p-0 sm:max-w-lg"
			>
				{/* Header: breadcrumb + code */}
				<DialogHeader className="border-b px-4 py-2">
					<div className="flex items-center justify-between gap-2">
						<DialogTitle className="flex items-center gap-1.5 text-sm font-medium">
							<span className="text-amber-600">تعطيل الخطة</span>
							<IconChevronLeft className="size-3.5 text-muted-foreground" />
							<span className="text-foreground">{plan?.name}</span>
							{plan?.code && (
								<span className="rounded-md border px-2 py-0.5 text-xs tabular-nums text-muted-foreground">
									{plan.code}
								</span>
							)}
						</DialogTitle>
					</div>
				</DialogHeader>

				<div className="space-y-4 p-4">
					<p className="text-sm text-foreground">
						هل أنت متأكد من تعطيل الخطة «<span className="font-semibold">{plan?.name}</span>
						»؟ سيتم إيقاف استخدام الخطة داخل الأكاديمية دون حذف بياناتها.
					</p>

					{/* Consequences box */}
					<div className="space-y-2 rounded-lg border border-amber-300 bg-amber-50/60 p-3">
						<p className="flex items-center gap-1.5 text-[13px] font-semibold text-amber-700">
							<IconInfoCircle className="size-4" />
							النتائج المترتبة:
						</p>
						<ul className="space-y-1.5">
							{CONSEQUENCES.map((line) => (
								<li
									key={line}
									className="flex items-start gap-1.5 text-xs text-amber-800"
								>
									<IconInfoCircle className="mt-0.5 size-3.5 shrink-0 text-amber-500" />
									<span>{line}</span>
								</li>
							))}
						</ul>
					</div>
				</div>

				{/* Footer */}
				<div className="flex items-center justify-end gap-3 border-t px-4 py-2">
					<Button
						variant="outline"
						onClick={() => onOpenChange(false)}
						disabled={isPending}
					>
						إلغاء
					</Button>
					<Button
						onClick={onConfirm}
						disabled={isPending}
						className={cn("bg-amber-500 primaryhover:bg-amber-600")}
					>
						تعطيل
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
}
