import type { AnimalStrainResponse, AnimalStrainWithTypeResponse, CreateAnimalStrainInput, UpdateAnimalStrainInput } from "@/server/animal-strains/animal-strains.type";
export declare const animalStrainsDao: {
    listAll(clinicId: string): Promise<AnimalStrainWithTypeResponse[]>;
    listByType(animalTypeId: string, clinicId: string): Promise<AnimalStrainResponse[]>;
    findById(id: string, animalTypeId: string, clinicId: string): Promise<AnimalStrainResponse | null>;
    create(input: CreateAnimalStrainInput): Promise<AnimalStrainResponse>;
    update(id: string, animalTypeId: string, clinicId: string, data: UpdateAnimalStrainInput): Promise<AnimalStrainResponse | null>;
    delete(id: string, animalTypeId: string, clinicId: string): Promise<boolean>;
};
