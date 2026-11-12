import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace";
/**
 * Model RegistrationCollaborator
 *
 */
export type RegistrationCollaboratorModel = runtime.Types.Result.DefaultSelection<Prisma.$RegistrationCollaboratorPayload>;
export type AggregateRegistrationCollaborator = {
    _count: RegistrationCollaboratorCountAggregateOutputType | null;
    _min: RegistrationCollaboratorMinAggregateOutputType | null;
    _max: RegistrationCollaboratorMaxAggregateOutputType | null;
};
export type RegistrationCollaboratorMinAggregateOutputType = {
    id: string | null;
    campaignId: string | null;
    clinicId: string | null;
    userId: string | null;
    email: string | null;
    accessLevel: string | null;
    isPending: boolean | null;
    invitedById: string | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type RegistrationCollaboratorMaxAggregateOutputType = {
    id: string | null;
    campaignId: string | null;
    clinicId: string | null;
    userId: string | null;
    email: string | null;
    accessLevel: string | null;
    isPending: boolean | null;
    invitedById: string | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type RegistrationCollaboratorCountAggregateOutputType = {
    id: number;
    campaignId: number;
    clinicId: number;
    userId: number;
    email: number;
    accessLevel: number;
    isPending: number;
    invitedById: number;
    createdAt: number;
    updatedAt: number;
    _all: number;
};
export type RegistrationCollaboratorMinAggregateInputType = {
    id?: true;
    campaignId?: true;
    clinicId?: true;
    userId?: true;
    email?: true;
    accessLevel?: true;
    isPending?: true;
    invitedById?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type RegistrationCollaboratorMaxAggregateInputType = {
    id?: true;
    campaignId?: true;
    clinicId?: true;
    userId?: true;
    email?: true;
    accessLevel?: true;
    isPending?: true;
    invitedById?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type RegistrationCollaboratorCountAggregateInputType = {
    id?: true;
    campaignId?: true;
    clinicId?: true;
    userId?: true;
    email?: true;
    accessLevel?: true;
    isPending?: true;
    invitedById?: true;
    createdAt?: true;
    updatedAt?: true;
    _all?: true;
};
export type RegistrationCollaboratorAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Filter which RegistrationCollaborator to aggregate.
     */
    where?: Prisma.RegistrationCollaboratorWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of RegistrationCollaborators to fetch.
     */
    orderBy?: Prisma.RegistrationCollaboratorOrderByWithRelationInput | Prisma.RegistrationCollaboratorOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     */
    cursor?: Prisma.RegistrationCollaboratorWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` RegistrationCollaborators from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` RegistrationCollaborators.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned RegistrationCollaborators
    **/
    _count?: true | RegistrationCollaboratorCountAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
    **/
    _min?: RegistrationCollaboratorMinAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
    **/
    _max?: RegistrationCollaboratorMaxAggregateInputType;
};
export type GetRegistrationCollaboratorAggregateType<T extends RegistrationCollaboratorAggregateArgs> = {
    [P in keyof T & keyof AggregateRegistrationCollaborator]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateRegistrationCollaborator[P]> : Prisma.GetScalarType<T[P], AggregateRegistrationCollaborator[P]>;
};
export type RegistrationCollaboratorGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.RegistrationCollaboratorWhereInput;
    orderBy?: Prisma.RegistrationCollaboratorOrderByWithAggregationInput | Prisma.RegistrationCollaboratorOrderByWithAggregationInput[];
    by: Prisma.RegistrationCollaboratorScalarFieldEnum[] | Prisma.RegistrationCollaboratorScalarFieldEnum;
    having?: Prisma.RegistrationCollaboratorScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: RegistrationCollaboratorCountAggregateInputType | true;
    _min?: RegistrationCollaboratorMinAggregateInputType;
    _max?: RegistrationCollaboratorMaxAggregateInputType;
};
export type RegistrationCollaboratorGroupByOutputType = {
    id: string;
    campaignId: string;
    clinicId: string;
    userId: string | null;
    email: string | null;
    accessLevel: string;
    isPending: boolean;
    invitedById: string | null;
    createdAt: Date;
    updatedAt: Date;
    _count: RegistrationCollaboratorCountAggregateOutputType | null;
    _min: RegistrationCollaboratorMinAggregateOutputType | null;
    _max: RegistrationCollaboratorMaxAggregateOutputType | null;
};
export type GetRegistrationCollaboratorGroupByPayload<T extends RegistrationCollaboratorGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<RegistrationCollaboratorGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof RegistrationCollaboratorGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], RegistrationCollaboratorGroupByOutputType[P]> : Prisma.GetScalarType<T[P], RegistrationCollaboratorGroupByOutputType[P]>;
}>>;
export type RegistrationCollaboratorWhereInput = {
    AND?: Prisma.RegistrationCollaboratorWhereInput | Prisma.RegistrationCollaboratorWhereInput[];
    OR?: Prisma.RegistrationCollaboratorWhereInput[];
    NOT?: Prisma.RegistrationCollaboratorWhereInput | Prisma.RegistrationCollaboratorWhereInput[];
    id?: Prisma.StringFilter<"RegistrationCollaborator"> | string;
    campaignId?: Prisma.StringFilter<"RegistrationCollaborator"> | string;
    clinicId?: Prisma.StringFilter<"RegistrationCollaborator"> | string;
    userId?: Prisma.StringNullableFilter<"RegistrationCollaborator"> | string | null;
    email?: Prisma.StringNullableFilter<"RegistrationCollaborator"> | string | null;
    accessLevel?: Prisma.StringFilter<"RegistrationCollaborator"> | string;
    isPending?: Prisma.BoolFilter<"RegistrationCollaborator"> | boolean;
    invitedById?: Prisma.StringNullableFilter<"RegistrationCollaborator"> | string | null;
    createdAt?: Prisma.DateTimeFilter<"RegistrationCollaborator"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"RegistrationCollaborator"> | Date | string;
    campaign?: Prisma.XOR<Prisma.RegistrationCampaignScalarRelationFilter, Prisma.RegistrationCampaignWhereInput>;
    user?: Prisma.XOR<Prisma.UserNullableScalarRelationFilter, Prisma.UserWhereInput> | null;
};
export type RegistrationCollaboratorOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    campaignId?: Prisma.SortOrder;
    clinicId?: Prisma.SortOrder;
    userId?: Prisma.SortOrderInput | Prisma.SortOrder;
    email?: Prisma.SortOrderInput | Prisma.SortOrder;
    accessLevel?: Prisma.SortOrder;
    isPending?: Prisma.SortOrder;
    invitedById?: Prisma.SortOrderInput | Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    campaign?: Prisma.RegistrationCampaignOrderByWithRelationInput;
    user?: Prisma.UserOrderByWithRelationInput;
};
export type RegistrationCollaboratorWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    AND?: Prisma.RegistrationCollaboratorWhereInput | Prisma.RegistrationCollaboratorWhereInput[];
    OR?: Prisma.RegistrationCollaboratorWhereInput[];
    NOT?: Prisma.RegistrationCollaboratorWhereInput | Prisma.RegistrationCollaboratorWhereInput[];
    campaignId?: Prisma.StringFilter<"RegistrationCollaborator"> | string;
    clinicId?: Prisma.StringFilter<"RegistrationCollaborator"> | string;
    userId?: Prisma.StringNullableFilter<"RegistrationCollaborator"> | string | null;
    email?: Prisma.StringNullableFilter<"RegistrationCollaborator"> | string | null;
    accessLevel?: Prisma.StringFilter<"RegistrationCollaborator"> | string;
    isPending?: Prisma.BoolFilter<"RegistrationCollaborator"> | boolean;
    invitedById?: Prisma.StringNullableFilter<"RegistrationCollaborator"> | string | null;
    createdAt?: Prisma.DateTimeFilter<"RegistrationCollaborator"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"RegistrationCollaborator"> | Date | string;
    campaign?: Prisma.XOR<Prisma.RegistrationCampaignScalarRelationFilter, Prisma.RegistrationCampaignWhereInput>;
    user?: Prisma.XOR<Prisma.UserNullableScalarRelationFilter, Prisma.UserWhereInput> | null;
}, "id">;
export type RegistrationCollaboratorOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    campaignId?: Prisma.SortOrder;
    clinicId?: Prisma.SortOrder;
    userId?: Prisma.SortOrderInput | Prisma.SortOrder;
    email?: Prisma.SortOrderInput | Prisma.SortOrder;
    accessLevel?: Prisma.SortOrder;
    isPending?: Prisma.SortOrder;
    invitedById?: Prisma.SortOrderInput | Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    _count?: Prisma.RegistrationCollaboratorCountOrderByAggregateInput;
    _max?: Prisma.RegistrationCollaboratorMaxOrderByAggregateInput;
    _min?: Prisma.RegistrationCollaboratorMinOrderByAggregateInput;
};
export type RegistrationCollaboratorScalarWhereWithAggregatesInput = {
    AND?: Prisma.RegistrationCollaboratorScalarWhereWithAggregatesInput | Prisma.RegistrationCollaboratorScalarWhereWithAggregatesInput[];
    OR?: Prisma.RegistrationCollaboratorScalarWhereWithAggregatesInput[];
    NOT?: Prisma.RegistrationCollaboratorScalarWhereWithAggregatesInput | Prisma.RegistrationCollaboratorScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"RegistrationCollaborator"> | string;
    campaignId?: Prisma.StringWithAggregatesFilter<"RegistrationCollaborator"> | string;
    clinicId?: Prisma.StringWithAggregatesFilter<"RegistrationCollaborator"> | string;
    userId?: Prisma.StringNullableWithAggregatesFilter<"RegistrationCollaborator"> | string | null;
    email?: Prisma.StringNullableWithAggregatesFilter<"RegistrationCollaborator"> | string | null;
    accessLevel?: Prisma.StringWithAggregatesFilter<"RegistrationCollaborator"> | string;
    isPending?: Prisma.BoolWithAggregatesFilter<"RegistrationCollaborator"> | boolean;
    invitedById?: Prisma.StringNullableWithAggregatesFilter<"RegistrationCollaborator"> | string | null;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"RegistrationCollaborator"> | Date | string;
    updatedAt?: Prisma.DateTimeWithAggregatesFilter<"RegistrationCollaborator"> | Date | string;
};
export type RegistrationCollaboratorCreateInput = {
    id?: string;
    clinicId: string;
    email?: string | null;
    accessLevel?: string;
    isPending?: boolean;
    invitedById?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    campaign: Prisma.RegistrationCampaignCreateNestedOneWithoutCollaboratorsInput;
    user?: Prisma.UserCreateNestedOneWithoutRegistrationCollaborationsInput;
};
export type RegistrationCollaboratorUncheckedCreateInput = {
    id?: string;
    campaignId: string;
    clinicId: string;
    userId?: string | null;
    email?: string | null;
    accessLevel?: string;
    isPending?: boolean;
    invitedById?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type RegistrationCollaboratorUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    clinicId?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    accessLevel?: Prisma.StringFieldUpdateOperationsInput | string;
    isPending?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    invitedById?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    campaign?: Prisma.RegistrationCampaignUpdateOneRequiredWithoutCollaboratorsNestedInput;
    user?: Prisma.UserUpdateOneWithoutRegistrationCollaborationsNestedInput;
};
export type RegistrationCollaboratorUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    campaignId?: Prisma.StringFieldUpdateOperationsInput | string;
    clinicId?: Prisma.StringFieldUpdateOperationsInput | string;
    userId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    email?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    accessLevel?: Prisma.StringFieldUpdateOperationsInput | string;
    isPending?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    invitedById?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type RegistrationCollaboratorCreateManyInput = {
    id?: string;
    campaignId: string;
    clinicId: string;
    userId?: string | null;
    email?: string | null;
    accessLevel?: string;
    isPending?: boolean;
    invitedById?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type RegistrationCollaboratorUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    clinicId?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    accessLevel?: Prisma.StringFieldUpdateOperationsInput | string;
    isPending?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    invitedById?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type RegistrationCollaboratorUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    campaignId?: Prisma.StringFieldUpdateOperationsInput | string;
    clinicId?: Prisma.StringFieldUpdateOperationsInput | string;
    userId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    email?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    accessLevel?: Prisma.StringFieldUpdateOperationsInput | string;
    isPending?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    invitedById?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type RegistrationCollaboratorListRelationFilter = {
    every?: Prisma.RegistrationCollaboratorWhereInput;
    some?: Prisma.RegistrationCollaboratorWhereInput;
    none?: Prisma.RegistrationCollaboratorWhereInput;
};
export type RegistrationCollaboratorOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type RegistrationCollaboratorCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    campaignId?: Prisma.SortOrder;
    clinicId?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    email?: Prisma.SortOrder;
    accessLevel?: Prisma.SortOrder;
    isPending?: Prisma.SortOrder;
    invitedById?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type RegistrationCollaboratorMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    campaignId?: Prisma.SortOrder;
    clinicId?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    email?: Prisma.SortOrder;
    accessLevel?: Prisma.SortOrder;
    isPending?: Prisma.SortOrder;
    invitedById?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type RegistrationCollaboratorMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    campaignId?: Prisma.SortOrder;
    clinicId?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    email?: Prisma.SortOrder;
    accessLevel?: Prisma.SortOrder;
    isPending?: Prisma.SortOrder;
    invitedById?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type RegistrationCollaboratorCreateNestedManyWithoutUserInput = {
    create?: Prisma.XOR<Prisma.RegistrationCollaboratorCreateWithoutUserInput, Prisma.RegistrationCollaboratorUncheckedCreateWithoutUserInput> | Prisma.RegistrationCollaboratorCreateWithoutUserInput[] | Prisma.RegistrationCollaboratorUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.RegistrationCollaboratorCreateOrConnectWithoutUserInput | Prisma.RegistrationCollaboratorCreateOrConnectWithoutUserInput[];
    createMany?: Prisma.RegistrationCollaboratorCreateManyUserInputEnvelope;
    connect?: Prisma.RegistrationCollaboratorWhereUniqueInput | Prisma.RegistrationCollaboratorWhereUniqueInput[];
};
export type RegistrationCollaboratorUncheckedCreateNestedManyWithoutUserInput = {
    create?: Prisma.XOR<Prisma.RegistrationCollaboratorCreateWithoutUserInput, Prisma.RegistrationCollaboratorUncheckedCreateWithoutUserInput> | Prisma.RegistrationCollaboratorCreateWithoutUserInput[] | Prisma.RegistrationCollaboratorUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.RegistrationCollaboratorCreateOrConnectWithoutUserInput | Prisma.RegistrationCollaboratorCreateOrConnectWithoutUserInput[];
    createMany?: Prisma.RegistrationCollaboratorCreateManyUserInputEnvelope;
    connect?: Prisma.RegistrationCollaboratorWhereUniqueInput | Prisma.RegistrationCollaboratorWhereUniqueInput[];
};
export type RegistrationCollaboratorUpdateManyWithoutUserNestedInput = {
    create?: Prisma.XOR<Prisma.RegistrationCollaboratorCreateWithoutUserInput, Prisma.RegistrationCollaboratorUncheckedCreateWithoutUserInput> | Prisma.RegistrationCollaboratorCreateWithoutUserInput[] | Prisma.RegistrationCollaboratorUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.RegistrationCollaboratorCreateOrConnectWithoutUserInput | Prisma.RegistrationCollaboratorCreateOrConnectWithoutUserInput[];
    upsert?: Prisma.RegistrationCollaboratorUpsertWithWhereUniqueWithoutUserInput | Prisma.RegistrationCollaboratorUpsertWithWhereUniqueWithoutUserInput[];
    createMany?: Prisma.RegistrationCollaboratorCreateManyUserInputEnvelope;
    set?: Prisma.RegistrationCollaboratorWhereUniqueInput | Prisma.RegistrationCollaboratorWhereUniqueInput[];
    disconnect?: Prisma.RegistrationCollaboratorWhereUniqueInput | Prisma.RegistrationCollaboratorWhereUniqueInput[];
    delete?: Prisma.RegistrationCollaboratorWhereUniqueInput | Prisma.RegistrationCollaboratorWhereUniqueInput[];
    connect?: Prisma.RegistrationCollaboratorWhereUniqueInput | Prisma.RegistrationCollaboratorWhereUniqueInput[];
    update?: Prisma.RegistrationCollaboratorUpdateWithWhereUniqueWithoutUserInput | Prisma.RegistrationCollaboratorUpdateWithWhereUniqueWithoutUserInput[];
    updateMany?: Prisma.RegistrationCollaboratorUpdateManyWithWhereWithoutUserInput | Prisma.RegistrationCollaboratorUpdateManyWithWhereWithoutUserInput[];
    deleteMany?: Prisma.RegistrationCollaboratorScalarWhereInput | Prisma.RegistrationCollaboratorScalarWhereInput[];
};
export type RegistrationCollaboratorUncheckedUpdateManyWithoutUserNestedInput = {
    create?: Prisma.XOR<Prisma.RegistrationCollaboratorCreateWithoutUserInput, Prisma.RegistrationCollaboratorUncheckedCreateWithoutUserInput> | Prisma.RegistrationCollaboratorCreateWithoutUserInput[] | Prisma.RegistrationCollaboratorUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.RegistrationCollaboratorCreateOrConnectWithoutUserInput | Prisma.RegistrationCollaboratorCreateOrConnectWithoutUserInput[];
    upsert?: Prisma.RegistrationCollaboratorUpsertWithWhereUniqueWithoutUserInput | Prisma.RegistrationCollaboratorUpsertWithWhereUniqueWithoutUserInput[];
    createMany?: Prisma.RegistrationCollaboratorCreateManyUserInputEnvelope;
    set?: Prisma.RegistrationCollaboratorWhereUniqueInput | Prisma.RegistrationCollaboratorWhereUniqueInput[];
    disconnect?: Prisma.RegistrationCollaboratorWhereUniqueInput | Prisma.RegistrationCollaboratorWhereUniqueInput[];
    delete?: Prisma.RegistrationCollaboratorWhereUniqueInput | Prisma.RegistrationCollaboratorWhereUniqueInput[];
    connect?: Prisma.RegistrationCollaboratorWhereUniqueInput | Prisma.RegistrationCollaboratorWhereUniqueInput[];
    update?: Prisma.RegistrationCollaboratorUpdateWithWhereUniqueWithoutUserInput | Prisma.RegistrationCollaboratorUpdateWithWhereUniqueWithoutUserInput[];
    updateMany?: Prisma.RegistrationCollaboratorUpdateManyWithWhereWithoutUserInput | Prisma.RegistrationCollaboratorUpdateManyWithWhereWithoutUserInput[];
    deleteMany?: Prisma.RegistrationCollaboratorScalarWhereInput | Prisma.RegistrationCollaboratorScalarWhereInput[];
};
export type RegistrationCollaboratorCreateNestedManyWithoutCampaignInput = {
    create?: Prisma.XOR<Prisma.RegistrationCollaboratorCreateWithoutCampaignInput, Prisma.RegistrationCollaboratorUncheckedCreateWithoutCampaignInput> | Prisma.RegistrationCollaboratorCreateWithoutCampaignInput[] | Prisma.RegistrationCollaboratorUncheckedCreateWithoutCampaignInput[];
    connectOrCreate?: Prisma.RegistrationCollaboratorCreateOrConnectWithoutCampaignInput | Prisma.RegistrationCollaboratorCreateOrConnectWithoutCampaignInput[];
    createMany?: Prisma.RegistrationCollaboratorCreateManyCampaignInputEnvelope;
    connect?: Prisma.RegistrationCollaboratorWhereUniqueInput | Prisma.RegistrationCollaboratorWhereUniqueInput[];
};
export type RegistrationCollaboratorUncheckedCreateNestedManyWithoutCampaignInput = {
    create?: Prisma.XOR<Prisma.RegistrationCollaboratorCreateWithoutCampaignInput, Prisma.RegistrationCollaboratorUncheckedCreateWithoutCampaignInput> | Prisma.RegistrationCollaboratorCreateWithoutCampaignInput[] | Prisma.RegistrationCollaboratorUncheckedCreateWithoutCampaignInput[];
    connectOrCreate?: Prisma.RegistrationCollaboratorCreateOrConnectWithoutCampaignInput | Prisma.RegistrationCollaboratorCreateOrConnectWithoutCampaignInput[];
    createMany?: Prisma.RegistrationCollaboratorCreateManyCampaignInputEnvelope;
    connect?: Prisma.RegistrationCollaboratorWhereUniqueInput | Prisma.RegistrationCollaboratorWhereUniqueInput[];
};
export type RegistrationCollaboratorUpdateManyWithoutCampaignNestedInput = {
    create?: Prisma.XOR<Prisma.RegistrationCollaboratorCreateWithoutCampaignInput, Prisma.RegistrationCollaboratorUncheckedCreateWithoutCampaignInput> | Prisma.RegistrationCollaboratorCreateWithoutCampaignInput[] | Prisma.RegistrationCollaboratorUncheckedCreateWithoutCampaignInput[];
    connectOrCreate?: Prisma.RegistrationCollaboratorCreateOrConnectWithoutCampaignInput | Prisma.RegistrationCollaboratorCreateOrConnectWithoutCampaignInput[];
    upsert?: Prisma.RegistrationCollaboratorUpsertWithWhereUniqueWithoutCampaignInput | Prisma.RegistrationCollaboratorUpsertWithWhereUniqueWithoutCampaignInput[];
    createMany?: Prisma.RegistrationCollaboratorCreateManyCampaignInputEnvelope;
    set?: Prisma.RegistrationCollaboratorWhereUniqueInput | Prisma.RegistrationCollaboratorWhereUniqueInput[];
    disconnect?: Prisma.RegistrationCollaboratorWhereUniqueInput | Prisma.RegistrationCollaboratorWhereUniqueInput[];
    delete?: Prisma.RegistrationCollaboratorWhereUniqueInput | Prisma.RegistrationCollaboratorWhereUniqueInput[];
    connect?: Prisma.RegistrationCollaboratorWhereUniqueInput | Prisma.RegistrationCollaboratorWhereUniqueInput[];
    update?: Prisma.RegistrationCollaboratorUpdateWithWhereUniqueWithoutCampaignInput | Prisma.RegistrationCollaboratorUpdateWithWhereUniqueWithoutCampaignInput[];
    updateMany?: Prisma.RegistrationCollaboratorUpdateManyWithWhereWithoutCampaignInput | Prisma.RegistrationCollaboratorUpdateManyWithWhereWithoutCampaignInput[];
    deleteMany?: Prisma.RegistrationCollaboratorScalarWhereInput | Prisma.RegistrationCollaboratorScalarWhereInput[];
};
export type RegistrationCollaboratorUncheckedUpdateManyWithoutCampaignNestedInput = {
    create?: Prisma.XOR<Prisma.RegistrationCollaboratorCreateWithoutCampaignInput, Prisma.RegistrationCollaboratorUncheckedCreateWithoutCampaignInput> | Prisma.RegistrationCollaboratorCreateWithoutCampaignInput[] | Prisma.RegistrationCollaboratorUncheckedCreateWithoutCampaignInput[];
    connectOrCreate?: Prisma.RegistrationCollaboratorCreateOrConnectWithoutCampaignInput | Prisma.RegistrationCollaboratorCreateOrConnectWithoutCampaignInput[];
    upsert?: Prisma.RegistrationCollaboratorUpsertWithWhereUniqueWithoutCampaignInput | Prisma.RegistrationCollaboratorUpsertWithWhereUniqueWithoutCampaignInput[];
    createMany?: Prisma.RegistrationCollaboratorCreateManyCampaignInputEnvelope;
    set?: Prisma.RegistrationCollaboratorWhereUniqueInput | Prisma.RegistrationCollaboratorWhereUniqueInput[];
    disconnect?: Prisma.RegistrationCollaboratorWhereUniqueInput | Prisma.RegistrationCollaboratorWhereUniqueInput[];
    delete?: Prisma.RegistrationCollaboratorWhereUniqueInput | Prisma.RegistrationCollaboratorWhereUniqueInput[];
    connect?: Prisma.RegistrationCollaboratorWhereUniqueInput | Prisma.RegistrationCollaboratorWhereUniqueInput[];
    update?: Prisma.RegistrationCollaboratorUpdateWithWhereUniqueWithoutCampaignInput | Prisma.RegistrationCollaboratorUpdateWithWhereUniqueWithoutCampaignInput[];
    updateMany?: Prisma.RegistrationCollaboratorUpdateManyWithWhereWithoutCampaignInput | Prisma.RegistrationCollaboratorUpdateManyWithWhereWithoutCampaignInput[];
    deleteMany?: Prisma.RegistrationCollaboratorScalarWhereInput | Prisma.RegistrationCollaboratorScalarWhereInput[];
};
export type RegistrationCollaboratorCreateWithoutUserInput = {
    id?: string;
    clinicId: string;
    email?: string | null;
    accessLevel?: string;
    isPending?: boolean;
    invitedById?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    campaign: Prisma.RegistrationCampaignCreateNestedOneWithoutCollaboratorsInput;
};
export type RegistrationCollaboratorUncheckedCreateWithoutUserInput = {
    id?: string;
    campaignId: string;
    clinicId: string;
    email?: string | null;
    accessLevel?: string;
    isPending?: boolean;
    invitedById?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type RegistrationCollaboratorCreateOrConnectWithoutUserInput = {
    where: Prisma.RegistrationCollaboratorWhereUniqueInput;
    create: Prisma.XOR<Prisma.RegistrationCollaboratorCreateWithoutUserInput, Prisma.RegistrationCollaboratorUncheckedCreateWithoutUserInput>;
};
export type RegistrationCollaboratorCreateManyUserInputEnvelope = {
    data: Prisma.RegistrationCollaboratorCreateManyUserInput | Prisma.RegistrationCollaboratorCreateManyUserInput[];
    skipDuplicates?: boolean;
};
export type RegistrationCollaboratorUpsertWithWhereUniqueWithoutUserInput = {
    where: Prisma.RegistrationCollaboratorWhereUniqueInput;
    update: Prisma.XOR<Prisma.RegistrationCollaboratorUpdateWithoutUserInput, Prisma.RegistrationCollaboratorUncheckedUpdateWithoutUserInput>;
    create: Prisma.XOR<Prisma.RegistrationCollaboratorCreateWithoutUserInput, Prisma.RegistrationCollaboratorUncheckedCreateWithoutUserInput>;
};
export type RegistrationCollaboratorUpdateWithWhereUniqueWithoutUserInput = {
    where: Prisma.RegistrationCollaboratorWhereUniqueInput;
    data: Prisma.XOR<Prisma.RegistrationCollaboratorUpdateWithoutUserInput, Prisma.RegistrationCollaboratorUncheckedUpdateWithoutUserInput>;
};
export type RegistrationCollaboratorUpdateManyWithWhereWithoutUserInput = {
    where: Prisma.RegistrationCollaboratorScalarWhereInput;
    data: Prisma.XOR<Prisma.RegistrationCollaboratorUpdateManyMutationInput, Prisma.RegistrationCollaboratorUncheckedUpdateManyWithoutUserInput>;
};
export type RegistrationCollaboratorScalarWhereInput = {
    AND?: Prisma.RegistrationCollaboratorScalarWhereInput | Prisma.RegistrationCollaboratorScalarWhereInput[];
    OR?: Prisma.RegistrationCollaboratorScalarWhereInput[];
    NOT?: Prisma.RegistrationCollaboratorScalarWhereInput | Prisma.RegistrationCollaboratorScalarWhereInput[];
    id?: Prisma.StringFilter<"RegistrationCollaborator"> | string;
    campaignId?: Prisma.StringFilter<"RegistrationCollaborator"> | string;
    clinicId?: Prisma.StringFilter<"RegistrationCollaborator"> | string;
    userId?: Prisma.StringNullableFilter<"RegistrationCollaborator"> | string | null;
    email?: Prisma.StringNullableFilter<"RegistrationCollaborator"> | string | null;
    accessLevel?: Prisma.StringFilter<"RegistrationCollaborator"> | string;
    isPending?: Prisma.BoolFilter<"RegistrationCollaborator"> | boolean;
    invitedById?: Prisma.StringNullableFilter<"RegistrationCollaborator"> | string | null;
    createdAt?: Prisma.DateTimeFilter<"RegistrationCollaborator"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"RegistrationCollaborator"> | Date | string;
};
export type RegistrationCollaboratorCreateWithoutCampaignInput = {
    id?: string;
    clinicId: string;
    email?: string | null;
    accessLevel?: string;
    isPending?: boolean;
    invitedById?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    user?: Prisma.UserCreateNestedOneWithoutRegistrationCollaborationsInput;
};
export type RegistrationCollaboratorUncheckedCreateWithoutCampaignInput = {
    id?: string;
    clinicId: string;
    userId?: string | null;
    email?: string | null;
    accessLevel?: string;
    isPending?: boolean;
    invitedById?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type RegistrationCollaboratorCreateOrConnectWithoutCampaignInput = {
    where: Prisma.RegistrationCollaboratorWhereUniqueInput;
    create: Prisma.XOR<Prisma.RegistrationCollaboratorCreateWithoutCampaignInput, Prisma.RegistrationCollaboratorUncheckedCreateWithoutCampaignInput>;
};
export type RegistrationCollaboratorCreateManyCampaignInputEnvelope = {
    data: Prisma.RegistrationCollaboratorCreateManyCampaignInput | Prisma.RegistrationCollaboratorCreateManyCampaignInput[];
    skipDuplicates?: boolean;
};
export type RegistrationCollaboratorUpsertWithWhereUniqueWithoutCampaignInput = {
    where: Prisma.RegistrationCollaboratorWhereUniqueInput;
    update: Prisma.XOR<Prisma.RegistrationCollaboratorUpdateWithoutCampaignInput, Prisma.RegistrationCollaboratorUncheckedUpdateWithoutCampaignInput>;
    create: Prisma.XOR<Prisma.RegistrationCollaboratorCreateWithoutCampaignInput, Prisma.RegistrationCollaboratorUncheckedCreateWithoutCampaignInput>;
};
export type RegistrationCollaboratorUpdateWithWhereUniqueWithoutCampaignInput = {
    where: Prisma.RegistrationCollaboratorWhereUniqueInput;
    data: Prisma.XOR<Prisma.RegistrationCollaboratorUpdateWithoutCampaignInput, Prisma.RegistrationCollaboratorUncheckedUpdateWithoutCampaignInput>;
};
export type RegistrationCollaboratorUpdateManyWithWhereWithoutCampaignInput = {
    where: Prisma.RegistrationCollaboratorScalarWhereInput;
    data: Prisma.XOR<Prisma.RegistrationCollaboratorUpdateManyMutationInput, Prisma.RegistrationCollaboratorUncheckedUpdateManyWithoutCampaignInput>;
};
export type RegistrationCollaboratorCreateManyUserInput = {
    id?: string;
    campaignId: string;
    clinicId: string;
    email?: string | null;
    accessLevel?: string;
    isPending?: boolean;
    invitedById?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type RegistrationCollaboratorUpdateWithoutUserInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    clinicId?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    accessLevel?: Prisma.StringFieldUpdateOperationsInput | string;
    isPending?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    invitedById?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    campaign?: Prisma.RegistrationCampaignUpdateOneRequiredWithoutCollaboratorsNestedInput;
};
export type RegistrationCollaboratorUncheckedUpdateWithoutUserInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    campaignId?: Prisma.StringFieldUpdateOperationsInput | string;
    clinicId?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    accessLevel?: Prisma.StringFieldUpdateOperationsInput | string;
    isPending?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    invitedById?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type RegistrationCollaboratorUncheckedUpdateManyWithoutUserInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    campaignId?: Prisma.StringFieldUpdateOperationsInput | string;
    clinicId?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    accessLevel?: Prisma.StringFieldUpdateOperationsInput | string;
    isPending?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    invitedById?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type RegistrationCollaboratorCreateManyCampaignInput = {
    id?: string;
    clinicId: string;
    userId?: string | null;
    email?: string | null;
    accessLevel?: string;
    isPending?: boolean;
    invitedById?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type RegistrationCollaboratorUpdateWithoutCampaignInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    clinicId?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    accessLevel?: Prisma.StringFieldUpdateOperationsInput | string;
    isPending?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    invitedById?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    user?: Prisma.UserUpdateOneWithoutRegistrationCollaborationsNestedInput;
};
export type RegistrationCollaboratorUncheckedUpdateWithoutCampaignInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    clinicId?: Prisma.StringFieldUpdateOperationsInput | string;
    userId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    email?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    accessLevel?: Prisma.StringFieldUpdateOperationsInput | string;
    isPending?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    invitedById?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type RegistrationCollaboratorUncheckedUpdateManyWithoutCampaignInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    clinicId?: Prisma.StringFieldUpdateOperationsInput | string;
    userId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    email?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    accessLevel?: Prisma.StringFieldUpdateOperationsInput | string;
    isPending?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    invitedById?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type RegistrationCollaboratorSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    campaignId?: boolean;
    clinicId?: boolean;
    userId?: boolean;
    email?: boolean;
    accessLevel?: boolean;
    isPending?: boolean;
    invitedById?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    campaign?: boolean | Prisma.RegistrationCampaignDefaultArgs<ExtArgs>;
    user?: boolean | Prisma.RegistrationCollaborator$userArgs<ExtArgs>;
}, ExtArgs["result"]["registrationCollaborator"]>;
export type RegistrationCollaboratorSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    campaignId?: boolean;
    clinicId?: boolean;
    userId?: boolean;
    email?: boolean;
    accessLevel?: boolean;
    isPending?: boolean;
    invitedById?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    campaign?: boolean | Prisma.RegistrationCampaignDefaultArgs<ExtArgs>;
    user?: boolean | Prisma.RegistrationCollaborator$userArgs<ExtArgs>;
}, ExtArgs["result"]["registrationCollaborator"]>;
export type RegistrationCollaboratorSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    campaignId?: boolean;
    clinicId?: boolean;
    userId?: boolean;
    email?: boolean;
    accessLevel?: boolean;
    isPending?: boolean;
    invitedById?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    campaign?: boolean | Prisma.RegistrationCampaignDefaultArgs<ExtArgs>;
    user?: boolean | Prisma.RegistrationCollaborator$userArgs<ExtArgs>;
}, ExtArgs["result"]["registrationCollaborator"]>;
export type RegistrationCollaboratorSelectScalar = {
    id?: boolean;
    campaignId?: boolean;
    clinicId?: boolean;
    userId?: boolean;
    email?: boolean;
    accessLevel?: boolean;
    isPending?: boolean;
    invitedById?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
};
export type RegistrationCollaboratorOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "campaignId" | "clinicId" | "userId" | "email" | "accessLevel" | "isPending" | "invitedById" | "createdAt" | "updatedAt", ExtArgs["result"]["registrationCollaborator"]>;
export type RegistrationCollaboratorInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    campaign?: boolean | Prisma.RegistrationCampaignDefaultArgs<ExtArgs>;
    user?: boolean | Prisma.RegistrationCollaborator$userArgs<ExtArgs>;
};
export type RegistrationCollaboratorIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    campaign?: boolean | Prisma.RegistrationCampaignDefaultArgs<ExtArgs>;
    user?: boolean | Prisma.RegistrationCollaborator$userArgs<ExtArgs>;
};
export type RegistrationCollaboratorIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    campaign?: boolean | Prisma.RegistrationCampaignDefaultArgs<ExtArgs>;
    user?: boolean | Prisma.RegistrationCollaborator$userArgs<ExtArgs>;
};
export type $RegistrationCollaboratorPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "RegistrationCollaborator";
    objects: {
        campaign: Prisma.$RegistrationCampaignPayload<ExtArgs>;
        user: Prisma.$UserPayload<ExtArgs> | null;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        campaignId: string;
        clinicId: string;
        userId: string | null;
        email: string | null;
        accessLevel: string;
        isPending: boolean;
        invitedById: string | null;
        createdAt: Date;
        updatedAt: Date;
    }, ExtArgs["result"]["registrationCollaborator"]>;
    composites: {};
};
export type RegistrationCollaboratorGetPayload<S extends boolean | null | undefined | RegistrationCollaboratorDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$RegistrationCollaboratorPayload, S>;
export type RegistrationCollaboratorCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<RegistrationCollaboratorFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: RegistrationCollaboratorCountAggregateInputType | true;
};
export interface RegistrationCollaboratorDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['RegistrationCollaborator'];
        meta: {
            name: 'RegistrationCollaborator';
        };
    };
    /**
     * Find zero or one RegistrationCollaborator that matches the filter.
     * @param {RegistrationCollaboratorFindUniqueArgs} args - Arguments to find a RegistrationCollaborator
     * @example
     * // Get one RegistrationCollaborator
     * const registrationCollaborator = await prisma.registrationCollaborator.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends RegistrationCollaboratorFindUniqueArgs>(args: Prisma.SelectSubset<T, RegistrationCollaboratorFindUniqueArgs<ExtArgs>>): Prisma.Prisma__RegistrationCollaboratorClient<runtime.Types.Result.GetResult<Prisma.$RegistrationCollaboratorPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    /**
     * Find one RegistrationCollaborator that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {RegistrationCollaboratorFindUniqueOrThrowArgs} args - Arguments to find a RegistrationCollaborator
     * @example
     * // Get one RegistrationCollaborator
     * const registrationCollaborator = await prisma.registrationCollaborator.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends RegistrationCollaboratorFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, RegistrationCollaboratorFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__RegistrationCollaboratorClient<runtime.Types.Result.GetResult<Prisma.$RegistrationCollaboratorPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Find the first RegistrationCollaborator that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RegistrationCollaboratorFindFirstArgs} args - Arguments to find a RegistrationCollaborator
     * @example
     * // Get one RegistrationCollaborator
     * const registrationCollaborator = await prisma.registrationCollaborator.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends RegistrationCollaboratorFindFirstArgs>(args?: Prisma.SelectSubset<T, RegistrationCollaboratorFindFirstArgs<ExtArgs>>): Prisma.Prisma__RegistrationCollaboratorClient<runtime.Types.Result.GetResult<Prisma.$RegistrationCollaboratorPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    /**
     * Find the first RegistrationCollaborator that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RegistrationCollaboratorFindFirstOrThrowArgs} args - Arguments to find a RegistrationCollaborator
     * @example
     * // Get one RegistrationCollaborator
     * const registrationCollaborator = await prisma.registrationCollaborator.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends RegistrationCollaboratorFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, RegistrationCollaboratorFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__RegistrationCollaboratorClient<runtime.Types.Result.GetResult<Prisma.$RegistrationCollaboratorPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Find zero or more RegistrationCollaborators that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RegistrationCollaboratorFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all RegistrationCollaborators
     * const registrationCollaborators = await prisma.registrationCollaborator.findMany()
     *
     * // Get first 10 RegistrationCollaborators
     * const registrationCollaborators = await prisma.registrationCollaborator.findMany({ take: 10 })
     *
     * // Only select the `id`
     * const registrationCollaboratorWithIdOnly = await prisma.registrationCollaborator.findMany({ select: { id: true } })
     *
     */
    findMany<T extends RegistrationCollaboratorFindManyArgs>(args?: Prisma.SelectSubset<T, RegistrationCollaboratorFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$RegistrationCollaboratorPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    /**
     * Create a RegistrationCollaborator.
     * @param {RegistrationCollaboratorCreateArgs} args - Arguments to create a RegistrationCollaborator.
     * @example
     * // Create one RegistrationCollaborator
     * const RegistrationCollaborator = await prisma.registrationCollaborator.create({
     *   data: {
     *     // ... data to create a RegistrationCollaborator
     *   }
     * })
     *
     */
    create<T extends RegistrationCollaboratorCreateArgs>(args: Prisma.SelectSubset<T, RegistrationCollaboratorCreateArgs<ExtArgs>>): Prisma.Prisma__RegistrationCollaboratorClient<runtime.Types.Result.GetResult<Prisma.$RegistrationCollaboratorPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Create many RegistrationCollaborators.
     * @param {RegistrationCollaboratorCreateManyArgs} args - Arguments to create many RegistrationCollaborators.
     * @example
     * // Create many RegistrationCollaborators
     * const registrationCollaborator = await prisma.registrationCollaborator.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     */
    createMany<T extends RegistrationCollaboratorCreateManyArgs>(args?: Prisma.SelectSubset<T, RegistrationCollaboratorCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Create many RegistrationCollaborators and returns the data saved in the database.
     * @param {RegistrationCollaboratorCreateManyAndReturnArgs} args - Arguments to create many RegistrationCollaborators.
     * @example
     * // Create many RegistrationCollaborators
     * const registrationCollaborator = await prisma.registrationCollaborator.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Create many RegistrationCollaborators and only return the `id`
     * const registrationCollaboratorWithIdOnly = await prisma.registrationCollaborator.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    createManyAndReturn<T extends RegistrationCollaboratorCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, RegistrationCollaboratorCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$RegistrationCollaboratorPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    /**
     * Delete a RegistrationCollaborator.
     * @param {RegistrationCollaboratorDeleteArgs} args - Arguments to delete one RegistrationCollaborator.
     * @example
     * // Delete one RegistrationCollaborator
     * const RegistrationCollaborator = await prisma.registrationCollaborator.delete({
     *   where: {
     *     // ... filter to delete one RegistrationCollaborator
     *   }
     * })
     *
     */
    delete<T extends RegistrationCollaboratorDeleteArgs>(args: Prisma.SelectSubset<T, RegistrationCollaboratorDeleteArgs<ExtArgs>>): Prisma.Prisma__RegistrationCollaboratorClient<runtime.Types.Result.GetResult<Prisma.$RegistrationCollaboratorPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Update one RegistrationCollaborator.
     * @param {RegistrationCollaboratorUpdateArgs} args - Arguments to update one RegistrationCollaborator.
     * @example
     * // Update one RegistrationCollaborator
     * const registrationCollaborator = await prisma.registrationCollaborator.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    update<T extends RegistrationCollaboratorUpdateArgs>(args: Prisma.SelectSubset<T, RegistrationCollaboratorUpdateArgs<ExtArgs>>): Prisma.Prisma__RegistrationCollaboratorClient<runtime.Types.Result.GetResult<Prisma.$RegistrationCollaboratorPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Delete zero or more RegistrationCollaborators.
     * @param {RegistrationCollaboratorDeleteManyArgs} args - Arguments to filter RegistrationCollaborators to delete.
     * @example
     * // Delete a few RegistrationCollaborators
     * const { count } = await prisma.registrationCollaborator.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     */
    deleteMany<T extends RegistrationCollaboratorDeleteManyArgs>(args?: Prisma.SelectSubset<T, RegistrationCollaboratorDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Update zero or more RegistrationCollaborators.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RegistrationCollaboratorUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many RegistrationCollaborators
     * const registrationCollaborator = await prisma.registrationCollaborator.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    updateMany<T extends RegistrationCollaboratorUpdateManyArgs>(args: Prisma.SelectSubset<T, RegistrationCollaboratorUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Update zero or more RegistrationCollaborators and returns the data updated in the database.
     * @param {RegistrationCollaboratorUpdateManyAndReturnArgs} args - Arguments to update many RegistrationCollaborators.
     * @example
     * // Update many RegistrationCollaborators
     * const registrationCollaborator = await prisma.registrationCollaborator.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Update zero or more RegistrationCollaborators and only return the `id`
     * const registrationCollaboratorWithIdOnly = await prisma.registrationCollaborator.updateManyAndReturn({
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
    updateManyAndReturn<T extends RegistrationCollaboratorUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, RegistrationCollaboratorUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$RegistrationCollaboratorPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    /**
     * Create or update one RegistrationCollaborator.
     * @param {RegistrationCollaboratorUpsertArgs} args - Arguments to update or create a RegistrationCollaborator.
     * @example
     * // Update or create a RegistrationCollaborator
     * const registrationCollaborator = await prisma.registrationCollaborator.upsert({
     *   create: {
     *     // ... data to create a RegistrationCollaborator
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the RegistrationCollaborator we want to update
     *   }
     * })
     */
    upsert<T extends RegistrationCollaboratorUpsertArgs>(args: Prisma.SelectSubset<T, RegistrationCollaboratorUpsertArgs<ExtArgs>>): Prisma.Prisma__RegistrationCollaboratorClient<runtime.Types.Result.GetResult<Prisma.$RegistrationCollaboratorPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Count the number of RegistrationCollaborators.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RegistrationCollaboratorCountArgs} args - Arguments to filter RegistrationCollaborators to count.
     * @example
     * // Count the number of RegistrationCollaborators
     * const count = await prisma.registrationCollaborator.count({
     *   where: {
     *     // ... the filter for the RegistrationCollaborators we want to count
     *   }
     * })
    **/
    count<T extends RegistrationCollaboratorCountArgs>(args?: Prisma.Subset<T, RegistrationCollaboratorCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], RegistrationCollaboratorCountAggregateOutputType> : number>;
    /**
     * Allows you to perform aggregations operations on a RegistrationCollaborator.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RegistrationCollaboratorAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends RegistrationCollaboratorAggregateArgs>(args: Prisma.Subset<T, RegistrationCollaboratorAggregateArgs>): Prisma.PrismaPromise<GetRegistrationCollaboratorAggregateType<T>>;
    /**
     * Group by RegistrationCollaborator.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RegistrationCollaboratorGroupByArgs} args - Group by arguments.
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
    groupBy<T extends RegistrationCollaboratorGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: RegistrationCollaboratorGroupByArgs['orderBy'];
    } : {
        orderBy?: RegistrationCollaboratorGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, RegistrationCollaboratorGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetRegistrationCollaboratorGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    /**
     * Fields of the RegistrationCollaborator model
     */
    readonly fields: RegistrationCollaboratorFieldRefs;
}
/**
 * The delegate class that acts as a "Promise-like" for RegistrationCollaborator.
 * Why is this prefixed with `Prisma__`?
 * Because we want to prevent naming conflicts as mentioned in
 * https://github.com/prisma/prisma-client-js/issues/707
 */
export interface Prisma__RegistrationCollaboratorClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    campaign<T extends Prisma.RegistrationCampaignDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.RegistrationCampaignDefaultArgs<ExtArgs>>): Prisma.Prisma__RegistrationCampaignClient<runtime.Types.Result.GetResult<Prisma.$RegistrationCampaignPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    user<T extends Prisma.RegistrationCollaborator$userArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.RegistrationCollaborator$userArgs<ExtArgs>>): Prisma.Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
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
 * Fields of the RegistrationCollaborator model
 */
export interface RegistrationCollaboratorFieldRefs {
    readonly id: Prisma.FieldRef<"RegistrationCollaborator", 'String'>;
    readonly campaignId: Prisma.FieldRef<"RegistrationCollaborator", 'String'>;
    readonly clinicId: Prisma.FieldRef<"RegistrationCollaborator", 'String'>;
    readonly userId: Prisma.FieldRef<"RegistrationCollaborator", 'String'>;
    readonly email: Prisma.FieldRef<"RegistrationCollaborator", 'String'>;
    readonly accessLevel: Prisma.FieldRef<"RegistrationCollaborator", 'String'>;
    readonly isPending: Prisma.FieldRef<"RegistrationCollaborator", 'Boolean'>;
    readonly invitedById: Prisma.FieldRef<"RegistrationCollaborator", 'String'>;
    readonly createdAt: Prisma.FieldRef<"RegistrationCollaborator", 'DateTime'>;
    readonly updatedAt: Prisma.FieldRef<"RegistrationCollaborator", 'DateTime'>;
}
/**
 * RegistrationCollaborator findUnique
 */
export type RegistrationCollaboratorFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RegistrationCollaborator
     */
    select?: Prisma.RegistrationCollaboratorSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the RegistrationCollaborator
     */
    omit?: Prisma.RegistrationCollaboratorOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.RegistrationCollaboratorInclude<ExtArgs> | null;
    /**
     * Filter, which RegistrationCollaborator to fetch.
     */
    where: Prisma.RegistrationCollaboratorWhereUniqueInput;
};
/**
 * RegistrationCollaborator findUniqueOrThrow
 */
export type RegistrationCollaboratorFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RegistrationCollaborator
     */
    select?: Prisma.RegistrationCollaboratorSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the RegistrationCollaborator
     */
    omit?: Prisma.RegistrationCollaboratorOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.RegistrationCollaboratorInclude<ExtArgs> | null;
    /**
     * Filter, which RegistrationCollaborator to fetch.
     */
    where: Prisma.RegistrationCollaboratorWhereUniqueInput;
};
/**
 * RegistrationCollaborator findFirst
 */
