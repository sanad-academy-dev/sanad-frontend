import {
	IconArrowUp,
	IconAt,
	IconBoxSeam,
	IconBuilding,
	IconChevronLeft,
	IconCircleX,
	IconInfoCircle,
	IconLink,
	IconMail,
	IconMap2,
	IconMoodSmile,
	IconPackage,
	IconPackageExport,
	IconPackageImport,
	IconTruckDelivery,
} from "@tabler/icons-react";

import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { usePurchaseOrderMutations } from "@/features/inventory/hooks/use-purchase-order-mutations";
import type {
	PurchaseOrderResponse,
	PurchaseOrderStatus,
} from "@/server/purchasing/purchasing.type";

interface OrderTrackingSheetProps {
	order: PurchaseOrderResponse | null;
	onClose: () => void;
	/** فتح شاشة استلام المنتج (تحل محل هذه الشاشة) */
	onReceive: () => void;
}

const money = (n: number) =>
	`${n.toLocaleString("ar-EG", { minimumFractionDigits: 0, maximumFractionDigits: 2 })} ر.س`;
const dayFmt = new Intl.DateTimeFormat("ar-EG", { dateStyle: "long" });

const STATUS_LABEL: Record<PurchaseOrderStatus, string> = {
	DRAFT: "مسودّة",
	ORDERED: "معلق",
	PARTIALLY_RECEIVED: "استلام جزئي",
	RECEIVED: "مستلم",
	CANCELLED: "ملغى",
};

export function OrderTrackingSheet({ order, onClose, onReceive }: OrderTrackingSheetProps) {
	const open = !!order;

	return (
		<Sheet
			open={open}
			onOpenChange={(o) => {
				if (!o) onClose();
			}}
		>
			<SheetContent
				side="left"
				showCloseButton={false}
				dir="rtl"
				className="flex w-full flex-col gap-0 p-0 sm:max-w-[603px]!"
			>
				{order && (
					<OrderTrackingBody
						order={order}
						onClose={onClose}
						onReceive={onReceive}
					/>
				)}
			</SheetContent>
		</Sheet>
	);
}

