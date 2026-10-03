import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useMemo } from "react";
import { toast } from "sonner";

import { useMessagesStore } from "@/features/messages/stores/messages.store";
import type { ChatMember, Conversation } from "@/features/messages/types/messages.type";
import {
	type DirectoryView,
	extractThreadAttachments,
	extractThreadLinks,
	mapConversation,
	mapDirectoryEntry,
	mapThread,
} from "@/features/messages/utils/chat-map";
import { api } from "@/lib/api";
import { useSession } from "@/lib/auth/client";

/** دليل الفريق — يغذّي منتقي الأعضاء ونقاط الحضور وبيانات البروفايل */
export function useChatDirectory() {
	const { data, isLoading } = useQuery({
		queryKey: ["chat", "directory"],
		queryFn: async () => {
			const { data, error } = await api.chat.directory.get();
			if (error) throw new Error("تعذر تحميل دليل الفريق");
			return data;
		},
		staleTime: 1000 * 30,
	});

	const directory: DirectoryView[] = useMemo(
		() => (data ?? []).map(mapDirectoryEntry),
		[data],
	);
	const directoryById = useMemo(
		() => new Map(directory.map((entry) => [entry.id, entry])),
		[directory],
	);

	return { directory, directoryById, isLoading };
}

/**
 * حالة وحدة «الرسائل»: قوائم واستعلامات من الخادم عبر Treaty، تحديثات
 * لحظية عبر SSE (راجع use-chat-events)، وتفاؤل محلي في الإرسال والتثبيت.
 */
