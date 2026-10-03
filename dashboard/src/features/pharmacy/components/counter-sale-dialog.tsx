import { IconPlus, IconTrash } from "@tabler/icons-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

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
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { useCreateSale } from "@/features/inventory/hooks/use-create-sale";
import { useInventory } from "@/features/inventory/hooks/use-inventory";
import { useOwners } from "@/features/services/owners/hooks/use-owners";
import type { PaymentMethod } from "@/generated/prisma/enums";

const PAYMENT_LABELS: Record<PaymentMethod, string> = {
	CASH: "نقدًا",
	CARD: "بطاقة",
	TRANSFER: "تحويل",
};

const money = (n: number) => n.toLocaleString("en-US", { maximumFractionDigits: 2 });

/**
 * [PH10.1] بيع دواء على الكاونتر من داخل مساحة الصيدلية.
 *
 * ── لماذا هذا الزرّ موجود مع وجود نقطة البيع ──────────────────────────────────
 * لأن الصيدلي يعمل هنا. لا يمرّ كل دواء بوصفة: زبون يحمل وصفة مدرّب آخر، أو صنف لا
 * يحتاج وصفة أصلًا. وإرسالُه إلى شاشة أخرى لإتمام بيعٍ من نفس الرفّ احتكاكٌ بلا مقابل.
 *
 * ── ولماذا لا يُعدّ ازدواجًا ──────────────────────────────────────────────────
 * **المحرّك واحد**: هذه واجهة فوق نقطة البيع نفسها (`useCreateSale` ثم `usePaySale`)،
 * لا مسار بيع ثانٍ. فالتسعير والضريبة وخصم المخزون وتكلفة المبيعات ووردية الكاشير
 * وقيد المواد المراقبة ([PH8.1]) كلّها تسلك مسار أي فاتورة نقطة بيع — والفرق شاشةٌ
 * لا منطق.
 *
 * الهيكل يتبع `payment-modal.tsx` (المرجع المسمّى في عقد التصميم §4): عنوان مخفيّ
 * لقارئ الشاشة، وشريط رأس على `border-b`، والبنود في **جدول** لا صفوف مرنة مرتجلة،
 * وتذييل على `border-t`.
 */
