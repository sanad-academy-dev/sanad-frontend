import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace";
/**
 * Model ClassroomClassification
 *
 */
export type ClassroomClassificationModel = runtime.Types.Result.DefaultSelection<Prisma.$ClassroomClassificationPayload>;
export type AggregateClassroomClassification = {
    _count: ClassroomClassificationCountAggregateOutputType | null;
    _min: ClassroomClassificationMinAggregateOutputType | null;
    _max: ClassroomClassificationMaxAggregateOutputType | null;
};
export type ClassroomClassificationMinAggregateOutputType = {
    id: string | null;
    clinicId: string | null;
    name: string | null;
    createdAt: Date | null;
};
export type ClassroomClassificationMaxAggregateOutputType = {
    id: string | null;
    clinicId: string | null;
    name: string | null;
    createdAt: Date | null;
};
export type ClassroomClassificationCountAggregateOutputType = {
    id: number;
    clinicId: number;
    name: number;
    createdAt: number;
    _all: number;
};
export type ClassroomClassificationMinAggregateInputType = {
    id?: true;
    clinicId?: true;
    name?: true;
    createdAt?: true;
};
export type ClassroomClassificationMaxAggregateInputType = {
    id?: true;
    clinicId?: true;
    name?: true;
    createdAt?: true;
};
export type ClassroomClassificationCountAggregateInputType = {
    id?: true;
    clinicId?: true;
    name?: true;
    createdAt?: true;
    _all?: true;
};
export type ClassroomClassificationAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Filter which ClassroomClassification to aggregate.
     */
    where?: Prisma.ClassroomClassificationWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of ClassroomClassifications to fetch.
     */
    orderBy?: Prisma.ClassroomClassificationOrderByWithRelationInput | Prisma.ClassroomClassificationOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     */
    cursor?: Prisma.ClassroomClassificationWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` ClassroomClassifications from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` ClassroomClassifications.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned ClassroomClassifications
    **/
    _count?: true | ClassroomClassificationCountAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
    **/
    _min?: ClassroomClassificationMinAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
    **/
    _max?: ClassroomClassificationMaxAggregateInputType;
};
export type GetClassroomClassificationAggregateType<T extends ClassroomClassificationAggregateArgs> = {
    [P in keyof T & keyof AggregateClassroomClassification]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateClassroomClassification[P]> : Prisma.GetScalarType<T[P], AggregateClassroomClassification[P]>;
};
export type ClassroomClassificationGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ClassroomClassificationWhereInput;
    orderBy?: Prisma.ClassroomClassificationOrderByWithAggregationInput | Prisma.ClassroomClassificationOrderByWithAggregationInput[];
    by: Prisma.ClassroomClassificationScalarFieldEnum[] | Prisma.ClassroomClassificationScalarFieldEnum;
    having?: Prisma.ClassroomClassificationScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: ClassroomClassificationCountAggregateInputType | true;
    _min?: ClassroomClassificationMinAggregateInputType;
    _max?: ClassroomClassificationMaxAggregateInputType;
};
export type ClassroomClassificationGroupByOutputType = {
    id: string;
    clinicId: string;
    name: string;
    createdAt: Date;
    _count: ClassroomClassificationCountAggregateOutputType | null;
    _min: ClassroomClassificationMinAggregateOutputType | null;
    _max: ClassroomClassificationMaxAggregateOutputType | null;
};
export type GetClassroomClassificationGroupByPayload<T extends ClassroomClassificationGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<ClassroomClassificationGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof ClassroomClassificationGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], ClassroomClassificationGroupByOutputType[P]> : Prisma.GetScalarType<T[P], ClassroomClassificationGroupByOutputType[P]>;
}>>;
export type ClassroomClassificationWhereInput = {
    AND?: Prisma.ClassroomClassificationWhereInput | Prisma.ClassroomClassificationWhereInput[];
    OR?: Prisma.ClassroomClassificationWhereInput[];
    NOT?: Prisma.ClassroomClassificationWhereInput | Prisma.ClassroomClassificationWhereInput[];
    id?: Prisma.StringFilter<"ClassroomClassification"> | string;
    clinicId?: Prisma.StringFilter<"ClassroomClassification"> | string;
    name?: Prisma.StringFilter<"ClassroomClassification"> | string;
    createdAt?: Prisma.DateTimeFilter<"ClassroomClassification"> | Date | string;
    clinic?: Prisma.XOR<Prisma.ClinicScalarRelationFilter, Prisma.ClinicWhereInput>;
};
export type ClassroomClassificationOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    clinicId?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    clinic?: Prisma.ClinicOrderByWithRelationInput;
};
export type ClassroomClassificationWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    clinicId_name?: Prisma.ClassroomClassificationClinicIdNameCompoundUniqueInput;
    AND?: Prisma.ClassroomClassificationWhereInput | Prisma.ClassroomClassificationWhereInput[];
    OR?: Prisma.ClassroomClassificationWhereInput[];
    NOT?: Prisma.ClassroomClassificationWhereInput | Prisma.ClassroomClassificationWhereInput[];
    clinicId?: Prisma.StringFilter<"ClassroomClassification"> | string;
    name?: Prisma.StringFilter<"ClassroomClassification"> | string;
    createdAt?: Prisma.DateTimeFilter<"ClassroomClassification"> | Date | string;
    clinic?: Prisma.XOR<Prisma.ClinicScalarRelationFilter, Prisma.ClinicWhereInput>;
}, "id" | "clinicId_name">;
export type ClassroomClassificationOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    clinicId?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    _count?: Prisma.ClassroomClassificationCountOrderByAggregateInput;
    _max?: Prisma.ClassroomClassificationMaxOrderByAggregateInput;
    _min?: Prisma.ClassroomClassificationMinOrderByAggregateInput;
};
export type ClassroomClassificationScalarWhereWithAggregatesInput = {
    AND?: Prisma.ClassroomClassificationScalarWhereWithAggregatesInput | Prisma.ClassroomClassificationScalarWhereWithAggregatesInput[];
    OR?: Prisma.ClassroomClassificationScalarWhereWithAggregatesInput[];
    NOT?: Prisma.ClassroomClassificationScalarWhereWithAggregatesInput | Prisma.ClassroomClassificationScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"ClassroomClassification"> | string;
    clinicId?: Prisma.StringWithAggregatesFilter<"ClassroomClassification"> | string;
    name?: Prisma.StringWithAggregatesFilter<"ClassroomClassification"> | string;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"ClassroomClassification"> | Date | string;
};
export type ClassroomClassificationCreateInput = {
    id: string;
    name: string;
    createdAt?: Date | string;
    clinic: Prisma.ClinicCreateNestedOneWithoutClassroomClassificationsInput;
};
export type ClassroomClassificationUncheckedCreateInput = {
    id: string;
    clinicId: string;
    name: string;
    createdAt?: Date | string;
};
export type ClassroomClassificationUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    clinic?: Prisma.ClinicUpdateOneRequiredWithoutClassroomClassificationsNestedInput;
};
export type ClassroomClassificationUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    clinicId?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ClassroomClassificationCreateManyInput = {
    id: string;
    clinicId: string;
    name: string;
    createdAt?: Date | string;
};
export type ClassroomClassificationUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ClassroomClassificationUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    clinicId?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ClassroomClassificationListRelationFilter = {
    every?: Prisma.ClassroomClassificationWhereInput;
    some?: Prisma.ClassroomClassificationWhereInput;
    none?: Prisma.ClassroomClassificationWhereInput;
};
export type ClassroomClassificationOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type ClassroomClassificationClinicIdNameCompoundUniqueInput = {
    clinicId: string;
    name: string;
};
export type ClassroomClassificationCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    clinicId?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type ClassroomClassificationMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    clinicId?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type ClassroomClassificationMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    clinicId?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type ClassroomClassificationCreateNestedManyWithoutClinicInput = {
    create?: Prisma.XOR<Prisma.ClassroomClassificationCreateWithoutClinicInput, Prisma.ClassroomClassificationUncheckedCreateWithoutClinicInput> | Prisma.ClassroomClassificationCreateWithoutClinicInput[] | Prisma.ClassroomClassificationUncheckedCreateWithoutClinicInput[];
    connectOrCreate?: Prisma.ClassroomClassificationCreateOrConnectWithoutClinicInput | Prisma.ClassroomClassificationCreateOrConnectWithoutClinicInput[];
    createMany?: Prisma.ClassroomClassificationCreateManyClinicInputEnvelope;
    connect?: Prisma.ClassroomClassificationWhereUniqueInput | Prisma.ClassroomClassificationWhereUniqueInput[];
};
export type ClassroomClassificationUncheckedCreateNestedManyWithoutClinicInput = {
    create?: Prisma.XOR<Prisma.ClassroomClassificationCreateWithoutClinicInput, Prisma.ClassroomClassificationUncheckedCreateWithoutClinicInput> | Prisma.ClassroomClassificationCreateWithoutClinicInput[] | Prisma.ClassroomClassificationUncheckedCreateWithoutClinicInput[];
    connectOrCreate?: Prisma.ClassroomClassificationCreateOrConnectWithoutClinicInput | Prisma.ClassroomClassificationCreateOrConnectWithoutClinicInput[];
    createMany?: Prisma.ClassroomClassificationCreateManyClinicInputEnvelope;
    connect?: Prisma.ClassroomClassificationWhereUniqueInput | Prisma.ClassroomClassificationWhereUniqueInput[];
};
export type ClassroomClassificationUpdateManyWithoutClinicNestedInput = {
    create?: Prisma.XOR<Prisma.ClassroomClassificationCreateWithoutClinicInput, Prisma.ClassroomClassificationUncheckedCreateWithoutClinicInput> | Prisma.ClassroomClassificationCreateWithoutClinicInput[] | Prisma.ClassroomClassificationUncheckedCreateWithoutClinicInput[];
    connectOrCreate?: Prisma.ClassroomClassificationCreateOrConnectWithoutClinicInput | Prisma.ClassroomClassificationCreateOrConnectWithoutClinicInput[];
    upsert?: Prisma.ClassroomClassificationUpsertWithWhereUniqueWithoutClinicInput | Prisma.ClassroomClassificationUpsertWithWhereUniqueWithoutClinicInput[];
    createMany?: Prisma.ClassroomClassificationCreateManyClinicInputEnvelope;
    set?: Prisma.ClassroomClassificationWhereUniqueInput | Prisma.ClassroomClassificationWhereUniqueInput[];
    disconnect?: Prisma.ClassroomClassificationWhereUniqueInput | Prisma.ClassroomClassificationWhereUniqueInput[];
    delete?: Prisma.ClassroomClassificationWhereUniqueInput | Prisma.ClassroomClassificationWhereUniqueInput[];
    connect?: Prisma.ClassroomClassificationWhereUniqueInput | Prisma.ClassroomClassificationWhereUniqueInput[];
    update?: Prisma.ClassroomClassificationUpdateWithWhereUniqueWithoutClinicInput | Prisma.ClassroomClassificationUpdateWithWhereUniqueWithoutClinicInput[];
    updateMany?: Prisma.ClassroomClassificationUpdateManyWithWhereWithoutClinicInput | Prisma.ClassroomClassificationUpdateManyWithWhereWithoutClinicInput[];
    deleteMany?: Prisma.ClassroomClassificationScalarWhereInput | Prisma.ClassroomClassificationScalarWhereInput[];
};
export type ClassroomClassificationUncheckedUpdateManyWithoutClinicNestedInput = {
    create?: Prisma.XOR<Prisma.ClassroomClassificationCreateWithoutClinicInput, Prisma.ClassroomClassificationUncheckedCreateWithoutClinicInput> | Prisma.ClassroomClassificationCreateWithoutClinicInput[] | Prisma.ClassroomClassificationUncheckedCreateWithoutClinicInput[];
    connectOrCreate?: Prisma.ClassroomClassificationCreateOrConnectWithoutClinicInput | Prisma.ClassroomClassificationCreateOrConnectWithoutClinicInput[];
    upsert?: Prisma.ClassroomClassificationUpsertWithWhereUniqueWithoutClinicInput | Prisma.ClassroomClassificationUpsertWithWhereUniqueWithoutClinicInput[];
    createMany?: Prisma.ClassroomClassificationCreateManyClinicInputEnvelope;
    set?: Prisma.ClassroomClassificationWhereUniqueInput | Prisma.ClassroomClassificationWhereUniqueInput[];
    disconnect?: Prisma.ClassroomClassificationWhereUniqueInput | Prisma.ClassroomClassificationWhereUniqueInput[];
    delete?: Prisma.ClassroomClassificationWhereUniqueInput | Prisma.ClassroomClassificationWhereUniqueInput[];
    connect?: Prisma.ClassroomClassificationWhereUniqueInput | Prisma.ClassroomClassificationWhereUniqueInput[];
    update?: Prisma.ClassroomClassificationUpdateWithWhereUniqueWithoutClinicInput | Prisma.ClassroomClassificationUpdateWithWhereUniqueWithoutClinicInput[];
    updateMany?: Prisma.ClassroomClassificationUpdateManyWithWhereWithoutClinicInput | Prisma.ClassroomClassificationUpdateManyWithWhereWithoutClinicInput[];
    deleteMany?: Prisma.ClassroomClassificationScalarWhereInput | Prisma.ClassroomClassificationScalarWhereInput[];
};
export type ClassroomClassificationCreateWithoutClinicInput = {
    id: string;
    name: string;
    createdAt?: Date | string;
};
export type ClassroomClassificationUncheckedCreateWithoutClinicInput = {
    id: string;
    name: string;
    createdAt?: Date | string;
};
export type ClassroomClassificationCreateOrConnectWithoutClinicInput = {
    where: Prisma.ClassroomClassificationWhereUniqueInput;
    create: Prisma.XOR<Prisma.ClassroomClassificationCreateWithoutClinicInput, Prisma.ClassroomClassificationUncheckedCreateWithoutClinicInput>;
};
export type ClassroomClassificationCreateManyClinicInputEnvelope = {
    data: Prisma.ClassroomClassificationCreateManyClinicInput | Prisma.ClassroomClassificationCreateManyClinicInput[];
    skipDuplicates?: boolean;
};
export type ClassroomClassificationUpsertWithWhereUniqueWithoutClinicInput = {
    where: Prisma.ClassroomClassificationWhereUniqueInput;
    update: Prisma.XOR<Prisma.ClassroomClassificationUpdateWithoutClinicInput, Prisma.ClassroomClassificationUncheckedUpdateWithoutClinicInput>;
    create: Prisma.XOR<Prisma.ClassroomClassificationCreateWithoutClinicInput, Prisma.ClassroomClassificationUncheckedCreateWithoutClinicInput>;
};
export type ClassroomClassificationUpdateWithWhereUniqueWithoutClinicInput = {
    where: Prisma.ClassroomClassificationWhereUniqueInput;
    data: Prisma.XOR<Prisma.ClassroomClassificationUpdateWithoutClinicInput, Prisma.ClassroomClassificationUncheckedUpdateWithoutClinicInput>;
};
export type ClassroomClassificationUpdateManyWithWhereWithoutClinicInput = {
    where: Prisma.ClassroomClassificationScalarWhereInput;
    data: Prisma.XOR<Prisma.ClassroomClassificationUpdateManyMutationInput, Prisma.ClassroomClassificationUncheckedUpdateManyWithoutClinicInput>;
};
export type ClassroomClassificationScalarWhereInput = {
    AND?: Prisma.ClassroomClassificationScalarWhereInput | Prisma.ClassroomClassificationScalarWhereInput[];
    OR?: Prisma.ClassroomClassificationScalarWhereInput[];
    NOT?: Prisma.ClassroomClassificationScalarWhereInput | Prisma.ClassroomClassificationScalarWhereInput[];
    id?: Prisma.StringFilter<"ClassroomClassification"> | string;
    clinicId?: Prisma.StringFilter<"ClassroomClassification"> | string;
    name?: Prisma.StringFilter<"ClassroomClassification"> | string;
    createdAt?: Prisma.DateTimeFilter<"ClassroomClassification"> | Date | string;
};
export type ClassroomClassificationCreateManyClinicInput = {
    id: string;
    name: string;
    createdAt?: Date | string;
};
export type ClassroomClassificationUpdateWithoutClinicInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ClassroomClassificationUncheckedUpdateWithoutClinicInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ClassroomClassificationUncheckedUpdateManyWithoutClinicInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ClassroomClassificationSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    clinicId?: boolean;
    name?: boolean;
    createdAt?: boolean;
    clinic?: boolean | Prisma.ClinicDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["classroomClassification"]>;
