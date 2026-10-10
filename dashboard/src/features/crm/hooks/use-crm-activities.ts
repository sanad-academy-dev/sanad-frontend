import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { api } from "@/lib/api";
import type {
	CrmCommentFormInput,
	CrmCommentResponse,
	CrmNoteFormInput,
	CrmNoteResponse,
	CrmTaskFormInput,
	CrmTaskResponse,
	CrmTaskUpdateFormInput,
} from "@/server/crm/crm-leads/crm-leads.type";

/**
 * [CRM-P1] The §8.2 activities behind the entity timeline, plus the clinic-wide task inbox.
 *
 * [CRM-P2] — the same tables serve deals (§8.1), so every hook takes a `referenceType`. The
 * two Treaty resources are branched on rather than resolved into one variable: their route
 * trees are DIFFERENT types, and a union of them is not callable. Branching keeps each side
 * fully type-checked instead of casting the client away.
 */

const leads = api.crm.leads;
const LEAD_KEY = ["crm", "leads"] as const;
const DEAL_KEY = ["crm", "deals"] as const;
const TASK_INBOX_KEY = ["crm", "tasks", "inbox"] as const;

export type CrmSubjectType = "LEAD" | "DEAL";

/** The query-key root for a subject, so a deal's notes never share a cache entry with a lead's. */
const subjectKey = (type: CrmSubjectType) => (type === "DEAL" ? DEAL_KEY : LEAD_KEY);

const errorMessage = (error: unknown, fallback: string): string =>
	(error as { value?: { message?: string } })?.value?.message ?? fallback;

const fetchActivity = (
	type: CrmSubjectType,
	id: string,
	kind: "notes" | "tasks" | "comments",
) => {
	if (type === "DEAL") {
		const resource = api.crm.deals({ id });
		if (kind === "notes") return resource.notes.get();
		if (kind === "tasks") return resource.tasks.get();
		return resource.comments.get();
	}
	const resource = leads({ id });
	if (kind === "notes") return resource.notes.get();
	if (kind === "tasks") return resource.tasks.get();
	return resource.comments.get();
};

export const useLeadNotes = (leadId: string | null, type: CrmSubjectType = "LEAD") => {
	const { data, isLoading } = useQuery<CrmNoteResponse[]>({
		queryKey: [...subjectKey(type), leadId, "notes"],
		enabled: !!leadId,
		queryFn: async () => {
			const { data, error } = await fetchActivity(type, leadId as string, "notes");
			if (error) throw new Error(errorMessage(error, "تعذّر تحميل الملاحظات"));
			return data as CrmNoteResponse[];
		},
	});
	return { notes: data ?? [], isLoading };
};

export const useLeadTasks = (leadId: string | null, type: CrmSubjectType = "LEAD") => {
	const { data, isLoading } = useQuery<CrmTaskResponse[]>({
		queryKey: [...subjectKey(type), leadId, "tasks"],
		enabled: !!leadId,
		queryFn: async () => {
			const { data, error } = await fetchActivity(type, leadId as string, "tasks");
			if (error) throw new Error(errorMessage(error, "تعذّر تحميل المهام"));
			return data as CrmTaskResponse[];
		},
	});
	return { tasks: data ?? [], isLoading };
};

export const useLeadComments = (leadId: string | null, type: CrmSubjectType = "LEAD") => {
	const { data, isLoading } = useQuery<CrmCommentResponse[]>({
		queryKey: [...subjectKey(type), leadId, "comments"],
		enabled: !!leadId,
		queryFn: async () => {
			const { data, error } = await fetchActivity(type, leadId as string, "comments");
			if (error) throw new Error(errorMessage(error, "تعذّر تحميل التعليقات"));
			return data as CrmCommentResponse[];
		},
	});
	return { comments: data ?? [], isLoading };
};

/** The clinic-wide «المهام» screen. `mine` narrows a full-scope user to their own (§3.2). */
export const useCrmTaskInbox = (mine: boolean) => {
	const { data, isLoading } = useQuery<CrmTaskResponse[]>({
		queryKey: [...TASK_INBOX_KEY, mine],
		queryFn: async () => {
			const { data, error } = await leads.tasks.inbox.get({ query: { mine } });
			if (error) throw new Error(errorMessage(error, "تعذّر تحميل المهام"));
			return data as CrmTaskResponse[];
		},
		staleTime: 1000 * 30,
	});
	return { tasks: data ?? [], isLoading };
};

