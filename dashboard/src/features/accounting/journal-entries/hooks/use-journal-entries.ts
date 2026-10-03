import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { api } from "@/lib/api";
import type {
	CreateJournalEntryFormValues,
	JournalEntryResponse,
	JournalEntryTemplateResponse,
} from "@/server/accounting/journal-entry/journal-entry.type";

/** [P2.5 UI] Data hooks for the Journal Entry lifecycle (BRD §7.1). */

const QUERY_KEY = ["accounting", "journal-entries"] as const;
const errorMessage = (error: unknown, fallback: string): string =>
	(error as { value?: { message?: string } })?.value?.message ?? fallback;

const resource = api.accounting["journal-entries"];

export const useJournalEntries = () => {
	const { data, isLoading } = useQuery<JournalEntryResponse[]>({
		queryKey: QUERY_KEY,
		queryFn: async () => {
			const { data, error } = await resource.get({ query: {} });
			if (error) throw new Error(errorMessage(error, "تعذّر تحميل قيود اليومية"));
			return data as JournalEntryResponse[];
		},
		staleTime: 1000 * 30,
	});
	return { journalEntries: data ?? [], isLoading };
};

export const useJournalEntryTemplates = () => {
	const { data } = useQuery<JournalEntryTemplateResponse[]>({
		queryKey: [...QUERY_KEY, "templates"],
		queryFn: async () => {
			const { data, error } = await resource.templates.get();
			if (error) throw new Error(errorMessage(error, "تعذّر تحميل القوالب"));
			return data as JournalEntryTemplateResponse[];
		},
		staleTime: 1000 * 60,
	});
	return { templates: data ?? [] };
};

export const useJournalEntryActions = () => {
	const queryClient = useQueryClient();
	const invalidate = () => queryClient.invalidateQueries({ queryKey: QUERY_KEY });

	const createMutation = useMutation({
		mutationFn: async (input: CreateJournalEntryFormValues) => {
			const { data, error } = await resource.post(input);
			if (error) throw new Error(errorMessage(error, "تعذّر إنشاء القيد"));
			return data as JournalEntryResponse;
		},
		onSuccess: invalidate,
	});
	const updateMutation = useMutation({
		mutationFn: async ({
			id,
			changes,
		}: {
			id: string;
			changes: CreateJournalEntryFormValues;
		}) => {
			const { data, error } = await resource({ id }).patch(changes);
			if (error) throw new Error(errorMessage(error, "تعذّر تعديل القيد"));
			return data as JournalEntryResponse;
		},
		onSuccess: invalidate,
	});
	const submitMutation = useMutation({
		mutationFn: async (id: string) => {
			const { data, error } = await resource({ id }).submit.post();
			if (error) throw new Error(errorMessage(error, "تعذّر ترحيل القيد"));
			return data as JournalEntryResponse;
		},
		onSuccess: invalidate,
	});
	const cancelMutation = useMutation({
		mutationFn: async (id: string) => {
			const { data, error } = await resource({ id }).cancel.post();
			if (error) throw new Error(errorMessage(error, "تعذّر إلغاء القيد"));
			return data as JournalEntryResponse;
		},
		onSuccess: invalidate,
	});
	const amendMutation = useMutation({
		mutationFn: async (id: string) => {
			const { data, error } = await resource({ id }).amend.post();
			if (error) throw new Error(errorMessage(error, "تعذّر إنشاء نسخة معدَّلة"));
			return data as JournalEntryResponse;
		},
		onSuccess: invalidate,
	});
	const deleteMutation = useMutation({
		mutationFn: async (id: string) => {
			const { error } = await resource({ id }).delete();
			if (error) throw new Error(errorMessage(error, "تعذّر حذف المسودة"));
		},
		onSuccess: invalidate,
	});

	const create = (input: CreateJournalEntryFormValues) =>
		toast.promise(createMutation.mutateAsync(input), {
			loading: "جارٍ إنشاء المسودة...",
			success: "تم إنشاء مسودة القيد",
			error: (e: Error) => e.message,
		});
	const update = (id: string, changes: CreateJournalEntryFormValues) =>
		toast.promise(updateMutation.mutateAsync({ id, changes }), {
			loading: "جارٍ حفظ التعديل...",
			success: "تم حفظ التعديل",
			error: (e: Error) => e.message,
		});
	const submit = (id: string) =>
		toast.promise(submitMutation.mutateAsync(id), {
			loading: "جارٍ الترحيل...",
			success: (je) => `تم الترحيل برقم ${je.documentNo ?? ""}`,
			error: (e: Error) => e.message,
		});
	const cancel = (id: string) =>
		toast.promise(cancelMutation.mutateAsync(id), {
			loading: "جارٍ الإلغاء...",
			success: "تم إلغاء القيد وعُكست قيوده",
			error: (e: Error) => e.message,
		});
	const amend = (id: string) =>
		toast.promise(amendMutation.mutateAsync(id), {
			loading: "جارٍ إنشاء نسخة معدَّلة...",
			success: "تم إنشاء مسودة جديدة معدَّلة",
			error: (e: Error) => e.message,
		});
	const remove = (id: string) =>
		toast.promise(deleteMutation.mutateAsync(id), {
			loading: "جارٍ الحذف...",
			success: "تم حذف المسودة",
			error: (e: Error) => e.message,
		});

	const isPending =
		createMutation.isPending ||
		updateMutation.isPending ||
		submitMutation.isPending ||
		cancelMutation.isPending ||
		amendMutation.isPending ||
		deleteMutation.isPending;

	return { create, update, submit, cancel, amend, remove, isPending };
};