export type ClassroomClassificationSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    clinicId?: boolean;
    name?: boolean;
    createdAt?: boolean;
    clinic?: boolean | Prisma.ClinicDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["classroomClassification"]>;
export type ClassroomClassificationSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    clinicId?: boolean;
    name?: boolean;
    createdAt?: boolean;
    clinic?: boolean | Prisma.ClinicDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["classroomClassification"]>;
export type ClassroomClassificationSelectScalar = {
    id?: boolean;
    clinicId?: boolean;
    name?: boolean;
    createdAt?: boolean;
};
export type ClassroomClassificationOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "clinicId" | "name" | "createdAt", ExtArgs["result"]["classroomClassification"]>;
export type ClassroomClassificationInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    clinic?: boolean | Prisma.ClinicDefaultArgs<ExtArgs>;
};
export type ClassroomClassificationIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    clinic?: boolean | Prisma.ClinicDefaultArgs<ExtArgs>;
};
export type ClassroomClassificationIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    clinic?: boolean | Prisma.ClinicDefaultArgs<ExtArgs>;
};
export type $ClassroomClassificationPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "ClassroomClassification";
    objects: {
        clinic: Prisma.$ClinicPayload<ExtArgs>;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        clinicId: string;
        name: string;
        createdAt: Date;
    }, ExtArgs["result"]["classroomClassification"]>;
    composites: {};
};
export type ClassroomClassificationGetPayload<S extends boolean | null | undefined | ClassroomClassificationDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$ClassroomClassificationPayload, S>;
export type ClassroomClassificationCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<ClassroomClassificationFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: ClassroomClassificationCountAggregateInputType | true;
};
export interface ClassroomClassificationDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['ClassroomClassification'];
        meta: {
            name: 'ClassroomClassification';
        };
    };
    /**
     * Find zero or one ClassroomClassification that matches the filter.
     * @param {ClassroomClassificationFindUniqueArgs} args - Arguments to find a ClassroomClassification
     * @example
     * // Get one ClassroomClassification
     * const classroomClassification = await prisma.classroomClassification.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ClassroomClassificationFindUniqueArgs>(args: Prisma.SelectSubset<T, ClassroomClassificationFindUniqueArgs<ExtArgs>>): Prisma.Prisma__ClassroomClassificationClient<runtime.Types.Result.GetResult<Prisma.$ClassroomClassificationPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    /**
     * Find one ClassroomClassification that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ClassroomClassificationFindUniqueOrThrowArgs} args - Arguments to find a ClassroomClassification
     * @example
     * // Get one ClassroomClassification
     * const classroomClassification = await prisma.classroomClassification.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ClassroomClassificationFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, ClassroomClassificationFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__ClassroomClassificationClient<runtime.Types.Result.GetResult<Prisma.$ClassroomClassificationPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Find the first ClassroomClassification that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ClassroomClassificationFindFirstArgs} args - Arguments to find a ClassroomClassification
     * @example
     * // Get one ClassroomClassification
     * const classroomClassification = await prisma.classroomClassification.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ClassroomClassificationFindFirstArgs>(args?: Prisma.SelectSubset<T, ClassroomClassificationFindFirstArgs<ExtArgs>>): Prisma.Prisma__ClassroomClassificationClient<runtime.Types.Result.GetResult<Prisma.$ClassroomClassificationPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    /**
     * Find the first ClassroomClassification that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ClassroomClassificationFindFirstOrThrowArgs} args - Arguments to find a ClassroomClassification
     * @example
     * // Get one ClassroomClassification
     * const classroomClassification = await prisma.classroomClassification.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ClassroomClassificationFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, ClassroomClassificationFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__ClassroomClassificationClient<runtime.Types.Result.GetResult<Prisma.$ClassroomClassificationPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Find zero or more ClassroomClassifications that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ClassroomClassificationFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ClassroomClassifications
     * const classroomClassifications = await prisma.classroomClassification.findMany()
     *
     * // Get first 10 ClassroomClassifications
     * const classroomClassifications = await prisma.classroomClassification.findMany({ take: 10 })
     *
     * // Only select the `id`
     * const classroomClassificationWithIdOnly = await prisma.classroomClassification.findMany({ select: { id: true } })
     *
     */
    findMany<T extends ClassroomClassificationFindManyArgs>(args?: Prisma.SelectSubset<T, ClassroomClassificationFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ClassroomClassificationPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    /**
     * Create a ClassroomClassification.
     * @param {ClassroomClassificationCreateArgs} args - Arguments to create a ClassroomClassification.
     * @example
     * // Create one ClassroomClassification
     * const ClassroomClassification = await prisma.classroomClassification.create({
     *   data: {
     *     // ... data to create a ClassroomClassification
     *   }
     * })
     *
     */
    create<T extends ClassroomClassificationCreateArgs>(args: Prisma.SelectSubset<T, ClassroomClassificationCreateArgs<ExtArgs>>): Prisma.Prisma__ClassroomClassificationClient<runtime.Types.Result.GetResult<Prisma.$ClassroomClassificationPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Create many ClassroomClassifications.
     * @param {ClassroomClassificationCreateManyArgs} args - Arguments to create many ClassroomClassifications.
     * @example
     * // Create many ClassroomClassifications
     * const classroomClassification = await prisma.classroomClassification.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     */
    createMany<T extends ClassroomClassificationCreateManyArgs>(args?: Prisma.SelectSubset<T, ClassroomClassificationCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Create many ClassroomClassifications and returns the data saved in the database.
     * @param {ClassroomClassificationCreateManyAndReturnArgs} args - Arguments to create many ClassroomClassifications.
     * @example
     * // Create many ClassroomClassifications
     * const classroomClassification = await prisma.classroomClassification.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Create many ClassroomClassifications and only return the `id`
     * const classroomClassificationWithIdOnly = await prisma.classroomClassification.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    createManyAndReturn<T extends ClassroomClassificationCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, ClassroomClassificationCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ClassroomClassificationPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    /**
     * Delete a ClassroomClassification.
     * @param {ClassroomClassificationDeleteArgs} args - Arguments to delete one ClassroomClassification.
     * @example
     * // Delete one ClassroomClassification
     * const ClassroomClassification = await prisma.classroomClassification.delete({
     *   where: {
     *     // ... filter to delete one ClassroomClassification
     *   }
     * })
     *
     */
    delete<T extends ClassroomClassificationDeleteArgs>(args: Prisma.SelectSubset<T, ClassroomClassificationDeleteArgs<ExtArgs>>): Prisma.Prisma__ClassroomClassificationClient<runtime.Types.Result.GetResult<Prisma.$ClassroomClassificationPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Update one ClassroomClassification.
     * @param {ClassroomClassificationUpdateArgs} args - Arguments to update one ClassroomClassification.
     * @example
     * // Update one ClassroomClassification
     * const classroomClassification = await prisma.classroomClassification.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    update<T extends ClassroomClassificationUpdateArgs>(args: Prisma.SelectSubset<T, ClassroomClassificationUpdateArgs<ExtArgs>>): Prisma.Prisma__ClassroomClassificationClient<runtime.Types.Result.GetResult<Prisma.$ClassroomClassificationPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Delete zero or more ClassroomClassifications.
     * @param {ClassroomClassificationDeleteManyArgs} args - Arguments to filter ClassroomClassifications to delete.
     * @example
     * // Delete a few ClassroomClassifications
     * const { count } = await prisma.classroomClassification.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     */
    deleteMany<T extends ClassroomClassificationDeleteManyArgs>(args?: Prisma.SelectSubset<T, ClassroomClassificationDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Update zero or more ClassroomClassifications.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ClassroomClassificationUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ClassroomClassifications
     * const classroomClassification = await prisma.classroomClassification.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    updateMany<T extends ClassroomClassificationUpdateManyArgs>(args: Prisma.SelectSubset<T, ClassroomClassificationUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Update zero or more ClassroomClassifications and returns the data updated in the database.
     * @param {ClassroomClassificationUpdateManyAndReturnArgs} args - Arguments to update many ClassroomClassifications.
     * @example
     * // Update many ClassroomClassifications
     * const classroomClassification = await prisma.classroomClassification.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Update zero or more ClassroomClassifications and only return the `id`
     * const classroomClassificationWithIdOnly = await prisma.classroomClassification.updateManyAndReturn({
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
    updateManyAndReturn<T extends ClassroomClassificationUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, ClassroomClassificationUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ClassroomClassificationPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    /**
     * Create or update one ClassroomClassification.
     * @param {ClassroomClassificationUpsertArgs} args - Arguments to update or create a ClassroomClassification.
     * @example
     * // Update or create a ClassroomClassification
     * const classroomClassification = await prisma.classroomClassification.upsert({
     *   create: {
     *     // ... data to create a ClassroomClassification
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ClassroomClassification we want to update
     *   }
     * })
     */
    upsert<T extends ClassroomClassificationUpsertArgs>(args: Prisma.SelectSubset<T, ClassroomClassificationUpsertArgs<ExtArgs>>): Prisma.Prisma__ClassroomClassificationClient<runtime.Types.Result.GetResult<Prisma.$ClassroomClassificationPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Count the number of ClassroomClassifications.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ClassroomClassificationCountArgs} args - Arguments to filter ClassroomClassifications to count.
     * @example
     * // Count the number of ClassroomClassifications
     * const count = await prisma.classroomClassification.count({
     *   where: {
     *     // ... the filter for the ClassroomClassifications we want to count
     *   }
     * })
    **/
    count<T extends ClassroomClassificationCountArgs>(args?: Prisma.Subset<T, ClassroomClassificationCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], ClassroomClassificationCountAggregateOutputType> : number>;
    /**
     * Allows you to perform aggregations operations on a ClassroomClassification.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ClassroomClassificationAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends ClassroomClassificationAggregateArgs>(args: Prisma.Subset<T, ClassroomClassificationAggregateArgs>): Prisma.PrismaPromise<GetClassroomClassificationAggregateType<T>>;
    /**
     * Group by ClassroomClassification.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ClassroomClassificationGroupByArgs} args - Group by arguments.
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
    groupBy<T extends ClassroomClassificationGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: ClassroomClassificationGroupByArgs['orderBy'];
    } : {
        orderBy?: ClassroomClassificationGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, ClassroomClassificationGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetClassroomClassificationGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    /**
     * Fields of the ClassroomClassification model
     */
    readonly fields: ClassroomClassificationFieldRefs;
}
/**
 * The delegate class that acts as a "Promise-like" for ClassroomClassification.
 * Why is this prefixed with `Prisma__`?
 * Because we want to prevent naming conflicts as mentioned in
 * https://github.com/prisma/prisma-client-js/issues/707
 */
export interface Prisma__ClassroomClassificationClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
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
 * Fields of the ClassroomClassification model
 */
export interface ClassroomClassificationFieldRefs {
    readonly id: Prisma.FieldRef<"ClassroomClassification", 'String'>;
    readonly clinicId: Prisma.FieldRef<"ClassroomClassification", 'String'>;
    readonly name: Prisma.FieldRef<"ClassroomClassification", 'String'>;
    readonly createdAt: Prisma.FieldRef<"ClassroomClassification", 'DateTime'>;
}
/**
 * ClassroomClassification findUnique
 */
export type ClassroomClassificationFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ClassroomClassification
     */
    select?: Prisma.ClassroomClassificationSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the ClassroomClassification
     */
    omit?: Prisma.ClassroomClassificationOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.ClassroomClassificationInclude<ExtArgs> | null;
    /**
     * Filter, which ClassroomClassification to fetch.
     */
    where: Prisma.ClassroomClassificationWhereUniqueInput;
};
/**
 * ClassroomClassification findUniqueOrThrow
 */
export type ClassroomClassificationFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ClassroomClassification
     */
    select?: Prisma.ClassroomClassificationSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the ClassroomClassification
     */
    omit?: Prisma.ClassroomClassificationOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.ClassroomClassificationInclude<ExtArgs> | null;
    /**
     * Filter, which ClassroomClassification to fetch.
     */
    where: Prisma.ClassroomClassificationWhereUniqueInput;
};
/**
 * ClassroomClassification findFirst
 */
export type ClassroomClassificationFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ClassroomClassification
     */
    select?: Prisma.ClassroomClassificationSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the ClassroomClassification
     */
    omit?: Prisma.ClassroomClassificationOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.ClassroomClassificationInclude<ExtArgs> | null;
    /**
     * Filter, which ClassroomClassification to fetch.
     */
    where?: Prisma.ClassroomClassificationWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of ClassroomClassifications to fetch.
     */
    orderBy?: Prisma.ClassroomClassificationOrderByWithRelationInput | Prisma.ClassroomClassificationOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for ClassroomClassifications.
     */
    cursor?: Prisma.ClassroomClassificationWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` ClassroomClassifications from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` ClassroomClassifications.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of ClassroomClassifications.
     */
    distinct?: Prisma.ClassroomClassificationScalarFieldEnum | Prisma.ClassroomClassificationScalarFieldEnum[];
};
/**
 * ClassroomClassification findFirstOrThrow
 */
export type ClassroomClassificationFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ClassroomClassification
     */
    select?: Prisma.ClassroomClassificationSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the ClassroomClassification
     */
    omit?: Prisma.ClassroomClassificationOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.ClassroomClassificationInclude<ExtArgs> | null;
    /**
     * Filter, which ClassroomClassification to fetch.
     */
    where?: Prisma.ClassroomClassificationWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of ClassroomClassifications to fetch.
     */
    orderBy?: Prisma.ClassroomClassificationOrderByWithRelationInput | Prisma.ClassroomClassificationOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for ClassroomClassifications.
     */
    cursor?: Prisma.ClassroomClassificationWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` ClassroomClassifications from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` ClassroomClassifications.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of ClassroomClassifications.
     */
    distinct?: Prisma.ClassroomClassificationScalarFieldEnum | Prisma.ClassroomClassificationScalarFieldEnum[];
};
/**
 * ClassroomClassification findMany
 */
