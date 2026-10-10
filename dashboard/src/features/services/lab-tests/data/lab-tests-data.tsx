import {
	IconCircleCheck,
	IconClipboardCheck,
	IconClipboardList,
	IconDeviceHeartMonitor,
	IconDroplet,
	IconFlask,
	IconMicroscope,
	IconPrinter,
	IconReportMedical,
	IconTestPipe,
} from "@tabler/icons-react";
import type { LabTestColumn } from "@/features/services/lab-tests/types/lab-tests.types";
import { LabSampleStage, LabTestStatus } from "@/generated/prisma/enums";
import { LAB_STAGE_LABELS, LAB_STATUS_LABELS } from "@sanad/contracts/runtime/server/lab-tests/lab-tests.workflow";

// أعمدة اللوحة الستة بترتيب سير العمل. "ملغي" ليس عمودًا — الطلبات الملغاة
// تختفي من اللوحة (تبقى مقروءة عبر الـ API).
export const LAB_TESTS_COLUMNS: LabTestColumn[] = [
	{
		id: LabTestStatus.QUEUE,
		name: LAB_STATUS_LABELS[LabTestStatus.QUEUE],
		count: 0,
		icon: <IconClipboardList className="size-4" />,
		accent: "neutral",
	},
	{
		id: LabTestStatus.SCHEDULED,
		name: LAB_STATUS_LABELS[LabTestStatus.SCHEDULED],
		count: 0,
		icon: <IconTestPipe className="size-4" />,
		accent: "amber",
	},
	{
		id: LabTestStatus.SAMPLE_COLLECTION,
		name: LAB_STATUS_LABELS[LabTestStatus.SAMPLE_COLLECTION],
		count: 0,
		icon: <IconDroplet className="size-4" />,
		accent: "rose",
	},
	{
		id: LabTestStatus.IN_LAB,
		name: LAB_STATUS_LABELS[LabTestStatus.IN_LAB],
		count: 0,
		icon: <IconFlask className="size-4" />,
		accent: "indigo",
	},
	{
		id: LabTestStatus.UNDER_REVIEW,
		name: LAB_STATUS_LABELS[LabTestStatus.UNDER_REVIEW],
		count: 0,
		icon: <IconMicroscope className="size-4" />,
		accent: "blue",
	},
	{
		id: LabTestStatus.COMPLETED,
		name: LAB_STATUS_LABELS[LabTestStatus.COMPLETED],
		count: 0,
		icon: <IconReportMedical className="size-4" />,
		accent: "green",
	},
];

// ألوان شارة مرحلة العيّنة داخل "في المختبر"
export const SAMPLE_STAGE_META: Record<LabSampleStage, { label: string; className: string }> =
	{
		[LabSampleStage.NOT_COLLECTED]: {
			label: LAB_STAGE_LABELS[LabSampleStage.NOT_COLLECTED],
			className: "border-muted bg-muted text-muted-foreground",
		},
		[LabSampleStage.COLLECTED]: {
			label: LAB_STAGE_LABELS[LabSampleStage.COLLECTED],
			className: "border-amber-200 bg-amber-50 text-amber-700",
		},
		[LabSampleStage.QUALITY_CHECK]: {
			label: LAB_STAGE_LABELS[LabSampleStage.QUALITY_CHECK],
			className: "border-amber-200 bg-amber-50 text-amber-700",
		},
		[LabSampleStage.LABEL_PRINT]: {
			label: LAB_STAGE_LABELS[LabSampleStage.LABEL_PRINT],
			className: "border-rose-200 bg-rose-50 text-rose-700",
		},
		[LabSampleStage.ANALYZER_ASSIGNMENT]: {
			label: LAB_STAGE_LABELS[LabSampleStage.ANALYZER_ASSIGNMENT],
			className: "border-rose-200 bg-rose-50 text-rose-700",
		},
		[LabSampleStage.HANDOVER_SUMMARY]: {
			label: LAB_STAGE_LABELS[LabSampleStage.HANDOVER_SUMMARY],
			className: "border-rose-200 bg-rose-50 text-rose-700",
		},
		[LabSampleStage.ANALYZING]: {
			label: LAB_STAGE_LABELS[LabSampleStage.ANALYZING],
			className: "border-indigo-200 bg-indigo-50 text-indigo-700",
		},
		[LabSampleStage.RESULTS_READY]: {
			label: LAB_STAGE_LABELS[LabSampleStage.RESULTS_READY],
			className: "border-emerald-200 bg-emerald-50 text-emerald-700",
		},
	};

// أيقونة كل مرحلة — يشترك فيها مُدرِّج اللوحة والمسار المصغّر
export const LAB_STAGE_ICONS: Record<LabSampleStage, typeof IconClipboardList> = {
	[LabSampleStage.NOT_COLLECTED]: IconClipboardList,
	[LabSampleStage.COLLECTED]: IconDroplet,
	[LabSampleStage.QUALITY_CHECK]: IconCircleCheck,
	[LabSampleStage.LABEL_PRINT]: IconPrinter,
	[LabSampleStage.ANALYZER_ASSIGNMENT]: IconDeviceHeartMonitor,
	[LabSampleStage.HANDOVER_SUMMARY]: IconClipboardCheck,
	[LabSampleStage.ANALYZING]: IconFlask,
	[LabSampleStage.RESULTS_READY]: IconReportMedical,
};
