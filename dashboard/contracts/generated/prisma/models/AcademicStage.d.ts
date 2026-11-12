import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace";
/**
 * Model AcademicStage
 *
 */
export type AcademicStageModel = runtime.Types.Result.DefaultSelection<Prisma.$AcademicStagePayload>;
export type AggregateAcademicStage = {
    _count: AcademicStageCountAggregateOutputType | null;
    _avg: AcademicStageAvgAggregateOutputType | null;
    _sum: AcademicStageSumAggregateOutputType | null;
    _min: AcademicStageMinAggregateOutputType | null;
    _max: AcademicStageMaxAggregateOutputType | null;
};
export type AcademicStageAvgAggregateOutputType = {
    sortOrder: number | null;
};
export type AcademicStageSumAggregateOutputType = {
    sortOrder: number | null;
};
export type AcademicStageMinAggregateOutputType = {
    id: string | null;
    clinicId: string | null;
    name: string | null;
    description: string | null;
    isActive: boolean | null;
    sortOrder: number | null;
    isDeleted: boolean | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type AcademicStageMaxAggregateOutputType = {
    id: string | null;
    clinicId: string | null;
    name: string | null;
    description: string | null;
    isActive: boolean | null;
    sortOrder: number | null;
    isDeleted: boolean | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type AcademicStageCountAggregateOutputType = {
    id: number;
    clinicId: number;
    name: number;
    description: number;
    isActive: number;
    sortOrder: number;
    isDeleted: number;
    createdAt: number;
    updatedAt: number;
    _all: number;
};
export type AcademicStageAvgAggregateInputType = {
    sortOrder?: true;
};
export type AcademicStageSumAggregateInputType = {
    sortOrder?: true;
};
export type AcademicStageMinAggregateInputType = {
    id?: true;
    clinicId?: true;
    name?: true;
    description?: true;
    isActive?: true;
    sortOrder?: true;
    isDeleted?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type AcademicStageMaxAggregateInputType = {
    id?: true;
    clinicId?: true;
    name?: true;
    description?: true;
    isActive?: true;
    sortOrder?: true;
    isDeleted?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type AcademicStageCountAggregateInputType = {
    id?: true;
    clinicId?: true;
    name?: true;
    description?: true;
    isActive?: true;
    sortOrder?: true;
    isDeleted?: true;
    createdAt?: true;
    updatedAt?: true;
    _all?: true;
};
export type AcademicStageAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Filter which AcademicStage to aggregate.
     */
    where?: Prisma.AcademicStageWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of AcademicStages to fetch.
     */
    orderBy?: Prisma.AcademicStageOrderByWithRelationInput | Prisma.AcademicStageOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     */
    cursor?: Prisma.AcademicStageWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` AcademicStages from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` AcademicStages.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned AcademicStages
    **/
    _count?: true | AcademicStageCountAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to average
    **/
    _avg?: AcademicStageAvgAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to sum
    **/
    _sum?: AcademicStageSumAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
    **/
    _min?: AcademicStageMinAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
    **/
    _max?: AcademicStageMaxAggregateInputType;
};
export type GetAcademicStageAggregateType<T extends AcademicStageAggregateArgs> = {
    [P in keyof T & keyof AggregateAcademicStage]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateAcademicStage[P]> : Prisma.GetScalarType<T[P], AggregateAcademicStage[P]>;
};
export type AcademicStageGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.AcademicStageWhereInput;
    orderBy?: Prisma.AcademicStageOrderByWithAggregationInput | Prisma.AcademicStageOrderByWithAggregationInput[];
    by: Prisma.AcademicStageScalarFieldEnum[] | Prisma.AcademicStageScalarFieldEnum;
    having?: Prisma.AcademicStageScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: AcademicStageCountAggregateInputType | true;
    _avg?: AcademicStageAvgAggregateInputType;
    _sum?: AcademicStageSumAggregateInputType;
    _min?: AcademicStageMinAggregateInputType;
    _max?: AcademicStageMaxAggregateInputType;
};
export type AcademicStageGroupByOutputType = {
    id: string;
    clinicId: string;
    name: string;
    description: string | null;
    isActive: boolean;
    sortOrder: number;
    isDeleted: boolean;
    createdAt: Date;
    updatedAt: Date;
    _count: AcademicStageCountAggregateOutputType | null;
    _avg: AcademicStageAvgAggregateOutputType | null;
    _sum: AcademicStageSumAggregateOutputType | null;
    _min: AcademicStageMinAggregateOutputType | null;
    _max: AcademicStageMaxAggregateOutputType | null;
};
export type GetAcademicStageGroupByPayload<T extends AcademicStageGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<AcademicStageGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof AcademicStageGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], AcademicStageGroupByOutputType[P]> : Prisma.GetScalarType<T[P], AcademicStageGroupByOutputType[P]>;
}>>;
export type AcademicStageWhereInput = {
    AND?: Prisma.AcademicStageWhereInput | Prisma.AcademicStageWhereInput[];
    OR?: Prisma.AcademicStageWhereInput[];
    NOT?: Prisma.AcademicStageWhereInput | Prisma.AcademicStageWhereInput[];
    id?: Prisma.StringFilter<"AcademicStage"> | string;
    clinicId?: Prisma.StringFilter<"AcademicStage"> | string;
    name?: Prisma.StringFilter<"AcademicStage"> | string;
    description?: Prisma.StringNullableFilter<"AcademicStage"> | string | null;
    isActive?: Prisma.BoolFilter<"AcademicStage"> | boolean;
    sortOrder?: Prisma.IntFilter<"AcademicStage"> | number;
    isDeleted?: Prisma.BoolFilter<"AcademicStage"> | boolean;
    createdAt?: Prisma.DateTimeFilter<"AcademicStage"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"AcademicStage"> | Date | string;
    clinic?: Prisma.XOR<Prisma.ClinicScalarRelationFilter, Prisma.ClinicWhereInput>;
};
export type AcademicStageOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    clinicId?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    description?: Prisma.SortOrderInput | Prisma.SortOrder;
    isActive?: Prisma.SortOrder;
    sortOrder?: Prisma.SortOrder;
    isDeleted?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    clinic?: Prisma.ClinicOrderByWithRelationInput;
};
export type AcademicStageWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    clinicId_name?: Prisma.AcademicStageClinicIdNameCompoundUniqueInput;
    AND?: Prisma.AcademicStageWhereInput | Prisma.AcademicStageWhereInput[];
    OR?: Prisma.AcademicStageWhereInput[];
    NOT?: Prisma.AcademicStageWhereInput | Prisma.AcademicStageWhereInput[];
    clinicId?: Prisma.StringFilter<"AcademicStage"> | string;
    name?: Prisma.StringFilter<"AcademicStage"> | string;
    description?: Prisma.StringNullableFilter<"AcademicStage"> | string | null;
    isActive?: Prisma.BoolFilter<"AcademicStage"> | boolean;
    sortOrder?: Prisma.IntFilter<"AcademicStage"> | number;
    isDeleted?: Prisma.BoolFilter<"AcademicStage"> | boolean;
    createdAt?: Prisma.DateTimeFilter<"AcademicStage"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"AcademicStage"> | Date | string;
    clinic?: Prisma.XOR<Prisma.ClinicScalarRelationFilter, Prisma.ClinicWhereInput>;
}, "id" | "clinicId_name">;
export type AcademicStageOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    clinicId?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    description?: Prisma.SortOrderInput | Prisma.SortOrder;
    isActive?: Prisma.SortOrder;
    sortOrder?: Prisma.SortOrder;
    isDeleted?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    _count?: Prisma.AcademicStageCountOrderByAggregateInput;
    _avg?: Prisma.AcademicStageAvgOrderByAggregateInput;
    _max?: Prisma.AcademicStageMaxOrderByAggregateInput;
    _min?: Prisma.AcademicStageMinOrderByAggregateInput;
    _sum?: Prisma.AcademicStageSumOrderByAggregateInput;
};
export type AcademicStageScalarWhereWithAggregatesInput = {
    AND?: Prisma.AcademicStageScalarWhereWithAggregatesInput | Prisma.AcademicStageScalarWhereWithAggregatesInput[];
    OR?: Prisma.AcademicStageScalarWhereWithAggregatesInput[];
    NOT?: Prisma.AcademicStageScalarWhereWithAggregatesInput | Prisma.AcademicStageScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"AcademicStage"> | string;
    clinicId?: Prisma.StringWithAggregatesFilter<"AcademicStage"> | string;
    name?: Prisma.StringWithAggregatesFilter<"AcademicStage"> | string;
    description?: Prisma.StringNullableWithAggregatesFilter<"AcademicStage"> | string | null;
    isActive?: Prisma.BoolWithAggregatesFilter<"AcademicStage"> | boolean;
    sortOrder?: Prisma.IntWithAggregatesFilter<"AcademicStage"> | number;
    isDeleted?: Prisma.BoolWithAggregatesFilter<"AcademicStage"> | boolean;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"AcademicStage"> | Date | string;
    updatedAt?: Prisma.DateTimeWithAggregatesFilter<"AcademicStage"> | Date | string;
};
export type AcademicStageCreateInput = {
    id: string;
    name: string;
    description?: string | null;
    isActive?: boolean;
    sortOrder?: number;
    isDeleted?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    clinic: Prisma.ClinicCreateNestedOneWithoutAcademicStagesInput;
};
export type AcademicStageUncheckedCreateInput = {
    id: string;
    clinicId: string;
    name: string;
    description?: string | null;
    isActive?: boolean;
    sortOrder?: number;
    isDeleted?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type AcademicStageUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    isActive?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    sortOrder?: Prisma.IntFieldUpdateOperationsInput | number;
    isDeleted?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    clinic?: Prisma.ClinicUpdateOneRequiredWithoutAcademicStagesNestedInput;
};
export type AcademicStageUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    clinicId?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    isActive?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    sortOrder?: Prisma.IntFieldUpdateOperationsInput | number;
    isDeleted?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type AcademicStageCreateManyInput = {
    id: string;
    clinicId: string;
    name: string;
    description?: string | null;
    isActive?: boolean;
    sortOrder?: number;
    isDeleted?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type AcademicStageUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    isActive?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    sortOrder?: Prisma.IntFieldUpdateOperationsInput | number;
    isDeleted?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type AcademicStageUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    clinicId?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    isActive?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    sortOrder?: Prisma.IntFieldUpdateOperationsInput | number;
    isDeleted?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type AcademicStageListRelationFilter = {
    every?: Prisma.AcademicStageWhereInput;
    some?: Prisma.AcademicStageWhereInput;
    none?: Prisma.AcademicStageWhereInput;
};
export type AcademicStageOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type AcademicStageClinicIdNameCompoundUniqueInput = {
    clinicId: string;
    name: string;
};
export type AcademicStageCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    clinicId?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    description?: Prisma.SortOrder;
    isActive?: Prisma.SortOrder;
    sortOrder?: Prisma.SortOrder;
    isDeleted?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type AcademicStageAvgOrderByAggregateInput = {
    sortOrder?: Prisma.SortOrder;
};
export type AcademicStageMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    clinicId?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    description?: Prisma.SortOrder;
    isActive?: Prisma.SortOrder;
    sortOrder?: Prisma.SortOrder;
    isDeleted?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type AcademicStageMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    clinicId?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    description?: Prisma.SortOrder;
    isActive?: Prisma.SortOrder;
    sortOrder?: Prisma.SortOrder;
    isDeleted?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type AcademicStageSumOrderByAggregateInput = {
    sortOrder?: Prisma.SortOrder;
};
export type AcademicStageCreateNestedManyWithoutClinicInput = {
    create?: Prisma.XOR<Prisma.AcademicStageCreateWithoutClinicInput, Prisma.AcademicStageUncheckedCreateWithoutClinicInput> | Prisma.AcademicStageCreateWithoutClinicInput[] | Prisma.AcademicStageUncheckedCreateWithoutClinicInput[];
    connectOrCreate?: Prisma.AcademicStageCreateOrConnectWithoutClinicInput | Prisma.AcademicStageCreateOrConnectWithoutClinicInput[];
    createMany?: Prisma.AcademicStageCreateManyClinicInputEnvelope;
    connect?: Prisma.AcademicStageWhereUniqueInput | Prisma.AcademicStageWhereUniqueInput[];
};
export type AcademicStageUncheckedCreateNestedManyWithoutClinicInput = {
    create?: Prisma.XOR<Prisma.AcademicStageCreateWithoutClinicInput, Prisma.AcademicStageUncheckedCreateWithoutClinicInput> | Prisma.AcademicStageCreateWithoutClinicInput[] | Prisma.AcademicStageUncheckedCreateWithoutClinicInput[];
    connectOrCreate?: Prisma.AcademicStageCreateOrConnectWithoutClinicInput | Prisma.AcademicStageCreateOrConnectWithoutClinicInput[];
    createMany?: Prisma.AcademicStageCreateManyClinicInputEnvelope;
    connect?: Prisma.AcademicStageWhereUniqueInput | Prisma.AcademicStageWhereUniqueInput[];
};
export type AcademicStageUpdateManyWithoutClinicNestedInput = {
    create?: Prisma.XOR<Prisma.AcademicStageCreateWithoutClinicInput, Prisma.AcademicStageUncheckedCreateWithoutClinicInput> | Prisma.AcademicStageCreateWithoutClinicInput[] | Prisma.AcademicStageUncheckedCreateWithoutClinicInput[];
    connectOrCreate?: Prisma.AcademicStageCreateOrConnectWithoutClinicInput | Prisma.AcademicStageCreateOrConnectWithoutClinicInput[];
    upsert?: Prisma.AcademicStageUpsertWithWhereUniqueWithoutClinicInput | Prisma.AcademicStageUpsertWithWhereUniqueWithoutClinicInput[];
    createMany?: Prisma.AcademicStageCreateManyClinicInputEnvelope;
    set?: Prisma.AcademicStageWhereUniqueInput | Prisma.AcademicStageWhereUniqueInput[];
    disconnect?: Prisma.AcademicStageWhereUniqueInput | Prisma.AcademicStageWhereUniqueInput[];
    delete?: Prisma.AcademicStageWhereUniqueInput | Prisma.AcademicStageWhereUniqueInput[];
    connect?: Prisma.AcademicStageWhereUniqueInput | Prisma.AcademicStageWhereUniqueInput[];
    update?: Prisma.AcademicStageUpdateWithWhereUniqueWithoutClinicInput | Prisma.AcademicStageUpdateWithWhereUniqueWithoutClinicInput[];
    updateMany?: Prisma.AcademicStageUpdateManyWithWhereWithoutClinicInput | Prisma.AcademicStageUpdateManyWithWhereWithoutClinicInput[];
    deleteMany?: Prisma.AcademicStageScalarWhereInput | Prisma.AcademicStageScalarWhereInput[];
};
export type AcademicStageUncheckedUpdateManyWithoutClinicNestedInput = {
    create?: Prisma.XOR<Prisma.AcademicStageCreateWithoutClinicInput, Prisma.AcademicStageUncheckedCreateWithoutClinicInput> | Prisma.AcademicStageCreateWithoutClinicInput[] | Prisma.AcademicStageUncheckedCreateWithoutClinicInput[];
    connectOrCreate?: Prisma.AcademicStageCreateOrConnectWithoutClinicInput | Prisma.AcademicStageCreateOrConnectWithoutClinicInput[];
    upsert?: Prisma.AcademicStageUpsertWithWhereUniqueWithoutClinicInput | Prisma.AcademicStageUpsertWithWhereUniqueWithoutClinicInput[];
    createMany?: Prisma.AcademicStageCreateManyClinicInputEnvelope;
    set?: Prisma.AcademicStageWhereUniqueInput | Prisma.AcademicStageWhereUniqueInput[];
    disconnect?: Prisma.AcademicStageWhereUniqueInput | Prisma.AcademicStageWhereUniqueInput[];
    delete?: Prisma.AcademicStageWhereUniqueInput | Prisma.AcademicStageWhereUniqueInput[];
    connect?: Prisma.AcademicStageWhereUniqueInput | Prisma.AcademicStageWhereUniqueInput[];
    update?: Prisma.AcademicStageUpdateWithWhereUniqueWithoutClinicInput | Prisma.AcademicStageUpdateWithWhereUniqueWithoutClinicInput[];
    updateMany?: Prisma.AcademicStageUpdateManyWithWhereWithoutClinicInput | Prisma.AcademicStageUpdateManyWithWhereWithoutClinicInput[];
    deleteMany?: Prisma.AcademicStageScalarWhereInput | Prisma.AcademicStageScalarWhereInput[];
};
export type AcademicStageCreateWithoutClinicInput = {
    id: string;
    name: string;
    description?: string | null;
    isActive?: boolean;
    sortOrder?: number;
    isDeleted?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type AcademicStageUncheckedCreateWithoutClinicInput = {
    id: string;
    name: string;
    description?: string | null;
    isActive?: boolean;
    sortOrder?: number;
    isDeleted?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type AcademicStageCreateOrConnectWithoutClinicInput = {
    where: Prisma.AcademicStageWhereUniqueInput;
    create: Prisma.XOR<Prisma.AcademicStageCreateWithoutClinicInput, Prisma.AcademicStageUncheckedCreateWithoutClinicInput>;
};
export type AcademicStageCreateManyClinicInputEnvelope = {
    data: Prisma.AcademicStageCreateManyClinicInput | Prisma.AcademicStageCreateManyClinicInput[];
    skipDuplicates?: boolean;
};
export type AcademicStageUpsertWithWhereUniqueWithoutClinicInput = {
    where: Prisma.AcademicStageWhereUniqueInput;
    update: Prisma.XOR<Prisma.AcademicStageUpdateWithoutClinicInput, Prisma.AcademicStageUncheckedUpdateWithoutClinicInput>;
    create: Prisma.XOR<Prisma.AcademicStageCreateWithoutClinicInput, Prisma.AcademicStageUncheckedCreateWithoutClinicInput>;
};
export type AcademicStageUpdateWithWhereUniqueWithoutClinicInput = {
    where: Prisma.AcademicStageWhereUniqueInput;
    data: Prisma.XOR<Prisma.AcademicStageUpdateWithoutClinicInput, Prisma.AcademicStageUncheckedUpdateWithoutClinicInput>;
};
export type AcademicStageUpdateManyWithWhereWithoutClinicInput = {
    where: Prisma.AcademicStageScalarWhereInput;
    data: Prisma.XOR<Prisma.AcademicStageUpdateManyMutationInput, Prisma.AcademicStageUncheckedUpdateManyWithoutClinicInput>;
};
export type AcademicStageScalarWhereInput = {
    AND?: Prisma.AcademicStageScalarWhereInput | Prisma.AcademicStageScalarWhereInput[];
    OR?: Prisma.AcademicStageScalarWhereInput[];
    NOT?: Prisma.AcademicStageScalarWhereInput | Prisma.AcademicStageScalarWhereInput[];
    id?: Prisma.StringFilter<"AcademicStage"> | string;
    clinicId?: Prisma.StringFilter<"AcademicStage"> | string;
    name?: Prisma.StringFilter<"AcademicStage"> | string;
    description?: Prisma.StringNullableFilter<"AcademicStage"> | string | null;
    isActive?: Prisma.BoolFilter<"AcademicStage"> | boolean;
    sortOrder?: Prisma.IntFilter<"AcademicStage"> | number;
    isDeleted?: Prisma.BoolFilter<"AcademicStage"> | boolean;
    createdAt?: Prisma.DateTimeFilter<"AcademicStage"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"AcademicStage"> | Date | string;
};
export type AcademicStageCreateManyClinicInput = {
    id: string;
    name: string;
    description?: string | null;
    isActive?: boolean;
    sortOrder?: number;
    isDeleted?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type AcademicStageUpdateWithoutClinicInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    isActive?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    sortOrder?: Prisma.IntFieldUpdateOperationsInput | number;
    isDeleted?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type AcademicStageUncheckedUpdateWithoutClinicInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    isActive?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    sortOrder?: Prisma.IntFieldUpdateOperationsInput | number;
    isDeleted?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type AcademicStageUncheckedUpdateManyWithoutClinicInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    isActive?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    sortOrder?: Prisma.IntFieldUpdateOperationsInput | number;
    isDeleted?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type AcademicStageSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    clinicId?: boolean;
    name?: boolean;
    description?: boolean;
    isActive?: boolean;
    sortOrder?: boolean;
    isDeleted?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    clinic?: boolean | Prisma.ClinicDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["academicStage"]>;
export type AcademicStageSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    clinicId?: boolean;
    name?: boolean;
    description?: boolean;
    isActive?: boolean;
    sortOrder?: boolean;
    isDeleted?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    clinic?: boolean | Prisma.ClinicDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["academicStage"]>;
export type AcademicStageSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    clinicId?: boolean;
    name?: boolean;
    description?: boolean;
    isActive?: boolean;
    sortOrder?: boolean;
    isDeleted?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    clinic?: boolean | Prisma.ClinicDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["academicStage"]>;
export type AcademicStageSelectScalar = {
    id?: boolean;
    clinicId?: boolean;
    name?: boolean;
    description?: boolean;
    isActive?: boolean;
    sortOrder?: boolean;
    isDeleted?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
};
export type AcademicStageOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "clinicId" | "name" | "description" | "isActive" | "sortOrder" | "isDeleted" | "createdAt" | "updatedAt", ExtArgs["result"]["academicStage"]>;
export type AcademicStageInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    clinic?: boolean | Prisma.ClinicDefaultArgs<ExtArgs>;
};
export type AcademicStageIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    clinic?: boolean | Prisma.ClinicDefaultArgs<ExtArgs>;
};
export type AcademicStageIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    clinic?: boolean | Prisma.ClinicDefaultArgs<ExtArgs>;
};
export type $AcademicStagePayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "AcademicStage";
    objects: {
        clinic: Prisma.$ClinicPayload<ExtArgs>;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        clinicId: string;
        name: string;
        description: string | null;
        isActive: boolean;
        sortOrder: number;
        isDeleted: boolean;
        createdAt: Date;
        updatedAt: Date;
    }, ExtArgs["result"]["academicStage"]>;
    composites: {};
};
export type AcademicStageGetPayload<S extends boolean | null | undefined | AcademicStageDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$AcademicStagePayload, S>;
export type AcademicStageCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<AcademicStageFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: AcademicStageCountAggregateInputType | true;
};
export interface AcademicStageDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['AcademicStage'];
        meta: {
            name: 'AcademicStage';
        };
    };
    /**
     * Find zero or one AcademicStage that matches the filter.
     * @param {AcademicStageFindUniqueArgs} args - Arguments to find a AcademicStage
     * @example
     * // Get one AcademicStage
     * const academicStage = await prisma.academicStage.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends AcademicStageFindUniqueArgs>(args: Prisma.SelectSubset<T, AcademicStageFindUniqueArgs<ExtArgs>>): Prisma.Prisma__AcademicStageClient<runtime.Types.Result.GetResult<Prisma.$AcademicStagePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    /**
     * Find one AcademicStage that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {AcademicStageFindUniqueOrThrowArgs} args - Arguments to find a AcademicStage
     * @example
     * // Get one AcademicStage
     * const academicStage = await prisma.academicStage.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends AcademicStageFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, AcademicStageFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__AcademicStageClient<runtime.Types.Result.GetResult<Prisma.$AcademicStagePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Find the first AcademicStage that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AcademicStageFindFirstArgs} args - Arguments to find a AcademicStage
     * @example
     * // Get one AcademicStage
     * const academicStage = await prisma.academicStage.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends AcademicStageFindFirstArgs>(args?: Prisma.SelectSubset<T, AcademicStageFindFirstArgs<ExtArgs>>): Prisma.Prisma__AcademicStageClient<runtime.Types.Result.GetResult<Prisma.$AcademicStagePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    /**
     * Find the first AcademicStage that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AcademicStageFindFirstOrThrowArgs} args - Arguments to find a AcademicStage
     * @example
     * // Get one AcademicStage
     * const academicStage = await prisma.academicStage.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends AcademicStageFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, AcademicStageFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__AcademicStageClient<runtime.Types.Result.GetResult<Prisma.$AcademicStagePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Find zero or more AcademicStages that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AcademicStageFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all AcademicStages
     * const academicStages = await prisma.academicStage.findMany()
     *
     * // Get first 10 AcademicStages
     * const academicStages = await prisma.academicStage.findMany({ take: 10 })
     *
     * // Only select the `id`
     * const academicStageWithIdOnly = await prisma.academicStage.findMany({ select: { id: true } })
     *
     */
    findMany<T extends AcademicStageFindManyArgs>(args?: Prisma.SelectSubset<T, AcademicStageFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$AcademicStagePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    /**
     * Create a AcademicStage.
     * @param {AcademicStageCreateArgs} args - Arguments to create a AcademicStage.
     * @example
     * // Create one AcademicStage
     * const AcademicStage = await prisma.academicStage.create({
     *   data: {
     *     // ... data to create a AcademicStage
     *   }
     * })
     *
     */
    create<T extends AcademicStageCreateArgs>(args: Prisma.SelectSubset<T, AcademicStageCreateArgs<ExtArgs>>): Prisma.Prisma__AcademicStageClient<runtime.Types.Result.GetResult<Prisma.$AcademicStagePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Create many AcademicStages.
     * @param {AcademicStageCreateManyArgs} args - Arguments to create many AcademicStages.
     * @example
     * // Create many AcademicStages
     * const academicStage = await prisma.academicStage.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     */
    createMany<T extends AcademicStageCreateManyArgs>(args?: Prisma.SelectSubset<T, AcademicStageCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Create many AcademicStages and returns the data saved in the database.
     * @param {AcademicStageCreateManyAndReturnArgs} args - Arguments to create many AcademicStages.
     * @example
     * // Create many AcademicStages
     * const academicStage = await prisma.academicStage.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Create many AcademicStages and only return the `id`
     * const academicStageWithIdOnly = await prisma.academicStage.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    createManyAndReturn<T extends AcademicStageCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, AcademicStageCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$AcademicStagePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    /**
     * Delete a AcademicStage.
     * @param {AcademicStageDeleteArgs} args - Arguments to delete one AcademicStage.
     * @example
     * // Delete one AcademicStage
     * const AcademicStage = await prisma.academicStage.delete({
     *   where: {
     *     // ... filter to delete one AcademicStage
     *   }
     * })
     *
     */
    delete<T extends AcademicStageDeleteArgs>(args: Prisma.SelectSubset<T, AcademicStageDeleteArgs<ExtArgs>>): Prisma.Prisma__AcademicStageClient<runtime.Types.Result.GetResult<Prisma.$AcademicStagePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Update one AcademicStage.
     * @param {AcademicStageUpdateArgs} args - Arguments to update one AcademicStage.
     * @example
     * // Update one AcademicStage
     * const academicStage = await prisma.academicStage.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    update<T extends AcademicStageUpdateArgs>(args: Prisma.SelectSubset<T, AcademicStageUpdateArgs<ExtArgs>>): Prisma.Prisma__AcademicStageClient<runtime.Types.Result.GetResult<Prisma.$AcademicStagePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Delete zero or more AcademicStages.
     * @param {AcademicStageDeleteManyArgs} args - Arguments to filter AcademicStages to delete.
     * @example
     * // Delete a few AcademicStages
     * const { count } = await prisma.academicStage.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     */
    deleteMany<T extends AcademicStageDeleteManyArgs>(args?: Prisma.SelectSubset<T, AcademicStageDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Update zero or more AcademicStages.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AcademicStageUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many AcademicStages
     * const academicStage = await prisma.academicStage.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    updateMany<T extends AcademicStageUpdateManyArgs>(args: Prisma.SelectSubset<T, AcademicStageUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Update zero or more AcademicStages and returns the data updated in the database.
     * @param {AcademicStageUpdateManyAndReturnArgs} args - Arguments to update many AcademicStages.
     * @example
     * // Update many AcademicStages
     * const academicStage = await prisma.academicStage.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Update zero or more AcademicStages and only return the `id`
     * const academicStageWithIdOnly = await prisma.academicStage.updateManyAndReturn({
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
    updateManyAndReturn<T extends AcademicStageUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, AcademicStageUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$AcademicStagePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    /**
     * Create or update one AcademicStage.
     * @param {AcademicStageUpsertArgs} args - Arguments to update or create a AcademicStage.
     * @example
     * // Update or create a AcademicStage
     * const academicStage = await prisma.academicStage.upsert({
     *   create: {
     *     // ... data to create a AcademicStage
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the AcademicStage we want to update
     *   }
     * })
     */
    upsert<T extends AcademicStageUpsertArgs>(args: Prisma.SelectSubset<T, AcademicStageUpsertArgs<ExtArgs>>): Prisma.Prisma__AcademicStageClient<runtime.Types.Result.GetResult<Prisma.$AcademicStagePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Count the number of AcademicStages.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AcademicStageCountArgs} args - Arguments to filter AcademicStages to count.
     * @example
     * // Count the number of AcademicStages
     * const count = await prisma.academicStage.count({
     *   where: {
     *     // ... the filter for the AcademicStages we want to count
     *   }
     * })
    **/
    count<T extends AcademicStageCountArgs>(args?: Prisma.Subset<T, AcademicStageCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], AcademicStageCountAggregateOutputType> : number>;
    /**
     * Allows you to perform aggregations operations on a AcademicStage.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AcademicStageAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends AcademicStageAggregateArgs>(args: Prisma.Subset<T, AcademicStageAggregateArgs>): Prisma.PrismaPromise<GetAcademicStageAggregateType<T>>;
    /**
     * Group by AcademicStage.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AcademicStageGroupByArgs} args - Group by arguments.
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
    groupBy<T extends AcademicStageGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: AcademicStageGroupByArgs['orderBy'];
    } : {
        orderBy?: AcademicStageGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, AcademicStageGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAcademicStageGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    /**
     * Fields of the AcademicStage model
     */
    readonly fields: AcademicStageFieldRefs;
}
/**
 * The delegate class that acts as a "Promise-like" for AcademicStage.
 * Why is this prefixed with `Prisma__`?
 * Because we want to prevent naming conflicts as mentioned in
 * https://github.com/prisma/prisma-client-js/issues/707
 */
export interface Prisma__AcademicStageClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    clinic<T extends Prisma.ClinicDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.ClinicDefaultArgs<ExtArgs>>): Prisma.Prisma__ClinicClient<runtime.Types.Result.GetResult<Prisma.$ClinicPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
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
 * Fields of the AcademicStage model
 */
export interface AcademicStageFieldRefs {
    readonly id: Prisma.FieldRef<"AcademicStage", 'String'>;
    readonly clinicId: Prisma.FieldRef<"AcademicStage", 'String'>;
    readonly name: Prisma.FieldRef<"AcademicStage", 'String'>;
    readonly description: Prisma.FieldRef<"AcademicStage", 'String'>;
    readonly isActive: Prisma.FieldRef<"AcademicStage", 'Boolean'>;
    readonly sortOrder: Prisma.FieldRef<"AcademicStage", 'Int'>;
    readonly isDeleted: Prisma.FieldRef<"AcademicStage", 'Boolean'>;
    readonly createdAt: Prisma.FieldRef<"AcademicStage", 'DateTime'>;
    readonly updatedAt: Prisma.FieldRef<"AcademicStage", 'DateTime'>;
}
/**
 * AcademicStage findUnique
 */
export type AcademicStageFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AcademicStage
     */
    select?: Prisma.AcademicStageSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the AcademicStage
     */
    omit?: Prisma.AcademicStageOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.AcademicStageInclude<ExtArgs> | null;
    /**
     * Filter, which AcademicStage to fetch.
     */
    where: Prisma.AcademicStageWhereUniqueInput;
};
/**
 * AcademicStage findUniqueOrThrow
 */
export type AcademicStageFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AcademicStage
     */
    select?: Prisma.AcademicStageSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the AcademicStage
     */
    omit?: Prisma.AcademicStageOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.AcademicStageInclude<ExtArgs> | null;
    /**
     * Filter, which AcademicStage to fetch.
     */
    where: Prisma.AcademicStageWhereUniqueInput;
};
/**
 * AcademicStage findFirst
 */
export type AcademicStageFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AcademicStage
     */
    select?: Prisma.AcademicStageSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the AcademicStage
     */
    omit?: Prisma.AcademicStageOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.AcademicStageInclude<ExtArgs> | null;
    /**
     * Filter, which AcademicStage to fetch.
     */
    where?: Prisma.AcademicStageWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of AcademicStages to fetch.
     */
    orderBy?: Prisma.AcademicStageOrderByWithRelationInput | Prisma.AcademicStageOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for AcademicStages.
     */
    cursor?: Prisma.AcademicStageWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` AcademicStages from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` AcademicStages.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of AcademicStages.
     */
    distinct?: Prisma.AcademicStageScalarFieldEnum | Prisma.AcademicStageScalarFieldEnum[];
};
/**
 * AcademicStage findFirstOrThrow
 */
