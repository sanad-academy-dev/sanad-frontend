import type { ActionPreset, SubAgentKey } from "@/server/agent/actions/action.type";
export declare const SUB_AGENT_TITLES: Record<SubAgentKey, string>;
export declare const ACTION_PRESETS: ActionPreset[];
export declare function rankPresetsByContext(context?: string): ActionPreset[];
