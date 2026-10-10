import {
	IconBed,
	IconCalendarPlus,
	IconCircleCheckFilled,
	IconPlus,
	IconSparkles,
} from "@tabler/icons-react";
import { useState } from "react";

import { DateTimePopover } from "@/components/common/date-time-popover";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { RequiredGateBadge } from "@/features/services/operations/components/operation-prep-sections";
import { useGenerateDischargeInstructions } from "@/features/services/operations/hooks/use-operation-ai";
import { useOperationCaseMutations } from "@/features/services/operations/hooks/use-operation-case";
import {
	ClavienDindo,
	ComplicationPhase,
	PainScale,
	PostOpOrderKind,
} from "@/generated/prisma/enums";
import type { OperationCaseDetailResponse } from "@/server/operations/operations.type";
import { RECOVERY_DISCHARGE_SCORE_MIN } from "@sanad/contracts/runtime/server/operations/operations.workflow";

const PAIN_SCALE_LABELS: Record<PainScale, string> = {
	GLASGOW_CMPS: "غلاسكو المركب (بيطري)",
	NRS: "مقياس رقمي NRS",
	VAS: "بصري تناظري VAS",
	FLACC: "FLACC",
	OTHER: "آخر",
};

const ORDER_KIND_LABELS: Record<PostOpOrderKind, string> = {
	MEDICATION: "دواء",
	MONITORING: "مراقبة",
	FEEDING: "تغذية",
	ACTIVITY: "نشاط وحركة",
	WOUND_CARE: "عناية بالجرح",
	FOLLOW_UP: "زيارة متابعة",
	SUTURE_REMOVAL: "إزالة الغرز",
};

const dateTimeFormatter = new Intl.DateTimeFormat("ar", {
	dateStyle: "short",
	timeStyle: "short",
});

const PHASE_LABELS: Record<ComplicationPhase, string> = {
	INTRA_OP: "أثناء الجراحة",
	RECOVERY: "في الإفاقة",
	POST_OP: "بعد الخروج",
};

const CLAVIEN_LABELS: Record<ClavienDindo, string> = {
	GRADE_I: "الدرجة I — بلا تدخل",
	GRADE_II: "الدرجة II — علاج دوائي",
	GRADE_IIIA: "الدرجة IIIa — تدخل بلا تخدير عام",
	GRADE_IIIB: "الدرجة IIIb — تدخل بتخدير عام",
	GRADE_IVA: "الدرجة IVa — فشل عضو",
	GRADE_IVB: "الدرجة IVb — فشل أعضاء متعدد",
	GRADE_V: "الدرجة V — وفاة",
};

export type RecoveryPart = "monitoring" | "discharge" | "all";