export type AcademicStageFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AcademicStage
     */
    select?: Prisma.AcademicStageSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the AcademicStage
     */
    omit?: Prisma.AcademicStageOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.AcademicStageInclude<ExtArgs> | null;
    /**
     * Filter, which AcademicStage to fetch.
     */
    where?: Prisma.AcademicStageWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of AcademicStages to fetch.
     */
    orderBy?: Prisma.AcademicStageOrderByWithRelationInput | Prisma.AcademicStageOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for AcademicStages.
     */
    cursor?: Prisma.AcademicStageWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` AcademicStages from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` AcademicStages.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of AcademicStages.
     */
    distinct?: Prisma.AcademicStageScalarFieldEnum | Prisma.AcademicStageScalarFieldEnum[];
};
/**
 * AcademicStage findMany
 */
export type AcademicStageFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AcademicStage
     */
    select?: Prisma.AcademicStageSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the AcademicStage
     */
    omit?: Prisma.AcademicStageOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.AcademicStageInclude<ExtArgs> | null;
    /**
     * Filter, which AcademicStages to fetch.
     */
    where?: Prisma.AcademicStageWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of AcademicStages to fetch.
     */
    orderBy?: Prisma.AcademicStageOrderByWithRelationInput | Prisma.AcademicStageOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing AcademicStages.
     */
    cursor?: Prisma.AcademicStageWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` AcademicStages from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` AcademicStages.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of AcademicStages.
     */
    distinct?: Prisma.AcademicStageScalarFieldEnum | Prisma.AcademicStageScalarFieldEnum[];
};
/**
 * AcademicStage create
 */