export type ClassroomClassificationFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ClassroomClassification
     */
    select?: Prisma.ClassroomClassificationSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the ClassroomClassification
     */
    omit?: Prisma.ClassroomClassificationOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.ClassroomClassificationInclude<ExtArgs> | null;
    /**
     * Filter, which ClassroomClassifications to fetch.
     */
    where?: Prisma.ClassroomClassificationWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of ClassroomClassifications to fetch.
     */
    orderBy?: Prisma.ClassroomClassificationOrderByWithRelationInput | Prisma.ClassroomClassificationOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing ClassroomClassifications.
     */
    cursor?: Prisma.ClassroomClassificationWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` ClassroomClassifications from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` ClassroomClassifications.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of ClassroomClassifications.
     */
    distinct?: Prisma.ClassroomClassificationScalarFieldEnum | Prisma.ClassroomClassificationScalarFieldEnum[];
};
/**
 * ClassroomClassification create
 */
export type ClassroomClassificationCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ClassroomClassification
     */
    select?: Prisma.ClassroomClassificationSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the ClassroomClassification
     */
    omit?: Prisma.ClassroomClassificationOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.ClassroomClassificationInclude<ExtArgs> | null;
    /**
     * The data needed to create a ClassroomClassification.
     */
    data: Prisma.XOR<Prisma.ClassroomClassificationCreateInput, Prisma.ClassroomClassificationUncheckedCreateInput>;
};
/**
 * ClassroomClassification createMany
 */
