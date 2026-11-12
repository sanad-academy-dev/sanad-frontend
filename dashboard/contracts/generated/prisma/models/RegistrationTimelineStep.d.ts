import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace";
/**
 * Model RegistrationTimelineStep
 *
 */
export type RegistrationTimelineStepModel = runtime.Types.Result.DefaultSelection<Prisma.$RegistrationTimelineStepPayload>;
export type AggregateRegistrationTimelineStep = {
    _count: RegistrationTimelineStepCountAggregateOutputType | null;
    _avg: RegistrationTimelineStepAvgAggregateOutputType | null;
    _sum: RegistrationTimelineStepSumAggregateOutputType | null;
    _min: RegistrationTimelineStepMinAggregateOutputType | null;
    _max: RegistrationTimelineStepMaxAggregateOutputType | null;
};
export type RegistrationTimelineStepAvgAggregateOutputType = {
    order: number | null;
};
export type RegistrationTimelineStepSumAggregateOutputType = {
    order: number | null;
};
export type RegistrationTimelineStepMinAggregateOutputType = {
    id: string | null;
    requestId: string | null;
    title: string | null;
    actorName: string | null;
    statusBadge: string | null;
    isCompleted: boolean | null;
    completedAt: Date | null;
    order: number | null;
    createdAt: Date | null;
};
export type RegistrationTimelineStepMaxAggregateOutputType = {
    id: string | null;
    requestId: string | null;
    title: string | null;
    actorName: string | null;
    statusBadge: string | null;
    isCompleted: boolean | null;
    completedAt: Date | null;
    order: number | null;
    createdAt: Date | null;
};
export type RegistrationTimelineStepCountAggregateOutputType = {
    id: number;
    requestId: number;
    title: number;
    actorName: number;
    statusBadge: number;
    isCompleted: number;
    completedAt: number;
    order: number;
    createdAt: number;
    _all: number;
};
export type RegistrationTimelineStepAvgAggregateInputType = {
    order?: true;
};
export type RegistrationTimelineStepSumAggregateInputType = {
    order?: true;
};
export type RegistrationTimelineStepMinAggregateInputType = {
    id?: true;
    requestId?: true;
    title?: true;
    actorName?: true;
    statusBadge?: true;
    isCompleted?: true;
    completedAt?: true;
    order?: true;
    createdAt?: true;
};
export type RegistrationTimelineStepMaxAggregateInputType = {
    id?: true;
    requestId?: true;
    title?: true;
    actorName?: true;
    statusBadge?: true;
    isCompleted?: true;
    completedAt?: true;
    order?: true;
    createdAt?: true;
};
export type RegistrationTimelineStepCountAggregateInputType = {
    id?: true;
    requestId?: true;
    title?: true;
    actorName?: true;
    statusBadge?: true;
    isCompleted?: true;
    completedAt?: true;
    order?: true;
    createdAt?: true;
    _all?: true;
};
export type RegistrationTimelineStepAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Filter which RegistrationTimelineStep to aggregate.
     */
    where?: Prisma.RegistrationTimelineStepWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of RegistrationTimelineSteps to fetch.
     */
    orderBy?: Prisma.RegistrationTimelineStepOrderByWithRelationInput | Prisma.RegistrationTimelineStepOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     */
    cursor?: Prisma.RegistrationTimelineStepWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` RegistrationTimelineSteps from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` RegistrationTimelineSteps.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned RegistrationTimelineSteps
    **/
    _count?: true | RegistrationTimelineStepCountAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to average
    **/
    _avg?: RegistrationTimelineStepAvgAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to sum
    **/
    _sum?: RegistrationTimelineStepSumAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
    **/
    _min?: RegistrationTimelineStepMinAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
    **/
    _max?: RegistrationTimelineStepMaxAggregateInputType;
};
export type GetRegistrationTimelineStepAggregateType<T extends RegistrationTimelineStepAggregateArgs> = {
    [P in keyof T & keyof AggregateRegistrationTimelineStep]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateRegistrationTimelineStep[P]> : Prisma.GetScalarType<T[P], AggregateRegistrationTimelineStep[P]>;
};
export type RegistrationTimelineStepGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.RegistrationTimelineStepWhereInput;
    orderBy?: Prisma.RegistrationTimelineStepOrderByWithAggregationInput | Prisma.RegistrationTimelineStepOrderByWithAggregationInput[];
    by: Prisma.RegistrationTimelineStepScalarFieldEnum[] | Prisma.RegistrationTimelineStepScalarFieldEnum;
    having?: Prisma.RegistrationTimelineStepScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: RegistrationTimelineStepCountAggregateInputType | true;
    _avg?: RegistrationTimelineStepAvgAggregateInputType;
    _sum?: RegistrationTimelineStepSumAggregateInputType;
    _min?: RegistrationTimelineStepMinAggregateInputType;
    _max?: RegistrationTimelineStepMaxAggregateInputType;
};
export type RegistrationTimelineStepGroupByOutputType = {
    id: string;
    requestId: string;
    title: string;
    actorName: string;
    statusBadge: string | null;
    isCompleted: boolean;
    completedAt: Date | null;
    order: number;
    createdAt: Date;
    _count: RegistrationTimelineStepCountAggregateOutputType | null;
    _avg: RegistrationTimelineStepAvgAggregateOutputType | null;
    _sum: RegistrationTimelineStepSumAggregateOutputType | null;
    _min: RegistrationTimelineStepMinAggregateOutputType | null;
    _max: RegistrationTimelineStepMaxAggregateOutputType | null;
};
export type GetRegistrationTimelineStepGroupByPayload<T extends RegistrationTimelineStepGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<RegistrationTimelineStepGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof RegistrationTimelineStepGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], RegistrationTimelineStepGroupByOutputType[P]> : Prisma.GetScalarType<T[P], RegistrationTimelineStepGroupByOutputType[P]>;
}>>;
export type RegistrationTimelineStepWhereInput = {
    AND?: Prisma.RegistrationTimelineStepWhereInput | Prisma.RegistrationTimelineStepWhereInput[];
    OR?: Prisma.RegistrationTimelineStepWhereInput[];
    NOT?: Prisma.RegistrationTimelineStepWhereInput | Prisma.RegistrationTimelineStepWhereInput[];
    id?: Prisma.StringFilter<"RegistrationTimelineStep"> | string;
    requestId?: Prisma.StringFilter<"RegistrationTimelineStep"> | string;
    title?: Prisma.StringFilter<"RegistrationTimelineStep"> | string;
    actorName?: Prisma.StringFilter<"RegistrationTimelineStep"> | string;
    statusBadge?: Prisma.StringNullableFilter<"RegistrationTimelineStep"> | string | null;
    isCompleted?: Prisma.BoolFilter<"RegistrationTimelineStep"> | boolean;
    completedAt?: Prisma.DateTimeNullableFilter<"RegistrationTimelineStep"> | Date | string | null;
    order?: Prisma.IntFilter<"RegistrationTimelineStep"> | number;
    createdAt?: Prisma.DateTimeFilter<"RegistrationTimelineStep"> | Date | string;
    request?: Prisma.XOR<Prisma.RegistrationRequestScalarRelationFilter, Prisma.RegistrationRequestWhereInput>;
};
export type RegistrationTimelineStepOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    requestId?: Prisma.SortOrder;
    title?: Prisma.SortOrder;
    actorName?: Prisma.SortOrder;
    statusBadge?: Prisma.SortOrderInput | Prisma.SortOrder;
    isCompleted?: Prisma.SortOrder;
    completedAt?: Prisma.SortOrderInput | Prisma.SortOrder;
    order?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    request?: Prisma.RegistrationRequestOrderByWithRelationInput;
};
export type RegistrationTimelineStepWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    AND?: Prisma.RegistrationTimelineStepWhereInput | Prisma.RegistrationTimelineStepWhereInput[];
    OR?: Prisma.RegistrationTimelineStepWhereInput[];
    NOT?: Prisma.RegistrationTimelineStepWhereInput | Prisma.RegistrationTimelineStepWhereInput[];
    requestId?: Prisma.StringFilter<"RegistrationTimelineStep"> | string;
    title?: Prisma.StringFilter<"RegistrationTimelineStep"> | string;
    actorName?: Prisma.StringFilter<"RegistrationTimelineStep"> | string;
    statusBadge?: Prisma.StringNullableFilter<"RegistrationTimelineStep"> | string | null;
    isCompleted?: Prisma.BoolFilter<"RegistrationTimelineStep"> | boolean;
    completedAt?: Prisma.DateTimeNullableFilter<"RegistrationTimelineStep"> | Date | string | null;
    order?: Prisma.IntFilter<"RegistrationTimelineStep"> | number;
    createdAt?: Prisma.DateTimeFilter<"RegistrationTimelineStep"> | Date | string;
    request?: Prisma.XOR<Prisma.RegistrationRequestScalarRelationFilter, Prisma.RegistrationRequestWhereInput>;
}, "id">;
export type RegistrationTimelineStepOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    requestId?: Prisma.SortOrder;
    title?: Prisma.SortOrder;
    actorName?: Prisma.SortOrder;
    statusBadge?: Prisma.SortOrderInput | Prisma.SortOrder;
    isCompleted?: Prisma.SortOrder;
    completedAt?: Prisma.SortOrderInput | Prisma.SortOrder;
    order?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    _count?: Prisma.RegistrationTimelineStepCountOrderByAggregateInput;
    _avg?: Prisma.RegistrationTimelineStepAvgOrderByAggregateInput;
    _max?: Prisma.RegistrationTimelineStepMaxOrderByAggregateInput;
    _min?: Prisma.RegistrationTimelineStepMinOrderByAggregateInput;
    _sum?: Prisma.RegistrationTimelineStepSumOrderByAggregateInput;
};
export type RegistrationTimelineStepScalarWhereWithAggregatesInput = {
    AND?: Prisma.RegistrationTimelineStepScalarWhereWithAggregatesInput | Prisma.RegistrationTimelineStepScalarWhereWithAggregatesInput[];
    OR?: Prisma.RegistrationTimelineStepScalarWhereWithAggregatesInput[];
    NOT?: Prisma.RegistrationTimelineStepScalarWhereWithAggregatesInput | Prisma.RegistrationTimelineStepScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"RegistrationTimelineStep"> | string;
    requestId?: Prisma.StringWithAggregatesFilter<"RegistrationTimelineStep"> | string;
    title?: Prisma.StringWithAggregatesFilter<"RegistrationTimelineStep"> | string;
    actorName?: Prisma.StringWithAggregatesFilter<"RegistrationTimelineStep"> | string;
    statusBadge?: Prisma.StringNullableWithAggregatesFilter<"RegistrationTimelineStep"> | string | null;
    isCompleted?: Prisma.BoolWithAggregatesFilter<"RegistrationTimelineStep"> | boolean;
    completedAt?: Prisma.DateTimeNullableWithAggregatesFilter<"RegistrationTimelineStep"> | Date | string | null;
    order?: Prisma.IntWithAggregatesFilter<"RegistrationTimelineStep"> | number;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"RegistrationTimelineStep"> | Date | string;
};
export type RegistrationTimelineStepCreateInput = {
    id?: string;
    title: string;
    actorName: string;
    statusBadge?: string | null;
    isCompleted?: boolean;
    completedAt?: Date | string | null;
    order?: number;
    createdAt?: Date | string;
    request: Prisma.RegistrationRequestCreateNestedOneWithoutTimelineStepsInput;
};
export type RegistrationTimelineStepUncheckedCreateInput = {
    id?: string;
    requestId: string;
    title: string;
    actorName: string;
    statusBadge?: string | null;
    isCompleted?: boolean;
    completedAt?: Date | string | null;
    order?: number;
    createdAt?: Date | string;
};
export type RegistrationTimelineStepUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    actorName?: Prisma.StringFieldUpdateOperationsInput | string;
    statusBadge?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    isCompleted?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    completedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    order?: Prisma.IntFieldUpdateOperationsInput | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    request?: Prisma.RegistrationRequestUpdateOneRequiredWithoutTimelineStepsNestedInput;
};
export type RegistrationTimelineStepUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    requestId?: Prisma.StringFieldUpdateOperationsInput | string;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    actorName?: Prisma.StringFieldUpdateOperationsInput | string;
    statusBadge?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    isCompleted?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    completedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    order?: Prisma.IntFieldUpdateOperationsInput | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type RegistrationTimelineStepCreateManyInput = {
    id?: string;
    requestId: string;
    title: string;
    actorName: string;
    statusBadge?: string | null;
    isCompleted?: boolean;
    completedAt?: Date | string | null;
    order?: number;
    createdAt?: Date | string;
};
export type RegistrationTimelineStepUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    actorName?: Prisma.StringFieldUpdateOperationsInput | string;
    statusBadge?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    isCompleted?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    completedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    order?: Prisma.IntFieldUpdateOperationsInput | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type RegistrationTimelineStepUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    requestId?: Prisma.StringFieldUpdateOperationsInput | string;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    actorName?: Prisma.StringFieldUpdateOperationsInput | string;
    statusBadge?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    isCompleted?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    completedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    order?: Prisma.IntFieldUpdateOperationsInput | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type RegistrationTimelineStepListRelationFilter = {
    every?: Prisma.RegistrationTimelineStepWhereInput;
    some?: Prisma.RegistrationTimelineStepWhereInput;
    none?: Prisma.RegistrationTimelineStepWhereInput;
};
export type RegistrationTimelineStepOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type RegistrationTimelineStepCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    requestId?: Prisma.SortOrder;
    title?: Prisma.SortOrder;
    actorName?: Prisma.SortOrder;
    statusBadge?: Prisma.SortOrder;
    isCompleted?: Prisma.SortOrder;
    completedAt?: Prisma.SortOrder;
    order?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type RegistrationTimelineStepAvgOrderByAggregateInput = {
    order?: Prisma.SortOrder;
};
export type RegistrationTimelineStepMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    requestId?: Prisma.SortOrder;
    title?: Prisma.SortOrder;
    actorName?: Prisma.SortOrder;
    statusBadge?: Prisma.SortOrder;
    isCompleted?: Prisma.SortOrder;
    completedAt?: Prisma.SortOrder;
    order?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type RegistrationTimelineStepMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    requestId?: Prisma.SortOrder;
    title?: Prisma.SortOrder;
    actorName?: Prisma.SortOrder;
    statusBadge?: Prisma.SortOrder;
    isCompleted?: Prisma.SortOrder;
    completedAt?: Prisma.SortOrder;
    order?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type RegistrationTimelineStepSumOrderByAggregateInput = {
    order?: Prisma.SortOrder;
};
export type RegistrationTimelineStepCreateNestedManyWithoutRequestInput = {
    create?: Prisma.XOR<Prisma.RegistrationTimelineStepCreateWithoutRequestInput, Prisma.RegistrationTimelineStepUncheckedCreateWithoutRequestInput> | Prisma.RegistrationTimelineStepCreateWithoutRequestInput[] | Prisma.RegistrationTimelineStepUncheckedCreateWithoutRequestInput[];
    connectOrCreate?: Prisma.RegistrationTimelineStepCreateOrConnectWithoutRequestInput | Prisma.RegistrationTimelineStepCreateOrConnectWithoutRequestInput[];
    createMany?: Prisma.RegistrationTimelineStepCreateManyRequestInputEnvelope;
    connect?: Prisma.RegistrationTimelineStepWhereUniqueInput | Prisma.RegistrationTimelineStepWhereUniqueInput[];
};
export type RegistrationTimelineStepUncheckedCreateNestedManyWithoutRequestInput = {
    create?: Prisma.XOR<Prisma.RegistrationTimelineStepCreateWithoutRequestInput, Prisma.RegistrationTimelineStepUncheckedCreateWithoutRequestInput> | Prisma.RegistrationTimelineStepCreateWithoutRequestInput[] | Prisma.RegistrationTimelineStepUncheckedCreateWithoutRequestInput[];
    connectOrCreate?: Prisma.RegistrationTimelineStepCreateOrConnectWithoutRequestInput | Prisma.RegistrationTimelineStepCreateOrConnectWithoutRequestInput[];
    createMany?: Prisma.RegistrationTimelineStepCreateManyRequestInputEnvelope;
    connect?: Prisma.RegistrationTimelineStepWhereUniqueInput | Prisma.RegistrationTimelineStepWhereUniqueInput[];
};
export type RegistrationTimelineStepUpdateManyWithoutRequestNestedInput = {
    create?: Prisma.XOR<Prisma.RegistrationTimelineStepCreateWithoutRequestInput, Prisma.RegistrationTimelineStepUncheckedCreateWithoutRequestInput> | Prisma.RegistrationTimelineStepCreateWithoutRequestInput[] | Prisma.RegistrationTimelineStepUncheckedCreateWithoutRequestInput[];
    connectOrCreate?: Prisma.RegistrationTimelineStepCreateOrConnectWithoutRequestInput | Prisma.RegistrationTimelineStepCreateOrConnectWithoutRequestInput[];
    upsert?: Prisma.RegistrationTimelineStepUpsertWithWhereUniqueWithoutRequestInput | Prisma.RegistrationTimelineStepUpsertWithWhereUniqueWithoutRequestInput[];
    createMany?: Prisma.RegistrationTimelineStepCreateManyRequestInputEnvelope;
    set?: Prisma.RegistrationTimelineStepWhereUniqueInput | Prisma.RegistrationTimelineStepWhereUniqueInput[];
    disconnect?: Prisma.RegistrationTimelineStepWhereUniqueInput | Prisma.RegistrationTimelineStepWhereUniqueInput[];
    delete?: Prisma.RegistrationTimelineStepWhereUniqueInput | Prisma.RegistrationTimelineStepWhereUniqueInput[];
    connect?: Prisma.RegistrationTimelineStepWhereUniqueInput | Prisma.RegistrationTimelineStepWhereUniqueInput[];
    update?: Prisma.RegistrationTimelineStepUpdateWithWhereUniqueWithoutRequestInput | Prisma.RegistrationTimelineStepUpdateWithWhereUniqueWithoutRequestInput[];
    updateMany?: Prisma.RegistrationTimelineStepUpdateManyWithWhereWithoutRequestInput | Prisma.RegistrationTimelineStepUpdateManyWithWhereWithoutRequestInput[];
    deleteMany?: Prisma.RegistrationTimelineStepScalarWhereInput | Prisma.RegistrationTimelineStepScalarWhereInput[];
};
export type RegistrationTimelineStepUncheckedUpdateManyWithoutRequestNestedInput = {
    create?: Prisma.XOR<Prisma.RegistrationTimelineStepCreateWithoutRequestInput, Prisma.RegistrationTimelineStepUncheckedCreateWithoutRequestInput> | Prisma.RegistrationTimelineStepCreateWithoutRequestInput[] | Prisma.RegistrationTimelineStepUncheckedCreateWithoutRequestInput[];
    connectOrCreate?: Prisma.RegistrationTimelineStepCreateOrConnectWithoutRequestInput | Prisma.RegistrationTimelineStepCreateOrConnectWithoutRequestInput[];
    upsert?: Prisma.RegistrationTimelineStepUpsertWithWhereUniqueWithoutRequestInput | Prisma.RegistrationTimelineStepUpsertWithWhereUniqueWithoutRequestInput[];
    createMany?: Prisma.RegistrationTimelineStepCreateManyRequestInputEnvelope;
    set?: Prisma.RegistrationTimelineStepWhereUniqueInput | Prisma.RegistrationTimelineStepWhereUniqueInput[];
    disconnect?: Prisma.RegistrationTimelineStepWhereUniqueInput | Prisma.RegistrationTimelineStepWhereUniqueInput[];
    delete?: Prisma.RegistrationTimelineStepWhereUniqueInput | Prisma.RegistrationTimelineStepWhereUniqueInput[];
    connect?: Prisma.RegistrationTimelineStepWhereUniqueInput | Prisma.RegistrationTimelineStepWhereUniqueInput[];
    update?: Prisma.RegistrationTimelineStepUpdateWithWhereUniqueWithoutRequestInput | Prisma.RegistrationTimelineStepUpdateWithWhereUniqueWithoutRequestInput[];
    updateMany?: Prisma.RegistrationTimelineStepUpdateManyWithWhereWithoutRequestInput | Prisma.RegistrationTimelineStepUpdateManyWithWhereWithoutRequestInput[];
    deleteMany?: Prisma.RegistrationTimelineStepScalarWhereInput | Prisma.RegistrationTimelineStepScalarWhereInput[];
};
export type RegistrationTimelineStepCreateWithoutRequestInput = {
    id?: string;
    title: string;
    actorName: string;
    statusBadge?: string | null;
    isCompleted?: boolean;
    completedAt?: Date | string | null;
    order?: number;
    createdAt?: Date | string;
};
export type RegistrationTimelineStepUncheckedCreateWithoutRequestInput = {
    id?: string;
    title: string;
    actorName: string;
    statusBadge?: string | null;
    isCompleted?: boolean;
    completedAt?: Date | string | null;
    order?: number;
    createdAt?: Date | string;
};
export type RegistrationTimelineStepCreateOrConnectWithoutRequestInput = {
    where: Prisma.RegistrationTimelineStepWhereUniqueInput;
    create: Prisma.XOR<Prisma.RegistrationTimelineStepCreateWithoutRequestInput, Prisma.RegistrationTimelineStepUncheckedCreateWithoutRequestInput>;
};
export type RegistrationTimelineStepCreateManyRequestInputEnvelope = {
    data: Prisma.RegistrationTimelineStepCreateManyRequestInput | Prisma.RegistrationTimelineStepCreateManyRequestInput[];
    skipDuplicates?: boolean;
};
export type RegistrationTimelineStepUpsertWithWhereUniqueWithoutRequestInput = {
    where: Prisma.RegistrationTimelineStepWhereUniqueInput;
    update: Prisma.XOR<Prisma.RegistrationTimelineStepUpdateWithoutRequestInput, Prisma.RegistrationTimelineStepUncheckedUpdateWithoutRequestInput>;
    create: Prisma.XOR<Prisma.RegistrationTimelineStepCreateWithoutRequestInput, Prisma.RegistrationTimelineStepUncheckedCreateWithoutRequestInput>;
};
export type RegistrationTimelineStepUpdateWithWhereUniqueWithoutRequestInput = {
    where: Prisma.RegistrationTimelineStepWhereUniqueInput;
    data: Prisma.XOR<Prisma.RegistrationTimelineStepUpdateWithoutRequestInput, Prisma.RegistrationTimelineStepUncheckedUpdateWithoutRequestInput>;
};
export type RegistrationTimelineStepUpdateManyWithWhereWithoutRequestInput = {
    where: Prisma.RegistrationTimelineStepScalarWhereInput;
    data: Prisma.XOR<Prisma.RegistrationTimelineStepUpdateManyMutationInput, Prisma.RegistrationTimelineStepUncheckedUpdateManyWithoutRequestInput>;
};
export type RegistrationTimelineStepScalarWhereInput = {
    AND?: Prisma.RegistrationTimelineStepScalarWhereInput | Prisma.RegistrationTimelineStepScalarWhereInput[];
    OR?: Prisma.RegistrationTimelineStepScalarWhereInput[];
    NOT?: Prisma.RegistrationTimelineStepScalarWhereInput | Prisma.RegistrationTimelineStepScalarWhereInput[];
    id?: Prisma.StringFilter<"RegistrationTimelineStep"> | string;
    requestId?: Prisma.StringFilter<"RegistrationTimelineStep"> | string;
    title?: Prisma.StringFilter<"RegistrationTimelineStep"> | string;
    actorName?: Prisma.StringFilter<"RegistrationTimelineStep"> | string;
    statusBadge?: Prisma.StringNullableFilter<"RegistrationTimelineStep"> | string | null;
    isCompleted?: Prisma.BoolFilter<"RegistrationTimelineStep"> | boolean;
    completedAt?: Prisma.DateTimeNullableFilter<"RegistrationTimelineStep"> | Date | string | null;
    order?: Prisma.IntFilter<"RegistrationTimelineStep"> | number;
    createdAt?: Prisma.DateTimeFilter<"RegistrationTimelineStep"> | Date | string;
};
export type RegistrationTimelineStepCreateManyRequestInput = {
    id?: string;
    title: string;
    actorName: string;
    statusBadge?: string | null;
    isCompleted?: boolean;
    completedAt?: Date | string | null;
    order?: number;
    createdAt?: Date | string;
};
export type RegistrationTimelineStepUpdateWithoutRequestInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    actorName?: Prisma.StringFieldUpdateOperationsInput | string;
    statusBadge?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    isCompleted?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    completedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    order?: Prisma.IntFieldUpdateOperationsInput | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type RegistrationTimelineStepUncheckedUpdateWithoutRequestInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    actorName?: Prisma.StringFieldUpdateOperationsInput | string;
    statusBadge?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    isCompleted?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    completedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    order?: Prisma.IntFieldUpdateOperationsInput | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type RegistrationTimelineStepUncheckedUpdateManyWithoutRequestInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    actorName?: Prisma.StringFieldUpdateOperationsInput | string;
    statusBadge?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    isCompleted?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    completedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    order?: Prisma.IntFieldUpdateOperationsInput | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type RegistrationTimelineStepSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    requestId?: boolean;
    title?: boolean;
    actorName?: boolean;
    statusBadge?: boolean;
    isCompleted?: boolean;
    completedAt?: boolean;
    order?: boolean;
    createdAt?: boolean;
    request?: boolean | Prisma.RegistrationRequestDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["registrationTimelineStep"]>;
