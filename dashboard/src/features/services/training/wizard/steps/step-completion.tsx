import {
	IconAward,
	IconRepeat,
	IconRosetteDiscountCheck,
	IconStar,
} from "@tabler/icons-react";
import type { ReactNode } from "react";
import { useState } from "react";

import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import type { CourseDetailResponse, ReEnrollMode } from "@/server/training/training.type";
import { useCompletionSettings } from "../../hooks/use-completion-settings";
import { CertificatePreviewModal } from "./certificate-preview-modal";

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

// بطاقة قابلة للتفعيل — عند التفعيل يتمدّد المحتوى ويُبرز الحدّ
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
				"flex flex-col rounded-2xl border bg-white transition-colors",
				enabled ? "border-primary ring-1 ring-primary/30" : "border-[#E7E7EE]",
			)}
		>
			<div className="flex items-center gap-3 p-4">
				<span
					className={cn(
						"flex size-9 shrink-0 items-center justify-center rounded-xl",
						enabled ? "bg-primary/10 text-primary" : "bg-[#F0F0F5] text-[#9B9B9D]",
					)}
				>
					{icon}
				</span>
				<div className="flex min-w-0 flex-1 flex-col">
					<span className="text-[13px] font-bold text-[#08090A]">{title}</span>
					<span className="text-[11px] text-[#6B6B67]">{subtitle}</span>
				</div>
				<Switch
					checked={enabled}
					onCheckedChange={onToggle}
				/>
			</div>
			{enabled && children && (
				<div className="flex flex-col gap-3 border-t border-[#F0F0F5] p-4">{children}</div>
			)}
		</div>
	);
}

function Labeled({ label, children }: { label: string; children: ReactNode }) {
	return (
		<div className="flex flex-col gap-1.5">
			<span className="text-[12px] font-medium text-[#08090A]">{label}</span>
			{children}
		</div>
	);
}

export function StepCompletion({
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

	// تحديث + حفظ فوري (autosave لكل خطوة)
	const patch = (p: Partial<Settings>) => {
		const next = { ...s, ...p };
		setS(next);
		saveCompletion(next);
	};

	return (
		<div className="mx-auto flex w-full max-w-[720px] flex-col gap-4 py-6">
			<div className="flex flex-col gap-1">
				<h2 className="text-[15px] font-bold text-[#08090A]">الإكمال</h2>
				<p className="text-[12px] text-[#6B6B67]">
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
							className="h-9 text-[13px]"
						/>
					</Labeled>
					<Labeled label="فترة الصلاحية (أيام)">
						<Input
							type="number"
							min={0}
							value={s.certValidityDays ?? ""}
							onChange={(e) => patch({ certValidityDays: num(e.target.value) })}
							placeholder="مثال: 365"
							className="h-9 text-[13px]"
						/>
					</Labeled>
					<Labeled label="التوقيع باسم">
						<Input
							value={s.certSignatureName ?? ""}
							onChange={(e) => patch({ certSignatureName: e.target.value || null })}
							placeholder="مدير التدريب"
							className="h-9 text-[13px]"
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
							className="h-9 text-[13px]"
						/>
					</Labeled>
				</div>
				<div className="flex items-center gap-1.5 text-[11px] text-[#6B6B67]">
					يمكنك معاينة الشهادة
					<button
						type="button"
						onClick={() => setPreviewOpen(true)}
						className="font-semibold text-primary"
					>
						معاينة القوالب
					</button>
				</div>
			</ToggleCard>

			{/* 2) إعادة التسجيل */}
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
					className="flex flex-col gap-3"
				>
					<div className="flex items-center gap-2">
						<RadioGroupItem
							value="AFTER_COMPLETION"
							id="reenroll-after"
						/>
						<label
							htmlFor="reenroll-after"
							className="flex items-center gap-1.5 text-[12px] text-[#08090A]"
						>
							<Input
								type="number"
								min={0}
								value={s.reEnrollDays ?? ""}
								onChange={(e) => patch({ reEnrollDays: num(e.target.value) })}
								className="h-8 w-16 text-center text-[12px]"
							/>
							أيام بعد الإكمال
						</label>
					</div>
					<div className="flex items-center gap-2">
						<RadioGroupItem
							value="BEFORE_EXPIRY"
							id="reenroll-before"
						/>
						<label
							htmlFor="reenroll-before"
							className="text-[12px] text-[#08090A]"
						>
							أيام قبل انتهاء الشهادة
						</label>
					</div>
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
				<div className="flex items-center gap-2 text-[12px] text-[#08090A]">
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

			<CertificatePreviewModal
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
