import type { AgentActionResult } from "@/server/agent/agent.type";
export type AgentToolSet = Record<string, any>;
export type SkillKey = "patients" | "hr" | "scheduling" | "tasks" | "finance" | "inventory" | "clinical" | "reports" | "admin";
export type SkillContext = {
    clinicId: string;
    userId: string;
    guardrails: string[];
};
export type SkillModule = {
    key: SkillKey;
    title: string;
    description: string;
    contexts: string[];
    alwaysOn?: boolean;
    gatedTools?: Partial<Record<string, string[]>>;
    promptSection: string;
    buildTools: (ctx: SkillContext) => AgentToolSet;
};
export declare function jsonSafe<T>(value: T): unknown;
export declare const CLINIC_TIME_ZONE = "Asia/Baghdad";
export declare function parseClinicDate(input: string): Date;
export declare function toClinicISO(d: Date): string;
export declare function formatClinicDate(d: Date): string;
export declare const cardMarker: (card: AgentActionResult) => string;
export declare const errorMarker: (title: string, reason: string) => string;
