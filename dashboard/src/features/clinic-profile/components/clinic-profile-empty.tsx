import { IconStethoscope } from "@tabler/icons-react";

import { useI18n } from "@/hooks/use-i18n";

export const ClinicProfileEmpty = () => {
	const { t } = useI18n();

	return (
		<div className="mx-auto mt-24 max-w-md px-6">
			<div className="flex flex-col items-center gap-4 rounded-2xl bg-card p-8 text-center shadow-sm ring-1 ring-border">
				<div className="flex size-16 items-center justify-center rounded-full bg-primary/10">
					<IconStethoscope className="size-8 text-primary" />
				</div>
				<div className="space-y-1">
					<h2 className="text-lg font-semibold">{t("clinicProfile.empty.title")}</h2>
					<p className="text-sm text-muted-foreground">
						{t("clinicProfile.empty.description")}
					</p>
				</div>
			</div>
		</div>
	);
};