export type RegistrationCollaboratorFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RegistrationCollaborator
     */
    select?: Prisma.RegistrationCollaboratorSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the RegistrationCollaborator
     */
    omit?: Prisma.RegistrationCollaboratorOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.RegistrationCollaboratorInclude<ExtArgs> | null;
    /**
     * Filter, which RegistrationCollaborator to fetch.
     */
    where?: Prisma.RegistrationCollaboratorWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of RegistrationCollaborators to fetch.
     */
    orderBy?: Prisma.RegistrationCollaboratorOrderByWithRelationInput | Prisma.RegistrationCollaboratorOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for RegistrationCollaborators.
     */
    cursor?: Prisma.RegistrationCollaboratorWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` RegistrationCollaborators from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` RegistrationCollaborators.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of RegistrationCollaborators.
     */
    distinct?: Prisma.RegistrationCollaboratorScalarFieldEnum | Prisma.RegistrationCollaboratorScalarFieldEnum[];
};
/**
 * RegistrationCollaborator findFirstOrThrow
 */
export type RegistrationCollaboratorFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RegistrationCollaborator
     */
    select?: Prisma.RegistrationCollaboratorSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the RegistrationCollaborator
     */
    omit?: Prisma.RegistrationCollaboratorOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.RegistrationCollaboratorInclude<ExtArgs> | null;
    /**
     * Filter, which RegistrationCollaborator to fetch.
     */
    where?: Prisma.RegistrationCollaboratorWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of RegistrationCollaborators to fetch.
     */
    orderBy?: Prisma.RegistrationCollaboratorOrderByWithRelationInput | Prisma.RegistrationCollaboratorOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for RegistrationCollaborators.
     */
    cursor?: Prisma.RegistrationCollaboratorWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` RegistrationCollaborators from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` RegistrationCollaborators.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of RegistrationCollaborators.
     */
    distinct?: Prisma.RegistrationCollaboratorScalarFieldEnum | Prisma.RegistrationCollaboratorScalarFieldEnum[];
};
/**
 * RegistrationCollaborator findMany
 */