export type RegistrationTimelineStepSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    requestId?: boolean;
    title?: boolean;
    actorName?: boolean;
    statusBadge?: boolean;
    isCompleted?: boolean;
    completedAt?: boolean;
    order?: boolean;
    createdAt?: boolean;
    request?: boolean | Prisma.RegistrationRequestDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["registrationTimelineStep"]>;
export type RegistrationTimelineStepSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    requestId?: boolean;
    title?: boolean;
    actorName?: boolean;
    statusBadge?: boolean;
    isCompleted?: boolean;
    completedAt?: boolean;
    order?: boolean;
    createdAt?: boolean;
    request?: boolean | Prisma.RegistrationRequestDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["registrationTimelineStep"]>;
export type RegistrationTimelineStepSelectScalar = {
    id?: boolean;
    requestId?: boolean;
    title?: boolean;
    actorName?: boolean;
    statusBadge?: boolean;
    isCompleted?: boolean;
    completedAt?: boolean;
    order?: boolean;
    createdAt?: boolean;
};
export type RegistrationTimelineStepOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "requestId" | "title" | "actorName" | "statusBadge" | "isCompleted" | "completedAt" | "order" | "createdAt", ExtArgs["result"]["registrationTimelineStep"]>;
export type RegistrationTimelineStepInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    request?: boolean | Prisma.RegistrationRequestDefaultArgs<ExtArgs>;
};
export type RegistrationTimelineStepIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    request?: boolean | Prisma.RegistrationRequestDefaultArgs<ExtArgs>;
};
export type RegistrationTimelineStepIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    request?: boolean | Prisma.RegistrationRequestDefaultArgs<ExtArgs>;
};
export type $RegistrationTimelineStepPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "RegistrationTimelineStep";
    objects: {
        request: Prisma.$RegistrationRequestPayload<ExtArgs>;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        requestId: string;
        title: string;
        actorName: string;
        statusBadge: string | null;
        isCompleted: boolean;
        completedAt: Date | null;
        order: number;
        createdAt: Date;
    }, ExtArgs["result"]["registrationTimelineStep"]>;
    composites: {};
};
export type RegistrationTimelineStepGetPayload<S extends boolean | null | undefined | RegistrationTimelineStepDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$RegistrationTimelineStepPayload, S>;
export type RegistrationTimelineStepCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<RegistrationTimelineStepFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: RegistrationTimelineStepCountAggregateInputType | true;
};
export interface RegistrationTimelineStepDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['RegistrationTimelineStep'];
        meta: {
            name: 'RegistrationTimelineStep';
        };
    };
    /**
     * Find zero or one RegistrationTimelineStep that matches the filter.
     * @param {RegistrationTimelineStepFindUniqueArgs} args - Arguments to find a RegistrationTimelineStep
     * @example
     * // Get one RegistrationTimelineStep
     * const registrationTimelineStep = await prisma.registrationTimelineStep.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends RegistrationTimelineStepFindUniqueArgs>(args: Prisma.SelectSubset<T, RegistrationTimelineStepFindUniqueArgs<ExtArgs>>): Prisma.Prisma__RegistrationTimelineStepClient<runtime.Types.Result.GetResult<Prisma.$RegistrationTimelineStepPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    /**
     * Find one RegistrationTimelineStep that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {RegistrationTimelineStepFindUniqueOrThrowArgs} args - Arguments to find a RegistrationTimelineStep
     * @example
     * // Get one RegistrationTimelineStep
     * const registrationTimelineStep = await prisma.registrationTimelineStep.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends RegistrationTimelineStepFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, RegistrationTimelineStepFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__RegistrationTimelineStepClient<runtime.Types.Result.GetResult<Prisma.$RegistrationTimelineStepPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Find the first RegistrationTimelineStep that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RegistrationTimelineStepFindFirstArgs} args - Arguments to find a RegistrationTimelineStep
     * @example
     * // Get one RegistrationTimelineStep
     * const registrationTimelineStep = await prisma.registrationTimelineStep.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends RegistrationTimelineStepFindFirstArgs>(args?: Prisma.SelectSubset<T, RegistrationTimelineStepFindFirstArgs<ExtArgs>>): Prisma.Prisma__RegistrationTimelineStepClient<runtime.Types.Result.GetResult<Prisma.$RegistrationTimelineStepPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    /**
     * Find the first RegistrationTimelineStep that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RegistrationTimelineStepFindFirstOrThrowArgs} args - Arguments to find a RegistrationTimelineStep
     * @example
     * // Get one RegistrationTimelineStep
     * const registrationTimelineStep = await prisma.registrationTimelineStep.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends RegistrationTimelineStepFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, RegistrationTimelineStepFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__RegistrationTimelineStepClient<runtime.Types.Result.GetResult<Prisma.$RegistrationTimelineStepPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Find zero or more RegistrationTimelineSteps that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RegistrationTimelineStepFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all RegistrationTimelineSteps
     * const registrationTimelineSteps = await prisma.registrationTimelineStep.findMany()
     *
     * // Get first 10 RegistrationTimelineSteps
     * const registrationTimelineSteps = await prisma.registrationTimelineStep.findMany({ take: 10 })
     *
     * // Only select the `id`
     * const registrationTimelineStepWithIdOnly = await prisma.registrationTimelineStep.findMany({ select: { id: true } })
     *
     */
    findMany<T extends RegistrationTimelineStepFindManyArgs>(args?: Prisma.SelectSubset<T, RegistrationTimelineStepFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$RegistrationTimelineStepPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    /**
     * Create a RegistrationTimelineStep.
     * @param {RegistrationTimelineStepCreateArgs} args - Arguments to create a RegistrationTimelineStep.
     * @example
     * // Create one RegistrationTimelineStep
     * const RegistrationTimelineStep = await prisma.registrationTimelineStep.create({
     *   data: {
     *     // ... data to create a RegistrationTimelineStep
     *   }
     * })
     *
     */
    create<T extends RegistrationTimelineStepCreateArgs>(args: Prisma.SelectSubset<T, RegistrationTimelineStepCreateArgs<ExtArgs>>): Prisma.Prisma__RegistrationTimelineStepClient<runtime.Types.Result.GetResult<Prisma.$RegistrationTimelineStepPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Create many RegistrationTimelineSteps.
     * @param {RegistrationTimelineStepCreateManyArgs} args - Arguments to create many RegistrationTimelineSteps.
     * @example
     * // Create many RegistrationTimelineSteps
     * const registrationTimelineStep = await prisma.registrationTimelineStep.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     */
    createMany<T extends RegistrationTimelineStepCreateManyArgs>(args?: Prisma.SelectSubset<T, RegistrationTimelineStepCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Create many RegistrationTimelineSteps and returns the data saved in the database.
     * @param {RegistrationTimelineStepCreateManyAndReturnArgs} args - Arguments to create many RegistrationTimelineSteps.
     * @example
     * // Create many RegistrationTimelineSteps
     * const registrationTimelineStep = await prisma.registrationTimelineStep.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Create many RegistrationTimelineSteps and only return the `id`
     * const registrationTimelineStepWithIdOnly = await prisma.registrationTimelineStep.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    createManyAndReturn<T extends RegistrationTimelineStepCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, RegistrationTimelineStepCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$RegistrationTimelineStepPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    /**
     * Delete a RegistrationTimelineStep.
     * @param {RegistrationTimelineStepDeleteArgs} args - Arguments to delete one RegistrationTimelineStep.
     * @example
     * // Delete one RegistrationTimelineStep
     * const RegistrationTimelineStep = await prisma.registrationTimelineStep.delete({
     *   where: {
     *     // ... filter to delete one RegistrationTimelineStep
     *   }
     * })
     *
     */
    delete<T extends RegistrationTimelineStepDeleteArgs>(args: Prisma.SelectSubset<T, RegistrationTimelineStepDeleteArgs<ExtArgs>>): Prisma.Prisma__RegistrationTimelineStepClient<runtime.Types.Result.GetResult<Prisma.$RegistrationTimelineStepPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Update one RegistrationTimelineStep.
     * @param {RegistrationTimelineStepUpdateArgs} args - Arguments to update one RegistrationTimelineStep.
     * @example
     * // Update one RegistrationTimelineStep
     * const registrationTimelineStep = await prisma.registrationTimelineStep.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    update<T extends RegistrationTimelineStepUpdateArgs>(args: Prisma.SelectSubset<T, RegistrationTimelineStepUpdateArgs<ExtArgs>>): Prisma.Prisma__RegistrationTimelineStepClient<runtime.Types.Result.GetResult<Prisma.$RegistrationTimelineStepPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Delete zero or more RegistrationTimelineSteps.
     * @param {RegistrationTimelineStepDeleteManyArgs} args - Arguments to filter RegistrationTimelineSteps to delete.
     * @example
     * // Delete a few RegistrationTimelineSteps
     * const { count } = await prisma.registrationTimelineStep.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     */
    deleteMany<T extends RegistrationTimelineStepDeleteManyArgs>(args?: Prisma.SelectSubset<T, RegistrationTimelineStepDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Update zero or more RegistrationTimelineSteps.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RegistrationTimelineStepUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many RegistrationTimelineSteps
     * const registrationTimelineStep = await prisma.registrationTimelineStep.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    updateMany<T extends RegistrationTimelineStepUpdateManyArgs>(args: Prisma.SelectSubset<T, RegistrationTimelineStepUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Update zero or more RegistrationTimelineSteps and returns the data updated in the database.
     * @param {RegistrationTimelineStepUpdateManyAndReturnArgs} args - Arguments to update many RegistrationTimelineSteps.
     * @example
     * // Update many RegistrationTimelineSteps
     * const registrationTimelineStep = await prisma.registrationTimelineStep.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Update zero or more RegistrationTimelineSteps and only return the `id`
     * const registrationTimelineStepWithIdOnly = await prisma.registrationTimelineStep.updateManyAndReturn({
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
    updateManyAndReturn<T extends RegistrationTimelineStepUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, RegistrationTimelineStepUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$RegistrationTimelineStepPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    /**
     * Create or update one RegistrationTimelineStep.
     * @param {RegistrationTimelineStepUpsertArgs} args - Arguments to update or create a RegistrationTimelineStep.
     * @example
     * // Update or create a RegistrationTimelineStep
     * const registrationTimelineStep = await prisma.registrationTimelineStep.upsert({
     *   create: {
     *     // ... data to create a RegistrationTimelineStep
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the RegistrationTimelineStep we want to update
     *   }
     * })
     */
    upsert<T extends RegistrationTimelineStepUpsertArgs>(args: Prisma.SelectSubset<T, RegistrationTimelineStepUpsertArgs<ExtArgs>>): Prisma.Prisma__RegistrationTimelineStepClient<runtime.Types.Result.GetResult<Prisma.$RegistrationTimelineStepPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Count the number of RegistrationTimelineSteps.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RegistrationTimelineStepCountArgs} args - Arguments to filter RegistrationTimelineSteps to count.
     * @example
     * // Count the number of RegistrationTimelineSteps
     * const count = await prisma.registrationTimelineStep.count({
     *   where: {
     *     // ... the filter for the RegistrationTimelineSteps we want to count
     *   }
     * })
    **/
    count<T extends RegistrationTimelineStepCountArgs>(args?: Prisma.Subset<T, RegistrationTimelineStepCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], RegistrationTimelineStepCountAggregateOutputType> : number>;
    /**
     * Allows you to perform aggregations operations on a RegistrationTimelineStep.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RegistrationTimelineStepAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends RegistrationTimelineStepAggregateArgs>(args: Prisma.Subset<T, RegistrationTimelineStepAggregateArgs>): Prisma.PrismaPromise<GetRegistrationTimelineStepAggregateType<T>>;
    /**
     * Group by RegistrationTimelineStep.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RegistrationTimelineStepGroupByArgs} args - Group by arguments.
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
    groupBy<T extends RegistrationTimelineStepGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: RegistrationTimelineStepGroupByArgs['orderBy'];
    } : {
        orderBy?: RegistrationTimelineStepGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, RegistrationTimelineStepGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetRegistrationTimelineStepGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    /**
     * Fields of the RegistrationTimelineStep model
     */
    readonly fields: RegistrationTimelineStepFieldRefs;
}
/**
 * The delegate class that acts as a "Promise-like" for RegistrationTimelineStep.
 * Why is this prefixed with `Prisma__`?
 * Because we want to prevent naming conflicts as mentioned in
 * https://github.com/prisma/prisma-client-js/issues/707
 */
export interface Prisma__RegistrationTimelineStepClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    request<T extends Prisma.RegistrationRequestDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.RegistrationRequestDefaultArgs<ExtArgs>>): Prisma.Prisma__RegistrationRequestClient<runtime.Types.Result.GetResult<Prisma.$RegistrationRequestPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
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
 * Fields of the RegistrationTimelineStep model
 */
export interface RegistrationTimelineStepFieldRefs {
    readonly id: Prisma.FieldRef<"RegistrationTimelineStep", 'String'>;
    readonly requestId: Prisma.FieldRef<"RegistrationTimelineStep", 'String'>;
    readonly title: Prisma.FieldRef<"RegistrationTimelineStep", 'String'>;
    readonly actorName: Prisma.FieldRef<"RegistrationTimelineStep", 'String'>;
    readonly statusBadge: Prisma.FieldRef<"RegistrationTimelineStep", 'String'>;
    readonly isCompleted: Prisma.FieldRef<"RegistrationTimelineStep", 'Boolean'>;
    readonly completedAt: Prisma.FieldRef<"RegistrationTimelineStep", 'DateTime'>;
    readonly order: Prisma.FieldRef<"RegistrationTimelineStep", 'Int'>;
    readonly createdAt: Prisma.FieldRef<"RegistrationTimelineStep", 'DateTime'>;
}
/**
 * RegistrationTimelineStep findUnique
 */
export type RegistrationTimelineStepFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RegistrationTimelineStep
     */
    select?: Prisma.RegistrationTimelineStepSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the RegistrationTimelineStep
     */
    omit?: Prisma.RegistrationTimelineStepOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.RegistrationTimelineStepInclude<ExtArgs> | null;
    /**
     * Filter, which RegistrationTimelineStep to fetch.
     */
    where: Prisma.RegistrationTimelineStepWhereUniqueInput;
};
/**
 * RegistrationTimelineStep findUniqueOrThrow
 */
export type RegistrationTimelineStepFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RegistrationTimelineStep
     */
    select?: Prisma.RegistrationTimelineStepSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the RegistrationTimelineStep
     */
    omit?: Prisma.RegistrationTimelineStepOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.RegistrationTimelineStepInclude<ExtArgs> | null;
    /**
     * Filter, which RegistrationTimelineStep to fetch.
     */
    where: Prisma.RegistrationTimelineStepWhereUniqueInput;
};
/**
 * RegistrationTimelineStep findFirst
 */
export type RegistrationTimelineStepFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RegistrationTimelineStep
     */
    select?: Prisma.RegistrationTimelineStepSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the RegistrationTimelineStep
     */
    omit?: Prisma.RegistrationTimelineStepOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.RegistrationTimelineStepInclude<ExtArgs> | null;
    /**
     * Filter, which RegistrationTimelineStep to fetch.
     */
    where?: Prisma.RegistrationTimelineStepWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of RegistrationTimelineSteps to fetch.
     */
    orderBy?: Prisma.RegistrationTimelineStepOrderByWithRelationInput | Prisma.RegistrationTimelineStepOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for RegistrationTimelineSteps.
     */
    cursor?: Prisma.RegistrationTimelineStepWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` RegistrationTimelineSteps from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` RegistrationTimelineSteps.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of RegistrationTimelineSteps.
     */
    distinct?: Prisma.RegistrationTimelineStepScalarFieldEnum | Prisma.RegistrationTimelineStepScalarFieldEnum[];
};
/**
 * RegistrationTimelineStep findFirstOrThrow
 */
