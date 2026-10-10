import type { LanguageModel, ToolSet } from "ai";
export type AgentProvider = "openai" | "anthropic";
export declare function resolveModel(provider?: AgentProvider): LanguageModel;
export declare function resolveRouterModel(provider?: AgentProvider): LanguageModel;
export declare function resolveWebSearch(): {
    model: LanguageModel;
    tools: ToolSet;
} | null;
