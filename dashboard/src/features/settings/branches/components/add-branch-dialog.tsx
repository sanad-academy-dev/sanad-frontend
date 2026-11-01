import { zodResolver } from "@hookform/resolvers/zod";
import {
	IconAlertOctagon,
	IconBuildingWarehouse,
	IconCheck,
	IconCirclePlus,
	IconLoader2,
	IconMoodSmile,
	IconSitemap,
	IconX,
} from "@tabler/icons-react";
import type { KeyboardEvent, ReactNode } from "react";
import { useEffect, useState } from "react";
import type { DefaultValues } from "react-hook-form";
import { Controller, useForm } from "react-hook-form";

import { FieldLabel } from "@/components/common/field-label";
import { FormFooter } from "@/components/common/form-footer";
import { FormHeader } from "@/components/common/form-header";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription } from "@/components/ui/dialog";
import { Field, FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useClinicUsers } from "@/features/dashboard/hooks/use-clinic-users";
import { useCreateBranch } from "@/features/settings/branches/hooks/use-create-branch";
import { useFormProgress } from "@/hooks/use-form-progress";
import { useI18n } from "@/hooks/use-i18n";
import { CITIES } from "@/lib/data/cities";
import { cn } from "@/lib/utils";
import type { BranchWithManager } from "@/server/branches/branches.type";
import {
	type CreateBranchFormInput,
	createBranchSchema,
} from "@sanad/contracts/runtime/server/branches/branches.type";

const BRANCH_ICONS = [
	"🏥",
	"🏫",
	"🏢",
	"🏬",
	"🐾",
	"🐶",
	"🐱",
	"🐦",
	"🐰",
	"🐴",
	"🦜",
	"🐢",
	"🐹",
	"🦴",
	"🩺",
	"💉",
	"⭐",
	"📍",
	"🌿",
	"🎓",
	"📚",
	"🎨",
	"🔬",
	"🎯",
];

const DEFAULT_VALUES: DefaultValues<CreateBranchFormInput> = {
	type: "SUB",
	active: true,
	enableWarehouse: false,
	managerIds: [],
};

function UserAvatar({ name }: { name: string }) {
	const initials = name
		.split(" ")
		.slice(0, 2)
		.map((w) => w[0])
		.join("")
		.toUpperCase();
	return (
		<span className="flex size-5 shrink-0 items-center justify-center rounded-full border border-primary/20 bg-primary/10 text-[9px] font-semibold text-primary">
			{initials}
		</span>
	);
}

function StatusIndicator({ on }: { on: boolean }) {
	return (
		<span className="flex items-center gap-1.5">
			<span
				className={cn("size-1.5 rounded-full", on ? "bg-green-500" : "bg-muted-foreground/50")}
			/>
			<span
				className={cn(
					"text-[11px]",
					on ? "text-foreground font-medium" : "text-muted-foreground",
				)}
			>
				{on ? "مفعل" : "معطل"}
			</span>
		</span>
	);
}

function SettingLabel({
	icon,
	title,
	children,
}: {
	icon: ReactNode;
	title: string;
	children: ReactNode;
}) {
	return (
		<div className="flex items-start gap-2.5">
			<span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted text-foreground">
				{icon}
			</span>
			<span className="flex flex-col gap-0.5">
				<span className="text-xs font-semibold text-foreground">{title}</span>
				{children}
			</span>
		</div>
	);
}

export interface AddBranchDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onSuccess?: (newBranch: BranchWithManager) => void;
}