export type RegistrationTimelineStepFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RegistrationTimelineStep
     */
    select?: Prisma.RegistrationTimelineStepSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the RegistrationTimelineStep
     */
    omit?: Prisma.RegistrationTimelineStepOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.RegistrationTimelineStepInclude<ExtArgs> | null;
    /**
     * Filter, which RegistrationTimelineStep to fetch.
     */
    where?: Prisma.RegistrationTimelineStepWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of RegistrationTimelineSteps to fetch.
     */
    orderBy?: Prisma.RegistrationTimelineStepOrderByWithRelationInput | Prisma.RegistrationTimelineStepOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for RegistrationTimelineSteps.
     */
    cursor?: Prisma.RegistrationTimelineStepWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` RegistrationTimelineSteps from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` RegistrationTimelineSteps.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of RegistrationTimelineSteps.
     */
    distinct?: Prisma.RegistrationTimelineStepScalarFieldEnum | Prisma.RegistrationTimelineStepScalarFieldEnum[];
};
/**
 * RegistrationTimelineStep findMany
 */
export type RegistrationTimelineStepFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RegistrationTimelineStep
     */
    select?: Prisma.RegistrationTimelineStepSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the RegistrationTimelineStep
     */
    omit?: Prisma.RegistrationTimelineStepOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.RegistrationTimelineStepInclude<ExtArgs> | null;
    /**
     * Filter, which RegistrationTimelineSteps to fetch.
     */
    where?: Prisma.RegistrationTimelineStepWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of RegistrationTimelineSteps to fetch.
     */
    orderBy?: Prisma.RegistrationTimelineStepOrderByWithRelationInput | Prisma.RegistrationTimelineStepOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing RegistrationTimelineSteps.
     */
    cursor?: Prisma.RegistrationTimelineStepWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` RegistrationTimelineSteps from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` RegistrationTimelineSteps.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of RegistrationTimelineSteps.
     */
    distinct?: Prisma.RegistrationTimelineStepScalarFieldEnum | Prisma.RegistrationTimelineStepScalarFieldEnum[];
};
/**
 * RegistrationTimelineStep create
 */