export type RegistrationCollaboratorFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RegistrationCollaborator
     */
    select?: Prisma.RegistrationCollaboratorSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the RegistrationCollaborator
     */
    omit?: Prisma.RegistrationCollaboratorOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.RegistrationCollaboratorInclude<ExtArgs> | null;
    /**
     * Filter, which RegistrationCollaborators to fetch.
     */
    where?: Prisma.RegistrationCollaboratorWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of RegistrationCollaborators to fetch.
     */
    orderBy?: Prisma.RegistrationCollaboratorOrderByWithRelationInput | Prisma.RegistrationCollaboratorOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing RegistrationCollaborators.
     */
    cursor?: Prisma.RegistrationCollaboratorWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` RegistrationCollaborators from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` RegistrationCollaborators.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of RegistrationCollaborators.
     */
    distinct?: Prisma.RegistrationCollaboratorScalarFieldEnum | Prisma.RegistrationCollaboratorScalarFieldEnum[];
};
/**
 * RegistrationCollaborator create
 */
export type RegistrationCollaboratorCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RegistrationCollaborator
     */
    select?: Prisma.RegistrationCollaboratorSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the RegistrationCollaborator
     */
    omit?: Prisma.RegistrationCollaboratorOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.RegistrationCollaboratorInclude<ExtArgs> | null;
    /**
     * The data needed to create a RegistrationCollaborator.
     */
    data: Prisma.XOR<Prisma.RegistrationCollaboratorCreateInput, Prisma.RegistrationCollaboratorUncheckedCreateInput>;
};
/**
 * RegistrationCollaborator createMany
 */
