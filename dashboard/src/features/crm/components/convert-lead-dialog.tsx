import { useNavigate } from "@tanstack/react-router";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useConversionPreview, useConvertLead } from "@/features/crm/hooks/use-crm-deals";
import { useCrmDealStatuses } from "@/features/crm/hooks/use-crm-masters";

/**
 * [CRM-P2] §5 — the conversion modal. The reference lets the user adjust before confirming,
 * so the snapshot the server proposes is shown EDITABLE here; whatever is changed is what
 * gets saved on the deal, and the lead's own row is left untouched.
 *
 * BR-C5.3 — when the mobile matches an existing Owner the modal OFFERS the link with a
 * switch, defaulted OFF. A shared household number is common in a clinic, so linking is the
 * user's assertion that this is the same person, never an inference we make for them.
 *
 * BR-C5.2 — nothing here creates an Owner. That happens only at WON (§7).
 */
export const ConvertLeadDialog = ({
	leadId,
	leadName,
	open,
	onOpenChange,
}: {
	leadId: string;
	leadName: string;
	open: boolean;
	onOpenChange: (open: boolean) => void;
}) => {
	const navigate = useNavigate();
	const { statuses } = useCrmDealStatuses();
	const { preview, isLoading } = useConversionPreview(leadId, open);
	const { convertLead, isConverting } = useConvertLead();

	const [statusId, setStatusId] = useState("");
	const [dealValue, setDealValue] = useState("");
	const [expectedCloseDate, setExpectedCloseDate] = useState("");
	const [linkOwner, setLinkOwner] = useState(false);

	const selectable = [...statuses]
		.filter((status) => status.active && status.kind === "OPEN")
		.sort((a, b) => a.order - b.order);

	useEffect(() => {
		if (!open) return;
		setStatusId(selectable[0]?.id ?? "");
		setDealValue("");
		setExpectedCloseDate("");
		setLinkOwner(false);
	}, [open, selectable[0]?.id]);

	const candidate = preview?.ownerCandidate ?? null;
	const alreadyConverted = preview?.alreadyConverted ?? null;

	const submit = async () => {
		if (!statusId) return;
		try {
			const result = await convertLead({
				leadId,
				statusId,
				...(dealValue ? { dealValue } : {}),
				...(expectedCloseDate ? { expectedCloseDate } : {}),
				...(linkOwner && candidate ? { ownerId: candidate.id } : {}),
			});
			toast.success("حُوِّل العميل المحتمل إلى صفقة");
			onOpenChange(false);
			const dealId = (result as { deal?: { id: string } })?.deal?.id;
			if (dealId) void navigate({ to: "/crm/deals/$dealId", params: { dealId } });
		} catch (error) {
			toast.error(error instanceof Error ? error.message : "تعذّر التحويل");
		}
	};

	return (
		<Dialog
			open={open}
			onOpenChange={onOpenChange}
		>
			<DialogContent
				dir="rtl"
				className="max-h-[85vh] overflow-y-auto sm:max-w-lg"
			>
				<DialogHeader>
					<DialogTitle>تحويل «{leadName}» إلى صفقة</DialogTitle>
					<DialogDescription>
						تُنسخ بيانات العميل إلى الصفقة ويصير العميل المحتمل «محوَّلًا» للقراءة فقط. لا يُنشأ
						وليّ أمر الآن — ذلك يحدث عند كسب الصفقة.
					</DialogDescription>
				</DialogHeader>

				{isLoading ? (
					<p className="py-6 text-center text-[12px] text-muted-foreground">جارٍ التحميل...</p>
				) : alreadyConverted ? (
					// BR-C5.1 — a converted lead cannot convert again; name the deal so the user
					// can go to it rather than retry
					<p className="py-6 text-center text-[12px]">
						هذا العميل المحتمل محوَّل بالفعل إلى الصفقة {alreadyConverted.code}
					</p>
				) : (
					<div className="space-y-4">
						<Field>
							<Label htmlFor="crm-convert-status">مرحلة الصفقة</Label>
							<Select
								value={statusId}
								onValueChange={setStatusId}
								disabled={isConverting}
							>
								<SelectTrigger
									id="crm-convert-status"
									className="w-full"
								>
									<SelectValue placeholder="اختر المرحلة" />
								</SelectTrigger>
								<SelectContent dir="rtl">
									{selectable.map((status) => (
										<SelectItem
											key={status.id}
											value={status.id}
										>
											{status.name}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</Field>

						<div className="grid gap-4 sm:grid-cols-2">
							<Field>
								<Label htmlFor="crm-convert-value">القيمة التقديرية</Label>
								<Input
									id="crm-convert-value"
									dir="ltr"
									inputMode="decimal"
									placeholder="0.00"
									className="text-start"
									value={dealValue}
									disabled={isConverting}
									onChange={(event) => setDealValue(event.target.value)}
								/>
							</Field>
							<Field>
								<Label htmlFor="crm-convert-close">تاريخ الإغلاق المتوقّع</Label>
								<Input
									id="crm-convert-close"
									type="date"
									value={expectedCloseDate}
									disabled={isConverting}
									onChange={(event) => setExpectedCloseDate(event.target.value)}
								/>
							</Field>
						</div>

						{candidate ? (
							<div className="flex items-start gap-3 rounded-md border p-3">
								<Switch
									id="crm-convert-link-owner"
									checked={linkOwner}
									onCheckedChange={setLinkOwner}
									disabled={isConverting}
								/>
								<div className="space-y-1">
									<Label
										htmlFor="crm-convert-link-owner"
										className="text-[12px]"
									>
										ربط الصفقة بوليّ الأمر «{candidate.name}» ({candidate.code})
									</Label>
									<p className="text-[11px] text-muted-foreground">
										رقم الجوال نفسه مسجَّل لوليّ أمر قائم. الربط اختياري — الأرقام تتكرّر داخل الأسرة
										الواحدة.
									</p>
								</div>
							</div>
						) : null}
					</div>
				)}

				<DialogFooter>
					<Button
						type="button"
						variant="outline"
						disabled={isConverting}
						onClick={() => onOpenChange(false)}
					>
						إلغاء
					</Button>
					<Button
						type="button"
						disabled={isConverting || isLoading || !!alreadyConverted || !statusId}
						onClick={() => void submit()}
					>
						تحويل
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};
