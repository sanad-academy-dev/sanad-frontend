import { IconCircleCheck, IconCreditCard, IconVideo } from "@tabler/icons-react";
import { createFileRoute, Link } from "@tanstack/react-router";

import { Button } from "@/components/ui/button";
import { useCompletePayment } from "@/features/video-calls/hooks/use-complete-payment";

// صفحة الدفع العامة للزيارة عن بعد — بلا تسجيل دخول (حيازة الرابط هي الإذن).
// لا يوجد تكامل مع بوابات الدفع بعد: زر "إتمام الدفع" ينقل الزيارة للمرحلة التالية
export const Route = createFileRoute("/pay/$room")({
	component: PayPage,
	ssr: false,
});

function PayPage() {
	const { room } = Route.useParams();
	const { completePayment, isPending, isSuccess } = useCompletePayment(room);

	if (isSuccess) {
		return (
			<main className="flex min-h-svh items-center justify-center bg-background p-4">
				<div className="flex w-full max-w-sm flex-col items-center gap-4 rounded-lg border p-6 text-center">
					<div className="flex size-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
						<IconCircleCheck className="size-6" />
					</div>
					<div className="flex flex-col gap-1">
						<h1 className="text-lg font-semibold">تم الدفع بنجاح</h1>
						<p className="text-sm text-muted-foreground">
							تم تأكيد زيارتك عن بعد — يمكنك الانضمام إلى الجلسة في موعدها من الرابط التالي
						</p>
					</div>
					<Button
						asChild
						className="w-full gap-1.5"
					>
						<Link
							to="/call/$room"
							params={{ room }}
						>
							<IconVideo className="size-4" />
							الانضمام إلى الجلسة
						</Link>
					</Button>
				</div>
			</main>
		);
	}

	return (
		<main className="flex min-h-svh items-center justify-center bg-background p-4">
			<div className="flex w-full max-w-sm flex-col gap-4 rounded-lg border p-6">
				<div className="flex flex-col items-center gap-2 text-center">
					<div className="flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
						<IconCreditCard className="size-6" />
					</div>
					<h1 className="text-lg font-semibold">إتمام الدفع — زيارة عن بعد</h1>
					<p className="text-sm text-muted-foreground">
						أكمل الدفع لتأكيد موعد الجلسة مع المدرّب
					</p>
				</div>

				<div className="flex items-center justify-between rounded-lg bg-muted/60 p-3">
					<span className="text-sm">رسوم الاستشارة عن بعد</span>
					<span className="text-sm font-semibold">تُحدد من الأكاديمية</span>
				</div>

				<p className="rounded-lg border border-dashed p-3 text-center text-xs text-muted-foreground">
					بوابات الدفع غير مفعّلة بعد — هذا دفع تجريبي لتأكيد الزيارة فقط
				</p>

				<Button
					type="button"
					className="w-full"
					onClick={() => void completePayment()}
					disabled={isPending}
				>
					إتمام الدفع
				</Button>
			</div>
		</main>
	);
}
