import { Skeleton } from "@/components/ui/skeleton";

export const ClinicProfileHeaderSkeleton = () => {
	return (
		<section className="relative">
			<Skeleton className="h-[280px] w-full rounded-none sm:h-[360px]" />
			<div className="mx-auto -mt-24 max-w-5xl px-4 sm:-mt-32 sm:px-6">
				<div className="rounded-2xl bg-card p-6 shadow-sm ring-1 ring-border sm:p-8">
					<div className="flex items-center justify-between gap-6">
						<Skeleton className="h-11 w-36 rounded-md" />
						<div className="flex items-center gap-4">
							<div className="flex flex-col items-end gap-2">
								<Skeleton className="h-6 w-32" />
								<Skeleton className="h-4 w-44" />
							</div>
							<Skeleton className="size-20 rounded-full sm:size-24" />
						</div>
					</div>
					<div className="mt-6 space-y-2">
						<Skeleton className="h-4 w-full" />
						<Skeleton className="h-4 w-11/12" />
						<Skeleton className="h-4 w-9/12" />
					</div>
				</div>
			</div>
		</section>
	);
};