export type RegistrationTimelineStepCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RegistrationTimelineStep
     */
    select?: Prisma.RegistrationTimelineStepSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the RegistrationTimelineStep
     */
    omit?: Prisma.RegistrationTimelineStepOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.RegistrationTimelineStepInclude<ExtArgs> | null;
    /**
     * The data needed to create a RegistrationTimelineStep.
     */
    data: Prisma.XOR<Prisma.RegistrationTimelineStepCreateInput, Prisma.RegistrationTimelineStepUncheckedCreateInput>;
};
/**
 * RegistrationTimelineStep createMany
 */
export type RegistrationTimelineStepCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * The data used to create many RegistrationTimelineSteps.
     */
    data: Prisma.RegistrationTimelineStepCreateManyInput | Prisma.RegistrationTimelineStepCreateManyInput[];
    skipDuplicates?: boolean;
};
/**
 * RegistrationTimelineStep createManyAndReturn
 */
export type RegistrationTimelineStepCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RegistrationTimelineStep
     */
    select?: Prisma.RegistrationTimelineStepSelectCreateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the RegistrationTimelineStep
     */
    omit?: Prisma.RegistrationTimelineStepOmit<ExtArgs> | null;
    /**
     * The data used to create many RegistrationTimelineSteps.
     */
    data: Prisma.RegistrationTimelineStepCreateManyInput | Prisma.RegistrationTimelineStepCreateManyInput[];
    skipDuplicates?: boolean;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.RegistrationTimelineStepIncludeCreateManyAndReturn<ExtArgs> | null;
};
/**
 * RegistrationTimelineStep update
 */