export type ClassroomClassificationCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * The data used to create many ClassroomClassifications.
     */
    data: Prisma.ClassroomClassificationCreateManyInput | Prisma.ClassroomClassificationCreateManyInput[];
    skipDuplicates?: boolean;
};
/**
 * ClassroomClassification createManyAndReturn
 */
export type ClassroomClassificationCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ClassroomClassification
     */
    select?: Prisma.ClassroomClassificationSelectCreateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the ClassroomClassification
     */
    omit?: Prisma.ClassroomClassificationOmit<ExtArgs> | null;
    /**
     * The data used to create many ClassroomClassifications.
     */
    data: Prisma.ClassroomClassificationCreateManyInput | Prisma.ClassroomClassificationCreateManyInput[];
    skipDuplicates?: boolean;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.ClassroomClassificationIncludeCreateManyAndReturn<ExtArgs> | null;
};
/**
 * ClassroomClassification update
 */
export type ClassroomClassificationUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ClassroomClassification
     */
    select?: Prisma.ClassroomClassificationSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the ClassroomClassification
     */
    omit?: Prisma.ClassroomClassificationOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.ClassroomClassificationInclude<ExtArgs> | null;
    /**
     * The data needed to update a ClassroomClassification.
     */
    data: Prisma.XOR<Prisma.ClassroomClassificationUpdateInput, Prisma.ClassroomClassificationUncheckedUpdateInput>;
    /**
     * Choose, which ClassroomClassification to update.
     */
    where: Prisma.ClassroomClassificationWhereUniqueInput;
};
/**
 * ClassroomClassification updateMany
 */
