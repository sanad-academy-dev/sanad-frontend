import type { CreatePatientFormInput } from "@sanad/contracts/runtime/server/patients/patients.type";
import {
	IconCalendar,
	IconCheck,
	IconChevronDown,
	IconChevronUp,
	IconMapPin,
	IconPlus,
	IconSearch,
	IconStar,
	IconUser,
	IconUsers,
	IconX,
} from "@tabler/icons-react";
import { useMemo, useState } from "react";
import type {
	Control,
	FieldErrors,
	UseFormRegister,
	UseFormSetValue,
	UseFormWatch,
} from "react-hook-form";
import { Controller } from "react-hook-form";

import { FieldLabel } from "@/components/common/field-label";
import { Button } from "@/components/ui/button";
import { Field, FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Combobox,
	ComboboxChip,
	ComboboxChips,
	ComboboxChipsInput,
	ComboboxContent,
	ComboboxEmpty,
	ComboboxItem,
	ComboboxList,
} from "@/components/ui/combobox";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
	ALLERGY_CHIPS,
	BLOOD_TYPE_OPTIONS,
	CLASSROOM_OPTIONS,
	FEE_TYPE_OPTIONS,
	HEALTH_CHIPS,
	LEARNING_METHOD_OPTIONS,
	LEVEL_OPTIONS,
	PREFERRED_SHIFT_OPTIONS,
	RELATIONSHIP_OPTIONS,
	TRANSPORT_OPTIONS,
} from "@/features/services/patients/data/patient-form-constants";
import { cn } from "@/lib/utils";

export interface PatientFormContentProps {
	control: Control<CreatePatientFormInput>;
	register: UseFormRegister<CreatePatientFormInput>;
	errors: FieldErrors<CreatePatientFormInput>;
	watch: UseFormWatch<CreatePatientFormInput>;
	setValue: UseFormSetValue<CreatePatientFormInput>;
	isPending?: boolean;
	readOnly?: boolean;
	owners?: Array<{
		id: string;
		name: string;
		phone?: string | null;
		email?: string | null;
		code?: string | null;
	}>;
	ownersLoading?: boolean;
	ownerSelectOpen?: boolean;
	setOwnerSelectOpen?: (open: boolean) => void;
	onAddOwnerClick?: () => void;
	showAdvanced: boolean;
	setShowAdvanced: (show: boolean | ((prev: boolean) => boolean)) => void;
	idPrefix?: string;
}

