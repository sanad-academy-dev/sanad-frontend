import { IconArrowDown, IconCircleCheckFilled } from "@tabler/icons-react";
import { useCallback, useEffect, useState } from "react";

import { SignaturePad } from "@/components/common/signature-pad";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SignatureMethod } from "@/generated/prisma/enums";
import type { PatientConsentDetailResponse } from "@/server/patient-consents/patient-consents.type";

// وضع توقيع وليّ الأمر — الجهاز يُسلَّم لصاحب الطفل. الشاشة تخصّه هو لا الموظّف:
// نصّ كبير، ولا حقول تحرير، ولوح التوقيع لا يُفتح قبل بلوغ آخر المستند.
//
// البوابة ليست زينة: التوقيع إقرار بأن صاحبه قرأ ما وقّع عليه، ولوح توقيع
// متاح من أول سطر يجعل ذلك الإقرار كذبًا مريحًا.

/** هامش السماح بالبكسل — التمرير الفعلي نادرًا ما يبلغ القاع بالضبط */
const SCROLL_END_SLACK = 24;

export const ConsentOwnerSigning = ({
	consent,
	open,
	onOpenChange,
	onSign,
	isPending,
}: {
	consent: PatientConsentDetailResponse;
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onSign: (values: { signerName: string; signatureUrl: string }) => Promise<unknown>;
	isPending: boolean;
}) => {
	/**
	 * العنصر يُلتقط بمرجع دالّي لا بـ`useRef`.
	 *
	 * محتوى الحوار يعيش في بوّابة Radix، ولا يدخل الشجرة في نفس اللقطة التي
	 * تُقلب فيها `open` — فأثر يقرأ `ref.current` عند تلك اللقطة يجده فارغًا،
	 * يخرج باكرًا، ولا يعود: تبعياته لم تتغيّر. تلك كانت البوابة المقفلة بلا
	 * مخرج — لا قياس جرى أصلًا. المرجع الدالّي يوقظنا حين يُركَّب العنصر فعلًا.
	 */
	const [scrollEl, setScrollEl] = useState<HTMLDivElement | null>(null);
	const [reachedEnd, setReachedEnd] = useState(false);
	const [signerName, setSignerName] = useState("");
	const [signatureUrl, setSignatureUrl] = useState<string | null>(null);

	// إعادة الضبط عند الفتح وحده. كانت مربوطة باسم وليّ الأمر أيضًا، فأيّ تحديث
	// يصل من الخادم كان يُقفل البوابة على من بلغ آخر المستند فعلًا.
	useEffect(() => {
		if (!open) return;
		setReachedEnd(false);
		setSignatureUrl(null);
	}, [open]);

	useEffect(() => {
		setSignerName(consent.owner?.name ?? "");
	}, [consent.owner?.name]);

	const measure = useCallback(() => {
		if (!scrollEl) return;
		const left = scrollEl.scrollHeight - scrollEl.scrollTop - scrollEl.clientHeight;
		// مستند لا يحتاج تمريرًا تُفتح بوابته فورًا بدل أن تُقفل بلا مخرج
		if (left <= SCROLL_END_SLACK) setReachedEnd(true);
	}, [scrollEl]);

	/**
	 * القياس مستمرّ لا لحظيّ.
	 *
	 * قياسٌ واحد عند الفتح يكذب: ارتفاع المستند يتغيّر بعده — خطوط تُحمَّل،
	 * جهاز يُدار، نصّ محدَّث يصل من الخادم. فإن قِيس قبل أن يستقرّ التخطيط
	 * بقيت البوابة مقفلة على مستند لا فائض فيه أصلًا، ولا سبيل لفتحها.
	 */
	useEffect(() => {
		if (!open || !scrollEl) return;
		measure();
		const observer = new ResizeObserver(measure);
		observer.observe(scrollEl);
		if (scrollEl.firstElementChild) observer.observe(scrollEl.firstElementChild);
		return () => observer.disconnect();
	}, [open, scrollEl, measure]);

	/**
	 * مخرجٌ صريح إلى آخر المستند.
	 *
	 * الفائض قد يكون عشرات البكسلات لا أكثر، فيسحب القارئ الشاشة ولا يرى شيئًا
	 * يتحرّك فيحسب البوابة معطّلة. الزرّ لا يُسقط شرط بلوغ النهاية — يوصِّل إليها.
	 */
	const jumpToEnd = () => {
		if (!scrollEl) return;
		scrollEl.scrollTo({ top: scrollEl.scrollHeight, behavior: "smooth" });
		// بعض المتصفّحات لا تُطلق onScroll على آخر بكسل من تمرير ناعم
		window.setTimeout(measure, 500);
	};

	const canSign = reachedEnd && !!signatureUrl && signerName.trim().length > 0;

	return (
		<Dialog
			open={open}
			onOpenChange={onOpenChange}
		>
			<DialogContent
				dir="rtl"
				showCloseButton={false}
				// نافذة كبيرة لا شاشة كاملة: تبقى ورقة الطفل خلفها مرئية، والمستند يمرَّر داخلها
				className="flex max-h-[90dvh] w-[min(100vw-2rem,56rem)] max-w-none flex-col gap-0 p-0 sm:max-w-none"
			>
				<div className="flex items-center justify-between border-b px-4 py-2">
					<DialogTitle className="text-lg font-semibold">
						{consent.template?.titleAr ?? "الموافقة"}
					</DialogTitle>
					<span className="text-sm text-muted-foreground">
						{consent.patient.name} — {consent.owner.name}
					</span>
				</div>

				{/* المستند — نصّ كبير مريح للقراءة على جهاز يُمسك باليد */}
				<div
					ref={setScrollEl}
					onScroll={measure}
					className="flex-1 overflow-y-auto px-6 py-5"
				>
					<pre className="mx-auto max-w-3xl whitespace-pre-wrap font-sans text-base leading-8">
						{consent.textSnapshot}
					</pre>
				</div>

				<div className="border-t px-6 py-3">
					{!reachedEnd ? (
						<div className="mx-auto flex max-w-3xl flex-col items-center gap-2 py-1">
							<div className="flex items-center gap-2 text-sm text-muted-foreground">
								<IconArrowDown className="size-4 animate-bounce" />
								يرجى قراءة النموذج حتى نهايته ليُفتح التوقيع
							</div>
							<Button
								type="button"
								variant="outline"
								size="sm"
								onClick={jumpToEnd}
							>
								انتقل إلى نهاية النموذج
							</Button>
						</div>
					) : (
						<div className="mx-auto flex max-w-3xl flex-col gap-3">
							<div className="flex items-center gap-2 text-sm font-medium text-emerald-700 dark:text-emerald-400">
								<IconCircleCheckFilled className="size-4" />
								اطّلعتُ على النموذج كاملًا
							</div>

							<div className="flex flex-col gap-1.5">
								<Label className="text-sm">الاسم</Label>
								<Input
									className="h-10 text-base"
									value={signerName}
									disabled={isPending}
									onChange={(e) => setSignerName(e.target.value)}
								/>
							</div>

							<div className="flex flex-col gap-1.5">
								<Label className="text-sm">التوقيع</Label>
								<SignaturePad
									value={signatureUrl}
									onChange={setSignatureUrl}
									disabled={isPending}
								/>
							</div>

							<div className="flex items-center gap-2">
								<Button
									className="h-10 flex-1 text-base"
									disabled={!canSign || isPending}
									onClick={() => {
										if (!signatureUrl) return;
										void onSign({ signerName: signerName.trim(), signatureUrl }).catch(
											() => {},
										);
									}}
								>
									تأكيد الموافقة والتوقيع
								</Button>
								<Button
									variant="ghost"
									className="h-10"
									disabled={isPending}
									onClick={() => onOpenChange(false)}
								>
									إعادة الجهاز للموظّف
								</Button>
							</div>
						</div>
					)}
				</div>
			</DialogContent>
		</Dialog>
	);
};

export const OWNER_SIGNING_METHOD = SignatureMethod.DRAWN;
