import { useHotkey } from "@tanstack/react-hotkeys";
import { useState } from "react";

import { FormFooter } from "@/components/common/form-footer";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useCreateArrival } from "@/features/care/emergency/hooks/use-emergency";

/**
 * [E1] تسجيل وصول — الباب الذي لا تملكه آلة الزيارات.
 *
 * ثلاثة أبواب في نموذج واحد: حضر إلى الباب، في الطريق (بلاغ هاتفي)، وطفل
 * مجهول. الثالث ليس حالة نادرة تُهمَل — كلبٌ يحضره غريب من الشارع لا وليّ أمر له ولا
 * ملفّ، وطلبُ تسجيله أوّلًا يعني أن يقف الممرّض يملأ نموذجًا والطفل ينزف.
 */

const SOURCES = [
	{ value: "WALK_IN", label: "حضر إلى الباب" },
	{ value: "PHONE", label: "بلاغ هاتفي (في الطريق)" },
	{ value: "REFERRAL", label: "إحالة من أكاديمية" },
] as const;

export const ArrivalDialog = ({
	open,
	onOpenChange,
}: {
	open: boolean;
	onOpenChange: (open: boolean) => void;
}) => {
	const { create, isPending } = useCreateArrival();
	const [source, setSource] = useState<string>("WALK_IN");
	const [provisionalLabel, setProvisionalLabel] = useState("");
	const [complaint, setComplaint] = useState("");
	const [expectedMinutes, setExpectedMinutes] = useState("");
	const [continueAdding, setContinueAdding] = useState(false);

	const isEnRoute = source === "PHONE";
	const canSubmit =
		complaint.trim().length > 0 && provisionalLabel.trim().length > 0 && !isPending;

	const submit = async () => {
		const expectedAt =
			isEnRoute && expectedMinutes.trim()
				? new Date(Date.now() + Number(expectedMinutes) * 60_000).toISOString()
				: null;
		await create({
			source,
			provisionalLabel: provisionalLabel.trim(),
			presentingComplaint: complaint.trim(),
			expectedAt,
		});
		setProvisionalLabel("");
		setComplaint("");
		setExpectedMinutes("");
		// «حفظ ومتابعة» تُبقي النموذج مفتوحًا لطفل الحادث التالي
		if (!continueAdding) onOpenChange(false);
	};

	// الاختصار الذي يَعِد به الفوتر — تلميحٌ لا يعمل أسوأ من لا تلميح
	useHotkey("Mod+Enter", () => void (canSubmit && submit()), { enabled: open });

	return (
		<Dialog
			open={open}
			onOpenChange={onOpenChange}
		>
			<DialogContent className="max-h-[85vh] gap-0 overflow-y-auto p-0 sm:max-w-md">
				<div className="border-b px-4 py-2">
					<DialogTitle className="text-base">تسجيل وصول</DialogTitle>
				</div>

				<div className="flex flex-col gap-3 p-4">
					<div className="flex flex-col gap-1.5">
						<Label>كيف وصل؟</Label>
						<Select
							value={source}
							onValueChange={setSource}
						>
							<SelectTrigger>
								<SelectValue />
							</SelectTrigger>
							<SelectContent position="popper">
								{SOURCES.map((s) => (
									<SelectItem
										key={s.value}
										value={s.value}
									>
										{s.label}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>

					{isEnRoute ? (
						<div className="flex flex-col gap-1.5">
							<Label>الوصول المتوقّع بعد (دقائق)</Label>
							<Input
								type="number"
								inputMode="numeric"
								value={expectedMinutes}
								onChange={(e) => setExpectedMinutes(e.target.value)}
								placeholder="١٠"
							/>
						</div>
					) : null}

					<div className="flex flex-col gap-1.5">
						<Label>وصف الطفل</Label>
						<Input
							value={provisionalLabel}
							onChange={(e) => setProvisionalLabel(e.target.value)}
							placeholder="كلب بنّي، ذكر، ~٢٠ كجم"
						/>
						<p className="text-muted-foreground text-xs">
							يكفي وصفٌ مؤقّت الآن. ربطُه بملفّ طفل مسجَّل يتمّ عند الفرز.
						</p>
					</div>

					<div className="flex flex-col gap-1.5">
						<Label>سبب الحضور</Label>
						<Textarea
							value={complaint}
							onChange={(e) => setComplaint(e.target.value)}
							rows={2}
							placeholder="دهسته سيارة قبل عشر دقائق"
						/>
					</div>
				</div>

				{/* الفوتر الموحّد لنماذج الإضافة — «حفظ ومتابعة» مفيدة هنا فعلًا:
				    حادثٌ واحد قد يُدخل ثلاثة أطفال، وإغلاق النموذج بينها عبثٌ. */}
				<FormFooter
					continueAdding={continueAdding}
					onContinueAddingChange={setContinueAdding}
					disabled={isPending}
				>
					<Button
						size="sm"
						variant="ghost"
						disabled={isPending}
						onClick={() => onOpenChange(false)}
					>
						إلغاء
					</Button>
					<Button
						size="sm"
						disabled={!canSubmit}
						onClick={submit}
					>
						تسجيل
					</Button>
				</FormFooter>
			</DialogContent>
		</Dialog>
	);
};
