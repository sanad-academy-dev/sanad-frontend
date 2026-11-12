import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace";
/**
 * Model PatientGuardian
 *
 */
export type PatientGuardianModel = runtime.Types.Result.DefaultSelection<Prisma.$PatientGuardianPayload>;
export type AggregatePatientGuardian = {
    _count: PatientGuardianCountAggregateOutputType | null;
    _min: PatientGuardianMinAggregateOutputType | null;
    _max: PatientGuardianMaxAggregateOutputType | null;
};
export type PatientGuardianMinAggregateOutputType = {
    id: string | null;
    clinicId: string | null;
    patientId: string | null;
    ownerId: string | null;
    relationship: string | null;
    createdAt: Date | null;
};
export type PatientGuardianMaxAggregateOutputType = {
    id: string | null;
    clinicId: string | null;
    patientId: string | null;
    ownerId: string | null;
    relationship: string | null;
    createdAt: Date | null;
};
export type PatientGuardianCountAggregateOutputType = {
    id: number;
    clinicId: number;
    patientId: number;
    ownerId: number;
    relationship: number;
    createdAt: number;
    _all: number;
};
export type PatientGuardianMinAggregateInputType = {
    id?: true;
    clinicId?: true;
    patientId?: true;
    ownerId?: true;
    relationship?: true;
    createdAt?: true;
};
export type PatientGuardianMaxAggregateInputType = {
    id?: true;
    clinicId?: true;
    patientId?: true;
    ownerId?: true;
    relationship?: true;
    createdAt?: true;
};
export type PatientGuardianCountAggregateInputType = {
    id?: true;
    clinicId?: true;
    patientId?: true;
    ownerId?: true;
    relationship?: true;
    createdAt?: true;
    _all?: true;
};
export type PatientGuardianAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Filter which PatientGuardian to aggregate.
     */
    where?: Prisma.PatientGuardianWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of PatientGuardians to fetch.
     */
    orderBy?: Prisma.PatientGuardianOrderByWithRelationInput | Prisma.PatientGuardianOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     */
    cursor?: Prisma.PatientGuardianWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` PatientGuardians from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` PatientGuardians.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned PatientGuardians
    **/
    _count?: true | PatientGuardianCountAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
    **/
    _min?: PatientGuardianMinAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
    **/
    _max?: PatientGuardianMaxAggregateInputType;
};
export type GetPatientGuardianAggregateType<T extends PatientGuardianAggregateArgs> = {
    [P in keyof T & keyof AggregatePatientGuardian]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregatePatientGuardian[P]> : Prisma.GetScalarType<T[P], AggregatePatientGuardian[P]>;
};
export type PatientGuardianGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.PatientGuardianWhereInput;
    orderBy?: Prisma.PatientGuardianOrderByWithAggregationInput | Prisma.PatientGuardianOrderByWithAggregationInput[];
    by: Prisma.PatientGuardianScalarFieldEnum[] | Prisma.PatientGuardianScalarFieldEnum;
    having?: Prisma.PatientGuardianScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: PatientGuardianCountAggregateInputType | true;
    _min?: PatientGuardianMinAggregateInputType;
    _max?: PatientGuardianMaxAggregateInputType;
};
export type PatientGuardianGroupByOutputType = {
    id: string;
    clinicId: string;
    patientId: string;
    ownerId: string;
    relationship: string | null;
    createdAt: Date;
    _count: PatientGuardianCountAggregateOutputType | null;
    _min: PatientGuardianMinAggregateOutputType | null;
    _max: PatientGuardianMaxAggregateOutputType | null;
};
export type GetPatientGuardianGroupByPayload<T extends PatientGuardianGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<PatientGuardianGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof PatientGuardianGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], PatientGuardianGroupByOutputType[P]> : Prisma.GetScalarType<T[P], PatientGuardianGroupByOutputType[P]>;
}>>;
export type PatientGuardianWhereInput = {
    AND?: Prisma.PatientGuardianWhereInput | Prisma.PatientGuardianWhereInput[];
    OR?: Prisma.PatientGuardianWhereInput[];
    NOT?: Prisma.PatientGuardianWhereInput | Prisma.PatientGuardianWhereInput[];
    id?: Prisma.StringFilter<"PatientGuardian"> | string;
    clinicId?: Prisma.StringFilter<"PatientGuardian"> | string;
    patientId?: Prisma.StringFilter<"PatientGuardian"> | string;
    ownerId?: Prisma.StringFilter<"PatientGuardian"> | string;
    relationship?: Prisma.StringNullableFilter<"PatientGuardian"> | string | null;
    createdAt?: Prisma.DateTimeFilter<"PatientGuardian"> | Date | string;
    clinic?: Prisma.XOR<Prisma.ClinicScalarRelationFilter, Prisma.ClinicWhereInput>;
    patient?: Prisma.XOR<Prisma.PatientScalarRelationFilter, Prisma.PatientWhereInput>;
    owner?: Prisma.XOR<Prisma.OwnerScalarRelationFilter, Prisma.OwnerWhereInput>;
};
export type PatientGuardianOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    clinicId?: Prisma.SortOrder;
    patientId?: Prisma.SortOrder;
    ownerId?: Prisma.SortOrder;
    relationship?: Prisma.SortOrderInput | Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    clinic?: Prisma.ClinicOrderByWithRelationInput;
    patient?: Prisma.PatientOrderByWithRelationInput;
    owner?: Prisma.OwnerOrderByWithRelationInput;
};
export type PatientGuardianWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    patientId_ownerId?: Prisma.PatientGuardianPatientIdOwnerIdCompoundUniqueInput;
    AND?: Prisma.PatientGuardianWhereInput | Prisma.PatientGuardianWhereInput[];
    OR?: Prisma.PatientGuardianWhereInput[];
    NOT?: Prisma.PatientGuardianWhereInput | Prisma.PatientGuardianWhereInput[];
    clinicId?: Prisma.StringFilter<"PatientGuardian"> | string;
    patientId?: Prisma.StringFilter<"PatientGuardian"> | string;
    ownerId?: Prisma.StringFilter<"PatientGuardian"> | string;
    relationship?: Prisma.StringNullableFilter<"PatientGuardian"> | string | null;
    createdAt?: Prisma.DateTimeFilter<"PatientGuardian"> | Date | string;
    clinic?: Prisma.XOR<Prisma.ClinicScalarRelationFilter, Prisma.ClinicWhereInput>;
    patient?: Prisma.XOR<Prisma.PatientScalarRelationFilter, Prisma.PatientWhereInput>;
    owner?: Prisma.XOR<Prisma.OwnerScalarRelationFilter, Prisma.OwnerWhereInput>;
}, "id" | "patientId_ownerId">;
export type PatientGuardianOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    clinicId?: Prisma.SortOrder;
    patientId?: Prisma.SortOrder;
    ownerId?: Prisma.SortOrder;
    relationship?: Prisma.SortOrderInput | Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    _count?: Prisma.PatientGuardianCountOrderByAggregateInput;
    _max?: Prisma.PatientGuardianMaxOrderByAggregateInput;
    _min?: Prisma.PatientGuardianMinOrderByAggregateInput;
};
export type PatientGuardianScalarWhereWithAggregatesInput = {
    AND?: Prisma.PatientGuardianScalarWhereWithAggregatesInput | Prisma.PatientGuardianScalarWhereWithAggregatesInput[];
    OR?: Prisma.PatientGuardianScalarWhereWithAggregatesInput[];
    NOT?: Prisma.PatientGuardianScalarWhereWithAggregatesInput | Prisma.PatientGuardianScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"PatientGuardian"> | string;
    clinicId?: Prisma.StringWithAggregatesFilter<"PatientGuardian"> | string;
    patientId?: Prisma.StringWithAggregatesFilter<"PatientGuardian"> | string;
    ownerId?: Prisma.StringWithAggregatesFilter<"PatientGuardian"> | string;
    relationship?: Prisma.StringNullableWithAggregatesFilter<"PatientGuardian"> | string | null;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"PatientGuardian"> | Date | string;
};
export type PatientGuardianCreateInput = {
    id?: string;
    relationship?: string | null;
    createdAt?: Date | string;
    clinic: Prisma.ClinicCreateNestedOneWithoutPatientGuardiansInput;
    patient: Prisma.PatientCreateNestedOneWithoutGuardiansInput;
    owner: Prisma.OwnerCreateNestedOneWithoutGuardianPatientsInput;
};
export type PatientGuardianUncheckedCreateInput = {
    id?: string;
    clinicId: string;
    patientId: string;
    ownerId: string;
    relationship?: string | null;
    createdAt?: Date | string;
};
export type PatientGuardianUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    relationship?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    clinic?: Prisma.ClinicUpdateOneRequiredWithoutPatientGuardiansNestedInput;
    patient?: Prisma.PatientUpdateOneRequiredWithoutGuardiansNestedInput;
    owner?: Prisma.OwnerUpdateOneRequiredWithoutGuardianPatientsNestedInput;
};
export type PatientGuardianUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    clinicId?: Prisma.StringFieldUpdateOperationsInput | string;
    patientId?: Prisma.StringFieldUpdateOperationsInput | string;
    ownerId?: Prisma.StringFieldUpdateOperationsInput | string;
    relationship?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type PatientGuardianCreateManyInput = {
    id?: string;
    clinicId: string;
    patientId: string;
    ownerId: string;
    relationship?: string | null;
    createdAt?: Date | string;
};
export type PatientGuardianUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    relationship?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type PatientGuardianUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    clinicId?: Prisma.StringFieldUpdateOperationsInput | string;
    patientId?: Prisma.StringFieldUpdateOperationsInput | string;
    ownerId?: Prisma.StringFieldUpdateOperationsInput | string;
    relationship?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type PatientGuardianListRelationFilter = {
    every?: Prisma.PatientGuardianWhereInput;
    some?: Prisma.PatientGuardianWhereInput;
    none?: Prisma.PatientGuardianWhereInput;
};
export type PatientGuardianOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type PatientGuardianPatientIdOwnerIdCompoundUniqueInput = {
    patientId: string;
    ownerId: string;
};
export type PatientGuardianCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    clinicId?: Prisma.SortOrder;
    patientId?: Prisma.SortOrder;
    ownerId?: Prisma.SortOrder;
    relationship?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type PatientGuardianMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    clinicId?: Prisma.SortOrder;
    patientId?: Prisma.SortOrder;
    ownerId?: Prisma.SortOrder;
    relationship?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type PatientGuardianMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    clinicId?: Prisma.SortOrder;
    patientId?: Prisma.SortOrder;
    ownerId?: Prisma.SortOrder;
    relationship?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type PatientGuardianCreateNestedManyWithoutClinicInput = {
    create?: Prisma.XOR<Prisma.PatientGuardianCreateWithoutClinicInput, Prisma.PatientGuardianUncheckedCreateWithoutClinicInput> | Prisma.PatientGuardianCreateWithoutClinicInput[] | Prisma.PatientGuardianUncheckedCreateWithoutClinicInput[];
    connectOrCreate?: Prisma.PatientGuardianCreateOrConnectWithoutClinicInput | Prisma.PatientGuardianCreateOrConnectWithoutClinicInput[];
    createMany?: Prisma.PatientGuardianCreateManyClinicInputEnvelope;
    connect?: Prisma.PatientGuardianWhereUniqueInput | Prisma.PatientGuardianWhereUniqueInput[];
};
export type PatientGuardianUncheckedCreateNestedManyWithoutClinicInput = {
    create?: Prisma.XOR<Prisma.PatientGuardianCreateWithoutClinicInput, Prisma.PatientGuardianUncheckedCreateWithoutClinicInput> | Prisma.PatientGuardianCreateWithoutClinicInput[] | Prisma.PatientGuardianUncheckedCreateWithoutClinicInput[];
    connectOrCreate?: Prisma.PatientGuardianCreateOrConnectWithoutClinicInput | Prisma.PatientGuardianCreateOrConnectWithoutClinicInput[];
    createMany?: Prisma.PatientGuardianCreateManyClinicInputEnvelope;
    connect?: Prisma.PatientGuardianWhereUniqueInput | Prisma.PatientGuardianWhereUniqueInput[];
};
export type PatientGuardianUpdateManyWithoutClinicNestedInput = {
    create?: Prisma.XOR<Prisma.PatientGuardianCreateWithoutClinicInput, Prisma.PatientGuardianUncheckedCreateWithoutClinicInput> | Prisma.PatientGuardianCreateWithoutClinicInput[] | Prisma.PatientGuardianUncheckedCreateWithoutClinicInput[];
    connectOrCreate?: Prisma.PatientGuardianCreateOrConnectWithoutClinicInput | Prisma.PatientGuardianCreateOrConnectWithoutClinicInput[];
    upsert?: Prisma.PatientGuardianUpsertWithWhereUniqueWithoutClinicInput | Prisma.PatientGuardianUpsertWithWhereUniqueWithoutClinicInput[];
    createMany?: Prisma.PatientGuardianCreateManyClinicInputEnvelope;
    set?: Prisma.PatientGuardianWhereUniqueInput | Prisma.PatientGuardianWhereUniqueInput[];
    disconnect?: Prisma.PatientGuardianWhereUniqueInput | Prisma.PatientGuardianWhereUniqueInput[];
    delete?: Prisma.PatientGuardianWhereUniqueInput | Prisma.PatientGuardianWhereUniqueInput[];
    connect?: Prisma.PatientGuardianWhereUniqueInput | Prisma.PatientGuardianWhereUniqueInput[];
    update?: Prisma.PatientGuardianUpdateWithWhereUniqueWithoutClinicInput | Prisma.PatientGuardianUpdateWithWhereUniqueWithoutClinicInput[];
    updateMany?: Prisma.PatientGuardianUpdateManyWithWhereWithoutClinicInput | Prisma.PatientGuardianUpdateManyWithWhereWithoutClinicInput[];
    deleteMany?: Prisma.PatientGuardianScalarWhereInput | Prisma.PatientGuardianScalarWhereInput[];
};
export type PatientGuardianUncheckedUpdateManyWithoutClinicNestedInput = {
    create?: Prisma.XOR<Prisma.PatientGuardianCreateWithoutClinicInput, Prisma.PatientGuardianUncheckedCreateWithoutClinicInput> | Prisma.PatientGuardianCreateWithoutClinicInput[] | Prisma.PatientGuardianUncheckedCreateWithoutClinicInput[];
    connectOrCreate?: Prisma.PatientGuardianCreateOrConnectWithoutClinicInput | Prisma.PatientGuardianCreateOrConnectWithoutClinicInput[];
    upsert?: Prisma.PatientGuardianUpsertWithWhereUniqueWithoutClinicInput | Prisma.PatientGuardianUpsertWithWhereUniqueWithoutClinicInput[];
    createMany?: Prisma.PatientGuardianCreateManyClinicInputEnvelope;
    set?: Prisma.PatientGuardianWhereUniqueInput | Prisma.PatientGuardianWhereUniqueInput[];
    disconnect?: Prisma.PatientGuardianWhereUniqueInput | Prisma.PatientGuardianWhereUniqueInput[];
    delete?: Prisma.PatientGuardianWhereUniqueInput | Prisma.PatientGuardianWhereUniqueInput[];
    connect?: Prisma.PatientGuardianWhereUniqueInput | Prisma.PatientGuardianWhereUniqueInput[];
    update?: Prisma.PatientGuardianUpdateWithWhereUniqueWithoutClinicInput | Prisma.PatientGuardianUpdateWithWhereUniqueWithoutClinicInput[];
    updateMany?: Prisma.PatientGuardianUpdateManyWithWhereWithoutClinicInput | Prisma.PatientGuardianUpdateManyWithWhereWithoutClinicInput[];
    deleteMany?: Prisma.PatientGuardianScalarWhereInput | Prisma.PatientGuardianScalarWhereInput[];
};
export type PatientGuardianCreateNestedManyWithoutOwnerInput = {
    create?: Prisma.XOR<Prisma.PatientGuardianCreateWithoutOwnerInput, Prisma.PatientGuardianUncheckedCreateWithoutOwnerInput> | Prisma.PatientGuardianCreateWithoutOwnerInput[] | Prisma.PatientGuardianUncheckedCreateWithoutOwnerInput[];
    connectOrCreate?: Prisma.PatientGuardianCreateOrConnectWithoutOwnerInput | Prisma.PatientGuardianCreateOrConnectWithoutOwnerInput[];
    createMany?: Prisma.PatientGuardianCreateManyOwnerInputEnvelope;
    connect?: Prisma.PatientGuardianWhereUniqueInput | Prisma.PatientGuardianWhereUniqueInput[];
};
export type PatientGuardianUncheckedCreateNestedManyWithoutOwnerInput = {
    create?: Prisma.XOR<Prisma.PatientGuardianCreateWithoutOwnerInput, Prisma.PatientGuardianUncheckedCreateWithoutOwnerInput> | Prisma.PatientGuardianCreateWithoutOwnerInput[] | Prisma.PatientGuardianUncheckedCreateWithoutOwnerInput[];
    connectOrCreate?: Prisma.PatientGuardianCreateOrConnectWithoutOwnerInput | Prisma.PatientGuardianCreateOrConnectWithoutOwnerInput[];
    createMany?: Prisma.PatientGuardianCreateManyOwnerInputEnvelope;
    connect?: Prisma.PatientGuardianWhereUniqueInput | Prisma.PatientGuardianWhereUniqueInput[];
};
export type PatientGuardianUpdateManyWithoutOwnerNestedInput = {
    create?: Prisma.XOR<Prisma.PatientGuardianCreateWithoutOwnerInput, Prisma.PatientGuardianUncheckedCreateWithoutOwnerInput> | Prisma.PatientGuardianCreateWithoutOwnerInput[] | Prisma.PatientGuardianUncheckedCreateWithoutOwnerInput[];
    connectOrCreate?: Prisma.PatientGuardianCreateOrConnectWithoutOwnerInput | Prisma.PatientGuardianCreateOrConnectWithoutOwnerInput[];
    upsert?: Prisma.PatientGuardianUpsertWithWhereUniqueWithoutOwnerInput | Prisma.PatientGuardianUpsertWithWhereUniqueWithoutOwnerInput[];
    createMany?: Prisma.PatientGuardianCreateManyOwnerInputEnvelope;
    set?: Prisma.PatientGuardianWhereUniqueInput | Prisma.PatientGuardianWhereUniqueInput[];
    disconnect?: Prisma.PatientGuardianWhereUniqueInput | Prisma.PatientGuardianWhereUniqueInput[];
    delete?: Prisma.PatientGuardianWhereUniqueInput | Prisma.PatientGuardianWhereUniqueInput[];
    connect?: Prisma.PatientGuardianWhereUniqueInput | Prisma.PatientGuardianWhereUniqueInput[];
    update?: Prisma.PatientGuardianUpdateWithWhereUniqueWithoutOwnerInput | Prisma.PatientGuardianUpdateWithWhereUniqueWithoutOwnerInput[];
    updateMany?: Prisma.PatientGuardianUpdateManyWithWhereWithoutOwnerInput | Prisma.PatientGuardianUpdateManyWithWhereWithoutOwnerInput[];
    deleteMany?: Prisma.PatientGuardianScalarWhereInput | Prisma.PatientGuardianScalarWhereInput[];
};
export type PatientGuardianUncheckedUpdateManyWithoutOwnerNestedInput = {
    create?: Prisma.XOR<Prisma.PatientGuardianCreateWithoutOwnerInput, Prisma.PatientGuardianUncheckedCreateWithoutOwnerInput> | Prisma.PatientGuardianCreateWithoutOwnerInput[] | Prisma.PatientGuardianUncheckedCreateWithoutOwnerInput[];
    connectOrCreate?: Prisma.PatientGuardianCreateOrConnectWithoutOwnerInput | Prisma.PatientGuardianCreateOrConnectWithoutOwnerInput[];
    upsert?: Prisma.PatientGuardianUpsertWithWhereUniqueWithoutOwnerInput | Prisma.PatientGuardianUpsertWithWhereUniqueWithoutOwnerInput[];
    createMany?: Prisma.PatientGuardianCreateManyOwnerInputEnvelope;
    set?: Prisma.PatientGuardianWhereUniqueInput | Prisma.PatientGuardianWhereUniqueInput[];
    disconnect?: Prisma.PatientGuardianWhereUniqueInput | Prisma.PatientGuardianWhereUniqueInput[];
    delete?: Prisma.PatientGuardianWhereUniqueInput | Prisma.PatientGuardianWhereUniqueInput[];
    connect?: Prisma.PatientGuardianWhereUniqueInput | Prisma.PatientGuardianWhereUniqueInput[];
    update?: Prisma.PatientGuardianUpdateWithWhereUniqueWithoutOwnerInput | Prisma.PatientGuardianUpdateWithWhereUniqueWithoutOwnerInput[];
    updateMany?: Prisma.PatientGuardianUpdateManyWithWhereWithoutOwnerInput | Prisma.PatientGuardianUpdateManyWithWhereWithoutOwnerInput[];
    deleteMany?: Prisma.PatientGuardianScalarWhereInput | Prisma.PatientGuardianScalarWhereInput[];
};
export type PatientGuardianCreateNestedManyWithoutPatientInput = {
    create?: Prisma.XOR<Prisma.PatientGuardianCreateWithoutPatientInput, Prisma.PatientGuardianUncheckedCreateWithoutPatientInput> | Prisma.PatientGuardianCreateWithoutPatientInput[] | Prisma.PatientGuardianUncheckedCreateWithoutPatientInput[];
    connectOrCreate?: Prisma.PatientGuardianCreateOrConnectWithoutPatientInput | Prisma.PatientGuardianCreateOrConnectWithoutPatientInput[];
    createMany?: Prisma.PatientGuardianCreateManyPatientInputEnvelope;
    connect?: Prisma.PatientGuardianWhereUniqueInput | Prisma.PatientGuardianWhereUniqueInput[];
};
export type PatientGuardianUncheckedCreateNestedManyWithoutPatientInput = {
    create?: Prisma.XOR<Prisma.PatientGuardianCreateWithoutPatientInput, Prisma.PatientGuardianUncheckedCreateWithoutPatientInput> | Prisma.PatientGuardianCreateWithoutPatientInput[] | Prisma.PatientGuardianUncheckedCreateWithoutPatientInput[];
    connectOrCreate?: Prisma.PatientGuardianCreateOrConnectWithoutPatientInput | Prisma.PatientGuardianCreateOrConnectWithoutPatientInput[];
    createMany?: Prisma.PatientGuardianCreateManyPatientInputEnvelope;
    connect?: Prisma.PatientGuardianWhereUniqueInput | Prisma.PatientGuardianWhereUniqueInput[];
};
export type PatientGuardianUpdateManyWithoutPatientNestedInput = {
    create?: Prisma.XOR<Prisma.PatientGuardianCreateWithoutPatientInput, Prisma.PatientGuardianUncheckedCreateWithoutPatientInput> | Prisma.PatientGuardianCreateWithoutPatientInput[] | Prisma.PatientGuardianUncheckedCreateWithoutPatientInput[];
    connectOrCreate?: Prisma.PatientGuardianCreateOrConnectWithoutPatientInput | Prisma.PatientGuardianCreateOrConnectWithoutPatientInput[];
    upsert?: Prisma.PatientGuardianUpsertWithWhereUniqueWithoutPatientInput | Prisma.PatientGuardianUpsertWithWhereUniqueWithoutPatientInput[];
    createMany?: Prisma.PatientGuardianCreateManyPatientInputEnvelope;
    set?: Prisma.PatientGuardianWhereUniqueInput | Prisma.PatientGuardianWhereUniqueInput[];
    disconnect?: Prisma.PatientGuardianWhereUniqueInput | Prisma.PatientGuardianWhereUniqueInput[];
    delete?: Prisma.PatientGuardianWhereUniqueInput | Prisma.PatientGuardianWhereUniqueInput[];
    connect?: Prisma.PatientGuardianWhereUniqueInput | Prisma.PatientGuardianWhereUniqueInput[];
    update?: Prisma.PatientGuardianUpdateWithWhereUniqueWithoutPatientInput | Prisma.PatientGuardianUpdateWithWhereUniqueWithoutPatientInput[];
    updateMany?: Prisma.PatientGuardianUpdateManyWithWhereWithoutPatientInput | Prisma.PatientGuardianUpdateManyWithWhereWithoutPatientInput[];
    deleteMany?: Prisma.PatientGuardianScalarWhereInput | Prisma.PatientGuardianScalarWhereInput[];
};
export type PatientGuardianUncheckedUpdateManyWithoutPatientNestedInput = {
    create?: Prisma.XOR<Prisma.PatientGuardianCreateWithoutPatientInput, Prisma.PatientGuardianUncheckedCreateWithoutPatientInput> | Prisma.PatientGuardianCreateWithoutPatientInput[] | Prisma.PatientGuardianUncheckedCreateWithoutPatientInput[];
    connectOrCreate?: Prisma.PatientGuardianCreateOrConnectWithoutPatientInput | Prisma.PatientGuardianCreateOrConnectWithoutPatientInput[];
    upsert?: Prisma.PatientGuardianUpsertWithWhereUniqueWithoutPatientInput | Prisma.PatientGuardianUpsertWithWhereUniqueWithoutPatientInput[];
    createMany?: Prisma.PatientGuardianCreateManyPatientInputEnvelope;
    set?: Prisma.PatientGuardianWhereUniqueInput | Prisma.PatientGuardianWhereUniqueInput[];
    disconnect?: Prisma.PatientGuardianWhereUniqueInput | Prisma.PatientGuardianWhereUniqueInput[];
    delete?: Prisma.PatientGuardianWhereUniqueInput | Prisma.PatientGuardianWhereUniqueInput[];
    connect?: Prisma.PatientGuardianWhereUniqueInput | Prisma.PatientGuardianWhereUniqueInput[];
    update?: Prisma.PatientGuardianUpdateWithWhereUniqueWithoutPatientInput | Prisma.PatientGuardianUpdateWithWhereUniqueWithoutPatientInput[];
    updateMany?: Prisma.PatientGuardianUpdateManyWithWhereWithoutPatientInput | Prisma.PatientGuardianUpdateManyWithWhereWithoutPatientInput[];
    deleteMany?: Prisma.PatientGuardianScalarWhereInput | Prisma.PatientGuardianScalarWhereInput[];
};
export type PatientGuardianCreateWithoutClinicInput = {
    id?: string;
    relationship?: string | null;
    createdAt?: Date | string;
    patient: Prisma.PatientCreateNestedOneWithoutGuardiansInput;
    owner: Prisma.OwnerCreateNestedOneWithoutGuardianPatientsInput;
};
export type PatientGuardianUncheckedCreateWithoutClinicInput = {
    id?: string;
    patientId: string;
    ownerId: string;
    relationship?: string | null;
    createdAt?: Date | string;
};
export type PatientGuardianCreateOrConnectWithoutClinicInput = {
    where: Prisma.PatientGuardianWhereUniqueInput;
    create: Prisma.XOR<Prisma.PatientGuardianCreateWithoutClinicInput, Prisma.PatientGuardianUncheckedCreateWithoutClinicInput>;
};
export type PatientGuardianCreateManyClinicInputEnvelope = {
    data: Prisma.PatientGuardianCreateManyClinicInput | Prisma.PatientGuardianCreateManyClinicInput[];
    skipDuplicates?: boolean;
};
export type PatientGuardianUpsertWithWhereUniqueWithoutClinicInput = {
    where: Prisma.PatientGuardianWhereUniqueInput;
    update: Prisma.XOR<Prisma.PatientGuardianUpdateWithoutClinicInput, Prisma.PatientGuardianUncheckedUpdateWithoutClinicInput>;
    create: Prisma.XOR<Prisma.PatientGuardianCreateWithoutClinicInput, Prisma.PatientGuardianUncheckedCreateWithoutClinicInput>;
};
export type PatientGuardianUpdateWithWhereUniqueWithoutClinicInput = {
    where: Prisma.PatientGuardianWhereUniqueInput;
    data: Prisma.XOR<Prisma.PatientGuardianUpdateWithoutClinicInput, Prisma.PatientGuardianUncheckedUpdateWithoutClinicInput>;
};
export type PatientGuardianUpdateManyWithWhereWithoutClinicInput = {
    where: Prisma.PatientGuardianScalarWhereInput;
    data: Prisma.XOR<Prisma.PatientGuardianUpdateManyMutationInput, Prisma.PatientGuardianUncheckedUpdateManyWithoutClinicInput>;
};
export type PatientGuardianScalarWhereInput = {
    AND?: Prisma.PatientGuardianScalarWhereInput | Prisma.PatientGuardianScalarWhereInput[];
    OR?: Prisma.PatientGuardianScalarWhereInput[];
    NOT?: Prisma.PatientGuardianScalarWhereInput | Prisma.PatientGuardianScalarWhereInput[];
    id?: Prisma.StringFilter<"PatientGuardian"> | string;
    clinicId?: Prisma.StringFilter<"PatientGuardian"> | string;
    patientId?: Prisma.StringFilter<"PatientGuardian"> | string;
    ownerId?: Prisma.StringFilter<"PatientGuardian"> | string;
    relationship?: Prisma.StringNullableFilter<"PatientGuardian"> | string | null;
    createdAt?: Prisma.DateTimeFilter<"PatientGuardian"> | Date | string;
};
export type PatientGuardianCreateWithoutOwnerInput = {
    id?: string;
    relationship?: string | null;
    createdAt?: Date | string;
    clinic: Prisma.ClinicCreateNestedOneWithoutPatientGuardiansInput;
    patient: Prisma.PatientCreateNestedOneWithoutGuardiansInput;
};
export type PatientGuardianUncheckedCreateWithoutOwnerInput = {
    id?: string;
    clinicId: string;
    patientId: string;
    relationship?: string | null;
    createdAt?: Date | string;
};
export type PatientGuardianCreateOrConnectWithoutOwnerInput = {
    where: Prisma.PatientGuardianWhereUniqueInput;
    create: Prisma.XOR<Prisma.PatientGuardianCreateWithoutOwnerInput, Prisma.PatientGuardianUncheckedCreateWithoutOwnerInput>;
};
export type PatientGuardianCreateManyOwnerInputEnvelope = {
    data: Prisma.PatientGuardianCreateManyOwnerInput | Prisma.PatientGuardianCreateManyOwnerInput[];
    skipDuplicates?: boolean;
};
export type PatientGuardianUpsertWithWhereUniqueWithoutOwnerInput = {
    where: Prisma.PatientGuardianWhereUniqueInput;
    update: Prisma.XOR<Prisma.PatientGuardianUpdateWithoutOwnerInput, Prisma.PatientGuardianUncheckedUpdateWithoutOwnerInput>;
    create: Prisma.XOR<Prisma.PatientGuardianCreateWithoutOwnerInput, Prisma.PatientGuardianUncheckedCreateWithoutOwnerInput>;
};
export type PatientGuardianUpdateWithWhereUniqueWithoutOwnerInput = {
    where: Prisma.PatientGuardianWhereUniqueInput;
    data: Prisma.XOR<Prisma.PatientGuardianUpdateWithoutOwnerInput, Prisma.PatientGuardianUncheckedUpdateWithoutOwnerInput>;
};
export type PatientGuardianUpdateManyWithWhereWithoutOwnerInput = {
    where: Prisma.PatientGuardianScalarWhereInput;
    data: Prisma.XOR<Prisma.PatientGuardianUpdateManyMutationInput, Prisma.PatientGuardianUncheckedUpdateManyWithoutOwnerInput>;
};
export type PatientGuardianCreateWithoutPatientInput = {
    id?: string;
    relationship?: string | null;
    createdAt?: Date | string;
    clinic: Prisma.ClinicCreateNestedOneWithoutPatientGuardiansInput;
    owner: Prisma.OwnerCreateNestedOneWithoutGuardianPatientsInput;
};
export type PatientGuardianUncheckedCreateWithoutPatientInput = {
    id?: string;
    clinicId: string;
    ownerId: string;
    relationship?: string | null;
    createdAt?: Date | string;
};
export type PatientGuardianCreateOrConnectWithoutPatientInput = {
    where: Prisma.PatientGuardianWhereUniqueInput;
    create: Prisma.XOR<Prisma.PatientGuardianCreateWithoutPatientInput, Prisma.PatientGuardianUncheckedCreateWithoutPatientInput>;
};
export type PatientGuardianCreateManyPatientInputEnvelope = {
    data: Prisma.PatientGuardianCreateManyPatientInput | Prisma.PatientGuardianCreateManyPatientInput[];
    skipDuplicates?: boolean;
};
export type PatientGuardianUpsertWithWhereUniqueWithoutPatientInput = {
    where: Prisma.PatientGuardianWhereUniqueInput;
    update: Prisma.XOR<Prisma.PatientGuardianUpdateWithoutPatientInput, Prisma.PatientGuardianUncheckedUpdateWithoutPatientInput>;
    create: Prisma.XOR<Prisma.PatientGuardianCreateWithoutPatientInput, Prisma.PatientGuardianUncheckedCreateWithoutPatientInput>;
};
export type PatientGuardianUpdateWithWhereUniqueWithoutPatientInput = {
    where: Prisma.PatientGuardianWhereUniqueInput;
    data: Prisma.XOR<Prisma.PatientGuardianUpdateWithoutPatientInput, Prisma.PatientGuardianUncheckedUpdateWithoutPatientInput>;
};
export type PatientGuardianUpdateManyWithWhereWithoutPatientInput = {
    where: Prisma.PatientGuardianScalarWhereInput;
    data: Prisma.XOR<Prisma.PatientGuardianUpdateManyMutationInput, Prisma.PatientGuardianUncheckedUpdateManyWithoutPatientInput>;
};
export type PatientGuardianCreateManyClinicInput = {
    id?: string;
    patientId: string;
    ownerId: string;
    relationship?: string | null;
    createdAt?: Date | string;
};
export type PatientGuardianUpdateWithoutClinicInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    relationship?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    patient?: Prisma.PatientUpdateOneRequiredWithoutGuardiansNestedInput;
    owner?: Prisma.OwnerUpdateOneRequiredWithoutGuardianPatientsNestedInput;
};
export type PatientGuardianUncheckedUpdateWithoutClinicInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    patientId?: Prisma.StringFieldUpdateOperationsInput | string;
    ownerId?: Prisma.StringFieldUpdateOperationsInput | string;
    relationship?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type PatientGuardianUncheckedUpdateManyWithoutClinicInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    patientId?: Prisma.StringFieldUpdateOperationsInput | string;
    ownerId?: Prisma.StringFieldUpdateOperationsInput | string;
    relationship?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type PatientGuardianCreateManyOwnerInput = {
    id?: string;
    clinicId: string;
    patientId: string;
    relationship?: string | null;
    createdAt?: Date | string;
};
export type PatientGuardianUpdateWithoutOwnerInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    relationship?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    clinic?: Prisma.ClinicUpdateOneRequiredWithoutPatientGuardiansNestedInput;
    patient?: Prisma.PatientUpdateOneRequiredWithoutGuardiansNestedInput;
};
export type PatientGuardianUncheckedUpdateWithoutOwnerInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    clinicId?: Prisma.StringFieldUpdateOperationsInput | string;
    patientId?: Prisma.StringFieldUpdateOperationsInput | string;
    relationship?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type PatientGuardianUncheckedUpdateManyWithoutOwnerInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    clinicId?: Prisma.StringFieldUpdateOperationsInput | string;
    patientId?: Prisma.StringFieldUpdateOperationsInput | string;
    relationship?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type PatientGuardianCreateManyPatientInput = {
    id?: string;
    clinicId: string;
    ownerId: string;
    relationship?: string | null;
    createdAt?: Date | string;
};
export type PatientGuardianUpdateWithoutPatientInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    relationship?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    clinic?: Prisma.ClinicUpdateOneRequiredWithoutPatientGuardiansNestedInput;
    owner?: Prisma.OwnerUpdateOneRequiredWithoutGuardianPatientsNestedInput;
};
export type PatientGuardianUncheckedUpdateWithoutPatientInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    clinicId?: Prisma.StringFieldUpdateOperationsInput | string;
    ownerId?: Prisma.StringFieldUpdateOperationsInput | string;
    relationship?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type PatientGuardianUncheckedUpdateManyWithoutPatientInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    clinicId?: Prisma.StringFieldUpdateOperationsInput | string;
    ownerId?: Prisma.StringFieldUpdateOperationsInput | string;
    relationship?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type PatientGuardianSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    clinicId?: boolean;
    patientId?: boolean;
    ownerId?: boolean;
    relationship?: boolean;
    createdAt?: boolean;
    clinic?: boolean | Prisma.ClinicDefaultArgs<ExtArgs>;
    patient?: boolean | Prisma.PatientDefaultArgs<ExtArgs>;
    owner?: boolean | Prisma.OwnerDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["patientGuardian"]>;