export type RegistrationTimelineStepUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RegistrationTimelineStep
     */
    select?: Prisma.RegistrationTimelineStepSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the RegistrationTimelineStep
     */
    omit?: Prisma.RegistrationTimelineStepOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.RegistrationTimelineStepInclude<ExtArgs> | null;
    /**
     * The data needed to update a RegistrationTimelineStep.
     */
    data: Prisma.XOR<Prisma.RegistrationTimelineStepUpdateInput, Prisma.RegistrationTimelineStepUncheckedUpdateInput>;
    /**
     * Choose, which RegistrationTimelineStep to update.
     */
    where: Prisma.RegistrationTimelineStepWhereUniqueInput;
};
/**
 * RegistrationTimelineStep updateMany
 */
export type RegistrationTimelineStepUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * The data used to update RegistrationTimelineSteps.
     */
    data: Prisma.XOR<Prisma.RegistrationTimelineStepUpdateManyMutationInput, Prisma.RegistrationTimelineStepUncheckedUpdateManyInput>;
    /**
     * Filter which RegistrationTimelineSteps to update
     */
    where?: Prisma.RegistrationTimelineStepWhereInput;
    /**
     * Limit how many RegistrationTimelineSteps to update.
     */
    limit?: number;
};
/**
 * RegistrationTimelineStep updateManyAndReturn
 */
