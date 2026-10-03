import { IconPlus, IconTrash } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
import { useSaveMembershipPlan } from "@/features/accounting/memberships/hooks/use-memberships";
import { useServicesTree } from "@/features/settings/services/hooks/use-services-tree";
import type { MembershipBenefitType } from "@/generated/prisma/enums";
import {
	createMembershipPlanSchema,
	type MembershipPlanResponse,
} from "@sanad/contracts/runtime/server/accounting/membership/membership-plan.type";

/**
 * [MI-P1] Plan create/edit sheet (FR-M4.1/M4.2). Benefit rows are edited inline with
 * per-type field visibility (BR-M4.2.1); the shared zod schema is the validator, so the
 * sheet can never send a combination the server would refuse. The service picker offers
 * every tree node — a CATEGORY row applies to its whole subtree (BR-M4.2.2), and the
 * hint under the picker says so.
 */

const BENEFIT_TYPES: { value: MembershipBenefitType; label: string }[] = [
	{ value: "SERVICE_DISCOUNT", label: "خصم دورة" },
	{ value: "PRODUCT_DISCOUNT", label: "خصم منتجات" },
	{ value: "INCLUDED_UNITS", label: "وحدات مشمولة" },
	{ value: "PRIORITY_BOOKING", label: "أولوية حجز" },
	{ value: "PERK", label: "امتياز (وصف حر)" },
];

type BenefitDraft = {
	benefitType: MembershipBenefitType;
	serviceId: string;
	discountMode: "percent" | "amount";
	discountPercent: string;
	discountAmount: string;
	unitsPerPeriod: string;
	labelAr: string;
};

const EMPTY_BENEFIT: BenefitDraft = {
	benefitType: "SERVICE_DISCOUNT",
	serviceId: "",
	discountMode: "percent",
	discountPercent: "",
	discountAmount: "",
	unitsPerPeriod: "1",
	labelAr: "",
};

type HeaderDraft = {
	name: string;
	description: string;
	tierRank: string;
	billingInterval: "MONTH" | "YEAR";
	intervalCount: string;
	fee: string;
	enrollmentFee: string;
	deferRevenue: boolean;
	autoRenew: boolean;
	graceDays: string;
};

const EMPTY_HEADER: HeaderDraft = {
	name: "",
	description: "",
	tierRank: "0",
	billingInterval: "MONTH",
	intervalCount: "1",
	fee: "",
	enrollmentFee: "0",
	deferRevenue: false,
	autoRenew: true,
	graceDays: "7",
};

const fromPlan = (
	plan: MembershipPlanResponse,
): { header: HeaderDraft; rows: BenefitDraft[] } => ({
	header: {
		name: plan.name,
		description: plan.description ?? "",
		tierRank: String(plan.tierRank),
		billingInterval: plan.billingInterval === "YEAR" ? "YEAR" : "MONTH",
		intervalCount: String(plan.intervalCount),
		fee: plan.fee.toString(),
		enrollmentFee: plan.enrollmentFee.toString(),
		deferRevenue: plan.deferRevenue,
		autoRenew: plan.autoRenew,
		graceDays: String(plan.graceDays),
	},
	rows: plan.benefits.map((row) => ({
		benefitType: row.benefitType,
		serviceId: row.serviceId ?? "",
		discountMode: row.discountAmount != null ? "amount" : "percent",
		discountPercent: row.discountPercent?.toString() ?? "",
		discountAmount: row.discountAmount?.toString() ?? "",
		unitsPerPeriod: row.unitsPerPeriod != null ? String(row.unitsPerPeriod) : "1",
		labelAr: row.labelAr ?? "",
	})),
});