export function PatientFormContent({
	control,
	register,
	errors,
	watch,
	setValue,
	isPending = false,
	readOnly = false,
	owners = [],
	ownersLoading = false,
	ownerSelectOpen = false,
	setOwnerSelectOpen,
	onAddOwnerClick,
	showAdvanced,
	setShowAdvanced,
	idPrefix = "patient-form",
}: PatientFormContentProps) {
	const values = watch();
	const [ownerSearch, setOwnerSearch] = useState("");
	const [internalOpen, setInternalOpen] = useState(false);
	const comboOpen = setOwnerSelectOpen ? (ownerSelectOpen ?? false) : internalOpen;
	const onOpenChange = setOwnerSelectOpen || setInternalOpen;

	const filteredOwners = useMemo(() => {
		if (!ownerSearch.trim()) return owners;
		const q = ownerSearch.trim().toLowerCase();
		return owners.filter(
			(o) =>
				o.name.toLowerCase().includes(q) ||
				(o.phone && o.phone.toLowerCase().includes(q)) ||
				(o.code && o.code.toLowerCase().includes(q)),
		);
	}, [owners, ownerSearch]);

	const handleChipClick = (field: "allergies" | "healthConditions", chip: string) => {
		const current = watch(field) || "";
		if (chip === "لا يوجد") {
			setValue(field, "لا يوجد", { shouldValidate: true });
			return;
		}
		if (!current.trim() || current === "لا يوجد") {
			setValue(field, chip, { shouldValidate: true });
			return;
		}
		if (current.includes(chip)) return;
		setValue(field, `${current}، ${chip}`, { shouldValidate: true });
	};

	return (
		<>
			{/* ── 1. المعلومات الأساسية ── */}
			<div className="flex flex-col gap-4">
				<h3 className="text-sm font-semibold text-foreground border-b pb-1.5">
					المعلومات الأساسية
				</h3>

				{/* اسم الطفل */}
				<div className="flex flex-col gap-1.5">
					<FieldLabel
						required
						info="اسم الطفل الرباعي أو الثلاثي كما هو مسجل في الهوية"
					>
						<Label
							className="text-sm font-medium"
							htmlFor={`${idPrefix}-name`}
						>
							اسم الطفل
						</Label>
					</FieldLabel>
					<Field data-invalid={!!errors.name}>
						<Input
							id={`${idPrefix}-name`}
							placeholder="مثال: سارة أحمد"
							className="text-sm"
							aria-invalid={!!errors.name}
							disabled={isPending || readOnly}
							{...register("name")}
						/>
						<FieldError errors={[errors.name]} />
					</Field>
				</div>

				{/* تاريخ الميلاد */}
				<div className="flex flex-col gap-1.5">
					<FieldLabel
						required
						info="تاريخ ميلاد الطفل لحساب العمر الدقيق وتحديد الفصل"
					>
						<Label
							className="text-sm font-medium"
							htmlFor={`${idPrefix}-birth-date`}
						>
							تاريخ الميلاد
						</Label>
					</FieldLabel>
					<Field data-invalid={!!errors.birthDate}>
						<div className="relative">
							<Input
								id={`${idPrefix}-birth-date`}
								type="date"
								className="text-sm pe-9 text-right"
								aria-invalid={!!errors.birthDate}
								disabled={isPending || readOnly}
								{...register("birthDate")}
							/>
							<IconCalendar className="absolute end-2.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
						</div>
						<FieldError errors={[errors.birthDate]} />
					</Field>
				</div>

				{/* الجنس */}
				<div className="flex flex-col gap-1.5">
					<FieldLabel required>
						<Label className="text-sm font-medium">الجنس</Label>
					</FieldLabel>
					<Controller
						name="gender"
						control={control}
						render={({ field }) => (
							<Field data-invalid={!!errors.gender}>
								<div className="grid grid-cols-2 gap-2">
									<button
										type="button"
										disabled={isPending || readOnly}
										onClick={() => field.onChange("MALE")}
										className={cn(
											"flex items-center justify-center gap-2 py-2 px-3 rounded-md border text-sm font-medium transition-all cursor-pointer",
											field.value === "MALE"
												? "bg-primary text-primary-foreground border-primary shadow-xs font-semibold"
												: "border-input bg-background hover:bg-muted/50 text-foreground",
										)}
									>
										ذكر
									</button>
									<button
										type="button"
										disabled={isPending || readOnly}
										onClick={() => field.onChange("FEMALE")}
										className={cn(
											"flex items-center justify-center gap-2 py-2 px-3 rounded-md border text-sm font-medium transition-all cursor-pointer",
											field.value === "FEMALE"
												? "bg-primary text-primary-foreground border-primary shadow-xs font-semibold"
												: "border-input bg-background hover:bg-muted/50 text-foreground",
										)}
									>
										أنثى
									</button>
								</div>
								<FieldError errors={[errors.gender]} />
							</Field>
						)}
					/>
				</div>

				{/* رقم الهوية / الإقامة */}
				<div className="flex flex-col gap-1.5">
					<FieldLabel info="رقم الهوية الوطنية أو الإقامة (10 أرقام)">
						<Label
							className="text-sm font-medium"
							htmlFor={`${idPrefix}-national-id`}
						>
							رقم الهوية / الإقامة
						</Label>
					</FieldLabel>
					<Input
						id={`${idPrefix}-national-id`}
						placeholder="1xxxxxxxxx"
						className="text-sm font-mono text-right"
						disabled={isPending || readOnly}
						{...register("nationalId")}
					/>
				</div>

				{/* الفصل */}
				<div className="flex flex-col gap-1.5">
					<FieldLabel
						required
						info="المجموعة أو الصف الدراسي المسجل به الطفل"
					>
						<Label className="text-sm font-medium">الفصل</Label>
					</FieldLabel>
					<Controller
						name="classroom"
						control={control}
						render={({ field }) => (
							<Field data-invalid={!!errors.classroom}>
								<Select
									value={field.value || "النجوم"}
									onValueChange={field.onChange}
									disabled={isPending || readOnly}
									dir="rtl"
								>
									<SelectTrigger className="w-full text-right text-sm">
										<div className="flex items-center gap-2">
											<IconStar className="size-3.5 text-amber-500 fill-amber-500" />
											<SelectValue placeholder="اختر الفصل..." />
										</div>
									</SelectTrigger>
									<SelectContent dir="rtl">
										{CLASSROOM_OPTIONS.map((cls) => (
											<SelectItem
												key={cls}
												value={cls}
											>
												{cls}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
								<FieldError errors={[errors.classroom]} />
							</Field>
						)}
					/>
				</div>

				{/* المستوى */}
				<div className="flex flex-col gap-1.5">
					<FieldLabel info="المستوى الأكاديمي أو التعليمي للطالب">
						<Label className="text-sm font-medium">المستوى</Label>
					</FieldLabel>
					<Controller
						name="level"
						control={control}
						render={({ field }) => (
							<Field data-invalid={!!errors.level}>
								<Select
									value={field.value || "مبتدئ"}
									onValueChange={field.onChange}
									disabled={isPending || readOnly}
									dir="rtl"
								>
									<SelectTrigger className="w-full text-right text-sm">
										<SelectValue placeholder="اختر المستوى..." />
									</SelectTrigger>
									<SelectContent dir="rtl">
										{LEVEL_OPTIONS.map((lvl) => (
											<SelectItem key={lvl} value={lvl}>
												{lvl}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
								<FieldError errors={[errors.level]} />
							</Field>
						)}
					/>
				</div>

				{/* طريقة التعلم */}
				<div className="flex flex-col gap-1.5">
					<FieldLabel info="نمط الحضور وتلقي الدروس المفضل للطالب">
						<Label className="text-sm font-medium">طريقة التعلم</Label>
					</FieldLabel>
					<Controller
						name="learningMethod"
						control={control}
						render={({ field }) => (
							<Field data-invalid={!!errors.learningMethod}>
								<Select
									value={field.value || "حضوري"}
									onValueChange={field.onChange}
									disabled={isPending || readOnly}
									dir="rtl"
								>
									<SelectTrigger className="w-full text-right text-sm">
										<SelectValue placeholder="اختر طريقة التعلم..." />
									</SelectTrigger>
									<SelectContent dir="rtl">
										{LEARNING_METHOD_OPTIONS.map((method) => (
											<SelectItem key={method} value={method}>
												{method}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
								<FieldError errors={[errors.learningMethod]} />
							</Field>
						)}
					/>
				</div>

				{/* المناوبة المفضلة */}
				<div className="flex flex-col gap-1.5">
					<FieldLabel info="الفترة المفضلة لحضور الحصص والأنشطة">
						<Label className="text-sm font-medium">المناوبة المفضلة</Label>
					</FieldLabel>
					<Controller
						name="preferredShift"
						control={control}
						render={({ field }) => (
							<Field data-invalid={!!errors.preferredShift}>
								<Select
									value={field.value || "صباحي"}
									onValueChange={field.onChange}
									disabled={isPending || readOnly}
									dir="rtl"
								>
									<SelectTrigger className="w-full text-right text-sm">
										<SelectValue placeholder="اختر المناوبة المفضلة..." />
									</SelectTrigger>
									<SelectContent dir="rtl">
										{PREFERRED_SHIFT_OPTIONS.map((shift) => (
											<SelectItem key={shift} value={shift}>
												{shift}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
								<FieldError errors={[errors.preferredShift]} />
							</Field>
						)}
					/>
				</div>

				{/* العنوان */}
				<div className="flex flex-col gap-1.5">
					<FieldLabel info="عنوان السكن أو الحي الخاص بالطالب">
						<Label
							className="text-sm font-medium"
							htmlFor={`${idPrefix}-address`}
						>
							العنوان
						</Label>
					</FieldLabel>
					<div className="relative">
						<Input
							id={`${idPrefix}-address`}
							placeholder="مثال: سيدي سالم، كفر الشيخ، مصر"
							className="text-sm pe-9 text-right"
							disabled={isPending || readOnly}
							{...register("address")}
						/>
						<IconMapPin className="absolute end-2.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
					</div>
				</div>

				{/* تفعيل المصروفات */}
				<div className="flex items-center justify-between rounded-lg border p-3 bg-muted/10">
					<div className="flex flex-col gap-0.5">
						<div className="flex items-center gap-2">
							<Label className="text-sm font-medium">تفعيل المصروفات</Label>
							<span
								className={cn(
									"inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium border",
									values.pocketMoneyEnabled !== false
										? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300"
										: "bg-muted text-muted-foreground border-border",
								)}
							>
								{values.pocketMoneyEnabled !== false ? "مفعّل" : "معطّل"}
							</span>
						</div>
						<span className="text-xs text-muted-foreground">
							السماح للطفل باستخدام رصيد المصروفات في كافتيريا ومقصف الأكاديمية
						</span>
					</div>
					<Controller
						name="pocketMoneyEnabled"
						control={control}
						render={({ field }) => (
							<Switch
								checked={field.value !== false}
								onCheckedChange={field.onChange}
								disabled={isPending || readOnly}
							/>
						)}
					/>
				</div>
			</div>

			{/* ── 2. بيانات ولي الأمر ── */}
			<div className="flex flex-col gap-4">
				<h3 className="text-sm font-semibold text-foreground border-b pb-1.5">
					بيانات ولي الأمر
				</h3>

				{/* ولي الأمر */}
				<div className="flex flex-col gap-1.5">
					<FieldLabel
						required
						info="يمكنك اختيار ولي أمر واحد أو أكثر لمتابعة الطفل والتواصل معه"
					>
						<Label className="text-sm font-medium">أولياء الأمور</Label>
					</FieldLabel>

					<Controller
						name="ownerIds"
						control={control}
						render={({ field }) => {
							const rawVal = field.value;
							const currentOwnerId = watch("ownerId");
							const selectedIds: string[] = Array.isArray(rawVal)
								? rawVal
								: typeof rawVal === "string" && rawVal
									? [rawVal]
									: currentOwnerId
										? [currentOwnerId]
										: [];

							const handleValueChange = (val: string | string[] | null) => {
								const nextIds: string[] = Array.isArray(val)
									? val
									: typeof val === "string" && val
										? [val]
										: [];

								const curRels = {
									...((watch("guardianRelationships") as Record<string, string> | undefined) || {}),
								};

								nextIds.forEach((id, idx) => {
									if (!curRels[id]) {
										curRels[id] = idx === 0 ? (watch("guardianRelationship") || "FATHER") : "MOTHER";
									}
								});

								Object.keys(curRels).forEach((id) => {
									if (!nextIds.includes(id)) {
										delete curRels[id];
									}
								});

								field.onChange(nextIds);
								setValue("ownerIds", nextIds, { shouldValidate: true, shouldDirty: true });
								setValue("ownerId", nextIds[0] ?? "", { shouldValidate: true, shouldDirty: true });
								setValue("guardianRelationships", curRels, { shouldValidate: true, shouldDirty: true });

								const primary = owners.find((o) => o.id === nextIds[0]);
								if (primary) {
									setValue("guardianName", primary.name, { shouldValidate: true, shouldDirty: true });
									if (primary.phone) {
										setValue("guardianPhone", primary.phone, { shouldValidate: true, shouldDirty: true });
									}
									if (primary.email) {
										setValue("guardianEmail", primary.email, { shouldValidate: true, shouldDirty: true });
									}
								} else if (nextIds.length === 0) {
									setValue("guardianName", "", { shouldValidate: true, shouldDirty: true });
									setValue("guardianPhone", "", { shouldValidate: true, shouldDirty: true });
									setValue("guardianEmail", "", { shouldValidate: true, shouldDirty: true });
								}
							};

							return (
								<Field
									data-invalid={
										!!errors.ownerIds || !!errors.ownerId || !!errors.guardianName
									}
								>
									<Combobox
										multiple
										open={comboOpen}
										onOpenChange={onOpenChange}
										value={selectedIds}
										onValueChange={handleValueChange}
									>
										<ComboboxChips
											aria-invalid={
												!!errors.ownerIds || !!errors.ownerId || !!errors.guardianName
											}
										>
											{selectedIds.map((id) => {
												const owner = owners.find((o) => o.id === id);
												return owner ? (
													<ComboboxChip
														key={id}
														value={id}
														showRemove={!readOnly}
													>
														{owner.name}
													</ComboboxChip>
												) : null;
											})}
											<ComboboxChipsInput
												placeholder={selectedIds.length ? "" : "ابحث عن ولي أمر..."}
												value={ownerSearch}
												onChange={(e) => setOwnerSearch(e.target.value)}
												disabled={isPending || readOnly || ownersLoading}
											/>
										</ComboboxChips>

										<ComboboxContent dir="rtl">
											{onAddOwnerClick && !readOnly && (
												<div className="flex w-full justify-start p-1.5 border-b border-border/40">
													<Button
														type="button"
														variant="ghost"
														size="sm"
														className="h-7 w-full gap-1 text-xs"
														disabled={isPending}
														onClick={() => {
															onOpenChange(false);
															onAddOwnerClick();
														}}
													>
														<IconPlus className="size-3.5" />
														إضافة ولي أمر جديد
													</Button>
												</div>
											)}
											<ComboboxList>
												{filteredOwners.length === 0 ? (
													<ComboboxEmpty>لا توجد نتائج</ComboboxEmpty>
												) : (
													filteredOwners.map((owner) => (
														<ComboboxItem
															key={owner.id}
															value={owner.id}
														>
															<span>{owner.name}</span>
															{(owner.phone || owner.code) && (
																<span
																	className="text-muted-foreground text-xs ms-auto font-mono"
																	dir="ltr"
																>
																	{owner.phone || owner.code}
																</span>
															)}
														</ComboboxItem>
													))
												)}
											</ComboboxList>
										</ComboboxContent>
									</Combobox>

									<FieldError
										errors={[
											errors.ownerIds,
											errors.ownerId,
											errors.guardianName,
										]}
									/>
								</Field>
							);
						}}
					/>
				</div>

				{/* صلة القرابة لكل ولي أمر مختار */}
				{(() => {
					const rawVal = watch("ownerIds");
					const curOwnerId = watch("ownerId");
					const sIds: string[] = Array.isArray(rawVal)
						? rawVal
						: typeof rawVal === "string" && rawVal
							? [rawVal]
							: curOwnerId
								? [curOwnerId]
								: [];
					const selOwners = sIds
						.map((id) => owners.find((o) => o.id === id))
						.filter(Boolean) as typeof owners;
					const relMap =
						(watch("guardianRelationships") as Record<string, string> | undefined) || {};

					if (selOwners.length > 0) {
						return (
							<div className="flex flex-col gap-2 rounded-xl border border-border/80 bg-muted/20 p-3">
								<span className="text-xs font-semibold text-foreground flex items-center gap-1.5">
									<IconUsers className="size-4 text-primary" />
									صلة القرابة لكل ولي أمر:
								</span>
								<div className="flex flex-col gap-2">
									{selOwners.map((owner, idx) => {
										const currentRel =
											relMap[owner.id] ||
											(idx === 0 ? watch("guardianRelationship") : "FATHER") ||
											"FATHER";
										return (
											<div
												key={owner.id}
												className="flex items-center justify-between gap-3 p-2 rounded-lg bg-card border border-border/70 flex-wrap sm:flex-nowrap"
											>
												<div className="flex items-center gap-2 min-w-0">
													<div className="size-7 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs shrink-0">
														{idx + 1}
													</div>
													<div className="flex flex-col min-w-0">
														<span className="text-xs font-semibold text-foreground truncate">
															{owner.name}
														</span>
														{owner.phone && (
															<span
																className="text-[11px] text-muted-foreground font-mono"
																dir="ltr"
															>
																{owner.phone}
															</span>
														)}
													</div>
												</div>

												<div className="flex items-center gap-2 shrink-0">
													<span className="text-xs text-muted-foreground">
														صلة القرابة:
													</span>
													<Select
														value={currentRel}
														onValueChange={(val) => {
															const updated = {
																...((watch("guardianRelationships") as Record<string, string> | undefined) || {}),
																[owner.id]: val,
															};
															setValue("guardianRelationships", updated, {
																shouldValidate: true,
																shouldDirty: true,
															});
															if (idx === 0) {
																setValue("guardianRelationship", val, {
																	shouldValidate: true,
																	shouldDirty: true,
																});
															}
														}}
														disabled={isPending || readOnly}
														dir="rtl"
													>
														<SelectTrigger className="h-8 w-32 text-xs">
															<SelectValue placeholder="اختر..." />
														</SelectTrigger>
														<SelectContent dir="rtl">
															{RELATIONSHIP_OPTIONS.map((opt) => (
																<SelectItem
																	key={opt.value}
																	value={opt.value}
																	className="text-xs"
																>
																	{opt.label}
																</SelectItem>
															))}
														</SelectContent>
													</Select>
												</div>
											</div>
										);
									})}
								</div>
							</div>
						);
					}

					return (
						<div className="flex flex-col gap-1.5">
							<FieldLabel>
								<Label className="text-sm font-medium">صلة القرابة</Label>
							</FieldLabel>
							<Controller
								name="guardianRelationship"
								control={control}
								render={({ field }) => (
									<Select
										value={field.value || "FATHER"}
										onValueChange={field.onChange}
										disabled={isPending || readOnly}
										dir="rtl"
									>
										<SelectTrigger className="w-full text-right text-sm">
											<SelectValue placeholder="اختر..." />
										</SelectTrigger>
										<SelectContent dir="rtl">
											{RELATIONSHIP_OPTIONS.map((opt) => (
												<SelectItem
													key={opt.value}
													value={opt.value}
												>
													{opt.label}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								)}
							/>
						</div>
					);
				})()}
			</div>

			{/* ── 3. معلومات طبية ── */}
			<div className="flex flex-col gap-4">
				<h3 className="text-sm font-semibold text-foreground border-b pb-1.5">معلومات طبية</h3>

				{/* فصيلة الدم */}
				<div className="flex flex-col gap-1.5">
					<FieldLabel>
						<Label className="text-sm font-medium">فصيلة الدم</Label>
					</FieldLabel>
					<Controller
						name="bloodType"
						control={control}
						render={({ field }) => (
							<Select
								value={field.value || "A+"}
								onValueChange={field.onChange}
								dir="rtl"
								disabled={isPending || readOnly}
							>
								<SelectTrigger className="w-full text-right text-sm">
									<SelectValue placeholder="اختر فصيلة الدم..." />
								</SelectTrigger>
								<SelectContent dir="rtl">
									{BLOOD_TYPE_OPTIONS.map((bt) => (
										<SelectItem
											key={bt}
											value={bt}
										>
											{bt}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						)}
					/>
				</div>

				{/* الحالة النمائية */}
				<div className="flex flex-col gap-1.5">
					<FieldLabel info="تقييم الحالة النمائية والتطور السلوكي والحركي">
						<Label className="text-sm font-medium">الحالة النمائية</Label>
					</FieldLabel>
					<Controller
						name="developmentStatus"
						control={control}
						render={({ field }) => (
							<Select
								value={field.value || "NORMAL"}
								onValueChange={field.onChange}
								dir="rtl"
								disabled={isPending || readOnly}
							>
								<SelectTrigger className="w-full text-right text-sm">
									<SelectValue placeholder="اختر الحالة النمائية..." />
								</SelectTrigger>
								<SelectContent dir="rtl">
									<SelectItem value="NORMAL">طبيعي</SelectItem>
									<SelectItem value="ADVANCED">متقدم</SelectItem>
									<SelectItem value="NEEDS_FOLLOW_UP">يحتاج متابعة</SelectItem>
								</SelectContent>
							</Select>
						)}
					/>
				</div>

				{/* الحساسيات */}
				<div className="flex flex-col gap-1.5">
					<FieldLabel info="أي أطعمة أو أدوية تسبب حساسية للطفل">
						<Label className="text-sm font-medium">الحساسيات</Label>
					</FieldLabel>
					<Textarea
						rows={2}
						placeholder="أي حساسيات معروفة..."
						className="text-sm resize-none"
						disabled={isPending || readOnly}
						{...register("allergies")}
					/>
					{/* رقاقات سريعة */}
					<div className="flex flex-wrap items-center gap-1.5 pt-1">
						{ALLERGY_CHIPS.map((chip) => (
							<button
								key={chip}
								type="button"
								disabled={isPending || readOnly}
								onClick={() => handleChipClick("allergies", chip)}
								className="rounded-md border border-dashed border-border px-2 py-0.5 text-xs text-muted-foreground hover:bg-muted hover:text-foreground transition-colors disabled:opacity-50 cursor-pointer"
							>
								{chip}
							</button>
						))}
					</div>
				</div>

				{/* حالات صحية */}
				<div className="flex flex-col gap-1.5">
					<FieldLabel info="أي أمراض مزمنة أو رعاية خاصة تتطلب انتباه المعلمات">
						<Label className="text-sm font-medium">حالات صحية</Label>
					</FieldLabel>
					<Textarea
						rows={2}
						placeholder="أي حالات صحية تتطلب اهتمام خاص..."
						className="text-sm resize-none"
						disabled={isPending || readOnly}
						{...register("healthConditions")}
					/>
					{/* رقاقات سريعة */}
					<div className="flex flex-wrap items-center gap-1.5 pt-1">
						{HEALTH_CHIPS.map((chip) => (
							<button
								key={chip}
								type="button"
								disabled={isPending || readOnly}
								onClick={() => handleChipClick("healthConditions", chip)}
								className="rounded-md border border-dashed border-border px-2 py-0.5 text-xs text-muted-foreground hover:bg-muted hover:text-foreground transition-colors disabled:opacity-50 cursor-pointer"
							>
								{chip}
							</button>
						))}
					</div>
				</div>

				{/* زر طي/بسط البيانات الإضافية والخدمات */}
				<button
					type="button"
					onClick={() => setShowAdvanced((v) => !v)}
					className="flex w-full items-center justify-center gap-1.5 rounded-md border border-dashed border-border py-2 text-xs font-medium text-muted-foreground hover:bg-muted/50 hover:text-foreground transition-colors mt-1 cursor-pointer"
				>
					{showAdvanced ? (
						<>
							<IconChevronUp className="size-4" />
							إخفاء البيانات الإضافية والخدمات
						</>
					) : (
						<>
							<IconChevronDown className="size-4" />
							إظهار البيانات الإضافية والخدمات
						</>
					)}
				</button>
			</div>

			{/* ── 4. بيانات إضافية وخدمات (محتوى التوجيل) ── */}
			{showAdvanced && (
				<div className="flex flex-col gap-4 rounded-lg bg-muted/15 p-3 border">
					<h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
						البيانات الإضافية والخدمات
					</h4>

					{/* وسيلة النقل */}
					<div className="flex flex-col gap-1.5">
						<FieldLabel>
							<Label className="text-sm font-medium">وسيلة النقل</Label>
						</FieldLabel>
						<Controller
							name="transportation"
							control={control}
							render={({ field }) => (
								<Select
									value={field.value || ""}
									onValueChange={field.onChange}
									dir="rtl"
									disabled={isPending || readOnly}
								>
									<SelectTrigger className="w-full text-right text-sm">
										<SelectValue placeholder="اختر..." />
									</SelectTrigger>
									<SelectContent dir="rtl">
										{TRANSPORT_OPTIONS.map((opt) => (
											<SelectItem
												key={opt}
												value={opt}
											>
												{opt}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							)}
						/>
					</div>

					{/* نوع الرسوم */}
					<div className="flex flex-col gap-1.5">
						<FieldLabel info="جدول خطة تسديد الرسوم والاشتراكات">
							<Label className="text-sm font-medium">نوع الرسوم</Label>
						</FieldLabel>
						<Controller
							name="feeType"
							control={control}
							render={({ field }) => (
								<Select
									value={field.value || ""}
									onValueChange={field.onChange}
									dir="rtl"
									disabled={isPending || readOnly}
								>
									<SelectTrigger className="w-full text-right text-sm">
										<SelectValue placeholder="اختر..." />
									</SelectTrigger>
									<SelectContent dir="rtl">
										{FEE_TYPE_OPTIONS.map((opt) => (
											<SelectItem
												key={opt}
												value={opt}
											>
												{opt}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							)}
						/>
					</div>

					{/* الحضانة السابقة */}
					<div className="flex flex-col gap-1.5">
						<FieldLabel>
							<Label
								className="text-sm font-medium"
								htmlFor={`${idPrefix}-previous-nursery`}
							>
								الحضانة السابقة
							</Label>
						</FieldLabel>
						<Input
							id={`${idPrefix}-previous-nursery`}
							placeholder="اسم الحضانة السابقة إن وجدت"
							className="text-sm"
							disabled={isPending || readOnly}
							{...register("previousNursery")}
						/>
					</div>

					{/* ملاحظات */}
					<div className="flex flex-col gap-1.5">
						<FieldLabel>
							<Label
								className="text-sm font-medium"
								htmlFor={`${idPrefix}-notes`}
							>
								ملاحظات
							</Label>
						</FieldLabel>
						<Textarea
							id={`${idPrefix}-notes`}
							rows={2}
							placeholder="ملاحظات إضافية..."
							className="text-sm resize-none"
							disabled={isPending || readOnly}
							{...register("notes")}
						/>
					</div>
				</div>
			)}
		</>
	);
}
