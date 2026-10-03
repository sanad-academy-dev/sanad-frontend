import {
	IconBodyScan,
	IconCamera,
	IconClipboardCheck,
	IconClipboardList,
	IconDeviceDesktopAnalytics,
	IconFileUpload,
	IconMicroscope,
	IconPhotoCheck,
	IconReportMedical,
	IconShieldCheck,
	IconStethoscope,
	IconWriting,
} from "@tabler/icons-react";
import type { RadiologyColumn } from "@/features/services/radiology/types/radiology.types";
import { RadiologyStage, RadiologyStatus } from "@/generated/prisma/enums";
import {
	RADIOLOGY_STAGE_LABELS,
	RADIOLOGY_STATUS_LABELS,
} from "@sanad/contracts/runtime/server/radiology/radiology.workflow";

// أعمدة اللوحة السبعة بترتيب سير العمل. "ملغي" ليس عمودًا — الطلبات الملغاة
// تختفي من اللوحة (تبقى مقروءة عبر الـ API).
export const RADIOLOGY_COLUMNS: RadiologyColumn[] = [
	{
		id: RadiologyStatus.QUEUE,
		name: RADIOLOGY_STATUS_LABELS[RadiologyStatus.QUEUE],
		count: 0,
		icon: <IconClipboardList className="size-4" />,
		accent: "neutral",
	},
	{
		id: RadiologyStatus.SCHEDULED,
		name: RADIOLOGY_STATUS_LABELS[RadiologyStatus.SCHEDULED],
		count: 0,
		icon: <IconBodyScan className="size-4" />,
		accent: "amber",
	},
	{
		id: RadiologyStatus.PREPARATION,
		name: RADIOLOGY_STATUS_LABELS[RadiologyStatus.PREPARATION],
		count: 0,
		icon: <IconShieldCheck className="size-4" />,
		accent: "rose",
	},
	{
		id: RadiologyStatus.IMAGING,
		name: RADIOLOGY_STATUS_LABELS[RadiologyStatus.IMAGING],
		count: 0,
		icon: <IconCamera className="size-4" />,
		accent: "indigo",
	},
	{
		id: RadiologyStatus.REPORTING,
		name: RADIOLOGY_STATUS_LABELS[RadiologyStatus.REPORTING],
		count: 0,
		icon: <IconWriting className="size-4" />,
		accent: "blue",
	},
	{
		id: RadiologyStatus.UNDER_REVIEW,
		name: RADIOLOGY_STATUS_LABELS[RadiologyStatus.UNDER_REVIEW],
		count: 0,
		icon: <IconMicroscope className="size-4" />,
		accent: "blue",
	},
	{
		id: RadiologyStatus.COMPLETED,
		name: RADIOLOGY_STATUS_LABELS[RadiologyStatus.COMPLETED],
		count: 0,
		icon: <IconReportMedical className="size-4" />,
		accent: "green",
	},
];

// ألوان شارة المرحلة الفرعية على البطاقة وداخل اللوحة الجانبية
export const RADIOLOGY_STAGE_META: Record<
	RadiologyStage,
	{ label: string; className: string }
> = {
	[RadiologyStage.SAFETY_SCREENING]: {
		label: RADIOLOGY_STAGE_LABELS[RadiologyStage.SAFETY_SCREENING],
		className: "border-muted bg-muted text-muted-foreground",
	},
	[RadiologyStage.PATIENT_PREP]: {
		label: RADIOLOGY_STAGE_LABELS[RadiologyStage.PATIENT_PREP],
		className: "border-amber-200 bg-amber-50 text-amber-700",
	},
	[RadiologyStage.ROOM_ASSIGNMENT]: {
		label: RADIOLOGY_STAGE_LABELS[RadiologyStage.ROOM_ASSIGNMENT],
		className: "border-rose-200 bg-rose-50 text-rose-700",
	},
	[RadiologyStage.READY_CHECK]: {
		label: RADIOLOGY_STAGE_LABELS[RadiologyStage.READY_CHECK],
		className: "border-rose-200 bg-rose-50 text-rose-700",
	},
	[RadiologyStage.ACQUISITION]: {
		label: RADIOLOGY_STAGE_LABELS[RadiologyStage.ACQUISITION],
		className: "border-indigo-200 bg-indigo-50 text-indigo-700",
	},
	[RadiologyStage.IMAGE_UPLOAD]: {
		label: RADIOLOGY_STAGE_LABELS[RadiologyStage.IMAGE_UPLOAD],
		className: "border-indigo-200 bg-indigo-50 text-indigo-700",
	},
	[RadiologyStage.IMAGE_QC]: {
		label: RADIOLOGY_STAGE_LABELS[RadiologyStage.IMAGE_QC],
		className: "border-emerald-200 bg-emerald-50 text-emerald-700",
	},
};

// أيقونة كل مرحلة — يشترك فيها مُدرِّج اللوحة والمسار المصغّر
export const RADIOLOGY_STAGE_ICONS: Record<RadiologyStage, typeof IconClipboardList> = {
	[RadiologyStage.SAFETY_SCREENING]: IconShieldCheck,
	[RadiologyStage.PATIENT_PREP]: IconStethoscope,
	[RadiologyStage.ROOM_ASSIGNMENT]: IconDeviceDesktopAnalytics,
	[RadiologyStage.READY_CHECK]: IconClipboardCheck,
	[RadiologyStage.ACQUISITION]: IconCamera,
	[RadiologyStage.IMAGE_UPLOAD]: IconFileUpload,
	[RadiologyStage.IMAGE_QC]: IconPhotoCheck,
};