export type ClassroomClassificationUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * The data used to update ClassroomClassifications.
     */
    data: Prisma.XOR<Prisma.ClassroomClassificationUpdateManyMutationInput, Prisma.ClassroomClassificationUncheckedUpdateManyInput>;
    /**
     * Filter which ClassroomClassifications to update
     */
    where?: Prisma.ClassroomClassificationWhereInput;
    /**
     * Limit how many ClassroomClassifications to update.
     */
    limit?: number;
};
/**
 * ClassroomClassification updateManyAndReturn
 */
export type ClassroomClassificationUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ClassroomClassification
     */
    select?: Prisma.ClassroomClassificationSelectUpdateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the ClassroomClassification
     */
    omit?: Prisma.ClassroomClassificationOmit<ExtArgs> | null;
    /**
     * The data used to update ClassroomClassifications.
     */
    data: Prisma.XOR<Prisma.ClassroomClassificationUpdateManyMutationInput, Prisma.ClassroomClassificationUncheckedUpdateManyInput>;
    /**
     * Filter which ClassroomClassifications to update
     */
    where?: Prisma.ClassroomClassificationWhereInput;
    /**
     * Limit how many ClassroomClassifications to update.
     */
    limit?: number;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.ClassroomClassificationIncludeUpdateManyAndReturn<ExtArgs> | null;
};
/**
 * ClassroomClassification upsert
 */
