import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace";
/**
 * Model RegistrationComment
 *
 */
export type RegistrationCommentModel = runtime.Types.Result.DefaultSelection<Prisma.$RegistrationCommentPayload>;
export type AggregateRegistrationComment = {
    _count: RegistrationCommentCountAggregateOutputType | null;
    _min: RegistrationCommentMinAggregateOutputType | null;
    _max: RegistrationCommentMaxAggregateOutputType | null;
};
export type RegistrationCommentMinAggregateOutputType = {
    id: string | null;
    requestId: string | null;
    authorId: string | null;
    content: string | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type RegistrationCommentMaxAggregateOutputType = {
    id: string | null;
    requestId: string | null;
    authorId: string | null;
    content: string | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type RegistrationCommentCountAggregateOutputType = {
    id: number;
    requestId: number;
    authorId: number;
    content: number;
    createdAt: number;
    updatedAt: number;
    _all: number;
};
export type RegistrationCommentMinAggregateInputType = {
    id?: true;
    requestId?: true;
    authorId?: true;
    content?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type RegistrationCommentMaxAggregateInputType = {
    id?: true;
    requestId?: true;
    authorId?: true;
    content?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type RegistrationCommentCountAggregateInputType = {
    id?: true;
    requestId?: true;
    authorId?: true;
    content?: true;
    createdAt?: true;
    updatedAt?: true;
    _all?: true;
};
export type RegistrationCommentAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Filter which RegistrationComment to aggregate.
     */
    where?: Prisma.RegistrationCommentWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of RegistrationComments to fetch.
     */
    orderBy?: Prisma.RegistrationCommentOrderByWithRelationInput | Prisma.RegistrationCommentOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     */
    cursor?: Prisma.RegistrationCommentWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` RegistrationComments from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` RegistrationComments.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned RegistrationComments
    **/
    _count?: true | RegistrationCommentCountAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
    **/
    _min?: RegistrationCommentMinAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
    **/
    _max?: RegistrationCommentMaxAggregateInputType;
};
export type GetRegistrationCommentAggregateType<T extends RegistrationCommentAggregateArgs> = {
    [P in keyof T & keyof AggregateRegistrationComment]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateRegistrationComment[P]> : Prisma.GetScalarType<T[P], AggregateRegistrationComment[P]>;
};
export type RegistrationCommentGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.RegistrationCommentWhereInput;
    orderBy?: Prisma.RegistrationCommentOrderByWithAggregationInput | Prisma.RegistrationCommentOrderByWithAggregationInput[];
    by: Prisma.RegistrationCommentScalarFieldEnum[] | Prisma.RegistrationCommentScalarFieldEnum;
    having?: Prisma.RegistrationCommentScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: RegistrationCommentCountAggregateInputType | true;
    _min?: RegistrationCommentMinAggregateInputType;
    _max?: RegistrationCommentMaxAggregateInputType;
};
export type RegistrationCommentGroupByOutputType = {
    id: string;
    requestId: string;
    authorId: string;
    content: string;
    createdAt: Date;
    updatedAt: Date;
    _count: RegistrationCommentCountAggregateOutputType | null;
    _min: RegistrationCommentMinAggregateOutputType | null;
    _max: RegistrationCommentMaxAggregateOutputType | null;
};
export type GetRegistrationCommentGroupByPayload<T extends RegistrationCommentGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<RegistrationCommentGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof RegistrationCommentGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], RegistrationCommentGroupByOutputType[P]> : Prisma.GetScalarType<T[P], RegistrationCommentGroupByOutputType[P]>;
}>>;
export type RegistrationCommentWhereInput = {
    AND?: Prisma.RegistrationCommentWhereInput | Prisma.RegistrationCommentWhereInput[];
    OR?: Prisma.RegistrationCommentWhereInput[];
    NOT?: Prisma.RegistrationCommentWhereInput | Prisma.RegistrationCommentWhereInput[];
    id?: Prisma.StringFilter<"RegistrationComment"> | string;
    requestId?: Prisma.StringFilter<"RegistrationComment"> | string;
    authorId?: Prisma.StringFilter<"RegistrationComment"> | string;
    content?: Prisma.StringFilter<"RegistrationComment"> | string;
    createdAt?: Prisma.DateTimeFilter<"RegistrationComment"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"RegistrationComment"> | Date | string;
    request?: Prisma.XOR<Prisma.RegistrationRequestScalarRelationFilter, Prisma.RegistrationRequestWhereInput>;
    author?: Prisma.XOR<Prisma.UserScalarRelationFilter, Prisma.UserWhereInput>;
};
export type RegistrationCommentOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    requestId?: Prisma.SortOrder;
    authorId?: Prisma.SortOrder;
    content?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    request?: Prisma.RegistrationRequestOrderByWithRelationInput;
    author?: Prisma.UserOrderByWithRelationInput;
};
export type RegistrationCommentWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    AND?: Prisma.RegistrationCommentWhereInput | Prisma.RegistrationCommentWhereInput[];
    OR?: Prisma.RegistrationCommentWhereInput[];
    NOT?: Prisma.RegistrationCommentWhereInput | Prisma.RegistrationCommentWhereInput[];
    requestId?: Prisma.StringFilter<"RegistrationComment"> | string;
    authorId?: Prisma.StringFilter<"RegistrationComment"> | string;
    content?: Prisma.StringFilter<"RegistrationComment"> | string;
    createdAt?: Prisma.DateTimeFilter<"RegistrationComment"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"RegistrationComment"> | Date | string;
    request?: Prisma.XOR<Prisma.RegistrationRequestScalarRelationFilter, Prisma.RegistrationRequestWhereInput>;
    author?: Prisma.XOR<Prisma.UserScalarRelationFilter, Prisma.UserWhereInput>;
}, "id">;
export type RegistrationCommentOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    requestId?: Prisma.SortOrder;
    authorId?: Prisma.SortOrder;
    content?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    _count?: Prisma.RegistrationCommentCountOrderByAggregateInput;
    _max?: Prisma.RegistrationCommentMaxOrderByAggregateInput;
    _min?: Prisma.RegistrationCommentMinOrderByAggregateInput;
};
export type RegistrationCommentScalarWhereWithAggregatesInput = {
    AND?: Prisma.RegistrationCommentScalarWhereWithAggregatesInput | Prisma.RegistrationCommentScalarWhereWithAggregatesInput[];
    OR?: Prisma.RegistrationCommentScalarWhereWithAggregatesInput[];
    NOT?: Prisma.RegistrationCommentScalarWhereWithAggregatesInput | Prisma.RegistrationCommentScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"RegistrationComment"> | string;
    requestId?: Prisma.StringWithAggregatesFilter<"RegistrationComment"> | string;
    authorId?: Prisma.StringWithAggregatesFilter<"RegistrationComment"> | string;
    content?: Prisma.StringWithAggregatesFilter<"RegistrationComment"> | string;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"RegistrationComment"> | Date | string;
    updatedAt?: Prisma.DateTimeWithAggregatesFilter<"RegistrationComment"> | Date | string;
};
export type RegistrationCommentCreateInput = {
    id?: string;
    content: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    request: Prisma.RegistrationRequestCreateNestedOneWithoutCommentsInput;
    author: Prisma.UserCreateNestedOneWithoutAuthoredRegistrationCommentsInput;
};
export type RegistrationCommentUncheckedCreateInput = {
    id?: string;
    requestId: string;
    authorId: string;
    content: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type RegistrationCommentUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    content?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    request?: Prisma.RegistrationRequestUpdateOneRequiredWithoutCommentsNestedInput;
    author?: Prisma.UserUpdateOneRequiredWithoutAuthoredRegistrationCommentsNestedInput;
};
export type RegistrationCommentUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    requestId?: Prisma.StringFieldUpdateOperationsInput | string;
    authorId?: Prisma.StringFieldUpdateOperationsInput | string;
    content?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type RegistrationCommentCreateManyInput = {
    id?: string;
    requestId: string;
    authorId: string;
    content: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type RegistrationCommentUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    content?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type RegistrationCommentUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    requestId?: Prisma.StringFieldUpdateOperationsInput | string;
    authorId?: Prisma.StringFieldUpdateOperationsInput | string;
    content?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type RegistrationCommentListRelationFilter = {
    every?: Prisma.RegistrationCommentWhereInput;
    some?: Prisma.RegistrationCommentWhereInput;
    none?: Prisma.RegistrationCommentWhereInput;
};
export type RegistrationCommentOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type RegistrationCommentCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    requestId?: Prisma.SortOrder;
    authorId?: Prisma.SortOrder;
    content?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type RegistrationCommentMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    requestId?: Prisma.SortOrder;
    authorId?: Prisma.SortOrder;
    content?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type RegistrationCommentMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    requestId?: Prisma.SortOrder;
    authorId?: Prisma.SortOrder;
    content?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type RegistrationCommentCreateNestedManyWithoutAuthorInput = {
    create?: Prisma.XOR<Prisma.RegistrationCommentCreateWithoutAuthorInput, Prisma.RegistrationCommentUncheckedCreateWithoutAuthorInput> | Prisma.RegistrationCommentCreateWithoutAuthorInput[] | Prisma.RegistrationCommentUncheckedCreateWithoutAuthorInput[];
    connectOrCreate?: Prisma.RegistrationCommentCreateOrConnectWithoutAuthorInput | Prisma.RegistrationCommentCreateOrConnectWithoutAuthorInput[];
    createMany?: Prisma.RegistrationCommentCreateManyAuthorInputEnvelope;
    connect?: Prisma.RegistrationCommentWhereUniqueInput | Prisma.RegistrationCommentWhereUniqueInput[];
};
export type RegistrationCommentUncheckedCreateNestedManyWithoutAuthorInput = {
    create?: Prisma.XOR<Prisma.RegistrationCommentCreateWithoutAuthorInput, Prisma.RegistrationCommentUncheckedCreateWithoutAuthorInput> | Prisma.RegistrationCommentCreateWithoutAuthorInput[] | Prisma.RegistrationCommentUncheckedCreateWithoutAuthorInput[];
    connectOrCreate?: Prisma.RegistrationCommentCreateOrConnectWithoutAuthorInput | Prisma.RegistrationCommentCreateOrConnectWithoutAuthorInput[];
    createMany?: Prisma.RegistrationCommentCreateManyAuthorInputEnvelope;
    connect?: Prisma.RegistrationCommentWhereUniqueInput | Prisma.RegistrationCommentWhereUniqueInput[];
};
export type RegistrationCommentUpdateManyWithoutAuthorNestedInput = {
    create?: Prisma.XOR<Prisma.RegistrationCommentCreateWithoutAuthorInput, Prisma.RegistrationCommentUncheckedCreateWithoutAuthorInput> | Prisma.RegistrationCommentCreateWithoutAuthorInput[] | Prisma.RegistrationCommentUncheckedCreateWithoutAuthorInput[];
    connectOrCreate?: Prisma.RegistrationCommentCreateOrConnectWithoutAuthorInput | Prisma.RegistrationCommentCreateOrConnectWithoutAuthorInput[];
    upsert?: Prisma.RegistrationCommentUpsertWithWhereUniqueWithoutAuthorInput | Prisma.RegistrationCommentUpsertWithWhereUniqueWithoutAuthorInput[];
    createMany?: Prisma.RegistrationCommentCreateManyAuthorInputEnvelope;
    set?: Prisma.RegistrationCommentWhereUniqueInput | Prisma.RegistrationCommentWhereUniqueInput[];
    disconnect?: Prisma.RegistrationCommentWhereUniqueInput | Prisma.RegistrationCommentWhereUniqueInput[];
    delete?: Prisma.RegistrationCommentWhereUniqueInput | Prisma.RegistrationCommentWhereUniqueInput[];
    connect?: Prisma.RegistrationCommentWhereUniqueInput | Prisma.RegistrationCommentWhereUniqueInput[];
    update?: Prisma.RegistrationCommentUpdateWithWhereUniqueWithoutAuthorInput | Prisma.RegistrationCommentUpdateWithWhereUniqueWithoutAuthorInput[];
    updateMany?: Prisma.RegistrationCommentUpdateManyWithWhereWithoutAuthorInput | Prisma.RegistrationCommentUpdateManyWithWhereWithoutAuthorInput[];
    deleteMany?: Prisma.RegistrationCommentScalarWhereInput | Prisma.RegistrationCommentScalarWhereInput[];
};
export type RegistrationCommentUncheckedUpdateManyWithoutAuthorNestedInput = {
    create?: Prisma.XOR<Prisma.RegistrationCommentCreateWithoutAuthorInput, Prisma.RegistrationCommentUncheckedCreateWithoutAuthorInput> | Prisma.RegistrationCommentCreateWithoutAuthorInput[] | Prisma.RegistrationCommentUncheckedCreateWithoutAuthorInput[];
    connectOrCreate?: Prisma.RegistrationCommentCreateOrConnectWithoutAuthorInput | Prisma.RegistrationCommentCreateOrConnectWithoutAuthorInput[];
    upsert?: Prisma.RegistrationCommentUpsertWithWhereUniqueWithoutAuthorInput | Prisma.RegistrationCommentUpsertWithWhereUniqueWithoutAuthorInput[];
    createMany?: Prisma.RegistrationCommentCreateManyAuthorInputEnvelope;
    set?: Prisma.RegistrationCommentWhereUniqueInput | Prisma.RegistrationCommentWhereUniqueInput[];
    disconnect?: Prisma.RegistrationCommentWhereUniqueInput | Prisma.RegistrationCommentWhereUniqueInput[];
    delete?: Prisma.RegistrationCommentWhereUniqueInput | Prisma.RegistrationCommentWhereUniqueInput[];
    connect?: Prisma.RegistrationCommentWhereUniqueInput | Prisma.RegistrationCommentWhereUniqueInput[];
    update?: Prisma.RegistrationCommentUpdateWithWhereUniqueWithoutAuthorInput | Prisma.RegistrationCommentUpdateWithWhereUniqueWithoutAuthorInput[];
    updateMany?: Prisma.RegistrationCommentUpdateManyWithWhereWithoutAuthorInput | Prisma.RegistrationCommentUpdateManyWithWhereWithoutAuthorInput[];
    deleteMany?: Prisma.RegistrationCommentScalarWhereInput | Prisma.RegistrationCommentScalarWhereInput[];
};
export type RegistrationCommentCreateNestedManyWithoutRequestInput = {
    create?: Prisma.XOR<Prisma.RegistrationCommentCreateWithoutRequestInput, Prisma.RegistrationCommentUncheckedCreateWithoutRequestInput> | Prisma.RegistrationCommentCreateWithoutRequestInput[] | Prisma.RegistrationCommentUncheckedCreateWithoutRequestInput[];
    connectOrCreate?: Prisma.RegistrationCommentCreateOrConnectWithoutRequestInput | Prisma.RegistrationCommentCreateOrConnectWithoutRequestInput[];
    createMany?: Prisma.RegistrationCommentCreateManyRequestInputEnvelope;
    connect?: Prisma.RegistrationCommentWhereUniqueInput | Prisma.RegistrationCommentWhereUniqueInput[];
};
export type RegistrationCommentUncheckedCreateNestedManyWithoutRequestInput = {
    create?: Prisma.XOR<Prisma.RegistrationCommentCreateWithoutRequestInput, Prisma.RegistrationCommentUncheckedCreateWithoutRequestInput> | Prisma.RegistrationCommentCreateWithoutRequestInput[] | Prisma.RegistrationCommentUncheckedCreateWithoutRequestInput[];
    connectOrCreate?: Prisma.RegistrationCommentCreateOrConnectWithoutRequestInput | Prisma.RegistrationCommentCreateOrConnectWithoutRequestInput[];
    createMany?: Prisma.RegistrationCommentCreateManyRequestInputEnvelope;
    connect?: Prisma.RegistrationCommentWhereUniqueInput | Prisma.RegistrationCommentWhereUniqueInput[];
};
export type RegistrationCommentUpdateManyWithoutRequestNestedInput = {
    create?: Prisma.XOR<Prisma.RegistrationCommentCreateWithoutRequestInput, Prisma.RegistrationCommentUncheckedCreateWithoutRequestInput> | Prisma.RegistrationCommentCreateWithoutRequestInput[] | Prisma.RegistrationCommentUncheckedCreateWithoutRequestInput[];
    connectOrCreate?: Prisma.RegistrationCommentCreateOrConnectWithoutRequestInput | Prisma.RegistrationCommentCreateOrConnectWithoutRequestInput[];
    upsert?: Prisma.RegistrationCommentUpsertWithWhereUniqueWithoutRequestInput | Prisma.RegistrationCommentUpsertWithWhereUniqueWithoutRequestInput[];
    createMany?: Prisma.RegistrationCommentCreateManyRequestInputEnvelope;
    set?: Prisma.RegistrationCommentWhereUniqueInput | Prisma.RegistrationCommentWhereUniqueInput[];
    disconnect?: Prisma.RegistrationCommentWhereUniqueInput | Prisma.RegistrationCommentWhereUniqueInput[];
    delete?: Prisma.RegistrationCommentWhereUniqueInput | Prisma.RegistrationCommentWhereUniqueInput[];
    connect?: Prisma.RegistrationCommentWhereUniqueInput | Prisma.RegistrationCommentWhereUniqueInput[];
    update?: Prisma.RegistrationCommentUpdateWithWhereUniqueWithoutRequestInput | Prisma.RegistrationCommentUpdateWithWhereUniqueWithoutRequestInput[];
    updateMany?: Prisma.RegistrationCommentUpdateManyWithWhereWithoutRequestInput | Prisma.RegistrationCommentUpdateManyWithWhereWithoutRequestInput[];
    deleteMany?: Prisma.RegistrationCommentScalarWhereInput | Prisma.RegistrationCommentScalarWhereInput[];
};
export type RegistrationCommentUncheckedUpdateManyWithoutRequestNestedInput = {
    create?: Prisma.XOR<Prisma.RegistrationCommentCreateWithoutRequestInput, Prisma.RegistrationCommentUncheckedCreateWithoutRequestInput> | Prisma.RegistrationCommentCreateWithoutRequestInput[] | Prisma.RegistrationCommentUncheckedCreateWithoutRequestInput[];
    connectOrCreate?: Prisma.RegistrationCommentCreateOrConnectWithoutRequestInput | Prisma.RegistrationCommentCreateOrConnectWithoutRequestInput[];
    upsert?: Prisma.RegistrationCommentUpsertWithWhereUniqueWithoutRequestInput | Prisma.RegistrationCommentUpsertWithWhereUniqueWithoutRequestInput[];
    createMany?: Prisma.RegistrationCommentCreateManyRequestInputEnvelope;
    set?: Prisma.RegistrationCommentWhereUniqueInput | Prisma.RegistrationCommentWhereUniqueInput[];
    disconnect?: Prisma.RegistrationCommentWhereUniqueInput | Prisma.RegistrationCommentWhereUniqueInput[];
    delete?: Prisma.RegistrationCommentWhereUniqueInput | Prisma.RegistrationCommentWhereUniqueInput[];
    connect?: Prisma.RegistrationCommentWhereUniqueInput | Prisma.RegistrationCommentWhereUniqueInput[];
    update?: Prisma.RegistrationCommentUpdateWithWhereUniqueWithoutRequestInput | Prisma.RegistrationCommentUpdateWithWhereUniqueWithoutRequestInput[];
    updateMany?: Prisma.RegistrationCommentUpdateManyWithWhereWithoutRequestInput | Prisma.RegistrationCommentUpdateManyWithWhereWithoutRequestInput[];
    deleteMany?: Prisma.RegistrationCommentScalarWhereInput | Prisma.RegistrationCommentScalarWhereInput[];
};
export type RegistrationCommentCreateWithoutAuthorInput = {
    id?: string;
    content: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    request: Prisma.RegistrationRequestCreateNestedOneWithoutCommentsInput;
};
export type RegistrationCommentUncheckedCreateWithoutAuthorInput = {
    id?: string;
    requestId: string;
    content: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type RegistrationCommentCreateOrConnectWithoutAuthorInput = {
    where: Prisma.RegistrationCommentWhereUniqueInput;
    create: Prisma.XOR<Prisma.RegistrationCommentCreateWithoutAuthorInput, Prisma.RegistrationCommentUncheckedCreateWithoutAuthorInput>;
};
export type RegistrationCommentCreateManyAuthorInputEnvelope = {
    data: Prisma.RegistrationCommentCreateManyAuthorInput | Prisma.RegistrationCommentCreateManyAuthorInput[];
    skipDuplicates?: boolean;
};
export type RegistrationCommentUpsertWithWhereUniqueWithoutAuthorInput = {
    where: Prisma.RegistrationCommentWhereUniqueInput;
    update: Prisma.XOR<Prisma.RegistrationCommentUpdateWithoutAuthorInput, Prisma.RegistrationCommentUncheckedUpdateWithoutAuthorInput>;
    create: Prisma.XOR<Prisma.RegistrationCommentCreateWithoutAuthorInput, Prisma.RegistrationCommentUncheckedCreateWithoutAuthorInput>;
};
export type RegistrationCommentUpdateWithWhereUniqueWithoutAuthorInput = {
    where: Prisma.RegistrationCommentWhereUniqueInput;
    data: Prisma.XOR<Prisma.RegistrationCommentUpdateWithoutAuthorInput, Prisma.RegistrationCommentUncheckedUpdateWithoutAuthorInput>;
};
export type RegistrationCommentUpdateManyWithWhereWithoutAuthorInput = {
    where: Prisma.RegistrationCommentScalarWhereInput;
    data: Prisma.XOR<Prisma.RegistrationCommentUpdateManyMutationInput, Prisma.RegistrationCommentUncheckedUpdateManyWithoutAuthorInput>;
};
export type RegistrationCommentScalarWhereInput = {
    AND?: Prisma.RegistrationCommentScalarWhereInput | Prisma.RegistrationCommentScalarWhereInput[];
    OR?: Prisma.RegistrationCommentScalarWhereInput[];
    NOT?: Prisma.RegistrationCommentScalarWhereInput | Prisma.RegistrationCommentScalarWhereInput[];
    id?: Prisma.StringFilter<"RegistrationComment"> | string;
    requestId?: Prisma.StringFilter<"RegistrationComment"> | string;
    authorId?: Prisma.StringFilter<"RegistrationComment"> | string;
    content?: Prisma.StringFilter<"RegistrationComment"> | string;
    createdAt?: Prisma.DateTimeFilter<"RegistrationComment"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"RegistrationComment"> | Date | string;
};
export type RegistrationCommentCreateWithoutRequestInput = {
    id?: string;
    content: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    author: Prisma.UserCreateNestedOneWithoutAuthoredRegistrationCommentsInput;
};
export type RegistrationCommentUncheckedCreateWithoutRequestInput = {
    id?: string;
    authorId: string;
    content: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type RegistrationCommentCreateOrConnectWithoutRequestInput = {
    where: Prisma.RegistrationCommentWhereUniqueInput;
    create: Prisma.XOR<Prisma.RegistrationCommentCreateWithoutRequestInput, Prisma.RegistrationCommentUncheckedCreateWithoutRequestInput>;
};
export type RegistrationCommentCreateManyRequestInputEnvelope = {
    data: Prisma.RegistrationCommentCreateManyRequestInput | Prisma.RegistrationCommentCreateManyRequestInput[];
    skipDuplicates?: boolean;
};
export type RegistrationCommentUpsertWithWhereUniqueWithoutRequestInput = {
    where: Prisma.RegistrationCommentWhereUniqueInput;
    update: Prisma.XOR<Prisma.RegistrationCommentUpdateWithoutRequestInput, Prisma.RegistrationCommentUncheckedUpdateWithoutRequestInput>;
    create: Prisma.XOR<Prisma.RegistrationCommentCreateWithoutRequestInput, Prisma.RegistrationCommentUncheckedCreateWithoutRequestInput>;
};
export type RegistrationCommentUpdateWithWhereUniqueWithoutRequestInput = {
    where: Prisma.RegistrationCommentWhereUniqueInput;
    data: Prisma.XOR<Prisma.RegistrationCommentUpdateWithoutRequestInput, Prisma.RegistrationCommentUncheckedUpdateWithoutRequestInput>;
};
export type RegistrationCommentUpdateManyWithWhereWithoutRequestInput = {
    where: Prisma.RegistrationCommentScalarWhereInput;
    data: Prisma.XOR<Prisma.RegistrationCommentUpdateManyMutationInput, Prisma.RegistrationCommentUncheckedUpdateManyWithoutRequestInput>;
};
export type RegistrationCommentCreateManyAuthorInput = {
    id?: string;
    requestId: string;
    content: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type RegistrationCommentUpdateWithoutAuthorInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    content?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    request?: Prisma.RegistrationRequestUpdateOneRequiredWithoutCommentsNestedInput;
};
export type RegistrationCommentUncheckedUpdateWithoutAuthorInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    requestId?: Prisma.StringFieldUpdateOperationsInput | string;
    content?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type RegistrationCommentUncheckedUpdateManyWithoutAuthorInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    requestId?: Prisma.StringFieldUpdateOperationsInput | string;
    content?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type RegistrationCommentCreateManyRequestInput = {
    id?: string;
    authorId: string;
    content: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type RegistrationCommentUpdateWithoutRequestInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    content?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    author?: Prisma.UserUpdateOneRequiredWithoutAuthoredRegistrationCommentsNestedInput;
};
export type RegistrationCommentUncheckedUpdateWithoutRequestInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    authorId?: Prisma.StringFieldUpdateOperationsInput | string;
    content?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type RegistrationCommentUncheckedUpdateManyWithoutRequestInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    authorId?: Prisma.StringFieldUpdateOperationsInput | string;
    content?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type RegistrationCommentSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    requestId?: boolean;
    authorId?: boolean;
    content?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    request?: boolean | Prisma.RegistrationRequestDefaultArgs<ExtArgs>;
    author?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["registrationComment"]>;
export type RegistrationCommentSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    requestId?: boolean;
    authorId?: boolean;
    content?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    request?: boolean | Prisma.RegistrationRequestDefaultArgs<ExtArgs>;
    author?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["registrationComment"]>;
export type RegistrationCommentSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    requestId?: boolean;
    authorId?: boolean;
    content?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    request?: boolean | Prisma.RegistrationRequestDefaultArgs<ExtArgs>;
    author?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["registrationComment"]>;
export type RegistrationCommentSelectScalar = {
    id?: boolean;
    requestId?: boolean;
    authorId?: boolean;
    content?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
};
export type RegistrationCommentOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "requestId" | "authorId" | "content" | "createdAt" | "updatedAt", ExtArgs["result"]["registrationComment"]>;
export type RegistrationCommentInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    request?: boolean | Prisma.RegistrationRequestDefaultArgs<ExtArgs>;
    author?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
};
export type RegistrationCommentIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    request?: boolean | Prisma.RegistrationRequestDefaultArgs<ExtArgs>;
    author?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
};
export type RegistrationCommentIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    request?: boolean | Prisma.RegistrationRequestDefaultArgs<ExtArgs>;
    author?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
};
export type $RegistrationCommentPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "RegistrationComment";
    objects: {
        request: Prisma.$RegistrationRequestPayload<ExtArgs>;
        author: Prisma.$UserPayload<ExtArgs>;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        requestId: string;
        authorId: string;
        content: string;
        createdAt: Date;
        updatedAt: Date;
    }, ExtArgs["result"]["registrationComment"]>;
    composites: {};
};
export type RegistrationCommentGetPayload<S extends boolean | null | undefined | RegistrationCommentDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$RegistrationCommentPayload, S>;
export type RegistrationCommentCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<RegistrationCommentFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: RegistrationCommentCountAggregateInputType | true;
};
export interface RegistrationCommentDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['RegistrationComment'];
        meta: {
            name: 'RegistrationComment';
        };
    };
    /**
     * Find zero or one RegistrationComment that matches the filter.
     * @param {RegistrationCommentFindUniqueArgs} args - Arguments to find a RegistrationComment
     * @example
     * // Get one RegistrationComment
     * const registrationComment = await prisma.registrationComment.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends RegistrationCommentFindUniqueArgs>(args: Prisma.SelectSubset<T, RegistrationCommentFindUniqueArgs<ExtArgs>>): Prisma.Prisma__RegistrationCommentClient<runtime.Types.Result.GetResult<Prisma.$RegistrationCommentPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    /**
     * Find one RegistrationComment that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {RegistrationCommentFindUniqueOrThrowArgs} args - Arguments to find a RegistrationComment
     * @example
     * // Get one RegistrationComment
     * const registrationComment = await prisma.registrationComment.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends RegistrationCommentFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, RegistrationCommentFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__RegistrationCommentClient<runtime.Types.Result.GetResult<Prisma.$RegistrationCommentPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Find the first RegistrationComment that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RegistrationCommentFindFirstArgs} args - Arguments to find a RegistrationComment
     * @example
     * // Get one RegistrationComment
     * const registrationComment = await prisma.registrationComment.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends RegistrationCommentFindFirstArgs>(args?: Prisma.SelectSubset<T, RegistrationCommentFindFirstArgs<ExtArgs>>): Prisma.Prisma__RegistrationCommentClient<runtime.Types.Result.GetResult<Prisma.$RegistrationCommentPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    /**
     * Find the first RegistrationComment that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RegistrationCommentFindFirstOrThrowArgs} args - Arguments to find a RegistrationComment
     * @example
     * // Get one RegistrationComment
     * const registrationComment = await prisma.registrationComment.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends RegistrationCommentFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, RegistrationCommentFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__RegistrationCommentClient<runtime.Types.Result.GetResult<Prisma.$RegistrationCommentPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Find zero or more RegistrationComments that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RegistrationCommentFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all RegistrationComments
     * const registrationComments = await prisma.registrationComment.findMany()
     *
     * // Get first 10 RegistrationComments
     * const registrationComments = await prisma.registrationComment.findMany({ take: 10 })
     *
     * // Only select the `id`
     * const registrationCommentWithIdOnly = await prisma.registrationComment.findMany({ select: { id: true } })
     *
     */
    findMany<T extends RegistrationCommentFindManyArgs>(args?: Prisma.SelectSubset<T, RegistrationCommentFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$RegistrationCommentPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    /**
     * Create a RegistrationComment.
     * @param {RegistrationCommentCreateArgs} args - Arguments to create a RegistrationComment.
     * @example
     * // Create one RegistrationComment
     * const RegistrationComment = await prisma.registrationComment.create({
     *   data: {
     *     // ... data to create a RegistrationComment
     *   }
     * })
     *
     */
    create<T extends RegistrationCommentCreateArgs>(args: Prisma.SelectSubset<T, RegistrationCommentCreateArgs<ExtArgs>>): Prisma.Prisma__RegistrationCommentClient<runtime.Types.Result.GetResult<Prisma.$RegistrationCommentPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Create many RegistrationComments.
     * @param {RegistrationCommentCreateManyArgs} args - Arguments to create many RegistrationComments.
     * @example
     * // Create many RegistrationComments
     * const registrationComment = await prisma.registrationComment.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     */
    createMany<T extends RegistrationCommentCreateManyArgs>(args?: Prisma.SelectSubset<T, RegistrationCommentCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Create many RegistrationComments and returns the data saved in the database.
     * @param {RegistrationCommentCreateManyAndReturnArgs} args - Arguments to create many RegistrationComments.
     * @example
     * // Create many RegistrationComments
     * const registrationComment = await prisma.registrationComment.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Create many RegistrationComments and only return the `id`
     * const registrationCommentWithIdOnly = await prisma.registrationComment.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    createManyAndReturn<T extends RegistrationCommentCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, RegistrationCommentCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$RegistrationCommentPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    /**
     * Delete a RegistrationComment.
     * @param {RegistrationCommentDeleteArgs} args - Arguments to delete one RegistrationComment.
     * @example
     * // Delete one RegistrationComment
     * const RegistrationComment = await prisma.registrationComment.delete({
     *   where: {
     *     // ... filter to delete one RegistrationComment
     *   }
     * })
     *
     */
    delete<T extends RegistrationCommentDeleteArgs>(args: Prisma.SelectSubset<T, RegistrationCommentDeleteArgs<ExtArgs>>): Prisma.Prisma__RegistrationCommentClient<runtime.Types.Result.GetResult<Prisma.$RegistrationCommentPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Update one RegistrationComment.
     * @param {RegistrationCommentUpdateArgs} args - Arguments to update one RegistrationComment.
     * @example
     * // Update one RegistrationComment
     * const registrationComment = await prisma.registrationComment.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    update<T extends RegistrationCommentUpdateArgs>(args: Prisma.SelectSubset<T, RegistrationCommentUpdateArgs<ExtArgs>>): Prisma.Prisma__RegistrationCommentClient<runtime.Types.Result.GetResult<Prisma.$RegistrationCommentPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Delete zero or more RegistrationComments.
     * @param {RegistrationCommentDeleteManyArgs} args - Arguments to filter RegistrationComments to delete.
     * @example
     * // Delete a few RegistrationComments
     * const { count } = await prisma.registrationComment.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     */
    deleteMany<T extends RegistrationCommentDeleteManyArgs>(args?: Prisma.SelectSubset<T, RegistrationCommentDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Update zero or more RegistrationComments.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RegistrationCommentUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many RegistrationComments
     * const registrationComment = await prisma.registrationComment.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    updateMany<T extends RegistrationCommentUpdateManyArgs>(args: Prisma.SelectSubset<T, RegistrationCommentUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Update zero or more RegistrationComments and returns the data updated in the database.
     * @param {RegistrationCommentUpdateManyAndReturnArgs} args - Arguments to update many RegistrationComments.
     * @example
     * // Update many RegistrationComments
     * const registrationComment = await prisma.registrationComment.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Update zero or more RegistrationComments and only return the `id`
     * const registrationCommentWithIdOnly = await prisma.registrationComment.updateManyAndReturn({
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
    updateManyAndReturn<T extends RegistrationCommentUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, RegistrationCommentUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$RegistrationCommentPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    /**
     * Create or update one RegistrationComment.
     * @param {RegistrationCommentUpsertArgs} args - Arguments to update or create a RegistrationComment.
     * @example
     * // Update or create a RegistrationComment
     * const registrationComment = await prisma.registrationComment.upsert({
     *   create: {
     *     // ... data to create a RegistrationComment
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the RegistrationComment we want to update
     *   }
     * })
     */
    upsert<T extends RegistrationCommentUpsertArgs>(args: Prisma.SelectSubset<T, RegistrationCommentUpsertArgs<ExtArgs>>): Prisma.Prisma__RegistrationCommentClient<runtime.Types.Result.GetResult<Prisma.$RegistrationCommentPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Count the number of RegistrationComments.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RegistrationCommentCountArgs} args - Arguments to filter RegistrationComments to count.
     * @example
     * // Count the number of RegistrationComments
     * const count = await prisma.registrationComment.count({
     *   where: {
     *     // ... the filter for the RegistrationComments we want to count
     *   }
     * })
    **/
    count<T extends RegistrationCommentCountArgs>(args?: Prisma.Subset<T, RegistrationCommentCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], RegistrationCommentCountAggregateOutputType> : number>;
    /**
     * Allows you to perform aggregations operations on a RegistrationComment.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RegistrationCommentAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends RegistrationCommentAggregateArgs>(args: Prisma.Subset<T, RegistrationCommentAggregateArgs>): Prisma.PrismaPromise<GetRegistrationCommentAggregateType<T>>;
    /**
     * Group by RegistrationComment.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RegistrationCommentGroupByArgs} args - Group by arguments.
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
    groupBy<T extends RegistrationCommentGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: RegistrationCommentGroupByArgs['orderBy'];
    } : {
        orderBy?: RegistrationCommentGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, RegistrationCommentGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetRegistrationCommentGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    /**
     * Fields of the RegistrationComment model
     */
    readonly fields: RegistrationCommentFieldRefs;
}
/**
 * The delegate class that acts as a "Promise-like" for RegistrationComment.
 * Why is this prefixed with `Prisma__`?
 * Because we want to prevent naming conflicts as mentioned in
 * https://github.com/prisma/prisma-client-js/issues/707
 */
export interface Prisma__RegistrationCommentClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    request<T extends Prisma.RegistrationRequestDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.RegistrationRequestDefaultArgs<ExtArgs>>): Prisma.Prisma__RegistrationRequestClient<runtime.Types.Result.GetResult<Prisma.$RegistrationRequestPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    author<T extends Prisma.UserDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.UserDefaultArgs<ExtArgs>>): Prisma.Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
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
 * Fields of the RegistrationComment model
 */
export interface RegistrationCommentFieldRefs {
    readonly id: Prisma.FieldRef<"RegistrationComment", 'String'>;
    readonly requestId: Prisma.FieldRef<"RegistrationComment", 'String'>;
    readonly authorId: Prisma.FieldRef<"RegistrationComment", 'String'>;
    readonly content: Prisma.FieldRef<"RegistrationComment", 'String'>;
    readonly createdAt: Prisma.FieldRef<"RegistrationComment", 'DateTime'>;
    readonly updatedAt: Prisma.FieldRef<"RegistrationComment", 'DateTime'>;
}
/**
 * RegistrationComment findUnique
 */
export type RegistrationCommentFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RegistrationComment
     */
    select?: Prisma.RegistrationCommentSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the RegistrationComment
     */
    omit?: Prisma.RegistrationCommentOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.RegistrationCommentInclude<ExtArgs> | null;
    /**
     * Filter, which RegistrationComment to fetch.
     */
    where: Prisma.RegistrationCommentWhereUniqueInput;
};
/**
 * RegistrationComment findUniqueOrThrow
 */
export type RegistrationCommentFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RegistrationComment
     */
    select?: Prisma.RegistrationCommentSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the RegistrationComment
     */
    omit?: Prisma.RegistrationCommentOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.RegistrationCommentInclude<ExtArgs> | null;
    /**
     * Filter, which RegistrationComment to fetch.
     */
    where: Prisma.RegistrationCommentWhereUniqueInput;
};
/**
 * RegistrationComment findFirst
 */
