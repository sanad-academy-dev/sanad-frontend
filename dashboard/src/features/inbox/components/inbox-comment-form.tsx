import { zodResolver } from "@hookform/resolvers/zod";
import { IconSend2 } from "@tabler/icons-react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Field, FieldError } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
import { type AddCommentFormInput, addCommentSchema } from "@/features/inbox/types/inbox.type";

export function InboxCommentForm({ onSubmit }: { onSubmit: (comment: string) => void }) {
	const {
		register,
		handleSubmit,
		reset,
		formState: { errors, isSubmitting },
	} = useForm<AddCommentFormInput>({
		resolver: zodResolver(addCommentSchema),
		defaultValues: { comment: "" },
	});

	const submit = handleSubmit((data) => {
		onSubmit(data.comment.trim());
		reset({ comment: "" });
	});

	return (
		<form onSubmit={submit}>
			<Field data-invalid={!!errors.comment}>
				<div className="relative">
					<Textarea
						aria-invalid={!!errors.comment}
						disabled={isSubmitting}
						placeholder="أضف تعليقًا هنا..."
						className="min-h-[76px] resize-none pb-10 text-sm"
						{...register("comment")}
					/>
					{/* زر الإرسال مثبّت في الزاوية السفلية المنطقية للبداية (يسار في RTL) */}
					<Button
						type="submit"
						size="icon-xs"
						variant="ghost"
						disabled={isSubmitting}
						aria-label="إرسال"
						className="absolute bottom-2 start-2 text-muted-foreground"
					>
						<IconSend2 className="size-4" />
					</Button>
				</div>
				<FieldError errors={[errors.comment]} />
			</Field>
		</form>
	);
}
