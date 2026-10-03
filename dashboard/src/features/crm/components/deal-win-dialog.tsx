import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Field } from "@/components/ui/field";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { useWinDeal } from "@/features/crm/hooks/use-crm-deals";
import { useCrmDealStatuses } from "@/features/crm/hooks/use-crm-masters";
import type { CrmDealDetailResponse } from "@/server/crm/crm-deals/crm-deals.type";

/**
 * [CRM-P2] §7 — «كسب الصفقة». The ONLY way into a WON stage (BR-C4.1), because winning
 * resolves the Owner in the same transaction and a drag cannot do that.
 *
 * §7.3 — on success the server may return a membership invitation. It is shown as a LINK
 * into the MI enrollment flow, pre-filled with owner + plan. The CRM never enrolls: MI keeps
 * its own transaction, readiness checks and refusals (§0.4).
 */
type Prompt = { ownerId: string; plans: Array<{ id: string; name: string }> } | null;

export const DealWinDialog = ({
	deal,
	open,
	onOpenChange,
}: {
	deal: CrmDealDetailResponse;
	open: boolean;
	onOpenChange: (open: boolean) => void;
}) => {
	const { statuses } = useCrmDealStatuses();
	const { winDeal, isWinning } = useWinDeal();
	const [statusId, setStatusId] = useState("");
	const [prompt, setPrompt] = useState<Prompt>(null);

	const wonStatuses = [...statuses]
		.filter((status) => status.active && status.kind === "WON")
		.sort((a, b) => a.order - b.order);

	useEffect(() => {
		if (open) {
			setStatusId(wonStatuses[0]?.id ?? "");
			setPrompt(null);
		}
		// only the open transition should reset; re-running on every masters refetch would
		// wipe a stage the user picked
	}, [open, wonStatuses[0]?.id]);

	const confirm = async () => {
		if (!statusId) return;
		try {
			const result = await winDeal({
				id: deal.id,
				statusId,
				// BR-C5.3 — a deal already linked to an owner wins onto that owner; the server
				// refuses (naming the clash) when an unlinked deal shares a mobile with one
				...(deal.ownerId ? { ownerId: deal.ownerId } : {}),
			});
			toast.success("كُسبت الصفقة وحُسم وليّ الأمر");
			const next = (result as { membershipPrompt?: Prompt })?.membershipPrompt ?? null;
			if (next) {
				setPrompt(next);
				return; // hold the dialog open so the invitation is not lost on close
			}
			onOpenChange(false);
		} catch (error) {
			toast.error(error instanceof Error ? error.message : "تعذّر كسب الصفقة");
		}
	};

	return (
		<Dialog
			open={open}
			onOpenChange={onOpenChange}
		>
			<DialogContent
				dir="rtl"
				className="sm:max-w-md"
			>
				<DialogHeader>
					<DialogTitle>{prompt ? "تسجيل العضوية الآن؟" : "كسب الصفقة"}</DialogTitle>
					<DialogDescription>
						{prompt
							? "الصفقة تحمل باقة عضوية — التسجيل يتم في شاشة العضويات بمساره الكامل."
							: "الكسب يحسم وليّ الأمر: يُربط وليّ الأمر القائم أو يُنشأ من بيانات الصفقة، في عملية واحدة."}
					</DialogDescription>
				</DialogHeader>

				{prompt ? (
					<div className="space-y-2">
						{prompt.plans.map((plan) => (
							<Button
								key={plan.id}
								asChild
								variant="outline"
								className="w-full justify-start"
							>
								<Link
									to="/management/accounting/memberships"
									search={{
										tab: "members" as const,
										enrollOwnerId: prompt.ownerId,
										enrollPlanId: plan.id,
									}}
									onClick={() => onOpenChange(false)}
								>
									تسجيل «{plan.name}»
								</Link>
							</Button>
						))}
					</div>
				) : (
					<Field>
						<Label htmlFor="crm-win-status">المرحلة</Label>
						<Select
							value={statusId}
							onValueChange={setStatusId}
							disabled={isWinning}
						>
							<SelectTrigger
								id="crm-win-status"
								className="w-full"
							>
								<SelectValue placeholder="اختر مرحلة الفوز" />
							</SelectTrigger>
							<SelectContent dir="rtl">
								{wonStatuses.map((status) => (
									<SelectItem
										key={status.id}
										value={status.id}
									>
										{status.name}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
						{wonStatuses.length === 0 ? (
							<p className="text-[11px] text-muted-foreground">
								لا توجد مرحلة من نوع «مكسوبة» في إعدادات الأكاديمية — أضِفها أولًا
							</p>
						) : null}
					</Field>
				)}

				<DialogFooter>
					<Button
						type="button"
						variant="outline"
						disabled={isWinning}
						onClick={() => onOpenChange(false)}
					>
						{prompt ? "لاحقًا" : "إلغاء"}
					</Button>
					{prompt ? null : (
						<Button
							type="button"
							disabled={isWinning || !statusId}
							onClick={() => void confirm()}
						>
							كسب الصفقة
						</Button>
					)}
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};
