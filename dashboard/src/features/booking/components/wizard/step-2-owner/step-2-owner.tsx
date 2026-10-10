import { IconHelpCircle } from "@tabler/icons-react";

import { Field, FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { PhoneInput } from "@/components/ui/phone-input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { usePublicClinicAnimalTypes } from "@/features/booking/hooks/use-public-clinic-animal-types";
import { useBookingDraftStore } from "@/features/booking/stores/booking-draft.store";

type Step2OwnerProps = {
	clinicSlug: string;
	errors: Record<string, string | undefined>;
};

export const Step2Owner = ({ clinicSlug, errors }: Step2OwnerProps) => {
	const draft = useBookingDraftStore(clinicSlug);
	const { animalTypes, isLoading: isLoadingTypes } = usePublicClinicAnimalTypes(clinicSlug);

	return (
		<div className="flex flex-col gap-8">
			<section className="flex flex-col gap-5">
				<div className="flex items-start justify-between gap-2">
					<div className="flex flex-col gap-1">
						<h2 className="text-lg font-bold text-foreground">معلومات وليّ الأمر</h2>
						<p className="text-sm text-muted-foreground">أدخل معلوماتك للتواصل معك</p>
					</div>
					<button
						type="button"
						className="rounded-full p-1 text-muted-foreground hover:bg-muted"
						aria-label="مساعدة"
					>
						<IconHelpCircle className="size-5" />
					</button>
				</div>

				<Field data-invalid={!!errors.ownerName}>
					<label
						htmlFor="owner-name"
						className="text-sm font-medium text-foreground"
					>
						الاسم الكامل <span className="text-destructive">*</span>
					</label>
					<Input
						id="owner-name"
						placeholder="أدخل اسمك الكامل"
						aria-invalid={!!errors.ownerName}
						value={draft.ownerName}
						onChange={(e) => draft.setField("ownerName", e.target.value)}
					/>
					<FieldError errors={errors.ownerName ? [{ message: errors.ownerName }] : []} />
				</Field>

				<Field data-invalid={!!errors.ownerPhone}>
					<label
						htmlFor="owner-phone"
						className="text-sm font-medium text-foreground"
					>
						رقم الجوال <span className="text-destructive">*</span>
					</label>
					<div className="rtl text-left">
						<PhoneInput
							id="owner-phone"
							defaultCountry="SA"
							placeholder="05XXXXXXXX"
							// className="text-left!"
							// dir="rtl"
							aria-invalid={!!errors.ownerPhone}
							value={draft.ownerPhone || undefined}
							onChange={(value) => draft.setField("ownerPhone", value ?? "")}
						/>
					</div>
					<FieldError errors={errors.ownerPhone ? [{ message: errors.ownerPhone }] : []} />
				</Field>

				<Field data-invalid={!!errors.ownerEmail}>
					<label
						htmlFor="owner-email"
						className="text-sm font-medium text-foreground"
					>
						البريد الإلكتروني <span className="text-muted-foreground">(اختياري)</span>
					</label>
					<Input
						id="owner-email"
						type="email"
						placeholder="example@email.com"
						aria-invalid={!!errors.ownerEmail}
						value={draft.ownerEmail}
						onChange={(e) => draft.setField("ownerEmail", e.target.value)}
					/>
					<FieldError errors={errors.ownerEmail ? [{ message: errors.ownerEmail }] : []} />
				</Field>
			</section>

			<section className="flex flex-col gap-5 border-t pt-8">
				<div className="flex items-start justify-between gap-2">
					<div className="flex flex-col gap-1">
						<h2 className="text-lg font-bold text-foreground">معلومات الطفل</h2>
						<p className="text-sm text-muted-foreground">أدخل معلومات ابنك الأليف</p>
					</div>
					<button
						type="button"
						className="rounded-full p-1 text-muted-foreground hover:bg-muted"
						aria-label="مساعدة"
					>
						<IconHelpCircle className="size-5" />
					</button>
				</div>

				<Field data-invalid={!!errors.patientName}>
					<label
						htmlFor="patient-name"
						className="text-sm font-medium text-foreground"
					>
						اسم الطفل <span className="text-destructive">*</span>
					</label>
					<Input
						id="patient-name"
						placeholder="أدخل اسم الطفل"
						aria-invalid={!!errors.patientName}
						value={draft.patientName}
						onChange={(e) => draft.setField("patientName", e.target.value)}
					/>
					<FieldError errors={errors.patientName ? [{ message: errors.patientName }] : []} />
				</Field>

				<Field data-invalid={!!errors.patientAnimalTypeId}>
					<label
						htmlFor="patient-animal-type"
						className="text-sm font-medium text-foreground"
					>
						نوع الطفل <span className="text-destructive">*</span>
					</label>
					<Select
						value={draft.patientAnimalTypeId || undefined}
						onValueChange={(value) => draft.setField("patientAnimalTypeId", value)}
						disabled={isLoadingTypes}
						dir="rtl"
					>
						<SelectTrigger
							id="patient-animal-type"
							aria-invalid={!!errors.patientAnimalTypeId}
							className="w-full"
						>
							<SelectValue
								placeholder={isLoadingTypes ? "جاري التحميل..." : "اختر نوع الطفل"}
							/>
						</SelectTrigger>
						<SelectContent>
							{animalTypes.map((t) => (
								<SelectItem
									key={t.id}
									value={t.id}
								>
									{t.arName}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
					<FieldError
						errors={
							errors.patientAnimalTypeId ? [{ message: errors.patientAnimalTypeId }] : []
						}
					/>
				</Field>
			</section>
		</div>
	);
};