export type PatientGuardianSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    clinicId?: boolean;
    patientId?: boolean;
    ownerId?: boolean;
    relationship?: boolean;
    createdAt?: boolean;
    clinic?: boolean | Prisma.ClinicDefaultArgs<ExtArgs>;
    patient?: boolean | Prisma.PatientDefaultArgs<ExtArgs>;
    owner?: boolean | Prisma.OwnerDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["patientGuardian"]>;
export type PatientGuardianSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    clinicId?: boolean;
    patientId?: boolean;
    ownerId?: boolean;
    relationship?: boolean;
    createdAt?: boolean;
    clinic?: boolean | Prisma.ClinicDefaultArgs<ExtArgs>;
    patient?: boolean | Prisma.PatientDefaultArgs<ExtArgs>;
    owner?: boolean | Prisma.OwnerDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["patientGuardian"]>;
export type PatientGuardianSelectScalar = {
    id?: boolean;
    clinicId?: boolean;
    patientId?: boolean;
    ownerId?: boolean;
    relationship?: boolean;
    createdAt?: boolean;
};
export type PatientGuardianOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "clinicId" | "patientId" | "ownerId" | "relationship" | "createdAt", ExtArgs["result"]["patientGuardian"]>;
export type PatientGuardianInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    clinic?: boolean | Prisma.ClinicDefaultArgs<ExtArgs>;
    patient?: boolean | Prisma.PatientDefaultArgs<ExtArgs>;
    owner?: boolean | Prisma.OwnerDefaultArgs<ExtArgs>;
};
export type PatientGuardianIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    clinic?: boolean | Prisma.ClinicDefaultArgs<ExtArgs>;
    patient?: boolean | Prisma.PatientDefaultArgs<ExtArgs>;
    owner?: boolean | Prisma.OwnerDefaultArgs<ExtArgs>;
};
export type PatientGuardianIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    clinic?: boolean | Prisma.ClinicDefaultArgs<ExtArgs>;
    patient?: boolean | Prisma.PatientDefaultArgs<ExtArgs>;
    owner?: boolean | Prisma.OwnerDefaultArgs<ExtArgs>;
};
export type $PatientGuardianPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "PatientGuardian";
    objects: {
        clinic: Prisma.$ClinicPayload<ExtArgs>;
        patient: Prisma.$PatientPayload<ExtArgs>;
        owner: Prisma.$OwnerPayload<ExtArgs>;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        clinicId: string;
        patientId: string;
        ownerId: string;
        relationship: string | null;
        createdAt: Date;
    }, ExtArgs["result"]["patientGuardian"]>;
    composites: {};
};
export type PatientGuardianGetPayload<S extends boolean | null | undefined | PatientGuardianDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$PatientGuardianPayload, S>;
export type PatientGuardianCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<PatientGuardianFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: PatientGuardianCountAggregateInputType | true;
};
export interface PatientGuardianDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['PatientGuardian'];
        meta: {
            name: 'PatientGuardian';
        };
    };
    /**
     * Find zero or one PatientGuardian that matches the filter.
     * @param {PatientGuardianFindUniqueArgs} args - Arguments to find a PatientGuardian
     * @example
     * // Get one PatientGuardian
     * const patientGuardian = await prisma.patientGuardian.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends PatientGuardianFindUniqueArgs>(args: Prisma.SelectSubset<T, PatientGuardianFindUniqueArgs<ExtArgs>>): Prisma.Prisma__PatientGuardianClient<runtime.Types.Result.GetResult<Prisma.$PatientGuardianPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    /**
     * Find one PatientGuardian that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {PatientGuardianFindUniqueOrThrowArgs} args - Arguments to find a PatientGuardian
     * @example
     * // Get one PatientGuardian
     * const patientGuardian = await prisma.patientGuardian.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends PatientGuardianFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, PatientGuardianFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__PatientGuardianClient<runtime.Types.Result.GetResult<Prisma.$PatientGuardianPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Find the first PatientGuardian that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PatientGuardianFindFirstArgs} args - Arguments to find a PatientGuardian
     * @example
     * // Get one PatientGuardian
     * const patientGuardian = await prisma.patientGuardian.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends PatientGuardianFindFirstArgs>(args?: Prisma.SelectSubset<T, PatientGuardianFindFirstArgs<ExtArgs>>): Prisma.Prisma__PatientGuardianClient<runtime.Types.Result.GetResult<Prisma.$PatientGuardianPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    /**
     * Find the first PatientGuardian that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PatientGuardianFindFirstOrThrowArgs} args - Arguments to find a PatientGuardian
     * @example
     * // Get one PatientGuardian
     * const patientGuardian = await prisma.patientGuardian.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends PatientGuardianFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, PatientGuardianFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__PatientGuardianClient<runtime.Types.Result.GetResult<Prisma.$PatientGuardianPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Find zero or more PatientGuardians that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PatientGuardianFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all PatientGuardians
     * const patientGuardians = await prisma.patientGuardian.findMany()
     *
     * // Get first 10 PatientGuardians
     * const patientGuardians = await prisma.patientGuardian.findMany({ take: 10 })
     *
     * // Only select the `id`
     * const patientGuardianWithIdOnly = await prisma.patientGuardian.findMany({ select: { id: true } })
     *
     */
    findMany<T extends PatientGuardianFindManyArgs>(args?: Prisma.SelectSubset<T, PatientGuardianFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$PatientGuardianPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    /**
     * Create a PatientGuardian.
     * @param {PatientGuardianCreateArgs} args - Arguments to create a PatientGuardian.
     * @example
     * // Create one PatientGuardian
     * const PatientGuardian = await prisma.patientGuardian.create({
     *   data: {
     *     // ... data to create a PatientGuardian
     *   }
     * })
     *
     */
    create<T extends PatientGuardianCreateArgs>(args: Prisma.SelectSubset<T, PatientGuardianCreateArgs<ExtArgs>>): Prisma.Prisma__PatientGuardianClient<runtime.Types.Result.GetResult<Prisma.$PatientGuardianPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Create many PatientGuardians.
     * @param {PatientGuardianCreateManyArgs} args - Arguments to create many PatientGuardians.
     * @example
     * // Create many PatientGuardians
     * const patientGuardian = await prisma.patientGuardian.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     */
    createMany<T extends PatientGuardianCreateManyArgs>(args?: Prisma.SelectSubset<T, PatientGuardianCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Create many PatientGuardians and returns the data saved in the database.
     * @param {PatientGuardianCreateManyAndReturnArgs} args - Arguments to create many PatientGuardians.
     * @example
     * // Create many PatientGuardians
     * const patientGuardian = await prisma.patientGuardian.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Create many PatientGuardians and only return the `id`
     * const patientGuardianWithIdOnly = await prisma.patientGuardian.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    createManyAndReturn<T extends PatientGuardianCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, PatientGuardianCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$PatientGuardianPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    /**
     * Delete a PatientGuardian.
     * @param {PatientGuardianDeleteArgs} args - Arguments to delete one PatientGuardian.
     * @example
     * // Delete one PatientGuardian
     * const PatientGuardian = await prisma.patientGuardian.delete({
     *   where: {
     *     // ... filter to delete one PatientGuardian
     *   }
     * })
     *
     */
    delete<T extends PatientGuardianDeleteArgs>(args: Prisma.SelectSubset<T, PatientGuardianDeleteArgs<ExtArgs>>): Prisma.Prisma__PatientGuardianClient<runtime.Types.Result.GetResult<Prisma.$PatientGuardianPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Update one PatientGuardian.
     * @param {PatientGuardianUpdateArgs} args - Arguments to update one PatientGuardian.
     * @example
     * // Update one PatientGuardian
     * const patientGuardian = await prisma.patientGuardian.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    update<T extends PatientGuardianUpdateArgs>(args: Prisma.SelectSubset<T, PatientGuardianUpdateArgs<ExtArgs>>): Prisma.Prisma__PatientGuardianClient<runtime.Types.Result.GetResult<Prisma.$PatientGuardianPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Delete zero or more PatientGuardians.
     * @param {PatientGuardianDeleteManyArgs} args - Arguments to filter PatientGuardians to delete.
     * @example
     * // Delete a few PatientGuardians
     * const { count } = await prisma.patientGuardian.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     */
    deleteMany<T extends PatientGuardianDeleteManyArgs>(args?: Prisma.SelectSubset<T, PatientGuardianDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Update zero or more PatientGuardians.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PatientGuardianUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many PatientGuardians
     * const patientGuardian = await prisma.patientGuardian.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    updateMany<T extends PatientGuardianUpdateManyArgs>(args: Prisma.SelectSubset<T, PatientGuardianUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Update zero or more PatientGuardians and returns the data updated in the database.
     * @param {PatientGuardianUpdateManyAndReturnArgs} args - Arguments to update many PatientGuardians.
     * @example
     * // Update many PatientGuardians
     * const patientGuardian = await prisma.patientGuardian.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Update zero or more PatientGuardians and only return the `id`
     * const patientGuardianWithIdOnly = await prisma.patientGuardian.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    updateManyAndReturn<T extends PatientGuardianUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, PatientGuardianUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$PatientGuardianPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    /**
     * Create or update one PatientGuardian.
     * @param {PatientGuardianUpsertArgs} args - Arguments to update or create a PatientGuardian.
     * @example
     * // Update or create a PatientGuardian
     * const patientGuardian = await prisma.patientGuardian.upsert({
     *   create: {
     *     // ... data to create a PatientGuardian
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the PatientGuardian we want to update
     *   }
     * })
     */
    upsert<T extends PatientGuardianUpsertArgs>(args: Prisma.SelectSubset<T, PatientGuardianUpsertArgs<ExtArgs>>): Prisma.Prisma__PatientGuardianClient<runtime.Types.Result.GetResult<Prisma.$PatientGuardianPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Count the number of PatientGuardians.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PatientGuardianCountArgs} args - Arguments to filter PatientGuardians to count.
     * @example
     * // Count the number of PatientGuardians
     * const count = await prisma.patientGuardian.count({
     *   where: {
     *     // ... the filter for the PatientGuardians we want to count
     *   }
     * })
    **/
    count<T extends PatientGuardianCountArgs>(args?: Prisma.Subset<T, PatientGuardianCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], PatientGuardianCountAggregateOutputType> : number>;
    /**
     * Allows you to perform aggregations operations on a PatientGuardian.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PatientGuardianAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends PatientGuardianAggregateArgs>(args: Prisma.Subset<T, PatientGuardianAggregateArgs>): Prisma.PrismaPromise<GetPatientGuardianAggregateType<T>>;
    /**
     * Group by PatientGuardian.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PatientGuardianGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     *
    **/
    groupBy<T extends PatientGuardianGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: PatientGuardianGroupByArgs['orderBy'];
    } : {
        orderBy?: PatientGuardianGroupByArgs['orderBy'];
    }, OrderFields extends Prisma.ExcludeUnderscoreKeys<Prisma.Keys<Prisma.MaybeTupleToUnion<T['orderBy']>>>, ByFields extends Prisma.MaybeTupleToUnion<T['by']>, ByValid extends Prisma.Has<ByFields, OrderFields>, HavingFields extends Prisma.GetHavingFields<T['having']>, HavingValid extends Prisma.Has<ByFields, HavingFields>, ByEmpty extends T['by'] extends never[] ? Prisma.True : Prisma.False, InputErrors extends ByEmpty extends Prisma.True ? `Error: "by" must not be empty.` : HavingValid extends Prisma.False ? {
        [P in HavingFields]: P extends ByFields ? never : P extends string ? `Error: Field "${P}" used in "having" needs to be provided in "by".` : [
            Error,
            'Field ',
            P,
            ` in "having" needs to be provided in "by"`
        ];
    }[HavingFields] : 'take' extends Prisma.Keys<T> ? 'orderBy' extends Prisma.Keys<T> ? ByValid extends Prisma.True ? {} : {
        [P in OrderFields]: P extends ByFields ? never : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
    }[OrderFields] : 'Error: If you provide "take", you also need to provide "orderBy"' : 'skip' extends Prisma.Keys<T> ? 'orderBy' extends Prisma.Keys<T> ? ByValid extends Prisma.True ? {} : {
        [P in OrderFields]: P extends ByFields ? never : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
    }[OrderFields] : 'Error: If you provide "skip", you also need to provide "orderBy"' : ByValid extends Prisma.True ? {} : {
        [P in OrderFields]: P extends ByFields ? never : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, PatientGuardianGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPatientGuardianGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    /**
     * Fields of the PatientGuardian model
     */
    readonly fields: PatientGuardianFieldRefs;
}
/**
 * The delegate class that acts as a "Promise-like" for PatientGuardian.
 * Why is this prefixed with `Prisma__`?
 * Because we want to prevent naming conflicts as mentioned in
 * https://github.com/prisma/prisma-client-js/issues/707
 */
export interface Prisma__PatientGuardianClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    clinic<T extends Prisma.ClinicDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.ClinicDefaultArgs<ExtArgs>>): Prisma.Prisma__ClinicClient<runtime.Types.Result.GetResult<Prisma.$ClinicPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    patient<T extends Prisma.PatientDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.PatientDefaultArgs<ExtArgs>>): Prisma.Prisma__PatientClient<runtime.Types.Result.GetResult<Prisma.$PatientPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    owner<T extends Prisma.OwnerDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.OwnerDefaultArgs<ExtArgs>>): Prisma.Prisma__OwnerClient<runtime.Types.Result.GetResult<Prisma.$OwnerPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
/**
 * Fields of the PatientGuardian model
 */
