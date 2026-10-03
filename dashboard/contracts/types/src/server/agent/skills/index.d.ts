import type { AgentToolSet, SkillContext, SkillKey, SkillModule } from "@/server/agent/skills/skill.type";
export declare const SKILLS: SkillModule[];
export declare const TOOL_BUDGET = 20;
export declare function totalToolCount(ctx: SkillContext): number;
export type AssembledAgent = {
    tools: AgentToolSet;
    promptSections: string[];
};
export declare function assembleAgentTools(ctx: SkillContext, activeKeys: SkillKey[]): AssembledAgent;