function OrderTrackingBody({
	order,
	onClose,
	onReceive,
}: {
	order: PurchaseOrderResponse;
	onClose: () => void;
	onReceive: () => void;
}) {
	const { cancelPurchaseOrder, isCancelling } = usePurchaseOrderMutations();

	const { code, status, supplier, items, createdAt } = order;
	const created = dayFmt.format(new Date(createdAt));
	const closed = status === "RECEIVED" || status === "CANCELLED";

	const cancel = async () => {
		try {
			await cancelPurchaseOrder(order.id);
			onClose();
		} catch {
			// رسالة الخطأ تظهر عبر toast.promise
		}
	};

	// أحداث النشاط — مزيج من بيانات الطلب الفعلية وحالات الشحن (مطابق Figma)
	const activity: {
		icon: typeof IconPackage;
		text: string;
		link?: string;
		date: string;
	}[] = [
		{
			icon: IconInfoCircle,
			text: "تم تنبيه الإدارة بقرب انتهاء الصلاحية",
			date: `أُرسل في ${created}`,
		},
		{
			icon: IconMail,
			text: "تم إرسال بريد إلكتروني إلى",
			link: supplier.email ?? "",
			date: `أُرسل في ${created}`,
		},
		{ icon: IconPackage, text: "تم إنشاء الطلب", date: created },
		{ icon: IconPackageImport, text: "تم تأكيد الطلب", date: created },
		{ icon: IconPackageExport, text: "تم تجهيز الطلب للشحن", date: created },
	];

	return (
		<>
			{/* ─── الهيدر ─── */}
			<SheetTitle className="sr-only">تتبع حالة الطلب #{code}</SheetTitle>
			<div className="flex items-start justify-between border-b px-4 py-2">
				<div className="flex flex-col items-end gap-0.5">
					<div className="flex items-center gap-2">
						<span className="flex items-center gap-0.5 text-[12px] text-[#08090A]">
							#{code}
							<IconChevronLeft className="size-3.5" />
						</span>
						<span className="rounded-full bg-[#F0F0F0] px-2 text-[10px] text-[#9B9B9D]">
							{STATUS_LABEL[status]}
						</span>
					</div>
					<span className="text-[8px] text-[#9B9B9D]">
						تم التعديل في {created} بواسطة النظام
					</span>
				</div>
				<button
					type="button"
					onClick={cancel}
					disabled={closed || isCancelling}
					className="flex h-6 items-center gap-1.5 rounded-[4px] bg-[#CA2B2B]/10 px-2 text-[10px] font-medium text-[#EF4444] disabled:opacity-50"
				>
					<IconCircleX className="size-3" />
					إلغاء الطلب
				</button>
			</div>

			<div className="flex flex-1 flex-col gap-3 overflow-y-auto px-4 py-3">
				{/* ─── بطاقة المورد + المنتجات ─── */}
				<div className="flex flex-col gap-3 rounded-[4px] border-[0.5px] border-[#D8D8D8] p-3">
					{/* المورد (يمين) + تاريخ الإنشاء (يسار) */}
					<div className="flex items-start justify-between">
						<div className="flex items-start gap-1.5">
							<IconBuilding className="size-4 shrink-0 text-[#08090A]" />
							<div className="flex flex-col items-end">
								<span className="text-[12px] text-[#08090A]">{supplier.legalName}</span>
								<span className="text-[8px] text-[#9B9B9D]">
									{[supplier.city, supplier.country].filter(Boolean).join("، ") || "—"}
								</span>
							</div>
						</div>
						<div className="flex flex-col items-end">
							<span className="text-[8px] text-[#9B9B9D]">تاريخ الإنشاء</span>
							<span className="text-[12px] text-[#08090A]">{created}</span>
						</div>
					</div>

					<div className="h-px w-full bg-[#F3F4F6]" />

					{/* جدول المنتجات */}
					<div className="overflow-hidden rounded-[4px] border-[0.5px] border-[#D8D8D8]">
						<table className="w-full border-collapse text-right">
							<thead>
								<tr className="border-b-[0.5px] border-[#D8D8D8]">
									<th className="px-3 py-2.5 text-right text-[12px] font-semibold text-[#5C5C5E]">
										اسم المنتج
									</th>
									<HeadCell label="رقم المنتج" />
									<HeadCell label="الكمية" />
									<HeadCell label="التكلفة" />
								</tr>
							</thead>
							<tbody>
								{items.map((it) => (
									<tr
										key={it.id}
										className="border-b-[0.5px] border-[#D8D8D8] last:border-0"
									>
										<td className="px-3 py-2.5">
											<div className="flex items-center gap-2">
												<span className="flex size-6 items-center justify-center rounded-full bg-[#F4F4F4]">
													<IconBoxSeam className="size-3 text-[#A3A8B0]" />
												</span>
												<span className="text-[12px] text-[#08090A]">{it.item.name}</span>
											</div>
										</td>
										<td className="px-3 py-2.5 text-center">
											<span className="text-[12px] tabular-nums text-[#08090A]">
												{it.item.code}
											</span>
										</td>
										<td className="px-3 py-2.5 text-center">
											<span className="text-[12px] tabular-nums text-[#0A0A0A]">
												{it.qtyOrdered}
											</span>
										</td>
										<td className="px-3 py-2.5">
											<span className="text-[12px] tabular-nums text-[#08090A]">
												{money(Number(it.unitCost))}
											</span>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</div>

				{/* ─── مسار الشحنة ─── */}
				<div className="flex flex-col gap-1.5">
					<div className="flex items-center gap-2">
						<span className="flex size-6 items-center justify-center rounded-full bg-[#F4F4F4]">
							<IconMap2 className="size-3.5 text-[#0A0A0A]" />
						</span>
						<span className="text-[12px] font-medium text-[#08090A]">مسار الشحنة</span>
					</div>
					<div className="flex items-center justify-between">
						<span className="text-[11px] text-[#9B9B9D]">5 مراحل من 3</span>
						<span className="text-[12px] font-medium text-[#6366F1]">60%</span>
					</div>
					<div className="relative h-1.5 w-full overflow-hidden rounded-full bg-[#F3F4F7]">
						<div className="h-full w-[60%] rounded-full bg-[#6366F1]" />
						<IconTruckDelivery className="absolute top-1/2 right-[58%] size-4 -translate-y-1/2 text-[#6366F1]" />
					</div>
				</div>

				{/* ─── النشاط ─── */}
				<span className="text-[16px] text-[#1B1B1B]">النشاط</span>
				<div className="flex flex-col">
					{activity.map((a, i) => (
						<div
							key={a.text}
							className="flex items-start gap-3"
						>
							{/* الأيقونة + خط الربط (يمين — RTL) */}
							<div className="flex flex-col items-center gap-1">
								<span className="flex size-6 items-center justify-center rounded-full bg-[#F4F4F4]">
									<a.icon className="size-3.5 text-[#0A0A0A]" />
								</span>
								{i < activity.length - 1 && <span className="h-8 w-px bg-[#E8E8E8]" />}
							</div>
							{/* النص + التفاصيل (بجانب الأيقونة على اليمين) */}
							<div className="flex flex-1 flex-col items-start gap-1 pb-3">
								<span className="text-right text-[12px] text-[#1E2939]">
									{a.text}
									{a.link && <span className="text-[#6366F1]"> {a.link}</span>}
								</span>
								<div className="flex items-center gap-1 text-[8px] text-[#5C5C5E]">
									<span>{a.date}</span>
									<span>·</span>
									<span>بواسطة:</span>
									<span className="text-[#1E2939]">النظام</span>
								</div>
							</div>
						</div>
					))}
				</div>

				{/* ─── صندوق التعليق ─── */}
				<div className="flex items-start gap-2">
					<div className="flex flex-1 flex-col gap-2 rounded-[4px] border border-[#E5E5E5] p-3">
						<textarea
							placeholder="اكتب تعليق..."
							rows={2}
							className="w-full resize-none bg-transparent text-right text-[12px] text-[#08090A] outline-none placeholder:text-[#9B9B9D]"
						/>
						<div className="flex items-center gap-2 text-[#9CA3AF]">
							<span className="flex size-[17px] items-center justify-center rounded-full border-[0.75px] border-[#E5E5E5]">
								<IconArrowUp className="size-3" />
							</span>
							<IconMoodSmile className="size-4" />
							<IconAt className="size-4" />
							<IconLink className="size-4" />
						</div>
					</div>
					<span className="size-6 shrink-0 rounded-full bg-[#F4F4F4]" />
				</div>
			</div>

			{/* ─── الفوتر: إلغاء (يسار) · استلام الطلب بجانبه على يمينه ─── */}
			<div className="flex items-center justify-end gap-2 border-t px-4 py-2">
				<button
					type="button"
					onClick={onReceive}
					disabled={closed}
					className="flex h-7 items-center gap-1.5 rounded-[4px] bg-[#506AE0] px-4 text-[12px] font-medium primarydisabled:opacity-50"
				>
					<IconPackageImport className="size-3.5" />
					استلام الطلب
				</button>
				<button
					type="button"
					onClick={onClose}
					className="flex h-7 items-center rounded-[4px] border border-black/[0.13] bg-[#F9FAFB] px-4 text-[12px] font-medium text-[#08090A]"
				>
					إلغاء
				</button>
			</div>
		</>
	);
}

function HeadCell({ label }: { label: string }) {
	return (
		<th className="px-3 py-2.5 text-center text-[12px] font-semibold text-[#5C5C5E]">
			{label}
		</th>
	);
}