export function AddBranchDialog({ open, onOpenChange, onSuccess }: AddBranchDialogProps) {
	const { isRtl: isArabic } = useI18n();
	const { createBranch, isPending } = useCreateBranch();
	const { users } = useClinicUsers();

	const [saveAndAddMore, setSaveAndAddMore] = useState(false);
	const [iconPickerOpen, setIconPickerOpen] = useState(false);
	const [managerPickerOpen, setManagerPickerOpen] = useState(false);

	const {
		register,
		handleSubmit,
		control,
		reset,
		watch,
		setValue,
		formState: { errors },
	} = useForm<CreateBranchFormInput>({
		resolver: zodResolver(createBranchSchema),
		defaultValues: DEFAULT_VALUES,
	});

	const formValues = watch();
	const progress = useFormProgress({
		schema: createBranchSchema,
		values: formValues as Record<string, unknown>,
	});

	// تنظيف الحقول عند فتح النافذة
	useEffect(() => {
		if (open) {
			reset(DEFAULT_VALUES);
			setSaveAndAddMore(false);
			// إذا وُجد مستخدمون يتم تعيين الأول تلقائياً لتسهيل الاستخدام
			if (users.length > 0) {
				setValue("managerIds", [users[0].id], { shouldValidate: true });
			}
		}
	}, [open, reset, users, setValue]);

	const onSubmit = async (data: CreateBranchFormInput) => {
		try {
			const newBranch = await createBranch(data);
			if (onSuccess && newBranch) {
				onSuccess(newBranch);
			}
			if (saveAndAddMore) {
				reset(DEFAULT_VALUES);
				if (users.length > 0) {
					setValue("managerIds", [users[0].id], { shouldValidate: true });
				}
			} else {
				onOpenChange(false);
			}
		} catch {
			// الفشل يظهر في التوست ويبقي النافذة مفتوحة للتصحيح
		}
	};

	const submitOnCtrlEnter = (e: KeyboardEvent<HTMLFormElement>) => {
		if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
			e.preventDefault();
			handleSubmit(onSubmit)();
		}
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent
				showCloseButton={false}
				className="max-h-[90vh] sm:max-w-2xl gap-0 p-0 overflow-hidden flex flex-col rounded-xl"
				dir="rtl"
			>
				<DialogDescription className="sr-only">
					نافذة إضافة فرع جديد لتنظيم الفروع ومتابعة أدائها
				</DialogDescription>

				<FormHeader
					variant="dialog"
					title="إضافة فرع جديد"
					progress={progress}
					onClose={() => onOpenChange(false)}
				/>

				<form
					onSubmit={handleSubmit(onSubmit)}
					onKeyDown={submitOnCtrlEnter}
					className="flex flex-col flex-1 min-h-0 overflow-hidden"
				>
					<div className="flex-1 min-h-0 overflow-y-auto p-5 space-y-4">
						{/* 1. البيانات الأساسية */}
						<div className="rounded-xl border border-border bg-card p-4 space-y-4">
							{/* الصف الأول: المعرّف (يمين) + الأيقونة (وسط) + اسم الفرع (يسار) على نفس السطر أفقياً بدقة */}
							<div className="w-full space-y-2">
								{/* صف التسميات */}
								<div className="flex items-center gap-2.5 w-full">
									{/* عنوان المعرّف */}
									<div className="w-32 sm:w-36 shrink-0">
										<FieldLabel info="المعرّف الكودي الخاص بالفرع (يُولد تلقائياً إن ترك فارغاً)">
											<Label
												htmlFor="branch-code"
												className="text-xs font-semibold flex items-center gap-1.5"
											>
												<span>المعرّف</span>
												<span className="text-[10px] text-muted-foreground font-normal">
													يُولد تلقائياً
												</span>
											</Label>
										</FieldLabel>
									</div>

									{/* فراغ موازن للأيقونة */}
									<div className="w-10 shrink-0" aria-hidden="true" />

									{/* عنوان اسم الفرع */}
									<div className="flex-1 min-w-0">
										<FieldLabel required info="أدخل اسماً واضحاً ومميزاً للفرع">
											<Label
												htmlFor="branch-name"
												className={cn(
													"text-xs font-semibold",
													errors.name && "text-destructive",
												)}
											>
												اسم الفرع
											</Label>
										</FieldLabel>
									</div>
								</div>

								{/* صف الحقول والأيقونة على نفس السطر أفقياً وبنفس الارتفاع */}
								<div className="flex items-center gap-2.5 w-full">
									{/* حقل المعرّف */}
									<div className="w-32 sm:w-36 shrink-0">
										<Input
											id="branch-code"
											placeholder="مثال: BR-01"
											className="w-full h-9 text-xs font-mono text-center sm:text-right bg-muted/30"
											disabled={isPending}
											{...register("branchCode")}
										/>
									</div>

									{/* زر الأيقونة المنبثق */}
									<div className="shrink-0 w-10 flex items-center justify-center">
										<Controller
											name="icon"
											control={control}
											render={({ field }) => (
												<Popover
													modal={false}
													open={iconPickerOpen}
													onOpenChange={setIconPickerOpen}
												>
													<PopoverTrigger asChild>
														<button
															type="button"
															aria-label="اختر أيقونة الفرع"
															disabled={isPending}
															className="size-9 rounded-lg border bg-muted/30 flex items-center justify-center hover:bg-muted text-base transition-colors cursor-pointer"
														>
															{field.value ?? (
																<IconMoodSmile className="size-4 text-muted-foreground" />
															)}
														</button>
													</PopoverTrigger>
													<PopoverContent
														className="w-auto p-2"
														align="start"
														side="bottom"
													>
														<div className="grid grid-cols-6 gap-1 max-h-48 overflow-y-auto">
															{BRANCH_ICONS.map((emoji) => (
																<button
																	type="button"
																	key={emoji}
																	onClick={() => {
																		field.onChange(emoji);
																		setIconPickerOpen(false);
																	}}
																	className={cn(
																		"flex size-8 items-center justify-center rounded-md text-base hover:bg-muted transition-colors cursor-pointer",
																		field.value === emoji && "bg-muted ring-1 ring-primary",
																	)}
																>
																	{emoji}
																</button>
															))}
														</div>
													</PopoverContent>
												</Popover>
											)}
										/>
									</div>

									{/* حقل اسم الفرع */}
									<div className="flex-1 min-w-0">
										<Input
											id="branch-name"
											placeholder="مثال: فرع الرياض الرئيسي"
											className={cn(
												"w-full h-9 text-xs transition-colors",
												errors.name && "border-destructive focus-visible:ring-destructive",
											)}
											disabled={isPending}
											aria-invalid={!!errors.name}
											{...register("name")}
										/>
									</div>
								</div>
								{errors.name && (
									<p className="text-[11px] text-destructive font-medium text-end">
										{errors.name.message}
									</p>
								)}
							</div>

							{/* الصف الثاني: المدينة والعنوان التفصيلي */}
							<div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
								{/* المدينة */}
								<Field data-invalid={!!errors.city} className="space-y-1.5">
									<FieldLabel required info="المدينة التي يقع بها الفرع">
										<Label
											className={cn(
												"text-xs font-semibold",
												errors.city && "text-destructive",
											)}
										>
											المدينة
										</Label>
									</FieldLabel>
									<Controller
										name="city"
										control={control}
										render={({ field }) => (
											<Select
												value={field.value ?? undefined}
												onValueChange={(val) => field.onChange(val)}
												disabled={isPending}
												dir={isArabic ? "rtl" : "ltr"}
											>
												<SelectTrigger
													size="sm"
													aria-invalid={!!errors.city}
													className={cn(
														"h-9 w-full rounded-lg px-2.5 text-xs",
														errors.city && "border-destructive",
													)}
												>
													<SelectValue placeholder="اختر المدينة" />
												</SelectTrigger>
												<SelectContent dir={isArabic ? "rtl" : "ltr"} className="max-h-60">
													{CITIES.map((c) => (
														<SelectItem key={c.value} value={c.value}>
															{c.label}
														</SelectItem>
													))}
												</SelectContent>
											</Select>
										)}
									/>
									<FieldError errors={[errors.city]} />
								</Field>

								{/* العنوان التفصيلي */}
								<Field data-invalid={!!errors.address} className="space-y-1.5">
									<FieldLabel required info="العنوان التفصيلي للفرع (الشارع، الحي، المعلم)">
										<Label
											htmlFor="branch-address"
											className={cn(
												"text-xs font-semibold",
												errors.address && "text-destructive",
											)}
										>
											العنوان التفصيلي
										</Label>
									</FieldLabel>
									<Input
										id="branch-address"
										placeholder="شارع الملك فهد، حي العليا"
										className={cn(
											"h-9 rounded-lg text-xs",
											errors.address && "border-destructive",
										)}
										disabled={isPending}
										aria-invalid={!!errors.address}
										{...register("address")}
									/>
									<FieldError errors={[errors.address]} />
								</Field>
							</div>

							{/* الصف الثالث: البريد الإلكتروني والمسؤول */}
							<div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
								{/* البريد الإلكتروني */}
								<Field data-invalid={!!errors.email} className="space-y-1.5">
									<FieldLabel required info="البريد الإلكتروني الرسمي للتواصل مع الفرع">
										<Label
											htmlFor="branch-email"
											className={cn(
												"text-xs font-semibold",
												errors.email && "text-destructive",
											)}
										>
											البريد الإلكتروني
										</Label>
									</FieldLabel>
									<Input
										id="branch-email"
										type="email"
										placeholder="branch@sanad.com"
										className={cn(
											"h-9 rounded-lg text-xs",
											errors.email && "border-destructive",
										)}
										disabled={isPending}
										aria-invalid={!!errors.email}
										{...register("email")}
									/>
									<FieldError errors={[errors.email]} />
								</Field>

								{/* المسؤول */}
								<Field data-invalid={!!errors.managerIds} className="space-y-1.5">
									<FieldLabel required info="اختر مسؤولاً واحداً على الأقل لإدارة هذا الفرع">
										<Label
											className={cn(
												"text-xs font-semibold",
												errors.managerIds && "text-destructive",
											)}
										>
											المسؤول
										</Label>
									</FieldLabel>
									<Controller
										name="managerIds"
										control={control}
										render={({ field }) => {
											const selected: string[] = field.value ?? [];
											const toggleManager = (id: string) =>
												field.onChange(
													selected.includes(id)
														? selected.filter((v) => v !== id)
														: [...selected, id],
												);
											return (
												<div className="flex flex-wrap items-center gap-1.5 min-h-9 p-1 rounded-lg border border-input bg-background">
													{selected.map((id) => {
														const user = users.find((u) => u.id === id);
														if (!user) return null;
														return (
															<span
																key={id}
																className="flex items-center gap-1.5 rounded-full border bg-muted/40 py-0.5 pe-2 ps-1 text-[11px]"
															>
																<UserAvatar name={user.name} />
																<span className="truncate max-w-28">{user.name}</span>
																<button
																	type="button"
																	aria-label={`إزالة ${user.name}`}
																	disabled={isPending}
																	onClick={() => toggleManager(id)}
																	className="text-muted-foreground hover:text-foreground cursor-pointer"
																>
																	<IconX className="size-3" />
																</button>
															</span>
														);
													})}
													<Popover
														modal={false}
														open={managerPickerOpen}
														onOpenChange={setManagerPickerOpen}
													>
														<PopoverTrigger asChild>
															<button
																type="button"
																disabled={isPending}
																className="flex h-7 items-center gap-1.5 rounded-md border border-dashed border-border/80 bg-muted/30 px-2 text-[11px] hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
															>
																<IconCirclePlus className="size-3.5" />
																<span>إضافة مسؤول</span>
															</button>
														</PopoverTrigger>
														<PopoverContent
															align="start"
															side="bottom"
															className="w-56 p-1"
														>
															<div className="flex max-h-56 flex-col overflow-y-auto">
																{users.map((user) => (
																	<button
																		type="button"
																		key={user.id}
																		onClick={() => toggleManager(user.id)}
																		className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-xs hover:bg-muted cursor-pointer transition-colors"
																	>
																		<UserAvatar name={user.name} />
																		<span className="flex-1 text-start truncate">
																			{user.name}
																		</span>
																		{selected.includes(user.id) && (
																			<IconCheck className="size-3.5 text-primary" />
																		)}
																	</button>
																))}
																{users.length === 0 && (
																	<p className="px-2 py-2 text-[11px] text-muted-foreground text-center">
																		لا يوجد مستخدمون متاحون
																	</p>
																)}
															</div>
														</PopoverContent>
													</Popover>
												</div>
											);
										}}
									/>
									<FieldError errors={[errors.managerIds]} />
								</Field>
							</div>
						</div>

						{/* 2. إعدادات مستودع الفرع */}
						<div className="rounded-xl border border-border bg-card p-3.5">
							<Controller
								name="enableWarehouse"
								control={control}
								render={({ field }) => (
									<div className="flex items-center justify-between gap-3">
										<SettingLabel
											icon={<IconBuildingWarehouse className="size-4" />}
											title="تفعيل مستودع لهذا الفرع"
										>
											<span className="text-[11px] text-muted-foreground">
												لإدارة المستلزمات والأدوية وتتبع المخزون والتحويلات
											</span>
										</SettingLabel>
										<div className="flex items-center gap-2.5 shrink-0">
											<StatusIndicator on={field.value} />
											<Switch
												size="sm"
												checked={field.value}
												onCheckedChange={field.onChange}
												disabled={isPending}
												aria-label="تفعيل مستودع لهذا الفرع"
											/>
										</div>
									</div>
								)}
							/>
						</div>

						{/* 3. تصنيف وحالة الفرع */}
						<div className="rounded-xl border border-border bg-card p-3.5 space-y-3">
							{/* تصنيف الفرع */}
							<div className="flex items-center justify-between gap-3">
								<SettingLabel
									icon={<IconSitemap className="size-4" />}
									title="تصنيف الفرع"
								>
									<span className="text-[11px] text-muted-foreground">
										حدد دور هذا الفرع وعلاقته بباقي الفروع (رئيسي أو فرعي)
									</span>
								</SettingLabel>
								<Controller
									name="type"
									control={control}
									render={({ field }) => (
										<div className="flex items-center gap-1 rounded-lg bg-muted/80 p-0.5 shrink-0">
											{(
												[
													{ value: "PRIMARY", label: "رئيسي" },
													{ value: "SUB", label: "فرعي" },
												] as const
											).map((option) => (
												<button
													type="button"
													key={option.value}
													disabled={isPending}
													onClick={() => field.onChange(option.value)}
													className={cn(
														"rounded-md px-3 py-1 text-xs font-medium transition-colors cursor-pointer",
														field.value === option.value
															? "bg-background text-foreground shadow-2xs font-semibold"
															: "text-muted-foreground hover:text-foreground",
													)}
												>
													{option.label}
												</button>
											))}
										</div>
									)}
								/>
							</div>

							<div className="border-t border-border/60" />

							{/* حالة الفرع */}
							<div className="flex items-center justify-between gap-3">
								<Controller
									name="active"
									control={control}
									render={({ field }) => (
										<>
											<SettingLabel
												icon={<IconAlertOctagon className="size-4" />}
												title="حالة الفرع"
											>
												<StatusIndicator on={field.value} />
											</SettingLabel>
											<Button
												type="button"
												variant="outline"
												size="sm"
												disabled={isPending}
												onClick={() => field.onChange(!field.value)}
												className={cn(
													"h-7 rounded-lg px-3 text-xs font-semibold cursor-pointer",
													field.value
														? "text-red-600 hover:text-red-600 border-red-200 hover:bg-red-50 dark:border-red-900/50 dark:hover:bg-red-950/30"
														: "text-green-600 hover:text-green-600 border-green-200 hover:bg-green-50 dark:border-green-900/50 dark:hover:bg-green-950/30",
												)}
											>
												{field.value ? "تعطيل الفرع" : "تفعيل الفرع"}
											</Button>
										</>
									)}
								/>
							</div>
						</div>
					</div>

					{/* شريط الإجراءات السفلي الثابت */}
					<FormFooter
						className="px-5 py-2.5 bg-background border-t"
						continueAdding={saveAndAddMore}
						onContinueAddingChange={setSaveAndAddMore}
						disabled={isPending}
					>
						<Button
							type="button"
							variant="outline"
							size="sm"
							disabled={isPending}
							onClick={() => onOpenChange(false)}
							className="h-8 rounded-lg px-4 text-xs cursor-pointer"
						>
							إلغاء
						</Button>
						<Button
							type="submit"
							size="sm"
							disabled={isPending || !progress.isComplete}
							className="h-8 rounded-lg px-5 text-xs font-semibold gap-1.5 cursor-pointer"
						>
							{isPending && <IconLoader2 className="size-3.5 animate-spin" />}
							<span>إنشاء الفرع</span>
						</Button>
					</FormFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}

