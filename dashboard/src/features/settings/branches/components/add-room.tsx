import { zodResolver } from "@hookform/resolvers/zod";
import { IconCirclePlus, IconInfoCircle, IconUser, IconX } from "@tabler/icons-react";
import type { KeyboardEvent } from "react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { FormFooter } from "@/components/common/form-footer";
import { FormHeader } from "@/components/common/form-header";
import { Button } from "@/components/ui/button";
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
import { Textarea } from "@/components/ui/textarea";
import { useClinicUsers } from "@/features/dashboard/hooks/use-clinic-users";
import {
	StatusDot,
	UserAvatarBadge,
} from "@/features/settings/branches/components/branch-details/shared";
import {
	AVAILABLE_ABILITIES,
	AVAILABLE_DEVICES,
	ROOM_TYPES,
} from "@/features/settings/branches/data/room-options";
import { useCreateRoom } from "@/features/settings/branches/hooks/use-create-room";
import type { AddRoomProps } from "@/features/settings/branches/types/add-room.types";
import { filterOptions } from "@/features/settings/branches/utils/filter-options";
import { useFormProgress } from "@/hooks/use-form-progress";
import { type CreateRoomFormInput, createRoomSchema } from "@sanad/contracts/runtime/server/rooms/rooms.type";

function RequiredBadge() {
	return (
		<span className="rounded bg-destructive/10 px-1 py-0.5 text-xs text-destructive">
			مطلوب
		</span>
	);
}

/** رقاقات اقتراحات تحت حقل الاختيار — النقر يضيف القيمة مباشرة */
function SuggestionChips({
	options,
	selected,
	onAdd,
	disabled,
}: {
	options: string[];
	selected: string[];
	onAdd: (value: string) => void;
	disabled?: boolean;
}) {
	const unselected = options.filter((option) => !selected.includes(option));
	if (!unselected.length) return null;
	return (
		<div className="flex flex-wrap gap-1.5">
			{unselected.map((option) => (
				<button
					type="button"
					key={option}
					disabled={disabled}
					onClick={() => onAdd(option)}
					className="rounded-lg border bg-background px-2 py-1 text-[11px] text-foreground transition-colors hover:bg-muted"
				>
					{option}
				</button>
			))}
		</div>
	);
}

