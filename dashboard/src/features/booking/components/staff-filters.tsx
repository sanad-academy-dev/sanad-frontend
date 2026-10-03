import { IconFilter, IconSearch } from "@tabler/icons-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { CITIES } from "@/lib/data/cities";

export type StaffFilterState = {
	query: string;
	specializationId: string | null;
	serviceId: string | null;
	city: string | null;
};

export type FilterOption = { id: string; name: string };

type StaffFiltersProps = {
	value: StaffFilterState;
	onChange: (next: StaffFilterState) => void;
	specializationOptions: FilterOption[];
	serviceOptions: FilterOption[];
	cityOptions: string[];
};

const ALL_VALUE = "__all__";

export const StaffFilters = ({
	value,
	onChange,
	specializationOptions,
	serviceOptions,
	cityOptions,
}: StaffFiltersProps) => {
	const cityLabel = (cityValue: string) =>
		CITIES.find((c) => c.value === cityValue)?.label ?? cityValue;

	return (
		<div className="flex flex-nowrap items-center gap-2 overflow-x-auto">
			<div className="relative flex-1 shrink">
				<IconSearch className="pointer-events-none absolute top-1/2 inset-s-3 size-4 -translate-y-1/2 text-muted-foreground" />
				<Input
					value={value.query}
					onChange={(e) => onChange({ ...value, query: e.target.value })}
					placeholder="ابحث باسم المدرّب"
					aria-label="ابحث باسم المدرّب"
					className="h-10 rounded-xl ps-9"
				/>
			</div>

			<Button
				type="button"
				variant="outline"
				className="h-10 shrink-0 gap-2 rounded-xl"
				onClick={() => {}}
			>
				<IconFilter className="size-4" />
				تصفية
			</Button>

			<Select
				value={value.specializationId ?? ALL_VALUE}
				onValueChange={(v) =>
					onChange({ ...value, specializationId: v === ALL_VALUE ? null : v })
				}
				dir="rtl"
			>
				<SelectTrigger className="h-10 w-fit shrink-0 rounded-xl">
					<SelectValue placeholder="التخصص" />
				</SelectTrigger>
				<SelectContent>
					<SelectItem value={ALL_VALUE}>كل التخصصات</SelectItem>
					{specializationOptions.map((opt) => (
						<SelectItem
							key={opt.id}
							value={opt.id}
						>
							{opt.name}
						</SelectItem>
					))}
				</SelectContent>
			</Select>

			<Select
				value={value.serviceId ?? ALL_VALUE}
				onValueChange={(v) => onChange({ ...value, serviceId: v === ALL_VALUE ? null : v })}
				dir="rtl"
			>
				<SelectTrigger className="h-10 w-fit shrink-0 rounded-xl">
					<SelectValue placeholder="الدورة" />
				</SelectTrigger>
				<SelectContent>
					<SelectItem value={ALL_VALUE}>كل الدورات</SelectItem>
					{serviceOptions.map((opt) => (
						<SelectItem
							key={opt.id}
							value={opt.id}
						>
							{opt.name}
						</SelectItem>
					))}
				</SelectContent>
			</Select>

			<Select
				value={value.city ?? ALL_VALUE}
				onValueChange={(v) => onChange({ ...value, city: v === ALL_VALUE ? null : v })}
				dir="rtl"
			>
				<SelectTrigger className="h-10 shrink-0 rounded-xl">
					<SelectValue placeholder="المدينة" />
				</SelectTrigger>
				<SelectContent>
					<SelectItem value={ALL_VALUE}>كل المدن</SelectItem>
					{cityOptions.map((city) => (
						<SelectItem
							key={city}
							value={city}
						>
							{cityLabel(city)}
						</SelectItem>
					))}
				</SelectContent>
			</Select>
		</div>
	);
};
