import type { Prisma } from "@/generated/prisma/client";
export type AnimalTypeResponse = Prisma.AnimalTypeGetPayload<{
    select: {
        id: true;
        arName: true;
        enName: true;
        isDefault: true;
        clinicId: true;
        createdAt: true;
        _count: {
            select: {
                strains: true;
            };
        };
    };
}>;
export type CreateAnimalTypeInput = Pick<Prisma.AnimalTypeUncheckedCreateInput, "arName" | "enName"> & {
    clinicId: string;
};
export type UpdateAnimalTypeInput = Partial<Pick<Prisma.AnimalTypeUncheckedCreateInput, "arName" | "enName">>;
