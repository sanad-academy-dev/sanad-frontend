import { useNavigate } from "@tanstack/react-router";
import { useCallback, useEffect, useRef, useState } from "react";

import { showSuccessToast } from "@/components/common/success-toast";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import type { CreateCourseFormInput } from "@/server/training/training.type";
import { useCourse, useCreateCourse, useUpdateCourse } from "../hooks/use-courses";
import { CloseDraftDialog } from "./components/close-draft-dialog";
import { WizardProgress } from "./components/wizard-progress";
import { WizardTopBar } from "./components/wizard-top-bar";
import { StepAssignLearners } from "./steps/step-assign-learners";
import { StepAssignTime } from "./steps/step-assign-time";
import { type Step1Handle, StepBasicInfo } from "./steps/step-basic-info";
import { StepCompletion } from "./steps/step-completion";
import { StepContent } from "./steps/step-content";
import { useCourseWizardParams } from "./use-course-wizard-params";
import { nextStepHint, type WizardStep } from "./wizard.types";

export function CourseWizard({ courseId }: { courseId: string }) {
	const creating = courseId === "new";
	const navigate = useNavigate();
	const { step, sub, setStep, setSub } = useCourseWizardParams();

	const { course, isLoading: isLoadingCourse } = useCourse(creating ? null : courseId);
	const { createCourse, isPending: isCreating } = useCreateCourse();
	const { updateCourse, isUpdating } = useUpdateCourse(creating ? null : courseId);

	const step1Ref = useRef<Step1Handle>(null);
	const [step1Valid, setStep1Valid] = useState(false);
	const [closeOpen, setCloseOpen] = useState(false);
	const [finishing, setFinishing] = useState(false);

	// بمجرد وجود الدورة تُصبح كل الخطوات قابلة للوصول (المحتوى/المتدربون اختياريان هنا)
	const furthest: WizardStep = creating || !course ? 1 : 4;

	// اضبط الخطوة إن أشار الرابط إلى ما هو أبعد مما هو متاح (deep-link/رجوع بعد مسح بيانات).
	// لا نخفض الخطوة أثناء تحميل دورة قائمة (course مؤقتًا undefined) وإلا يقفز deep-link للخطوة 1.
	useEffect(() => {
		if (!creating && isLoadingCourse) return;
		if (step > furthest) setStep(furthest);
	}, [step, furthest, setStep, creating, isLoadingCourse]);

	const canContinue = step === 1 ? step1Valid : true; // الخطوات 2-4: المتابعة متاحة (المحتوى/الإعدادات اختيارية)
	const isBusy = isCreating || isUpdating || finishing;

	const saveStep1 = useCallback(
		async (
			values: CreateCourseFormInput & { coverKey?: string | null },
		): Promise<string | null> => {
			if (creating) {
				const c = await createCourse(values);
				return c.id;
			}
			await updateCourse(values).catch(() => null);
			return courseId;
		},
		[creating, createCourse, updateCourse, courseId],
	);

	const goToList = () => navigate({ to: "/services/training" });

	const finish = async () => {
		setFinishing(true);
		try {
			if (!creating) await updateCourse({ status: "PUBLISHED" }).catch(() => null);
			goToList();
			showSuccessToast("تهانينا! تم إنشاء الدورة التدريبية بنجاح", {
				iconAtStart: true,
			});
		} finally {
			setFinishing(false);
		}
	};

	const handleContinue = async () => {
		if (step === 1) {
			const id = await step1Ref.current?.submit();
			if (id)
				navigate({
					to: "/training/course/$courseId",
					params: { courseId: id },
					search: { step: 2 },
				});
			return;
		}
		if (step === 2) return setStep(3, "learners");
		if (step === 3 && sub === "learners") return setSub("time");
		if (step === 3) return setStep(4);
		if (step === 4) return finish();
	};

	const saveDraft = async () => {
		if (creating) {
			const id = await step1Ref.current?.submit();
			if (!id) return; // النموذج غير صالح — لا شيء لحفظه بعد
		}
		showSuccessToast("تم حفظ المسودة", { iconAtStart: true });
		goToList();
	};

	return (
		<div className="flex min-h-svh flex-col overflow-x-hidden bg-background">
			<WizardTopBar
				step={step}
				sub={sub}
				furthest={furthest}
				onStepChange={(s) => setStep(s)}
				hint={nextStepHint(step, sub)}
				canContinue={canContinue}
				isBusy={isBusy}
				onContinue={handleContinue}
				onClose={() => setCloseOpen(true)}
			/>
			<WizardProgress current={step} />

			{/* لوحة الخطوة */}
			<div className="min-h-0 flex-1 overflow-y-auto">
				{step === 1 && (
					<StepBasicInfo
						ref={step1Ref}
						course={course}
						onValidityChange={setStep1Valid}
						onSave={saveStep1}
					/>
				)}
				{step === 2 && !creating && (
					<StepContent
						course={course}
						courseId={courseId}
					/>
				)}
				{step === 3 && sub === "learners" && !creating && (
					<StepAssignLearners courseId={courseId} />
				)}
				{step === 3 && sub === "time" && !creating && (
					<StepAssignTime
						course={course}
						courseId={courseId}
					/>
				)}
				{step === 4 && !creating && (
					<StepCompletion
						course={course}
						courseId={courseId}
					/>
				)}
			</div>

			{/* الفوتر — حفظ كمسودة */}
			<div className="flex shrink-0 items-center justify-between border-t border-[#E7E7EE] bg-white px-4 py-2.5">
				<Button
					type="button"
					variant="ghost"
					onClick={saveDraft}
					disabled={isBusy}
					className="h-9 rounded-lg px-3 text-[13px] font-medium text-[#6B6B67]"
				>
					حفظ كمسودة
				</Button>
				<span className="text-[11px] text-[#C4C4CC]">يُحفظ تقدّمك تلقائيًا في كل خطوة</span>
			</div>

			<CloseDraftDialog
				open={closeOpen}
				onOpenChange={setCloseOpen}
				onSaveDraft={saveDraft}
				onDiscard={goToList}
				isSaving={isBusy}
			/>

			{/* غطاء تحميل حاجب عند الإنهاء */}
			{finishing && (
				<div className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-4 bg-white/80 backdrop-blur">
					<Spinner className="size-8 text-primary" />
					<p className="text-[14px] font-medium text-[#08090A]">
						الرجاء الانتظار قليلاً — جاري إنشاء الدورة التدريبية
					</p>
				</div>
			)}
		</div>
	);
}