export function AddRoom({ branchId, onBack }: AddRoomProps) {
	const { createRoom, isPending } = useCreateRoom(branchId);
	const { users } = useClinicUsers();

	const {
		register,
		handleSubmit,
		control,
		reset,
		watch,
		formState: { errors },
	} = useForm({
		resolver: zodResolver(createRoomSchema),
		defaultValues: {
			active: true,
			availableDevices: [] as string[],
			abilities: [] as string[],
			managerId: null,
		},
	});

	const [devicesSearch, setDevicesSearch] = useState("");
	const [abilitiesSearch, setAbilitiesSearch] = useState("");
	const [saveAndContinue, setSaveAndContinue] = useState(false);
	const [managerOpen, setManagerOpen] = useState(false);

	const filteredDevices = filterOptions(AVAILABLE_DEVICES, devicesSearch);
	const filteredAbilities = filterOptions(AVAILABLE_ABILITIES, abilitiesSearch);

	const values = watch();
	const formProgress = useFormProgress({ schema: createRoomSchema, values });

	const onSubmit = async (data: CreateRoomFormInput) => {
		try {
			await createRoom({
				name: data.name,
				type: data.type,
				capacity: data.capacity,
				managerId: data.managerId || undefined,
				availableDevices: data.availableDevices?.length ? data.availableDevices : undefined,
				abilities: data.abilities?.length ? data.abilities : undefined,
				notes: data.notes || undefined,
				active: data.active,
			});
		} catch {
			return;
		}

		if (saveAndContinue) {
			reset();
			setDevicesSearch("");
			setAbilitiesSearch("");
		} else {
			onBack();
		}
	};

	const submitOnCtrlEnter = (e: KeyboardEvent<HTMLFormElement>) => {
		if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
			e.preventDefault();
			handleSubmit(onSubmit)();
		}
	};

	return (
		<div className="flex flex-col gap-4">
			<FormHeader
				variant="plain"
				title="إضافة قاعة جديدة"
				progress={formProgress}
				onClose={onBack}
				className="border-b-0 px-0 py-0"
			/>

			<form
				onSubmit={handleSubmit(onSubmit)}
				onKeyDown={submitOnCtrlEnter}
				className="flex flex-col gap-4"
			>
				{/* اسم القاعة */}
				<div className="flex flex-col gap-1.5">
					<div className="flex items-center gap-1.5">
						<Label
							className="text-xs font-bold"
							htmlFor="room-name"
						>
							اسم القاعة
						</Label>
						<RequiredBadge />
					</div>
					<Field data-invalid={!!errors.name}>
						<Input
							id="room-name"
							placeholder="مثال: قاعة الفحص"
							className="text-sm"
							aria-invalid={!!errors.name}
							{...register("name")}
							disabled={isPending}
						/>
						<FieldError errors={[errors.name]} />
					</Field>
				</div>

				<div className="flex items-start justify-between gap-4">
					{/* نوع القاعة */}
					<div className="flex flex-1 flex-col gap-1.5">
						<div className="flex items-center gap-1.5">
							<Label className="text-xs font-bold">نوع القاعة</Label>
							<RequiredBadge />
						</div>
						<Controller
							name="type"
							control={control}
							render={({ field }) => (
								<Field data-invalid={!!errors.type}>
									<Select
										value={field.value}
										onValueChange={field.onChange}
										disabled={isPending}
										dir="rtl"
									>
										<SelectTrigger
											aria-invalid={!!errors.type}
											className="w-full text-right"
										>
											<SelectValue placeholder="اختر..." />
										</SelectTrigger>
										<SelectContent dir="rtl">
											{ROOM_TYPES.map((rt) => (
												<SelectItem
													key={rt.value}
													value={rt.value}
												>
													{rt.label}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
									<FieldError errors={[errors.type]} />
								</Field>
							)}
						/>
					</div>

					{/* السعة */}
					<div className="flex flex-1 flex-col gap-1.5">
						<Label
							className="text-xs font-bold"
							htmlFor="room-capacity"
						>
							السعة
						</Label>
						<Field data-invalid={!!errors.capacity}>
							<Input
								id="room-capacity"
								type="number"
								min={1}
								placeholder="حدد السعة..."
								className="text-sm"
								aria-invalid={!!errors.capacity}
								{...register("capacity", { valueAsNumber: true })}
								disabled={isPending}
							/>
							<FieldError errors={[errors.capacity]} />
						</Field>
					</div>
				</div>

				{/* الأجهزة المتوفرة */}
				<div className="flex flex-col gap-1.5">
					<Label className="text-xs font-bold">الأجهزة المتوفرة</Label>
					<Controller
						name="availableDevices"
						control={control}
						render={({ field }) => (
							<Field data-invalid={!!errors.availableDevices}>
								<Combobox
									multiple
									value={field.value ?? []}
									onValueChange={(v) => {
										field.onChange(v as string[]);
										setDevicesSearch("");
									}}
								>
									<ComboboxChips className="w-full">
										{(field.value ?? []).map((device) => (
											<ComboboxChip
												key={device}
												value={device}
											>
												{device}
											</ComboboxChip>
										))}
										<ComboboxChipsInput
											placeholder="اختر..."
											value={devicesSearch}
											onChange={(e) => setDevicesSearch(e.target.value)}
										/>
									</ComboboxChips>
									<ComboboxContent>
										<ComboboxList>
											{filteredDevices.map((device) => (
												<ComboboxItem
													key={device}
													value={device}
												>
													{device}
												</ComboboxItem>
											))}
											{filteredDevices.length === 0 && (
												<ComboboxEmpty>لا توجد نتائج</ComboboxEmpty>
											)}
										</ComboboxList>
									</ComboboxContent>
								</Combobox>
								<FieldError errors={[errors.availableDevices]} />
								<SuggestionChips
									options={AVAILABLE_DEVICES}
									selected={field.value ?? []}
									onAdd={(value) => field.onChange([...(field.value ?? []), value])}
									disabled={isPending}
								/>
							</Field>
						)}
					/>
				</div>

				{/* القدرات المتاحة */}
				<div className="flex flex-col gap-1.5">
					<Label className="text-xs font-bold">القدرات المتاحة</Label>
					<Controller
						name="abilities"
						control={control}
						render={({ field }) => (
							<Field data-invalid={!!errors.abilities}>
								<Combobox
									multiple
									value={field.value ?? []}
									onValueChange={(v) => {
										field.onChange(v as string[]);
										setAbilitiesSearch("");
									}}
								>
									<ComboboxChips className="w-full">
										{(field.value ?? []).map((ability) => (
											<ComboboxChip
												key={ability}
												value={ability}
											>
												{ability}
											</ComboboxChip>
										))}
										<ComboboxChipsInput
											placeholder="اختر..."
											value={abilitiesSearch}
											onChange={(e) => setAbilitiesSearch(e.target.value)}
										/>
									</ComboboxChips>
									<ComboboxContent>
										<ComboboxList>
											{filteredAbilities.map((ability) => (
												<ComboboxItem
													key={ability}
													value={ability}
												>
													{ability}
												</ComboboxItem>
											))}
											{filteredAbilities.length === 0 && (
												<ComboboxEmpty>لا توجد نتائج</ComboboxEmpty>
											)}
										</ComboboxList>
									</ComboboxContent>
								</Combobox>
								<FieldError errors={[errors.abilities]} />
								<SuggestionChips
									options={AVAILABLE_ABILITIES}
									selected={field.value ?? []}
									onAdd={(value) => field.onChange([...(field.value ?? []), value])}
									disabled={isPending}
								/>
							</Field>
						)}
					/>
				</div>

				{/* ملاحظات إضافية */}
				<div className="flex flex-col gap-1.5">
					<Label
						className="text-xs font-bold"
						htmlFor="room-notes"
					>
						ملاحظات إضافية
					</Label>
					<Textarea
						id="room-notes"
						placeholder="أضف تعليمات خاصة للقاعة..."
						className="min-h-20 resize-none text-sm"
						{...register("notes")}
						disabled={isPending}
					/>
				</div>

				{/* حالة القاعة */}
				<Controller
					name="active"
					control={control}
					render={({ field }) => (
						<div className="flex items-center justify-between rounded-lg border bg-card px-4 py-3">
							<div className="flex items-start gap-2">
								<span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-muted">
									<IconInfoCircle className="size-4" />
								</span>
								<span className="flex flex-col gap-0.5">
									<span className="text-xs font-bold text-foreground">حالة القاعة</span>
									<StatusDot on={field.value ?? true} />
								</span>
							</div>
							<Switch
								checked={field.value ?? true}
								onCheckedChange={field.onChange}
								disabled={isPending}
								aria-label="حالة القاعة"
							/>
						</div>
					)}
				/>

				{/* المسؤول */}
				<Controller
					name="managerId"
					control={control}
					render={({ field }) => {
						const selected = users.find((user) => user.id === field.value);
						return (
							<div className="flex items-center justify-between rounded-lg border bg-card px-4 py-3">
								<div className="flex items-start gap-2">
									<span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-muted">
										<IconUser className="size-4" />
									</span>
									<span className="text-xs font-bold text-foreground">المسؤول</span>
								</div>
								<div className="flex items-center gap-1.5">
									{selected && (
										<span className="flex items-center gap-1.5 rounded-full border bg-muted/40 py-0.5 pe-2 ps-1 text-[11px]">
											<UserAvatarBadge name={selected.name} />
											{selected.name}
											<button
												type="button"
												aria-label={`إزالة ${selected.name}`}
												disabled={isPending}
												onClick={() => field.onChange(null)}
												className="text-muted-foreground hover:text-foreground"
											>
												<IconX className="size-3" />
											</button>
										</span>
									)}
									<Popover
										open={managerOpen}
										onOpenChange={setManagerOpen}
									>
										<PopoverTrigger asChild>
											<button
												type="button"
												disabled={isPending}
												className="flex h-7 items-center gap-1.5 rounded-lg border bg-background px-2.5 text-[11px] hover:bg-muted/50 disabled:opacity-50"
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
														onClick={() => {
															field.onChange(user.id);
															setManagerOpen(false);
														}}
														className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-xs hover:bg-muted"
													>
														<UserAvatarBadge name={user.name} />
														<span className="flex-1 text-start">{user.name}</span>
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
							</div>
						);
					}}
				/>

				{/* شريط الإجراءات */}
				<FormFooter
					className="px-0 pt-3 pb-0"
					continueAdding={saveAndContinue}
					onContinueAddingChange={setSaveAndContinue}
					disabled={isPending}
				>
					<Button
						type="button"
						variant="outline"
						size="sm"
						disabled={isPending}
						onClick={onBack}
					>
						إلغاء
					</Button>
					<Button
						type="submit"
						size="sm"
						disabled={isPending}
					>
						أضف القاعة
					</Button>
				</FormFooter>
			</form>
		</div>
	);
}
