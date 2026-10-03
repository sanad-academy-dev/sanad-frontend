import { IconPaw } from "@tabler/icons-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { useRegisterArrivalPatient } from "@/features/care/emergency/hooks/use-emergency";
import { useAnimalTypes } from "@/features/settings/animals/hooks/use-animal-types";
import { Gender } from "@/generated/prisma/enums";
import { useI18n } from "@/hooks/use-i18n";

/**
 * [E5.4] تسجيل طفل لوصولٍ مجهول — الخطوة التي كان الفرز يطلبها بلا أن يدلّ عليها.
 *
 * الشاشة تقبل طفلًا مجهولًا عند الباب (كلبٌ يحضره غريب من الشارع)، ثم كان الفرز
 * يردّ «سجّل الطفل قبل الفرز» ويقف: لا زرّ ولا نموذج. هذا هو النموذج.
 *
 * ── العمر تقديريّ، وهذا مقصود ─────────────────────────────────────────────
 *
 * تاريخ الميلاد إلزاميّ على ملفّ الطفل (وإلّا لم تُجدوَل تطعيماته أبدًا)، وطفلُ
 * الشارع لا يُعرف ميلاده. فالتقدير بالسنّ هو ما يفعله المدرّب فعلًا، والأزرار السريعة
 * تحوّله إلى تاريخ. تاريخٌ مقدَّر أصدق من حقلٍ فارغ يُعطّل الجدولة.
 *
 * ووليّ الأمر اختياريّ: تركُه فارغًا يَنسب الطفل إلى «طفل بلا وليّ أمر (طوارئ)» — وليّ أمرٌ
 * واحد لكل أكاديمية تحتاجه الفاتورة ولا يحتاج أن يكون شخصًا (القرار D2).
 */

const AGE_PRESETS = [
	{ label: "أقلّ من ٣ أشهر", months: 1 },
	{ label: "~٦ أشهر", months: 6 },
	{ label: "~سنة", months: 12 },
	{ label: "~٣ سنوات", months: 36 },
	{ label: "~٧ سنوات", months: 84 },
];

const dateFromMonthsAgo = (months: number): string => {
	const d = new Date();
	d.setMonth(d.getMonth() - months);
	return d.toISOString().slice(0, 10);
};

export const RegisterArrivalPatient = ({
	arrivalId,
	provisionalLabel,
	onRegistered,
}: {
	arrivalId: string;
	provisionalLabel?: string | null;
	onRegistered: (patientId: string) => void;
}) => {
	const { isRtl } = useI18n();
	const dir = isRtl ? "rtl" : "ltr";
	const { animalTypes, isLoading: typesLoading } = useAnimalTypes();
	const { registerPatient, isPending } = useRegisterArrivalPatient();

	const [name, setName] = useState(provisionalLabel?.trim() ?? "");
	const [gender, setGender] = useState<Gender | "">("");
	const [animalTypeId, setAnimalTypeId] = useState("");
	const [birthDate, setBirthDate] = useState("");
	const [weight, setWeight] = useState("");

	const canSubmit =
		!isPending && name.trim().length > 0 && gender !== "" && !!animalTypeId && !!birthDate;

	const submit = async () => {
		if (!canSubmit) return;
		const arrival = await registerPatient({
			arrivalId,
			name: name.trim(),
			gender: gender as Gender,
			animalTypeId,
			birthDate,
			weight: weight.trim() ? Number(weight) : null,
		});
		const patientId = (arrival as { patient?: { id: string } } | undefined)?.patient?.id;
		if (patientId) onRegistered(patientId);
	};

	return (
		<div className="flex flex-col gap-4 rounded-md border p-4">
			<div className="flex items-center gap-2">
				<IconPaw className="size-4 shrink-0 text-muted-foreground" />
				<span className="font-medium text-sm">تسجيل الطفل</span>
			</div>
			<p className="text-muted-foreground text-xs">
				الزيارة لا تُفتح لطفل غير مسجَّل. سجّله هنا ثم تابع الفرز — بلا مغادرة الشاشة.
			</p>

			<div className="grid grid-cols-2 gap-3">
				<div className="col-span-2 flex flex-col gap-2">
					<Label>الاسم</Label>
					<Input
						value={name}
						onChange={(e) => setName(e.target.value)}
						placeholder="اسمٌ مؤقّت يكفي — يُعدَّل لاحقًا"
						disabled={isPending}
					/>
				</div>

				<div className="flex flex-col gap-2">
					<Label>النوع</Label>
					<Select
						value={animalTypeId}
						onValueChange={setAnimalTypeId}
						disabled={isPending || typesLoading}
					>
						<SelectTrigger>
							<SelectValue placeholder="اختر النوع" />
						</SelectTrigger>
						{/* popper إلزامي: الافتراضي يُعرض خارج الشاشة في RTL */}
						<SelectContent
							position="popper"
							dir={dir}
						>
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
				</div>

				<div className="flex flex-col gap-2">
					<Label>الجنس</Label>
					<Select
						value={gender}
						onValueChange={(v) => setGender(v as Gender)}
						disabled={isPending}
					>
						<SelectTrigger>
							<SelectValue placeholder="اختر الجنس" />
						</SelectTrigger>
						<SelectContent
							position="popper"
							dir={dir}
						>
							<SelectItem value={Gender.MALE}>ذكر</SelectItem>
							<SelectItem value={Gender.FEMALE}>أنثى</SelectItem>
						</SelectContent>
					</Select>
				</div>

				<div className="col-span-2 flex flex-col gap-2">
					<Label>تاريخ الميلاد (تقديريّ يكفي)</Label>
					<Input
						type="date"
						value={birthDate}
						onChange={(e) => setBirthDate(e.target.value)}
						disabled={isPending}
					/>
					<div className="flex flex-wrap gap-1.5">
						{AGE_PRESETS.map((preset) => (
							<Button
								key={preset.months}
								type="button"
								size="sm"
								variant="outline"
								className="h-6 px-2 text-[11px]"
								disabled={isPending}
								onClick={() => setBirthDate(dateFromMonthsAgo(preset.months))}
							>
								{preset.label}
							</Button>
						))}
					</div>
				</div>

				<div className="flex flex-col gap-2">
					<Label>الوزن (كجم)</Label>
					<Input
						type="number"
						min={0}
						step="0.1"
						value={weight}
						onChange={(e) => setWeight(e.target.value)}
						disabled={isPending}
					/>
				</div>
			</div>

			<div className="flex items-center gap-2">
				<Button
					size="sm"
					disabled={!canSubmit}
					onClick={submit}
				>
					سجّل وتابع الفرز
				</Button>
				<span className="text-muted-foreground text-xs">
					بلا وليّ أمر؟ يُنسَب إلى «طفل بلا وليّ أمر (طوارئ)» ويُنقل لاحقًا.
				</span>
			</div>
		</div>
	);
};
