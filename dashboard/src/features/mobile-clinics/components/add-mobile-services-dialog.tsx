import { IconSearch } from "@tabler/icons-react";
import { useMemo, useState } from "react";

import { Spinner } from "@/components/common/spinner";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	useMobileServiceCandidates,
	useMobileServiceMutations,
} from "@/features/mobile-clinics/hooks/use-mobile-services";

const money = new Intl.NumberFormat("ar-EG", { maximumFractionDigits: 2 });

/**
 * [MC10.1] إضافة دورات إلى سجلّ المتنقلة، دفعةً واحدة.
 *
 * الإضافة الجماعية مقصودة: أكاديمية تبدأ التشغيل تُدرج عشرين دورة مرّة واحدة، وإجبارها على
 * نافذة لكل دورة كان سيدفعها إلى تركِ السجلّ فارغًا — وهي الحالة التي تُعطّل الوحدة كلّها.
 * الأسعار الخاصّة تُضبط بعدئذٍ من الجدول، فالمُدرَج يرث سعر الأكاديمية افتراضًا.
 */
export function AddMobileServicesDialog({
	open,
	onClose,
}: {
	open: boolean;
	onClose: () => void;
}) {
	const { candidates, isLoading } = useMobileServiceCandidates(open);
	const { addServices, isAdding } = useMobileServiceMutations();
	const [selected, setSelected] = useState<Set<string>>(new Set());
	const [search, setSearch] = useState("");

	const filtered = useMemo(() => {
		const term = search.trim().toLowerCase();
		if (!term) return candidates;
		return candidates.filter(
			(c) =>
				c.name.toLowerCase().includes(term) ||
				(c.categoryName ?? "").toLowerCase().includes(term),
		);
	}, [candidates, search]);

	const toggle = (id: string) =>
		setSelected((current) => {
			const next = new Set(current);
			if (next.has(id)) next.delete(id);
			else next.add(id);
			return next;
		});

	const submit = async () => {
		await addServices([...selected]);
		setSelected(new Set());
		setSearch("");
		onClose();
	};

	return (
		<Dialog
			open={open}
			onOpenChange={(next) => {
				if (!next) onClose();
			}}
		>
			{/* dir صريح: محتوى Radix يُنقَل خارج شجرة RTL فلا يرثه */}
			<DialogContent
				className="max-h-[85vh] overflow-hidden sm:max-w-[540px]"
				dir="rtl"
			>
				<DialogHeader>
					<DialogTitle className="text-sm font-semibold">
						إضافة دورات إلى الأكاديمية المتنقلة
					</DialogTitle>
				</DialogHeader>

				<div className="flex flex-col gap-2">
					<div className="relative">
						<IconSearch className="absolute top-2.5 size-4 text-muted-foreground start-3" />
						<Input
							value={search}
							onChange={(event) => setSearch(event.target.value)}
							placeholder="ابحث عن دورة…"
							className="text-sm ps-9"
							disabled={isAdding}
						/>
					</div>

					{isLoading ? (
						<div className="flex justify-center py-8">
							<Spinner />
						</div>
					) : filtered.length === 0 ? (
						<span className="py-8 text-center text-sm text-muted-foreground">
							{candidates.length === 0 ? "كل دورات الأكاديمية مُدرجة بالفعل." : "لا نتائج مطابقة."}
						</span>
					) : (
						<div className="flex max-h-[45vh] flex-col gap-0.5 overflow-y-auto">
							{filtered.map((candidate) => (
								<Label
									key={candidate.id}
									className="flex cursor-pointer items-center gap-3 rounded-[4px] px-2 py-2 font-normal hover:bg-muted"
								>
									<Checkbox
										checked={selected.has(candidate.id)}
										onCheckedChange={() => toggle(candidate.id)}
										disabled={isAdding}
									/>
									<div className="flex min-w-0 flex-1 flex-col">
										<span className="truncate text-sm">{candidate.name}</span>
										{candidate.categoryName && (
											<span className="text-[11px] text-muted-foreground">
												{candidate.categoryName}
											</span>
										)}
									</div>
									<span className="shrink-0 text-xs text-muted-foreground tabular-nums">
										{candidate.clinicPrice === null
											? "بلا سعر"
											: `${money.format(Number(candidate.clinicPrice))} ر.س`}
									</span>
								</Label>
							))}
						</div>
					)}
				</div>

				<div className="flex items-center justify-end gap-2 border-t pt-3">
					<Button
						variant="outline"
						size="sm"
						onClick={onClose}
						disabled={isAdding}
					>
						إلغاء
					</Button>
					<Button
						size="sm"
						onClick={submit}
						disabled={isAdding || selected.size === 0}
					>
						إضافة {selected.size > 0 ? `(${selected.size})` : ""}
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
}