export function CounterSaleDialog({
	open,
	onOpenChange,
}: {
	open: boolean;
	onOpenChange: (open: boolean) => void;
}) {
	const { inventory } = useInventory();
	const { createSale, isPending } = useCreateSale();

	const [lines, setLines] = useState<{ itemId: string; quantity: number }[]>([
		{ itemId: "", quantity: 1 },
	]);
	const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("CASH");
	// المشتري إمّا وليّ أمر مسجَّل يُختار فيُربط البيع به (فتلحقه قواعد ضريبته وخصم
	// عضويّته)، وإمّا زبون عابر تُلتقط بياناته على الفاتورة دون أن يُسجَّل وليّ أمرًا.
	const [buyerMode, setBuyerMode] = useState<"OWNER" | "WALKIN">("WALKIN");
	const [ownerId, setOwnerId] = useState("");
	const [customerName, setCustomerName] = useState("");
	const [customerPhone, setCustomerPhone] = useState("");
	const { owners } = useOwners();
	const selectedOwner = owners.find((o) => o.id === ownerId) ?? null;
	const buyerValid =
		buyerMode === "OWNER" ? !!ownerId : !!customerName.trim() && !!customerPhone.trim();

	const priced = useMemo(
		() =>
			lines.map((line) => {
				const item = inventory.find((i) => i.id === line.itemId) ?? null;
				const unitPrice = item ? Number(item.price) : 0;
				return { ...line, item, unitPrice, lineTotal: unitPrice * line.quantity };
			}),
		[lines, inventory],
	);

	const valid = priced.filter((l) => l.item && l.quantity > 0);
	// عرض تقريبي قبل الضريبة — **الإجمالي النهائي من الخادم**: الضريبة تُحلّ من قالب
	// لكل صنف (P12C.1)، وحسابها هنا كان سيعرض رقمًا يخالف الفاتورة.
	const subtotal = valid.reduce((sum, l) => sum + l.lineTotal, 0);
	const overStock = valid.filter((l) => l.item && l.quantity > l.item.stock);

	const setLine = (idx: number, patch: Partial<{ itemId: string; quantity: number }>) =>
		setLines((prev) => prev.map((l, i) => (i === idx ? { ...l, ...patch } : l)));

	const reset = () => {
		setLines([{ itemId: "", quantity: 1 }]);
		setBuyerMode("WALKIN");
		setOwnerId("");
		setCustomerName("");
		setCustomerPhone("");
		setPaymentMethod("CASH");
	};

	const submit = async () => {
		if (valid.length === 0) return;

		const sale = await createSale({
			items: valid.map((l) => ({
				// biome-ignore lint/style/noNonNullAssertion: `valid` رشّح الأصناف غير المحلولة
				inventoryItemId: l.item!.id,
				// biome-ignore lint/style/noNonNullAssertion: كسابقتها
				name: l.item!.name,
				unitPrice: l.unitPrice,
				quantity: l.quantity,
			})),
			discount: 0,
			paymentMethod,
			customerName:
				buyerMode === "OWNER" ? (selectedOwner?.name ?? undefined) : customerName.trim(),
			customerPhone: buyerMode === "WALKIN" ? customerPhone.trim() : undefined,
			// وليّ الأمر المختار هو طرف البيع — تلحقه قواعد ضريبته وخصم عضويّته
			partyId: buyerMode === "OWNER" ? ownerId || null : null,
			// [PH16] الفاتورة أولًا. التحصيل والصرف خطوتان مستقلّتان في تبويب «الكاونتر»:
			// لا يخرج الدواء من الرفّ قبل السداد، وزرّ الصرف وحده هو ما يخصم المخزون.
			fulfillment: "ON_DISPENSE",
		});
		toast.success(`أُنشئت الفاتورة ${sale.code} — بانتظار التحصيل ثم الصرف`);

		reset();
		onOpenChange(false);
	};

	return (
		<Dialog
			open={open}
			onOpenChange={(next) => {
				if (isPending) return;
				if (!next) reset();
				onOpenChange(next);
			}}
		>
			<DialogContent
				className="max-h-[92vh] overflow-y-auto sm:max-w-2xl"
				dir="rtl"
			>
				<DialogTitle className="sr-only">بيع دواء على الكاونتر</DialogTitle>

				<div className="flex items-center justify-between border-b pb-3">
					<span className="font-semibold text-sm">بيع دواء على الكاونتر</span>
					<span className="text-muted-foreground text-xs">
						بلا وصفة — يمرّ على نقطة البيع نفسها
					</span>
				</div>

				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>الصنف</TableHead>
							<TableHead className="w-24">الكمية</TableHead>
							<TableHead className="w-28">السعر</TableHead>
							<TableHead className="w-28">الإجمالي</TableHead>
							<TableHead className="w-10" />
						</TableRow>
					</TableHeader>
					<TableBody>
						{priced.map((line, idx) => (
							<TableRow key={idx}>
								<TableCell>
									<Select
										value={line.itemId}
										onValueChange={(itemId) => setLine(idx, { itemId })}
									>
										<SelectTrigger className="w-full min-w-0">
											<SelectValue placeholder="اختر صنفًا" />
										</SelectTrigger>
										<SelectContent position="popper">
											{inventory.map((item) => (
												<SelectItem
													key={item.id}
													value={item.id}
												>
													{item.name}
													<span className="text-muted-foreground"> · متاح {item.stock}</span>
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								</TableCell>
								<TableCell>
									<Input
										type="number"
										min={1}
										className="h-8"
										value={line.quantity}
										onChange={(e) => setLine(idx, { quantity: Number(e.target.value) || 1 })}
									/>
								</TableCell>
								<TableCell className="text-muted-foreground tabular-nums">
									{line.item ? money(line.unitPrice) : "—"}
								</TableCell>
								<TableCell className="font-medium tabular-nums">
									{line.item ? money(line.lineTotal) : "—"}
								</TableCell>
								<TableCell>
									<Button
										size="icon"
										variant="ghost"
										className="size-7"
										disabled={lines.length === 1}
										onClick={() => setLines((prev) => prev.filter((_, i) => i !== idx))}
									>
										<IconTrash className="size-4 text-destructive" />
									</Button>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>

				<div className="flex items-center justify-between">
					<Button
						size="sm"
						variant="outline"
						onClick={() => setLines((prev) => [...prev, { itemId: "", quantity: 1 }])}
					>
						<IconPlus className="size-4" />
						صنف آخر
					</Button>

					{overStock.length > 0 && (
						<span className="text-destructive text-xs">
							الكمية تتجاوز المتاح: {overStock.map((l) => l.item?.name).join("، ")}
						</span>
					)}
				</div>

				<div className="grid grid-cols-1 gap-4 border-t pt-3 md:grid-cols-2">
					<div className="flex flex-col gap-1.5">
						<Label htmlFor="counter-method">وسيلة الدفع</Label>
						<Select
							value={paymentMethod}
							onValueChange={(v) => setPaymentMethod(v as PaymentMethod)}
						>
							<SelectTrigger
								id="counter-method"
								className="w-full min-w-0"
							>
								<SelectValue />
							</SelectTrigger>
							<SelectContent position="popper">
								{(Object.keys(PAYMENT_LABELS) as PaymentMethod[]).map((m) => (
									<SelectItem
										key={m}
										value={m}
									>
										{PAYMENT_LABELS[m]}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>

					<div className="flex flex-col gap-1.5">
						<Label>المشتري</Label>
						<Select
							value={buyerMode}
							onValueChange={(v) => setBuyerMode(v as "OWNER" | "WALKIN")}
						>
							<SelectTrigger className="w-full min-w-0">
								<SelectValue />
							</SelectTrigger>
							<SelectContent position="popper">
								<SelectItem value="WALKIN">زبون غير مسجَّل</SelectItem>
								<SelectItem value="OWNER">وليّ أمر مسجَّل</SelectItem>
							</SelectContent>
						</Select>
					</div>

					{buyerMode === "OWNER" ? (
						<div className="flex flex-col gap-1.5 md:col-span-2">
							<Label>وليّ الأمر</Label>
							<Select
								value={ownerId}
								onValueChange={setOwnerId}
							>
								<SelectTrigger className="w-full min-w-0">
									<SelectValue placeholder="اختر وليّ الأمر" />
								</SelectTrigger>
								<SelectContent position="popper">
									{owners.map((o) => (
										<SelectItem
											key={o.id}
											value={o.id}
										>
											{o.name}
											{o.phone && <span className="text-muted-foreground"> · {o.phone}</span>}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
					) : (
						<>
							<div className="flex flex-col gap-1.5">
								<Label htmlFor="counter-customer">اسم المشتري</Label>
								<Input
									id="counter-customer"
									value={customerName}
									onChange={(e) => setCustomerName(e.target.value)}
									placeholder="الاسم الثلاثي"
								/>
							</div>
							<div className="flex flex-col gap-1.5">
								<Label htmlFor="counter-phone">رقم الهاتف</Label>
								<Input
									id="counter-phone"
									dir="ltr"
									inputMode="tel"
									value={customerPhone}
									onChange={(e) => setCustomerPhone(e.target.value)}
									placeholder="05xxxxxxxx"
								/>
							</div>
						</>
					)}
				</div>

				<div className="flex items-center justify-between border-t pt-3">
					<div className="flex flex-col">
						<span className="font-semibold text-sm tabular-nums">{money(subtotal)} ر.س</span>
						<span className="text-[11px] text-muted-foreground">
							قبل الضريبة — الإجمالي النهائي يُحتسب في الفاتورة
						</span>
					</div>

					<div className="flex items-center gap-2">
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
							disabled={valid.length === 0 || overStock.length > 0 || !buyerValid || isPending}
							onClick={() => void submit()}
						>
							إنشاء الفاتورة
						</Button>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}
