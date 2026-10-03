import { IconFlame, IconPhone, IconRoute, IconX } from "@tabler/icons-react";
import { useEffect, useState } from "react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GroomingActivity } from "@/features/care/grooming/components/grooming-activity";
import { GroomingInvoiceTab } from "@/features/care/grooming/components/grooming-invoice-tab";
import { GroomingServicesTable } from "@/features/care/grooming/components/grooming-services-table";
import { GroomingSummaryReport } from "@/features/care/grooming/components/grooming-summary-report";
import { GroomingWorkflowPanel } from "@/features/care/grooming/components/grooming-workflow-panel";
import {
	useGroomingActivity,
	useGroomingSession,
} from "@/features/care/grooming/hooks/use-grooming";
import { GroomingLane, GroomingStatus } from "@/generated/prisma/enums";
import { useI18n } from "@/hooks/use-i18n";
import {
	GROOMING_FINDING_CATEGORY_LABELS,
	GROOMING_FINDING_SEVERITY_LABELS,
	GROOMING_INCIDENT_KIND_LABELS,
	GROOMING_INCIDENT_SEVERITY_LABELS,
} from "@sanad/contracts/runtime/server/grooming/grooming.type";
import {
	GROOMING_LANE_LABELS,
	GROOMING_STATUS_LABELS,
} from "@sanad/contracts/runtime/server/grooming/grooming.workflow";

const dtFmt = new Intl.DateTimeFormat("ar", { dateStyle: "short", timeStyle: "short" });
const fmt = (v: Date | string | null) => (v ? dtFmt.format(new Date(v)) : "—");

type GroomingSheetTab = "overview" | "invoice" | "notes";

const initialsOf = (name: string) =>
	name
		.trim()
		.split(/\s+/)
		.slice(0, 2)
		.map((p) => p[0] ?? "")
		.join("");

