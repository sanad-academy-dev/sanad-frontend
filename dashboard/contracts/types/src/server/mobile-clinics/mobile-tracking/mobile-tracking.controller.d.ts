import Elysia from "elysia";
/**
 * [MC8.4] صفحة تتبّع وليّ الأمر — بلا تسجيل دخول.
 *
 * الإذن هو حيازة الرابط، على سنّة `video-calls` («حيازة الرابط هي الإذن»). ولهذا يُقيَّد ما
 * يخرج بدقّة:
 *   • الموقع **مُخشَّن** إلى ثلاث خانات عشرية (~١١٠ م): يكفي لتحريك علامة على طريق، ولا
 *     يكفي لتحديد البيت الذي يقف أمامه الطاقم.
 *   • لا أسماء طاقم، ولا محطّات أخرى، ولا معرّفات داخلية.
 *   • ينقطع البثّ فور اكتمال الزيارة أو تعذّرها — رابطٌ مسرَّب لا يتحوّل إلى تتبّع دائم
 *     لمركبة.
 */
export declare const mobileTrackingController: Elysia<"/mobile-tracking", {
    decorator: {};
    store: {};
    derive: {};
    resolve: {};
}, {
    typebox: {};
    error: {};
}, {
    schema: {};
    standaloneSchema: {};
    macro: {};
    macroFn: {};
    parser: {};
    response: {};
}, {
    "mobile-tracking": {
        ":token": {
            get: {
                body: unknown;
                params: {
                    token: string;
                } & {};
                query: unknown;
                headers: unknown;
                response: {
                    200: {
                        stage: import("../mobile-visits/mobile-visits.type").MobileDispatchStage;
                        stageLabel: string;
                        finished: boolean;
                        etaAt: string | null;
                        windowStart: string | null;
                        windowEnd: string | null;
                        arrivedAt: string | null;
                        startsAt: any;
                        patientName: any;
                        clinicName: any;
                        clinicPhone: any;
                        address: any;
                        landmark: any;
                        van: import("@/lib/geo").GeoPoint | null;
                        vanSeenAt: any;
                    };
                    404: {
                        readonly message: "رابط التتبّع غير صالح";
                    };
                    422: {
                        type: "validation";
                        on: string;
                        summary?: string;
                        message?: string;
                        found?: unknown;
                        property?: string;
                        expected?: string;
                    };
                };
            };
        };
    };
} & {
    "mobile-tracking": {
        ":token": {
            stream: {
                get: {
                    body: unknown;
                    params: {
                        token: string;
                    } & {};
                    query: unknown;
                    headers: unknown;
                    response: {
                        200: Response;
                        404: {
                            readonly message: "رابط التتبّع غير صالح";
                        };
                        410: {
                            readonly message: "انتهت هذه الزيارة";
                        };
                        422: {
                            type: "validation";
                            on: string;
                            summary?: string;
                            message?: string;
                            found?: unknown;
                            property?: string;
                            expected?: string;
                        };
                    };
                };
            };
        };
    };
}, {
    derive: {};
    resolve: {};
    schema: {};
    standaloneSchema: {};
    response: {};
}, {
    derive: {};
    resolve: {};
    schema: {};
    standaloneSchema: {};
    response: {};
}>;
