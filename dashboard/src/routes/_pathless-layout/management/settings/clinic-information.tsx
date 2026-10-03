import { IconUpload, IconUserCircle } from "@tabler/icons-react";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { Container, ContainerRow } from "@/components/common/container";
import { Spinner } from "@/components/common/spinner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PhoneInput } from "@/components/ui/phone-input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { SettingsPageWrapper } from "@/features/settings/components/settings-page-wrapper";
import { useClinicInfo } from "@/features/settings/services/hooks/use-clinic-info";
import {
	type UpdateClinicInfoInput,
	useUpdateClinicInfo,
} from "@/features/settings/services/hooks/use-update-clinic-info";
import { useFileUpload } from "@/hooks/use-file-upload";
import { useI18n } from "@/hooks/use-i18n";
import { CITIES } from "@/lib/data/cities";
import { TIMEZONES } from "@/lib/data/time-zones";
import { getFileUrl } from "@/lib/file-url";
import { cn } from "@/lib/utils";

export const Route = createFileRoute(
	"/_pathless-layout/management/settings/clinic-information",
)({
	component: RouteComponent,
});

const fieldWrapperClassName = "w-full max-w-[320px]";
const fieldClassName =
	"h-11 rounded-xl border-border/80 bg-background px-4 text-base shadow-none placeholder:text-muted-foreground/85";

