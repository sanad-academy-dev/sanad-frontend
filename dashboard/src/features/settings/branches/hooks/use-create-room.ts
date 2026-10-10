import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { api } from "@/lib/api";
import type { CreateRoomInput, RoomResponse } from "@/server/rooms/rooms.type";

type CreateRoomFormInput = Omit<CreateRoomInput, "branchId" | "clinicId">;

export const useCreateRoom = (branchId: string) => {
	const queryClient = useQueryClient();

	const mutation = useMutation({
		mutationFn: async (input: CreateRoomFormInput): Promise<RoomResponse> => {
			const res = await api.branches({ id: branchId }).rooms.post(input);
			if (res.error) throw new Error("فشل إنشاء القاعة");
			return res.data as RoomResponse;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["rooms", branchId] });
		},
	});

	const createRoom = async (input: CreateRoomFormInput) =>
		toast.promise(mutation.mutateAsync(input), {
			loading: "جارٍ إنشاء القاعة...",
			success: "تم إنشاء القاعة بنجاح",
			error: (err: Error) => err.message || "فشل إنشاء القاعة",
		});

	return { createRoom, isPending: mutation.isPending, data: mutation.data };
};
