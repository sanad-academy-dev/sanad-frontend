import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { type SubmitHandler, useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Field, FieldError } from "@/components/ui/field";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useMobileRequestMutations } from "@/features/mobile-clinics/hooks/use-mobile-requests";
import type { MobileRequestResponse } from "@/server/mobile-clinics/mobile-requests/mobile-requests.dao";
import {
	type RejectRequestFormInput,
	rejectRequestSchema,
} from "@sanad/contracts/runtime/server/mobile-clinics/mobile-requests/mobile-requests.type";

/**
 * [MC7.4] رفض طلب مع سبب مكتوب.
 *
 * كان `window.prompt` — مربّع نظام لا يرث اتّجاه الصفحة ولا سماتها، ولا يتحقّق من شيء.
 * السبب يظهر لاحقًا في سجلّ الطلب، فيلزمه أدنى تحقّق كبقيّة نماذج المستودع.
 */
export function RejectRequestDialog({
	request,
	onClose,
}: {
	request: MobileRequestResponse | null;
	onClose: () => void;
}) {
	const { setStatus, isMutating } = useMobileRequestMutations();

	const {
		register,
		handleSubmit,
		reset,
		formState: { errors, isValid },
	} = useForm<RejectRequestFormInput>({
		resolver: zodResolver(rejectRequestSchema),
		mode: "onChange",
		defaultValues: { rejectionReason: "" },
	});

	useEffect(() => {
		if (request) reset({ rejectionReason: "" });
	}, [request, reset]);

	const onSubmit: SubmitHandler<RejectRequestFormInput> = async (data) => {
		if (!request) return;
		await setStatus(request.id, "REJECTED", data.rejectionReason);
		onClose();
	};

	return (
		<Dialog
			open={Boolean(request)}
			onOpenChange={(open) => {
				if (!open) onClose();
			}}
		>
			{/* dir صريح: محتوى Radix يُنقَل خارج شجرة RTL فلا يرثه */}
			<DialogContent
				className="sm:max-w-[420px]"
				dir="rtl"
			>
				<DialogHeader>
					<DialogTitle className="text-sm font-semibold">رفض الطلب</DialogTitle>
				</DialogHeader>

				<form
					id="reject-request-form"
					onSubmit={handleSubmit(onSubmit)}
					className="flex flex-col gap-1.5"
				>
					<Label className="text-sm font-medium">سبب الرفض</Label>
					<Field data-invalid={!!errors.rejectionReason}>
						<Textarea
							rows={3}
							className="text-sm"
							placeholder="مثال: العنوان خارج مدى الدورة، ووليّ الأمر يفضّل الحضور للأكاديمية"
							aria-invalid={!!errors.rejectionReason}
							disabled={isMutating}
							{...register("rejectionReason")}
						/>
						<FieldError errors={[errors.rejectionReason]} />
					</Field>
					<span className="text-xs text-muted-foreground">
						يظهر السبب في سجلّ الطلب — اكتبه كما تشرحه لزميل يفتح الطلب بعد أسبوع.
					</span>
				</form>

				<div className="flex items-center justify-end gap-2 border-t pt-3">
					<Button
						variant="outline"
						size="sm"
						onClick={onClose}
						disabled={isMutating}
					>
						إلغاء
					</Button>
					<Button
						type="submit"
						form="reject-request-form"
						variant="destructive"
						size="sm"
						disabled={isMutating || !isValid}
					>
						رفض الطلب
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
}