export interface PatientGuardianFieldRefs {
    readonly id: Prisma.FieldRef<"PatientGuardian", 'String'>;
    readonly clinicId: Prisma.FieldRef<"PatientGuardian", 'String'>;
    readonly patientId: Prisma.FieldRef<"PatientGuardian", 'String'>;
    readonly ownerId: Prisma.FieldRef<"PatientGuardian", 'String'>;
    readonly relationship: Prisma.FieldRef<"PatientGuardian", 'String'>;
    readonly createdAt: Prisma.FieldRef<"PatientGuardian", 'DateTime'>;
}
/**
 * PatientGuardian findUnique
 */
export type PatientGuardianFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PatientGuardian
     */
    select?: Prisma.PatientGuardianSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the PatientGuardian
     */
    omit?: Prisma.PatientGuardianOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.PatientGuardianInclude<ExtArgs> | null;
    /**
     * Filter, which PatientGuardian to fetch.
     */
    where: Prisma.PatientGuardianWhereUniqueInput;
};
/**
 * PatientGuardian findUniqueOrThrow
 */
export type PatientGuardianFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PatientGuardian
     */
    select?: Prisma.PatientGuardianSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the PatientGuardian
     */
    omit?: Prisma.PatientGuardianOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.PatientGuardianInclude<ExtArgs> | null;
    /**
     * Filter, which PatientGuardian to fetch.
     */
    where: Prisma.PatientGuardianWhereUniqueInput;
};
/**
 * PatientGuardian findFirst
 */
