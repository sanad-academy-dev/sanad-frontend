import { IconPlus, IconTrash } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { AccountingFormSheet } from "@/features/accounting/components/accounting-form-sheet";
import {
	useInsurers,
	useSaveInsuranceProduct,
} from "@/features/accounting/insurance/hooks/use-insurance";
import { useServicesTree } from "@/features/settings/services/hooks/use-services-tree";
import type { InsuranceProductResponse } from "@/server/accounting/insurance/insurance-product.type";
import { insuranceProductSchema } from "@sanad/contracts/runtime/server/accounting/insurance/insurance-product.type";

/**
 * [MI-P3] Product create/edit sheet (MI §8.2). Coverage rows edit inline (the MI-P1
 * benefit-editor pattern): service node + percent, 0 = explicit exclusion; a CATEGORY
 * row covers its subtree and the deepest matching row wins (BR-M4.2.2 — the hint under
 * the picker says so).
 */

type CoverageDraft = { serviceId: string; coveragePercent: string };

type Draft = {
	insurerId: string;
	name: string;
	coveragePercentDefault: string;
	annualCap: string;
	perClaimCap: string;
	deductibleFixed: string;
	deductiblePercent: string;
	coverageRows: CoverageDraft[];
};

const EMPTY: Draft = {
	insurerId: "",
	name: "",
	coveragePercentDefault: "80",
	annualCap: "",
	perClaimCap: "",
	deductibleFixed: "0",
	deductiblePercent: "0",
	coverageRows: [],
};