export type RegistrationCollaboratorCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * The data used to create many RegistrationCollaborators.
     */
    data: Prisma.RegistrationCollaboratorCreateManyInput | Prisma.RegistrationCollaboratorCreateManyInput[];
    skipDuplicates?: boolean;
};
/**
 * RegistrationCollaborator createManyAndReturn
 */
export type RegistrationCollaboratorCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RegistrationCollaborator
     */
    select?: Prisma.RegistrationCollaboratorSelectCreateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the RegistrationCollaborator
     */
    omit?: Prisma.RegistrationCollaboratorOmit<ExtArgs> | null;
    /**
     * The data used to create many RegistrationCollaborators.
     */
    data: Prisma.RegistrationCollaboratorCreateManyInput | Prisma.RegistrationCollaboratorCreateManyInput[];
    skipDuplicates?: boolean;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.RegistrationCollaboratorIncludeCreateManyAndReturn<ExtArgs> | null;
};
/**
 * RegistrationCollaborator update
 */
export type RegistrationCollaboratorUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RegistrationCollaborator
     */
    select?: Prisma.RegistrationCollaboratorSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the RegistrationCollaborator
     */
    omit?: Prisma.RegistrationCollaboratorOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.RegistrationCollaboratorInclude<ExtArgs> | null;
    /**
     * The data needed to update a RegistrationCollaborator.
     */
    data: Prisma.XOR<Prisma.RegistrationCollaboratorUpdateInput, Prisma.RegistrationCollaboratorUncheckedUpdateInput>;
    /**
     * Choose, which RegistrationCollaborator to update.
     */
    where: Prisma.RegistrationCollaboratorWhereUniqueInput;
};
/**
 * RegistrationCollaborator updateMany
 */
