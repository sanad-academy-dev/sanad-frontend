export type AskAboutRegionResult = {
    ok: true;
    answer: string;
} | {
    ok: false;
    reason: "not-found" | "invalid-image" | "provider";
};
export declare const askAboutRegion: (itemId: string, clinicId: string, input: {
    imageDataUrl: string;
    question: string;
}) => Promise<AskAboutRegionResult>;