export type ClassroomClassificationUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ClassroomClassification
     */
    select?: Prisma.ClassroomClassificationSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the ClassroomClassification
     */
    omit?: Prisma.ClassroomClassificationOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.ClassroomClassificationInclude<ExtArgs> | null;
    /**
     * The filter to search for the ClassroomClassification to update in case it exists.
     */
    where: Prisma.ClassroomClassificationWhereUniqueInput;
    /**
     * In case the ClassroomClassification found by the `where` argument doesn't exist, create a new ClassroomClassification with this data.
     */
    create: Prisma.XOR<Prisma.ClassroomClassificationCreateInput, Prisma.ClassroomClassificationUncheckedCreateInput>;
    /**
     * In case the ClassroomClassification was found with the provided `where` argument, update it with this data.
     */
    update: Prisma.XOR<Prisma.ClassroomClassificationUpdateInput, Prisma.ClassroomClassificationUncheckedUpdateInput>;
};
/**
 * ClassroomClassification delete
 */
export type ClassroomClassificationDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ClassroomClassification
     */
    select?: Prisma.ClassroomClassificationSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the ClassroomClassification
     */
    omit?: Prisma.ClassroomClassificationOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.ClassroomClassificationInclude<ExtArgs> | null;
    /**
     * Filter which ClassroomClassification to delete.
     */
    where: Prisma.ClassroomClassificationWhereUniqueInput;
};
/**
 * ClassroomClassification deleteMany
 */
export type ClassroomClassificationDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Filter which ClassroomClassifications to delete
     */
    where?: Prisma.ClassroomClassificationWhereInput;
    /**
     * Limit how many ClassroomClassifications to delete.
     */
    limit?: number;
};
/**
 * ClassroomClassification without action
 */
export type ClassroomClassificationDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ClassroomClassification
     */
    select?: Prisma.ClassroomClassificationSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the ClassroomClassification
     */
    omit?: Prisma.ClassroomClassificationOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.ClassroomClassificationInclude<ExtArgs> | null;
};
