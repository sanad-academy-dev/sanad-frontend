export type GuardrailEnforcement = "gate" | "prompt";
export type Guardrail = {
    key: string;
    title: string;
    description: string;
    defaultEnabled: boolean;
    enforcement: GuardrailEnforcement;
    rule: string;
};
export declare const GUARDRAILS: Guardrail[];
export declare const DEFAULT_ENABLED_GUARDRAILS: string[];
export declare function buildGuardrailsPrompt(enabledKeys: string[]): string;
export declare function isGuardEnabled(enabledKeys: string[], key: string): boolean;
export declare function maskValue(value: string | null | undefined): string | null;
export declare function shouldMaskSensitive(enabledKeys: string[]): boolean;