export type AcademicStageCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AcademicStage
     */
    select?: Prisma.AcademicStageSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the AcademicStage
     */
    omit?: Prisma.AcademicStageOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.AcademicStageInclude<ExtArgs> | null;
    /**
     * The data needed to create a AcademicStage.
     */
    data: Prisma.XOR<Prisma.AcademicStageCreateInput, Prisma.AcademicStageUncheckedCreateInput>;
};
/**
 * AcademicStage createMany
 */
export type AcademicStageCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * The data used to create many AcademicStages.
     */
    data: Prisma.AcademicStageCreateManyInput | Prisma.AcademicStageCreateManyInput[];
    skipDuplicates?: boolean;
};
/**
 * AcademicStage createManyAndReturn
 */
export type AcademicStageCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AcademicStage
     */
    select?: Prisma.AcademicStageSelectCreateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the AcademicStage
     */
    omit?: Prisma.AcademicStageOmit<ExtArgs> | null;
    /**
     * The data used to create many AcademicStages.
     */
    data: Prisma.AcademicStageCreateManyInput | Prisma.AcademicStageCreateManyInput[];
    skipDuplicates?: boolean;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.AcademicStageIncludeCreateManyAndReturn<ExtArgs> | null;
};
/**
 * AcademicStage update
 */
