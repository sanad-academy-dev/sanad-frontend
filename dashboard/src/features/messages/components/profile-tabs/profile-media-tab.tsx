import type { SharedMedia } from "@/features/messages/types/messages.type";

export function ProfileMediaTab({ media }: { media: SharedMedia[] }) {
	return (
		<div className="px-3 py-3">
			<h3 className="pb-2 text-[12px] font-medium text-foreground">الوسائط المشتركة</h3>

			{media.length === 0 ? (
				<p className="py-8 text-center text-[12px] text-muted-foreground">
					لا توجد وسائط مشتركة
				</p>
			) : (
				<div className="grid grid-cols-4 gap-1.5">
					{media.map((item) => (
						<a
							key={item.id}
							href={item.url}
							target="_blank"
							rel="noopener noreferrer"
							aria-label={item.alt}
							className="block aspect-square overflow-hidden rounded-[4px] border transition-opacity hover:opacity-80"
						>
							<img
								src={item.url}
								alt={item.alt}
								loading="lazy"
								className="size-full object-cover"
							/>
						</a>
					))}
				</div>
			)}
		</div>
	);
}
