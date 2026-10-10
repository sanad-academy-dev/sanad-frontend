import {
	IconAlertCircle,
	IconDownload,
	IconEye,
	IconFileText,
	IconLink,
	IconPaperclip,
	IconPlus,
	IconX,
} from "@tabler/icons-react";
import { useHotkey } from "@tanstack/react-hotkeys";
import type { ChangeEvent } from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { FormFooter } from "@/components/common/form-footer";
import { FormHeader } from "@/components/common/form-header";
import { RequiredMark } from "@/components/common/required-mark";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useUploadFile } from "@/features/appointments/hooks/use-upload-file";
import { CancelExpenseRequestDialog } from "@/features/finance/expenses/components/cancel-expense-request-dialog";
import { DeleteExpenseRequestDialog } from "@/features/finance/expenses/components/delete-expense-request-dialog";
import { ExpenseReviewPanel } from "@/features/finance/expenses/components/expense-review-panel";
import {
	type ReviewDecision,
	ReviewDecisionDialog,
} from "@/features/finance/expenses/components/review-decision-dialog";
import { SendReviewRequestDialog } from "@/features/finance/expenses/components/send-review-request-dialog";
import {
	type ApprovalStep,
	type ApprovalStepAction,
	fromExpenseResponse,
	type SendReviewRequestValues,
	type SubmittedExpenseRequest,
} from "@/features/finance/expenses/data/expense-review";
import {
	CREATE_EXPENSE_FORM_DEFAULTS,
	type CreateExpenseFormValues,
	createExpenseDocumentAttachment,
	createExpenseLinkAttachment,
	EXPENSE_CATEGORY_OPTIONS,
	EXPENSE_DEPARTMENT_OPTIONS,
	EXPENSE_PAYMENT_METHOD_OPTIONS,
	EXPENSE_REQUIRED_FIELDS,
	type ExpenseAttachment,
	toCreateExpensePayload,
	toFormValues,
} from "@/features/finance/expenses/data/expenses";
import { useClinicUsers } from "@/features/finance/expenses/hooks/use-clinic-users";
import { useExpense } from "@/features/finance/expenses/hooks/use-expense";
import { useExpenseMutations } from "@/features/finance/expenses/hooks/use-expense-mutations";
import { useStaff } from "@/features/services/staff/hooks/use-staff";
import { useBranches } from "@/features/settings/branches/hooks/use-branches";
import { useSession } from "@/lib/auth/client";
import type { ExpenseResponse } from "@/server/expenses/expenses.type";

