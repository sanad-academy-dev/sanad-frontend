declare const getSchema: () => Promise<{
    openapi: string;
    info: {
        title: string;
        description: string;
        version: string;
    };
    components: {
        securitySchemes: {
            apiKeyCookie: {
                type: string;
                in: string;
                name: string;
                description: string;
            };
            bearerAuth: {
                type: string;
                scheme: string;
                description: string;
            };
        };
        schemas: {
            [x: string]: import("better-auth/plugins").OpenAPIModelSchema;
        };
    };
    security: {
        apiKeyCookie: never[];
        bearerAuth: never[];
    }[];
    servers: {
        url: string;
    }[];
    tags: {
        name: string;
        description: string;
    }[];
    paths: Record<string, import("better-auth/plugins").Path>;
}>;
type GeneratedOpenAPISchema = Awaited<ReturnType<typeof getSchema>>;
type OpenAPIComponents = GeneratedOpenAPISchema["components"];
declare const HTTP_METHODS: readonly ["get", "put", "post", "delete", "options", "head", "patch", "trace"];
type OpenAPIOperation = {
    tags?: string[];
};
type OpenAPIPathItem = Partial<Record<(typeof HTTP_METHODS)[number], OpenAPIOperation>> & Record<string, unknown>;
export declare const OpenAPI: {
    readonly getPaths: (prefix?: string) => Promise<Record<string, OpenAPIPathItem>>;
    readonly components: Promise<OpenAPIComponents>;
};
export {};
