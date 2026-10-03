import { zodResolver } from "@hookform/resolvers/zod";
import { IconCheck, IconCurrentLocation, IconTruck } from "@tabler/icons-react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Controller, type Resolver, type SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
import { Textarea } from "@/components/ui/textarea";
import { PREFERRED_WINDOW_OPTIONS } from "@/features/mobile-clinics/data/request-meta";
import { api } from "@/lib/api";
import {
	type PublicRequestFormInput,
	publicRequestSchema,
} from "@sanad/contracts/runtime/server/mobile-clinics/mobile-requests/mobile-requests.type";

/**
 * [MC7.3] نموذج طلب زيارة متنقلة — عام، بلا تسجيل دخول.
 *
 * `ssr: false` على سنّة `book.$slug`: النموذج يعتمد على حالة المتصفّح وعلى تحديد الموقع،
 * ولا فائدة من تصييره على الخادم.
 */
export const Route = createFileRoute("/request-visit/$slug")({
	component: RequestVisitPage,
	ssr: false,
});

const money = new Intl.NumberFormat("ar-EG", { maximumFractionDigits: 2 });

type Availability = {
	clinicName: string;
	accepting: boolean;
	animalTypes: { id: string; arName: string }[];
	zones: string[];
	services: {
		id: string;
		name: string;
		categoryName: string | null;
		price: string;
		duration: number | null;
	}[];
};

