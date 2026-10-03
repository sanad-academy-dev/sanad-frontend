import { zodResolver } from "@hookform/resolvers/zod";
import { IconArrowBackUp } from "@tabler/icons-react";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";

import { Field, FieldError } from "@/components/ui/field";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadiologyImageUpload } from "@/features/services/radiology/components/radiology-image-upload";
import { useSaveRadiologyImageQc } from "@/features/services/radiology/hooks/use-radiology-procedure";
import { RadiologyImageQuality } from "@/generated/prisma/enums";
import { cn } from "@/lib/utils";
import type { RadiologyItemResponse } from "@/server/radiology/radiology.type";
import {
	IMAGE_QUALITY_META,
	type RadiologyImageQcFormInput,
	radiologyImageQcSchema,
} from "@sanad/contracts/runtime/server/radiology/radiology-procedure.type";

// ⑦ فحص جودة الصور — تقييم صلاحيتها للتشخيص قبل فتح كتابة التقرير.
// «غير صالحة» تعني إعادة الالتقاط: عُد خطوةً للخلف وأعد التصوير.

type RegisterSave = (save: (() => Promise<unknown>) | null) => void;

export function RadiologyImageQc({
	item,
	orderId,
	registerSave,
}: {
	item: RadiologyItemResponse;
	orderId: string;
	registerSave: RegisterSave;
}) {
	const { saveImageQc, isPending } = useSaveRadiologyImageQc();

	const {
		control,
		register,
		handleSubmit,
		watch,
		formState: { errors },
	} = useForm<RadiologyImageQcFormInput>({
		resolver: zodResolver(radiologyImageQcSchema),
		defaultValues: {
			imageQuality: item.execution?.imageQuality ?? undefined,
			qcNotes: item.execution?.qcNotes ?? null,
		},
	});

	// «التالي/الإرسال» يستدعي الحفظ — التقييم مطلوب هنا فيمرّ عبر التحقق
	useEffect(() => {
		registerSave(
			() =>
				new Promise((resolve, reject) => {
					void handleSubmit(
						async (values) => {
							try {
								resolve(await saveImageQc({ ...values, itemId: item.id }));
							} catch (e) {
								reject(e);
							}
						},
						() => reject(new Error("قيّم جودة الصور أولًا")),
					)();
				}),
		);
		return () => registerSave(null);
	}, [registerSave, handleSubmit, saveImageQc, item.id]);

	const quality = watch("imageQuality");

	return (
		<div className="flex flex-col gap-4">
			<Controller
				name="imageQuality"
				control={control}
				render={({ field }) => (
					<Field data-invalid={!!errors.imageQuality}>
						<Label className="text-sm font-medium">صلاحية الصور للتشخيص</Label>
						<div className="flex flex-col gap-1.5">
							{Object.values(RadiologyImageQuality).map((value) => {
								const meta = IMAGE_QUALITY_META[value];
								const selected = field.value === value;
								return (
									<button
										key={value}
										type="button"
										disabled={isPending}
										className={cn(
											"rounded-md border p-2.5 text-start text-sm transition-colors",
											selected ? meta.className : "hover:bg-muted/50",
										)}
										onClick={() => field.onChange(value)}
									>
										{meta.label}
									</button>
								);
							})}
						</div>
						<FieldError errors={[errors.imageQuality]} />
					</Field>
				)}
			/>

			{quality === RadiologyImageQuality.NON_DIAGNOSTIC && (
				<p className="flex items-center gap-1.5 rounded-md border border-red-200 bg-red-50 p-2.5 text-xs text-red-700">
					<IconArrowBackUp className="size-4 shrink-0" />
					الصور غير صالحة — عُد خطوة «الالتقاط» وأعد التصوير قبل المتابعة.
				</p>
			)}

			<Field>
				<Label className="text-sm font-medium">ملاحظات الجودة</Label>
				<Textarea
					rows={2}
					placeholder="مثال: وضعية جيدة، تعريض مناسب، لا تشويش حركة"
					disabled={isPending}
					{...register("qcNotes")}
				/>
			</Field>

			{/* الصور نفسها — للمعاينة أثناء التقييم، مع فتح العارض */}
			<RadiologyImageUpload
				item={item}
				orderId={orderId}
				readOnly
			/>
		</div>
	);
}