function RouteComponent() {
	const { isRtl: isArabic } = useI18n();

	const { updateClinicInfo, isPending } = useUpdateClinicInfo();
	const { clinicInfo, isLoading } = useClinicInfo();

	const { register, handleSubmit, control, reset, getValues } =
		useForm<UpdateClinicInfoInput>();

	const [{ files }, { openFileDialog, getInputProps }] = useFileUpload({
		accept: "image/*",
		onFilesAdded: (addedFiles) => {
			const logoFile = addedFiles[0]?.file instanceof File ? addedFiles[0].file : undefined;
			if (logoFile) updateClinicInfo({ ...getValues(), logoFile });
		},
	});

	const fileName = files[0]?.file.name ?? null;

	const previewUrl = files[0]?.preview ?? getFileUrl(clinicInfo?.logo);

	useEffect(() => {
		if (clinicInfo) {
			reset({
				name: clinicInfo.name,
				email: clinicInfo.email,
				phone: clinicInfo.phone,
				licenseNumber: clinicInfo.licenseNumber,
				taxRegistryNumber: clinicInfo.taxRegistryNumber,
				website: clinicInfo.website,
				city: clinicInfo.city,
				address: clinicInfo.address,
				timezone: clinicInfo.timezone,
				calendarType: clinicInfo.calendarType,
			});
		}
	}, [clinicInfo, reset]);

	const onSubmit = (data: UpdateClinicInfoInput) => {
		const logoFile = files[0]?.file instanceof File ? files[0].file : undefined;
		updateClinicInfo({ ...data, logoFile });
	};

	if (isLoading) {
		return (
			<SettingsPageWrapper>
				<Spinner />
			</SettingsPageWrapper>
		);
	}

	return (
		<SettingsPageWrapper>
			<Container
				title="المعلومات الأساسية"
				description="تخصيص المعلومات الأساسية للأكاديمية."
			>
				<ContainerRow
					title="الشعار"
					action={
						<div className={cn(fieldWrapperClassName, "flex flex-col items-start gap-2")}>
							<div className="inline-flex items-center gap-3">
								{previewUrl ? (
									<div className="relative flex size-11 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-border/80 bg-muted/40">
										<img
											className="size-full object-cover"
											src={previewUrl}
											alt="معاينة شعار الأكاديمية"
										/>
									</div>
								) : (
									<div
										className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-dashed border-border/80 bg-muted/30 text-muted-foreground"
										aria-hidden="true"
									>
										<IconUserCircle
											className="size-5 opacity-70"
											aria-hidden="true"
										/>
									</div>
								)}
								<div className="relative inline-block">
									<Button
										type="button"
										variant="outline"
										size="default"
										onClick={openFileDialog}
										aria-haspopup="dialog"
										className="h-10 rounded-xl border-border/80 px-4 text-sm font-medium shadow-none"
									>
										<IconUpload className="size-4" />
										{fileName ? "تغيير الشعار" : "رفع شعار"}
									</Button>
									<input
										{...getInputProps()}
										className="sr-only"
										aria-label="Upload image file"
										tabIndex={-1}
									/>
								</div>
							</div>
							{!fileName && !previewUrl && (
								<p
									className="text-xs text-muted-foreground"
									aria-live="polite"
								>
									لم يتم رفع صورة
								</p>
							)}
						</div>
					}
				/>

				<ContainerRow
					title="اسم الأكاديمية"
					action={
						<Input
							id="name"
							placeholder="اسم الأكاديمية"
							aria-label="اسم الأكاديمية"
							className={cn(fieldClassName, fieldWrapperClassName)}
							{...register("name", { setValueAs: (v) => v || undefined })}
							onBlur={() => handleSubmit(onSubmit)()}
							disabled={isPending}
						/>
					}
				/>

				<ContainerRow
					title="البريد الإلكتروني"
					action={
						<Input
							id="email"
							type="email"
							placeholder="example@clinic.com"
							aria-label="البريد الإلكتروني"
							className={cn(fieldClassName, fieldWrapperClassName)}
							{...register("email", { setValueAs: (v) => v || undefined })}
							onBlur={() => handleSubmit(onSubmit)()}
							disabled={isPending}
						/>
					}
				/>

				<ContainerRow
					title="رقم الجوال"
					action={
						<Controller
							name="phone"
							control={control}
							render={({ field }) => (
								<PhoneInput
									{...field}
									value={field.value ?? undefined}
									defaultCountry="SA"
									placeholder="أدخل رقم الهاتف"
									className={fieldWrapperClassName}
									onBlur={() => handleSubmit(onSubmit)()}
									disabled={isPending}
								/>
							)}
						/>
					}
				/>

				<ContainerRow
					title="رقم الترخيص"
					action={
						<Input
							id="licenseNumber"
							placeholder="رقم الترخيص"
							aria-label="رقم الترخيص"
							className={cn(fieldClassName, fieldWrapperClassName)}
							{...register("licenseNumber", { setValueAs: (v) => v || undefined })}
							onBlur={() => handleSubmit(onSubmit)()}
							disabled={isPending}
						/>
					}
				/>

				<ContainerRow
					title="رقم السجل الضريبي"
					action={
						<Input
							id="taxRegistryNumber"
							placeholder="رقم السجل الضريبي"
							aria-label="رقم السجل الضريبي"
							className={cn(fieldClassName, fieldWrapperClassName)}
							{...register("taxRegistryNumber", { setValueAs: (v) => v || undefined })}
							onBlur={() => handleSubmit(onSubmit)()}
							disabled={isPending}
						/>
					}
				/>

				<ContainerRow
					title="الموقع الإلكتروني"
					action={
						<Input
							id="website"
							type="url"
							placeholder="https://www.example.com"
							aria-label="الموقع الإلكتروني"
							className={cn(fieldClassName, fieldWrapperClassName)}
							{...register("website", { setValueAs: (v) => v || undefined })}
							onBlur={() => handleSubmit(onSubmit)()}
							disabled={isPending}
						/>
					}
				/>

				<ContainerRow
					title="المدينة"
					action={
						<Controller
							name="city"
							control={control}
							render={({ field }) => (
								<Select
									value={field.value ?? undefined}
									onValueChange={(value) => {
										field.onChange(value);
										handleSubmit(onSubmit)();
									}}
								>
									<SelectTrigger
										className={cn(
											fieldClassName,
											fieldWrapperClassName,
											"h-11",
											isArabic ? "text-right" : "text-left",
										)}
									>
										<SelectValue placeholder="اختر المدينة" />
									</SelectTrigger>
									<SelectContent
										dir={isArabic ? "rtl" : "ltr"}
										className="w-fit"
									>
										{CITIES.map((city) => (
											<SelectItem
												key={city.value}
												value={city.value}
												dir={isArabic ? "rtl" : "ltr"}
												className={isArabic ? "text-right" : "text-left"}
											>
												{city.label}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							)}
						/>
					}
				/>

				<ContainerRow
					title="العنوان التفصيلي"
					action={
						<Input
							id="address"
							placeholder="العنوان التفصيلي"
							aria-label="العنوان التفصيلي"
							className={cn(fieldClassName, fieldWrapperClassName)}
							{...register("address", { setValueAs: (v) => v || undefined })}
							onBlur={() => handleSubmit(onSubmit)()}
							disabled={isPending}
						/>
					}
				/>
			</Container>

			<Container
				title="تخصيص"
				subtitle="ضبط التقويم واللغة والمنطقة الزمنية حسب موقعك."
			>
				<ContainerRow
					title="نوع التقويم"
					action={
						<Controller
							name="calendarType"
							control={control}
							render={({ field }) => (
								<Select
									value={field.value ?? undefined}
									onValueChange={(value) => {
										field.onChange(value);
										handleSubmit(onSubmit)();
									}}
									disabled={isPending}
								>
									<SelectTrigger
										className={cn(
											fieldClassName,
											fieldWrapperClassName,
											"h-11",
											isArabic ? "text-right" : "text-left",
										)}
									>
										<SelectValue placeholder="اختر نوع التقويم" />
									</SelectTrigger>
									<SelectContent dir={isArabic ? "rtl" : "ltr"}>
										<SelectItem
											value="GREGORIAN"
											dir={isArabic ? "rtl" : "ltr"}
											className={isArabic ? "text-right" : "text-left"}
										>
											ميلادي
										</SelectItem>
										<SelectItem
											value="HIJRI"
											dir={isArabic ? "rtl" : "ltr"}
											className={isArabic ? "text-right" : "text-left"}
										>
											هجري
										</SelectItem>
									</SelectContent>
								</Select>
							)}
						/>
					}
				/>

				<ContainerRow
					title="المنطقة الجغرافية"
					action={
						<Controller
							name="timezone"
							control={control}
							render={({ field }) => (
								<Select
									value={field.value ?? undefined}
									onValueChange={(value) => {
										field.onChange(value);
										handleSubmit(onSubmit)();
									}}
									disabled={isPending}
								>
									<SelectTrigger
										className={cn(
											fieldClassName,
											fieldWrapperClassName,
											"h-11",
											isArabic ? "text-right" : "text-left",
										)}
									>
										<SelectValue placeholder="اختر المنطقة الزمنية" />
									</SelectTrigger>
									<SelectContent
										dir={isArabic ? "rtl" : "ltr"}
										className="w-fit"
									>
										{TIMEZONES.map((tz) => (
											<SelectItem
												key={tz.value}
												value={tz.value}
												dir={isArabic ? "rtl" : "ltr"}
												className={isArabic ? "text-right" : "text-left"}
											>
												{tz.label}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							)}
						/>
					}
				/>
			</Container>

			<Container
				title="توثيق الحساب"
				subtitle="وثّق حسابك لفتح ميزات إضافية وزيادة مصداقية أكاديميتك."
			>
				<ContainerRow
					title="حالة التوثيق"
					action={
						<div className="flex items-center gap-3">
							{clinicInfo?.isVerified ? (
								<Badge className="rounded-[4px] bg-[#16A34A]/10 text-[#16A34A]">موثق</Badge>
							) : (
								<Badge className="rounded-[4px] bg-[#F59E0B]/10 text-[#F59E0B]">
									غير موثق
								</Badge>
							)}

							<Button
								disabled
								variant="outline"
							>
								ابدأ التوثيق
							</Button>
						</div>
					}
				/>
			</Container>
		</SettingsPageWrapper>
	);
}
