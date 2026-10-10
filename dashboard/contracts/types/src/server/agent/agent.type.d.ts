import { z } from "zod";
import type { ClinicAgentSettings, Prisma } from "@/generated/prisma/client";
export type AgentSettingsResponse = Pick<ClinicAgentSettings, "generalAssistantEnabled" | "webSearchEnabled" | "mcpEnabled" | "enabledGuardrails">;
export declare const updateAgentSettingsSchema: z.ZodObject<{
    generalAssistantEnabled: z.ZodOptional<z.ZodBoolean>;
    webSearchEnabled: z.ZodOptional<z.ZodBoolean>;
    mcpEnabled: z.ZodOptional<z.ZodBoolean>;
    enabledGuardrails: z.ZodOptional<z.ZodArray<z.ZodString>>;
}, z.core.$strip>;
export type UpdateAgentSettingsInput = z.infer<typeof updateAgentSettingsSchema>;
export declare const agentChatMessageSchema: z.ZodObject<{
    role: z.ZodEnum<{
        user: "user";
        assistant: "assistant";
    }>;
    content: z.ZodString;
}, z.core.$strip>;
export declare const agentChatSchema: z.ZodObject<{
    messages: z.ZodArray<z.ZodObject<{
        role: z.ZodEnum<{
            user: "user";
            assistant: "assistant";
        }>;
        content: z.ZodString;
    }, z.core.$strip>>;
    provider: z.ZodOptional<z.ZodEnum<{
        openai: "openai";
        anthropic: "anthropic";
    }>>;
}, z.core.$strip>;
export type AgentChatMessage = z.infer<typeof agentChatMessageSchema>;
export type AgentChatInput = z.infer<typeof agentChatSchema>;
export declare const agentPatientSelect: {
    readonly id: true;
    readonly code: true;
    readonly name: true;
    readonly gender: true;
    readonly ownerId: true;
    readonly animalTypeId: true;
    readonly animalStrainId: true;
    readonly owner: {
        readonly select: {
            readonly id: true;
            readonly name: true;
            readonly phone: true;
        };
    };
    readonly animalType: {
        readonly select: {
            readonly id: true;
            readonly arName: true;
            readonly enName: true;
        };
    };
};
export type AgentPatientResult = Prisma.PatientGetPayload<{
    select: typeof agentPatientSelect;
}>;
export declare const agentConversationListSelect: {
    readonly id: true;
    readonly title: true;
    readonly createdAt: true;
    readonly updatedAt: true;
};
export type AgentConversationListItem = Prisma.AgentConversationGetPayload<{
    select: typeof agentConversationListSelect;
}>;
export declare const agentConversationSelect: {
    readonly id: true;
    readonly title: true;
    readonly createdAt: true;
    readonly updatedAt: true;
    readonly messages: {
        readonly select: {
            readonly id: true;
            readonly role: true;
            readonly content: true;
        };
        readonly orderBy: {
            readonly createdAt: "asc";
        };
    };
};
export type AgentConversationDetail = Prisma.AgentConversationGetPayload<{
    select: typeof agentConversationSelect;
}>;
export declare const createAgentConversationSchema: z.ZodObject<{
    title: z.ZodString;
}, z.core.$strip>;
export type CreateAgentConversationInput = z.infer<typeof createAgentConversationSchema>;
export declare const appendAgentMessageSchema: z.ZodObject<{
    role: z.ZodEnum<{
        user: "user";
        assistant: "assistant";
    }>;
    content: z.ZodString;
}, z.core.$strip>;
export type AppendAgentMessageInput = z.infer<typeof appendAgentMessageSchema>;
export type AgentActionResult = {
    durationSeconds?: number;
    title: string;
    entityName: string;
    entityCode?: string;
    entityInitials?: string;
    statusLabel?: string;
    statusTone?: "muted" | "success" | "danger";
    detailsTitle?: string;
    details: {
        label: string;
        value: string;
    }[];
};