export type PatientGuardianFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PatientGuardian
     */
    select?: Prisma.PatientGuardianSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the PatientGuardian
     */
    omit?: Prisma.PatientGuardianOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.PatientGuardianInclude<ExtArgs> | null;
    /**
     * Filter, which PatientGuardian to fetch.
     */
    where?: Prisma.PatientGuardianWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of PatientGuardians to fetch.
     */
    orderBy?: Prisma.PatientGuardianOrderByWithRelationInput | Prisma.PatientGuardianOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for PatientGuardians.
     */
    cursor?: Prisma.PatientGuardianWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` PatientGuardians from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` PatientGuardians.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of PatientGuardians.
     */
    distinct?: Prisma.PatientGuardianScalarFieldEnum | Prisma.PatientGuardianScalarFieldEnum[];
};
/**
 * PatientGuardian findFirstOrThrow
 */
export type PatientGuardianFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PatientGuardian
     */
    select?: Prisma.PatientGuardianSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the PatientGuardian
     */
    omit?: Prisma.PatientGuardianOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.PatientGuardianInclude<ExtArgs> | null;
    /**
     * Filter, which PatientGuardian to fetch.
     */
    where?: Prisma.PatientGuardianWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of PatientGuardians to fetch.
     */
    orderBy?: Prisma.PatientGuardianOrderByWithRelationInput | Prisma.PatientGuardianOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for PatientGuardians.
     */
    cursor?: Prisma.PatientGuardianWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` PatientGuardians from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` PatientGuardians.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of PatientGuardians.
     */
    distinct?: Prisma.PatientGuardianScalarFieldEnum | Prisma.PatientGuardianScalarFieldEnum[];
};
/**
 * PatientGuardian findMany
 */