function RequestVisitPage() {
	const { slug } = Route.useParams();

	const { data: availability, isLoading } = useQuery<Availability>({
		queryKey: ["mobile-availability", slug],
		queryFn: async () => {
			const res = await api["mobile-requests"].public({ slug }).availability.get();
			if (res.error) throw new Error("تعذّر تحميل بيانات الأكاديمية");
			return res.data as Availability;
		},
	});

	const [submittedCode, setSubmittedCode] = useState<string | null>(null);

	/**
	 * نفس اصطلاح نماذج المستودع: المخطّط في `mobile-requests.type.ts`، والتحقّق عبر
	 * `zodResolver`، وكل حقل داخل `Field` مع `FieldError` — لا تحقّق يدوي في زرّ الإرسال.
	 */
	const {
		register,
		handleSubmit,
		control,
		setValue,
		watch,
		formState: { errors },
	} = useForm<PublicRequestFormInput>({
		resolver: zodResolver(publicRequestSchema) as Resolver<PublicRequestFormInput>,
		mode: "onBlur",
		defaultValues: { preferredWindow: "ANY" },
	});

	const hasCoords = watch("lat") !== undefined && watch("lng") !== undefined;

	const submitMut = useMutation({
		mutationFn: async (data: PublicRequestFormInput) => {
			const res = await api["mobile-requests"].public({ slug }).post(data);
			if (res.error) {
				const message =
					(res.error as { value?: { message?: string } })?.value?.message ||
					"تعذّر إرسال الطلب";
				throw new Error(message);
			}
			return res.data as { code: string };
		},
		onSuccess: (data) => setSubmittedCode(data.code),
		onError: (error: Error) => toast.error(error.message),
	});

	const onSubmit: SubmitHandler<PublicRequestFormInput> = (data) => submitMut.mutate(data);

	/**
	 * الموقع من المتصفّح اختياري تمامًا: كثير من الناس يرفضون الإذن، ورفضه يجب ألّا يمنع
	 * الطلب. المعلَم النصّي يكفي المنسّق للوصول.
	 */
	const pickMyLocation = () => {
		if (!navigator.geolocation) {
			toast.error("متصفّحك لا يدعم تحديد الموقع");
			return;
		}
		navigator.geolocation.getCurrentPosition(
			(position) => {
				setValue("lat", position.coords.latitude);
				setValue("lng", position.coords.longitude);
				toast.success("تم تحديد موقعك");
			},
			() => toast.error("تعذّر تحديد الموقع — اكتب العنوان والمعلَم بدلًا من ذلك"),
		);
	};

	if (isLoading) {
		return <main className="p-8 text-center text-sm text-muted-foreground">جارٍ التحميل…</main>;
	}

	if (!availability) {
		return <main className="p-8 text-center text-sm">الأكاديمية غير موجودة.</main>;
	}

	if (submittedCode) {
		return (
			<main className="mx-auto flex max-w-md flex-col items-center gap-3 p-8 text-center">
				<IconCheck className="size-12 text-emerald-500" />
				<h1 className="text-lg font-semibold">وصلنا طلبك</h1>
				<p className="text-sm text-muted-foreground">
					سنتواصل معك على الرقم الذي أدخلته لتأكيد الموعد. احتفظ برقم الطلب:
				</p>
				{/* رقم الطلب جزيرة LTR: رموزه لاتينية وشرطته تنعكس داخل صفحة RTL */}
				<code
					dir="ltr"
					className="rounded-[4px] border bg-muted px-3 py-1.5 font-mono text-sm"
				>
					{submittedCode}
				</code>
			</main>
		);
	}

	return (
		<main className="mx-auto flex w-full max-w-lg flex-col gap-4 p-4 sm:p-8">
			<header className="flex flex-col gap-1">
				<span className="inline-flex items-center gap-2 text-sm font-medium text-primary">
					<IconTruck className="size-4" />
					{availability.clinicName}
				</span>
				<h1 className="text-xl font-bold">اطلب زيارة أكاديمية متنقلة</h1>
				<p className="text-sm text-muted-foreground">
					املأ البيانات وسنتواصل معك لتأكيد الموعد. الطلب ليس حجزًا مؤكّدًا.
				</p>
				{availability.zones.length > 0 && (
					<p className="text-xs text-muted-foreground">
						نخدم حاليًا: {availability.zones.join("، ")}
					</p>
				)}
			</header>

			{!availability.accepting && (
				<div className="rounded-[4px] border border-amber-500/30 bg-amber-500/5 p-3 text-xs text-muted-foreground">
					لا توجد وحدات متنقلة مفعّلة حاليًا. يمكنك إرسال الطلب وسنتواصل معك عند توفّرها.
				</div>
			)}

			<form
				onSubmit={handleSubmit(onSubmit)}
				className="flex flex-col gap-3"
			>
				<div className="flex flex-col gap-1.5">
					<Label className="text-sm font-medium">الاسم</Label>
					<Field data-invalid={!!errors.ownerName}>
						<Input
							placeholder="الاسم الكامل"
							className="text-sm"
							aria-invalid={!!errors.ownerName}
							disabled={submitMut.isPending}
							{...register("ownerName")}
						/>
						<FieldError errors={[errors.ownerName]} />
					</Field>
				</div>

				<div className="flex flex-col gap-1.5">
					<Label className="text-sm font-medium">رقم الجوال</Label>
					<Field data-invalid={!!errors.phone}>
						{/* جزيرة LTR: الرقم يُكتب من اليسار حتى داخل نموذج RTL */}
						<Input
							dir="ltr"
							inputMode="tel"
							placeholder="05XXXXXXXX"
							className="text-start text-sm"
							aria-invalid={!!errors.phone}
							disabled={submitMut.isPending}
							{...register("phone")}
						/>
						<FieldError errors={[errors.phone]} />
					</Field>
				</div>

				<div className="flex flex-col gap-1.5">
					<Label className="text-sm font-medium">العنوان</Label>
					<Field data-invalid={!!errors.addressLine}>
						<Input
							placeholder="الحيّ، الشارع، رقم المبنى"
							className="text-sm"
							aria-invalid={!!errors.addressLine}
							disabled={submitMut.isPending}
							{...register("addressLine")}
						/>
						<FieldError errors={[errors.addressLine]} />
					</Field>
				</div>

				<div className="flex flex-col gap-1.5">
					<Label className="text-sm font-medium">علامة مميّزة (اختياري)</Label>
					<Field data-invalid={!!errors.landmark}>
						<Input
							placeholder="خلف مسجد الحيّ، بجانب الصيدلية…"
							className="text-sm"
							aria-invalid={!!errors.landmark}
							disabled={submitMut.isPending}
							{...register("landmark")}
						/>
						<FieldError errors={[errors.landmark]} />
					</Field>
					<Button
						type="button"
						variant="outline"
						size="sm"
						className="w-fit"
						onClick={pickMyLocation}
						disabled={submitMut.isPending}
					>
						<IconCurrentLocation className="size-3.5" />
						{hasCoords ? "تم تحديد الموقع" : "استخدم موقعي الحالي"}
					</Button>
				</div>

				<div className="grid grid-cols-2 gap-3">
					<div className="flex flex-col gap-1.5">
						<Label className="text-sm font-medium">اسم الطفل</Label>
						<Field data-invalid={!!errors.petName}>
							<Input
								className="text-sm"
								aria-invalid={!!errors.petName}
								disabled={submitMut.isPending}
								{...register("petName")}
							/>
							<FieldError errors={[errors.petName]} />
						</Field>
					</div>

					<Controller
						name="animalTypeId"
						control={control}
						render={({ field }) => (
							<div className="flex flex-col gap-1.5">
								<Label className="text-sm font-medium">النوع</Label>
								<Field data-invalid={!!errors.animalTypeId}>
									<Select
										dir="rtl"
										value={field.value || undefined}
										onValueChange={field.onChange}
										disabled={submitMut.isPending}
									>
										<SelectTrigger
											className="w-full text-sm"
											aria-invalid={!!errors.animalTypeId}
										>
											<SelectValue placeholder="اختر" />
										</SelectTrigger>
										<SelectContent position="popper">
											{availability.animalTypes.map((type) => (
												<SelectItem
													key={type.id}
													value={type.id}
												>
													{type.arName}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
									<FieldError errors={[errors.animalTypeId]} />
								</Field>
							</div>
						)}
					/>
				</div>

				{/* أكاديمية لم تُدرج دورات متنقلة بعد: إخفاء الحقل أصدق من عرض قائمة فارغة */}
				{availability.services.length > 0 && (
					<Controller
						name="serviceIds"
						control={control}
						render={({ field }) => {
							const chosen = field.value ?? [];
							const toggle = (id: string) =>
								field.onChange(
									chosen.includes(id) ? chosen.filter((s) => s !== id) : [...chosen, id],
								);

							return (
								<div className="flex flex-col gap-1.5">
									<Label className="text-sm font-medium">الدورات المطلوبة (اختياري)</Label>
									<Field data-invalid={!!errors.serviceIds}>
										<div className="flex flex-col gap-0.5 rounded-[4px] border p-1">
											{availability.services.map((service) => (
												<Label
													key={service.id}
													className="flex cursor-pointer items-center gap-3 rounded-[4px] px-2 py-2 font-normal hover:bg-muted"
												>
													<Checkbox
														checked={chosen.includes(service.id)}
														onCheckedChange={() => toggle(service.id)}
														disabled={submitMut.isPending}
													/>
													<div className="flex min-w-0 flex-1 flex-col">
														<span className="truncate text-sm">{service.name}</span>
														{service.categoryName && (
															<span className="text-[11px] text-muted-foreground">
																{service.categoryName}
															</span>
														)}
													</div>
													<span className="shrink-0 text-xs text-muted-foreground tabular-nums">
														{money.format(Number(service.price))} ر.س
													</span>
												</Label>
											))}
										</div>
										<FieldError errors={[errors.serviceIds]} />
									</Field>
									<span className="text-xs text-muted-foreground">
										الأسعار تقديرية وتُؤكَّد عند الاتصال بك.
									</span>
								</div>
							);
						}}
					/>
				)}

				<Controller
					name="preferredWindow"
					control={control}
					render={({ field }) => (
						<div className="flex flex-col gap-1.5">
							<Label className="text-sm font-medium">الوقت المفضّل</Label>
							<Field data-invalid={!!errors.preferredWindow}>
								<Select
									dir="rtl"
									value={field.value}
									onValueChange={field.onChange}
									disabled={submitMut.isPending}
								>
									<SelectTrigger
										className="w-full text-sm"
										aria-invalid={!!errors.preferredWindow}
									>
										<SelectValue />
									</SelectTrigger>
									<SelectContent position="popper">
										{PREFERRED_WINDOW_OPTIONS.map((option) => (
											<SelectItem
												key={option.value}
												value={option.value}
											>
												{option.label}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
								<FieldError errors={[errors.preferredWindow]} />
							</Field>
						</div>
					)}
				/>

				<div className="flex flex-col gap-1.5">
					<Label className="text-sm font-medium">ملاحظات (اختياري)</Label>
					<Field data-invalid={!!errors.notes}>
						<Textarea
							rows={3}
							placeholder="ما الذي يحتاجه ابنك؟"
							className="text-sm"
							aria-invalid={!!errors.notes}
							disabled={submitMut.isPending}
							{...register("notes")}
						/>
						<FieldError errors={[errors.notes]} />
					</Field>
				</div>

				<Button
					type="submit"
					size="sm"
					className="self-start"
					disabled={submitMut.isPending}
				>
					<IconTruck className="size-3.5" />
					إرسال الطلب
				</Button>
			</form>
		</main>
	);
}
