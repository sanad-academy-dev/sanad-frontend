import { zodResolver } from "@hookform/resolvers/zod";
import { IconTruck } from "@tabler/icons-react";
import { useEffect } from "react";
import { Controller, type Resolver, type SubmitHandler, useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
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
import { useMobileRequestMutations } from "@/features/mobile-clinics/hooks/use-mobile-requests";
import {
	useEligibleStaff,
	useMobileUnits,
} from "@/features/mobile-clinics/hooks/use-mobile-units";
import { useBranches } from "@/features/settings/branches/hooks/use-branches";
import type { MobileRequestResponse } from "@/server/mobile-clinics/mobile-requests/mobile-requests.dao";
import {
	type ConvertRequestFormInput,
	convertRequestSchema,
} from "@sanad/contracts/runtime/server/mobile-clinics/mobile-requests/mobile-requests.type";

/** «بلا إسناد» ليس قيمة فارغة: Radix لا يقبل SelectItem بقيمة "". */
const NO_UNIT = "__none__";

/** الموعد المقترح: تاريخ الطلب المفضّل عند التاسعة صباحًا، قابل للتعديل بحرّية. */
const suggestedStart = (preferredDate: Date | null): string => {
	const base = preferredDate ? new Date(preferredDate) : new Date();
	base.setHours(9, 0, 0, 0);
	const pad = (n: number) => String(n).padStart(2, "0");
	return `${base.getFullYear()}-${pad(base.getMonth() + 1)}-${pad(base.getDate())}T${pad(base.getHours())}:${pad(base.getMinutes())}`;
};

/**
 * [MC7.4] تحويل طلب عام إلى زيارة متنقلة.
 *
 * يتبع اصطلاح نماذج المستودع: مخطّط Zod من `mobile-requests.type.ts`، و`zodResolver`،
 * وكل حقل ملفوف بـ`Field` مع `FieldError` — لا حالة يدوية ولا تحقّق مبعثر في المكوّن.
 */
export function ConvertRequestDialog({
	request,
	onClose,
}: {
	request: MobileRequestResponse | null;
	onClose: () => void;
}) {
	const { branches } = useBranches();
	const { units } = useMobileUnits({ scope: "active" });
	const { staff: eligibleStaff } = useEligibleStaff(undefined, Boolean(request));
	const { convert, isMutating } = useMobileRequestMutations();

	const {
		register,
		handleSubmit,
		control,
		reset,
		formState: { errors, isValid },
	} = useForm<ConvertRequestFormInput>({
		resolver: zodResolver(convertRequestSchema) as Resolver<ConvertRequestFormInput>,
		mode: "onChange",
		defaultValues: { durationMinutes: 30, mobileUnitId: undefined },
	});

	useEffect(() => {
		if (!request) return;
		reset({
			branchId: branches[0]?.id ?? "",
			staffId: "",
			startsAt: suggestedStart(request.preferredDate),
			durationMinutes: 30,
			mobileUnitId: undefined,
		});
	}, [request, branches, reset]);

	const onSubmit: SubmitHandler<ConvertRequestFormInput> = async (data) => {
		if (!request) return;
		await convert({
			id: request.id,
			branchId: data.branchId,
			staffId: data.staffId,
			startsAt: new Date(data.startsAt).toISOString(),
			durationMinutes: data.durationMinutes,
			mobileUnitId: data.mobileUnitId,
		});
		onClose();
	};

	// التحويل يُنشئ سجلّ طفل، والطفل يلزمه نوع — فالطلب بلا نوع لا يُحوَّل قبل استكماله
	const missingAnimalType = request !== null && request.animalType === null;

	return (
		<Dialog
			open={Boolean(request)}
			onOpenChange={(open) => {
				if (!open) onClose();
			}}
		>
			{/* dir صريح: محتوى Radix يُنقَل خارج شجرة RTL فلا يرثه — نفس نمط payment-modal */}
			<DialogContent
				className="max-h-[85vh] overflow-y-auto sm:max-w-[460px]"
				dir="rtl"
			>
				<DialogHeader>
					<DialogTitle className="text-sm font-semibold">
						تحويل الطلب إلى زيارة متنقلة
					</DialogTitle>
				</DialogHeader>

				{missingAnimalType ? (
					<p className="text-sm text-destructive">
						الطلب بلا نوع طفل، والتحويل يُنشئ سجلّ طفل يحتاجه. تواصل مع وليّ الأمر ثم عدّل الطلب
						قبل التحويل.
					</p>
				) : (
					<form
						id="convert-request-form"
						onSubmit={handleSubmit(onSubmit)}
						className="flex flex-col gap-4"
					>
						<Controller
							name="branchId"
							control={control}
							render={({ field }) => (
								<div className="flex flex-col gap-1.5">
									<Label className="text-sm font-medium">الفرع</Label>
									<Field data-invalid={!!errors.branchId}>
										<Select
											dir="rtl"
											value={field.value || undefined}
											onValueChange={field.onChange}
											disabled={isMutating}
										>
											<SelectTrigger
												className="w-full text-sm"
												aria-invalid={!!errors.branchId}
											>
												<SelectValue placeholder="اختر الفرع" />
											</SelectTrigger>
											<SelectContent position="popper">
												{branches.map((branch) => (
													<SelectItem
														key={branch.id}
														value={branch.id}
													>
														{branch.name}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
										<FieldError errors={[errors.branchId]} />
									</Field>
								</div>
							)}
						/>

						<Controller
							name="staffId"
							control={control}
							render={({ field }) => (
								<div className="flex flex-col gap-1.5">
									<Label className="text-sm font-medium">المدرّب / الفنّي</Label>
									<Field data-invalid={!!errors.staffId}>
										<Select
											dir="rtl"
											value={field.value || undefined}
											onValueChange={field.onChange}
											disabled={isMutating || eligibleStaff.length === 0}
										>
											<SelectTrigger
												className="w-full text-sm"
												aria-invalid={!!errors.staffId}
											>
												<SelectValue placeholder="اختر موظفًا مؤهّلًا" />
											</SelectTrigger>
											<SelectContent position="popper">
												{eligibleStaff.map((member) => (
													<SelectItem
														key={member.id}
														value={member.id}
													>
														{member.name}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
										<FieldError errors={[errors.staffId]} />
									</Field>
									{eligibleStaff.length === 0 && (
										<span className="text-xs text-muted-foreground">
											لا يوجد موظف مفعَّل لزيارات الأكاديمية المتنقلة. فعّل الخيار من إعدادات جدولة
											الموظف أولًا.
										</span>
									)}
								</div>
							)}
						/>

						<div className="grid grid-cols-2 gap-3">
							<div className="flex flex-col gap-1.5">
								<Label className="text-sm font-medium">الموعد</Label>
								<Field data-invalid={!!errors.startsAt}>
									{/* جزيرة LTR: حقل التاريخ الأصلي يعرض بصيغة لاتينية */}
									<Input
										type="datetime-local"
										dir="ltr"
										className="text-start text-sm"
										aria-invalid={!!errors.startsAt}
										disabled={isMutating}
										{...register("startsAt")}
									/>
									<FieldError errors={[errors.startsAt]} />
								</Field>
							</div>

							<div className="flex flex-col gap-1.5">
								<Label className="text-sm font-medium">المدّة (دقيقة)</Label>
								<Field data-invalid={!!errors.durationMinutes}>
									<Input
										type="number"
										inputMode="numeric"
										min={5}
										max={600}
										className="text-sm tabular-nums"
										aria-invalid={!!errors.durationMinutes}
										disabled={isMutating}
										{...register("durationMinutes")}
									/>
									<FieldError errors={[errors.durationMinutes]} />
								</Field>
							</div>
						</div>

						<Controller
							name="mobileUnitId"
							control={control}
							render={({ field }) => (
								<div className="flex flex-col gap-1.5">
									<Label className="text-sm font-medium">المركبة (اختياري)</Label>
									<Field data-invalid={!!errors.mobileUnitId}>
										<Select
											dir="rtl"
											value={field.value ?? NO_UNIT}
											onValueChange={(value) =>
												field.onChange(value === NO_UNIT ? undefined : value)
											}
											disabled={isMutating}
										>
											<SelectTrigger className="w-full text-sm">
												<SelectValue />
											</SelectTrigger>
											<SelectContent position="popper">
												<SelectItem value={NO_UNIT}>بلا إسناد الآن</SelectItem>
												{units.map((unit) => (
													<SelectItem
														key={unit.id}
														value={unit.id}
													>
														{unit.name}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
										<FieldError errors={[errors.mobileUnitId]} />
									</Field>
								</div>
							)}
						/>
					</form>
				)}

				{/* تذييل موحّد: border-t px-4 py-2 وأزرار sm — نفس نمط بقيّة النوافذ */}
				<div className="flex items-center justify-end gap-2 border-t pt-3">
					<Button
						variant="outline"
						size="sm"
						onClick={onClose}
						disabled={isMutating}
					>
						إلغاء
					</Button>
					<Button
						type="submit"
						form="convert-request-form"
						size="sm"
						disabled={isMutating || missingAnimalType || !isValid}
					>
						<IconTruck className="size-3.5" />
						إنشاء الزيارة
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
}
