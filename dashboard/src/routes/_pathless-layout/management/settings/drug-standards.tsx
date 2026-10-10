import { IconExternalLink, IconInfoCircle, IconListDetails } from "@tabler/icons-react";
import { createFileRoute, Link } from "@tanstack/react-router";

import { Container, ContainerRow } from "@/components/common/container";
import { Spinner } from "@/components/common/spinner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { SettingsPageWrapper } from "@/features/settings/components/settings-page-wrapper";
import { useDrugStandards } from "@/features/settings/drug-standards/hooks/use-drug-standards";
import { useToggleDrugStandard } from "@/features/settings/drug-standards/hooks/use-toggle-drug-standard";
import { formatDataVersion } from "@/features/settings/drug-standards/utils/format-data-version";
import { useI18n } from "@/hooks/use-i18n";

export const Route = createFileRoute("/_pathless-layout/management/settings/drug-standards")({
	component: RouteComponent,
});

function RouteComponent() {
	const { t, lang } = useI18n();
	const { standards, isLoading } = useDrugStandards();
	const { toggleStandard, isPending } = useToggleDrugStandard();

	const isAr = lang === "ar";

	return (
		<SettingsPageWrapper>
			<Container
				title={t("settings.drugStandards.title")}
				description={t("settings.drugStandards.description")}
			>
				{isLoading ? (
					<div className="justify-center! py-6">
						<Spinner />
					</div>
				) : standards.length === 0 ? (
					<p className="justify-center! py-6 text-muted-foreground text-xs">
						{t("settings.drugStandards.empty")}
					</p>
				) : (
					standards.map((standard) => (
						<ContainerRow
							key={standard.id}
							title={isAr ? standard.nameAr : standard.nameEn}
							badge={
								<>
									<Badge variant="secondary">{standard.countryCode}</Badge>
									{/* the country default is a suggestion until someone actually chooses */}
									{!standard.isExplicit && standard.enabled && (
										<Badge variant="outline">{t("settings.drugStandards.suggested")}</Badge>
									)}
								</>
							}
							foregroundTitle={isAr ? standard.authorityAr : standard.authorityEn}
							subtitle={t("settings.drugStandards.meta", {
								count: standard.productCount,
								version: formatDataVersion(standard.dataVersion),
							})}
							action={
								<div className="flex items-center gap-2">
									<Button
										asChild
										variant="outline"
										size="sm"
									>
										{/* التصفّح متاح حتى قبل التفعيل — الغرض معاينة المحتوى ثم القرار */}
										<Link
											to="/management/settings/drug-standards/$standardId"
											params={{ standardId: standard.id }}
										>
											<IconListDetails className="size-4" />
											{t("settings.drugStandards.viewProducts")}
										</Link>
									</Button>
									<Switch
										checked={standard.enabled}
										disabled={isPending}
										onCheckedChange={(checked) => toggleStandard(standard.id, checked)}
										aria-label={isAr ? standard.nameAr : standard.nameEn}
									/>
								</div>
							}
						/>
					))
				)}
			</Container>

			{/* Each catalog states its own limits verbatim, straight from the data pack.
			    A registry is not a formulary and the vet reading it has to know that. */}
			{standards.map((standard) => {
				const note = isAr ? standard.coverageNoteAr : standard.coverageNoteEn;
				if (!note) return null;

				return (
					<div
						key={`note-${standard.id}`}
						className="flex flex-col gap-2 rounded-[4px] border border-border bg-muted/40 px-4 py-3"
					>
						<div className="flex items-center gap-2">
							<IconInfoCircle className="size-4 shrink-0 text-muted-foreground" />
							<p className="font-bold text-xs">
								{t("settings.drugStandards.coverageTitle", {
									name: isAr ? standard.nameAr : standard.nameEn,
								})}
							</p>
						</div>
						<p className="text-muted-foreground text-xs leading-relaxed">{note}</p>
						<a
							href={standard.sourceUrl}
							target="_blank"
							rel="noopener noreferrer"
							className="flex items-center gap-1 text-primary text-xs hover:underline"
						>
							<IconExternalLink className="size-3.5" />
							{t("settings.drugStandards.viewSource")}
						</a>
					</div>
				);
			})}
		</SettingsPageWrapper>
	);
}