export function OperationRecoveryTab({
	operationCase: c,
	part = "all",
}: {
	operationCase: OperationCaseDetailResponse;
	/** قسم المرحلة الظاهر — المراقبة تقيّم الإفاقة، والخروج يصدر الأوامر */
	part?: RecoveryPart;
}) {
	const showMonitoring = part === "monitoring" || part === "all";
	const showDischarge = part === "discharge" || part === "all";
	const mutations = useOperationCaseMutations(c.id);
	const [score, setScore] = useState("");
	const [painScale, setPainScale] = useState<PainScale>(PainScale.GLASGOW_CMPS);
	const [painScore, setPainScore] = useState("");
	const [notes, setNotes] = useState("");
	const [orderKind, setOrderKind] = useState<PostOpOrderKind>(PostOpOrderKind.MEDICATION);
	const { generateInstructions, isPending: isGeneratingInstructions } =
		useGenerateDischargeInstructions();
	const [instructions, setInstructions] = useState("");
	const [dueAt, setDueAt] = useState("");

	const latestScore = c.recoveryAssessments.find((a) => a.score != null)?.score ?? null;
	const dischargeReady = latestScore != null && latestScore >= RECOVERY_DISCHARGE_SCORE_MIN;

	const addAssessment = () => {
		void mutations
			.addRecovery({
				score: score !== "" ? Number(score) : null,
				painScale: painScore !== "" ? painScale : null,
				painScore: painScore !== "" ? Number(painScore) : null,
				notes: notes || null,
			})
			.then(() => {
				setScore("");
				setPainScore("");
				setNotes("");
			})
			.catch(() => {});
	};

	const addOrder = () => {
		if (!instructions.trim()) return;
		void mutations
			.addPostOpOrder({
				kind: orderKind,
				instructions: instructions.trim(),
				dueAt: dueAt ? new Date(dueAt).toISOString() : null,
			})
			.then(() => {
				setInstructions("");
				setDueAt("");
			})
			.catch(() => {});
	};

	return (
		<div className="flex flex-col gap-5">
			{/* درجة الإفاقة */}
			{showMonitoring && (
				<div className="flex flex-col gap-2">
					<div className="flex items-center justify-between">
						<h4 className="flex items-center gap-1.5 text-sm font-semibold">
							<IconBed className="size-4 text-muted-foreground" />
							تقييم الإفاقة (بوابة G8 — الحد {RECOVERY_DISCHARGE_SCORE_MIN}/10)
							{c.tier !== "MINOR" && <RequiredGateBadge met={dischargeReady} />}
						</h4>
						{latestScore != null && (
							<Badge
								variant="outline"
								className={
									dischargeReady
										? "gap-1 border-emerald-200 bg-emerald-50 text-[10px] text-emerald-700"
										: "gap-1 border-amber-200 bg-amber-50 text-[10px] text-amber-700"
								}
							>
								{dischargeReady && <IconCircleCheckFilled className="size-3" />}
								آخر درجة: {latestScore}/10
							</Badge>
						)}
					</div>

					<div className="flex flex-col gap-2 rounded-md border p-2.5">
						<div className="flex flex-wrap items-center gap-1.5">
							<Input
								className="h-8 w-24 text-xs"
								type="number"
								min={0}
								max={10}
								placeholder="درجة 0–10"
								value={score}
								onChange={(e) => setScore(e.target.value)}
							/>
							<Select
								value={painScale}
								onValueChange={(v) => setPainScale(v as PainScale)}
							>
								<SelectTrigger
									size="sm"
									dir="rtl"
									className="w-40"
								>
									<SelectValue />
								</SelectTrigger>
								<SelectContent
									position="popper"
									dir="rtl"
								>
									{Object.values(PainScale).map((s) => (
										<SelectItem
											key={s}
											value={s}
										>
											{PAIN_SCALE_LABELS[s]}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
							<Input
								className="h-8 w-24 text-xs"
								type="number"
								min={0}
								placeholder="درجة الألم"
								value={painScore}
								onChange={(e) => setPainScore(e.target.value)}
							/>
						</div>
						<div className="flex items-center gap-1.5">
							<Input
								className="h-8 flex-1 text-xs"
								placeholder="ملاحظات (وعي، تنفس، حرارة...)"
								value={notes}
								onChange={(e) => setNotes(e.target.value)}
							/>
							<Button
								size="sm"
								disabled={mutations.isPending || (score === "" && painScore === "")}
								onClick={addAssessment}
							>
								<IconPlus className="size-3.5" />
								تسجيل
							</Button>
						</div>
					</div>

					{c.recoveryAssessments.length > 0 && (
						<div className="flex flex-col gap-1">
							{c.recoveryAssessments.map((a) => (
								<div
									key={a.id}
									className="flex items-center gap-2 rounded-md bg-muted/30 px-2.5 py-1.5 text-xs"
								>
									<span className="shrink-0 font-medium tabular-nums">
										{dateTimeFormatter.format(new Date(a.at))}
									</span>
									{a.score != null && (
										<Badge
											variant="outline"
											className="shrink-0 text-[10px] tabular-nums"
										>
											إفاقة {a.score}/10
										</Badge>
									)}
									{a.painScore != null && (
										<Badge
											variant="outline"
											className="shrink-0 text-[10px] tabular-nums"
										>
											ألم {a.painScore}
											{a.painScale ? ` (${PAIN_SCALE_LABELS[a.painScale]})` : ""}
										</Badge>
									)}
									{a.notes && <span className="truncate">{a.notes}</span>}
									<span className="ms-auto shrink-0 text-[10px] text-muted-foreground">
										{a.assessedBy.name}
									</span>
								</div>
							))}
						</div>
					)}
				</div>
			)}

			{/* أوامر ما بعد الجراحة */}
			{showDischarge && (
				<div className="flex flex-col gap-2">
					<h4 className="flex items-center gap-1.5 text-sm font-semibold">
						أوامر ما بعد الجراحة وتعليمات الخروج (بوابة G9)
						<RequiredGateBadge met={c.postOpOrders.length > 0} />
					</h4>
					<div className="flex flex-col gap-2 rounded-md border p-2.5">
						<div className="flex flex-wrap items-center gap-1.5">
							<Select
								value={orderKind}
								onValueChange={(v) => setOrderKind(v as PostOpOrderKind)}
							>
								<SelectTrigger
									size="sm"
									dir="rtl"
									className="w-36"
								>
									<SelectValue />
								</SelectTrigger>
								<SelectContent
									position="popper"
									dir="rtl"
								>
									{Object.values(PostOpOrderKind).map((k) => (
										<SelectItem
											key={k}
											value={k}
										>
											{ORDER_KIND_LABELS[k]}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
							{(orderKind === "FOLLOW_UP" || orderKind === "SUTURE_REMOVAL") && (
								<DateTimePopover
									value={dueAt ? new Date(dueAt) : null}
									onChange={(d) => setDueAt(d.toISOString())}
									placeholder="موعد الاستحقاق"
									className="h-8 w-52 text-xs"
								/>
							)}
							{/* الأزرار في صف النوع نفسه — النص وحده يأخذ السطر التالي */}
							<div className="ms-auto flex items-center gap-1.5">
								<Button
									size="sm"
									variant="outline"
									className="gap-1"
									disabled={isGeneratingInstructions}
									title="مسودة تعليمات الخروج بالذكاء الاصطناعي"
									onClick={() => {
										void generateInstructions({ caseId: c.id })
											.then(({ instructions: draft }) => setInstructions(draft))
											.catch(() => {});
									}}
								>
									<IconSparkles className="size-3.5 text-amber-500" />
									{isGeneratingInstructions ? "جارٍ..." : "صياغة"}
								</Button>
								<Button
									size="sm"
									disabled={mutations.isPending || !instructions.trim()}
									onClick={addOrder}
								>
									<IconPlus className="size-3.5" />
									إصدار
								</Button>
							</div>
						</div>
						<Textarea
							rows={2}
							className="text-xs"
							placeholder="التعليمات — مثال: أموكسيسيلين 12.5 مغ/كغ فمويًا كل 12 ساعة لمدة 7 أيام"
							value={instructions}
							onChange={(e) => setInstructions(e.target.value)}
						/>
						<p className="text-[10px] text-muted-foreground">
							أمر «زيارة متابعة» أو «إزالة الغرز» بموعدٍ يُنشئ زيارة المتابعة آليًا عند الانتقال
							إلى «المتابعة».
						</p>
					</div>

					{c.postOpOrders.length === 0 ? (
						<p className="rounded-md border bg-muted/30 p-3 text-xs text-muted-foreground">
							لا أوامر بعد — إصدار أوامر الخروج شرط مغادرة «الخروج» (G9)
						</p>
					) : (
						<div className="flex flex-col gap-1">
							{c.postOpOrders.map((o) => (
								<div
									key={o.id}
									className="flex items-center gap-2 rounded-md bg-muted/30 px-2.5 py-1.5 text-xs"
								>
									<Badge
										variant="outline"
										className="shrink-0 text-[10px]"
									>
										{ORDER_KIND_LABELS[o.kind]}
									</Badge>
									<span className="truncate">{o.instructions}</span>
									{o.dueAt && (
										<span className="shrink-0 text-[10px] text-muted-foreground tabular-nums">
											{dateTimeFormatter.format(new Date(o.dueAt))}
										</span>
									)}
									{o.followUpAppointmentId && (
										<Badge
											variant="outline"
											className="ms-auto shrink-0 gap-1 border-emerald-200 bg-emerald-50 text-[10px] text-emerald-700"
										>
											<IconCalendarPlus className="size-3" />
											زيارة منشأة
										</Badge>
									)}
								</div>
							))}
						</div>
					)}
				</div>
			)}

			{/* المضاعفات (S17، S18، S19) تُرصد في المراقبة — وتبقى في العرض الكامل */}
			{showMonitoring && <ComplicationsSection operationCase={c} />}
		</div>
	);
}

function ComplicationsSection({
	operationCase: c,
}: {
	operationCase: OperationCaseDetailResponse;
}) {
	const mutations = useOperationCaseMutations(c.id);
	const [phase, setPhase] = useState<ComplicationPhase>(ComplicationPhase.POST_OP);
	const [grade, setGrade] = useState<ClavienDindo | "">("");
	const [isSSI, setIsSSI] = useState(false);
	const [kind, setKind] = useState("");
	const [detail, setDetail] = useState("");

	const ssiWindowOpen =
		c.ssiSurveillanceUntil && new Date(c.ssiSurveillanceUntil) > new Date();

	const addComplication = () => {
		if (!kind.trim()) return;
		void mutations
			.addComplication({
				phase,
				clavienDindoGrade: grade || null,
				isSSI,
				kind: kind.trim(),
				detail: detail || null,
			})
			.then(() => {
				setKind("");
				setDetail("");
				setIsSSI(false);
				setGrade("");
			})
			.catch(() => {});
	};

	return (
		<div className="flex flex-col gap-2">
			<div className="flex items-center justify-between">
				<h4 className="text-sm font-semibold">المضاعفات (Clavien-Dindo)</h4>
				{ssiWindowOpen && (
					<Badge
						variant="outline"
						className="border-amber-200 bg-amber-50 text-[10px] text-amber-700"
					>
						نافذة ترصّد العدوى مفتوحة حتى{" "}
						{dateTimeFormatter.format(new Date(c.ssiSurveillanceUntil as unknown as string))}
					</Badge>
				)}
			</div>

			<div className="flex flex-col gap-2 rounded-md border p-2.5">
				<div className="flex flex-wrap items-center gap-1.5">
					<Select
						value={phase}
						onValueChange={(v) => setPhase(v as ComplicationPhase)}
					>
						<SelectTrigger
							size="sm"
							dir="rtl"
							className="w-32"
						>
							<SelectValue />
						</SelectTrigger>
						<SelectContent
							position="popper"
							dir="rtl"
						>
							{Object.values(ComplicationPhase).map((p) => (
								<SelectItem
									key={p}
									value={p}
								>
									{PHASE_LABELS[p]}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
					<Select
						value={grade}
						onValueChange={(v) => setGrade(v as ClavienDindo)}
					>
						<SelectTrigger
							size="sm"
							dir="rtl"
							className="w-56"
						>
							<SelectValue placeholder="تصنيف Clavien-Dindo (اختياري)" />
						</SelectTrigger>
						<SelectContent
							position="popper"
							dir="rtl"
						>
							{Object.values(ClavienDindo).map((g) => (
								<SelectItem
									key={g}
									value={g}
								>
									{CLAVIEN_LABELS[g]}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
					<div className="flex items-center gap-1 text-[11px] text-muted-foreground">
						عدوى موضع الجراحة
						<Switch
							size="sm"
							checked={isSSI}
							onCheckedChange={setIsSSI}
							aria-label="عدوى موضع الجراحة"
						/>
					</div>
				</div>
				<div className="flex items-center gap-1.5">
					<Input
						className="h-8 w-48 text-xs"
						placeholder="نوع المضاعفة (نزيف، تفزّر جرح...)"
						value={kind}
						onChange={(e) => setKind(e.target.value)}
					/>
					<Input
						className="h-8 flex-1 text-xs"
						placeholder="التفاصيل"
						value={detail}
						onChange={(e) => setDetail(e.target.value)}
					/>
					<Button
						size="sm"
						disabled={mutations.isPending || !kind.trim()}
						onClick={addComplication}
					>
						<IconPlus className="size-3.5" />
						تسجيل
					</Button>
				</div>
			</div>

			{c.complications.length > 0 && (
				<div className="flex flex-col gap-1">
					{c.complications.map((comp) => (
						<div
							key={comp.id}
							className="flex items-center gap-2 rounded-md border border-red-100 bg-red-50/50 px-2.5 py-1.5 text-xs dark:border-red-900 dark:bg-red-950/30"
						>
							<span className="shrink-0 font-medium tabular-nums">
								{dateTimeFormatter.format(new Date(comp.occurredAt))}
							</span>
							<Badge
								variant="outline"
								className="shrink-0 text-[10px]"
							>
								{PHASE_LABELS[comp.phase]}
							</Badge>
							{comp.clavienDindoGrade && (
								<Badge
									variant="outline"
									className="shrink-0 border-red-200 bg-red-50 text-[10px] text-red-700"
								>
									{CLAVIEN_LABELS[comp.clavienDindoGrade]}
								</Badge>
							)}
							{comp.isSSI && (
								<Badge
									variant="outline"
									className="shrink-0 border-red-200 bg-red-50 text-[10px] text-red-700"
								>
									SSI
								</Badge>
							)}
							<span className="truncate font-medium">{comp.kind}</span>
							{comp.detail && (
								<span className="truncate text-muted-foreground">{comp.detail}</span>
							)}
							<span className="ms-auto shrink-0 text-[10px] text-muted-foreground">
								{comp.reportedBy.name}
							</span>
						</div>
					))}
				</div>
			)}
		</div>
	);
}
