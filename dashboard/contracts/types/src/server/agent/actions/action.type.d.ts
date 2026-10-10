export type SubAgentKey = "general" | "hr" | "visits" | "inventory" | "workflow" | "reports";
export type PromptSlotKind = "text" | "select" | "enum" | "date" | "slot-time";
export type PromptSegment = {
    type: "text";
    text: string;
} | {
    type: "slot";
    field: string;
    kind: PromptSlotKind;
    placeholder: string;
    source?: string;
};
export type ActionPreset = {
    key: string;
    subAgent: SubAgentKey;
    kind: "read" | "write";
    title: string;
    description: string;
    contexts: string[];
    template: PromptSegment[];
};
export type SubAgentGroup = {
    key: SubAgentKey;
    title: string;
    presets: ActionPreset[];
};