export type RegistrationCollaboratorUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * The data used to update RegistrationCollaborators.
     */
    data: Prisma.XOR<Prisma.RegistrationCollaboratorUpdateManyMutationInput, Prisma.RegistrationCollaboratorUncheckedUpdateManyInput>;
    /**
     * Filter which RegistrationCollaborators to update
     */
    where?: Prisma.RegistrationCollaboratorWhereInput;
    /**
     * Limit how many RegistrationCollaborators to update.
     */
    limit?: number;
};
/**
 * RegistrationCollaborator updateManyAndReturn
 */
export type RegistrationCollaboratorUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RegistrationCollaborator
     */
    select?: Prisma.RegistrationCollaboratorSelectUpdateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the RegistrationCollaborator
     */
    omit?: Prisma.RegistrationCollaboratorOmit<ExtArgs> | null;
    /**
     * The data used to update RegistrationCollaborators.
     */
    data: Prisma.XOR<Prisma.RegistrationCollaboratorUpdateManyMutationInput, Prisma.RegistrationCollaboratorUncheckedUpdateManyInput>;
    /**
     * Filter which RegistrationCollaborators to update
     */
    where?: Prisma.RegistrationCollaboratorWhereInput;
    /**
     * Limit how many RegistrationCollaborators to update.
     */
    limit?: number;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.RegistrationCollaboratorIncludeUpdateManyAndReturn<ExtArgs> | null;
};
/**
 * RegistrationCollaborator upsert
 */
