import { Skeleton } from "@/components/ui/skeleton";
import { AddDocumentModal } from "@/features/appointments/components/tabs/visit-info/add-document-modal";
import { DocumentItem } from "@/features/appointments/components/tabs/visit-info/document-item";
import { useAppointmentDocuments } from "@/features/appointments/hooks/use-appointment-documents";

interface DocumentsSectionProps {
	appointmentId: string;
}

export function DocumentsSection({ appointmentId }: DocumentsSectionProps) {
	const { documents, isLoading } = useAppointmentDocuments(appointmentId);

	return (
		<section className="flex flex-col gap-3">
			<div className="flex items-center justify-between">
				<p className="font-semibold text-base">المستندات والروابط</p>
				<AddDocumentModal appointmentId={appointmentId} />
			</div>

			{isLoading ? (
				<DocumentsSectionSkeleton />
			) : documents.length === 0 ? (
				<p className="text-muted-foreground text-xs">لا توجد مستندات أو روابط</p>
			) : (
				<div className="flex flex-col gap-2">
					{documents.map((doc) => (
						<DocumentItem
							key={doc.id}
							appointmentId={appointmentId}
							document={doc}
						/>
					))}
				</div>
			)}
		</section>
	);
}

function DocumentsSectionSkeleton() {
	return (
		<div className="flex flex-col gap-2">
			{Array.from({ length: 2 }).map((_, i) => (
				<div
					key={i}
					className="flex items-center gap-3 rounded-md border bg-card px-3 py-2"
				>
					<Skeleton className="size-8 shrink-0 rounded-md" />
					<Skeleton className="h-4 flex-1" />
					<Skeleton className="h-3 w-12 shrink-0" />
					<Skeleton className="size-3.5 shrink-0 rounded-full" />
					<Skeleton className="size-7 shrink-0 rounded-md" />
				</div>
			))}
		</div>
	);
}
