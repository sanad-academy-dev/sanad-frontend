import { createFileRoute } from "@tanstack/react-router";
import { Spinner } from "@/components/common/spinner";
import { OnlineAppointmentsSection } from "@/features/booking/components/online-appointments-section";
import { ClinicProfileHeader } from "@/features/clinic-profile/components/clinic-profile-header";
import { useClinicProfile } from "@/features/clinic-profile/hooks/use-clinic-profile";
import { bookingSearchSchema } from "@sanad/contracts/runtime/server/public-bookings/public-bookings.type";

export const Route = createFileRoute("/book/$slug")({
	component: BookPage,
	ssr: false,
	validateSearch: (search) => {
		const parsed = bookingSearchSchema.safeParse(search);
		return parsed.success ? parsed.data : {};
	},
});

function BookPage() {
	const { slug } = Route.useParams();
	const { clinic, status } = useClinicProfile(slug);

	if (status === "loading") {
		return (
			<main className="flex min-h-svh items-center justify-center bg-background">
				<Spinner />
			</main>
		);
	}

	if (status === "not-found" || !clinic) {
		return (
			<main className="flex min-h-svh items-center justify-center bg-background">
				<p className="text-sm text-muted-foreground">الأكاديمية غير موجودة</p>
			</main>
		);
	}

	return (
		<main className="min-h-svh bg-[#F9FAFB] space-y-4">
			<ClinicProfileHeader clinic={clinic} />
			<OnlineAppointmentsSection clinicSlug={slug} />
		</main>
	);
}
