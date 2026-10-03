import {
	IconAward,
	IconRepeat,
	IconRosetteDiscountCheck,
	IconStar,
} from "@tabler/icons-react";
import { type ReactNode, useState } from "react";

import { Field, FieldContent, FieldLabel, FieldTitle } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { CertificatePreviewDialog } from "@/features/services/training/components/certificate-preview-dialog";
import { useCompletionSettings } from "@/features/services/training/hooks/use-completion-settings";
import { cn } from "@/lib/utils";
import type { CourseDetailResponse, ReEnrollMode } from "@/server/training/training.type";

type Settings = {
	certificateEnabled: boolean;
	certReferencePattern: string | null;
	certValidityDays: number | null;
	certSignatureName: string | null;
	certPassMark: number | null;
	reEnrollMode: ReEnrollMode;
	reEnrollDays: number | null;
	gamificationPoints: number;
	reviewEnabled: boolean;
};

const num = (v: string): number | null => (v === "" ? null : Number(v));

// بطاقة قابلة للتفعيل — عند التفعيل يتمدّد المحتوى ويُبرز الحدّ (إبراز محايد بلا بنفسجي)
function ToggleCard({
	icon,
	title,
	subtitle,
	enabled,
	onToggle,
	children,
}: {
	icon: ReactNode;
	title: string;
	subtitle: string;
	enabled: boolean;
	onToggle: (v: boolean) => void;
	children?: ReactNode;
}) {
	return (
		<div
			className={cn(
				"flex flex-col rounded-lg border bg-card transition-colors",
				enabled ? "border-foreground/25" : "border-border",
			)}
		>
			{/* في RTL أول عنصر يمين: الأيقونة ← النص ← المفتاح يسارًا */}
			<div className="flex items-center gap-3 p-3">
				<span
					className={cn(
						"flex size-9 shrink-0 items-center justify-center rounded-lg",
						enabled
							? "bg-foreground/[0.06] text-foreground"
							: "bg-muted text-muted-foreground",
					)}
				>
					{icon}
				</span>
				<div className="flex min-w-0 flex-1 flex-col">
					<span className="text-[13px] font-bold text-foreground">{title}</span>
					<span className="text-[11px] text-muted-foreground">{subtitle}</span>
				</div>
				<Switch
					checked={enabled}
					onCheckedChange={onToggle}
				/>
			</div>
			{enabled && children && (
				<div className="flex flex-col gap-3 border-t border-border p-3">{children}</div>
			)}
		</div>
	);
}

function Labeled({ label, children }: { label: string; children: ReactNode }) {
	return (
		<div className="flex flex-col gap-1.5">
			<span className="text-[12px] font-medium text-foreground">{label}</span>
			{children}
		</div>
	);
}

