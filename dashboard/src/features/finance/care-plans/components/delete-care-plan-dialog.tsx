import { IconAlertTriangle, IconChevronLeft } from "@tabler/icons-react";
import { useHotkey } from "@tanstack/react-hotkeys";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Kbd } from "@/components/ui/kbd";
import { Label } from "@/components/ui/label";
import type { CarePlanListItemResponse } from "@/server/care-plans/care-plans.type";

const CONSEQUENCES = [
	"لن تطبق علي الزيارات والمتابعات المستقبلية.",
	"إيقاف التذكيرات والإشعارات المجدولة المتعلقة بالخطة.",
];

const formatMoney = (value: CarePlanListItemResponse["price"] | number) =>
	`${Number(value).toLocaleString("ar-SA")} ر.س`;

const formatDate = (value: Date) =>
	new Intl.DateTimeFormat("ar-SA", {
		year: "numeric",
		month: "2-digit",
		day: "2-digit",
	}).format(new Date(value));

function DetailRow({ label, value }: { label: string; value: React.ReactNode }) {
	return (
		<div className="flex items-center justify-between text-xs">
			<span className="text-muted-foreground">{label}</span>
			<span className="font-medium text-foreground">{value}</span>
		</div>
	);
}

export function DeleteCarePlanDialog({
	plan,
	onOpenChange,
	onConfirm,
	isDeleting,
}: {
	plan: CarePlanListItemResponse | null;
	onOpenChange: (open: boolean) => void;
	onConfirm: () => void;
	isDeleting: boolean;
}) {
	const [confirmText, setConfirmText] = useState("");
	const totalRevenue = plan ? Number(plan.price) * plan.usageCount : 0;
	const isConfirmed = !!plan && confirmText.trim() === plan.name;

	useEffect(() => {
		if (!plan) setConfirmText("");
	}, [plan]);

	useHotkey(
		"Mod+Enter",
		() => {
			if (isConfirmed && !isDeleting) onConfirm();
		},
		{ enabled: !!plan, conflictBehavior: "replace" },
	);

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
							<span className="text-destructive">حذف خطة</span>
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

				<div className="max-h-[70vh] space-y-4 overflow-y-auto p-4">
					<p className="text-sm text-foreground">
						هل أنت متأكد من حذف خطة «<span className="font-semibold">{plan?.name}</span>»؟{" "}
						<span className="text-destructive">لا يمكن التراجع</span> عن هذا الإجراء.
					</p>

					{/* Plan details */}
					<div className="space-y-2 rounded-lg border p-3">
						<p className="text-xs font-semibold text-foreground">تفاصيل الخطة</p>
						<div className="space-y-1.5">
							<DetailRow
								label="اسم الخطة"
								value={plan?.name}
							/>
							<DetailRow
								label="نوع الخطة"
								value={plan?.type}
							/>
							<DetailRow
								label="# المشتركين الحاليين"
								value={plan?.subscribersCount}
							/>
							<DetailRow
								label="# زيارات الخطة"
								value={plan?.visitsCount}
							/>
							<DetailRow
								label="تاريخ الإنشاء"
								value={plan ? formatDate(plan.createdAt) : ""}
							/>
							<DetailRow
								label="إجمالي المبلغ"
								value={plan ? formatMoney(plan.price) : ""}
							/>
							<DetailRow
								label="إجمالي ربح الخطة"
								value={formatMoney(totalRevenue)}
							/>
						</div>
					</div>

					{/* Consequences box */}
					<div className="space-y-2 rounded-lg border border-destructive/30 bg-destructive/5 p-3">
						<p className="flex items-center gap-1.5 text-[13px] font-semibold text-destructive">
							<IconAlertTriangle className="size-4" />
							النتائج المترتبة:
						</p>
						<ul className="space-y-1.5">
							{CONSEQUENCES.map((line) => (
								<li
									key={line}
									className="flex items-start gap-1.5 text-xs text-destructive/90"
								>
									<IconAlertTriangle className="mt-0.5 size-3.5 shrink-0 text-destructive/70" />
									<span>{line}</span>
								</li>
							))}
						</ul>
					</div>

					{/* Type-to-confirm */}
					<div className="space-y-1.5">
						<Label className="justify-start gap-1.5">
							<span className="rounded-[4px] bg-rose-600/[0.06] px-[4.5px] py-[1.5px] text-[8px] font-medium text-rose-600">
								مطلوب
							</span>
							ادخل لتأكيد الحذف، اكتب اسم الخطة: {plan?.name}
						</Label>
						<Input
							placeholder={plan?.name}
							value={confirmText}
							onChange={(e) => setConfirmText(e.target.value)}
						/>
					</div>
				</div>

				{/* Footer */}
				<div className="flex items-center justify-between gap-3 border-t px-4 py-2">
					<div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
						<Kbd>⌘↵</Kbd>
					</div>
					<div className="flex items-center gap-2">
						<Button
							variant="outline"
							onClick={() => onOpenChange(false)}
							disabled={isDeleting}
						>
							إلغاء
						</Button>
						<Button
							variant="destructive"
							onClick={onConfirm}
							disabled={isDeleting || !isConfirmed}
						>
							حذف الخطة
						</Button>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}
