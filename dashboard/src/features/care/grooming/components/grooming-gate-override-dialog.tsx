import { IconAlertTriangle } from "@tabler/icons-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useGroomingMutations } from "@/features/care/grooming/hooks/use-grooming";
import type { GroomingStatus } from "@/generated/prisma/enums";

const MIN_REASON = 3;

/** ما تحتاجه النافذة لإعادة المحاولة بعد تسجيل السبب */
export type BlockedMove = {
	sessionId: string;
	to: GroomingStatus;
	gate: string;
	message: string;
};

/**
 * تجاوز بوابة بسبب مسجَّل.
 *
 * لا تُفتح إلا لبوابة تقبل التجاوز — الثلاث الأخرى (طريقة التجفيف، أمر المدرّب،
 * الحادثة المفتوحة) يرفضها الخادم مهما كان السبب، ولذلك لا يُعرض لها هذا المسار
 * أصلًا: زرٌّ يَعِد بما لا يحدث أسوأ من غياب الزر.
 *
 * السبب إلزامي ويهبط في سجل نشاط الجلسة وتقرير الالتزام — التجاوز مسموح، لكنه
 * ليس مجّانيًا ولا صامتًا.
 */
export function GroomingGateOverrideDialog({
	blocked,
	onClose,
}: {
	blocked: BlockedMove | null;
	onClose: () => void;
}) {
	const { moveSession, isPending } = useGroomingMutations();
	const [reason, setReason] = useState("");

	useEffect(() => {
		if (blocked) setReason("");
	}, [blocked]);

	const confirm = () => {
		if (!blocked || reason.trim().length < MIN_REASON) return;
		void moveSession({
			id: blocked.sessionId,
			to: blocked.to,
			overrideReason: reason.trim(),
		})
			.then(() => onClose())
			.catch(() => {});
	};

	return (
		<Dialog
			open={!!blocked}
			onOpenChange={(open) => !open && onClose()}
		>
			<DialogContent
				dir="rtl"
				className="gap-0 p-0 sm:max-w-[520px]"
			>
				<DialogHeader className="border-b px-4 py-2 text-start">
					<DialogTitle className="flex items-center gap-2 text-sm">
						<IconAlertTriangle className="size-4 text-destructive" />
						تجاوز بوابة أمان
					</DialogTitle>
					<DialogDescription className="text-xs">
						يُسجَّل السبب في سجل الجلسة ويظهر في تقرير الالتزام.
					</DialogDescription>
				</DialogHeader>

				<div className="flex flex-col gap-3 p-4">
					<p className="rounded-[4px] border border-destructive/40 bg-destructive/5 p-3 text-sm leading-relaxed">
						{blocked?.message}
					</p>

					<div className="flex flex-col gap-1.5">
						<span className="text-muted-foreground text-xs">سبب التجاوز (إلزامي)</span>
						<Textarea
							rows={3}
							value={reason}
							disabled={isPending}
							placeholder="مثال: شهادة التطعيم مرفوعة ورقيًا من أكاديمية أخرى، وأُرفقت بملف الطفل"
							onChange={(e) => setReason(e.target.value)}
						/>
					</div>
				</div>

				<div className="flex items-center justify-end gap-2 border-t px-4 py-2">
					<Button
						size="sm"
						variant="outline"
						disabled={isPending}
						onClick={onClose}
					>
						إلغاء
					</Button>
					<Button
						size="sm"
						variant="destructive"
						disabled={isPending || reason.trim().length < MIN_REASON}
						onClick={confirm}
					>
						تجاوز ومتابعة
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
}
