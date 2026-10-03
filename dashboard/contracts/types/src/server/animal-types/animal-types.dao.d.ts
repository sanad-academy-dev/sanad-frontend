import type { AnimalTypeResponse, CreateAnimalTypeInput, UpdateAnimalTypeInput } from "@/server/animal-types/animal-types.type";
export declare const animalTypesDao: {
    list(clinicId: string): Promise<AnimalTypeResponse[]>;
    findById(id: string, clinicId: string): Promise<AnimalTypeResponse | null>;
    create(input: CreateAnimalTypeInput): Promise<AnimalTypeResponse>;
    update(id: string, clinicId: string, data: UpdateAnimalTypeInput): Promise<AnimalTypeResponse | null>;
    delete(id: string, clinicId: string): Promise<boolean>;
};