export type RegistrationCommentFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RegistrationComment
     */
    select?: Prisma.RegistrationCommentSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the RegistrationComment
     */
    omit?: Prisma.RegistrationCommentOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.RegistrationCommentInclude<ExtArgs> | null;
    /**
     * Filter, which RegistrationComment to fetch.
     */
    where?: Prisma.RegistrationCommentWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of RegistrationComments to fetch.
     */
    orderBy?: Prisma.RegistrationCommentOrderByWithRelationInput | Prisma.RegistrationCommentOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for RegistrationComments.
     */
    cursor?: Prisma.RegistrationCommentWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` RegistrationComments from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` RegistrationComments.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of RegistrationComments.
     */
    distinct?: Prisma.RegistrationCommentScalarFieldEnum | Prisma.RegistrationCommentScalarFieldEnum[];
};
/**
 * RegistrationComment findFirstOrThrow
 */
export type RegistrationCommentFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RegistrationComment
     */
    select?: Prisma.RegistrationCommentSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the RegistrationComment
     */
    omit?: Prisma.RegistrationCommentOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.RegistrationCommentInclude<ExtArgs> | null;
    /**
     * Filter, which RegistrationComment to fetch.
     */
    where?: Prisma.RegistrationCommentWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of RegistrationComments to fetch.
     */
    orderBy?: Prisma.RegistrationCommentOrderByWithRelationInput | Prisma.RegistrationCommentOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for RegistrationComments.
     */
    cursor?: Prisma.RegistrationCommentWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` RegistrationComments from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` RegistrationComments.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of RegistrationComments.
     */
    distinct?: Prisma.RegistrationCommentScalarFieldEnum | Prisma.RegistrationCommentScalarFieldEnum[];
};
/**
 * RegistrationComment findMany
 */
