import { LabBarcode } from "@/features/services/lab-tests/components/lab-barcode";
import type { LabelSheet } from "@/features/services/lab-tests/data/label-sheets";
import { TUBE_LABELS } from "@sanad/contracts/runtime/server/lab-tests/lab-sample.type";
import type {
	LabTestItemResponse,
	LabTestOrderResponse,
} from "@/server/lab-tests/lab-tests.type";

export const PRINT_AREA_ID = "lab-label-print-area";

const dateLabel = (value: Date | string | null | undefined) => {
	if (!value) return "";
	const d = new Date(value);
	return `${d.toLocaleDateString("ar-EG")} ${d.toLocaleTimeString("ar-EG", {
		hour: "2-digit",
		minute: "2-digit",
	})}`;
};

/**
 * منطقة الطباعة: مخفية على الشاشة وتظهر وحدها عند الطباعة.
 * حجم الصفحة يأتي من مقاس الورق المختار، والملصقات تُوزَّع في شبكة تطابقه.
 */
export function LabLabelPrintSheet({
	order,
	item,
	tubeCode,
	sheet,
	count,
}: {
	order: LabTestOrderResponse;
	item: LabTestItemResponse;
	tubeCode: string;
	sheet: LabelSheet;
	count: number;
}) {
	const collection = item.sampleCollection;
	const tubeLabel = collection?.tubeType ? TUBE_LABELS[collection.tubeType].label : "";

	// حجم الصفحة لا يمكن ضبطه بأصناف Tailwind — @page يحتاج CSS حقيقيًا
	const css = `
@media print {
  @page { size: ${sheet.page}; margin: 0; }
  body * { visibility: hidden !important; }
  #${PRINT_AREA_ID}, #${PRINT_AREA_ID} * { visibility: visible !important; }
  #${PRINT_AREA_ID} {
    position: absolute; inset: 0; display: block !important;
    padding: ${sheet.paddingMm}mm;
  }
}`;

	return (
		<>
			{/* biome-ignore lint/security/noDangerouslySetInnerHtml: قواعد @page لا تُعبَّر عنها بأصناف */}
			<style dangerouslySetInnerHTML={{ __html: css }} />
			<div
				id={PRINT_AREA_ID}
				aria-hidden
				className="hidden"
			>
				<div
					style={{
						display: "grid",
						gridTemplateColumns: `repeat(${sheet.cols}, ${sheet.labelWidthMm}mm)`,
						gap: `${sheet.gapMm}mm`,
					}}
				>
					{Array.from({ length: Math.max(1, count) }, (_, i) => (
						<div
							// الملصقات نسخ متطابقة — الفهرس هو المعرّف الوحيد الممكن
							key={i}
							style={{
								width: `${sheet.labelWidthMm}mm`,
								height: `${sheet.labelHeightMm}mm`,
								breakInside: "avoid",
								overflow: "hidden",
							}}
							className="flex flex-col items-center justify-center gap-[1mm] px-[2mm] text-black"
						>
							<span className="text-[8pt] font-bold tracking-[0.2em] tabular-nums">
								{tubeCode}
							</span>
							<LabBarcode
								value={tubeCode}
								height={Math.round(sheet.labelHeightMm * 1.4)}
								moduleWidth={1}
								className="w-full"
							/>
							<span className="truncate text-[7pt] font-medium">
								{order.patient.name} · {order.owner.name}
							</span>
							<span className="truncate text-[6pt]">
								{item.service.name}
								{tubeLabel ? ` · ${tubeLabel}` : ""}
							</span>
							<span className="text-[5pt]">
								{dateLabel(collection?.collectedAt ?? item.createdAt)}
							</span>
						</div>
					))}
				</div>
			</div>
		</>
	);
}