export type AcademicStageUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AcademicStage
     */
    select?: Prisma.AcademicStageSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the AcademicStage
     */
    omit?: Prisma.AcademicStageOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.AcademicStageInclude<ExtArgs> | null;
    /**
     * The data needed to update a AcademicStage.
     */
    data: Prisma.XOR<Prisma.AcademicStageUpdateInput, Prisma.AcademicStageUncheckedUpdateInput>;
    /**
     * Choose, which AcademicStage to update.
     */
    where: Prisma.AcademicStageWhereUniqueInput;
};
/**
 * AcademicStage updateMany
 */
export type AcademicStageUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * The data used to update AcademicStages.
     */
    data: Prisma.XOR<Prisma.AcademicStageUpdateManyMutationInput, Prisma.AcademicStageUncheckedUpdateManyInput>;
    /**
     * Filter which AcademicStages to update
     */
    where?: Prisma.AcademicStageWhereInput;
    /**
     * Limit how many AcademicStages to update.
     */
    limit?: number;
};
/**
 * AcademicStage updateManyAndReturn
 */
export type AcademicStageUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AcademicStage
     */
    select?: Prisma.AcademicStageSelectUpdateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the AcademicStage
     */
    omit?: Prisma.AcademicStageOmit<ExtArgs> | null;
    /**
     * The data used to update AcademicStages.
     */
    data: Prisma.XOR<Prisma.AcademicStageUpdateManyMutationInput, Prisma.AcademicStageUncheckedUpdateManyInput>;
    /**
     * Filter which AcademicStages to update
     */
    where?: Prisma.AcademicStageWhereInput;
    /**
     * Limit how many AcademicStages to update.
     */
    limit?: number;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.AcademicStageIncludeUpdateManyAndReturn<ExtArgs> | null;
};
/**
 * AcademicStage upsert
 */
