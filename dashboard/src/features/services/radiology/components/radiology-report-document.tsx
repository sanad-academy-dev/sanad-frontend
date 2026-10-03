import type {
	RadiologyAddendumResponse,
	RadiologyItemResponse,
	RadiologyOrderResponse,
} from "@/server/radiology/radiology.type";
import { LATERALITY_LABELS } from "@sanad/contracts/runtime/server/radiology/radiology.type";
import { MODALITY_META } from "@sanad/contracts/runtime/server/radiology/radiology-procedure.type";

// وثيقة التقرير — عرض خالص بلا جلب بيانات ولا أزرار، حتى تُطبع كما هي داخل
// إطار معزول. المعاينة تُغلّفها، والطباعة تنسخ عقدتها إلى الإطار.

/** ما تحتاجه الوثيقة من إعدادات الأكاديمية فقط */
type PrintClinic = { name?: string | null; address?: string | null; phone?: string | null };

const SECTIONS: {
	key: "technique" | "comparison" | "findings" | "impression" | "recommendations";
	label: string;
}[] = [
	{ key: "technique", label: "التقنية" },
	{ key: "comparison", label: "المقارنة" },
	{ key: "findings", label: "الموجودات" },
	{ key: "impression", label: "الانطباع" },
	{ key: "recommendations", label: "التوصيات" },
];

const stamp = (value: Date | string | null | undefined) =>
	value
		? new Intl.DateTimeFormat("ar-EG", {
				dateStyle: "long",
				timeStyle: "short",
				calendar: "gregory",
			}).format(new Date(value))
		: "—";

function Row({ label, value }: { label: string; value: string }) {
	return (
		<div className="flex gap-1.5 text-[12px]">
			<span className="shrink-0 text-muted-foreground">{label}:</span>
			<span className="font-medium">{value}</span>
		</div>
	);
}

export function RadiologyReportDocument({
	order,
	item,
	addenda,
	clinic,
}: {
	order: RadiologyOrderResponse;
	item: RadiologyItemResponse;
	addenda: RadiologyAddendumResponse[];
	clinic: PrintClinic | null;
}) {
	const patient = order.patient;
	const images = item.studies.reduce(
		(sum, study) => sum + study.series.reduce((n, s) => n + s.instances.length, 0),
		0,
	);

	return (
		<div
			dir="rtl"
			className="flex w-full flex-col gap-5 bg-white p-8 text-black"
		>
			{/* ترويسة المنشأة */}
			<div className="flex items-start justify-between gap-4 border-b pb-3">
				<div className="flex flex-col gap-0.5">
					<h1 className="text-base font-bold">{clinic?.name ?? "تقرير أشعة"}</h1>
					{clinic?.address && (
						<span className="text-[11px] text-muted-foreground">{clinic.address}</span>
					)}
					{clinic?.phone && (
						<span
							dir="ltr"
							className="text-[11px] text-muted-foreground"
						>
							{clinic.phone}
						</span>
					)}
				</div>
				<div className="text-end">
					<p className="text-sm font-semibold">تقرير أشعة</p>
					<p className="text-[11px] text-muted-foreground">
						{order.code} · {item.accession}
					</p>
				</div>
			</div>

			{/* بيانات الطفل والفحص */}
			<div className="grid grid-cols-2 gap-x-6 gap-y-1">
				<Row
					label="الطفل"
					value={`${patient.name} (${patient.code})`}
				/>
				<Row
					label="وليّ الأمر"
					value={order.owner?.name ?? "—"}
				/>
				<Row
					label="النوع"
					value={patient.animalType?.arName ?? "—"}
				/>
				<Row
					label="الفحص"
					value={item.service.name}
				/>
				<Row
					label="طريقة التصوير"
					value={MODALITY_META[item.modality]?.label ?? item.modality}
				/>
				<Row
					label="المنطقة"
					value={[item.bodyPart, LATERALITY_LABELS[item.laterality]]
						.filter((v) => v && v !== "—")
						.join(" · ")}
				/>
				<Row
					label="تاريخ الفحص"
					value={stamp(item.execution?.finishedAt ?? item.createdAt)}
				/>
				<Row
					label="عدد الصور"
					value={String(images)}
				/>
				<Row
					label="المدرّب الطالب"
					value={order.requestedBy?.name ?? "—"}
				/>
				<Row
					label="التباين"
					value={item.withContrast ? "نعم" : "لا"}
				/>
			</div>

			{order.clinicalInfo && (
				<div className="flex flex-col gap-1">
					<p className="text-[12px] font-bold">المعطيات السريرية</p>
					<p className="whitespace-pre-wrap text-[12px] leading-relaxed">
						{order.clinicalInfo}
					</p>
				</div>
			)}

			{item.report?.criticalFinding && (
				<p className="rounded border border-red-300 bg-red-50 p-2 text-[12px] font-semibold text-red-700">
					نتيجة حرجة
					{item.report.criticalNotifiedTo ? ` — أُبلغ: ${item.report.criticalNotifiedTo}` : ""}
				</p>
			)}

			{/* أقسام التقرير */}
			<div className="flex flex-col gap-3">
				{SECTIONS.map(({ key, label }) => {
					const value = item.report?.[key];
					if (!value) return null;
					return (
						<div
							key={key}
							className="flex flex-col gap-1"
						>
							<p className="text-[12px] font-bold">{label}</p>
							<p className="whitespace-pre-wrap text-[12px] leading-relaxed">{value}</p>
						</div>
					);
				})}
			</div>

			{/* الملاحق — جزء من الوثيقة، فتُطبع معها */}
			{addenda.length > 0 && (
				<div className="flex flex-col gap-2 border-t pt-3">
					<p className="text-[12px] font-bold">ملحقات التقرير</p>
					{addenda.map((addendum, index) => (
						<div
							key={addendum.id}
							className="flex flex-col gap-0.5"
						>
							<p className="text-[11px] text-muted-foreground">
								ملحق {index + 1} — {stamp(addendum.createdAt)}
								{addendum.authoredBy ? ` · ${addendum.authoredBy.name}` : ""}
							</p>
							{addendum.text && (
								<p className="whitespace-pre-wrap text-[12px] leading-relaxed">
									{addendum.text}
								</p>
							)}
							{addendum.attachments.length > 0 && (
								<p className="text-[11px] text-muted-foreground">
									مرفقات: {addendum.attachments.map((f) => f.fileName).join("، ")}
								</p>
							)}
						</div>
					))}
				</div>
			)}

			{/* التوقيع */}
			<div className="mt-4 flex items-end justify-between gap-4 border-t pt-3">
				<div className="flex flex-col gap-0.5">
					<p className="text-[12px] font-bold">
						{item.reviewedBy?.name ?? item.report?.authoredBy?.name ?? "—"}
					</p>
					<p className="text-[11px] text-muted-foreground">
						{item.reviewedAt ? `اعتُمد ${stamp(item.reviewedAt)}` : "لم يُعتمد بعد"}
					</p>
				</div>
				<p className="text-[10px] text-muted-foreground">طُبع في {stamp(new Date())}</p>
			</div>
		</div>
	);
}