export const ProductSheet = ({
	open,
	onOpenChange,
	product,
}: {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	product: InsuranceProductResponse | null;
}) => {
	const { saveProduct, isPending } = useSaveInsuranceProduct();
	const { insurers } = useInsurers();
	const { tree } = useServicesTree();
	const [draft, setDraft] = useState<Draft>(EMPTY);

	useEffect(() => {
		if (!open) return;
		setDraft(
			product
				? {
						insurerId: product.insurerId,
						name: product.name,
						coveragePercentDefault: String(Number(product.coveragePercentDefault)),
						annualCap: product.annualCap ? String(Number(product.annualCap)) : "",
						perClaimCap: product.perClaimCap ? String(Number(product.perClaimCap)) : "",
						deductibleFixed: String(Number(product.deductibleFixed)),
						deductiblePercent: String(Number(product.deductiblePercent)),
						coverageRows: product.coverageRows.map((row) => ({
							serviceId: row.serviceId,
							coveragePercent: String(Number(row.coveragePercent)),
						})),
					}
				: EMPTY,
		);
	}, [open, product]);

	// flatten the tree — every node is pickable; a category row covers its subtree
	const serviceOptions = tree.flatMap((category) => [
		{ id: category.id, label: category.name },
		...category.children.flatMap((sub) => [
			{ id: sub.id, label: `${category.name} ← ${sub.name}` },
			...sub.children.map((item) => ({
				id: item.id,
				label: `${category.name} ← ${sub.name} ← ${item.name}`,
			})),
		]),
	]);

	const set = (patch: Partial<Draft>) => setDraft((d) => ({ ...d, ...patch }));
	const setRow = (index: number, patch: Partial<CoverageDraft>) =>
		setDraft((d) => ({
			...d,
			coverageRows: d.coverageRows.map((row, i) => (i === index ? { ...row, ...patch } : row)),
		}));

	const submit = async () => {
		const parsed = insuranceProductSchema.safeParse({
			insurerId: draft.insurerId,
			name: draft.name,
			coveragePercentDefault: draft.coveragePercentDefault.trim(),
			annualCap: draft.annualCap.trim() || null,
			perClaimCap: draft.perClaimCap.trim() || null,
			deductibleFixed: draft.deductibleFixed.trim() || "0",
			deductiblePercent: draft.deductiblePercent.trim() || "0",
			coverageRows: draft.coverageRows.map((row) => ({
				serviceId: row.serviceId,
				coveragePercent: row.coveragePercent.trim(),
			})),
		});
		if (!parsed.success) {
			toast.error(parsed.error.issues[0]?.message ?? "المدخلات غير صالحة");
			return;
		}
		await saveProduct({ id: product?.id, product: parsed.data });
		onOpenChange(false);
	};

	return (
		<AccountingFormSheet
			open={open}
			onOpenChange={onOpenChange}
			title={product ? `تعديل «${product.name}»` : "منتج تأمين جديد"}
			description="تعديل المنتج لا يمسّ مطالبات أُنشئت — كل مطالبة تلتقط شروط منتجها لحظة إنشائها"
			onSubmit={(event) => {
				event.preventDefault();
				void submit();
			}}
			isSaving={isPending}
			submitLabel={product ? "حفظ" : "إنشاء"}
			wide
		>
			<div className="flex flex-col gap-4 p-4">
				<div className="grid grid-cols-2 gap-3">
					<Field>
						<Label>شركة التأمين</Label>
						<Select
							value={draft.insurerId}
							onValueChange={(value) => set({ insurerId: value })}
						>
							<SelectTrigger dir="rtl">
								<SelectValue placeholder="اختر الشركة" />
							</SelectTrigger>
							<SelectContent dir="rtl">
								{insurers
									.filter((row) => row.active || row.id === draft.insurerId)
									.map((row) => (
										<SelectItem
											key={row.id}
											value={row.id}
										>
											{row.name}
										</SelectItem>
									))}
							</SelectContent>
						</Select>
					</Field>
					<Field>
						<Label htmlFor="ipr-name">اسم المنتج</Label>
						<Input
							id="ipr-name"
							value={draft.name}
							onChange={(e) => set({ name: e.target.value })}
							placeholder="بوليصة الأطفال المنزلية بلس"
						/>
					</Field>
					<Field>
						<Label htmlFor="ipr-default">نسبة التغطية الافتراضية %</Label>
						<Input
							id="ipr-default"
							inputMode="decimal"
							value={draft.coveragePercentDefault}
							onChange={(e) => set({ coveragePercentDefault: e.target.value })}
						/>
					</Field>
					<Field>
						<Label htmlFor="ipr-annual">السقف السنوي (فارغ = بلا سقف)</Label>
						<Input
							id="ipr-annual"
							inputMode="decimal"
							value={draft.annualCap}
							onChange={(e) => set({ annualCap: e.target.value })}
						/>
					</Field>
					<Field>
						<Label htmlFor="ipr-claim">سقف المطالبة الواحدة (فارغ = بلا)</Label>
						<Input
							id="ipr-claim"
							inputMode="decimal"
							value={draft.perClaimCap}
							onChange={(e) => set({ perClaimCap: e.target.value })}
						/>
					</Field>
					<Field>
						<Label htmlFor="ipr-dfix">التحمّل الثابت (لكل مطالبة)</Label>
						<Input
							id="ipr-dfix"
							inputMode="decimal"
							value={draft.deductibleFixed}
							onChange={(e) => set({ deductibleFixed: e.target.value })}
						/>
					</Field>
					<Field>
						<Label htmlFor="ipr-dpct">التحمّل النسبي % (بعد الثابت)</Label>
						<Input
							id="ipr-dpct"
							inputMode="decimal"
							value={draft.deductiblePercent}
							onChange={(e) => set({ deductiblePercent: e.target.value })}
						/>
					</Field>
				</div>

				<div className="flex items-center justify-between">
					<div>
						<p className="font-medium text-sm">صفوف تغطية الفئات</p>
						<p className="text-muted-foreground text-xs">
							صف الفئة يشمل شجرتها كاملة، والأعمق تخصيصًا يفوز وحده (قاعدة BR-M4.2.2 نفسها).
							نسبة 0% تعني استثناء الدورة صراحةً.
						</p>
					</div>
					<Button
						type="button"
						size="sm"
						variant="outline"
						onClick={() =>
							set({
								coverageRows: [...draft.coverageRows, { serviceId: "", coveragePercent: "" }],
							})
						}
					>
						<IconPlus className="size-4" />
						صف
					</Button>
				</div>

				{draft.coverageRows.map((row, index) => (
					<div
						// biome-ignore lint/suspicious/noArrayIndexKey: draft rows have no identity yet
						key={index}
						className="flex items-end gap-2 rounded-md border p-3"
					>
						<Field className="flex-1">
							<Label>الدورة / الفئة</Label>
							<Select
								value={row.serviceId}
								onValueChange={(value) => setRow(index, { serviceId: value })}
							>
								<SelectTrigger dir="rtl">
									<SelectValue placeholder="اختر" />
								</SelectTrigger>
								<SelectContent dir="rtl">
									{serviceOptions.map((option) => (
										<SelectItem
											key={option.id}
											value={option.id}
										>
											{option.label}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</Field>
						<Field className="w-32">
							<Label>النسبة %</Label>
							<Input
								inputMode="decimal"
								value={row.coveragePercent}
								onChange={(e) => setRow(index, { coveragePercent: e.target.value })}
							/>
						</Field>
						<Button
							type="button"
							size="icon"
							variant="ghost"
							onClick={() =>
								set({ coverageRows: draft.coverageRows.filter((_, i) => i !== index) })
							}
						>
							<IconTrash className="size-4" />
						</Button>
					</div>
				))}
			</div>
		</AccountingFormSheet>
	);
};
