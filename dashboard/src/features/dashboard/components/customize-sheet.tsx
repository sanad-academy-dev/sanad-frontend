import { IconEye, IconEyeOff, IconGripVertical } from "@tabler/icons-react";
import type { DragEvent } from "react";
import { BiSolidWidget } from "react-icons/bi";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet";
import { getCardLabels } from "@/features/dashboard/data/card-labels";
import { presetOptions } from "@/features/dashboard/data/customize-sheet";
import { useDashboardPreferences } from "@/features/dashboard/stores/dashboard.store";
import { hexToHue } from "@/features/dashboard/utils/customize-sheet";
import { useI18n } from "@/hooks/use-i18n";

export function CustomizeSheet() {
	const { isRtl, t } = useI18n();
	const { cards, chartHue, setChartHue, toggleCardHidden, reorderCards } =
		useDashboardPreferences();
	const sortedCards = [...cards].sort((a, b) => a.order - b.order);
	const cardLabels = getCardLabels(t);

	const onPresetSelect = (presetColor: string) => {
		setChartHue(hexToHue(presetColor));
	};

	const handleDragStart = (event: DragEvent<HTMLLIElement>, order: number) => {
		event.dataTransfer.setData("text/plain", String(order));
	};

	const handleDrop = (event: DragEvent<HTMLLIElement>, toOrder: number) => {
		event.preventDefault();
		const fromOrder = Number(event.dataTransfer.getData("text/plain"));

		if (fromOrder !== toOrder) {
			reorderCards(fromOrder, toOrder);
		}
	};

	const handleDragOver = (event: DragEvent<HTMLLIElement>) => {
		event.preventDefault();
	};

	return (
		<Sheet>
			<SheetTrigger asChild>
				<Button
					variant="outline"
					className="gap-1.5"
				>
					<BiSolidWidget className="size-4" />
					{t("dashboard.customize.trigger")}
				</Button>
			</SheetTrigger>
			<SheetContent
				side={isRtl ? "left" : "right"}
				className="w-full sm:max-w-xl! p-0"
			>
				<SheetHeader className="p-0">
					<SheetTitle className="border-b px-4 py-2">
						{t("dashboard.customize.title")}
					</SheetTitle>
					<SheetDescription className="sr-only">
						{t("dashboard.customize.description")}
					</SheetDescription>
				</SheetHeader>

				<div className="p-4 space-y-4">
					<div className="bg-primary/10 rounded-md p-2 text-primary text-sm border border-primary/10">
						{t("dashboard.customize.notice")}
					</div>

					<div className="flex flex-col gap-2">
						<p className="font-medium text-sm">{t("dashboard.customize.colorTheme")}</p>
						<div className="flex flex-wrap gap-2">
							{presetOptions.map(({ color, hue }) => {
								const isActive = Math.round(chartHue) === Math.round(hue);

								return (
									<button
										key={color}
										type="button"
										className={`size-8 rounded-full border-2 transition-colors focus:border-ring focus:outline-none ${
											isActive ? "border-foreground" : "border-transparent hover:border-border"
										}`}
										style={{ backgroundColor: color }}
										onClick={() => onPresetSelect(color)}
										aria-label={t("dashboard.customize.selectColor", { color })}
										aria-pressed={isActive}
									/>
								);
							})}
						</div>
					</div>

					<div className="flex flex-col gap-3">
						<div className="space-y-1">
							<p className="font-medium text-sm">{t("dashboard.customize.widgetOrder")}</p>
							<p className="text-muted-foreground text-xs">
								{t("dashboard.customize.dragToReorder")}
							</p>
						</div>

						<ul className="space-y-2">
							{sortedCards.map((card) => (
								<li
									key={card.id}
									className={`flex items-center justify-between gap-3 rounded-xl border px-3 py-2.5 transition-colors ${
										card.hidden
											? "border-dashed border-border/60 bg-muted/30 text-muted-foreground"
											: "border-border/70 bg-card/70 hover:bg-accent/30"
									}`}
									draggable
									onDragStart={(event) => handleDragStart(event, card.order)}
									onDrop={(event) => handleDrop(event, card.order)}
									onDragOver={handleDragOver}
								>
									<div className="flex items-center gap-2 min-w-0">
										<IconGripVertical
											className="size-4 shrink-0 text-muted-foreground cursor-grab"
											stroke={1.5}
										/>
										<span className="truncate text-sm font-medium">{cardLabels[card.id]}</span>
										<Badge
											variant="outline"
											className={`shrink-0 rounded-full text-[11px] ${
												card.hidden
													? "border-transparent bg-muted text-muted-foreground"
													: "border-border/70 bg-background/80 text-muted-foreground"
											}`}
										>
											{card.hidden
												? t("dashboard.customize.state.hidden")
												: card.expanded
													? t("dashboard.customize.state.expanded")
													: t("dashboard.customize.state.compact")}
										</Badge>
									</div>

									<Button
										type="button"
										variant="ghost"
										size="icon-sm"
										className="shrink-0 text-muted-foreground hover:text-foreground"
										onClick={() => toggleCardHidden(card.id)}
										aria-label={
											card.hidden
												? t("dashboard.customize.showCard")
												: t("dashboard.customize.hideCard")
										}
										aria-pressed={!card.hidden}
									>
										{card.hidden ? (
											<IconEyeOff
												className="size-4"
												stroke={1.5}
											/>
										) : (
											<IconEye
												className="size-4"
												stroke={1.5}
											/>
										)}
									</Button>
								</li>
							))}
						</ul>
					</div>
				</div>
			</SheetContent>
		</Sheet>
	);
}