export type PatientGuardianFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PatientGuardian
     */
    select?: Prisma.PatientGuardianSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the PatientGuardian
     */
    omit?: Prisma.PatientGuardianOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.PatientGuardianInclude<ExtArgs> | null;
    /**
     * Filter, which PatientGuardians to fetch.
     */
    where?: Prisma.PatientGuardianWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of PatientGuardians to fetch.
     */
    orderBy?: Prisma.PatientGuardianOrderByWithRelationInput | Prisma.PatientGuardianOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing PatientGuardians.
     */
    cursor?: Prisma.PatientGuardianWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` PatientGuardians from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` PatientGuardians.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of PatientGuardians.
     */
    distinct?: Prisma.PatientGuardianScalarFieldEnum | Prisma.PatientGuardianScalarFieldEnum[];
};
/**
 * PatientGuardian create
 */
export type PatientGuardianCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PatientGuardian
     */
    select?: Prisma.PatientGuardianSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the PatientGuardian
     */
    omit?: Prisma.PatientGuardianOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.PatientGuardianInclude<ExtArgs> | null;
    /**
     * The data needed to create a PatientGuardian.
     */
    data: Prisma.XOR<Prisma.PatientGuardianCreateInput, Prisma.PatientGuardianUncheckedCreateInput>;
};
/**
 * PatientGuardian createMany
 */
