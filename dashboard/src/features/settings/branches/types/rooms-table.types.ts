import type { RoomResponse } from "@/server/rooms/rooms.type";

export interface RoomsTableProps {
	branchId: string;
}

export interface RoomStatusCellProps {
	branchId: string;
	room: RoomResponse;
}