export type RegistrationTimelineStepUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RegistrationTimelineStep
     */
    select?: Prisma.RegistrationTimelineStepSelectUpdateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the RegistrationTimelineStep
     */
    omit?: Prisma.RegistrationTimelineStepOmit<ExtArgs> | null;
    /**
     * The data used to update RegistrationTimelineSteps.
     */
    data: Prisma.XOR<Prisma.RegistrationTimelineStepUpdateManyMutationInput, Prisma.RegistrationTimelineStepUncheckedUpdateManyInput>;
    /**
     * Filter which RegistrationTimelineSteps to update
     */
    where?: Prisma.RegistrationTimelineStepWhereInput;
    /**
     * Limit how many RegistrationTimelineSteps to update.
     */
    limit?: number;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.RegistrationTimelineStepIncludeUpdateManyAndReturn<ExtArgs> | null;
};
/**
 * RegistrationTimelineStep upsert
 */
export type RegistrationTimelineStepUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RegistrationTimelineStep
     */
    select?: Prisma.RegistrationTimelineStepSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the RegistrationTimelineStep
     */
    omit?: Prisma.RegistrationTimelineStepOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.RegistrationTimelineStepInclude<ExtArgs> | null;
    /**
     * The filter to search for the RegistrationTimelineStep to update in case it exists.
     */
    where: Prisma.RegistrationTimelineStepWhereUniqueInput;
    /**
     * In case the RegistrationTimelineStep found by the `where` argument doesn't exist, create a new RegistrationTimelineStep with this data.
     */
    create: Prisma.XOR<Prisma.RegistrationTimelineStepCreateInput, Prisma.RegistrationTimelineStepUncheckedCreateInput>;
    /**
     * In case the RegistrationTimelineStep was found with the provided `where` argument, update it with this data.
     */
    update: Prisma.XOR<Prisma.RegistrationTimelineStepUpdateInput, Prisma.RegistrationTimelineStepUncheckedUpdateInput>;
};
/**
 * RegistrationTimelineStep delete
 */
export type RegistrationTimelineStepDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RegistrationTimelineStep
     */
    select?: Prisma.RegistrationTimelineStepSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the RegistrationTimelineStep
     */
    omit?: Prisma.RegistrationTimelineStepOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.RegistrationTimelineStepInclude<ExtArgs> | null;
    /**
     * Filter which RegistrationTimelineStep to delete.
     */
    where: Prisma.RegistrationTimelineStepWhereUniqueInput;
};
/**
 * RegistrationTimelineStep deleteMany
 */
export type RegistrationTimelineStepDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Filter which RegistrationTimelineSteps to delete
     */
    where?: Prisma.RegistrationTimelineStepWhereInput;
    /**
     * Limit how many RegistrationTimelineSteps to delete.
     */
    limit?: number;
};
/**
 * RegistrationTimelineStep without action
 */
export type RegistrationTimelineStepDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RegistrationTimelineStep
     */
    select?: Prisma.RegistrationTimelineStepSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the RegistrationTimelineStep
     */
    omit?: Prisma.RegistrationTimelineStepOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.RegistrationTimelineStepInclude<ExtArgs> | null;
};
