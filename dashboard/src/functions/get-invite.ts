import { z } from "zod";

import { backendFetch } from "@/lib/backend-fetch";

const inviteSchema = z.object({
	email: z.email(),
	role: z.enum(["ADMIN", "MEMBER"]),
	clinic: z.object({ name: z.string() }),
	invitedBy: z.object({ name: z.string() }),
});

export type InviteResult =
	| {
			status: "valid";
			email: string;
			role: z.infer<typeof inviteSchema>["role"];
			clinicName: string;
			invitedByName: string;
		}
	| { status: "not_found" }
	| { status: "expired" };

/** يتحقق من الدعوة عبر الـBackend، بدل قراءة جدول الدعوات داخل الـDashboard. */
export const getInvite = async (token: string): Promise<InviteResult> => {
	try {
		const response = await backendFetch(`/api/invites/${encodeURIComponent(token)}`);
		if (response.status === 404) return { status: "not_found" };
		if (response.status === 410) return { status: "expired" };
		if (!response.ok) return { status: "not_found" };

		const parsed = inviteSchema.safeParse(await response.json());
		if (!parsed.success) return { status: "not_found" };

		return {
			status: "valid",
			email: parsed.data.email,
			role: parsed.data.role,
			clinicName: parsed.data.clinic.name,
			invitedByName: parsed.data.invitedBy.name,
		};
	} catch {
		return { status: "not_found" };
	}
};