export type RegistrationCommentFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RegistrationComment
     */
    select?: Prisma.RegistrationCommentSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the RegistrationComment
     */
    omit?: Prisma.RegistrationCommentOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.RegistrationCommentInclude<ExtArgs> | null;
    /**
     * Filter, which RegistrationComments to fetch.
     */
    where?: Prisma.RegistrationCommentWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of RegistrationComments to fetch.
     */
    orderBy?: Prisma.RegistrationCommentOrderByWithRelationInput | Prisma.RegistrationCommentOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing RegistrationComments.
     */
    cursor?: Prisma.RegistrationCommentWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` RegistrationComments from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` RegistrationComments.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of RegistrationComments.
     */
    distinct?: Prisma.RegistrationCommentScalarFieldEnum | Prisma.RegistrationCommentScalarFieldEnum[];
};
/**
 * RegistrationComment create
 */
export type RegistrationCommentCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RegistrationComment
     */
    select?: Prisma.RegistrationCommentSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the RegistrationComment
     */
    omit?: Prisma.RegistrationCommentOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.RegistrationCommentInclude<ExtArgs> | null;
    /**
     * The data needed to create a RegistrationComment.
     */
    data: Prisma.XOR<Prisma.RegistrationCommentCreateInput, Prisma.RegistrationCommentUncheckedCreateInput>;
};
/**
 * RegistrationComment createMany
 */
