import { IconAlertTriangle } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Spinner } from "@/components/ui/spinner";
import { useI18n } from "@/hooks/use-i18n";

/**
 * نافذة «يرجى الانتظار لحظة / جاري معالجة الحملة الإعلانية» (شاشة 547178)،
 * ومعها مسار الفشل الذي لم يرسمه التصميم.
 *
 * التصميم رسم الانتظار والنجاح فقط. إطلاق يفشل بلا شاشة يترك المستخدم أمام نافذة
 * تدور إلى الأبد — فحالة الخطأ هنا ليست إضافة زائدة بل إكمالٌ لمسار موجود.
 */
export function LaunchingDialog({
	open,
	isPending,
	error,
	onCancel,
	onRetry,
}: {
	open: boolean;
	isPending: boolean;
	error: string | null;
	onCancel: () => void;
	onRetry: () => void;
}) {
	const { isRtl } = useI18n();

	return (
		<Dialog
			open={open}
			// أثناء المعالجة لا يُغلق بالنقر خارجه: إغلاقٌ عرضي يترك المستخدم لا يدري
			// أنجحت الحملة أم لا
			onOpenChange={(next) => {
				if (!next && !isPending) onCancel();
			}}
		>
			<DialogContent
				dir={isRtl ? "rtl" : "ltr"}
				showCloseButton={false}
				className="w-[min(420px,92vw)] sm:max-w-[420px]"
			>
				<DialogTitle className="sr-only">إطلاق الحملة</DialogTitle>

				{isPending && (
					<div className="flex flex-col items-center gap-3 py-6">
						<Spinner className="size-6" />
						<p className="font-medium text-sm">يرجى الانتظار لحظة</p>
						<p className="text-muted-foreground text-xs">جاري معالجة الحملة الإعلانية</p>
						<Button
							size="sm"
							variant="outline"
							onClick={onCancel}
						>
							إلغاء
						</Button>
					</div>
				)}

				{!isPending && error && (
					<div className="flex flex-col items-center gap-3 py-6 text-center">
						<IconAlertTriangle className="size-6 text-destructive" />
						<p className="font-medium text-sm">تعذّر إطلاق الحملة</p>
						<p className="max-w-[320px] text-muted-foreground text-xs leading-relaxed">
							{error}
						</p>
						{/* «إعادة المحاولة» أولًا ⇒ يمينًا في RTL */}
						<div className="flex items-center gap-2">
							<Button
								size="sm"
								onClick={onRetry}
							>
								إعادة المحاولة
							</Button>
							<Button
								size="sm"
								variant="outline"
								onClick={onCancel}
							>
								إغلاق
							</Button>
						</div>
					</div>
				)}
			</DialogContent>
		</Dialog>
	);
}
