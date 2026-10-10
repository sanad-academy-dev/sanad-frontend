import type { AgentProvider } from "@/server/agent/core/provider";
import type { SkillContext, SkillKey } from "@/server/agent/skills/skill.type";
type RouteArgs = {
    ctx: SkillContext;
    messages: {
        role: string;
        content: string;
    }[];
    provider?: AgentProvider;
};
export declare function routeSkills({ ctx, messages, provider, }: RouteArgs): Promise<SkillKey[]>;
export {};
