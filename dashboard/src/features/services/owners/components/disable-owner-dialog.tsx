import { IconAlertCircle, IconChevronLeft, IconInfoCircle } from "@tabler/icons-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useDisableOwner } from "@/features/services/owners/hooks/use-disable-owner";
import { useOwners } from "@/features/services/owners/hooks/use-owners";
import type { OwnerResponse } from "@/server/owners/owners.type";

function OwnerAvatar({ name }: { name: string }) {
	const initials = name
		.split(" ")
		.slice(0, 2)
		.map((w) => w[0])
		.join("")
		.toUpperCase();
	return (
		<div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary primarytext-xs font-semibold">
			{initials}
		</div>
	);
}

interface DisableOwnerDialogProps {
	owner: OwnerResponse | null;
	onClose: () => void;
}

export function DisableOwnerDialog({ owner, onClose }: DisableOwnerDialogProps) {
	const [newOwnerId, setNewOwnerId] = useState("");
	const [notifyManager, setNotifyManager] = useState(false);
	const { disableOwner, isPending } = useDisableOwner();
	const { owners } = useOwners();

	const hasPatients = (owner?.patients.length ?? 0) > 0;
	const otherOwners = owners.filter((o) => o.id !== owner?.id && o.active);
	const canConfirm = !hasPatients || !!newOwnerId;

	const handleDisable = async () => {
		if (!owner) return;
		await disableOwner(owner.id, newOwnerId || undefined);
		onClose();
	};

	const handleOpenChange = (open: boolean) => {
		if (!open) {
			setNewOwnerId("");
			setNotifyManager(false);
			onClose();
		}
	};

	return (
		<Dialog
			open={!!owner}
			onOpenChange={handleOpenChange}
		>
			<DialogContent
				className="sm:max-w-xl! p-0 gap-0"
				dir="rtl"
			>
				<DialogHeader className="px-4 py-3 border-b flex-row items-center gap-2 space-y-0">
					<DialogTitle className="text-amber-600 font-semibold text-sm">
						تعطيل وليّ الأمر
					</DialogTitle>
					{owner && (
						<>
							<IconChevronLeft className="size-3.5 text-muted-foreground" />
							<div className="flex items-center gap-1.5">
								<OwnerAvatar name={owner.name} />
								<span className="text-sm font-medium">{owner.name}</span>
								<span className="text-xs text-muted-foreground tabular-nums">
									{owner.code}
								</span>
							</div>
						</>
					)}
				</DialogHeader>

				<DialogDescription className="sr-only">تأكيد تعطيل وليّ الأمر في النظام</DialogDescription>

				<div className="px-5 py-5 flex flex-col gap-4">
					<p className="text-sm text-foreground leading-relaxed">
						هل أنت متأكد من تعطيل وليّ الأمر &ldquo;{owner?.name}&rdquo;؟ سيتم إيقاف التعامل مع
						الحساب دون حذف بياناته أو سجلاته السابقة..
					</p>

					<div className="rounded-lg border border-amber-400/40 bg-amber-50/60 dark:bg-amber-950/20 p-4 flex flex-col gap-2.5">
						<p className="text-sm font-semibold text-amber-600 flex items-center gap-1.5">
							<IconAlertCircle className="size-4" />
							النتائج المترتبة:
						</p>
						<ul className="flex flex-col gap-1.5">
							<li className="flex items-start gap-2 text-sm text-foreground">
								<IconInfoCircle className="size-4 text-amber-500 shrink-0 mt-0.5" />
								لن يمكن حجز زيارات جديدة مرتبطة به
							</li>
							<li className="flex items-start gap-2 text-sm text-foreground">
								<IconInfoCircle className="size-4 text-amber-500 shrink-0 mt-0.5" />
								لن يظهر في العمليات النشطة والبحث السريع
							</li>
							<li className="flex items-start gap-2 text-sm text-foreground">
								<IconInfoCircle className="size-4 text-amber-500 shrink-0 mt-0.5" />
								ستظل بيانات الأطفال والسجلات السابقة والفواتير محفوظة
							</li>
						</ul>
					</div>

					{hasPatients && (
						<div className="flex flex-col gap-2">
							<p className="text-sm text-foreground font-medium">
								إسناد الأطفال لوليّ أمر جديد قبل التعطيل
								<span className="text-destructive me-1">*</span>
							</p>
							<Select
								value={newOwnerId}
								onValueChange={setNewOwnerId}
								dir="rtl"
								disabled={isPending}
							>
								<SelectTrigger>
									<SelectValue placeholder="إسناد الأطفال إلى..." />
								</SelectTrigger>
								<SelectContent dir="rtl">
									{otherOwners.map((o) => (
										<SelectItem
											key={o.id}
											value={o.id}
										>
											<div className="flex items-center gap-2">
												<div className="flex size-5 shrink-0 items-center justify-center rounded-full bg-primary primarytext-[10px] font-semibold">
													{o.name
														.split(" ")
														.slice(0, 2)
														.map((w) => w[0])
														.join("")
														.toUpperCase()}
												</div>
												<span>{o.name}</span>
												<span className="text-muted-foreground text-xs tabular-nums">
													{o.code}
												</span>
											</div>
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
					)}
				</div>

				<div className="px-5 py-4 border-t flex gap-2 items-center justify-end">
					<label
						htmlFor="notify-manager-disable-owner"
						className="flex items-center gap-2 cursor-pointer select-none"
					>
						<span className="text-sm text-muted-foreground">إشعار المدير عبر البريد</span>
						<Switch
							id="notify-manager-disable-owner"
							checked={notifyManager}
							onCheckedChange={setNotifyManager}
							disabled={isPending}
						/>
					</label>

					<Button
						onClick={handleDisable}
						disabled={isPending || !canConfirm}
						className="gap-2 flex bg-amber-500 primaryhover:bg-amber-600"
					>
						<span>تعطيل</span>
						<kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-0.5 rounded border border-white/30 bg-white/10 px-1.5 font-mono text-[10px] opacity-60">
							<span>⌘</span>
							<span>↵</span>
						</kbd>
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
}
