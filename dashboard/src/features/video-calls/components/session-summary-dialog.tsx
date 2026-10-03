import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useClinicalExam } from "@/features/appointments/hooks/use-clinical-exam";
import { useEndRemoteSession } from "@/features/video-calls/hooks/use-end-remote-session";
import { AppointmentStatus, type ClinicalSymptom } from "@/generated/prisma/enums";

// تسميات عرض فقط — القيم مصدرها Prisma enums
const SYMPTOM_LABELS: Record<ClinicalSymptom, string> = {
	VOMITING: "قيء",
	DIARRHEA: "إسهال",
	COUGH: "سعال",
	SNEEZING: "عطس",
	LETHARGY: "خمول",
};
const SEVERITY_LABELS: Partial<Record<string, string>> = {
	MILD: "خفيف",
	MODERATE: "متوسطة",
	SEVERE: "شديد",
	CRITICAL: "حرج",
};

const SummarySection = ({ title, children }: { title: string; children: React.ReactNode }) => (
	<div className="rounded-lg bg-muted/60 p-3">
		<p className="text-sm font-semibold">{title}</p>
		<div className="mt-1.5 flex flex-col gap-1">{children}</div>
	</div>
);

const SummaryRow = ({ label, value }: { label: string; value: string | null | undefined }) =>
	value ? (
		<div className="flex items-start justify-between gap-3">
			<span className="shrink-0 text-xs text-muted-foreground">{label}</span>
			<span className="text-end text-sm">{value}</span>
		</div>
	) : null;

// نافذة "تلخيص الجلسة": تعرض بيانات التشخيص (الفحص السريري) كاملة،
// وزر "إنهاء الجلسة" ينقل الزيارة للمرحلة التالية في سير العمل
export const SessionSummaryDialog = ({
	appointmentId,
	status,
	patientName,
	open,
	onOpenChange,
	onEnded,
}: {
	appointmentId: string;
	status: AppointmentStatus;
	patientName: string;
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onEnded: () => void;
}) => {
	const { exam, isLoading } = useClinicalExam(open ? appointmentId : null);
	const { endSession, isPending } = useEndRemoteSession();

	// الدفع تم قبل الجلسة — الإنهاء ينقل الزيارة مباشرة إلى "تمت"
	const canEnd =
		status === AppointmentStatus.IN_SERVICE || status === AppointmentStatus.AWAITING_PAYMENT;
	const examCompleted = !!exam?.completedAt;

	const handleEndSession = async () => {
		if (!canEnd) return;
		try {
			await endSession({ id: appointmentId, status });
		} catch {
			return;
		}
		onOpenChange(false);
		onEnded();
	};

	const symptoms = (exam?.symptoms ?? []).map((s) => SYMPTOM_LABELS[s] ?? s).join("، ");
	const vitals = exam?.vitalsRecord ?? null;

	return (
		<Dialog
			open={open}
			onOpenChange={onOpenChange}
		>
			<DialogContent
				dir="rtl"
				className="max-h-[85svh] grid-rows-[auto_minmax(0,1fr)_auto] gap-0 p-0 sm:max-w-lg"
			>
				<DialogHeader className="border-b px-4 py-2">
					<DialogTitle className="text-base">تلخيص الجلسة — {patientName}</DialogTitle>
				</DialogHeader>

				<div className="flex flex-col gap-2.5 overflow-y-auto p-4">
					{isLoading ? (
						<p className="py-6 text-center text-sm text-muted-foreground">جارٍ التحميل...</p>
					) : !exam ? (
						<p className="py-6 text-center text-sm text-muted-foreground">
							لم يبدأ الفحص السريري بعد — ابدأ التشخيص من تبويب "التشخيص" أولًا
						</p>
					) : (
						<>
							<SummarySection title="الشكوى والأعراض">
								<SummaryRow
									label="الشكوى الرئيسية"
									value={exam.chiefComplaint}
								/>
								<SummaryRow
									label="المدة"
									value={exam.duration}
								/>
								<SummaryRow
									label="الأعراض"
									value={symptoms || null}
								/>
								<SummaryRow
									label="تاريخ الحالة"
									value={exam.presentIllnessHistory}
								/>
								<SummaryRow
									label="ملاحظات وليّ الأمر"
									value={exam.ownerNotes}
								/>
							</SummarySection>

							{/* القيم من لقطة القياس المرتبطة بالفحص — ما رآه المدرّب وقت الزيارة */}
							<SummarySection title="العلامات الحيوية">
								<SummaryRow
									label="الوزن"
									value={vitals?.weight ? `${vitals.weight} كجم` : null}
								/>
								<SummaryRow
									label="الحرارة"
									value={vitals?.temperature ? `${vitals.temperature}°` : null}
								/>
								<SummaryRow
									label="النبض"
									value={vitals?.heartRate ? `${vitals.heartRate} نبضة/د` : null}
								/>
								<SummaryRow
									label="التنفس"
									value={vitals?.respiratoryRate ? `${vitals.respiratoryRate}/د` : null}
								/>
								<SummaryRow
									label="الأكسجين"
									value={vitals?.oxygenSaturation ? `${vitals.oxygenSaturation}%` : null}
								/>
								<SummaryRow
									label="ضغط الدم"
									value={vitals?.bloodPressure ?? null}
								/>
							</SummarySection>

							<SummarySection title="التشخيص">
								<SummaryRow
									label="التشخيص المبدئي"
									value={exam.preliminaryDiagnosis}
								/>
								<SummaryRow
									label="الخطورة"
									value={
										exam.severity ? (SEVERITY_LABELS[exam.severity] ?? exam.severity) : null
									}
								/>
								<SummaryRow
									label="الوصف"
									value={exam.diagnosisDescription}
								/>
							</SummarySection>

							<SummarySection title="خطة العلاج">
								<SummaryRow
									label="الخطة الغذائية"
									value={exam.dietPlan}
								/>
								<SummaryRow
									label="خطة المتابعة"
									value={exam.monitoringPlan}
								/>
							</SummarySection>
						</>
					)}
				</div>

				<div className="flex flex-col gap-2 border-t px-4 py-2">
					{!examCompleted && exam && (
						<p className="text-xs text-amber-600">
							أكمل خطوات الفحص السريري من تبويب "التشخيص" لتتمكن من إنهاء الجلسة
						</p>
					)}
					<div className="flex items-center gap-2">
						<Button
							type="button"
							className="flex-1"
							onClick={() => void handleEndSession()}
							disabled={isPending || !canEnd || !examCompleted}
						>
							إنهاء الجلسة
						</Button>
						<Button
							type="button"
							variant="outline"
							className="text-foreground"
							onClick={() => onOpenChange(false)}
						>
							إغلاق
						</Button>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
};