export type AcademicStageUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AcademicStage
     */
    select?: Prisma.AcademicStageSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the AcademicStage
     */
    omit?: Prisma.AcademicStageOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.AcademicStageInclude<ExtArgs> | null;
    /**
     * The filter to search for the AcademicStage to update in case it exists.
     */
    where: Prisma.AcademicStageWhereUniqueInput;
    /**
     * In case the AcademicStage found by the `where` argument doesn't exist, create a new AcademicStage with this data.
     */
    create: Prisma.XOR<Prisma.AcademicStageCreateInput, Prisma.AcademicStageUncheckedCreateInput>;
    /**
     * In case the AcademicStage was found with the provided `where` argument, update it with this data.
     */
    update: Prisma.XOR<Prisma.AcademicStageUpdateInput, Prisma.AcademicStageUncheckedUpdateInput>;
};
/**
 * AcademicStage delete
 */
export type AcademicStageDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AcademicStage
     */
    select?: Prisma.AcademicStageSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the AcademicStage
     */
    omit?: Prisma.AcademicStageOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.AcademicStageInclude<ExtArgs> | null;
    /**
     * Filter which AcademicStage to delete.
     */
    where: Prisma.AcademicStageWhereUniqueInput;
};
/**
 * AcademicStage deleteMany
 */
export type AcademicStageDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Filter which AcademicStages to delete
     */
    where?: Prisma.AcademicStageWhereInput;
    /**
     * Limit how many AcademicStages to delete.
     */
    limit?: number;
};
/**
 * AcademicStage without action
 */
export type AcademicStageDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AcademicStage
     */
    select?: Prisma.AcademicStageSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the AcademicStage
     */
    omit?: Prisma.AcademicStageOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.AcademicStageInclude<ExtArgs> | null;
};