export type RegistrationCommentCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * The data used to create many RegistrationComments.
     */
    data: Prisma.RegistrationCommentCreateManyInput | Prisma.RegistrationCommentCreateManyInput[];
    skipDuplicates?: boolean;
};
/**
 * RegistrationComment createManyAndReturn
 */
export type RegistrationCommentCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RegistrationComment
     */
    select?: Prisma.RegistrationCommentSelectCreateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the RegistrationComment
     */
    omit?: Prisma.RegistrationCommentOmit<ExtArgs> | null;
    /**
     * The data used to create many RegistrationComments.
     */
    data: Prisma.RegistrationCommentCreateManyInput | Prisma.RegistrationCommentCreateManyInput[];
    skipDuplicates?: boolean;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.RegistrationCommentIncludeCreateManyAndReturn<ExtArgs> | null;
};
/**
 * RegistrationComment update
 */
export type RegistrationCommentUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RegistrationComment
     */
    select?: Prisma.RegistrationCommentSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the RegistrationComment
     */
    omit?: Prisma.RegistrationCommentOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.RegistrationCommentInclude<ExtArgs> | null;
    /**
     * The data needed to update a RegistrationComment.
     */
    data: Prisma.XOR<Prisma.RegistrationCommentUpdateInput, Prisma.RegistrationCommentUncheckedUpdateInput>;
    /**
     * Choose, which RegistrationComment to update.
     */
    where: Prisma.RegistrationCommentWhereUniqueInput;
};
/**
 * RegistrationComment updateMany
 */
