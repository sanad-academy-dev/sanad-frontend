export function SidebarPage({ title, description }: { title: string; description?: string }) {
	return (
		<div className="flex flex-1 items-start p-4.5">
			<div className="w-full rounded-3xl border bg-card p-8">
				<p className="mb-2 text-sm font-medium text-primary">أكاديمية سند</p>
				<h1 className="text-3xl font-bold tracking-tight">{title}</h1>
				<p className="mt-3 max-w-2xl text-muted-foreground">
					{description ?? `هذه صفحة ${title}، ويمكن ربطها بالمحتوى الفعلي لاحقًا.`}
				</p>
			</div>
		</div>
	);
}