export function GroomingSessionSheet({
	sessionId,
	initialTab,
	onClose,
}: {
	sessionId: string | null;
	/** التبويب الذي تفتح عليه الورقة — تُمرِّره أدوات البطاقة السريعة */
	initialTab?: string;
	onClose: () => void;
}) {
	const { session, isLoading } = useGroomingSession(sessionId);
	const { activity } = useGroomingActivity(sessionId);
	const { isRtl } = useI18n();
	const side = isRtl ? "left" : "right";
	const [tab, setTab] = useState<GroomingSheetTab>("overview");
	const [workflowOpen, setWorkflowOpen] = useState(false);

	// فتح الورقة على تبويب بعينه من أدوات البطاقة — يتغيّر مع كل فتح جديد.
	// نيّة «سير العمل» تفتح اللوحة الجانبية نفسها، لا تبويبًا (لم يعد لها تبويب).
	useEffect(() => {
		if (!sessionId) return;
		setTab(
			initialTab === "notes" ? "notes" : initialTab === "invoice" ? "invoice" : "overview",
		);
		setWorkflowOpen(initialTab === "workflow");
	}, [sessionId, initialTab]);

	const heatProhibited = session?.intake?.heatDryProhibitedSnapshot === true;
	const invoiceUnpaid = !!session && session.invoice?.status !== "PAID";
	const openIncidents = session ? session.incidents.filter((i) => !i.resolvedAt).length : 0;

	return (
		<Sheet
			open={!!sessionId}
			onOpenChange={(open) => !open && onClose()}
		>
			<SheetContent
				side={side}
				showCloseButton={false}
				className="max-w-2/3! w-full gap-0 p-0"
				dir="rtl"
			>
				<div className="flex items-center justify-between border-b px-4 py-2">
					<SheetTitle className="text-sm">
						{session ? `جلسة تجميل ${session.code}` : "جلسة تجميل"}
					</SheetTitle>
					<div className="flex items-center gap-2">
						{/* سير العمل لوحة جانبية ثانية (نمط لوحة الفحص في الأشعّة): الورقة الأم
						    تبقى مرئية بجوارها، فيقرأ المُجمِّل بيانات الطفل وهو ينفّذ الخطوة.
						    مكانه الترويسة لا صفّ الشارات — هناك كان يختفي خلف السعر. */}
						{session && (
							<Button
								size="sm"
								variant={workflowOpen ? "secondary" : "outline"}
								aria-pressed={workflowOpen}
								className="gap-1.5"
								onClick={() => setWorkflowOpen((v) => !v)}
							>
								<IconRoute className="size-3.5" />
								سير العمل
							</Button>
						)}
						<Button
							variant="ghost"
							size="sm"
							onClick={onClose}
						>
							<IconX className="size-4" />
						</Button>
					</div>
				</div>

				{isLoading || !session ? (
					<div className="p-8 text-center text-muted-foreground text-sm">جارٍ التحميل...</div>
				) : (
					<>
						{/* Radix يضع dir="ltr" على جذر Tabs ما لم يُمرَّر dir، فكان `justify-start`
						    على القائمة يعني اليسار لا اليمين — والتبويبات تظهر في الجهة الخطأ من
						    ورقة عربية. الجذر يأخذ rtl (فيصحّ معه أيضًا اتجاه التنقّل بالأسهم)،
						    والشبكة أدناه تُثبَّت ltr صراحةً كي يبقى العمود الجانبي في مكانه. */}
						<Tabs
							dir="rtl"
							value={tab}
							onValueChange={(v) => setTab(v as GroomingSheetTab)}
							className="flex min-h-0 flex-1 flex-col gap-0 overflow-hidden"
						>
							<div className="px-3 py-2">
								{/* justify-start يضع التبويبات في بداية السطر — أي اليمين في RTL */}
								<TabsList className="w-full justify-start">
									<TabsTrigger
										className="flex-none px-2.5 py-2"
										value="overview"
									>
										نظرة عامة
										<span className="ms-1 inline-flex h-4 min-w-4 items-center justify-center rounded bg-muted px-1 font-medium text-[10px] text-muted-foreground tabular-nums">
											{session.items.length}
										</span>
									</TabsTrigger>

									<TabsTrigger
										className="flex-none px-2.5 py-2"
										value="invoice"
									>
										الفاتورة
										{/* نقطة حمراء ما دامت غير مسدَّدة — الفاتورة بوابة الإقفال */}
										{invoiceUnpaid && (
											<span className="ms-1 size-1.5 shrink-0 rounded-full bg-red-500" />
										)}
									</TabsTrigger>

									<TabsTrigger
										className="flex-none px-2.5 py-2"
										value="notes"
									>
										الملاحظات والحوادث
										{session.findings.length + session.incidents.length > 0 && (
											<span className="ms-1 inline-flex h-4 min-w-4 items-center justify-center rounded bg-muted px-1 font-medium text-[10px] text-muted-foreground tabular-nums">
												{session.findings.length + session.incidents.length}
											</span>
										)}
									</TabsTrigger>
								</TabsList>
							</div>

							<Separator />

							{/* ltr صراحةً: ترتيب الأعمدة (جانبيّ ثم محتوى) مضبوط على هذا التدفّق،
							    وكلٌّ منهما يعلن rtl لنفسه. بلا هذا التثبيت يقلب dir الجذر الشبكةَ
							    فينتقل العمود الجانبي إلى الجهة الأخرى. */}
							<div
								className="grid min-h-0 flex-1 grid-cols-9 overflow-hidden"
								dir="ltr"
							>
								{/* العمود الجانبي — نفس بنية ورقة الأشعّة: تفاصيل، طفل، وليّ أمر، مُجمِّل */}
								<div
									className="col-span-3 flex flex-col gap-6 overflow-y-auto border-s p-4"
									dir="rtl"
								>
									<div className="flex flex-col gap-3">
										<p className="font-semibold text-sm">التفاصيل</p>
										<div className="flex flex-wrap items-center gap-1.5">
											<Badge
												variant="outline"
												className="text-[10px]"
											>
												{GROOMING_STATUS_LABELS[session.status]}
											</Badge>
											{session.lane === GroomingLane.MEDICAL && (
												<Badge
													variant="outline"
													className="border-indigo-200 bg-indigo-50 text-[10px] text-indigo-700"
												>
													{GROOMING_LANE_LABELS[session.lane]}
												</Badge>
											)}
											{heatProhibited && (
												<Badge
													variant="destructive"
													className="gap-1 text-[10px]"
												>
													<IconFlame className="size-3" />
													ممنوع التجفيف الحارّ
												</Badge>
											)}
											{openIncidents > 0 && (
												<Badge
													variant="outline"
													className="border-rose-200 bg-rose-50 text-[10px] text-rose-700"
												>
													{openIncidents} حادثة مفتوحة
												</Badge>
											)}
										</div>

										<div className="flex flex-col gap-1.5">
											<SideFact
												label="الموعد"
												value={fmt(session.scheduledAt)}
											/>
											<SideFact
												label="الوقت الموعود"
												value={fmt(session.promisedReadyAt)}
											/>
											<SideFact
												label="المدّة المقدَّرة"
												value={`${session.estimatedDurationMin} دقيقة`}
											/>
											<SideFact
												label="المحطة"
												value={session.station?.name ?? "—"}
											/>
											<SideFact
												label="التسعيرة"
												value={`${Number(session.quoteTotal)} ر.س`}
											/>
										</div>
									</div>

									<ContactBlock
										title="الطفل"
										name={session.patient.name}
										meta={[
											session.patient.animalType?.arName,
											session.patient.animalStrain?.arName,
										]
											.filter(Boolean)
											.join(" · ")}
										avatarClassName="bg-primary"
									/>

									<ContactBlock
										title="وليّ الأمر"
										name={session.owner?.name ?? "—"}
										meta={session.owner?.phone ?? null}
										avatarClassName="bg-primary"
										isPhone
									/>

									<ContactBlock
										title="المُجمِّل"
										name={session.groomer?.user?.name ?? "—"}
										meta={null}
										avatarClassName="bg-blue-600"
									/>
								</div>

								{/* Radix يضع dir="ltr" على جذر Tabs، فنُعيد الاتجاه هنا — على المحتوى
								    وحده لا على الشبكة، حتى يبقى العمود الجانبي في مكانه */}
								<div
									className="col-span-6 flex flex-col overflow-y-auto"
									dir="rtl"
								>
									{tab === "invoice" && <GroomingInvoiceTab session={session} />}

									{tab === "overview" && (
										<div className="flex flex-col gap-6 p-4">
											{/* الجلسة المكتملة تعرض تقريرها لا نموذج عمل انتهى */}
											{session.status === GroomingStatus.COMPLETED ? (
												<GroomingSummaryReport session={session} />
											) : (
												<GroomingServicesTable session={session} />
											)}
											<GroomingActivity activity={activity} />
										</div>
									)}

									{tab === "notes" && (
										<div className="flex flex-col gap-6 p-4">
											<div>
												<p className="mb-2 font-semibold text-base">الملاحظات السريرية</p>
												{session.findings.length === 0 ? (
													<p className="text-muted-foreground text-xs">لا ملاحظات</p>
												) : (
													session.findings.map((f) => (
														<div
															key={f.id}
															className="border-b py-2 text-sm last:border-0"
														>
															<div className="flex items-center gap-2">
																<Badge variant="outline">
																	{GROOMING_FINDING_CATEGORY_LABELS[f.category]}
																</Badge>
																<Badge
																	variant={
																		f.severity === "URGENT" ? "destructive" : "secondary"
																	}
																>
																	{GROOMING_FINDING_SEVERITY_LABELS[f.severity]}
																</Badge>
															</div>
															<p className="mt-1">{f.note}</p>
														</div>
													))
												)}
											</div>

											<div>
												<p className="mb-2 font-semibold text-base">الحوادث</p>
												{session.incidents.length === 0 ? (
													<p className="text-muted-foreground text-xs">لا حوادث</p>
												) : (
													session.incidents.map((i) => (
														<div
															key={i.id}
															className="border-b py-2 text-sm last:border-0"
														>
															<div className="flex items-center gap-2">
																<Badge variant="destructive">
																	{GROOMING_INCIDENT_KIND_LABELS[i.kind]}
																</Badge>
																<Badge variant="secondary">
																	{GROOMING_INCIDENT_SEVERITY_LABELS[i.severity]}
																</Badge>
																<Badge variant="outline">
																	{i.resolvedAt ? "مغلقة" : "مفتوحة"}
																</Badge>
															</div>
															<p className="mt-1">{i.description}</p>
														</div>
													))
												)}
											</div>
										</div>
									)}
								</div>
							</div>
						</Tabs>

						<GroomingWorkflowPanel
							session={session}
							open={workflowOpen}
							onClose={() => setWorkflowOpen(false)}
						/>
					</>
				)}
			</SheetContent>
		</Sheet>
	);
}

function SideFact({ label, value }: { label: string; value: string }) {
	return (
		<div className="flex items-center justify-between gap-2 text-xs">
			<span className="text-muted-foreground">{label}</span>
			<span className="font-medium tabular-nums">{value}</span>
		</div>
	);
}

function ContactBlock({
	title,
	name,
	meta,
	avatarClassName,
	isPhone = false,
}: {
	title: string;
	name: string;
	meta: string | null;
	avatarClassName: string;
	isPhone?: boolean;
}) {
	return (
		<div className="flex flex-col gap-2">
			<p className="font-semibold text-sm">{title}</p>
			<div className="flex items-center gap-2">
				<Avatar size="sm">
					<AvatarFallback
						className={`${avatarClassName} font-semibold text-[10px] text-white`}
					>
						{initialsOf(name)}
					</AvatarFallback>
				</Avatar>
				<div className="flex min-w-0 flex-col">
					<span className="truncate font-medium text-xs">{name}</span>
					{meta && (
						<span className="flex items-center gap-1 truncate text-[11px] text-muted-foreground">
							{isPhone && <IconPhone className="size-3" />}
							<span dir={isPhone ? "ltr" : undefined}>{meta}</span>
						</span>
					)}
				</div>
			</div>
		</div>
	);
}
