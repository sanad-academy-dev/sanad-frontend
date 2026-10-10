export declare const kioskDao: {
    verifyPin(clinicId: string, pin: string): Promise<boolean>;
    setPin(clinicId: string, pin: string): Promise<{
        ok: boolean;
    }>;
};
