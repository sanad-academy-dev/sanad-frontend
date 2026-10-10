import { IconHistory, IconRefresh } from "@tabler/icons-react";
import { useEffect, useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { TabsContent } from "@/components/ui/tabs";
import { AppointmentSheet } from "@/features/appointments/components/appointment-sheet";
import type { AppointmentCardData } from "@/features/appointments/types/appointment.types";
import { mapDashboardAppointmentToCard } from "@/features/appointments/utils/map-appointment-card";
import { LabTestSheet } from "@/features/services/lab-tests/components/lab-test-sheet";
import { PatientHistoryPreviewDialog } from "@/features/services/patients/components/history/patient-history-preview-dialog";
import { PatientHistoryRangeFilter } from "@/features/services/patients/components/history/patient-history-range-filter";
import { PatientHistoryRow } from "@/features/services/patients/components/history/patient-history-row";
import { usePatientHistory } from "@/features/services/patients/hooks/use-patient-history";
import type { PatientTabProps } from "@/features/services/patients/types/tabs.types";
import {
	ALL_TIME_RANGE,
	filterHistoryByRange,
	groupHistoryByDay,
	HISTORY_KIND_META,
	historyDayLabel,
	type PatientHistoryRange,
} from "@/features/services/patients/utils/patient-history";
import { RadiologyOrderSheet } from "@/features/services/radiology/components/radiology-order-sheet";
import { useSelectedRadiologyOrderStore } from "@/features/services/radiology/stores/selected-radiology-order.store";
import { cn } from "@/lib/utils";
import {
	PATIENT_HISTORY_KINDS,
	type PatientHistoryEntry,
	type PatientHistoryKind,
} from "@sanad/contracts/runtime/server/patients/patients.type";

interface HistoryTabProps extends PatientTabProps {
	/**
	 * القياسات والخطط لا لوحة مستقلة لها — «فتح السجل» فيهما ينقل إلى تبويبهما
	 * في الملف نفسه بدل أن يكون زرًّا معطّلًا.
	 */
	onNavigateTab: (tab: string) => void;
}

function HistoryTabSkeleton() {
	return (
		<div className="flex flex-col gap-4 p-4">
			<Skeleton className="h-8 w-full" />
			{[0, 1, 2].map((group) => (
				<div
					key={group}
					className="flex gap-3"
				>
					<Skeleton className="h-5 w-20 shrink-0" />
					<div className="flex flex-1 flex-col gap-2">
						<Skeleton className="h-14 w-full" />
						<Skeleton className="h-14 w-full" />
					</div>
				</div>
			))}
		</div>
	);
}

export function HistoryTab({ patientId, onNavigateTab }: HistoryTabProps) {
	const { history, isLoading, error, refetch } = usePatientHistory(patientId);

	// فلتر فارغ = الكل. الاحتفاظ به مجموعةً يجعل التبديل تراكميًا بلا حالة «الكل»
	// منفصلة تحتاج مزامنة.
	const [activeKinds, setActiveKinds] = useState<Set<PatientHistoryKind>>(new Set());
	const [range, setRange] = useState<PatientHistoryRange>(ALL_TIME_RANGE);
	const [previewEntry, setPreviewEntry] = useState<PatientHistoryEntry | null>(null);
	const [visitCard, setVisitCard] = useState<AppointmentCardData | null>(null);
	const [labOrderId, setLabOrderId] = useState<string | null>(null);
	const selectRadiologyOrder = useSelectedRadiologyOrderStore((s) => s.select);
	const closeRadiologyOrder = useSelectedRadiologyOrderStore((s) => s.close);

	// اختيار الأشعة يعيش في متجر عام؛ إغلاق ملف الطفل ولوحة الأشعة مفتوحة يترك
	// المعرّف فيه فتنفتح اللوحة وحدها عند فتح الملف تاليًا — نمسحه عند التفكيك.
	useEffect(() => closeRadiologyOrder, [closeRadiologyOrder]);

	// النطاق يُطبَّق قبل النوع: عدّادات الشرائح تصف ما بداخل الفترة المختارة، لا
	// السجل كلّه — وإلا وعدت شريحة بـ«3 تحاليل» ثم أظهرت صفرًا بعد الضغط عليها.
	const inRange = useMemo(() => filterHistoryByRange(history, range), [history, range]);

	const counts = useMemo(() => {
		const map = new Map<PatientHistoryKind, number>();
		for (const entry of inRange) map.set(entry.kind, (map.get(entry.kind) ?? 0) + 1);
		return map;
	}, [inRange]);

	const days = useMemo(() => {
		const filtered =
			activeKinds.size === 0 ? inRange : inRange.filter((e) => activeKinds.has(e.kind));
		return groupHistoryByDay(filtered);
	}, [inRange, activeKinds]);

	const toggleKind = (kind: PatientHistoryKind) =>
		setActiveKinds((current) => {
			const next = new Set(current);
			if (next.has(kind)) next.delete(kind);
			else next.add(kind);
			return next;
		});

	function openRecord(entry: PatientHistoryEntry) {
		setPreviewEntry(null);
		switch (entry.kind) {
			case "VISIT":
				setVisitCard(mapDashboardAppointmentToCard(entry.record));
				return;
			case "LAB":
				setLabOrderId(entry.id);
				return;
			case "RADIOLOGY":
				selectRadiologyOrder(entry.id);
				return;
			case "VITALS":
				onNavigateTab("vital-signs");
				return;
			case "CARE_PLAN":
				onNavigateTab("subscriptions");
				return;
		}
	}

	if (!patientId || isLoading) {
		return (
			<TabsContent
				value="history"
				className="m-0"
				dir="rtl"
			>
				<HistoryTabSkeleton />
			</TabsContent>
		);
	}

	return (
		<>
			<TabsContent
				value="history"
				className="m-0 flex flex-col gap-4 p-4"
				dir="rtl"
			>
				{error ? (
					<div className="flex flex-col items-center gap-3 rounded-[4px] border border-dashed py-10">
						<p className="text-sm text-muted-foreground">تعذّر جلب سجل الطفل</p>
						<Button
							size="sm"
							variant="outline"
							onClick={() => refetch()}
						>
							<IconRefresh className="size-4" />
							إعادة المحاولة
						</Button>
					</div>
				) : history.length === 0 ? (
					<div className="flex flex-col items-center gap-2 rounded-[4px] border border-dashed py-10">
						<IconHistory className="size-6 text-muted-foreground" />
						<p className="text-sm text-muted-foreground">لا توجد سجلات لهذا الطفل بعد</p>
					</div>
				) : (
					<>
						{/* الفلاتر — النوع الذي لا سجل له يظهر معطّلًا فيبقى العدّ مقروءًا */}
						<div className="flex flex-wrap items-center gap-1.5">
							<Button
								size="xs"
								variant={activeKinds.size === 0 ? "default" : "outline"}
								onClick={() => setActiveKinds(new Set())}
							>
								الكل
								<span className="tabular-nums">{inRange.length}</span>
							</Button>

							{PATIENT_HISTORY_KINDS.map((kind) => {
								const count = counts.get(kind) ?? 0;
								const active = activeKinds.has(kind);
								const meta = HISTORY_KIND_META[kind];
								const Icon = meta.icon;
								return (
									<Button
										key={kind}
										size="xs"
										variant={active ? "default" : "outline"}
										// الشريحة المفعّلة تبقى قابلة للنقر ولو أفرغها النطاق،
										// وإلا عَلِق الفلتر بلا وسيلة لإلغائه
										disabled={count === 0 && !active}
										onClick={() => toggleKind(kind)}
									>
										<Icon className="size-3.5" />
										{meta.label}
										<span className="tabular-nums">{count}</span>
									</Button>
								);
							})}

							{/* في RTL يدفعها ms-auto إلى أقصى اليسار، بعيدًا عن شرائح النوع */}
							<div className="ms-auto">
								<PatientHistoryRangeFilter
									value={range}
									onChange={setRange}
									matchCount={inRange.length}
								/>
							</div>
						</div>

						{days.length === 0 ? (
							<div className="flex flex-col items-center gap-3 rounded-[4px] border border-dashed py-10">
								<p className="text-sm text-muted-foreground">لا سجلات مطابقة للفلتر</p>
								<Button
									size="sm"
									variant="outline"
									onClick={() => {
										setActiveKinds(new Set());
										setRange(ALL_TIME_RANGE);
									}}
								>
									مسح الفلاتر
								</Button>
							</div>
						) : (
							<div className="flex flex-col">
								{days.map((day, index) => (
									<div
										key={day.key}
										className="flex gap-3"
									>
										{/* عمود التاريخ — يلتصق بأعلى القائمة أثناء تمرير يومه الطويل */}
										<div className="sticky top-0 h-fit w-24 shrink-0 pt-2.5 text-end">
											<p className="text-sm font-semibold leading-tight">
												{historyDayLabel(day.date)}
											</p>

											<p className="text-[11px] text-muted-foreground">
												{day.entries.length} سجل
											</p>
										</div>

										{/* الخط الرأسي يمتدّ على طول اليوم؛ آخر يوم لا ذيل له */}
										<div
											className={cn(
												"flex flex-1 flex-col gap-2 border-s ps-4",
												index === days.length - 1 ? "pb-2" : "pb-5",
											)}
										>
											{day.entries.map((entry) => (
												<PatientHistoryRow
													key={`${entry.kind}-${entry.id}`}
													entry={entry}
													onPreview={() => setPreviewEntry(entry)}
													onOpenRecord={() => openRecord(entry)}
												/>
											))}
										</div>
									</div>
								))}
							</div>
						)}
					</>
				)}
			</TabsContent>

			{/*
			  الطبقات العائمة خارج TabsContent عمدًا: Radix يفكّ تركيب محتوى
			  التبويب غير النشط، فلو كانت بداخله لاختفت اللوحة المفتوحة بمجرّد
			  تبديل التبويب.
			*/}
			<PatientHistoryPreviewDialog
				entry={previewEntry}
				onOpenChange={(open) => !open && setPreviewEntry(null)}
				onOpenRecord={openRecord}
			/>

			<AppointmentSheet
				card={visitCard}
				open={!!visitCard}
				onClose={() => setVisitCard(null)}
			/>

			<LabTestSheet
				labTestId={labOrderId}
				open={!!labOrderId}
				onClose={() => setLabOrderId(null)}
			/>

			{/* لوحة الأشعة تقرأ متجرها بنفسها — تُركَّب هنا ويفتحها select أعلاه */}
			<RadiologyOrderSheet />
		</>
	);
}