export type RegistrationCollaboratorUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RegistrationCollaborator
     */
    select?: Prisma.RegistrationCollaboratorSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the RegistrationCollaborator
     */
    omit?: Prisma.RegistrationCollaboratorOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.RegistrationCollaboratorInclude<ExtArgs> | null;
    /**
     * The filter to search for the RegistrationCollaborator to update in case it exists.
     */
    where: Prisma.RegistrationCollaboratorWhereUniqueInput;
    /**
     * In case the RegistrationCollaborator found by the `where` argument doesn't exist, create a new RegistrationCollaborator with this data.
     */
    create: Prisma.XOR<Prisma.RegistrationCollaboratorCreateInput, Prisma.RegistrationCollaboratorUncheckedCreateInput>;
    /**
     * In case the RegistrationCollaborator was found with the provided `where` argument, update it with this data.
     */
    update: Prisma.XOR<Prisma.RegistrationCollaboratorUpdateInput, Prisma.RegistrationCollaboratorUncheckedUpdateInput>;
};
/**
 * RegistrationCollaborator delete
 */
export type RegistrationCollaboratorDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RegistrationCollaborator
     */
    select?: Prisma.RegistrationCollaboratorSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the RegistrationCollaborator
     */
    omit?: Prisma.RegistrationCollaboratorOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.RegistrationCollaboratorInclude<ExtArgs> | null;
    /**
     * Filter which RegistrationCollaborator to delete.
     */
    where: Prisma.RegistrationCollaboratorWhereUniqueInput;
};
/**
 * RegistrationCollaborator deleteMany
 */
export type RegistrationCollaboratorDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Filter which RegistrationCollaborators to delete
     */
    where?: Prisma.RegistrationCollaboratorWhereInput;
    /**
     * Limit how many RegistrationCollaborators to delete.
     */
    limit?: number;
};
/**
 * RegistrationCollaborator.user
 */
export type RegistrationCollaborator$userArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: Prisma.UserSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the User
     */
    omit?: Prisma.UserOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.UserInclude<ExtArgs> | null;
    where?: Prisma.UserWhereInput;
};
/**
 * RegistrationCollaborator without action
 */
export type RegistrationCollaboratorDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RegistrationCollaborator
     */
    select?: Prisma.RegistrationCollaboratorSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the RegistrationCollaborator
     */
    omit?: Prisma.RegistrationCollaboratorOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.RegistrationCollaboratorInclude<ExtArgs> | null;
};