export type RegistrationCommentUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * The data used to update RegistrationComments.
     */
    data: Prisma.XOR<Prisma.RegistrationCommentUpdateManyMutationInput, Prisma.RegistrationCommentUncheckedUpdateManyInput>;
    /**
     * Filter which RegistrationComments to update
     */
    where?: Prisma.RegistrationCommentWhereInput;
    /**
     * Limit how many RegistrationComments to update.
     */
    limit?: number;
};
/**
 * RegistrationComment updateManyAndReturn
 */
export type RegistrationCommentUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RegistrationComment
     */
    select?: Prisma.RegistrationCommentSelectUpdateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the RegistrationComment
     */
    omit?: Prisma.RegistrationCommentOmit<ExtArgs> | null;
    /**
     * The data used to update RegistrationComments.
     */
    data: Prisma.XOR<Prisma.RegistrationCommentUpdateManyMutationInput, Prisma.RegistrationCommentUncheckedUpdateManyInput>;
    /**
     * Filter which RegistrationComments to update
     */
    where?: Prisma.RegistrationCommentWhereInput;
    /**
     * Limit how many RegistrationComments to update.
     */
    limit?: number;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.RegistrationCommentIncludeUpdateManyAndReturn<ExtArgs> | null;
};
/**
 * RegistrationComment upsert
 */
