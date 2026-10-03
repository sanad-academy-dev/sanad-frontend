import { zodResolver } from "@hookform/resolvers/zod";
import {
	IconAlertOctagon,
	IconBuildingWarehouse,
	IconCheck,
	IconCirclePlus,
	IconMoodSmile,
	IconSitemap,
	IconX,
} from "@tabler/icons-react";
import { useNavigate } from "@tanstack/react-router";
import type { KeyboardEvent, ReactNode } from "react";
import { useState } from "react";
import type { DefaultValues } from "react-hook-form";
import { Controller, useForm } from "react-hook-form";
import { FormFooter } from "@/components/common/form-footer";
import { Button } from "@/components/ui/button";
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
import { useI18n } from "@/hooks/use-i18n";
import { CITIES } from "@/lib/data/cities";
import { cn } from "@/lib/utils";
import {
	type CreateBranchFormInput,
	createBranchSchema,
} from "@sanad/contracts/runtime/server/branches/branches.type";

const BRANCH_ICONS = [
	"🏥",
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
];

const DEFAULT_VALUES: DefaultValues<CreateBranchFormInput> = {
	type: "SUB",
	active: true,
	enableWarehouse: false,
	managerIds: [],
};

const compactInputClassName = "h-8 rounded-lg px-2.5 text-xs";

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
			<span className={cn("text-[11px]", on ? "text-foreground" : "text-muted-foreground")}>
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
		<div className="flex items-start gap-2">
			<span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-muted">
				{icon}
			</span>
			<span className="flex flex-col gap-0.5">
				<span className="text-xs font-bold text-foreground">{title}</span>
				{children}
			</span>
		</div>
	);
}

