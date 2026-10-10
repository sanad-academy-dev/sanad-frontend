import { IconPlus } from "@tabler/icons-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { TabsContent } from "@/components/ui/tabs";
import { AddRoom } from "@/features/settings/branches/components/add-room";
import { RoomsTable } from "@/features/settings/branches/components/rooms-table";
import type { BranchTabProps } from "@/features/settings/branches/types/tabs.types";

export function RoomsTab({ branchId }: BranchTabProps) {
	const [isAdding, setIsAdding] = useState(false);

	return (
		<TabsContent
			value="rooms"
			className="m-0 p-3 flex flex-col gap-5"
			dir="rtl"
		>
			<div className="grid grid-cols-3 gap-2">
				<div className="border rounded-[4px] py-2 px-3">
					<p className="text-[10px]">عدد القاعات</p>
					<p className="text-xs font-semibold">5</p>
				</div>
				<div className="border rounded-[4px] py-2 px-3">
					<p className="text-[10px]">نشط</p>
					<p className="text-xs font-semibold">5</p>
				</div>
				<div className="border rounded-[4px] py-2 px-3">
					<p className="text-[10px]">صيانه</p>
					<p className="text-xs font-semibold">0</p>
				</div>
			</div>

			<div className="flex flex-col gap-2">
				{isAdding ? (
					<AddRoom
						branchId={branchId}
						onBack={() => setIsAdding(false)}
					/>
				) : (
					<div className="flex justify-between flex-col gap-3">
						<div className="flex justify-between items-center">
							<p className="font-bold text-xs">القاعات المرافق</p>
							<Button
								size="sm"
								variant="outline"
								onClick={() => setIsAdding(true)}
							>
								<IconPlus className="size-3" />
								إضافة قاعة
							</Button>
						</div>

						<RoomsTable branchId={branchId} />
					</div>
				)}
			</div>
		</TabsContent>
	);
}
