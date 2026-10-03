import { useMemo } from "react";

import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { ACUITY_META } from "@/features/care/inpatients/data/inpatients-data";
import { useI18n } from "@/hooks/use-i18n";
import { cn } from "@/lib/utils";

/**
 * [IP1] خريطة العنبر — الأقفاص كما هي موزّعة على القاعات.
 *
 * لماذا SVG لا شبكةُ عناصر: هذه خريطة لا قائمة. الطاقم يقرأ العنبر بالمكان
 * («القفص الثالث في قاعة ٢») لا بالاسم، والرسم المتّجه يعطي هندسةً دقيقة تتكيّف
 * مع أي عرض شاشة بطبقة رسم واحدة، ويحمل الحالة في الشكل واللون معًا: القفص
 * الفارغ محدَّد بخطّ متقطّع، والمشغول ممتلئ بلون درجة الحرجية، وقاعة العزل
 * مؤطَّرة بنمط مائل يميّزها قبل قراءة اسمها.
 *
 * الاتجاه: SVG لا يرث `dir`، فالإحداثيات تُحسب من اليمين حين تكون الواجهة عربية
 * وإلا من اليسار — بلا `scaleX(-1)` الذي كان سيقلب النصّ داخل الأشكال أيضًا.
 */

export type WardCage = {
	id: string;
	name: string;
	roomId: string;
	room: { id: string; name: string; type: string };
	occupiedBy: {
		stayId: string;
		code: string;
		patientId: string;
		patientName: string;
		assignedAt: string | Date;
	} | null;
};

type WardMapProps = {
	cages: WardCage[];
	/** درجة الحرجية لكل إقامة — تُلوَّن بها الأقفاص المشغولة */
	acuityByStayId?: Record<string, keyof typeof ACUITY_META>;
	onSelectStay?: (stayId: string) => void;
	onSelectCage?: (cageId: string) => void;
	className?: string;
};

// هندسة الرسم — بوحدات مستخدم، والمقياس يتكفّل به viewBox
const CELL = 62;
const GAP = 10;
const ROW_LABEL = 118;
const ROW_HEIGHT = CELL + 26;
const PAD = 12;