export function AddBranchPage() {
	const { isRtl: isArabic } = useI18n();
	const navigate = useNavigate();

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
		formState: { errors },
	} = useForm<CreateBranchFormInput>({
		resolver: zodResolver(createBranchSchema),
		defaultValues: DEFAULT_VALUES,
	});

	const onSubmit = async (data: CreateBranchFormInput) => {
		try {
			await createBranch(data);
		} catch {
			return;
		}
		if (saveAndAddMore) {
			reset(DEFAULT_VALUES);
		} else {
			navigate({ to: "/management/settings/branches-teams" });
		}
	};

	const submitOnCtrlEnter = (e: KeyboardEvent<HTMLFormElement>) => {
		if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
			e.preventDefault();
			handleSubmit(onSubmit)();
		}
	};

	return (
		<div className="mx-auto flex w-full max-w-195 flex-col gap-5 px-4 pb-10 pt-10">
			<div className="flex flex-col gap-1.5">
				<p className="text-base font-bold text-foreground">فرع جديد</p>
				<p className="text-xs text-muted-foreground">
					أنشئ فرع جديد لتنظيم فروعك ومتابعة أدائها لحظيًا
				</p>
			</div>

			<form
				onSubmit={handleSubmit(onSubmit)}
				onKeyDown={submitOnCtrlEnter}
				className="flex w-full flex-col gap-7"
			>
				{/* ── البيانات الأساسية ─────────────────────────── */}
				<div className="rounded-[4px] border bg-card px-5">
					{/* الأيقونة والاسم + المعرّف */}
					<div className="flex items-start gap-4 border-b py-4">
						<div className="flex flex-1 flex-col gap-1">
							<Label
								className="text-xs font-semibold"
								htmlFor="name"
							>
								الأيقونة واسم الفرع
							</Label>
							<div className="flex items-start gap-1">
								<Controller
									name="icon"
									control={control}
									render={({ field }) => (
										<Popover
											open={iconPickerOpen}
											onOpenChange={setIconPickerOpen}
										>
											<PopoverTrigger asChild>
												<button
													type="button"
													aria-label="اختر أيقونة الفرع"
													disabled={isPending}
													className="flex h-8 w-9 shrink-0 items-center justify-center rounded-lg bg-muted text-sm hover:bg-muted/70"
												>
													{field.value ?? (
														<IconMoodSmile className="size-4 text-muted-foreground" />
													)}
												</button>
											</PopoverTrigger>
											<PopoverContent
												className="w-auto p-2"
												align="start"
											>
												<div className="grid grid-cols-8 gap-1">
													{BRANCH_ICONS.map((emoji) => (
														<button
															type="button"
															key={emoji}
															onClick={() => {
																field.onChange(emoji);
																setIconPickerOpen(false);
															}}
															className={cn(
																"flex size-7 items-center justify-center rounded-md text-sm hover:bg-muted",
																field.value === emoji && "bg-muted",
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
								<Field
									className="flex-1"
									data-invalid={!!errors.name}
								>
									<Input
										id="name"
										placeholder="مثال: فرع جدة"
										className={compactInputClassName}
										aria-invalid={!!errors.name}
										{...register("name")}
										disabled={isPending}
									/>
									<FieldError errors={[errors.name]} />
								</Field>
							</div>
						</div>

						<div className="flex w-60 flex-col gap-1">
							<Label
								className="text-xs font-semibold"
								htmlFor="branchCode"
							>
								المعرّف{" "}
								<span className="text-[10px] font-normal text-muted-foreground">
									يُستخدم لتمييز الفرع
								</span>
							</Label>
							<Field data-invalid={!!errors.branchCode}>
								<Input
									id="branchCode"
									placeholder="مثال: PR-02"
									className={compactInputClassName}
									aria-invalid={!!errors.branchCode}
									{...register("branchCode")}
									disabled={isPending}
								/>
								<FieldError errors={[errors.branchCode]} />
							</Field>
						</div>
					</div>

					{/* المسؤول */}
					<div className="flex min-h-13 items-center justify-between gap-4 border-b py-3">
						<Label className="shrink-0 text-xs font-semibold">المسؤول</Label>
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
									<Field
										className="w-auto items-end"
										data-invalid={!!errors.managerIds}
									>
										<div className="flex flex-wrap items-center justify-end gap-1.5">
											{selected.map((id) => {
												const user = users.find((u) => u.id === id);
												if (!user) return null;
												return (
													<span
														key={id}
														className="flex items-center gap-1.5 rounded-full border bg-muted/40 py-0.5 pe-2 ps-1 text-[11px]"
													>
														<UserAvatar name={user.name} />
														{user.name}
														<button
															type="button"
															aria-label={`إزالة ${user.name}`}
															disabled={isPending}
															onClick={() => toggleManager(id)}
															className="text-muted-foreground hover:text-foreground"
														>
															<IconX className="size-3" />
														</button>
													</span>
												);
											})}
											<Popover
												open={managerPickerOpen}
												onOpenChange={setManagerPickerOpen}
											>
												<PopoverTrigger asChild>
													<button
														type="button"
														disabled={isPending}
														aria-invalid={!!errors.managerIds}
														className="flex h-7 items-center gap-1.5 rounded-lg border bg-background px-2.5 text-[11px] hover:bg-muted/50 aria-invalid:border-destructive"
													>
														إضافة مسؤول
														<IconCirclePlus className="size-3.5 text-muted-foreground" />
													</button>
												</PopoverTrigger>
												<PopoverContent
													align="start"
													className="w-56 p-1"
												>
													<div className="flex max-h-64 flex-col overflow-y-auto">
														{users.map((user) => (
															<button
																type="button"
																key={user.id}
																onClick={() => toggleManager(user.id)}
																className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-xs hover:bg-muted"
															>
																<UserAvatar name={user.name} />
																<span className="flex-1 text-start">{user.name}</span>
																{selected.includes(user.id) && (
																	<IconCheck className="size-3.5 text-primary" />
																)}
															</button>
														))}
														{users.length === 0 && (
															<p className="px-2 py-1.5 text-[11px] text-muted-foreground">
																لا يوجد مستخدمون
															</p>
														)}
													</div>
												</PopoverContent>
											</Popover>
										</div>
										<FieldError errors={[errors.managerIds]} />
									</Field>
								);
							}}
						/>
					</div>

					{/* البريد الإلكتروني */}
					<div className="flex min-h-13 items-center justify-between border-b py-3">
						<Label
							className="text-xs font-semibold"
							htmlFor="email"
						>
							البريد الإلكتروني
						</Label>
						<Field
							className="w-64"
							data-invalid={!!errors.email}
						>
							<Input
								id="email"
								type="email"
								placeholder="مثال: info@sanad.com"
								className={compactInputClassName}
								aria-invalid={!!errors.email}
								{...register("email")}
								disabled={isPending}
							/>
							<FieldError errors={[errors.email]} />
						</Field>
					</div>

					{/* المدينة */}
					<div className="flex min-h-13 items-center justify-between border-b py-3">
						<Label className="text-xs font-semibold">المدينة</Label>
						<Field
							className="w-44"
							data-invalid={!!errors.city}
						>
							<Controller
								name="city"
								control={control}
								render={({ field }) => (
									<Select
										value={field.value ?? undefined}
										onValueChange={(value) => field.onChange(value)}
										disabled={isPending}
										dir={isArabic ? "rtl" : "ltr"}
									>
										<SelectTrigger
											size="sm"
											aria-invalid={!!errors.city}
											className="h-8 w-full rounded-lg px-2.5 text-xs"
										>
											<SelectValue placeholder="اختر المدينة" />
										</SelectTrigger>
										<SelectContent dir={isArabic ? "rtl" : "ltr"}>
											{CITIES.map((city) => (
												<SelectItem
													key={city.value}
													value={city.value}
												>
													{city.label}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								)}
							/>
							<FieldError errors={[errors.city]} />
						</Field>
					</div>

					{/* العنوان التفصيلي */}
					<div className="flex min-h-13 items-center justify-between py-3">
						<Label
							className="text-xs font-semibold"
							htmlFor="address"
						>
							العنوان التفصيلي
						</Label>
						<Field
							className="w-64"
							data-invalid={!!errors.address}
						>
							<Input
								id="address"
								placeholder="شارع الملك فهد، حي العليا، الرياض"
								className={compactInputClassName}
								aria-invalid={!!errors.address}
								{...register("address")}
								disabled={isPending}
							/>
							<FieldError errors={[errors.address]} />
						</Field>
					</div>
				</div>

				{/* ── إعدادات مستودع الفرع ──────────────────────── */}
				<div className="flex flex-col gap-2.5">
					<div className="flex flex-col gap-1">
						<p className="text-xs font-bold text-foreground">اعدادات مستودع الفرع</p>
						<p className="text-[11px] text-muted-foreground">
							فعّل مستودعًا لهذا الفرع لإدارة الأدوية والمستلزمات والتطعيمات وتتبع المخزون
							والطلبات والتحويلات
						</p>
					</div>
					<Controller
						name="enableWarehouse"
						control={control}
						render={({ field }) => (
							<div className="flex items-center justify-between rounded-lg border bg-card px-5 py-3.5">
								<SettingLabel
									icon={<IconBuildingWarehouse className="size-4" />}
									title="تفعيل إدارة المستودع لهذا الفرع"
								>
									<StatusIndicator on={field.value} />
								</SettingLabel>
								<Switch
									size="sm"
									checked={field.value}
									onCheckedChange={field.onChange}
									disabled={isPending}
									aria-label="تفعيل إدارة المستودع لهذا الفرع"
								/>
							</div>
						)}
					/>
				</div>

				{/* ── تصنيف وحالة الفرع ─────────────────────────── */}
				<div className="flex flex-col gap-2.5">
					<div className="flex flex-col gap-1">
						<p className="text-xs font-bold text-foreground">
							حدد تصنيف وحالة الفرع التي تناسبك
						</p>
						<p className="text-[11px] text-muted-foreground">
							تصنيف الفرع سوف يؤثر علي هيكلة الفروع والمستودع المركزي (الرئيسي) أو يعمل بشكل
							مستقل
						</p>
					</div>
					<div className="rounded-[4px] border bg-card px-5">
						<div className="flex min-h-13 items-center justify-between border-b py-3">
							<SettingLabel
								icon={<IconSitemap className="size-4" />}
								title="تصنيف الفرع"
							>
								<span className="text-[11px] text-muted-foreground">
									حدد دور هذا الفرع وعلاقته بباقي الفروع داخل المنشأة.
								</span>
							</SettingLabel>
							<Controller
								name="type"
								control={control}
								render={({ field }) => (
									<div className="flex items-center gap-1 rounded-[4px] bg-muted/80 p-0.5">
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
													"rounded-lg px-3 py-1.5 text-[11px] font-medium transition-colors",
													field.value === option.value
														? "border bg-background text-foreground shadow-xs"
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

						<div className="flex min-h-13 items-center justify-between py-3">
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
												"h-7 rounded-lg px-3 text-[11px] font-semibold",
												field.value
													? "text-red-600 hover:text-red-600"
													: "text-green-600 hover:text-green-600",
											)}
										>
											{field.value ? "تعطيل" : "تفعيل"}
										</Button>
									</>
								)}
							/>
						</div>
					</div>
				</div>

				{/* ── شريط الإجراءات ────────────────────────────── */}
				<FormFooter
					className="px-5 py-3"
					continueAdding={saveAndAddMore}
					onContinueAddingChange={setSaveAndAddMore}
					disabled={isPending}
				>
					<Button
						type="button"
						variant="outline"
						size="sm"
						disabled={isPending}
						onClick={() => navigate({ to: "/management/settings/branches-teams" })}
						className="h-7 rounded-lg px-3 text-[11px]"
					>
						إلغاء
					</Button>
					<Button
						type="submit"
						size="sm"
						disabled={isPending}
						className="h-7 rounded-lg px-5 text-[11px] font-semibold"
					>
						أضف فرع
					</Button>
				</FormFooter>
			</form>
		</div>
	);
}
