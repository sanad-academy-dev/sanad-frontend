import {
	IconAlertCircle,
	IconArrowsExchange,
	IconBrandWhatsapp,
	IconCheck,
	IconChevronLeft,
	IconCopy,
	IconDots,
	IconEdit,
	IconExternalLink,
	IconEye,
	IconHeartHandshake,
	IconLayoutGrid,
	IconMail,
	IconMapPin,
	IconPhone,
	IconPhoneCall,
	IconPlus,
	IconSchool,
	IconShieldCheck,
	IconTable,
	IconUser,
	IconUserCheck,
	IconUserOff,
	IconUserPlus,
	IconUsers,
} from "@tabler/icons-react";
import { Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { InitialsAvatar } from "@/components/common/initials-avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { TabsContent } from "@/components/ui/tabs";
import { PatientPolicyCard } from "@/features/accounting/insurance/components/patient-policy-card";
import { usePatient } from "@/features/services/patients/hooks/use-patient";
import { usePatients } from "@/features/services/patients/hooks/use-patients";
import type { PatientTabProps } from "@/features/services/patients/types/tabs.types";
import { cn } from "@/lib/utils";

interface GuardianTabProps extends PatientTabProps {
	onTransferOwnership?: () => void;
	onEditPatient?: () => void;
}

interface GuardianItem {
	id: string;
	code: string | null;
	name: string;
	phone: string | null;
	email: string | null;
	relationship: string | null;
	active: boolean;
	address: string | null;
	city: string | null;
	country: string | null;
	notes: string | null;
	createdAt?: string | Date | null;
	isDirectOnly: boolean;
}

function formatRelationship(rel?: string | null): { text: string; colorClass: string } {
	if (!rel) {
		return {
			text: "ولي أمر",
			colorClass: "bg-primary/10 text-primary border-primary/20",
		};
	}
	const u = rel.toUpperCase().trim();
	if (u === "FATHER" || rel === "أب") {
		return {
			text: "الأب",
			colorClass: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800",
		};
	}
	if (u === "MOTHER" || rel === "أم") {
		return {
			text: "الأم",
			colorClass: "bg-pink-50 text-pink-700 border-pink-200 dark:bg-pink-950/40 dark:text-pink-300 dark:border-pink-800",
		};
	}
	if (u === "GUARDIAN" || rel.includes("وصي") || rel.includes("كفيل")) {
		return {
			text: "وصي / كفيل",
			colorClass: "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-800",
		};
	}
	if (u === "DELEGATE" || rel === "مفوض") {
		return {
			text: "مفوض رسمي",
			colorClass: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800",
		};
	}
	if (u === "BROTHER" || rel === "أخ") {
		return {
			text: "الأخ",
			colorClass: "bg-cyan-50 text-cyan-700 border-cyan-200 dark:bg-cyan-950/40 dark:text-cyan-300 dark:border-cyan-800",
		};
	}
	if (u === "SISTER" || rel === "أخت") {
		return {
			text: "الأخت",
			colorClass: "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800",
		};
	}
	return {
		text: rel,
		colorClass: "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300",
	};
}

export function GuardianTab({
	patientId,
	onTransferOwnership,
	onEditPatient,
}: GuardianTabProps) {
	const navigate = useNavigate();
	const { patient, isLoading } = usePatient(patientId);
	const { patients: allPatients } = usePatients();

	const [copiedKey, setCopiedKey] = useState<string | null>(null);
	const [viewMode, setViewMode] = useState<"table" | "cards">("table");

	const handleCopy = (text: string, label: string, key: string) => {
		if (!text) return;
		navigator.clipboard.writeText(text);
		setCopiedKey(key);
		toast.success(`تم نسخ ${label}`);
		setTimeout(() => setCopiedKey(null), 2000);
	};

	// تجميع بيانات أولياء الأمور المرتبطين بالطالب
	const guardians = useMemo<GuardianItem[]>(() => {
		if (!patient) return [];
		const result: GuardianItem[] = [];

		if (patient.guardians && patient.guardians.length > 0) {
			for (const g of patient.guardians) {
				if (g.owner) {
					result.push({
						id: g.owner.id,
						code: g.owner.code || null,
						name: g.owner.name,
						phone: g.owner.phone || null,
						email: g.owner.email || null,
						relationship:
							g.relationship ||
							g.owner.relationship ||
							patient.guardianRelationship ||
							null,
						active: g.owner.active !== false,
						address: g.owner.address || null,
						city: g.owner.city || null,
						country: g.owner.country || null,
						notes: g.owner.notes || null,
						createdAt: g.owner.createdAt,
						isDirectOnly: false,
					});
				}
			}
		} else if (patient.owner) {
			result.push({
				id: patient.owner.id,
				code: patient.owner.code || null,
				name: patient.owner.name,
				phone: patient.owner.phone || null,
				email: patient.owner.email || null,
				relationship:
					patient.guardianRelationship ||
					patient.owner.relationship ||
					null,
				active: patient.owner.active !== false,
				address: patient.owner.address || null,
				city: patient.owner.city || null,
				country: patient.owner.country || null,
				notes: patient.owner.notes || null,
				createdAt: patient.owner.createdAt,
				isDirectOnly: false,
			});
		} else if (patient.guardianName || patient.guardianPhone) {
			result.push({
				id: "direct",
				code: null,
				name: patient.guardianName || "ولي أمر غير محدد",
				phone: patient.guardianPhone || null,
				email: patient.guardianEmail || null,
				relationship: patient.guardianRelationship || null,
				active: true,
				address: patient.address || null,
				city: null,
				country: null,
				notes: null,
				createdAt: patient.createdAt,
				isDirectOnly: true,
			});
		}

		return result;
	}, [patient]);

	// حساب الطلاب الإخوة تحت نفس ولي الأمر
	const getSiblingCount = (guardianId: string, guardianPhone?: string | null) => {
		if (!guardianId) return 0;
		return allPatients.filter((p) => {
			if (p.id === patient?.id) return false;
			if (guardianId !== "direct" && p.owner?.id === guardianId) return true;
			if (guardianId !== "direct" && p.guardians?.some((g) => g.owner?.id === guardianId)) return true;
			if (guardianPhone && (p.owner?.phone === guardianPhone || p.guardianPhone === guardianPhone)) return true;
			return false;
		}).length;
	};

	if (isLoading && !patient) {
		return (
			<TabsContent value="guardian" className="m-0 p-4" dir="rtl">
				<div className="flex flex-col gap-4">
					<Skeleton className="h-14 w-full rounded-xl" />
					<Skeleton className="h-64 w-full rounded-xl" />
				</div>
			</TabsContent>
		);
	}

	if (!patient) {
		return (
			<TabsContent value="guardian" className="m-0 p-6" dir="rtl">
				<div className="flex flex-col items-center justify-center gap-3 py-12 text-center">
					<IconAlertCircle className="size-10 text-amber-500" />
					<p className="font-semibold text-foreground">تعذر العثور على بيانات الطالب</p>
					<p className="text-xs text-muted-foreground">تأكد من صحة معرّف الطالب والمحاولة مجدداً</p>
				</div>
			</TabsContent>
		);
	}

	const hasGuardians = guardians.length > 0;

	return (
		<TabsContent
			value="guardian"
			className="m-0 p-4 md:p-5 flex flex-col gap-5 overflow-y-auto"
			dir="rtl"
		>
			{/* ── الترويسة الرئيسية التفاعلية ── */}
			<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl border border-border/80 bg-gradient-to-r from-card via-card to-muted/20 shadow-xs">
				<div className="flex items-center gap-3.5">
					<div className="size-11 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shadow-2xs shrink-0">
						<IconUsers className="size-5" />
					</div>
					<div className="flex flex-col gap-0.5">
						<div className="flex items-center gap-2 flex-wrap">
							<h3 className="text-sm md:text-base font-bold text-foreground tracking-tight">
								بيانات أولياء الأمور المرتبطين بالطالب
							</h3>
							{hasGuardians && (
								<span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800 shadow-2xs">
									<span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
									<span>{guardians.length} مسجل ونشط</span>
								</span>
							)}
						</div>
						<p className="text-xs text-muted-foreground">
							إدارة الحسابات المسؤولة عن متابعة الطالب والتواصل واستلام الفواتير
						</p>
					</div>
				</div>

				<div className="flex items-center gap-2 shrink-0 flex-wrap">
					{/* مبدل نمط العرض (جدول / بطاقات) */}
					{/* {hasGuardians && (
						<div className="flex items-center p-0.5 rounded-lg border border-border bg-muted/40">
							<button
								type="button"
								onClick={() => setViewMode("table")}
								className={cn(
									"flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium transition-all cursor-pointer",
									viewMode === "table"
										? "bg-background text-foreground shadow-2xs font-semibold"
										: "text-muted-foreground hover:text-foreground",
								)}
								title="عرض الجدول"
							>
								<IconTable className="size-3.5" />
								<span className="hidden sm:inline">جدول</span>
							</button>
							<button
								type="button"
								onClick={() => setViewMode("cards")}
								className={cn(
									"flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium transition-all cursor-pointer",
									viewMode === "cards"
										? "bg-background text-foreground shadow-2xs font-semibold"
										: "text-muted-foreground hover:text-foreground",
								)}
								title="عرض البطاقات الحية"
							>
								<IconLayoutGrid className="size-3.5" />
								<span className="hidden sm:inline">بطاقات</span>
							</button>
						</div>
					)} */}

					{/* أزرار الإجراءات */}
					{/* {onTransferOwnership && (
						<Button
							size="sm"
							className="gap-1.5 text-xs h-8.5 font-medium shadow-xs"
							onClick={onTransferOwnership}
						>
							<IconArrowsExchange className="size-4" />
							<span>ربط / تغيير ولي أمر</span>
						</Button>
					)} */}
					{onEditPatient && (
						<Button
							size="sm"
							variant="outline"
							className="gap-1.5 text-xs h-8.5 font-medium"
							onClick={onEditPatient}
						>
							<IconEdit className="size-3.5" />
							<span>تعديل البيانات</span>
						</Button>
					)}
				</div>
			</div>

			{/* ── المحتوى الرئيسي: جدول أو بطاقات ── */}
			{!hasGuardians ? (
				/* حالة عدم وجود أولياء أمور */
				<div className="rounded-2xl border-2 border-dashed border-border/70 p-10 flex flex-col items-center justify-center text-center gap-4 bg-muted/5">
					<div className="size-14 rounded-2xl bg-muted flex items-center justify-center text-muted-foreground shadow-inner">
						<IconUserOff className="size-7" />
					</div>
					<div className="flex flex-col gap-1 max-w-md">
						<h4 className="font-bold text-sm text-foreground">
							لا يوجد وليّ أمر مسجل لهذا الطالب حتى الآن
						</h4>
						<p className="text-xs text-muted-foreground leading-relaxed">
							يمكنك ربط ولي أمر مسجل في النظام بهذا الطالب أو تحديث بيانات التواصل الخاصة به
							لتمكين المتابعة والتواصل واستخراج الفواتير.
						</p>
					</div>

					<div className="flex items-center gap-2.5 pt-2">
						{onTransferOwnership && (
							<Button size="sm" onClick={onTransferOwnership} className="gap-1.5 shadow-xs">
								<IconUserPlus className="size-4" />
								<span>ربط ولي أمر الآن</span>
							</Button>
						)}
						{onEditPatient && (
							<Button size="sm" variant="outline" onClick={onEditPatient} className="gap-1.5">
								<IconEdit className="size-4" />
								<span>إضافة بيانات الاتصال</span>
							</Button>
						)}
					</div>
				</div>
			) : viewMode === "table" ? (
				/* ── العرض الأول: جدول احترافي متناسق ومتجاوب 100% ── */
				<div className="rounded-2xl border border-border/80 bg-card overflow-hidden shadow-xs">
					<div className="overflow-x-auto scrollbar-thin">
						<table className="w-full text-right border-collapse text-xs">
							<thead>
								<tr className="border-b border-border/80 bg-muted/40 text-muted-foreground font-semibold text-[11px] select-none">
									<th className="py-3 px-4 w-[28%]">وليّ الأمر / المعرّف</th>
									<th className="py-3 px-3 w-[14%]">صلة القرابة</th>
									<th className="py-3 px-4 w-[28%]">التواصل السريع المباشر</th>
									<th className="py-3 px-3 w-[15%]">العنوان والإقامة</th>
									<th className="py-3 px-3 w-[10%] text-center">الحالة</th>
									<th className="py-3 px-4 w-[15%] text-start">الإجراءات</th>
								</tr>
							</thead>
							<tbody className="divide-y divide-border/60">
								{guardians.map((g) => {
									const rel = formatRelationship(g.relationship);
									const cleanPhone = (g.phone || "").replace(/\D/g, "");
									const fullAddress =
										g.address ||
										[g.city, g.country].filter(Boolean).join("، ") ||
										"—";
									const siblingCount = getSiblingCount(g.id, g.phone);

									return (
										<tr
											key={g.id}
											className="hover:bg-primary/[0.02] transition-colors group cursor-pointer"
											onClick={() => {
												if (!g.isDirectOnly) {
													navigate({
														to: "/services/owners/$ownerId",
														params: { ownerId: g.id },
													});
												}
											}}
										>
											{/* 1. ولي الأمر والمعرف */}
											<td className="py-3 px-4 align-middle">
												<div className="flex items-center gap-3">
													<div className="relative shrink-0">
														<InitialsAvatar
															name={g.name}
															className="size-9 rounded-xl bg-primary text-primary-foreground font-bold text-xs shadow-2xs"
														/>
														<span
															className={cn(
																"absolute -bottom-0.5 -left-0.5 size-2.5 rounded-full border-2 border-card",
																g.active ? "bg-emerald-500" : "bg-muted-foreground/40",
															)}
														/>
													</div>

													<div className="flex flex-col min-w-0">
														<div className="flex items-center gap-1.5">
															{!g.isDirectOnly ? (
																<Link
																	to="/services/owners/$ownerId"
																	params={{ ownerId: g.id }}
																	className="font-bold text-xs text-foreground group-hover:text-primary transition-colors hover:underline truncate"
																	onClick={(e) => e.stopPropagation()}
																>
																	{g.name}
																</Link>
															) : (
																<span className="font-bold text-xs text-foreground truncate">
																	{g.name}
																</span>
															)}
															{!g.isDirectOnly && (
																<IconExternalLink className="size-3 text-muted-foreground/60 group-hover:text-primary transition-colors shrink-0" />
															)}
														</div>

														<div className="flex items-center gap-2 pt-0.5">
															{siblingCount > 0 && (
																<span className="text-[10px] text-primary/80 font-medium">
																	+{siblingCount} إخوة بالمركز
																</span>
															)}
														</div>
													</div>
												</div>
											</td>

											{/* 2. صلة القرابة */}
											<td className="py-3 px-3 align-middle">
												<span
													className={cn(
														"inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold border shadow-2xs whitespace-nowrap",
														rel.colorClass,
													)}
												>
													{rel.text}
												</span>
											</td>

											{/* 3. التواصل المباشر (أزرار لايف) */}
											<td className="py-3 px-4 align-middle" onClick={(e) => e.stopPropagation()}>
												<div className="flex flex-col gap-1">
													{g.phone ? (
														<div className="flex items-center gap-1.5">
															<span
																className="font-mono text-xs font-semibold text-foreground tabular-nums"
																dir="ltr"
															>
																{g.phone}
															</span>
														</div>
													) : (
														<span className="text-muted-foreground text-[11px]">لا يوجد هاتف</span>
													)}

													{g.email && (
														<div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
															<IconMail className="size-3 shrink-0" />
															<a
																href={`mailto:${g.email}`}
																className="truncate hover:underline hover:text-primary transition-colors max-w-[150px]"
																dir="ltr"
																title={g.email}
															>
																{g.email}
															</a>
														</div>
													)}
												</div>
											</td>

											{/* 4. العنوان ومكان الإقامة */}
											<td className="py-3 px-3 align-middle text-muted-foreground">
												<div className="flex items-center gap-1 max-w-[140px]" title={fullAddress}>
													<IconMapPin className="size-3.5 shrink-0 text-muted-foreground/70" />
													<span className="truncate">{fullAddress}</span>
												</div>
											</td>

											{/* 5. الحالة */}
											<td className="py-3 px-3 align-middle text-center">
												<span
													className={cn(
														"inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border",
														g.active
															? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800"
															: "bg-muted text-muted-foreground border-border",
													)}
												>
													<span
														className={cn(
															"size-1.5 rounded-full",
															g.active ? "bg-emerald-500 animate-pulse" : "bg-muted-foreground/60",
														)}
													/>
													<span>{g.active ? "نشط" : "غير نشط"}</span>
												</span>
											</td>

											{/* 6. الإجراءات التفاعلية */}
											<td className="py-3 px-4 align-middle" onClick={(e) => e.stopPropagation()}>
												<div className="flex items-center justify-end gap-1.5">
													{!g.isDirectOnly && (
														<Button
															asChild
															size="sm"
															variant="outline"
															className="h-7 text-xs px-2.5 gap-1 text-primary hover:text-primary hover:bg-primary/10 border-primary/20 shrink-0 font-medium"
														>
															
														</Button>
													)}

													<DropdownMenu dir="rtl">
														<DropdownMenuTrigger asChild>
															<Button
																variant="ghost"
																size="icon"
																className="size-7 text-muted-foreground hover:text-foreground"
															>
																<IconDots className="size-3.5" />
															</Button>
														</DropdownMenuTrigger>
														<DropdownMenuContent align="start" className="w-48">
															{/* {!g.isDirectOnly && (
																<DropdownMenuItem
																	className="gap-2 text-xs cursor-pointer font-medium text-primary"
																	onSelect={() => {
																		navigate({
																			to: "/services/owners/$ownerId",
																			params: { ownerId: g.id },
																		});
																	}}
																>
																	<IconEye className="size-3.5" />
																	<span>فتح الملف في صفحة مستقلة</span>
																</DropdownMenuItem>
															)} */}

															{g.phone && (
																<>
																	<DropdownMenuItem
																		className="gap-2 text-xs cursor-pointer text-emerald-600"
																		onSelect={() => window.open(`https://wa.me/${cleanPhone}`, "_blank")}
																	>
																		<IconBrandWhatsapp className="size-3.5" />
																		<span>مراسلة واتساب</span>
																	</DropdownMenuItem>
																	<DropdownMenuItem
																		className="gap-2 text-xs cursor-pointer"
																		onSelect={() => window.open(`tel:${g.phone}`, "_self")}
																	>
																		<IconPhone className="size-3.5" />
																		<span>اتصال هاتفي</span>
																	</DropdownMenuItem>
																	<DropdownMenuItem
																		className="gap-2 text-xs cursor-pointer"
																		onSelect={() => handleCopy(g.phone!, "رقم الهاتف", `ph-dd-${g.id}`)}
																	>
																		<IconCopy className="size-3.5" />
																		<span>نسخ رقم الهاتف</span>
																	</DropdownMenuItem>
																</>
															)}

															{g.email && (
																<DropdownMenuItem
																	className="gap-2 text-xs cursor-pointer"
																	onSelect={() => handleCopy(g.email!, "البريد الإلكتروني", `em-dd-${g.id}`)}
																>
																	<IconCopy className="size-3.5" />
																	<span>نسخ البريد الإلكتروني</span>
																</DropdownMenuItem>
															)}

															{(onTransferOwnership || onEditPatient) && <DropdownMenuSeparator />}

															{onTransferOwnership && (
																<DropdownMenuItem
																	className="gap-2 text-xs cursor-pointer"
																	onSelect={onTransferOwnership}
																>
																	<IconArrowsExchange className="size-3.5 text-primary" />
																	<span>نقل الملكية / تغيير ولي الأمر</span>
																</DropdownMenuItem>
															)}

															{onEditPatient && (
																<DropdownMenuItem
																	className="gap-2 text-xs cursor-pointer"
																	onSelect={onEditPatient}
																>
																	<IconEdit className="size-3.5" />
																	<span>تعديل بيانات الطفل</span>
																</DropdownMenuItem>
															)}
														</DropdownMenuContent>
													</DropdownMenu>
												</div>
											</td>
										</tr>
									);
								})}
							</tbody>
						</table>
					</div>
				</div>
			) : (
				/* ── العرض الثاني: بطاقات حية نابضة بالحياة (Live Cards View) ── */
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					{guardians.map((g) => {
						const rel = formatRelationship(g.relationship);
						const cleanPhone = (g.phone || "").replace(/\D/g, "");
						const fullAddress =
							g.address ||
							[g.city, g.country].filter(Boolean).join("، ") ||
							"غير مسجل";
						const siblingCount = getSiblingCount(g.id, g.phone);

						return (
							<div
								key={g.id}
								className="rounded-2xl border border-border/80 bg-card p-4 shadow-2xs hover:border-primary/50 hover:shadow-md transition-all flex flex-col justify-between gap-4 relative overflow-hidden"
							>
								<div className="flex flex-col gap-3">
									{/* رأس البطاقة */}
									<div className="flex items-center justify-between gap-3">
										<div className="flex items-center gap-3 min-w-0">
											<div className="relative shrink-0">
												<InitialsAvatar
													name={g.name}
													className="size-12 rounded-xl bg-primary text-primary-foreground font-bold text-sm shadow-xs"
												/>
												<span
													className={cn(
														"absolute -bottom-1 -left-1 size-3 rounded-full border-2 border-card",
														g.active ? "bg-emerald-500" : "bg-muted-foreground",
													)}
												/>
											</div>

											<div className="flex flex-col min-w-0">
												<div className="flex items-center gap-2">
													{!g.isDirectOnly ? (
														<Link
															to="/services/owners/$ownerId"
															params={{ ownerId: g.id }}
															className="font-bold text-sm text-foreground hover:text-primary transition-colors truncate"
														>
															{g.name}
														</Link>
													) : (
														<span className="font-bold text-sm text-foreground truncate">
															{g.name}
														</span>
													)}
													<span
														className={cn(
															"px-2 py-0.5 rounded-full text-[10px] font-semibold border",
															rel.colorClass,
														)}
													>
														{rel.text}
													</span>
												</div>
												<span className="font-mono text-[11px] text-muted-foreground">
													{g.code || "—"}
												</span>
											</div>
										</div>

										<span
											className={cn(
												"inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border shrink-0",
												g.active
													? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300"
													: "bg-muted text-muted-foreground",
											)}
										>
											<span
												className={cn(
													"size-1.5 rounded-full",
													g.active ? "bg-emerald-500 animate-pulse" : "bg-muted-foreground",
												)}
											/>
											{g.active ? "نشط" : "غير نشط"}
										</span>
									</div>

									{/* بيانات التواصل السريعة */}
									<div className="grid grid-cols-1 gap-2 pt-1 text-xs">
										{g.phone && (
											<div className="flex items-center justify-between p-2 rounded-xl bg-muted/40 border border-border/50">
												<div className="flex items-center gap-2 tabular-nums">
													<IconPhone className="size-3.5 text-primary shrink-0" />
													<span className="font-mono font-semibold" dir="ltr">
														{g.phone}
													</span>
												</div>
												<div className="flex items-center gap-1">
													<Button
														size="sm"
														variant="ghost"
														className="h-6 px-2 text-[11px] gap-1 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
														onClick={() => window.open(`https://wa.me/${cleanPhone}`, "_blank")}
													>
														<IconBrandWhatsapp className="size-3.5" />
														<span>واتساب</span>
													</Button>
													<Button
														size="sm"
														variant="ghost"
														className="h-6 px-2 text-[11px] gap-1 text-primary hover:bg-primary/10"
														onClick={() => window.open(`tel:${g.phone}`, "_self")}
													>
														<IconPhone className="size-3.5" />
														<span>اتصال</span>
													</Button>
												</div>
											</div>
										)}

										{g.email && (
											<div className="flex items-center justify-between p-2 rounded-xl bg-muted/40 border border-border/50">
												<div className="flex items-center gap-2 min-w-0">
													<IconMail className="size-3.5 text-muted-foreground shrink-0" />
													<span className="truncate text-[11px]" dir="ltr">
														{g.email}
													</span>
												</div>
												<Button
													size="sm"
													variant="ghost"
													className="h-6 px-2 text-[11px] text-muted-foreground"
													onClick={() => handleCopy(g.email!, "البريد الإلكتروني", `c-em-${g.id}`)}
												>
													<IconCopy className="size-3" />
												</Button>
											</div>
										)}

										<div className="flex items-center gap-2 p-2 rounded-xl bg-muted/20 border border-border/40 text-[11px] text-muted-foreground">
											<IconMapPin className="size-3.5 shrink-0 text-muted-foreground" />
											<span className="truncate">{fullAddress}</span>
										</div>
									</div>

									{siblingCount > 0 && (
										<div className="flex items-center gap-1.5 text-[11px] text-primary font-medium px-1">
											<IconSchool className="size-3.5" />
											<span>لديه {siblingCount} طلاب آخرين مسجلين في المركز</span>
										</div>
									)}
								</div>

								{/* أزرار أسفل البطاقة */}
								<div className="flex items-center justify-between gap-2 pt-2 border-t border-border/60">
									{!g.isDirectOnly ? (
										<Button
											asChild
											size="sm"
											variant="default"
											className="h-8 text-xs gap-1.5 flex-1 shadow-xs font-medium"
										>
											<Link
												to="/services/owners/$ownerId"
												params={{ ownerId: g.id }}
											>
												<IconExternalLink className="size-3.5" />
												<span>فتح الملف الكامل لولي الأمر</span>
											</Link>
										</Button>
									) : (
										<span className="text-[11px] text-muted-foreground">بيانات مباشرة</span>
									)}

									{onTransferOwnership && (
										<Button
											size="sm"
											variant="outline"
											className="h-8 text-xs gap-1"
											onClick={onTransferOwnership}
											title="نقل الملكية أو ربط ولي أمر آخر"
										>
											<IconArrowsExchange className="size-3.5" />
											<span className="hidden sm:inline">نقل الملكية</span>
										</Button>
									)}
								</div>
							</div>
						);
					})}
				</div>
			)}

			{/* ── بطاقة جهة الاتصال في حالات الطوارئ (بتصميم حيّ وأنيق) ── */}
			{(() => {
				const emergencyName = patient.owner?.emergencyContactName || patient.emergencyContactName;
				const emergencyPhone = patient.owner?.emergencyContactPhone || patient.emergencyContactPhone;
				const hasEmergency = Boolean(emergencyName || emergencyPhone);

				return (
					<div className="rounded-2xl border border-border/80 bg-card p-4 md:p-5 shadow-2xs flex flex-col gap-3.5">
						<div className="flex items-center justify-between gap-2">
							<div className="flex items-center gap-2.5">
								<div className="size-8 rounded-lg bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400 flex items-center justify-center shrink-0">
									<IconHeartHandshake className="size-4.5" />
								</div>
								<div className="flex flex-col">
									<h4 className="text-sm font-bold text-foreground">جهة الاتصال في حالات الطوارئ</h4>
									<span className="text-[11px] text-muted-foreground">
										للتواصل الفوري في الحالات العاجلة المسجلة لوليّ الأمر
									</span>
								</div>
							</div>

							{patient.owner?.id ? (
								<Button
									asChild
									size="sm"
									variant="ghost"
									className="h-7 text-xs text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/30 gap-1 font-medium"
								>
									<Link
										to="/services/owners/$ownerId"
										params={{ ownerId: patient.owner.id }}
									>
										<IconEdit className="size-3" />
										<span>تعديل من وليّ الأمر</span>
									</Link>
								</Button>
							) : onEditPatient ? (
								<Button
									size="sm"
									variant="ghost"
									className="h-7 text-xs text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/30 gap-1 font-medium"
									onClick={onEditPatient}
								>
									<IconEdit className="size-3" />
									<span>تعديل</span>
								</Button>
							) : null}
						</div>

						{hasEmergency ? (
							<div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
								<div className="p-3 rounded-xl border border-rose-100 bg-rose-50/40 dark:border-rose-900/40 dark:bg-rose-950/20 flex flex-col gap-1">
									<span className="text-[11px] text-muted-foreground font-medium">اسم جهة / شخص الطوارئ</span>
									<span className="text-xs font-bold text-foreground">
										{emergencyName || "غير محدد"}
									</span>
								</div>

								<div className="p-3 rounded-xl border border-rose-100 bg-rose-50/40 dark:border-rose-900/40 dark:bg-rose-950/20 flex items-center justify-between gap-2">
									<div className="flex flex-col gap-0.5">
										<span className="text-[11px] text-muted-foreground font-medium">رقم هاتف الطوارئ</span>
										{emergencyPhone ? (
											<span className="font-mono text-xs font-bold text-rose-600 dark:text-rose-400 tabular-nums" dir="ltr">
												{emergencyPhone}
											</span>
										) : (
											<span className="text-muted-foreground text-xs">غير مسجل</span>
										)}
									</div>

									{emergencyPhone && (
										<div className="flex items-center gap-1">
											<Button
												size="sm"
												variant="outline"
												className="h-7 text-xs gap-1 border-rose-200 text-rose-600 hover:bg-rose-50 dark:border-rose-800"
												onClick={() => window.open(`tel:${emergencyPhone}`, "_self")}
											>
												<IconPhoneCall className="size-3" />
												<span>اتصال</span>
											</Button>
											<Button
												size="sm"
												variant="ghost"
												className="size-7 p-0 text-muted-foreground"
												onClick={() => handleCopy(emergencyPhone!, "رقم هاتف الطوارئ", "em-ph")}
											>
												{copiedKey === "em-ph" ? (
													<IconCheck className="size-3 text-emerald-600" />
												) : (
													<IconCopy className="size-3" />
												)}
											</Button>
										</div>
									)}
								</div>
							</div>
						) : (
							<div className="rounded-xl border border-dashed border-rose-200/70 p-4 text-xs text-muted-foreground bg-rose-50/20 dark:border-rose-900/30 dark:bg-rose-950/10 flex items-center justify-between">
								<span>لا توجد جهة اتصال بديلة لحالات الطوارئ مسجلة لوليّ الأمر حتى الآن</span>
								{patient.owner?.id ? (
									<Button
										asChild
										size="sm"
										variant="outline"
										className="h-7 text-xs border-rose-200 text-rose-600 hover:bg-rose-50 dark:border-rose-800"
									>
										<Link
											to="/services/owners/$ownerId"
											params={{ ownerId: patient.owner.id }}
										>
											+ إضافة لوليّ الأمر
										</Link>
									</Button>
								) : onEditPatient ? (
									<Button
										size="sm"
										variant="outline"
										className="h-7 text-xs border-rose-200 text-rose-600 hover:bg-rose-50 dark:border-rose-800"
										onClick={onEditPatient}
									>
										+ إضافة جهة طوارئ
									</Button>
								) : null}
							</div>
						)}
					</div>
				);
			})()}

			{/* ── بطاقة وثيقة التأمين الصحي ──
			<div className="rounded-2xl border border-border/80 bg-card p-4 md:p-5 shadow-2xs flex flex-col gap-3">
				<div className="flex items-center gap-2.5">
					<div className="size-8 rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400 flex items-center justify-center shrink-0">
						<IconShieldCheck className="size-4.5" />
					</div>
					<div className="flex flex-col">
						<h4 className="text-sm font-bold text-foreground">وثيقة التأمين الصحي</h4>
						<span className="text-[11px] text-muted-foreground">
							بيانات التغطية التأمينية وسقف الاستهلاك السنوي للخدمات
						</span>
					</div>
				</div>

				<PatientPolicyCard patientId={patient.id} />
			</div> */}
			
		</TabsContent>
	);
}
