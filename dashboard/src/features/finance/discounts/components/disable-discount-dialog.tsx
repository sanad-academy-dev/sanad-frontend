import { IconChevronLeft, IconInfoCircle } from "@tabler/icons-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import type { DiscountResponse } from "@/server/discounts/discounts.type";

const CONSEQUENCES = [
	"لن يتمكن الموظفون من استخدام الخصم في الفواتير الجديدة.",
	"سيتوقف الكوبون أو رمز الخصم عن العمل فوراً.",
	"لن تتأثر الفواتير السابقة التي تم تطبيق الخصم عليها.",
];

export function DisableDiscountDialog({
	discount,
	onOpenChange,
	onConfirm,
	isPending,
}: {
	discount: DiscountResponse | null;
	onOpenChange: (open: boolean) => void;
	onConfirm: () => void;
	isPending: boolean;
}) {
	const [notifyManager, setNotifyManager] = useState(false);

	return (
		<Dialog
			open={!!discount}
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
							<span className="text-muted-foreground">تعطيل خصم</span>
							<IconChevronLeft className="size-3.5 text-muted-foreground" />
							<span className="text-foreground">{discount?.name}</span>
							{discount?.code && (
								<span className="rounded-md border px-2 py-0.5 text-xs tabular-nums text-muted-foreground">
									{discount.code}
								</span>
							)}
						</DialogTitle>
					</div>
				</DialogHeader>

				<div className="space-y-4 p-4">
					<p className="text-sm text-foreground">
						هل أنت متأكد من تعطيل الخصم «
						<span className="font-semibold">{discount?.name}</span>
						»؟ سيتم إيقاف استخدام الخصم داخل النظام دون حذف بياناته.
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
					<Label className="flex items-center gap-2 font-normal text-muted-foreground">
						<Switch
							checked={notifyManager}
							onCheckedChange={setNotifyManager}
						/>
						إشعار المدير عبر البريد
					</Label>
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