export function useMessages() {
	const queryClient = useQueryClient();
	const { data: session } = useSession();
	const myId = session?.user.id ?? "";

	const selectedId = useMessagesStore((s) => s.selectedId);
	const select = useMessagesStore((s) => s.select);
	const filter = useMessagesStore((s) => s.filter);
	const listQuery = useMessagesStore((s) => s.listQuery);
	const closeProfile = useMessagesStore((s) => s.closeProfile);

	const { directoryById } = useChatDirectory();

	// ===== الاستعلامات =====

	const conversationsQuery = useQuery({
		queryKey: ["chat", "conversations"],
		queryFn: async () => {
			const { data, error } = await api.chat.conversations.get();
			if (error) throw new Error("تعذر تحميل المحادثات");
			return data;
		},
		staleTime: 1000 * 15,
	});

	const threadQuery = useQuery({
		queryKey: ["chat", "thread", selectedId],
		enabled: !!selectedId,
		queryFn: async () => {
			if (!selectedId) return null;
			const { data, error } = await api.chat.conversations({ id: selectedId }).messages.get();
			if (error) throw new Error("تعذر تحميل الرسائل");
			return data;
		},
		staleTime: 1000 * 5,
	});

	const allConversations: Conversation[] = useMemo(
		() =>
			(conversationsQuery.data ?? []).map((row) => mapConversation(row, myId, directoryById)),
		[conversationsQuery.data, directoryById, myId],
	);

	// التصفية (تبويبات الهيدر) والبحث والترتيب: المثبتة أولًا
	const conversations = useMemo(() => {
		const query = listQuery.trim().toLowerCase();
		return allConversations
			.filter((c) => {
				if (filter === "unread" && c.unreadCount === 0) return false;
				if (filter === "pinned" && !c.pinned) return false;
				if (!query) return true;
				return (
					c.title.toLowerCase().includes(query) || c.preview.toLowerCase().includes(query)
				);
			})
			.sort((a, b) => Number(b.pinned) - Number(a.pinned));
	}, [allConversations, filter, listQuery]);

	const selected: Conversation | null = useMemo(() => {
		const base = allConversations.find((c) => c.id === selectedId);
		if (!base) return null;
		const thread = threadQuery.data;
		if (!thread) return base;
		const { media, documents } = extractThreadAttachments(thread);
		return {
			...base,
			groups: mapThread(thread, myId),
			// الروابط والوسائط والمستندات الحقيقية مستخرجة من المجرى المحمّل
			links: extractThreadLinks(thread),
			media,
			documents,
		};
	}, [allConversations, myId, selectedId, threadQuery.data]);

	// ===== تعليم مقروء: عند الفتح وعند وصول رسائل والمحادثة مفتوحة =====

	const unreadOfSelected = selected?.unreadCount ?? 0;
	useEffect(() => {
		if (!selectedId || unreadOfSelected === 0) return;
		void api.chat
			.conversations({ id: selectedId })
			.read.post()
			.then(() => queryClient.invalidateQueries({ queryKey: ["chat", "conversations"] }));
	}, [queryClient, selectedId, unreadOfSelected]);

	// ===== الطفرات =====

	// كل طفرات الوحدة ترمي Error برسالة عربية — نعرضها كما هي عند الفشل
	const surfaceError = (error: Error) => toast.error(error.message);

	const sendMutation = useMutation({
		mutationFn: async ({ id, body }: { id: string; body: string }) => {
			const { data, error } = await api.chat.conversations({ id }).messages.post({ body });
			if (error) throw new Error("تعذر إرسال الرسالة");
			return data;
		},
		onError: surfaceError,
		onSettled: (_data, _err, { id }) => {
			void queryClient.invalidateQueries({ queryKey: ["chat", "thread", id] });
			void queryClient.invalidateQueries({ queryKey: ["chat", "conversations"] });
		},
	});

	const uploadMutation = useMutation({
		mutationFn: async ({ id, file }: { id: string; file: File }) => {
			const { data, error } = await api.chat.conversations({ id }).attachments.post({ file });
			if (error) throw new Error("تعذر رفع الملف — الحد الأقصى 10 م.ب");
			return data;
		},
		onError: surfaceError,
		onSettled: (_data, _err, { id }) => {
			void queryClient.invalidateQueries({ queryKey: ["chat", "thread", id] });
			void queryClient.invalidateQueries({ queryKey: ["chat", "conversations"] });
		},
	});

	const memberPatch = useMutation({
		mutationFn: async ({
			id,
			data,
		}: {
			id: string;
			data: { pinned?: boolean; muted?: boolean };
		}) => {
			const { error } = await api.chat.conversations({ id }).patch(data);
			if (error) throw new Error("تعذر تحديث المحادثة");
		},
		onError: surfaceError,
		onSettled: () => queryClient.invalidateQueries({ queryKey: ["chat", "conversations"] }),
	});

	const createMutation = useMutation({
		mutationFn: async (input: {
			kind: "direct" | "group";
			memberIds: string[];
			body: string;
		}) => {
			const { data, error } = await api.chat.conversations.post({
				kind: input.kind === "group" ? "GROUP" : "DIRECT",
				memberIds: input.memberIds,
				body: input.body,
			});
			if (error) throw new Error("تعذر بدء المحادثة");
			return data;
		},
		onError: surfaceError,
		onSuccess: (conversation) => {
			void queryClient.invalidateQueries({ queryKey: ["chat", "conversations"] });
			if (conversation) select(conversation.id);
		},
	});

	const addMembersMutation = useMutation({
		mutationFn: async ({ id, memberIds }: { id: string; memberIds: string[] }) => {
			const { error } = await api.chat.conversations({ id }).members.post({ memberIds });
			if (error) throw new Error("تعذر إضافة الأعضاء");
		},
		onError: surfaceError,
		onSettled: () => queryClient.invalidateQueries({ queryKey: ["chat", "conversations"] }),
	});

	const deleteMutation = useMutation({
		mutationFn: async (id: string) => {
			const { error } = await api.chat.conversations({ id }).delete();
			if (error) throw new Error("تعذر حذف المحادثة");
		},
		onError: surfaceError,
		onSuccess: (_d, id) => {
			if (selectedId === id) {
				select(null);
				closeProfile();
			}
			void queryClient.invalidateQueries({ queryKey: ["chat", "conversations"] });
		},
	});

	// ===== واجهة الاستخدام (نفس سطح النسخة التجريبية) =====

	const openConversation = useCallback((id: string) => select(id), [select]);

	const togglePin = useCallback(
		(id: string) => {
			const current = allConversations.find((c) => c.id === id);
			memberPatch.mutate({ id, data: { pinned: !current?.pinned } });
		},
		[allConversations, memberPatch],
	);

	const toggleMute = useCallback(
		(id: string) => {
			const current = allConversations.find((c) => c.id === id);
			memberPatch.mutate({ id, data: { muted: !current?.muted } });
		},
		[allConversations, memberPatch],
	);

	const removeConversation = useCallback(
		(id: string, onSuccess?: () => void) => deleteMutation.mutate(id, { onSuccess }),
		[deleteMutation],
	);

	const addMembers = useCallback(
		(id: string, members: ChatMember[]) =>
			addMembersMutation.mutate({ id, memberIds: members.map((m) => m.id) }),
		[addMembersMutation],
	);

	const uploadAttachment = useCallback(
		(id: string, file: File) => uploadMutation.mutate({ id, file }),
		[uploadMutation],
	);

	const sendMessage = useCallback(
		(id: string, body: string) => {
			const text = body.trim();
			if (text) sendMutation.mutate({ id, body: text });
		},
		[sendMutation],
	);

	const createConversation = useCallback(
		(kind: "direct" | "group", members: ChatMember[], body: string, onSuccess?: () => void) =>
			createMutation.mutate(
				{ kind, memberIds: members.map((m) => m.id), body },
				{ onSuccess },
			),
		[createMutation],
	);

	return {
		conversations,
		selected,
		selectedId,
		isLoading: conversationsQuery.isLoading,
		openConversation,
		togglePin,
		toggleMute,
		removeConversation,
		addMembers,
		sendMessage,
		uploadAttachment,
		createConversation,
	};
}