export const useAddLeadNote = (leadId: string, type: CrmSubjectType = "LEAD") => {
	const queryClient = useQueryClient();
	const { mutateAsync, isPending } = useMutation({
		mutationFn: async (input: CrmNoteFormInput) => {
			const { data, error } =
				type === "DEAL"
					? await api.crm.deals({ id: leadId }).notes.post(input)
					: await leads({ id: leadId }).notes.post(input);
			if (error) throw new Error(errorMessage(error, "تعذّرت إضافة الملاحظة"));
			return data;
		},
		onSuccess: () =>
			// [CRM-P3] البادئة لا الورقة: الخيط الزمني (§8.3) يقرأ الملاحظات أيضًا، وإبطال
			// «notes» وحدها كان سيترك الخيط يعرض نسخةً قديمة بعد الإضافة مباشرةً
			queryClient.invalidateQueries({ queryKey: [...subjectKey(type), leadId] }),
	});

	const addNote = (input: CrmNoteFormInput) =>
		toast.promise(mutateAsync(input), {
			loading: "جارٍ الحفظ...",
			success: "أُضيفت الملاحظة",
			error: (error: Error) => error.message,
		});

	return { addNote, isAdding: isPending };
};

export const useAddLeadTask = (leadId: string, type: CrmSubjectType = "LEAD") => {
	const queryClient = useQueryClient();
	const { mutateAsync, isPending } = useMutation({
		mutationFn: async (input: CrmTaskFormInput) => {
			const { data, error } =
				type === "DEAL"
					? await api.crm.deals({ id: leadId }).tasks.post(input)
					: await leads({ id: leadId }).tasks.post(input);
			if (error) throw new Error(errorMessage(error, "تعذّرت إضافة المهمة"));
			return data;
		},
		onSuccess: () => {
			void queryClient.invalidateQueries({ queryKey: [...subjectKey(type), leadId] });
			// assigning a task fires an inbox notification, so the shared inbox is stale too
			void queryClient.invalidateQueries({ queryKey: TASK_INBOX_KEY });
		},
	});

	const addTask = (input: CrmTaskFormInput) =>
		toast.promise(mutateAsync(input), {
			loading: "جارٍ الحفظ...",
			success: "أُضيفت المهمة",
			error: (error: Error) => error.message,
		});

	return { addTask, isAdding: isPending };
};

export const useUpdateCrmTask = () => {
	const queryClient = useQueryClient();
	const { mutateAsync, isPending } = useMutation({
		mutationFn: async ({ taskId, ...body }: CrmTaskUpdateFormInput & { taskId: string }) => {
			const { data, error } = await leads.tasks({ taskId }).patch(body);
			if (error) throw new Error(errorMessage(error, "تعذّر تحديث المهمة"));
			return data;
		},
		onSuccess: () => {
			void queryClient.invalidateQueries({ queryKey: LEAD_KEY });
			void queryClient.invalidateQueries({ queryKey: TASK_INBOX_KEY });
		},
	});

	const updateTask = (input: CrmTaskUpdateFormInput & { taskId: string }) =>
		toast.promise(mutateAsync(input), {
			loading: "جارٍ التحديث...",
			success: "حُدِّثت المهمة",
			error: (error: Error) => error.message,
		});

	return { updateTask, isUpdating: isPending };
};

export const useAddLeadComment = (leadId: string, type: CrmSubjectType = "LEAD") => {
	const queryClient = useQueryClient();
	const { mutateAsync, isPending } = useMutation({
		mutationFn: async (input: CrmCommentFormInput) => {
			const { data, error } =
				type === "DEAL"
					? await api.crm.deals({ id: leadId }).comments.post(input)
					: await leads({ id: leadId }).comments.post(input);
			if (error) throw new Error(errorMessage(error, "تعذّرت إضافة التعليق"));
			return data;
		},
		onSuccess: () =>
			queryClient.invalidateQueries({ queryKey: [...subjectKey(type), leadId] }),
	});

	const addComment = (input: CrmCommentFormInput) =>
		toast.promise(mutateAsync(input), {
			loading: "جارٍ الحفظ...",
			success: "أُضيف التعليق",
			error: (error: Error) => error.message,
		});

	return { addComment, isAdding: isPending };
};