export type RegistrationCommentUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RegistrationComment
     */
    select?: Prisma.RegistrationCommentSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the RegistrationComment
     */
    omit?: Prisma.RegistrationCommentOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.RegistrationCommentInclude<ExtArgs> | null;
    /**
     * The filter to search for the RegistrationComment to update in case it exists.
     */
    where: Prisma.RegistrationCommentWhereUniqueInput;
    /**
     * In case the RegistrationComment found by the `where` argument doesn't exist, create a new RegistrationComment with this data.
     */
    create: Prisma.XOR<Prisma.RegistrationCommentCreateInput, Prisma.RegistrationCommentUncheckedCreateInput>;
    /**
     * In case the RegistrationComment was found with the provided `where` argument, update it with this data.
     */
    update: Prisma.XOR<Prisma.RegistrationCommentUpdateInput, Prisma.RegistrationCommentUncheckedUpdateInput>;
};
/**
 * RegistrationComment delete
 */
export type RegistrationCommentDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RegistrationComment
     */
    select?: Prisma.RegistrationCommentSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the RegistrationComment
     */
    omit?: Prisma.RegistrationCommentOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.RegistrationCommentInclude<ExtArgs> | null;
    /**
     * Filter which RegistrationComment to delete.
     */
    where: Prisma.RegistrationCommentWhereUniqueInput;
};
/**
 * RegistrationComment deleteMany
 */
export type RegistrationCommentDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Filter which RegistrationComments to delete
     */
    where?: Prisma.RegistrationCommentWhereInput;
    /**
     * Limit how many RegistrationComments to delete.
     */
    limit?: number;
};
/**
 * RegistrationComment without action
 */
export type RegistrationCommentDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RegistrationComment
     */
    select?: Prisma.RegistrationCommentSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the RegistrationComment
     */
    omit?: Prisma.RegistrationCommentOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.RegistrationCommentInclude<ExtArgs> | null;
};
