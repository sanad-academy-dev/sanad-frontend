import {
	IconRosetteDiscountCheckFilled,
	IconSparkles,
	IconStethoscope,
} from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { getFileUrl } from "@/lib/file-url";
import { cn } from "@/lib/utils";
import type { PublicClinicResponse } from "@/server/public/public.type";

const COVER_IMAGE = "/clinic-cover.png";

export const ClinicProfileHeader = ({ clinic }: { clinic: PublicClinicResponse }) => {
	const logoUrl = getFileUrl(clinic.logo);

	return (
		<section className="relative">
			<div
				className="h-[280px] w-full bg-muted bg-center bg-cover sm:h-[360px]"
				style={{ backgroundImage: `url(${COVER_IMAGE})` }}
				aria-hidden
			/>

			<div className="mx-auto -mt-24 max-w-[1600px] px-4 sm:-mt-32 sm:px-6">
				<div className="rounded-2xl bg-white p-6 sm:p-8">
					<div
						className={cn(
							"flex flex-col gap-6 items-center",
							"sm:flex-row",
							"sm:justify-between",
						)}
					>
						<div className={cn("flex items-center gap-4", "flex-row")}>
							<div className="relative size-20 shrink-0 sm:size-24">
								<div className="flex size-full items-center justify-center overflow-hidden rounded-full bg-primary/10">
									{logoUrl ? (
										<img
											src={logoUrl}
											alt={clinic.name}
											className="size-full object-cover"
										/>
									) : (
										<IconStethoscope className="size-10 text-primary sm:size-12" />
									)}
								</div>
								{/* {clinic.isVerified && ( */}
								<div className="absolute -bottom-0.5 -inset-e-0.5 flex size-7 items-center justify-center rounded-full bg-background sm:size-8">
									<IconRosetteDiscountCheckFilled
										className="size-full text-primary"
										aria-label="موثق"
									/>
								</div>
								{/* )} */}
							</div>

							<div className={cn("flex flex-col")}>
								<h1 className="text-xl font-semibold sm:text-2xl">{clinic.name}</h1>
								{clinic.email && (
									<p className="mt-1 text-sm text-muted-foreground">{clinic.email}</p>
								)}
							</div>
						</div>

						<Button
							asChild
							size="lg"
							className="gap-2"
						>
							<a href="#book">
								<IconSparkles className="size-4" />
								حجز أونلاين
							</a>
						</Button>
					</div>

					{clinic.description && (
						<p className="mt-6 text-sm leading-7 text-muted-foreground sm:text-base">
							{clinic.description}
						</p>
					)}
				</div>
			</div>
		</section>
	);
};
