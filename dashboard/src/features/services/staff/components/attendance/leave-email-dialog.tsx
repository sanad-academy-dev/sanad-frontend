import { zodResolver } from "@hookform/resolvers/zod";
import {
	IconAlignRight,
	IconArrowsDiagonal,
	IconBold,
	IconChevronDown,
	IconCircleCheckFilled,
	IconDots,
	IconFileText,
	IconMoodSmile,
	IconPaperclip,
	IconPlus,
	IconPrinter,
	IconSend,
	IconTrash,
	IconX,
} from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { Field, FieldError } from "@/components/ui/field";
import {
	useLeaveRequest,
	useLeaveRequestActions,
} from "@/features/services/staff/hooks/use-leave-request";
import {
	type SendLeaveEmailFormInput,
	sendLeaveEmailSchema,
} from "@sanad/contracts/runtime/server/leave-requests/leave-requests.type";

function initialsOf(name: string) {
	return name
		.split(" ")
		.slice(0, 2)
		.map((w) => w[0])
		.join("")
		.toUpperCase();
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// توست نجاح إرسال الطلب (بطاقة بيضاء + علامة خضراء + زر إغلاق) — أسفل يسار
function showSentToast(staffName: string) {
	toast.custom(
		(id) => (
			<div className="flex w-[390px] items-center gap-2 rounded-[4px] border-[0.75px] border-[#E5E5E5] bg-white px-1 py-3 shadow-[0px_4px_24px_rgba(0,0,0,0.08)]">
				<button
					type="button"
					onClick={() => toast.dismiss(id)}
					aria-label="إغلاق"
					className="flex size-5 shrink-0 items-center justify-center rounded-[4px] text-[#9B9B9D] opacity-40 hover:opacity-100"
				>
					<IconX className="size-3" />
				</button>
				<span className="flex-1 text-right text-[12px] font-medium leading-[17px] text-black">
					تم إرسال طلب إجازة الخاص بـ ({staffName}) بنجاح، وبإنتظار الموافقة علية
				</span>
				<IconCircleCheckFilled className="size-5 shrink-0 text-[#008A2E]" />
			</div>
		),
		{ position: "bottom-left", duration: 5000 },
	);
}

// حقل المستلمين: إدخال بريد + زر "أضف شخص" + شرائح (RTL)
function RecipientsField({
	value,
	onChange,
}: {
	value: string[];
	onChange: (next: string[]) => void;
}) {
	const [draft, setDraft] = useState("");

	const add = () => {
		const email = draft.trim();
		if (!email || !EMAIL_RE.test(email) || value.includes(email)) return;
		onChange([...value, email]);
		setDraft("");
	};

	const remove = (email: string) => onChange(value.filter((e) => e !== email));

	return (
		<div className="flex flex-1 flex-wrap items-center justify-start gap-1.5">
			{value.map((email) => (
				<span
					key={email}
					className="flex h-7 items-center gap-1.5 rounded-full bg-[#F3F4F6] px-3 text-[14px] text-[#1E2939]"
				>
					<span className="flex size-[17px] items-center justify-center rounded-full bg-[#6366F1] text-[9px] text-white">
						{initialsOf(email)}
					</span>
					<span dir="ltr">{email}</span>
					<button
						type="button"
						onClick={() => remove(email)}
						aria-label={`إزالة ${email}`}
						className="text-[#6A7282] hover:text-[#DC2626]"
					>
						<IconX className="size-3" />
					</button>
				</span>
			))}
			<button
				type="button"
				onClick={add}
				className="flex h-[26px] items-center gap-1 rounded-[4px] border-[0.75px] border-[#E5E5E5] px-2 text-[12px] font-medium text-[#08090A]"
			>
				<IconPlus className="size-3.5" />
				أضف شخص
			</button>
			<input
				dir="rtl"
				value={draft}
				onChange={(e) => setDraft(e.target.value)}
				onKeyDown={(e) => {
					if (e.key === "Enter" || e.key === ",") {
						e.preventDefault();
						add();
					}
				}}
				placeholder="example@email.com"
				className="h-7 min-w-[120px] flex-1 bg-transparent text-right text-[13px] text-[#1E2939] outline-none placeholder:text-[#9B9B9D]"
			/>
		</div>
	);
}

export function LeaveEmailDialog({
	requestId,
	open,
	onClose,
	onSent,
	silent = false,
}: {
	requestId: string | null;
	open: boolean;
	onClose: () => void;
	onSent?: () => void;
	// كتم التوست الفردي (يُستخدم في الإرسال الجماعي حيث يُعرض توست مُجمّع بدلًا منه)
	silent?: boolean;
}) {
	const { request } = useLeaveRequest(requestId);
	const { sendEmail, isSending } = useLeaveRequestActions(requestId);
	const [attachmentVisible, setAttachmentVisible] = useState(true);

	const {
		register,
		handleSubmit,
		control,
		reset,
		formState: { errors },
	} = useForm<SendLeaveEmailFormInput>({
		resolver: zodResolver(sendLeaveEmailSchema),
		defaultValues: { recipients: [], subject: "", message: "" },
	});

	// تعبئة القيم الافتراضية عند فتح الحوار
	useEffect(() => {
		if (open && request) {
			reset({
				recipients: request.staff.email ? [request.staff.email] : [],
				subject: `طلب إجازة - #${request.code}`,
				message: "مرحبًا، نود طلب أجازة، من فضلك.\nمرفق نموذج طلب ومعلومات المدة الخاصة بنا",
			});
			setAttachmentVisible(true);
		}
	}, [open, request, reset]);

	const onSubmit = handleSubmit(async (data) => {
		try {
			await sendEmail(data);
			if (!silent) showSentToast(request?.staff.name ?? "");
			onClose();
			onSent?.();
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "فشل إرسال البريد", {
				position: "bottom-left",
			});
		}
	});

	const toolbarIcons = [
		IconDots,
		IconAlignRight,
		IconMoodSmile,
		IconPrinter,
		IconPaperclip,
		IconBold,
	];

	return (
		<Dialog
			open={open}
			onOpenChange={(o) => !o && onClose()}
		>
			<DialogContent
				dir="rtl"
				showCloseButton={false}
				className="flex h-[686px] max-h-[90vh] w-[807px] max-w-[807px] flex-col gap-0 overflow-hidden p-0 sm:max-w-[807px]"
			>
				<DialogTitle className="sr-only">إرسال طلب الإجازة عبر البريد</DialogTitle>
				<DialogDescription className="sr-only">
					إرسال طلب الإجازة عبر البريد الإلكتروني للموافقة
				</DialogDescription>

				<form
					onSubmit={onSubmit}
					className="flex min-h-0 flex-1 flex-col"
				>
					{/* الرأس */}
					<div className="flex items-center justify-between border-b-[0.75px] border-[#E5E5E5] px-[11px] py-2">
						<div className="flex items-center gap-1.5 text-[10px]">
							<span className="font-bold text-[#08090A]">طلب إجازة</span>
							<span className="text-[#9B9B9D]">›</span>
							<span className="flex size-[17px] items-center justify-center rounded-full bg-[#6366F1] text-[9px] text-white">
								{request ? initialsOf(request.staff.name) : ""}
							</span>
							<span className="text-[13px] font-bold text-[#08090A]">
								{request?.staff.name}
							</span>
							<span className="text-[#9B9B9D]">›</span>
							<span className="font-bold text-[#08090A]">
								إرسال الطلب الإجازة #{request?.code}
							</span>
						</div>
						<div className="flex items-center gap-1.5 text-[#9B9B9D]">
							<button
								type="button"
								aria-label="تكبير"
								className="flex size-[18px] items-center justify-center rounded-[4px] hover:bg-muted"
							>
								<IconArrowsDiagonal className="size-3.5" />
							</button>
							<button
								type="button"
								onClick={onClose}
								aria-label="إغلاق"
								className="flex size-[18px] items-center justify-center rounded-[4px] hover:bg-muted"
							>
								<IconX className="size-3.5" />
							</button>
						</div>
					</div>

					<div className="flex min-h-0 flex-1 flex-col overflow-y-auto px-3">
						{/* إلى: */}
						<div className="flex items-center gap-2 border-b border-[#F3F4F6] py-3">
							<span className="shrink-0 text-[14px] text-[#6A7282]">إلى:</span>
							<Controller
								name="recipients"
								control={control}
								render={({ field }) => (
									<RecipientsField
										value={field.value ?? []}
										onChange={field.onChange}
									/>
								)}
							/>
						</div>
						{errors.recipients && (
							<Field
								data-invalid
								className="pt-1"
							>
								<FieldError errors={[errors.recipients as { message?: string }]} />
							</Field>
						)}

						{/* الموضوع */}
						<div className="flex items-center gap-2 border-b border-[#F3F4F6] py-3">
							<span className="shrink-0 text-[14px] text-[#6A7282]">الموضوع</span>
							<input
								{...register("subject")}
								className="flex-1 bg-transparent text-right text-[14px] font-medium text-[#101828] outline-none placeholder:text-[#9B9B9D]"
								placeholder="موضوع الرسالة"
							/>
						</div>
						{errors.subject && (
							<Field
								data-invalid
								className="pt-1"
							>
								<FieldError errors={[errors.subject]} />
							</Field>
						)}

						{/* نص الرسالة */}
						<textarea
							{...register("message")}
							dir="rtl"
							className="min-h-[180px] w-full flex-1 resize-none bg-transparent py-3 text-right text-[14px] leading-[21px] text-[#1E2939] outline-none placeholder:text-[#9B9B9D]"
							placeholder="اكتب نص الرسالة..."
						/>
						{errors.message && (
							<Field data-invalid>
								<FieldError errors={[errors.message]} />
							</Field>
						)}

						{/* المرفق */}
						{attachmentVisible && (
							<div className="mb-3 flex items-center justify-between gap-2 rounded-[4px] border border-[#F3F4F6] bg-[#F9FAFB] px-2 py-1.5">
								<div className="flex items-center gap-2.5">
									<div className="flex items-center gap-1.5">
										<span className="text-[14px] font-medium text-[#08090A]">
											طلب أجازة #{request?.code}.pdf
										</span>
										<span className="text-[12px] text-[#99A1AF]">(20 كيلوبايت)</span>
									</div>
									<span className="flex size-8 items-center justify-center rounded-[4px] bg-[#FFE2E2] text-[#FB2C36]">
										<IconFileText className="size-4" />
									</span>
								</div>
								<button
									type="button"
									onClick={() => setAttachmentVisible(false)}
									aria-label="إزالة المرفق"
									className="flex size-[23px] items-center justify-center rounded-[4px] text-[#99A1AF] hover:text-[#DC2626]"
								>
									<IconTrash className="size-[15px]" />
								</button>
							</div>
						)}
					</div>

					{/* شريط الأدوات */}
					<div className="flex items-center justify-between border-t border-[#F3F4F6] px-3 py-2">
						<div className="flex items-center gap-1 text-[#6A7282]">
							{toolbarIcons.map((Icon, i) => (
								<button
									key={i}
									type="button"
									className="flex size-8 items-center justify-center rounded-[4px] hover:bg-muted"
								>
									<Icon className="size-4" />
								</button>
							))}
						</div>
						<button
							type="button"
							className="flex items-center gap-1.5 text-[14px] font-medium text-[#4A5565]"
						>
							<IconChevronDown className="size-3.5" />
							قالب البريد
						</button>
					</div>

					{/* التذييل */}
					<div className="flex items-center gap-2 border-t border-[#F3F4F6] px-3 py-2">
						<Button
							type="submit"
							disabled={isSending}
							className="h-[26px] gap-1.5 rounded-[4px] bg-[#506AE0] px-[18px] text-[10px]"
						>
							ارسال الطلب
							<IconSend className="size-3" />
						</Button>
						<Button
							type="button"
							variant="outline"
							onClick={onClose}
							disabled={isSending}
							className="h-[26px] rounded-[4px] border-black/[0.13] bg-[#F9FAFB] px-[18px] text-[10px] text-[#08090A]"
						>
							إلغاء
						</Button>
					</div>
				</form>
			</DialogContent>
		</Dialog>
	);
}