export function WardMap({
	cages,
	acuityByStayId = {},
	onSelectStay,
	onSelectCage,
	className,
}: WardMapProps) {
	const { isRtl } = useI18n();

	const rooms = useMemo(() => {
		const byRoom = new Map<string, { name: string; type: string; cages: WardCage[] }>();
		for (const cage of cages) {
			const entry = byRoom.get(cage.roomId) ?? {
				name: cage.room.name,
				type: cage.room.type,
				cages: [],
			};
			entry.cages.push(cage);
			byRoom.set(cage.roomId, entry);
		}
		return [...byRoom.entries()].map(([id, r]) => ({
			id,
			...r,
			cages: [...r.cages].sort((a, b) => a.name.localeCompare(b.name, "ar")),
		}));
	}, [cages]);

	const maxCages = Math.max(1, ...rooms.map((r) => r.cages.length));
	const width = ROW_LABEL + maxCages * (CELL + GAP) + PAD * 2;
	const height = PAD * 2 + rooms.length * ROW_HEIGHT;

	// الإحداثي الأفقي للعمود — من اليمين في الواجهة العربية
	const colX = (index: number) =>
		isRtl
			? width - PAD - ROW_LABEL - (index + 1) * (CELL + GAP) + GAP
			: PAD + ROW_LABEL + index * (CELL + GAP);

	const labelX = isRtl ? width - PAD : PAD;

	if (rooms.length === 0) {
		return (
			<div
				className={cn(
					"flex h-40 items-center justify-center rounded border border-dashed text-sm text-muted-foreground",
					className,
				)}
			>
				لا أقفاص مُعرَّفة بعد — أضِفها من إعدادات الفرع لتظهر خريطة العنبر
			</div>
		);
	}

	return (
		<div className={cn("w-full overflow-x-auto", className)}>
			<svg
				viewBox={`0 0 ${width} ${height}`}
				width="100%"
				style={{ minWidth: Math.min(width, 720), maxHeight: height * 1.6 }}
				role="img"
				aria-label="خريطة إشغال العنبر"
			>
				<title>خريطة إشغال العنبر</title>
				<defs>
					{/* نمط قاعة العزل — يميّزها قبل قراءة اسمها */}
					<pattern
						id="isolation-hatch"
						width="8"
						height="8"
						patternUnits="userSpaceOnUse"
						patternTransform="rotate(45)"
					>
						<line
							x1="0"
							y1="0"
							x2="0"
							y2="8"
							stroke="currentColor"
							strokeWidth="2"
							className="text-amber-500/25"
						/>
					</pattern>
				</defs>

				{rooms.map((room, rowIndex) => {
					const y = PAD + rowIndex * ROW_HEIGHT;
					const isIsolation = room.type === "ISOLATION";
					const rowWidth = maxCages * (CELL + GAP);
					const rowX = isRtl ? width - PAD - ROW_LABEL - rowWidth : PAD + ROW_LABEL;

					return (
						<g key={room.id}>
							{/* خلفية الصفّ — تُميّز القاعة كوحدة مكانية */}
							<rect
								x={rowX}
								y={y}
								width={rowWidth}
								height={CELL + 12}
								rx={6}
								className={cn("fill-muted/40", isIsolation && "stroke-amber-500/40")}
								strokeWidth={isIsolation ? 1.5 : 0}
								strokeDasharray={isIsolation ? "6 4" : undefined}
							/>
							{isIsolation && (
								<rect
									x={rowX}
									y={y}
									width={rowWidth}
									height={CELL + 12}
									rx={6}
									fill="url(#isolation-hatch)"
								/>
							)}

							<text
								x={labelX}
								y={y + CELL / 2 + 2}
								textAnchor={isRtl ? "end" : "start"}
								className="fill-foreground text-[13px] font-medium"
							>
								{room.name}
							</text>
							<text
								x={labelX}
								y={y + CELL / 2 + 18}
								textAnchor={isRtl ? "end" : "start"}
								className="fill-muted-foreground text-[11px]"
							>
								{roomTypeLabel(room.type)} · {room.cages.filter((c) => c.occupiedBy).length}/
								{room.cages.length}
							</text>

							{room.cages.map((cage, colIndex) => {
								const x = colX(colIndex);
								const occupied = cage.occupiedBy;
								const acuity = occupied ? (acuityByStayId[occupied.stayId] ?? "MEDIUM") : null;

								return (
									<Tooltip key={cage.id}>
										<TooltipTrigger asChild>
											{/* عنصر <button> لا يكون ابنًا لـ<svg> إلا داخل foreignObject، وهو ما
											    يكسر التخطيط المتّجه — فالمجموعة تحمل الدور واللسان ومعالج المفاتيح. */}
											{/* biome-ignore lint/a11y/useSemanticElements: التفاعلية داخل SVG بالدور */}
											<g
												transform={`translate(${x}, ${y + 6})`}
												className="cursor-pointer outline-none"
												tabIndex={0}
												role="button"
												aria-label={
													occupied
														? `${cage.name} — ${occupied.patientName}`
														: `${cage.name} — فارغ`
												}
												onClick={() => {
													if (occupied && onSelectStay) onSelectStay(occupied.stayId);
													else onSelectCage?.(cage.id);
												}}
												onKeyDown={(e) => {
													if (e.key !== "Enter" && e.key !== " ") return;
													e.preventDefault();
													if (occupied && onSelectStay) onSelectStay(occupied.stayId);
													else onSelectCage?.(cage.id);
												}}
											>
												<rect
													width={CELL}
													height={CELL}
													rx={4}
													className={cn(
														"transition-colors",
														occupied
															? "fill-card stroke-border"
															: "fill-transparent stroke-border/60",
													)}
													strokeWidth={1}
													strokeDasharray={occupied ? undefined : "4 3"}
												/>
												{/* شريط الحرجية — الشدّة تُقرأ بالشكل قبل النصّ */}
												{occupied && acuity && (
													<rect
														width={CELL}
														height={4}
														rx={2}
														className={cn(ACUITY_META[acuity].bar, "opacity-90")}
														fill="currentColor"
													/>
												)}
												<text
													x={CELL / 2}
													y={occupied ? 24 : CELL / 2 + 4}
													textAnchor="middle"
													className="fill-muted-foreground text-[10px]"
												>
													{cage.name}
												</text>
												{occupied && (
													<text
														x={CELL / 2}
														y={40}
														textAnchor="middle"
														className="fill-foreground text-[11px] font-medium"
													>
														{truncate(occupied.patientName, 9)}
													</text>
												)}
												{occupied && (
													<text
														x={CELL / 2}
														y={53}
														textAnchor="middle"
														className="fill-muted-foreground text-[9px]"
													>
														{occupied.code}
													</text>
												)}
											</g>
										</TooltipTrigger>
										<TooltipContent dir="rtl">
											{occupied ? (
												<div className="space-y-0.5 text-xs">
													<div className="font-medium">{occupied.patientName}</div>
													<div className="text-muted-foreground">
														{occupied.code} · {cage.name} · {room.name}
													</div>
													{acuity && (
														<div className="text-muted-foreground">
															الحالة: {ACUITY_META[acuity].label}
														</div>
													)}
												</div>
											) : (
												<div className="text-xs">
													{cage.name} — فارغ
													<div className="text-muted-foreground">{room.name}</div>
												</div>
											)}
										</TooltipContent>
									</Tooltip>
								);
							})}
						</g>
					);
				})}
			</svg>
		</div>
	);
}

const roomTypeLabel = (type: string) =>
	type === "ISOLATION"
		? "عزل"
		: type === "ICU"
			? "عناية مركّزة"
			: type === "WARD"
				? "عنبر"
				: type;

const truncate = (value: string, max: number) =>
	value.length > max ? `${value.slice(0, max - 1)}…` : value;