export const PlanSheet = ({
	open,
	onOpenChange,
	plan,
}: {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	/** null = create */
	plan: MembershipPlanResponse | null;
}) => {
	const { savePlan, isPending } = useSaveMembershipPlan();
	const { tree } = useServicesTree();
	const [header, setHeader] = useState<HeaderDraft>(EMPTY_HEADER);
	const [rows, setRows] = useState<BenefitDraft[]>([]);

	useEffect(() => {
		if (!open) return;
		if (plan) {
			const initial = fromPlan(plan);
			setHeader(initial.header);
			setRows(initial.rows);
		} else {
			setHeader(EMPTY_HEADER);
			setRows([]);
		}
	}, [open, plan]);

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

	const set = (patch: Partial<HeaderDraft>) => setHeader((h) => ({ ...h, ...patch }));
	const setRow = (index: number, patch: Partial<BenefitDraft>) =>
		setRows((all) => all.map((row, i) => (i === index ? { ...row, ...patch } : row)));

	const submit = async () => {
		const candidate = {
			name: header.name,
			description: header.description || null,
			tierRank: Number(header.tierRank || 0),
			billingInterval: header.billingInterval,
			intervalCount: Number(header.intervalCount || 1),
			fee: header.fee.trim(),
			enrollmentFee: header.enrollmentFee.trim() || "0",
			deferRevenue: header.deferRevenue,
			autoRenew: header.autoRenew,
			graceDays: Number(header.graceDays || 0),
			benefits: rows.map((row) => ({
				benefitType: row.benefitType,
				serviceId:
					row.benefitType === "SERVICE_DISCOUNT" || row.benefitType === "INCLUDED_UNITS"
						? row.serviceId || null
						: null,
				discountPercent:
					(row.benefitType === "SERVICE_DISCOUNT" && row.discountMode === "percent") ||
					row.benefitType === "PRODUCT_DISCOUNT"
						? row.discountPercent.trim() || null
						: null,
				discountAmount:
					row.benefitType === "SERVICE_DISCOUNT" && row.discountMode === "amount"
						? row.discountAmount.trim() || null
						: null,
				unitsPerPeriod:
					row.benefitType === "INCLUDED_UNITS" ? Number(row.unitsPerPeriod || 0) : null,
				labelAr: row.benefitType === "PERK" ? row.labelAr.trim() || null : null,
			})),
		};
		const parsed = createMembershipPlanSchema.safeParse(candidate);
		if (!parsed.success) {
			toast.error(parsed.error.issues[0]?.message ?? "المدخلات غير صالحة");
			return;
		}
		const saved = await savePlan({ id: plan?.id, plan: parsed.data });
		// [MI-P2] §17.1-R1: تسعير الخطة دون قيمة مزاياها تحذيرٌ لا منع — قرار وليّ الأمر (س1)
		const assessment = saved?.valueAssessment;
		if (assessment?.belowValue) {
			toast.warning(
				`تنبيه: القيمة التقديرية لمزايا الخطة (${assessment.estimatedValue}) أعلى من رسمها (${assessment.fee})${
					assessment.partial ? " — والتقدير جزئي لأن بعض المزايا لا يمكن تقديرها" : ""
				}`,
				{ duration: 10_000 },
			);
		}
		onOpenChange(false);
	};

	return (
		<AccountingFormSheet
			open={open}
			onOpenChange={onOpenChange}
			title={plan ? `تعديل «${plan.name}»` : "خطة عضوية جديدة"}
			description="تعديل الخطة لا يمسّ العضويات القائمة منتصف فترتها — التغييرات تسري عند التجديد القادم (AR-M2)"
			onSubmit={(event) => {
				event.preventDefault();
				void submit();
			}}
			isSaving={isPending}
			submitLabel={plan ? "حفظ" : "إنشاء"}
			wide
		>
			<div className="flex flex-col gap-4 p-4">
				<div className="grid grid-cols-2 gap-3">
					<Field>
						<Label htmlFor="mpl-name">اسم الخطة</Label>
						<Input
							id="mpl-name"
							value={header.name}
							onChange={(e) => set({ name: e.target.value })}
							placeholder="الباقة الذهبية"
						/>
					</Field>
					<Field>
						<Label htmlFor="mpl-tier">ترتيب الفئة (الأعلى = الأفضل)</Label>
						<Input
							id="mpl-tier"
							type="number"
							min={0}
							value={header.tierRank}
							onChange={(e) => set({ tierRank: e.target.value })}
						/>
					</Field>
					<Field>
						<Label>دورية الفوترة</Label>
						<Select
							value={header.billingInterval}
							onValueChange={(value) =>
								set({ billingInterval: value === "YEAR" ? "YEAR" : "MONTH" })
							}
						>
							<SelectTrigger>
								<SelectValue />
							</SelectTrigger>
							<SelectContent dir="rtl">
								<SelectItem value="MONTH">شهرية</SelectItem>
								<SelectItem value="YEAR">سنوية</SelectItem>
							</SelectContent>
						</Select>
					</Field>
					<Field>
						<Label htmlFor="mpl-count">عدد الدورات (3 + شهرية = ربع سنوية)</Label>
						<Input
							id="mpl-count"
							type="number"
							min={1}
							value={header.intervalCount}
							onChange={(e) => set({ intervalCount: e.target.value })}
						/>
					</Field>
					<Field>
						<Label htmlFor="mpl-fee">الرسم الدوري (بلا ضريبة)</Label>
						<Input
							id="mpl-fee"
							inputMode="decimal"
							value={header.fee}
							onChange={(e) => set({ fee: e.target.value })}
							placeholder="300"
						/>
					</Field>
					<Field>
						<Label htmlFor="mpl-enroll">رسم التسجيل (مرة واحدة، أول فاتورة)</Label>
						<Input
							id="mpl-enroll"
							inputMode="decimal"
							value={header.enrollmentFee}
							onChange={(e) => set({ enrollmentFee: e.target.value })}
						/>
					</Field>
					<Field>
						<Label htmlFor="mpl-grace">أيام السماح بعد بداية الفترة</Label>
						<Input
							id="mpl-grace"
							type="number"
							min={0}
							value={header.graceDays}
							onChange={(e) => set({ graceDays: e.target.value })}
						/>
					</Field>
					<Field>
						<Label htmlFor="mpl-desc">وصف يظهر على البيع وبطاقة العضو</Label>
						<Input
							id="mpl-desc"
							value={header.description}
							onChange={(e) => set({ description: e.target.value })}
						/>
					</Field>
				</div>

				<div className="flex flex-wrap items-center gap-6">
					<label
						htmlFor="mpl-auto-renew"
						className="flex items-center gap-2 text-sm"
					>
						<Checkbox
							id="mpl-auto-renew"
							checked={header.autoRenew}
							onCheckedChange={(checked) => set({ autoRenew: checked === true })}
						/>
						تجديد تلقائي (إيقافه = عضوية فترة واحدة تنتهي بنهايتها)
					</label>
					<label
						htmlFor="mpl-defer"
						className="flex items-center gap-2 text-sm"
					>
						<Checkbox
							id="mpl-defer"
							checked={header.deferRevenue}
							onCheckedChange={(checked) => set({ deferRevenue: checked === true })}
						/>
						تأجيل الإيراد على مدى الفترة (يتطلب ضبط «حساب الإيراد المؤجل للعضويات»)
					</label>
				</div>

				<div className="flex items-center justify-between border-t pt-3">
					<p className="font-medium text-sm">المزايا</p>
					<Button
						type="button"
						size="sm"
						variant="outline"
						onClick={() => setRows((all) => [...all, { ...EMPTY_BENEFIT }])}
					>
						<IconPlus className="size-4" />
						إضافة ميزة
					</Button>
				</div>

				{rows.length === 0 && (
					<p className="text-muted-foreground text-sm">
						لا مزايا بعد — خطة بلا مزايا قانونية لكنها لا تمنح العضو شيئًا عند التسعير.
					</p>
				)}

				{rows.map((row, index) => (
					<div
						key={`benefit-${index}`}
						className="flex flex-col gap-2 rounded-md border p-3"
					>
						<div className="flex items-center gap-2">
							<Select
								value={row.benefitType}
								onValueChange={(value) =>
									setRow(index, { benefitType: value as MembershipBenefitType })
								}
							>
								<SelectTrigger className="w-44">
									<SelectValue />
								</SelectTrigger>
								<SelectContent dir="rtl">
									{BENEFIT_TYPES.map((type) => (
										<SelectItem
											key={type.value}
											value={type.value}
										>
											{type.label}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
							<Button
								type="button"
								size="icon-sm"
								variant="ghost"
								className="ms-auto"
								aria-label="حذف الميزة"
								onClick={() => setRows((all) => all.filter((_, i) => i !== index))}
							>
								<IconTrash className="size-4" />
							</Button>
						</div>

						{(row.benefitType === "SERVICE_DISCOUNT" ||
							row.benefitType === "INCLUDED_UNITS") && (
							<Field>
								<Label>الدورة أو الفئة (الفئة تشمل شجرتها كاملة)</Label>
								<Select
									value={row.serviceId || undefined}
									onValueChange={(value) => setRow(index, { serviceId: value })}
								>
									<SelectTrigger>
										<SelectValue placeholder="اختر دورة أو فئة" />
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
						)}

						{row.benefitType === "SERVICE_DISCOUNT" && (
							<div className="grid grid-cols-2 gap-2">
								<Field>
									<Label>نوع الخصم</Label>
									<Select
										value={row.discountMode}
										onValueChange={(value) =>
											setRow(index, {
												discountMode: value === "amount" ? "amount" : "percent",
											})
										}
									>
										<SelectTrigger>
											<SelectValue />
										</SelectTrigger>
										<SelectContent dir="rtl">
											<SelectItem value="percent">نسبة %</SelectItem>
											<SelectItem value="amount">مبلغ ثابت لكل بند</SelectItem>
										</SelectContent>
									</Select>
								</Field>
								{row.discountMode === "percent" ? (
									<Field>
										<Label>النسبة (0–100)</Label>
										<Input
											inputMode="decimal"
											value={row.discountPercent}
											onChange={(e) => setRow(index, { discountPercent: e.target.value })}
										/>
									</Field>
								) : (
									<Field>
										<Label>المبلغ</Label>
										<Input
											inputMode="decimal"
											value={row.discountAmount}
											onChange={(e) => setRow(index, { discountAmount: e.target.value })}
										/>
									</Field>
								)}
							</div>
						)}

						{row.benefitType === "PRODUCT_DISCOUNT" && (
							<Field>
								<Label>نسبة الخصم على المنتجات (0–100)</Label>
								<Input
									inputMode="decimal"
									value={row.discountPercent}
									onChange={(e) => setRow(index, { discountPercent: e.target.value })}
								/>
							</Field>
						)}

						{row.benefitType === "INCLUDED_UNITS" && (
							<Field>
								<Label>وحدات مجانية لكل فترة</Label>
								<Input
									type="number"
									min={1}
									value={row.unitsPerPeriod}
									onChange={(e) => setRow(index, { unitsPerPeriod: e.target.value })}
								/>
							</Field>
						)}

						{row.benefitType === "PERK" && (
							<Field>
								<Label>وصف الامتياز (يظهر على بطاقة العضو)</Label>
								<Input
									value={row.labelAr}
									onChange={(e) => setRow(index, { labelAr: e.target.value })}
									placeholder="استحمام مجاني شهريًا"
								/>
							</Field>
						)}

						{row.benefitType === "PRIORITY_BOOKING" && (
							<p className="text-muted-foreground text-xs">
								علامة تظهر على شاشات الجلسات — بلا حقول إضافية.
							</p>
						)}
					</div>
				))}
			</div>
		</AccountingFormSheet>
	);
};
