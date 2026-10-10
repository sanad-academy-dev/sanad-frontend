import type { ComponentProps } from "react";
import type { Badge } from "@/components/ui/badge";
import type { RoomType } from "@/server/rooms/rooms.type";

type BadgeVariant = ComponentProps<typeof Badge>["variant"];

export const ROOM_TYPE_LABELS: Record<RoomType, string> = {
	EXAMINATION: "فحص",
	LABORATORY: "مختبر",
	WAITING: "انتظار",
	OPERATING: "عمليات",
	VACCINATION: "تطعيم",
	ICU: "عناية مركزة",
	GROOMING: "تجميل",
	WARD: "عنبر تنويم",
	ISOLATION: "عزل",
};

export const ROOM_TYPE_VARIANTS: Record<RoomType, BadgeVariant> = {
	EXAMINATION: "primary",
	LABORATORY: "secondary",
	WAITING: "outline",
	OPERATING: "destructive",
	VACCINATION: "default",
	ICU: "secondary",
	GROOMING: "default",
	WARD: "primary",
	ISOLATION: "destructive",
};