export type PatientGuardianCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * The data used to create many PatientGuardians.
     */
    data: Prisma.PatientGuardianCreateManyInput | Prisma.PatientGuardianCreateManyInput[];
    skipDuplicates?: boolean;
};
/**
 * PatientGuardian createManyAndReturn
 */
export type PatientGuardianCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PatientGuardian
     */
    select?: Prisma.PatientGuardianSelectCreateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the PatientGuardian
     */
    omit?: Prisma.PatientGuardianOmit<ExtArgs> | null;
    /**
     * The data used to create many PatientGuardians.
     */
    data: Prisma.PatientGuardianCreateManyInput | Prisma.PatientGuardianCreateManyInput[];
    skipDuplicates?: boolean;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.PatientGuardianIncludeCreateManyAndReturn<ExtArgs> | null;
};
/**
 * PatientGuardian update
 */
export type PatientGuardianUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PatientGuardian
     */
    select?: Prisma.PatientGuardianSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the PatientGuardian
     */
    omit?: Prisma.PatientGuardianOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.PatientGuardianInclude<ExtArgs> | null;
    /**
     * The data needed to update a PatientGuardian.
     */
    data: Prisma.XOR<Prisma.PatientGuardianUpdateInput, Prisma.PatientGuardianUncheckedUpdateInput>;
    /**
     * Choose, which PatientGuardian to update.
     */
    where: Prisma.PatientGuardianWhereUniqueInput;
};
/**
 * PatientGuardian updateMany
 */
