import { createFileRoute } from "@tanstack/react-router";
import { Container, ContainerRow } from "@/components/common/container";
import { Spinner } from "@/components/common/spinner";
import { Switch } from "@/components/ui/switch";
import { SettingsPageWrapper } from "@/features/settings/components/settings-page-wrapper";
import { PROTOCOLS } from "@/features/settings/protocols/data/protocols";
import { useProtocols } from "@/features/settings/protocols/hooks/use-protocols";
import { useUpdateProtocols } from "@/features/settings/protocols/hooks/use-update-protocols";

export const Route = createFileRoute(
	"/_pathless-layout/management/settings/medical-protocols",
)({
	component: RouteComponent,
});

function RouteComponent() {
	const { protocols, isLoading } = useProtocols();
	const { updateProtocols, isPending } = useUpdateProtocols();

	if (isLoading) {
		return (
			<SettingsPageWrapper>
				<Spinner />
			</SettingsPageWrapper>
		);
	}

	return (
		<SettingsPageWrapper>
			<Container
				title="البروتوكولات الطبية"
				description="تخصيص البروتوكولات الطبية للأكاديمية."
			>
				{PROTOCOLS.map((protocol) => (
					<ContainerRow
						key={protocol.key}
						title={protocol.label}
						subtitle={protocol.description}
						action={
							<Switch
								checked={protocols?.[protocol.key] ?? false}
								disabled={isPending}
								onCheckedChange={(checked) => updateProtocols({ [protocol.key]: checked })}
							/>
						}
					/>
				))}
			</Container>
		</SettingsPageWrapper>
	);
}