// الخطوة الرابعة — «الإكمال والنشر»: بطاقات إعدادات ما بعد الإكمال (شهادة/إعادة تسجيل/تحفيز/تقييم)
export function CourseCompletionStep({
	course,
	courseId,
}: {
	course: CourseDetailResponse | undefined;
	courseId: string;
}) {
	const { saveCompletion } = useCompletionSettings(courseId);
	const cs = course?.completionSettings;
	const [s, setS] = useState<Settings>({
		certificateEnabled: cs?.certificateEnabled ?? false,
		certReferencePattern: cs?.certReferencePattern ?? null,
		certValidityDays: cs?.certValidityDays ?? null,
		certSignatureName: cs?.certSignatureName ?? null,
		certPassMark: cs?.certPassMark ?? null,
		reEnrollMode: cs?.reEnrollMode ?? "NONE",
		reEnrollDays: cs?.reEnrollDays ?? null,
		gamificationPoints: cs?.gamificationPoints ?? 0,
		reviewEnabled: cs?.reviewEnabled ?? false,
	});
	const [previewOpen, setPreviewOpen] = useState(false);

	// تحديث متفائل + حفظ فوري (autosave لكل تغيير)
	const patch = (p: Partial<Settings>) => {
		const next = { ...s, ...p };
		setS(next);
		saveCompletion(next);
	};

	return (
		<div className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto px-3 pt-4">
			<div className="flex flex-col gap-0.5">
				<h2 className="text-[14px] font-bold text-foreground">الإكمال والنشر</h2>
				<p className="text-[11px] text-muted-foreground">
					فعّل ما تحتاجه عند إكمال الموظفين للدورة: شهادة، إعادة تسجيل، تحفيز، وتقييم.
				</p>
			</div>

			{/* 1) الشهادة */}
			<ToggleCard
				icon={<IconRosetteDiscountCheck className="size-5" />}
				title="الشهادة"
				subtitle="إصدار شهادة إتمام لكل متدرّب يكمل الدورة"
				enabled={s.certificateEnabled}
				onToggle={(v) => patch({ certificateEnabled: v })}
			>
				<div className="grid grid-cols-2 gap-3">
					<Labeled label="الرقم المرجعي">
						<Input
							value={s.certReferencePattern ?? ""}
							onChange={(e) => patch({ certReferencePattern: e.target.value || null })}
							placeholder="مثال: VET-CERT"
							className="h-9 text-[12px]"
						/>
					</Labeled>
					<Labeled label="فترة الصلاحية (أيام)">
						<Input
							type="number"
							min={0}
							value={s.certValidityDays ?? ""}
							onChange={(e) => patch({ certValidityDays: num(e.target.value) })}
							placeholder="مثال: 365"
							className="h-9 text-[12px]"
						/>
					</Labeled>
					<Labeled label="التوقيع باسم">
						<Input
							value={s.certSignatureName ?? ""}
							onChange={(e) => patch({ certSignatureName: e.target.value || null })}
							placeholder="مدير التدريب"
							className="h-9 text-[12px]"
						/>
					</Labeled>
					<Labeled label="نسبة النجاح %">
						<Input
							type="number"
							min={0}
							max={100}
							value={s.certPassMark ?? ""}
							onChange={(e) => patch({ certPassMark: num(e.target.value) })}
							placeholder="مثال: 80"
							className="h-9 text-[12px]"
						/>
					</Labeled>
				</div>
				<div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
					يمكنك معاينة الشهادة
					<button
						type="button"
						onClick={() => setPreviewOpen(true)}
						className="font-semibold text-primary"
					>
						معاينة القالب
					</button>
				</div>
			</ToggleCard>

			{/* 2) إعادة التسجيل — بطاقات اختيار (radio-group-choice-card) */}
			<ToggleCard
				icon={<IconRepeat className="size-5" />}
				title="إعادة التسجيل"
				subtitle="إعادة تسجيل الموظف تلقائيًا بعد فترة"
				enabled={s.reEnrollMode !== "NONE"}
				onToggle={(v) =>
					patch({
						reEnrollMode: v ? "AFTER_COMPLETION" : "NONE",
						reEnrollDays: v ? (s.reEnrollDays ?? 30) : s.reEnrollDays,
					})
				}
			>
				<RadioGroup
					dir="rtl"
					value={s.reEnrollMode}
					onValueChange={(v) => patch({ reEnrollMode: v as ReEnrollMode })}
					className="flex flex-col gap-2.5"
				>
					<FieldLabel htmlFor="reenroll-after">
						<Field orientation="horizontal">
							<FieldContent>
								<FieldTitle className="flex flex-wrap items-center gap-1.5 text-[12px]">
									بعد الإكمال بـ
									<Input
										type="number"
										min={0}
										aria-label="أيام بعد الإكمال"
										value={s.reEnrollDays ?? ""}
										onChange={(e) => patch({ reEnrollDays: num(e.target.value) })}
										className="h-8 w-16 text-center text-[12px]"
									/>
									أيام
								</FieldTitle>
							</FieldContent>
							<RadioGroupItem
								value="AFTER_COMPLETION"
								id="reenroll-after"
							/>
						</Field>
					</FieldLabel>
					<FieldLabel htmlFor="reenroll-before">
						<Field orientation="horizontal">
							<FieldContent>
								<FieldTitle className="flex flex-wrap items-center gap-1.5 text-[12px]">
									قبل انتهاء الشهادة بـ
									<Input
										type="number"
										min={0}
										aria-label="أيام قبل انتهاء الشهادة"
										value={s.reEnrollDays ?? ""}
										onChange={(e) => patch({ reEnrollDays: num(e.target.value) })}
										className="h-8 w-16 text-center text-[12px]"
									/>
									أيام
								</FieldTitle>
							</FieldContent>
							<RadioGroupItem
								value="BEFORE_EXPIRY"
								id="reenroll-before"
							/>
						</Field>
					</FieldLabel>
				</RadioGroup>
			</ToggleCard>

			{/* 3) التحفيز */}
			<ToggleCard
				icon={<IconAward className="size-5" />}
				title="التحفيز"
				subtitle="منح نقاط عند إكمال الدورة"
				enabled={s.gamificationPoints > 0}
				onToggle={(v) => patch({ gamificationPoints: v ? 10 : 0 })}
			>
				<div className="flex items-center gap-2 text-[12px] text-foreground">
					مكافأة إكمال الدورة:
					<Input
						type="number"
						min={0}
						aria-label="نقاط مكافأة الإكمال"
						value={s.gamificationPoints || ""}
						onChange={(e) => patch({ gamificationPoints: Number(e.target.value) || 0 })}
						className="h-8 w-20 text-center text-[12px]"
					/>
					نقطة
				</div>
			</ToggleCard>

			{/* 4) تقييم الدورة */}
			<ToggleCard
				icon={<IconStar className="size-5" />}
				title="تقييم الدورة"
				subtitle="السماح للمتدربين بتقييم الدورة وترك ملاحظات"
				enabled={s.reviewEnabled}
				onToggle={(v) => patch({ reviewEnabled: v })}
			/>

			<CertificatePreviewDialog
				open={previewOpen}
				onOpenChange={setPreviewOpen}
				courseName={course?.name ?? ""}
				signatureName={s.certSignatureName}
				passMark={s.certPassMark}
				referencePattern={s.certReferencePattern}
			/>
		</div>
	);
}
