import { zodResolver } from "@hookform/resolvers/zod";
import { IconTrash } from "@tabler/icons-react";
import { useHotkey } from "@tanstack/react-hotkeys";
import { useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";

import { DisabledReasonTooltip } from "@/components/common/disabled-reason-tooltip";
import { FieldLabel } from "@/components/common/field-label";
import { FormFooter } from "@/components/common/form-footer";
import { FormHeader } from "@/components/common/form-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Field, FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { usePatientsByOwner } from "@/features/appointments/hooks/use-patients-by-owner";
import {
	useGroomingMutations,
	useGroomingTemplates,
} from "@/features/care/grooming/hooks/use-grooming";
import { useOwners } from "@/features/services/patients/hooks/use-owners";
import { useStaff } from "@/features/services/staff/hooks/use-staff";
import { useBranches } from "@/features/settings/branches/hooks/use-branches";
import { useActiveBranchStore } from "@/features/settings/branches/stores/active-branch.store";
import { GroomingLane } from "@/generated/prisma/enums";
import { useFormProgress } from "@/hooks/use-form-progress";
import { useI18n } from "@/hooks/use-i18n";
import {
	type CreateGroomingSessionFormInput,
	createGroomingSessionSchema,
} from "@sanad/contracts/runtime/server/grooming/grooming.type";

/**
 * مُنشئ جلسة التجميل — بنفس هيكل «طلب تحليل جديد».
 *
 * لا حقل سعر هنا عمدًا: الدورات تُرسل كمعرّفات، والسعر والمدّة يُحلّان على الخادم
 * عبر مصفوفة (السلالة × الحجم × نوع الفرو). رقمٌ يكتبه المستخدم يتجاوز المصفوفة
 * ويُبطل الغرض منها.
 */
export function CreateGroomingSessionDialog({
	open,
	onOpenChange,
}: {
	open: boolean;
	onOpenChange: (open: boolean) => void;
}) {
	const { isRtl } = useI18n();
	const dir = isRtl ? "rtl" : "ltr";

	const [continueAdding, setContinueAdding] = useState(false);
	const [ownerId, setOwnerId] = useState("");
	const { owners } = useOwners();
	const { branches } = useBranches();
	const { staff } = useStaff();
	const { templates } = useGroomingTemplates();
	const { activeBranchId } = useActiveBranchStore();
	const { createSession, isPending } = useGroomingMutations();

	// مرجع ثابت — لولا useMemo لأعاد الضبط تصفير النموذج في كل رسم
	const initialDefaults = useMemo<CreateGroomingSessionFormInput>(
		() => ({
			patientId: "",
			branchId: activeBranchId ?? "",
			groomerId: "",
			scheduledAt: "",
			definitionIds: [],
			sedationPlanned: false,
		}),
		[activeBranchId],
	);

	const form = useForm<CreateGroomingSessionFormInput>({
		resolver: zodResolver(createGroomingSessionSchema),
		defaultValues: initialDefaults,
		mode: "onChange",
	});

	const values = form.watch();
	const formProgress = useFormProgress({ schema: createGroomingSessionSchema, values });
	const { patients } = usePatientsByOwner(ownerId || undefined);

	const definitionIds = values.definitionIds ?? [];
	// الدورات المعرَّفة والمفعّلة وحدها قابلة للحجز — بلا تعريف لا مسار ولا دقائق تجفيف
	const bookable = useMemo(
		() => templates.filter((t) => t.definition != null && t.isActive),
		[templates],
	);
	const medicalSelected = bookable.some(
		(t) =>
			definitionIds.includes(t.definition?.id ?? "") &&
			t.effectiveLane === GroomingLane.MEDICAL,
	);

	const onSubmit = (data: CreateGroomingSessionFormInput) => {
		void createSession({
			...data,
			scheduledAt: new Date(data.scheduledAt).toISOString(),
		})
			.then(() => {
				if (continueAdding) {
					form.reset(initialDefaults);
					setOwnerId("");
				} else {
					onOpenChange(false);
				}
			})
			.catch(() => {});
	};

	useHotkey("Mod+Enter", () => void form.handleSubmit(onSubmit)(), { enabled: open });

	const missing: string[] = [];
	if (!ownerId) missing.push("وليّ الأمر");
	if (!values.patientId) missing.push("الطفل");
	if (!values.branchId) missing.push("الفرع");
	if (!values.groomerId) missing.push("المُجمِّل");
	if (!values.scheduledAt) missing.push("الموعد");
	if (definitionIds.length === 0) missing.push("الدورات");
	const missingReason = missing.length ? `أكمل: ${missing.join("، ")}` : undefined;

	return (
		<Dialog
			open={open}
			onOpenChange={onOpenChange}
		>
			<DialogContent
				dir={dir}
				className="max-w-4xl! gap-0 p-0"
				showCloseButton={false}
			>
				<FormHeader
					variant="dialog"
					title="جلسة تجميل جديدة"
					progress={formProgress}
					onClose={() => onOpenChange(false)}
				/>

				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className="flex max-h-[70vh] flex-col overflow-y-auto"
				>
					<div className="grid grid-cols-1 gap-4 p-4 md:grid-cols-2">
						<Field>
							<FieldLabel required>وليّ الأمر</FieldLabel>
							<Select
								value={ownerId}
								onValueChange={(v) => {
									setOwnerId(v);
									form.setValue("patientId", "", { shouldValidate: true });
								}}
								disabled={isPending}
							>
								<SelectTrigger dir={dir}>
									<SelectValue placeholder="اختر وليّ الأمر" />
								</SelectTrigger>
								<SelectContent
									position="popper"
									dir={dir}
								>
									{owners.map((o) => (
										<SelectItem
											key={o.id}
											value={o.id}
										>
											{o.name}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</Field>

						<Controller
							control={form.control}
							name="patientId"
							render={({ field }) => (
								<Field data-invalid={!!form.formState.errors.patientId}>
									<FieldLabel required>الطفل</FieldLabel>
									<Select
										value={field.value}
										onValueChange={field.onChange}
										disabled={isPending || !ownerId}
									>
										<SelectTrigger dir={dir}>
											<SelectValue
												placeholder={ownerId ? "اختر الطفل" : "اختر وليّ الأمر أولًا"}
											/>
										</SelectTrigger>
										<SelectContent
											position="popper"
											dir={dir}
										>
											{patients.map((p) => (
												<SelectItem
													key={p.id}
													value={p.id}
												>
													{p.name} — {p.code}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
									<FieldError errors={[form.formState.errors.patientId]} />
								</Field>
							)}
						/>

						<Controller
							control={form.control}
							name="branchId"
							render={({ field }) => (
								<Field data-invalid={!!form.formState.errors.branchId}>
									<FieldLabel required>الفرع</FieldLabel>
									<Select
										value={field.value}
										onValueChange={field.onChange}
										disabled={isPending}
									>
										<SelectTrigger dir={dir}>
											<SelectValue placeholder="اختر الفرع" />
										</SelectTrigger>
										<SelectContent
											position="popper"
											dir={dir}
										>
											{branches.map((b) => (
												<SelectItem
													key={b.id}
													value={b.id}
												>
													{b.name}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
									<FieldError errors={[form.formState.errors.branchId]} />
								</Field>
							)}
						/>

						<Controller
							control={form.control}
							name="groomerId"
							render={({ field }) => (
								<Field data-invalid={!!form.formState.errors.groomerId}>
									<FieldLabel required>المُجمِّل</FieldLabel>
									<Select
										value={field.value}
										onValueChange={field.onChange}
										disabled={isPending}
									>
										<SelectTrigger dir={dir}>
											<SelectValue placeholder="اختر المُجمِّل" />
										</SelectTrigger>
										<SelectContent
											position="popper"
											dir={dir}
										>
											{staff.map((s) => (
												<SelectItem
													key={s.id}
													value={s.id}
												>
													{s.user?.name ?? s.id}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
									<FieldError errors={[form.formState.errors.groomerId]} />
								</Field>
							)}
						/>

						<Field data-invalid={!!form.formState.errors.scheduledAt}>
							<FieldLabel required>الموعد</FieldLabel>
							<Input
								type="datetime-local"
								disabled={isPending}
								aria-invalid={!!form.formState.errors.scheduledAt}
								{...form.register("scheduledAt")}
							/>
							<FieldError errors={[form.formState.errors.scheduledAt]} />
						</Field>
					</div>

					<Separator />

					<div className="flex flex-col gap-2 p-4">
						<FieldLabel required>الدورات</FieldLabel>
						{bookable.length === 0 ? (
							<p className="rounded-[4px] bg-muted p-3 text-xs leading-relaxed">
								لا توجد دورات تجميل معرَّفة بعد. عرّفها من{" "}
								<span className="font-medium">
									الإعدادات ← الفروع ← الدورات ← التجميل ← كتالوج التجميل
								</span>
								.
							</p>
						) : (
							<Controller
								control={form.control}
								name="definitionIds"
								render={({ field }) => {
									const selectedIds: string[] = field.value ?? [];
									// المختار يخرج من القائمة بدل أن يُضاف مرّتين
									const remaining = bookable.filter(
										(t) => !selectedIds.includes(t.definition?.id ?? ""),
									);
									return (
										<div className="flex flex-col gap-2">
											<Select
												value=""
												onValueChange={(id) => field.onChange([...selectedIds, id])}
												disabled={isPending || remaining.length === 0}
											>
												<SelectTrigger dir={dir}>
													<SelectValue
														placeholder={
															remaining.length === 0 ? "أُضيفت كل الدورات" : "اختر دورة..."
														}
													/>
												</SelectTrigger>
												<SelectContent
													position="popper"
													dir={dir}
												>
													{remaining.map((t) => (
														<SelectItem
															key={t.definition?.id}
															value={t.definition?.id as string}
														>
															{t.name}
														</SelectItem>
													))}
												</SelectContent>
											</Select>

											{selectedIds.length > 0 && (
												<Table>
													<TableHeader>
														<TableRow>
															<TableHead>الدورة</TableHead>
															<TableHead className="text-center">المدّة</TableHead>
															<TableHead className="text-center">سعر مبدئي</TableHead>
															<TableHead className="w-10" />
														</TableRow>
													</TableHeader>
													<TableBody>
														{selectedIds.map((id) => {
															const t = bookable.find((x) => x.definition?.id === id);
															if (!t?.definition) return null;
															return (
																<TableRow key={id}>
																	<TableCell>
																		<div className="flex items-center gap-2">
																			<span className="truncate">{t.name}</span>
																			{t.effectiveLane === GroomingLane.MEDICAL && (
																				<Badge variant="secondary">طبي</Badge>
																			)}
																		</div>
																	</TableCell>
																	<TableCell className="text-center text-muted-foreground text-sm tabular-nums">
																		{t.definition.baseDurationMin} دقيقة
																	</TableCell>
																	<TableCell className="text-center text-muted-foreground text-sm tabular-nums">
																		{Number(t.definition.basePrice)} ر.س
																	</TableCell>
																	<TableCell className="text-center">
																		<Button
																			type="button"
																			size="icon"
																			variant="ghost"
																			className="h-6 w-6 text-muted-foreground hover:text-destructive"
																			disabled={isPending}
																			onClick={() =>
																				field.onChange(selectedIds.filter((x) => x !== id))
																			}
																		>
																			<IconTrash className="size-3.5" />
																		</Button>
																	</TableCell>
																</TableRow>
															);
														})}
													</TableBody>
												</Table>
											)}

											{/* السعر أعلاه سعر الدورة الأساسي — الرقم النهائي يُحلّ على الخادم من
											    مصفوفة (السلالة × الحجم × نوع الفرو) ثم يظهر على الجلسة */}
											{selectedIds.length > 0 && (
												<p className="text-muted-foreground text-xs">
													الأسعار مبدئية — تُحتسب نهائيًا حسب سلالة الطفل وحجمه ونوع فروه عند
													إنشاء الجلسة.
												</p>
											)}
										</div>
									);
								}}
							/>
						)}
						<FieldError errors={[form.formState.errors.definitionIds]} />

						{(medicalSelected || values.sedationPlanned) && (
							<p className="rounded-[4px] border border-destructive/40 bg-destructive/5 p-3 text-xs leading-relaxed">
								الجلسة الطبية أو المهدّأة تتطلب أمر مدرّب مسجَّلًا قبل بدء العمل — تُنشأ الآن ويُسجَّل
								الأمر من ورقة الجلسة.
							</p>
						)}
					</div>

					<Separator />

					<FormFooter
						continueAdding={continueAdding}
						onContinueAddingChange={setContinueAdding}
						disabled={isPending}
						extra={
							<Controller
								control={form.control}
								name="sedationPlanned"
								render={({ field }) => (
									<Label className="flex cursor-pointer items-center gap-2 font-normal text-muted-foreground">
										<Checkbox
											checked={!!field.value}
											onCheckedChange={(v) => field.onChange(v === true)}
											disabled={isPending}
										/>
										تهدئة مخطَّطة
									</Label>
								)}
							/>
						}
					>
						<Button
							type="button"
							variant="ghost"
							size="sm"
							disabled={isPending}
							onClick={() => {
								form.reset(initialDefaults);
								setOwnerId("");
							}}
						>
							إعادة الضبط
						</Button>
						<DisabledReasonTooltip reason={missingReason}>
							<Button
								type="submit"
								size="sm"
								disabled={isPending || missing.length > 0}
							>
								إنشاء الجلسة
							</Button>
						</DisabledReasonTooltip>
					</FormFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
