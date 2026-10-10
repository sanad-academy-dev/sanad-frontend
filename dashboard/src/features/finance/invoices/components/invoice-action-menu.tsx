import {
	IconBan,
	IconBell,
	IconCashBanknote,
	IconCreditCard,
	IconDots,
	IconDownload,
	IconEye,
	IconPencil,
	IconPrinter,
	IconRefresh,
} from "@tabler/icons-react";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { RefundInvoiceDialog } from "@/features/finance/invoices/components/refund-invoice-dialog";
import { VoidInvoiceDialog } from "@/features/finance/invoices/components/void-invoice-dialog";
import { useRefundInvoice } from "@/features/finance/invoices/hooks/use-refund-invoice";
import { useVoidInvoice } from "@/features/finance/invoices/hooks/use-void-invoice";
import {
	downloadInvoice,
	printInvoice,
} from "@/features/finance/invoices/utils/invoice-document";
import { cn } from "@/lib/utils";
import type { InvoiceListItemResponse } from "@/server/invoices/invoices.type";

// [P12B.1] «استرجاع الفاتورة» كان هنا معطَّلًا بإعلان صريح؛ صار فعلًا حقيقيًا. بقي
// التذكير وحده معلنًا بدل الادّعاء بأنه يعمل.
const PENDING_ACTIONS = { reminder: "إرسال تذكير" } as const;

interface InvoiceActionMenuProps {
	invoice: InvoiceListItemResponse;
	onView: () => void;
	onPay: () => void;
	/** فتح مصدر الفاتورة لتعديل بنودها (الزيارة أو طلب التحاليل) */
	onEdit?: () => void;
	/** تخصيص شكل زرّ القائمة حسب مكان استخدامه (صف الجدول، شريط أدوات…) */
	triggerClassName?: string;
}

export function InvoiceActionMenu({
	invoice,
	onView,
	onPay,
	onEdit,
	triggerClassName,
}: InvoiceActionMenuProps) {
	const [voidOpen, setVoidOpen] = useState(false);
	const [refundOpen, setRefundOpen] = useState(false);
	const { voidInvoice, isPending } = useVoidInvoice();
	const { refundInvoice, isPending: isRefunding } = useRefundInvoice();

	const handlePending = (action: keyof typeof PENDING_ACTIONS) => {
		toast.info(`${PENDING_ACTIONS[action]} — غير مفعّل بعد`);
	};

	const handleVoidConfirm = async () => {
		await voidInvoice(invoice.id);
		setVoidOpen(false);
	};

	const handleRefundConfirm = async (reason: string) => {
		await refundInvoice(invoice.id, reason);
		setRefundOpen(false);
	};

	const { status } = invoice;
	const isPaid = status === "PAID";
	const isVoided = status === "VOIDED";
	const isRefunded = status === "REFUNDED";
	// المستند المُقفَل: لا يُعدَّل ولا يُذكَّر به ولا يُلغى — مدفوع أو ملغى أو مسترجع
	const isClosed = isPaid || isVoided || isRefunded;
	const isPending_ = status === "PENDING";
	const isPartial = status === "PARTIAL";

	return (
		<>
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button
						variant="ghost"
						size="icon"
						className={cn("size-8", triggerClassName)}
					>
						<IconDots className="size-4" />
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent
					align="end"
					className="w-48"
				>
					{/* الترتيب من تصميم Figma */}
					<DropdownMenuItem onClick={onView}>
						<IconEye className="size-3.5" />
						عرض الفاتورة
					</DropdownMenuItem>

					<DropdownMenuItem
						disabled={isClosed}
						onClick={onEdit}
					>
						<IconPencil className="size-3.5" />
						تعديل الفاتورة
					</DropdownMenuItem>

					{/* «استكمال» للجزئية و«تحصيل» لغير المدفوعة — كلاهما يفتح حوار الدفع */}
					<DropdownMenuItem
						disabled={!isPartial}
						onClick={onPay}
						className="font-medium"
					>
						<IconCreditCard className="size-3.5" />
						استكمال دفع الفاتورة
					</DropdownMenuItem>

					{/* [P12B.1] المدفوعة وحدها تُسترجَع: غير المدفوعة تُلغى، والمسترجعة انتهت */}
					<DropdownMenuItem
						disabled={!isPaid}
						onClick={() => setRefundOpen(true)}
					>
						<IconRefresh className="size-3.5" />
						استرجاع الفاتورة
					</DropdownMenuItem>

					<DropdownMenuItem
						disabled={!isPending_}
						onClick={onPay}
					>
						<IconCashBanknote className="size-3.5" />
						تحصيل دفعة
					</DropdownMenuItem>

					<DropdownMenuItem onClick={() => printInvoice(invoice)}>
						<IconPrinter className="size-3.5" />
						طباعة الفاتورة
					</DropdownMenuItem>

					<DropdownMenuItem
						disabled={isClosed}
						onClick={() => handlePending("reminder")}
					>
						<IconBell className="size-3.5" />
						إرسال تذكير
					</DropdownMenuItem>

					<DropdownMenuItem onClick={() => downloadInvoice(invoice)}>
						<IconDownload className="size-3.5" />
						تحميل الفاتورة
					</DropdownMenuItem>

					<DropdownMenuSeparator />
					<DropdownMenuItem
						disabled={isClosed}
						onClick={() => setVoidOpen(true)}
						className="text-destructive focus:text-destructive"
					>
						<IconBan className="size-3.5" />
						إلغاء الفاتورة
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>

			<VoidInvoiceDialog
				open={voidOpen}
				onClose={() => setVoidOpen(false)}
				onConfirm={() => void handleVoidConfirm()}
				isPending={isPending}
				invoiceCode={invoice.code}
			/>

			<RefundInvoiceDialog
				open={refundOpen}
				onClose={() => setRefundOpen(false)}
				onConfirm={(reason) => void handleRefundConfirm(reason)}
				isPending={isRefunding}
				invoiceCode={invoice.code}
			/>
		</>
	);
}