export type PatientGuardianUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * The data used to update PatientGuardians.
     */
    data: Prisma.XOR<Prisma.PatientGuardianUpdateManyMutationInput, Prisma.PatientGuardianUncheckedUpdateManyInput>;
    /**
     * Filter which PatientGuardians to update
     */
    where?: Prisma.PatientGuardianWhereInput;
    /**
     * Limit how many PatientGuardians to update.
     */
    limit?: number;
};
/**
 * PatientGuardian updateManyAndReturn
 */
export type PatientGuardianUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PatientGuardian
     */
    select?: Prisma.PatientGuardianSelectUpdateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the PatientGuardian
     */
    omit?: Prisma.PatientGuardianOmit<ExtArgs> | null;
    /**
     * The data used to update PatientGuardians.
     */
    data: Prisma.XOR<Prisma.PatientGuardianUpdateManyMutationInput, Prisma.PatientGuardianUncheckedUpdateManyInput>;
    /**
     * Filter which PatientGuardians to update
     */
    where?: Prisma.PatientGuardianWhereInput;
    /**
     * Limit how many PatientGuardians to update.
     */
    limit?: number;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.PatientGuardianIncludeUpdateManyAndReturn<ExtArgs> | null;
};
/**
 * PatientGuardian upsert
 */
export type PatientGuardianUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PatientGuardian
     */
    select?: Prisma.PatientGuardianSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the PatientGuardian
     */
    omit?: Prisma.PatientGuardianOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.PatientGuardianInclude<ExtArgs> | null;
    /**
     * The filter to search for the PatientGuardian to update in case it exists.
     */
    where: Prisma.PatientGuardianWhereUniqueInput;
    /**
     * In case the PatientGuardian found by the `where` argument doesn't exist, create a new PatientGuardian with this data.
     */
    create: Prisma.XOR<Prisma.PatientGuardianCreateInput, Prisma.PatientGuardianUncheckedCreateInput>;
    /**
     * In case the PatientGuardian was found with the provided `where` argument, update it with this data.
     */
    update: Prisma.XOR<Prisma.PatientGuardianUpdateInput, Prisma.PatientGuardianUncheckedUpdateInput>;
};
/**
 * PatientGuardian delete
 */
export type PatientGuardianDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PatientGuardian
     */
    select?: Prisma.PatientGuardianSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the PatientGuardian
     */
    omit?: Prisma.PatientGuardianOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.PatientGuardianInclude<ExtArgs> | null;
    /**
     * Filter which PatientGuardian to delete.
     */
    where: Prisma.PatientGuardianWhereUniqueInput;
};
/**
 * PatientGuardian deleteMany
 */
export type PatientGuardianDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Filter which PatientGuardians to delete
     */
    where?: Prisma.PatientGuardianWhereInput;
    /**
     * Limit how many PatientGuardians to delete.
     */
    limit?: number;
};
/**
 * PatientGuardian without action
 */
export type PatientGuardianDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PatientGuardian
     */
    select?: Prisma.PatientGuardianSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the PatientGuardian
     */
    omit?: Prisma.PatientGuardianOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.PatientGuardianInclude<ExtArgs> | null;
};
