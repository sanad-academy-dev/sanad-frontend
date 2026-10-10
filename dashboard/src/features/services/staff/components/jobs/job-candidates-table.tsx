import { IconArrowsSort, IconPlus, IconX } from "@tabler/icons-react";
import { useState } from "react";

import type { BoardCandidate } from "@/features/services/staff/components/jobs/jobs-board";
import { cn } from "@/lib/utils";

// أعمدة جدول المرشّحين (RTL: من اليمين لليسار) — عدا عمود الاجراءات
const CANDIDATE_COLUMNS = [
	{ key: "name", label: "الاسم" },
	{ key: "jobCode", label: "رقم الوظيفة" },
	{ key: "appliedDate", label: "تاريخ التقديم" },
	{ key: "nationality", label: "الجنسية" },
	{ key: "city", label: "المدينة" },
	{ key: "experience", label: "الخبرة" },
	{ key: "reviewer", label: "المراجع" },
] as const;

type CandidateSortKey = (typeof CANDIDATE_COLUMNS)[number]["key"];

// عرض «جدول» لمرشّحي الوظيفة — بديل اللوحة
export function JobCandidatesTable({
	candidates,
	onSelect,
}: {
	candidates: BoardCandidate[];
	onSelect: (candidate: BoardCandidate) => void;
}) {
	const [sort, setSort] = useState<{ key: CandidateSortKey; asc: boolean } | null>(null);

	const toggleSort = (key: CandidateSortKey) =>
		setSort((prev) => (prev?.key === key ? { key, asc: !prev.asc } : { key, asc: true }));

	const rows = sort
		? [...candidates].sort(
				(a, b) =>
					String(a[sort.key]).localeCompare(String(b[sort.key]), "ar") * (sort.asc ? 1 : -1),
			)
		: candidates;

	if (candidates.length === 0) {
		return (
			<div className="flex min-h-0 flex-1 items-center justify-center bg-white p-3">
				<span className="text-[12px] text-[#9B9B9D]">لا يوجد مرشّحون مطابقون</span>
			</div>
		);
	}

	return (
		<div className="flex min-h-0 flex-1 flex-col overflow-auto bg-white">
			<table className="w-full table-fixed border-collapse">
				<thead className="sticky top-0 z-10 bg-white">
					<tr className="border-b-[0.75px] border-[#D8D8D8]">
						{CANDIDATE_COLUMNS.map(({ key, label }) => (
							<th
								key={key}
								className="h-[34px] ps-3 pe-8 text-right"
							>
								{/* ترتيب DOM في RTL: التسمية أولًا ⇒ يمينًا، وأيقونة الترتيب على يسارها */}
								<button
									type="button"
									onClick={() => toggleSort(key)}
									className="flex items-center gap-1 text-[12px] font-semibold leading-[18px] text-[#5C5C5E]"
								>
									{label}
									<IconArrowsSort
										className={cn(
											"size-3 text-[#9B9B9D]",
											sort?.key === key && "text-[#08090A]",
											sort?.key === key && !sort.asc && "rotate-180",
										)}
									/>
								</button>
							</th>
						))}
						<th className="h-[34px] px-3 text-right text-[12px] font-semibold leading-[18px] text-[#5C5C5E]">
							الاجراءات
						</th>
					</tr>
				</thead>
				<tbody>
					{rows.map((c) => (
						<tr
							key={c.id}
							onClick={() => onSelect(c)}
							className="cursor-pointer border-b-[0.75px] border-[#D8D8D8] hover:bg-[#FAFAFA]"
						>
							<td className="h-[34px] ps-3 pe-8">
								{/* الاسم زر ليُفتح ملف المرشّح بلوحة المفاتيح أيضًا */}
								<button
									type="button"
									onClick={(e) => {
										e.stopPropagation();
										onSelect(c);
									}}
									className="flex w-full items-center gap-2 text-start"
								>
									<span className="flex size-[18px] shrink-0 items-center justify-center rounded-full bg-[#EEF0F5] text-[8px] font-semibold text-[#4F6AE0]">
										{c.name
											.split(" ")
											.slice(0, 2)
											.map((w) => w[0])
											.join("")}
									</span>
									<span className="truncate text-[12px] font-medium leading-[18px] text-[#08090A]">
										{c.name}
									</span>
								</button>
							</td>
							<td className="h-[34px] ps-3 pe-8 text-right text-[12px] text-[#08090A]">
								{c.jobCode}
							</td>
							<td className="h-[34px] ps-3 pe-8 text-right text-[12px] text-[#08090A]">
								{c.appliedDate}
							</td>
							<td className="h-[34px] ps-3 pe-8 text-right text-[12px] text-[#08090A]">
								{c.nationality}
							</td>
							<td className="h-[34px] ps-3 pe-8 text-right text-[12px] text-[#08090A]">
								{c.city}
							</td>
							<td className="h-[34px] ps-3 pe-8 text-right text-[12px] text-[#08090A]">
								{c.experience}
							</td>
							<td className="h-[34px] ps-3 pe-8 text-right text-[12px] text-[#08090A]">
								{c.reviewer}
							</td>
							<td className="h-[34px] px-3">
								{/* أزرار الإجراء لا تفتح لوحة المرشّح */}
								<div className="flex items-center gap-1.5">
									<button
										type="button"
										onClick={(e) => e.stopPropagation()}
										className="flex h-6 items-center gap-1 whitespace-nowrap rounded-[4px] bg-[#6366F1] px-1.5 text-[10px] font-medium text-white"
									>
										<IconPlus className="size-3" />
										إضافة للقائمة
									</button>
									<button
										type="button"
										onClick={(e) => e.stopPropagation()}
										className="flex h-6 items-center gap-1 whitespace-nowrap rounded-[4px] border-[0.75px] border-[#E5E5E5] px-1.5 text-[10px] text-[#FF6467]"
									>
										<IconX className="size-3" />
										رفض
									</button>
								</div>
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}
