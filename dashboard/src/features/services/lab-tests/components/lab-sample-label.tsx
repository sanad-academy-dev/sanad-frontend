import { IconInfoCircle, IconPrinter } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { LabBarcode } from "@/features/services/lab-tests/components/lab-barcode";
import { LabLabelPrintSheet } from "@/features/services/lab-tests/components/lab-label-print-sheet";
import {
	LABEL_SHEETS,
	labelsPerPage,
	pagesNeeded,
} from "@/features/services/lab-tests/data/label-sheets";
import { useHandoverSample } from "@/features/services/lab-tests/hooks/use-lab-sample";
import { FASTING_LABELS, QUALITY_META, TUBE_LABELS } from "@sanad/contracts/runtime/server/lab-tests/lab-sample.type";
import type {
	LabTestItemResponse,
	LabTestOrderResponse,
} from "@/server/lab-tests/lab-tests.type";

const dateTimeLabel = (value: Date | string | null | undefined) => {
	if (!value) return "—";
	const d = new Date(value);
	return `${d.toLocaleDateString("ar-EG")} ${d.toLocaleTimeString("ar-EG", {
		hour: "2-digit",
		minute: "2-digit",
	})}`;
};

// ملصق العيّنة — خطوة الطباعة. لكل تحليل أنبوبه وملصقه، فرمز الأنبوب يحمل
// رقم التحليل داخل الطلب. عدد الملصقات ووقت التسليم يُسجَّلان عند «التالي».
export function LabSampleLabel({
	order,
	item,
	tubeCode,
	registerSave,
}: {
	order: LabTestOrderResponse;
	item: LabTestItemResponse;
	tubeCode: string;
	/** تُسجِّل حفظ هذه الخطوة لتستدعيه اللوحة عند «التالي» */
	registerSave?: (fn: (() => Promise<unknown>) | null) => void;
}) {
	const collection = item.sampleCollection;
	const { handover } = useHandoverSample();
	const [sheetId, setSheetId] = useState<string>(LABEL_SHEETS[0].id);
	const [labelCount, setLabelCount] = useState(() =>
		String(
			collection?.labelsPrinted && collection.labelsPrinted > 0 ? collection.labelsPrinted : 2,
		),
	);

	const tubeLabel = collection?.tubeType ? TUBE_LABELS[collection.tubeType].label : "—";
	const sheet = LABEL_SHEETS.find((s) => s.id === sheetId) ?? LABEL_SHEETS[0];
	const count = Math.max(1, Number(labelCount) || 1);
	const perPage = labelsPerPage(sheet);
	const pages = pagesNeeded(sheet, count);

	// «التالي» يسجّل عدد الملصقات ووقت تسليم العيّنة لقسم المعالجة
	useEffect(() => {
		if (!registerSave) return;
		registerSave(() => handover({ itemId: item.id, labelsPrinted: count }));
		return () => registerSave(null);
	});

	return (
		<div className="flex flex-col gap-4">
			{/* الخطوة الرابعة من خطوات السحب الخمس */}
			<section className="flex flex-col gap-3 rounded-md border p-3">
				<p className="flex items-center gap-1.5 text-sm font-semibold">
					<Badge
						variant="outline"
						className="size-5 justify-center p-0 text-[10px] tabular-nums"
					>
						٤
					</Badge>
					ملصق العيّنة
				</p>

				{/* الملصق — الباركود في الوسط تحت الكود */}
				<div className="rounded-[4px] border border-dashed p-4">
					<div className="mx-auto flex max-w-sm flex-col items-center gap-2">
						<p className="text-center text-sm font-bold tracking-[0.3em] tabular-nums">
							{tubeCode}
						</p>
						<LabBarcode
							value={tubeCode}
							height={56}
							className="w-full max-w-[280px]"
						/>
						<p className="text-center text-xs font-medium">
							{order.patient.name} · {order.owner.name}
						</p>
						<p className="text-center text-[11px] text-muted-foreground">
							{item.service.name} · {tubeLabel}
						</p>
						<p className="text-center text-[10px] text-muted-foreground">
							{dateTimeLabel(collection?.collectedAt ?? item.createdAt)}
						</p>
					</div>
				</div>

				<div className="grid grid-cols-2 gap-3">
					<div className="flex flex-col gap-1.5">
						<Label className="text-xs font-semibold">مقاس ورق الملصقات</Label>
						<Select
							dir="rtl"
							value={sheetId}
							onValueChange={setSheetId}
						>
							<SelectTrigger className="h-9">
								<SelectValue />
							</SelectTrigger>
							<SelectContent
								dir="rtl"
								position="popper"
							>
								<SelectGroup>
									{LABEL_SHEETS.map((s) => (
										<SelectItem
											key={s.id}
											value={s.id}
										>
											{s.label}
										</SelectItem>
									))}
								</SelectGroup>
							</SelectContent>
						</Select>
					</div>

					<div className="flex flex-col gap-1.5">
						<Label
							htmlFor="label-count"
							className="text-xs font-semibold"
						>
							عدد الملصقات
						</Label>
						<Input
							id="label-count"
							type="number"
							min={1}
							max={200}
							value={labelCount}
							onChange={(e) => setLabelCount(e.target.value)}
							className="h-9 tabular-nums"
						/>
					</div>
				</div>

				<div className="flex flex-wrap items-center justify-between gap-2">
					<p className="text-[11px] text-muted-foreground">
						{count} ملصق على {pages} صفحة ({perPage} لكل صفحة) — تُختار الطابعة من نافذة الطباعة
						في النظام.
					</p>
					<Button
						size="sm"
						variant="outline"
						className="gap-1.5"
						onClick={() => window.print()}
					>
						<IconPrinter className="size-3.5" />
						طباعة الملصقات
					</Button>
				</div>

				{/* منطقة الطباعة — مخفية على الشاشة */}
				<LabLabelPrintSheet
					order={order}
					item={item}
					tubeCode={tubeCode}
					sheet={sheet}
					count={count}
				/>
			</section>
		</div>
	);
}