// رابط صالح: يُحلّل عبر URL ويبدأ ببروتوكول http أو https
function isValidHttpUrl(value: string): boolean {
	if (!/^https?:\/\//i.test(value)) return false;
	try {
		const { protocol } = new URL(value);
		return protocol === "http:" || protocol === "https:";
	} catch {
		return false;
	}
}

// صفوف مرفقات المستندات والروابط — شكلها يختلف حسب النوع (رابط / مستند)
function AttachmentRow({
	attachment,
	onRemove,
}: {
	attachment: ExpenseAttachment;
	onRemove: () => void;
}) {
	if (attachment.kind === "link") {
		return (
			<div
				className="flex items-center gap-2 rounded-[4px] border bg-muted/40 px-3 py-2"
				dir="rtl"
			>
				<span className="flex items-center gap-1.5 rounded-[4px] bg-primary/10 px-2 py-1 text-[11px] font-medium text-primary">
					<IconLink className="size-3" />
					رابط
				</span>
				<span className="flex-1 truncate text-xs text-foreground">{attachment.label}</span>
				<button
					type="button"
					onClick={onRemove}
					className="flex size-5 items-center justify-center rounded text-muted-foreground hover:bg-muted hover:text-foreground"
				>
					<IconX className="size-3.5" />
					<span className="sr-only">حذف الرابط</span>
				</button>
			</div>
		);
	}

	return (
		<div
			className="flex items-center gap-2 rounded-[4px] border bg-muted/40 px-3 py-2"
			dir="rtl"
		>
			<span className="flex size-7 shrink-0 items-center justify-center rounded-[4px] border bg-background">
				<IconFileText className="size-3.5 text-muted-foreground" />
			</span>
			<div className="flex min-w-0 flex-1 flex-col">
				<span className="truncate text-xs font-medium text-foreground">
					{attachment.label}
				</span>
				{attachment.uploadedAtLabel && (
					<span className="text-[10px] text-muted-foreground">
						{attachment.uploadedAtLabel}
					</span>
				)}
			</div>
			<div className="flex items-center gap-1">
				<button
					type="button"
					className="flex size-6 items-center justify-center rounded text-muted-foreground hover:bg-muted hover:text-foreground"
				>
					<IconEye className="size-3.5" />
					<span className="sr-only">عرض</span>
				</button>
				<button
					type="button"
					className="flex size-6 items-center justify-center rounded text-muted-foreground hover:bg-muted hover:text-foreground"
				>
					<IconDownload className="size-3.5" />
					<span className="sr-only">تنزيل</span>
				</button>
				<button
					type="button"
					onClick={onRemove}
					className="flex size-6 items-center justify-center rounded text-muted-foreground hover:bg-muted hover:text-foreground"
				>
					<IconX className="size-3.5" />
					<span className="sr-only">حذف المستند</span>
				</button>
			</div>
		</div>
	);
}

export function CreateExpenseSheet({
	open,
	onOpenChange,
	expenseId,
	onRejected,
}: {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	/** عند تمريره تُفتح شاشة مراجعة مصروف موجود بدل نموذج الإنشاء */
	expenseId?: string | null;
	/** يُستدعى بعد رفض الطلب داخل اللوحة — للتسليم إلى حوار ملخّص الرفض */
	onRejected?: (id: string) => void;
}) {
	const [values, setValues] = useState<CreateExpenseFormValues>(CREATE_EXPENSE_FORM_DEFAULTS);
	const [attachments, setAttachments] = useState<ExpenseAttachment[]>([]);
	const [attachmentMenuOpen, setAttachmentMenuOpen] = useState(false);
	const [addingLink, setAddingLink] = useState(false);
	const [linkDraft, setLinkDraft] = useState("");
	// رسالة تحقّق الرابط — تظهر أسفل الحقل عند إدخال رابط غير صالح
	const [linkError, setLinkError] = useState<string | null>(null);
	const [continueAdding, setContinueAdding] = useState(false);
	const [sendNotification, setSendNotification] = useState(true);
	// بعد "مراجعة الطلب" يُحفظ المصروف عبر الـ API ويُعرض مسار الموافقات (مشتقّ من الاستجابة)
	const [savedExpense, setSavedExpense] = useState<ExpenseResponse | null>(null);
	// حوار "إرسال الطلب للصرف"
	const [sendDialogOpen, setSendDialogOpen] = useState(false);
	// الخطوة والقرار (اعتماد/رفض) قيد التأكيد → يفتح حوار القرار
	const [decisionTarget, setDecisionTarget] = useState<{
		stepId: string;
		decision: ReviewDecision;
	} | null>(null);
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
	const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
	// معرّف المصروف الجاري تعديله (وضع التعديل يُعيد استخدام النموذج ويحفظ عبر update)
	const [editingId, setEditingId] = useState<string | null>(null);

	const { create, sendReview, decide, update, cancel, remove, isCreating, isUpdating } =
		useExpenseMutations();
	const { users } = useClinicUsers();
	const { branches } = useBranches();
	const { data: session } = useSession();
	// موظفو الأكاديمية — لربط السلف والعهد بموظف بعينه
	const { staff } = useStaff();
	const currentUserId = session?.user.id;
	const currentUserName = session?.user.name ?? "المستخدم الحالي";
	const { uploadFile, isPending: isUploading } = useUploadFile();
	const fileInputRef = useRef<HTMLInputElement>(null);
	// عند فتح مصروف موجود نجلبه ونعرض شاشة المراجعة
	const { expense: fetchedExpense } = useExpense(open && expenseId ? expenseId : null);

	// نموذج العرض مشتقّ من المصروف المحفوظ
	const view = useMemo(
		() => (savedExpense ? fromExpenseResponse(savedExpense) : null),
		[savedExpense],
	);
	const submittedRequest: SubmittedExpenseRequest | null = view?.request ?? null;
	const approvalSteps: ApprovalStep[] = view?.steps ?? [];
	const reviewSent = view?.reviewSent ?? false;

	useEffect(() => {
		if (!open) return;
		setValues(CREATE_EXPENSE_FORM_DEFAULTS);
		setAttachments([]);
		setAttachmentMenuOpen(false);
		setAddingLink(false);
		setLinkDraft("");
		setLinkError(null);
		setContinueAdding(false);
		setSendNotification(true);
		setSavedExpense(null);
		setSendDialogOpen(false);
		setDecisionTarget(null);
		setDeleteDialogOpen(false);
		setCancelDialogOpen(false);
		setEditingId(null);
	}, [open]);

	// عند جلب مصروف موجود، اعرض شاشة المراجعة الخاصة به
	useEffect(() => {
		if (open && expenseId && fetchedExpense) setSavedExpense(fetchedExpense);
	}, [open, expenseId, fetchedExpense]);

	const setField = <K extends keyof CreateExpenseFormValues>(
		key: K,
		value: CreateExpenseFormValues[K],
	) => setValues((prev) => ({ ...prev, [key]: value }));

	// "مقدم الطلب" يُضبط تلقائياً على المستخدم الحالي عند فتح النموذج
	useEffect(() => {
		if (open && currentUserId && !values.requesterId) {
			setValues((prev) => ({ ...prev, requesterId: currentUserId }));
		}
	}, [open, currentUserId, values.requesterId]);

	const filledCount = useMemo(
		() => EXPENSE_REQUIRED_FIELDS.filter((f) => !!values[f]).length,
		[values],
	);
	const progress = Math.round((filledCount / EXPENSE_REQUIRED_FIELDS.length) * 100);
	const isValid = filledCount === EXPENSE_REQUIRED_FIELDS.length;

	const requestClose = () => onOpenChange(false);

	const handleAddLink = () => {
		const url = linkDraft.trim();
		if (!url) return;
		// يجب أن يكون رابطًا صالحًا يبدأ بـ http أو https
		if (!isValidHttpUrl(url)) {
			setLinkError("يرجى إدخال رابط صالح يبدأ بـ http أو https");
			return;
		}
		setAttachments((prev) => [...prev, createExpenseLinkAttachment(url)]);
		setLinkDraft("");
		setLinkError(null);
		setAddingLink(false);
	};

	// إضافة مستند — يفتح منتقي الملفات ثم يرفع عبر التخزين السحابي
	const handleAddDocument = () => {
		setAttachmentMenuOpen(false);
		fileInputRef.current?.click();
	};

	const handleFileSelected = async (e: ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		e.target.value = ""; // يسمح بإعادة اختيار نفس الملف
		if (!file) return;
		const promise = uploadFile(file);
		toast.promise(promise, {
			loading: "جارٍ رفع الملف...",
			success: "تم رفع الملف",
			error: (err: Error) => err.message || "تعذّر رفع الملف",
		});
		try {
			const uploaded = await promise;
			setAttachments((prev) => [
				...prev,
				createExpenseDocumentAttachment(uploaded.name, uploaded.url),
			]);
		} catch {
			// toast تم عرضه
		}
	};

	// "مراجعة الطلب" — ينشئ مصروفاً جديداً أو يحفظ تعديلات مصروف قائم، ثم يفتح مسار الموافقات.
	// عند التعديل: إن كان الطلب قد أُرسل يُعيد الخادم ضبط المسار من البداية.
	const handleSubmit = async () => {
		try {
			const payload = toCreateExpensePayload(values, attachments);
			const saved = editingId
				? await update({ id: editingId, payload })
				: await create(payload);
			// «حفظ ومتابعة الإضافة» — نُفرّغ النموذج لطلب جديد بدل الانتقال لشاشة المراجعة
			if (!editingId && continueAdding) {
				setValues(CREATE_EXPENSE_FORM_DEFAULTS);
				setAttachments([]);
				return;
			}
			setSavedExpense(saved);
			setEditingId(null);
		} catch {
			// toast يُدار في الـ hook
		}
	};

	// "تعديل الطلب" — يعيد ملء النموذج من المصروف المحفوظ ويدخل وضع التعديل
	const handleEdit = () => {
		if (!savedExpense) return;
		setValues(toFormValues(savedExpense));
		setAttachments(
			savedExpense.attachments.map((a) => ({
				id: a.id,
				kind: a.kind === "LINK" ? "link" : "document",
				label: a.label,
				value: a.url,
				uploadedAtLabel: new Date(a.createdAt).toLocaleDateString("en-CA"),
			})),
		);
		setEditingId(savedExpense.id);
		setSavedExpense(null);
	};

	// حذف الطلب — يستدعي الـ API ثم يغلق اللوحة
	const handleConfirmDelete = async () => {
		if (!savedExpense) return;
		try {
			await remove(savedExpense.id);
			setDeleteDialogOpen(false);
			onOpenChange(false);
		} catch {
			// toast في الـ hook
		}
	};

	// إلغاء الطلب — يوقف المسار (الحالة "ملغى") مع سبب مطلوب، ويبقى السجل ظاهراً
	const handleConfirmCancel = async (reason: string) => {
		if (!savedExpense) return;
		try {
			const updated = await cancel({ id: savedExpense.id, cancelReason: reason });
			setSavedExpense(updated);
			setCancelDialogOpen(false);
		} catch {
			// toast في الـ hook
		}
	};

	// إرسال طلب المراجعة من الحوار — يعلّم خطوة الإرسال كمُرسَلة عبر الـ API
	const handleSendReviewRequest = async (dialogValues: SendReviewRequestValues) => {
		if (!savedExpense) return;
		try {
			const updated = await sendReview({
				id: savedExpense.id,
				recipientIds: dialogValues.recipients.map((r) => r.id),
				subject: dialogValues.subject,
				body: dialogValues.body,
			});
			setSavedExpense(updated);
		} catch {
			// toast في الـ hook
		}
	};

	const handleStepAction = (step: ApprovalStep, action: ApprovalStepAction) => {
		// أزرار القرار لا تعمل قبل إرسال طلب المراجعة
		if (!reviewSent) return;
		if (action.kind === "approve") {
			setDecisionTarget({ stepId: step.id, decision: "approve" });
			return;
		}
		if (action.kind === "reject") {
			setDecisionTarget({ stepId: step.id, decision: "reject" });
			return;
		}
		if (action.kind === "disburse") {
			setDecisionTarget({ stepId: step.id, decision: "disburse" });
			return;
		}
	};

	const handleConfirmDecision = async (signatureName: string, notes: string) => {
		if (!decisionTarget || !savedExpense) return;
		const { stepId, decision } = decisionTarget;
		setDecisionTarget(null);
		try {
			const updated = await decide({
				id: savedExpense.id,
				stepId,
				decision,
				signed: true,
				signatureName,
				reason: decision === "reject" ? notes : undefined,
			});
			if (decision === "approve") {
				setSavedExpense(updated);
				toast.success("تم اعتماد المصروف بنجاح", {
					description:
						"تمت مراجعة واعتماد طلب المصروف من قبل المدير العام، وأصبح جاهزًا للانتقال إلى المرحلة التالية من دورة الصرف.",
				});
			} else if (decision === "disburse") {
				setSavedExpense(updated);
				toast.success("تم صرف المصروف بنجاح", {
					description: "تم تسجيل عملية الصرف وتحديث حالة الطلب إلى «تم الصرف».",
				});
			} else {
				toast.error("تم رفض المصروف", {
					description: "تم رفض طلب المصروف وإشعار مقدم الطلب بسبب القرار.",
				});
				// نسلّم إلى حوار ملخّص الرفض (يُغلق اللوحة ويفتح الحوار) بدل عرض اللوحة الداخلية
				onRejected?.(updated.id);
			}
		} catch {
			// toast في الـ hook
		}
	};

	useHotkey(
		"Mod+Enter",
		() => {
			if (!isValid) return;
			handleSubmit();
		},
		{ enabled: open },
	);

	return (
		<>
			<Sheet
				open={open}
				onOpenChange={(isOpen) => {
					if (!isOpen) {
						requestClose();
						return;
					}
					onOpenChange(isOpen);
				}}
			>
				<SheetContent
					side="left"
					dir="rtl"
					showCloseButton={false}
					className="w-full flex-row items-stretch gap-3 border-none! bg-transparent! p-0 shadow-none! sm:max-w-xl!"
				>
					{submittedRequest ? (
						<ExpenseReviewPanel
							request={submittedRequest}
							steps={approvalSteps}
							reviewSent={reviewSent}
							onClose={requestClose}
							onEdit={handleEdit}
							onDelete={() => setDeleteDialogOpen(true)}
							onCancel={() => setCancelDialogOpen(true)}
							onAction={handleStepAction}
							onSendReview={() => setSendDialogOpen(true)}
							onViewRejection={
								onRejected && savedExpense ? () => onRejected(savedExpense.id) : undefined
							}
						/>
					) : (
						<div
							className="relative order-2 flex min-h-0 flex-1 flex-col rounded-lg border bg-popover"
							dir="rtl"
						>
							<button
								type="button"
								onClick={requestClose}
								className="absolute top-3 left-3 flex size-7 items-center justify-center rounded hover:bg-muted"
							>
								<IconX className="size-4" />
								<span className="sr-only">إغلاق</span>
							</button>

							{/* حالة useState بلا مخطط Zod — نمرّر العدّادات المحسوبة يدويًا */}
							<FormHeader
								title="طلب مصروف"
								changesCount={savedExpense?.editsCount ?? 0}
								progress={{
									filledCount,
									requiredCount: EXPENSE_REQUIRED_FIELDS.length,
									progress,
									isComplete: progress === 100,
								}}
							/>

							<div className="flex-1 space-y-5 overflow-y-auto p-4">
								{/* ─── بيانات المصروف ─── */}
								<div className="space-y-3">
									<div className="grid grid-cols-2 gap-3">
										<Field>
											<Label className="justify-start gap-1.5">
												اسم المصروف
												<RequiredMark />
											</Label>
											<Input
												placeholder="مثال: إيجار المكتب"
												value={values.name}
												onChange={(e) => setField("name", e.target.value)}
											/>
										</Field>

										<Field>
											<Label className="justify-start gap-1.5">
												مقدم الطلب
												<RequiredMark />
											</Label>
											<Select
												value={values.requesterId}
												onValueChange={(v) => setField("requesterId", v)}
												dir="rtl"
											>
												<SelectTrigger className="w-full">
													<SelectValue placeholder="اختر مقدم الطلب" />
												</SelectTrigger>
												<SelectContent dir="rtl">
													{users.map((u) => (
														<SelectItem
															key={u.id}
															value={u.id}
															className="text-right"
														>
															{u.name}
															{u.id === currentUserId ? " (أنا)" : ""}
														</SelectItem>
													))}
												</SelectContent>
											</Select>
										</Field>
									</div>

									<div className="grid grid-cols-2 gap-3">
										<Field>
											<Label className="justify-start">القسم</Label>
											<Select
												value={values.departmentId}
												onValueChange={(v) => setField("departmentId", v)}
												dir="rtl"
											>
												<SelectTrigger className="w-full">
													<SelectValue placeholder="اختر القسم" />
												</SelectTrigger>
												<SelectContent dir="rtl">
													{EXPENSE_DEPARTMENT_OPTIONS.map((opt) => (
														<SelectItem
															key={opt.value}
															value={opt.value}
															className="text-right"
														>
															{opt.label}
														</SelectItem>
													))}
												</SelectContent>
											</Select>
										</Field>

										<Field>
											<Label className="justify-start">الفئة</Label>
											<Select
												value={values.categoryId}
												onValueChange={(v) => setField("categoryId", v)}
												dir="rtl"
											>
												<SelectTrigger className="w-full">
													<SelectValue placeholder="اختر الفئة" />
												</SelectTrigger>
												<SelectContent dir="rtl">
													{EXPENSE_CATEGORY_OPTIONS.map((opt) => (
														<SelectItem
															key={opt.value}
															value={opt.value}
															className="text-right"
														>
															{opt.label}
														</SelectItem>
													))}
												</SelectContent>
											</Select>
										</Field>
									</div>

									<div className="grid grid-cols-2 gap-3">
										<Field>
											<Label className="justify-start gap-1.5">
												المبلغ (ريال سعودي)
												<RequiredMark />
											</Label>
											<InputGroup>
												<InputGroupInput
													type="number"
													min={0}
													placeholder="اكتب المبلغ"
													value={values.amount}
													onChange={(e) => setField("amount", e.target.value)}
												/>
												<InputGroupAddon align="inline-end">ر.س</InputGroupAddon>
											</InputGroup>
										</Field>

										<Field>
											<Label className="justify-start">طريقة الدفع</Label>
											<Select
												value={values.paymentMethodId}
												onValueChange={(v) => setField("paymentMethodId", v)}
												dir="rtl"
											>
												<SelectTrigger className="w-full">
													<SelectValue placeholder="اختر طريقة الدفع" />
												</SelectTrigger>
												<SelectContent dir="rtl">
													{EXPENSE_PAYMENT_METHOD_OPTIONS.map((opt) => (
														<SelectItem
															key={opt.value}
															value={opt.value}
															className="text-right"
														>
															{opt.label}
														</SelectItem>
													))}
												</SelectContent>
											</Select>
										</Field>
									</div>

									<Field>
										<Label className="justify-start gap-1.5">
											الفرع
											<RequiredMark />
										</Label>
										<Select
											value={values.branchId}
											onValueChange={(v) => setField("branchId", v)}
											dir="rtl"
										>
											<SelectTrigger className="w-full">
												<SelectValue placeholder="اختر الفرع" />
											</SelectTrigger>
											<SelectContent dir="rtl">
												{branches.map((branch) => (
													<SelectItem
														key={branch.id}
														value={branch.id}
														className="text-right"
													>
														{branch.name}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
									</Field>

									{/* سلفة موظف — تُخصم من راتبه في المسير التالي */}
									<Field>
										<Label className="justify-start">موظف (سلفة/عهدة)</Label>
										<Select
											value={values.staffId ?? "none"}
											onValueChange={(v) => {
												const next = v === "none" ? undefined : v;
												setField("staffId", next);
												// إلغاء اختيار الموظف يُلغي الاسترداد تلقائيًا
												if (!next) setField("recoverFromPayroll", false);
											}}
											dir="rtl"
										>
											<SelectTrigger className="w-full">
												<SelectValue placeholder="بدون — مصروف عام" />
											</SelectTrigger>
											<SelectContent dir="rtl">
												<SelectItem
													value="none"
													className="text-right"
												>
													بدون — مصروف عام
												</SelectItem>
												{staff.map((member) => (
													<SelectItem
														key={member.id}
														value={member.id}
														className="text-right"
													>
														{member.name}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
									</Field>
								</div>

								{values.staffId && (
									<Label className="flex items-center justify-start gap-2 rounded-md border bg-muted/30 px-3 py-2.5 font-normal">
										<Checkbox
											checked={values.recoverFromPayroll}
											onCheckedChange={(c) => setField("recoverFromPayroll", c === true)}
										/>
										<span className="flex flex-col gap-0.5">
											<span className="text-xs font-medium">استرداد من الراتب</span>
											<span className="text-[10px] text-muted-foreground">
												يُخصم المبلغ من صافي راتب الموظف في أول مسير بعد صرف هذا المصروف
											</span>
										</span>
									</Label>
								)}

								{/* ─── المستندات والروابط ─── */}
								<div className="space-y-3">
									<div
										className="flex items-center justify-between gap-2"
										dir="rtl"
									>
										<span className="text-[11px] font-semibold text-foreground">
											المستندات والروابط
										</span>
										<Popover
											open={attachmentMenuOpen}
											onOpenChange={setAttachmentMenuOpen}
										>
											<PopoverTrigger asChild>
												<Button
													type="button"
													size="sm"
													variant="outline"
													disabled={isUploading}
													className="border-primary text-primary hover:bg-primary/5"
												>
													<IconPlus className="size-3" />
													{isUploading ? "جارٍ الرفع..." : "أضف مستندًا أو رابطًا..."}
												</Button>
											</PopoverTrigger>
											<PopoverContent
												align="end"
												dir="rtl"
												className="w-48 p-1"
											>
												<button
													type="button"
													onClick={() => {
														setAttachmentMenuOpen(false);
														setAddingLink(true);
													}}
													className="flex w-full items-center gap-2 rounded-md px-2 py-2 text-sm hover:bg-accent"
												>
													<IconLink className="size-4 text-muted-foreground" />
													إضافة رابط
												</button>
												<button
													type="button"
													onClick={handleAddDocument}
													className="flex w-full items-center gap-2 rounded-md px-2 py-2 text-sm hover:bg-accent"
												>
													<IconPaperclip className="size-4 text-muted-foreground" />
													إضافة مستند
												</button>
											</PopoverContent>
										</Popover>
									</div>

									{/* منتقي ملفات مخفي — يُفتح من "إضافة مستند" */}
									<input
										ref={fileInputRef}
										type="file"
										accept=".pdf,.doc,.docx,.xls,.xlsx,image/*"
										className="hidden"
										onChange={handleFileSelected}
									/>

									{addingLink && (
										<div
											className="flex flex-col gap-1"
											dir="rtl"
										>
											<div className="flex items-center gap-2">
												<Input
													autoFocus
													placeholder="https://..."
													value={linkDraft}
													aria-invalid={!!linkError}
													onChange={(e) => {
														setLinkDraft(e.target.value);
														if (linkError) setLinkError(null);
													}}
													onKeyDown={(e) => {
														if (e.key === "Enter") {
															e.preventDefault();
															handleAddLink();
														}
													}}
												/>
												<Button
													type="button"
													size="sm"
													onClick={handleAddLink}
													disabled={!linkDraft.trim()}
												>
													إضافة
												</Button>
												<Button
													type="button"
													size="sm"
													variant="outline"
													onClick={() => {
														setAddingLink(false);
														setLinkDraft("");
														setLinkError(null);
													}}
												>
													إلغاء
												</Button>
											</div>
											{linkError && (
												<p className="flex items-center gap-1 text-xs text-destructive">
													<IconAlertCircle className="size-3.5 shrink-0" />
													{linkError}
												</p>
											)}
										</div>
									)}

									{attachments.length > 0 && (
										<div className="space-y-2">
											{attachments.map((attachment) => (
												<AttachmentRow
													key={attachment.id}
													attachment={attachment}
													onRemove={() =>
														setAttachments((prev) =>
															prev.filter((a) => a.id !== attachment.id),
														)
													}
												/>
											))}
										</div>
									)}
								</div>

								{/* ─── ملاحظات ─── */}
								<Field>
									<Label className="justify-start">ملاحظات</Label>
									<Textarea
										placeholder="اكتب ملاحظات ..."
										className="min-h-20"
										value={values.notes}
										onChange={(e) => setField("notes", e.target.value)}
									/>
								</Field>
							</div>

							{/* Footer */}
							<FormFooter
								continueAdding={continueAdding}
								onContinueAddingChange={editingId ? undefined : setContinueAdding}
								disabled={isCreating || isUpdating}
								extra={
									<Label className="flex cursor-pointer items-center gap-2 font-normal text-muted-foreground">
										<Switch
											size="sm"
											checked={sendNotification}
											onCheckedChange={setSendNotification}
										/>
										إرسال أشعار
									</Label>
								}
							>
								<Button
									type="button"
									variant="outline"
									size="sm"
									onClick={requestClose}
								>
									حفظ كمسودة
								</Button>
								<Button
									type="button"
									size="sm"
									disabled={!isValid || isCreating || isUpdating}
									onClick={handleSubmit}
								>
									{editingId ? "حفظ التعديلات" : "مراجعة الطلب"}
								</Button>
							</FormFooter>
						</div>
					)}
				</SheetContent>
			</Sheet>

			{submittedRequest && (
				<SendReviewRequestDialog
					open={sendDialogOpen}
					onOpenChange={setSendDialogOpen}
					request={submittedRequest}
					onSend={handleSendReviewRequest}
				/>
			)}

			{submittedRequest && (
				<ReviewDecisionDialog
					open={!!decisionTarget}
					onOpenChange={(o) => !o && setDecisionTarget(null)}
					request={submittedRequest}
					decision={decisionTarget?.decision ?? "approve"}
					signerName={currentUserName}
					onConfirm={handleConfirmDecision}
				/>
			)}

			{submittedRequest && (
				<DeleteExpenseRequestDialog
					open={deleteDialogOpen}
					onOpenChange={setDeleteDialogOpen}
					request={submittedRequest}
					onConfirm={handleConfirmDelete}
				/>
			)}

			{submittedRequest && (
				<CancelExpenseRequestDialog
					open={cancelDialogOpen}
					onOpenChange={setCancelDialogOpen}
					request={submittedRequest}
					onConfirm={handleConfirmCancel}
				/>
			)}
		</>
	);
}
