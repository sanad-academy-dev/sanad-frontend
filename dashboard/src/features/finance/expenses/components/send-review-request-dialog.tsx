import {
	IconArrowsDiagonal,
	IconCheck,
	IconChevronDown,
	IconFileText,
	IconLink,
	IconPlus,
	IconSend,
	IconX,
} from "@tabler/icons-react";
import { useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import {
	buildSendReviewRequestDefaults,
	REVIEW_REQUEST_EMAIL_TEMPLATES,
	type ReviewRequestRecipient,
	type SendReviewRequestValues,
	type SubmittedExpenseRequest,
} from "@/features/finance/expenses/data/expense-review";
import { useClinicUsers } from "@/features/finance/expenses/hooks/use-clinic-users";

function RecipientChip({
	recipient,
	onRemove,
}: {
	recipient: ReviewRequestRecipient;
	onRemove: () => void;
}) {
	return (
		<span className="flex items-center gap-1.5 rounded-full border bg-muted/40 py-1 ps-2 pe-1 text-xs">
			<button
				type="button"
				onClick={onRemove}
				className="flex size-4 items-center justify-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground"
			>
				<IconX className="size-3" />
				<span className="sr-only">إزالة</span>
			</button>
			{recipient.name}
			<Avatar
				size="sm"
				className="size-4"
			>
				<AvatarFallback className="text-[8px]">{recipient.name.charAt(0)}</AvatarFallback>
			</Avatar>
		</span>
	);
}

export function SendReviewRequestDialog({
	open,
	onOpenChange,
	request,
	onSend,
}: {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	request: SubmittedExpenseRequest;
	onSend: (values: SendReviewRequestValues) => void;
}) {
	const navigate = useNavigate();
	const { users } = useClinicUsers();
	const [values, setValues] = useState<SendReviewRequestValues>(() =>
		buildSendReviewRequestDefaults(request),
	);
	const [recipientPickerOpen, setRecipientPickerOpen] = useState(false);
	const [templateOpen, setTemplateOpen] = useState(false);
	// المرفقات الحقيقية من المصروف
	const [attachments, setAttachments] = useState(request.attachments);

	useEffect(() => {
		if (!open) return;
		setValues(buildSendReviewRequestDefaults(request));
		setRecipientPickerOpen(false);
		setTemplateOpen(false);
		setAttachments(request.attachments);
	}, [open, request]);

	// خيارات المستلمين = مستخدمو الأكاديمية الحقيقيون
	const recipientOptions: ReviewRequestRecipient[] = useMemo(
		() => users.map((u) => ({ id: u.id, name: u.name })),
		[users],
	);

	const toggleRecipient = (recipient: ReviewRequestRecipient) => {
		setValues((prev) => {
			const exists = prev.recipients.some((r) => r.id === recipient.id);
			return {
				...prev,
				recipients: exists
					? prev.recipients.filter((r) => r.id !== recipient.id)
					: [...prev.recipients, recipient],
			};
		});
	};

	const applyTemplate = (value: string) => {
		const name = request.title.replace(/^مراجعة\s*/, "");
		setTemplateOpen(false);
		if (value === "reminder") {
			setValues((prev) => ({
				...prev,
				subject: `تذكير: مراجعة مصروف ${name} — ${request.code}#`,
				body: `تذكير ودّي بخصوص طلب المصروف "${name}" بقيمة ${request.amountLabel} — بانتظار مراجعتكم واعتماده.`,
			}));
		} else if (value === "approval") {
			setValues((prev) => ({
				...prev,
				subject: `اعتماد مصروف ${name} — ${request.code}#`,
				body: `نرجو اعتماد طلب المصروف "${name}" بقيمة ${request.amountLabel} لاستكمال إجراءات الصرف.`,
			}));
		} else {
			setValues(buildSendReviewRequestDefaults(request));
		}
	};

	const canSend = values.recipients.length > 0 && values.subject.trim().length > 0;

	const handleSend = () => {
		if (!canSend) return;
		onSend(values);
		onOpenChange(false);
	};

	const code = request.code.replace(/^EXP-?/i, "") || request.code;

	return (
		<Dialog
			open={open}
			onOpenChange={onOpenChange}
		>
			<DialogContent
				dir="rtl"
				showCloseButton={false}
				className="max-h-[85vh] gap-0 overflow-hidden p-0 sm:max-w-2xl"
			>
				<DialogTitle className="sr-only">إرسال طلب المصروف للمراجعة</DialogTitle>
				{/* Header — المسار على اليمين وزر الإغلاق على اليسار */}
				<div className="flex items-center justify-between gap-2 border-b p-3">
					<div className="flex items-center gap-1.5 text-[13px] font-semibold text-foreground">
						<span className="rounded-[4px] bg-primary/10 px-2 py-0.5 text-primary">
							طلب مصروف
						</span>
						<span className="text-muted-foreground">›</span>
						<span className="flex items-center gap-1">
							{request.requesterName}
							<Avatar
								size="sm"
								className="size-4"
							>
								<AvatarFallback className="text-[8px]">
									{request.requesterName.charAt(0)}
								</AvatarFallback>
							</Avatar>
						</span>
						<span className="text-muted-foreground">›</span>
						<span>إرسال الطلب للمراجعة #{code}</span>
					</div>
					<div className="flex items-center gap-1">
						<button
							type="button"
							className="flex size-6 items-center justify-center rounded text-muted-foreground hover:bg-muted hover:text-foreground"
						>
							<IconArrowsDiagonal className="size-4" />
							<span className="sr-only">توسيع</span>
						</button>
						<button
							type="button"
							onClick={() => onOpenChange(false)}
							className="flex size-6 items-center justify-center rounded text-muted-foreground hover:bg-muted hover:text-foreground"
						>
							<IconX className="size-4" />
							<span className="sr-only">إغلاق</span>
						</button>
					</div>
				</div>

				{/* To row — إلى: على اليمين ثم المستلمون وزر أضف مسؤول بجانبهم */}
				<div className="flex flex-wrap items-center gap-2 border-b px-4 py-2.5">
					<span className="shrink-0 text-sm text-muted-foreground">إلى:</span>
					{values.recipients.map((recipient) => (
						<RecipientChip
							key={recipient.id}
							recipient={recipient}
							onRemove={() => toggleRecipient(recipient)}
						/>
					))}
					<Popover
						open={recipientPickerOpen}
						onOpenChange={setRecipientPickerOpen}
					>
						<PopoverTrigger asChild>
							<Button
								type="button"
								size="sm"
								variant="outline"
								className="shrink-0"
							>
								<IconPlus className="size-3.5" />
								أضف مسؤول
							</Button>
						</PopoverTrigger>
						<PopoverContent
							align="end"
							dir="rtl"
							className="w-72 p-1"
						>
							<div className="flex items-center justify-between gap-2 border-b px-2 py-1.5">
								<span className="text-xs text-muted-foreground">اختر المسؤول...</span>
								<button
									type="button"
									onClick={() => {
										setRecipientPickerOpen(false);
										void navigate({ to: "/services/staff" });
									}}
									className="flex items-center gap-1 rounded-md px-1.5 py-1 text-xs font-medium text-primary hover:bg-primary/10"
								>
									<IconPlus className="size-3.5" />
									إضافة موظف جديد
								</button>
							</div>
							{recipientOptions.length === 0 ? (
								<p className="px-2 py-3 text-center text-xs text-muted-foreground">
									لا يوجد مستخدمون
								</p>
							) : (
								recipientOptions.map((option) => {
									const checked = values.recipients.some((r) => r.id === option.id);
									return (
										<button
											key={option.id}
											type="button"
											onClick={() => toggleRecipient(option)}
											className="flex w-full items-center justify-between gap-2 rounded-md px-2 py-2 text-sm hover:bg-accent"
										>
											<span className="flex items-center gap-2">
												<Avatar
													size="sm"
													className="size-6"
												>
													<AvatarFallback className="text-[10px]">
														{option.name.charAt(0)}
													</AvatarFallback>
												</Avatar>
												{option.name}
											</span>
											{checked && <IconCheck className="size-4 text-primary" />}
										</button>
									);
								})
							)}
						</PopoverContent>
					</Popover>
				</div>

				{/* Subject row — الموضوع على اليمين ثم النص يتبعه */}
				<div className="flex items-center gap-2 border-b px-4 py-2.5">
					<span className="shrink-0 text-sm text-muted-foreground">الموضوع</span>
					<Input
						value={values.subject}
						onChange={(e) => setValues((prev) => ({ ...prev, subject: e.target.value }))}
						className="border-0 px-0 text-start shadow-none focus-visible:ring-0"
					/>
				</div>

				{/* Body */}
				<div className="overflow-y-auto p-4">
					<Textarea
						value={values.body}
						onChange={(e) => setValues((prev) => ({ ...prev, body: e.target.value }))}
						className="min-h-48 resize-none border-0 px-1 shadow-none focus-visible:ring-0"
					/>
				</div>

				{/* Attachments — المرفقات الحقيقية من المصروف */}
				{attachments.length > 0 && (
					<div className="space-y-1.5 px-4 pb-2">
						{attachments.map((att) => (
							<div
								key={att.id}
								className="flex items-center justify-between gap-2 rounded-[4px] border px-3 py-2"
							>
								<div className="flex min-w-0 items-center gap-2">
									<span className="flex size-7 shrink-0 items-center justify-center rounded-[4px] border bg-muted/40 text-muted-foreground">
										{att.kind === "link" ? (
											<IconLink className="size-3.5" />
										) : (
											<IconFileText className="size-3.5" />
										)}
									</span>
									<span className="truncate text-xs font-medium text-foreground">
										{att.label}
									</span>
								</div>
								<button
									type="button"
									onClick={() => setAttachments((prev) => prev.filter((a) => a.id !== att.id))}
									className="flex size-6 shrink-0 items-center justify-center rounded text-muted-foreground hover:bg-muted hover:text-foreground"
								>
									<IconX className="size-3.5" />
									<span className="sr-only">إزالة المرفق</span>
								</button>
							</div>
						))}
					</div>
				)}

				{/* Toolbar — قالب البريد (يعمل) */}
				<div className="flex items-center justify-start gap-2 border-t px-4 py-2.5">
					<Popover
						open={templateOpen}
						onOpenChange={setTemplateOpen}
					>
						<PopoverTrigger asChild>
							<Button
								type="button"
								size="sm"
								variant="ghost"
								className="gap-1 text-muted-foreground"
							>
								<IconChevronDown className="size-3.5" />
								قالب البريد
							</Button>
						</PopoverTrigger>
						<PopoverContent
							align="start"
							dir="rtl"
							className="w-48 p-1"
						>
							{REVIEW_REQUEST_EMAIL_TEMPLATES.map((template) => (
								<button
									key={template.value}
									type="button"
									onClick={() => applyTemplate(template.value)}
									className="flex w-full items-center rounded-md px-2 py-2 text-sm hover:bg-accent"
								>
									{template.label}
								</button>
							))}
						</PopoverContent>
					</Popover>
				</div>

				{/* Footer */}
				<div className="flex flex-row items-center justify-end gap-2 border-t p-3">
					<Button
						type="button"
						size="sm"
						variant="outline"
						onClick={() => onOpenChange(false)}
					>
						إلغاء
					</Button>
					<Button
						type="button"
						size="sm"
						disabled={!canSend}
						onClick={handleSend}
					>
						<IconSend className="size-3.5" />
						إرسال الطلب
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
}