/** ملخّص سلسلة الحفاظ على العيّنة — خطوة مستقلة في نهاية السحب */
export function LabSampleCustodySummary({
	order,
	item,
}: {
	order: LabTestOrderResponse;
	item: LabTestItemResponse;
}) {
	const collection = item.sampleCollection;
	const preAnalytical = order.preAnalytical;
	const tubeLabel = collection?.tubeType ? TUBE_LABELS[collection.tubeType].label : "—";

	return (
		<section className="rounded-md border">
			<header className="flex items-center gap-1.5 border-b px-4 py-2 text-sm font-semibold">
				<Badge
					variant="outline"
					className="size-5 justify-center p-0 text-[10px] tabular-nums"
				>
					٦
				</Badge>
				ملخص سلسلة الحفاظ على العيّنة
			</header>

			<div className="space-y-4 p-4">
				<div className="flex flex-col divide-y rounded-md border">
					<CustodyRow
						label="الطلب"
						value={`${order.requestedBy?.name ?? "—"} → المختبر`}
					/>
					<CustodyRow
						label="التحقق من الهوية"
						value={`تم التحقق من ${order.owner.name} و ${order.patient.name}`}
					/>
					<CustodyRow
						label="حالة الصيام"
						value={
							preAnalytical?.fastingStatus
								? `${FASTING_LABELS[preAnalytical.fastingStatus]}${
										preAnalytical.fastingHours != null
											? ` · ${preAnalytical.fastingHours} ساعة`
											: ""
									}`
								: "—"
						}
					/>
					<CustodyRow
						label="الجمع"
						value={`${collection?.collectedBy?.name ?? "—"} · ${
							collection?.drawSite || "—"
						} · ${collection?.volumeMl != null ? `${collection.volumeMl} مل` : "—"}`}
					/>
					<CustodyRow
						label="الأنبوب"
						value={`${tubeLabel} · جودة: ${
							collection?.quality ? QUALITY_META[collection.quality].label : "—"
						}`}
					/>
					<CustodyRow
						label="جهاز التحليل"
						value={collection?.analyzerName ?? "لم يُعيَّن"}
					/>
					<CustodyRow
						label="وقت الجمع"
						value={dateTimeLabel(collection?.collectedAt)}
					/>
					<CustodyRow
						label="الملصقات المطبوعة"
						value={`${collection?.labelsPrinted ?? 0} ملصق`}
					/>
				</div>

				{/* التسليم يتم بزر «إرسال إلى المختبر» أسفل اللوحة — لا زر منفصل هنا */}
				<p className="flex items-center gap-1.5 rounded-md border bg-muted/30 px-3 py-2 text-[11px] text-muted-foreground">
					<IconInfoCircle className="size-3.5 shrink-0" />
					راجِع الملخّص ثم أرسِل العيّنة إلى المختبر من أسفل اللوحة.
				</p>
			</div>
		</section>
	);
}

function CustodyRow({ label, value }: { label: string; value: string }) {
	return (
		<div className="flex items-center justify-between gap-3 px-3 py-2">
			<span className="truncate text-[12px] font-medium text-foreground">{value}</span>
			<span className="shrink-0 text-[12px] text-muted-foreground">{label}</span>
		</div>
	);
}
