import { IconCircleCheckFilled, IconLock, IconX } from "@tabler/icons-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { useKiosk } from "@/features/services/staff/hooks/use-kiosk";
import { cn } from "@/lib/utils";

const PIN_LENGTH = 5;

// توست نجاح الدخول/الخروج لوضع الكشك (بطاقة بيضاء + علامة خضراء + زر إغلاق) — أسفل يسار
function showKioskToast(message: string) {
	toast.custom(
		(id) => (
			<div className="flex w-[345px] items-center gap-2 rounded-[4px] border-[0.75px] border-[#E5E5E5] bg-white px-1 py-3 shadow-[0px_4px_24px_rgba(0,0,0,0.08)]">
				<button
					type="button"
					onClick={() => toast.dismiss(id)}
					aria-label="إغلاق"
					className="flex size-5 shrink-0 items-center justify-center rounded-[4px] text-[#9B9B9D] opacity-40 hover:opacity-100"
				>
					<IconX className="size-3" />
				</button>
				<span className="flex-1 text-right text-[12px] font-semibold leading-[18px] text-[#08090A]">
					{message}
				</span>
				<IconCircleCheckFilled className="size-5 shrink-0 text-[#008A2E]" />
			</div>
		),
		{ position: "bottom-left", duration: 5000 },
	);
}
// لوحة الأرقام (RTL): 1-9 ثم فراغ / 0 / مسح
const KEYS = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "", "0", "back"] as const;

export function KioskPinDialog({
	open,
	onClose,
	onUnlocked,
	title = "رمز الدخول وضع الكشك",
	subtitle = "أدخل رمز PIN للدخول وضع الكشك",
	successMessage = "تم تسجيل الدخول لوضع الكشك بنجاح",
}: {
	open: boolean;
	onClose: () => void;
	onUnlocked?: () => void;
	title?: string;
	subtitle?: string;
	successMessage?: string;
}) {
	const { verifyPin, isVerifying } = useKiosk();
	const [pin, setPin] = useState("");
	const [error, setError] = useState(false);

	useEffect(() => {
		if (open) {
			setPin("");
			setError(false);
		}
	}, [open]);

	const submit = useCallback(
		async (value: string) => {
			try {
				await verifyPin(value);
				showKioskToast(successMessage);
				onClose();
				onUnlocked?.();
			} catch {
				setPin("");
				setError(true);
			}
		},
		[verifyPin, onClose, onUnlocked, successMessage],
	);

	const press = useCallback(
		(key: string) => {
			if (isVerifying) return;
			setError(false);
			if (key === "back") {
				setPin((p) => p.slice(0, -1));
				return;
			}
			if (!/^[0-9]$/.test(key)) return;
			setPin((p) => {
				if (p.length >= PIN_LENGTH) return p;
				const next = p + key;
				if (next.length === PIN_LENGTH) void submit(next);
				return next;
			});
		},
		[isVerifying, submit],
	);

	// دعم لوحة المفاتيح الفعلية
	useEffect(() => {
		if (!open) return;
		const onKey = (e: KeyboardEvent) => {
			if (e.key >= "0" && e.key <= "9") press(e.key);
			else if (e.key === "Backspace") press("back");
			else if (e.key === "Escape") onClose();
		};
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, [open, press, onClose]);

	return (
		<Dialog
			open={open}
			onOpenChange={(o) => !o && onClose()}
		>
			<DialogContent
				dir="rtl"
				showCloseButton={false}
				className="w-[320px] max-w-[320px] gap-0 rounded-[4px] border-[0.75px] border-[#E5E5E5] p-[18px] sm:max-w-[320px]"
			>
				<DialogTitle className="sr-only">{title}</DialogTitle>
				<DialogDescription className="sr-only">{subtitle}</DialogDescription>

				{/* الأيقونة */}
				<div className="flex justify-center">
					<div className="flex size-9 items-center justify-center rounded-full bg-[#6366F1]/10">
						<IconLock className="size-5 text-[#6366F1]" />
					</div>
				</div>

				{/* العنوان والوصف */}
				<div className="flex flex-col items-center gap-0.5 pt-[9px]">
					<span className="text-[14px] font-bold text-[#08090A]">{title}</span>
					<span className="text-[11px] text-[#9B9B9D]">{subtitle}</span>
				</div>

				{/* خانات الرمز + رسالة الخطأ */}
				<div className="flex flex-col gap-2 pt-[9px]">
					<div className="flex justify-center gap-1.5">
						{Array.from({ length: PIN_LENGTH }).map((_, i) => (
							<div
								key={i}
								className={cn(
									"flex size-[30px] items-center justify-center rounded-[4px] border-[0.75px] border-[#E5E5E5] text-[16px] leading-none text-[#08090A]",
									error && "border-[#EF4444]",
									!error && i === pin.length && !isVerifying && "border-[#6366F1]",
								)}
							>
								{pin[i] ? "•" : ""}
							</div>
						))}
					</div>
					{error && (
						<span className="text-center text-[11px] font-medium text-[#EF4444]">
							الرمز خطأ، حاول مرة أخري ادخال الرمز الصحيح
						</span>
					)}
				</div>

				{/* لوحة الأرقام */}
				<div className="grid grid-cols-3 gap-1.5 py-[9px]">
					{KEYS.map((key, i) =>
						key === "" ? (
							<div key={`empty-${i}`} />
						) : (
							<button
								key={key}
								type="button"
								onClick={() => press(key)}
								disabled={isVerifying}
								className="flex h-[33px] items-center justify-center rounded-[4px] border-[0.75px] border-[#E5E5E5] text-[16px] font-semibold text-[#08090A] hover:bg-muted disabled:opacity-50"
							>
								{key === "back" ? "⌫" : key}
							</button>
						),
					)}
				</div>

				{/* إلغاء */}
				<button
					type="button"
					onClick={onClose}
					className="flex h-[30px] w-full items-center justify-center rounded-[4px] border-[0.75px] border-[#E5E5E5] text-[11px] font-medium text-[#9B9B9D] hover:bg-muted"
				>
					إلغاء
				</button>
			</DialogContent>
		</Dialog>
	);
}
