import { useNavigate, useSearch } from "@tanstack/react-router";
import { useCallback } from "react";

import type { WizardSearch, WizardStep, WizardSubStep } from "./wizard.types";

const ROUTE = "/training/course/$courseId" as const;

// حالة ملاحة المعالج في بارامترات URL — يحاكي useBookingSearchParams تمامًا:
// تغيير الخطوة يدفع سجلًّا جديدًا (زر الرجوع ينتقل بين الخطوات)، وبقيّة التحديثات تستبدل.
export const useCourseWizardParams = () => {
	const search = useSearch({ from: ROUTE }) as WizardSearch;
	const navigate = useNavigate({ from: ROUTE });

	const update = useCallback(
		(patch: Partial<WizardSearch>, opts: { replace?: boolean } = { replace: true }) => {
			void navigate({
				search: (prev) => {
					const next = { ...(prev as WizardSearch), ...patch };
					for (const k of Object.keys(next) as (keyof WizardSearch)[]) {
						if (next[k] === undefined || next[k] === null) delete next[k];
					}
					return next;
				},
				replace: opts.replace ?? true,
			});
		},
		[navigate],
	);

	// تغيير الخطوة يدفع سجلًّا (replace:false) ليعمل زر رجوع المتصفح بين الخطوات
	const setStep = useCallback(
		(step: WizardStep, sub?: WizardSubStep) => update({ step, sub }, { replace: false }),
		[update],
	);

	const setSub = useCallback(
		(sub: WizardSubStep) => update({ sub }, { replace: false }),
		[update],
	);

	const step = (search.step ?? 1) as WizardStep;
	const sub = (search.sub ?? "learners") as WizardSubStep;

	return { search, step, sub, setStep, setSub, update };
};
