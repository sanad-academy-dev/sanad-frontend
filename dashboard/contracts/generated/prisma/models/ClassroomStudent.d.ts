import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace";
/**
 * Model ClassroomStudent
 *
 */
export type ClassroomStudentModel = runtime.Types.Result.DefaultSelection<Prisma.$ClassroomStudentPayload>;
export type AggregateClassroomStudent = {
    _count: ClassroomStudentCountAggregateOutputType | null;
    _min: ClassroomStudentMinAggregateOutputType | null;
    _max: ClassroomStudentMaxAggregateOutputType | null;
};
export type ClassroomStudentMinAggregateOutputType = {
    id: string | null;
    classroomId: string | null;
    patientId: string | null;
    enrolledAt: Date | null;
};
export type ClassroomStudentMaxAggregateOutputType = {
    id: string | null;
    classroomId: string | null;
    patientId: string | null;
    enrolledAt: Date | null;
};
export type ClassroomStudentCountAggregateOutputType = {
    id: number;
    classroomId: number;
    patientId: number;
    enrolledAt: number;
    _all: number;
};
export type ClassroomStudentMinAggregateInputType = {
    id?: true;
    classroomId?: true;
    patientId?: true;
    enrolledAt?: true;
};
export type ClassroomStudentMaxAggregateInputType = {
    id?: true;
    classroomId?: true;
    patientId?: true;
    enrolledAt?: true;
};
export type ClassroomStudentCountAggregateInputType = {
    id?: true;
    classroomId?: true;
    patientId?: true;
    enrolledAt?: true;
    _all?: true;
};
export type ClassroomStudentAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Filter which ClassroomStudent to aggregate.
     */
    where?: Prisma.ClassroomStudentWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of ClassroomStudents to fetch.
     */
    orderBy?: Prisma.ClassroomStudentOrderByWithRelationInput | Prisma.ClassroomStudentOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     */
    cursor?: Prisma.ClassroomStudentWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` ClassroomStudents from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` ClassroomStudents.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned ClassroomStudents
    **/
    _count?: true | ClassroomStudentCountAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
    **/
    _min?: ClassroomStudentMinAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
    **/
    _max?: ClassroomStudentMaxAggregateInputType;
};
export type GetClassroomStudentAggregateType<T extends ClassroomStudentAggregateArgs> = {
    [P in keyof T & keyof AggregateClassroomStudent]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateClassroomStudent[P]> : Prisma.GetScalarType<T[P], AggregateClassroomStudent[P]>;
};
export type ClassroomStudentGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ClassroomStudentWhereInput;
    orderBy?: Prisma.ClassroomStudentOrderByWithAggregationInput | Prisma.ClassroomStudentOrderByWithAggregationInput[];
    by: Prisma.ClassroomStudentScalarFieldEnum[] | Prisma.ClassroomStudentScalarFieldEnum;
    having?: Prisma.ClassroomStudentScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: ClassroomStudentCountAggregateInputType | true;
    _min?: ClassroomStudentMinAggregateInputType;
    _max?: ClassroomStudentMaxAggregateInputType;
};
export type ClassroomStudentGroupByOutputType = {
    id: string;
    classroomId: string;
    patientId: string;
    enrolledAt: Date;
    _count: ClassroomStudentCountAggregateOutputType | null;
    _min: ClassroomStudentMinAggregateOutputType | null;
    _max: ClassroomStudentMaxAggregateOutputType | null;
};
export type GetClassroomStudentGroupByPayload<T extends ClassroomStudentGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<ClassroomStudentGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof ClassroomStudentGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], ClassroomStudentGroupByOutputType[P]> : Prisma.GetScalarType<T[P], ClassroomStudentGroupByOutputType[P]>;
}>>;
export type ClassroomStudentWhereInput = {
    AND?: Prisma.ClassroomStudentWhereInput | Prisma.ClassroomStudentWhereInput[];
    OR?: Prisma.ClassroomStudentWhereInput[];
    NOT?: Prisma.ClassroomStudentWhereInput | Prisma.ClassroomStudentWhereInput[];
    id?: Prisma.StringFilter<"ClassroomStudent"> | string;
    classroomId?: Prisma.StringFilter<"ClassroomStudent"> | string;
    patientId?: Prisma.StringFilter<"ClassroomStudent"> | string;
    enrolledAt?: Prisma.DateTimeFilter<"ClassroomStudent"> | Date | string;
    classroom?: Prisma.XOR<Prisma.ClassroomScalarRelationFilter, Prisma.ClassroomWhereInput>;
    patient?: Prisma.XOR<Prisma.PatientScalarRelationFilter, Prisma.PatientWhereInput>;
};
export type ClassroomStudentOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    classroomId?: Prisma.SortOrder;
    patientId?: Prisma.SortOrder;
    enrolledAt?: Prisma.SortOrder;
    classroom?: Prisma.ClassroomOrderByWithRelationInput;
    patient?: Prisma.PatientOrderByWithRelationInput;
};
export type ClassroomStudentWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    classroomId_patientId?: Prisma.ClassroomStudentClassroomIdPatientIdCompoundUniqueInput;
    AND?: Prisma.ClassroomStudentWhereInput | Prisma.ClassroomStudentWhereInput[];
    OR?: Prisma.ClassroomStudentWhereInput[];
    NOT?: Prisma.ClassroomStudentWhereInput | Prisma.ClassroomStudentWhereInput[];
    classroomId?: Prisma.StringFilter<"ClassroomStudent"> | string;
    patientId?: Prisma.StringFilter<"ClassroomStudent"> | string;
    enrolledAt?: Prisma.DateTimeFilter<"ClassroomStudent"> | Date | string;
    classroom?: Prisma.XOR<Prisma.ClassroomScalarRelationFilter, Prisma.ClassroomWhereInput>;
    patient?: Prisma.XOR<Prisma.PatientScalarRelationFilter, Prisma.PatientWhereInput>;
}, "id" | "classroomId_patientId">;
export type ClassroomStudentOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    classroomId?: Prisma.SortOrder;
    patientId?: Prisma.SortOrder;
    enrolledAt?: Prisma.SortOrder;
    _count?: Prisma.ClassroomStudentCountOrderByAggregateInput;
    _max?: Prisma.ClassroomStudentMaxOrderByAggregateInput;
    _min?: Prisma.ClassroomStudentMinOrderByAggregateInput;
};
export type ClassroomStudentScalarWhereWithAggregatesInput = {
    AND?: Prisma.ClassroomStudentScalarWhereWithAggregatesInput | Prisma.ClassroomStudentScalarWhereWithAggregatesInput[];
    OR?: Prisma.ClassroomStudentScalarWhereWithAggregatesInput[];
    NOT?: Prisma.ClassroomStudentScalarWhereWithAggregatesInput | Prisma.ClassroomStudentScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"ClassroomStudent"> | string;
    classroomId?: Prisma.StringWithAggregatesFilter<"ClassroomStudent"> | string;
    patientId?: Prisma.StringWithAggregatesFilter<"ClassroomStudent"> | string;
    enrolledAt?: Prisma.DateTimeWithAggregatesFilter<"ClassroomStudent"> | Date | string;
};
export type ClassroomStudentCreateInput = {
    id: string;
    enrolledAt?: Date | string;
    classroom: Prisma.ClassroomCreateNestedOneWithoutStudentsInput;
    patient: Prisma.PatientCreateNestedOneWithoutClassroomAssignmentsInput;
};
export type ClassroomStudentUncheckedCreateInput = {
    id: string;
    classroomId: string;
    patientId: string;
    enrolledAt?: Date | string;
};
export type ClassroomStudentUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    enrolledAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    classroom?: Prisma.ClassroomUpdateOneRequiredWithoutStudentsNestedInput;
    patient?: Prisma.PatientUpdateOneRequiredWithoutClassroomAssignmentsNestedInput;
};
export type ClassroomStudentUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    classroomId?: Prisma.StringFieldUpdateOperationsInput | string;
    patientId?: Prisma.StringFieldUpdateOperationsInput | string;
    enrolledAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ClassroomStudentCreateManyInput = {
    id: string;
    classroomId: string;
    patientId: string;
    enrolledAt?: Date | string;
};
export type ClassroomStudentUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    enrolledAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ClassroomStudentUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    classroomId?: Prisma.StringFieldUpdateOperationsInput | string;
    patientId?: Prisma.StringFieldUpdateOperationsInput | string;
    enrolledAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ClassroomStudentListRelationFilter = {
    every?: Prisma.ClassroomStudentWhereInput;
    some?: Prisma.ClassroomStudentWhereInput;
    none?: Prisma.ClassroomStudentWhereInput;
};
export type ClassroomStudentOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type ClassroomStudentClassroomIdPatientIdCompoundUniqueInput = {
    classroomId: string;
    patientId: string;
};
export type ClassroomStudentCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    classroomId?: Prisma.SortOrder;
    patientId?: Prisma.SortOrder;
    enrolledAt?: Prisma.SortOrder;
};
export type ClassroomStudentMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    classroomId?: Prisma.SortOrder;
    patientId?: Prisma.SortOrder;
    enrolledAt?: Prisma.SortOrder;
};
export type ClassroomStudentMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    classroomId?: Prisma.SortOrder;
    patientId?: Prisma.SortOrder;
    enrolledAt?: Prisma.SortOrder;
};
export type ClassroomStudentCreateNestedManyWithoutPatientInput = {
    create?: Prisma.XOR<Prisma.ClassroomStudentCreateWithoutPatientInput, Prisma.ClassroomStudentUncheckedCreateWithoutPatientInput> | Prisma.ClassroomStudentCreateWithoutPatientInput[] | Prisma.ClassroomStudentUncheckedCreateWithoutPatientInput[];
    connectOrCreate?: Prisma.ClassroomStudentCreateOrConnectWithoutPatientInput | Prisma.ClassroomStudentCreateOrConnectWithoutPatientInput[];
    createMany?: Prisma.ClassroomStudentCreateManyPatientInputEnvelope;
    connect?: Prisma.ClassroomStudentWhereUniqueInput | Prisma.ClassroomStudentWhereUniqueInput[];
};
export type ClassroomStudentUncheckedCreateNestedManyWithoutPatientInput = {
    create?: Prisma.XOR<Prisma.ClassroomStudentCreateWithoutPatientInput, Prisma.ClassroomStudentUncheckedCreateWithoutPatientInput> | Prisma.ClassroomStudentCreateWithoutPatientInput[] | Prisma.ClassroomStudentUncheckedCreateWithoutPatientInput[];
    connectOrCreate?: Prisma.ClassroomStudentCreateOrConnectWithoutPatientInput | Prisma.ClassroomStudentCreateOrConnectWithoutPatientInput[];
    createMany?: Prisma.ClassroomStudentCreateManyPatientInputEnvelope;
    connect?: Prisma.ClassroomStudentWhereUniqueInput | Prisma.ClassroomStudentWhereUniqueInput[];
};
export type ClassroomStudentUpdateManyWithoutPatientNestedInput = {
    create?: Prisma.XOR<Prisma.ClassroomStudentCreateWithoutPatientInput, Prisma.ClassroomStudentUncheckedCreateWithoutPatientInput> | Prisma.ClassroomStudentCreateWithoutPatientInput[] | Prisma.ClassroomStudentUncheckedCreateWithoutPatientInput[];
    connectOrCreate?: Prisma.ClassroomStudentCreateOrConnectWithoutPatientInput | Prisma.ClassroomStudentCreateOrConnectWithoutPatientInput[];
    upsert?: Prisma.ClassroomStudentUpsertWithWhereUniqueWithoutPatientInput | Prisma.ClassroomStudentUpsertWithWhereUniqueWithoutPatientInput[];
    createMany?: Prisma.ClassroomStudentCreateManyPatientInputEnvelope;
    set?: Prisma.ClassroomStudentWhereUniqueInput | Prisma.ClassroomStudentWhereUniqueInput[];
    disconnect?: Prisma.ClassroomStudentWhereUniqueInput | Prisma.ClassroomStudentWhereUniqueInput[];
    delete?: Prisma.ClassroomStudentWhereUniqueInput | Prisma.ClassroomStudentWhereUniqueInput[];
    connect?: Prisma.ClassroomStudentWhereUniqueInput | Prisma.ClassroomStudentWhereUniqueInput[];
    update?: Prisma.ClassroomStudentUpdateWithWhereUniqueWithoutPatientInput | Prisma.ClassroomStudentUpdateWithWhereUniqueWithoutPatientInput[];
    updateMany?: Prisma.ClassroomStudentUpdateManyWithWhereWithoutPatientInput | Prisma.ClassroomStudentUpdateManyWithWhereWithoutPatientInput[];
    deleteMany?: Prisma.ClassroomStudentScalarWhereInput | Prisma.ClassroomStudentScalarWhereInput[];
};
export type ClassroomStudentUncheckedUpdateManyWithoutPatientNestedInput = {
    create?: Prisma.XOR<Prisma.ClassroomStudentCreateWithoutPatientInput, Prisma.ClassroomStudentUncheckedCreateWithoutPatientInput> | Prisma.ClassroomStudentCreateWithoutPatientInput[] | Prisma.ClassroomStudentUncheckedCreateWithoutPatientInput[];
    connectOrCreate?: Prisma.ClassroomStudentCreateOrConnectWithoutPatientInput | Prisma.ClassroomStudentCreateOrConnectWithoutPatientInput[];
    upsert?: Prisma.ClassroomStudentUpsertWithWhereUniqueWithoutPatientInput | Prisma.ClassroomStudentUpsertWithWhereUniqueWithoutPatientInput[];
    createMany?: Prisma.ClassroomStudentCreateManyPatientInputEnvelope;
    set?: Prisma.ClassroomStudentWhereUniqueInput | Prisma.ClassroomStudentWhereUniqueInput[];
    disconnect?: Prisma.ClassroomStudentWhereUniqueInput | Prisma.ClassroomStudentWhereUniqueInput[];
    delete?: Prisma.ClassroomStudentWhereUniqueInput | Prisma.ClassroomStudentWhereUniqueInput[];
    connect?: Prisma.ClassroomStudentWhereUniqueInput | Prisma.ClassroomStudentWhereUniqueInput[];
    update?: Prisma.ClassroomStudentUpdateWithWhereUniqueWithoutPatientInput | Prisma.ClassroomStudentUpdateWithWhereUniqueWithoutPatientInput[];
    updateMany?: Prisma.ClassroomStudentUpdateManyWithWhereWithoutPatientInput | Prisma.ClassroomStudentUpdateManyWithWhereWithoutPatientInput[];
    deleteMany?: Prisma.ClassroomStudentScalarWhereInput | Prisma.ClassroomStudentScalarWhereInput[];
};
export type ClassroomStudentCreateNestedManyWithoutClassroomInput = {
    create?: Prisma.XOR<Prisma.ClassroomStudentCreateWithoutClassroomInput, Prisma.ClassroomStudentUncheckedCreateWithoutClassroomInput> | Prisma.ClassroomStudentCreateWithoutClassroomInput[] | Prisma.ClassroomStudentUncheckedCreateWithoutClassroomInput[];
    connectOrCreate?: Prisma.ClassroomStudentCreateOrConnectWithoutClassroomInput | Prisma.ClassroomStudentCreateOrConnectWithoutClassroomInput[];
    createMany?: Prisma.ClassroomStudentCreateManyClassroomInputEnvelope;
    connect?: Prisma.ClassroomStudentWhereUniqueInput | Prisma.ClassroomStudentWhereUniqueInput[];
};
export type ClassroomStudentUncheckedCreateNestedManyWithoutClassroomInput = {
    create?: Prisma.XOR<Prisma.ClassroomStudentCreateWithoutClassroomInput, Prisma.ClassroomStudentUncheckedCreateWithoutClassroomInput> | Prisma.ClassroomStudentCreateWithoutClassroomInput[] | Prisma.ClassroomStudentUncheckedCreateWithoutClassroomInput[];
    connectOrCreate?: Prisma.ClassroomStudentCreateOrConnectWithoutClassroomInput | Prisma.ClassroomStudentCreateOrConnectWithoutClassroomInput[];
    createMany?: Prisma.ClassroomStudentCreateManyClassroomInputEnvelope;
    connect?: Prisma.ClassroomStudentWhereUniqueInput | Prisma.ClassroomStudentWhereUniqueInput[];
};
export type ClassroomStudentUpdateManyWithoutClassroomNestedInput = {
    create?: Prisma.XOR<Prisma.ClassroomStudentCreateWithoutClassroomInput, Prisma.ClassroomStudentUncheckedCreateWithoutClassroomInput> | Prisma.ClassroomStudentCreateWithoutClassroomInput[] | Prisma.ClassroomStudentUncheckedCreateWithoutClassroomInput[];
    connectOrCreate?: Prisma.ClassroomStudentCreateOrConnectWithoutClassroomInput | Prisma.ClassroomStudentCreateOrConnectWithoutClassroomInput[];
    upsert?: Prisma.ClassroomStudentUpsertWithWhereUniqueWithoutClassroomInput | Prisma.ClassroomStudentUpsertWithWhereUniqueWithoutClassroomInput[];
    createMany?: Prisma.ClassroomStudentCreateManyClassroomInputEnvelope;
    set?: Prisma.ClassroomStudentWhereUniqueInput | Prisma.ClassroomStudentWhereUniqueInput[];
    disconnect?: Prisma.ClassroomStudentWhereUniqueInput | Prisma.ClassroomStudentWhereUniqueInput[];
    delete?: Prisma.ClassroomStudentWhereUniqueInput | Prisma.ClassroomStudentWhereUniqueInput[];
    connect?: Prisma.ClassroomStudentWhereUniqueInput | Prisma.ClassroomStudentWhereUniqueInput[];
    update?: Prisma.ClassroomStudentUpdateWithWhereUniqueWithoutClassroomInput | Prisma.ClassroomStudentUpdateWithWhereUniqueWithoutClassroomInput[];
    updateMany?: Prisma.ClassroomStudentUpdateManyWithWhereWithoutClassroomInput | Prisma.ClassroomStudentUpdateManyWithWhereWithoutClassroomInput[];
    deleteMany?: Prisma.ClassroomStudentScalarWhereInput | Prisma.ClassroomStudentScalarWhereInput[];
};
export type ClassroomStudentUncheckedUpdateManyWithoutClassroomNestedInput = {
    create?: Prisma.XOR<Prisma.ClassroomStudentCreateWithoutClassroomInput, Prisma.ClassroomStudentUncheckedCreateWithoutClassroomInput> | Prisma.ClassroomStudentCreateWithoutClassroomInput[] | Prisma.ClassroomStudentUncheckedCreateWithoutClassroomInput[];
    connectOrCreate?: Prisma.ClassroomStudentCreateOrConnectWithoutClassroomInput | Prisma.ClassroomStudentCreateOrConnectWithoutClassroomInput[];
    upsert?: Prisma.ClassroomStudentUpsertWithWhereUniqueWithoutClassroomInput | Prisma.ClassroomStudentUpsertWithWhereUniqueWithoutClassroomInput[];
    createMany?: Prisma.ClassroomStudentCreateManyClassroomInputEnvelope;
    set?: Prisma.ClassroomStudentWhereUniqueInput | Prisma.ClassroomStudentWhereUniqueInput[];
    disconnect?: Prisma.ClassroomStudentWhereUniqueInput | Prisma.ClassroomStudentWhereUniqueInput[];
    delete?: Prisma.ClassroomStudentWhereUniqueInput | Prisma.ClassroomStudentWhereUniqueInput[];
    connect?: Prisma.ClassroomStudentWhereUniqueInput | Prisma.ClassroomStudentWhereUniqueInput[];
    update?: Prisma.ClassroomStudentUpdateWithWhereUniqueWithoutClassroomInput | Prisma.ClassroomStudentUpdateWithWhereUniqueWithoutClassroomInput[];
    updateMany?: Prisma.ClassroomStudentUpdateManyWithWhereWithoutClassroomInput | Prisma.ClassroomStudentUpdateManyWithWhereWithoutClassroomInput[];
    deleteMany?: Prisma.ClassroomStudentScalarWhereInput | Prisma.ClassroomStudentScalarWhereInput[];
};
export type ClassroomStudentCreateWithoutPatientInput = {
    id: string;
    enrolledAt?: Date | string;
    classroom: Prisma.ClassroomCreateNestedOneWithoutStudentsInput;
};
export type ClassroomStudentUncheckedCreateWithoutPatientInput = {
    id: string;
    classroomId: string;
    enrolledAt?: Date | string;
};
export type ClassroomStudentCreateOrConnectWithoutPatientInput = {
    where: Prisma.ClassroomStudentWhereUniqueInput;
    create: Prisma.XOR<Prisma.ClassroomStudentCreateWithoutPatientInput, Prisma.ClassroomStudentUncheckedCreateWithoutPatientInput>;
};
export type ClassroomStudentCreateManyPatientInputEnvelope = {
    data: Prisma.ClassroomStudentCreateManyPatientInput | Prisma.ClassroomStudentCreateManyPatientInput[];
    skipDuplicates?: boolean;
};
export type ClassroomStudentUpsertWithWhereUniqueWithoutPatientInput = {
    where: Prisma.ClassroomStudentWhereUniqueInput;
    update: Prisma.XOR<Prisma.ClassroomStudentUpdateWithoutPatientInput, Prisma.ClassroomStudentUncheckedUpdateWithoutPatientInput>;
    create: Prisma.XOR<Prisma.ClassroomStudentCreateWithoutPatientInput, Prisma.ClassroomStudentUncheckedCreateWithoutPatientInput>;
};
export type ClassroomStudentUpdateWithWhereUniqueWithoutPatientInput = {
    where: Prisma.ClassroomStudentWhereUniqueInput;
    data: Prisma.XOR<Prisma.ClassroomStudentUpdateWithoutPatientInput, Prisma.ClassroomStudentUncheckedUpdateWithoutPatientInput>;
};
export type ClassroomStudentUpdateManyWithWhereWithoutPatientInput = {
    where: Prisma.ClassroomStudentScalarWhereInput;
    data: Prisma.XOR<Prisma.ClassroomStudentUpdateManyMutationInput, Prisma.ClassroomStudentUncheckedUpdateManyWithoutPatientInput>;
};
export type ClassroomStudentScalarWhereInput = {
    AND?: Prisma.ClassroomStudentScalarWhereInput | Prisma.ClassroomStudentScalarWhereInput[];
    OR?: Prisma.ClassroomStudentScalarWhereInput[];
    NOT?: Prisma.ClassroomStudentScalarWhereInput | Prisma.ClassroomStudentScalarWhereInput[];
    id?: Prisma.StringFilter<"ClassroomStudent"> | string;
    classroomId?: Prisma.StringFilter<"ClassroomStudent"> | string;
    patientId?: Prisma.StringFilter<"ClassroomStudent"> | string;
    enrolledAt?: Prisma.DateTimeFilter<"ClassroomStudent"> | Date | string;
};
export type ClassroomStudentCreateWithoutClassroomInput = {
    id: string;
    enrolledAt?: Date | string;
    patient: Prisma.PatientCreateNestedOneWithoutClassroomAssignmentsInput;
};
export type ClassroomStudentUncheckedCreateWithoutClassroomInput = {
    id: string;
    patientId: string;
    enrolledAt?: Date | string;
};
export type ClassroomStudentCreateOrConnectWithoutClassroomInput = {
    where: Prisma.ClassroomStudentWhereUniqueInput;
    create: Prisma.XOR<Prisma.ClassroomStudentCreateWithoutClassroomInput, Prisma.ClassroomStudentUncheckedCreateWithoutClassroomInput>;
};
export type ClassroomStudentCreateManyClassroomInputEnvelope = {
    data: Prisma.ClassroomStudentCreateManyClassroomInput | Prisma.ClassroomStudentCreateManyClassroomInput[];
    skipDuplicates?: boolean;
};
export type ClassroomStudentUpsertWithWhereUniqueWithoutClassroomInput = {
    where: Prisma.ClassroomStudentWhereUniqueInput;
    update: Prisma.XOR<Prisma.ClassroomStudentUpdateWithoutClassroomInput, Prisma.ClassroomStudentUncheckedUpdateWithoutClassroomInput>;
    create: Prisma.XOR<Prisma.ClassroomStudentCreateWithoutClassroomInput, Prisma.ClassroomStudentUncheckedCreateWithoutClassroomInput>;
};
export type ClassroomStudentUpdateWithWhereUniqueWithoutClassroomInput = {
    where: Prisma.ClassroomStudentWhereUniqueInput;
    data: Prisma.XOR<Prisma.ClassroomStudentUpdateWithoutClassroomInput, Prisma.ClassroomStudentUncheckedUpdateWithoutClassroomInput>;
};
export type ClassroomStudentUpdateManyWithWhereWithoutClassroomInput = {
    where: Prisma.ClassroomStudentScalarWhereInput;
    data: Prisma.XOR<Prisma.ClassroomStudentUpdateManyMutationInput, Prisma.ClassroomStudentUncheckedUpdateManyWithoutClassroomInput>;
};
export type ClassroomStudentCreateManyPatientInput = {
    id: string;
    classroomId: string;
    enrolledAt?: Date | string;
};
export type ClassroomStudentUpdateWithoutPatientInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    enrolledAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    classroom?: Prisma.ClassroomUpdateOneRequiredWithoutStudentsNestedInput;
};
export type ClassroomStudentUncheckedUpdateWithoutPatientInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    classroomId?: Prisma.StringFieldUpdateOperationsInput | string;
    enrolledAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ClassroomStudentUncheckedUpdateManyWithoutPatientInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    classroomId?: Prisma.StringFieldUpdateOperationsInput | string;
    enrolledAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ClassroomStudentCreateManyClassroomInput = {
    id: string;
    patientId: string;
    enrolledAt?: Date | string;
};
export type ClassroomStudentUpdateWithoutClassroomInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    enrolledAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    patient?: Prisma.PatientUpdateOneRequiredWithoutClassroomAssignmentsNestedInput;
};
export type ClassroomStudentUncheckedUpdateWithoutClassroomInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    patientId?: Prisma.StringFieldUpdateOperationsInput | string;
    enrolledAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ClassroomStudentUncheckedUpdateManyWithoutClassroomInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    patientId?: Prisma.StringFieldUpdateOperationsInput | string;
    enrolledAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ClassroomStudentSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    classroomId?: boolean;
    patientId?: boolean;
    enrolledAt?: boolean;
    classroom?: boolean | Prisma.ClassroomDefaultArgs<ExtArgs>;
    patient?: boolean | Prisma.PatientDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["classroomStudent"]>;
export type ClassroomStudentSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    classroomId?: boolean;
    patientId?: boolean;
    enrolledAt?: boolean;
    classroom?: boolean | Prisma.ClassroomDefaultArgs<ExtArgs>;
    patient?: boolean | Prisma.PatientDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["classroomStudent"]>;
export type ClassroomStudentSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    classroomId?: boolean;
    patientId?: boolean;
    enrolledAt?: boolean;
    classroom?: boolean | Prisma.ClassroomDefaultArgs<ExtArgs>;
    patient?: boolean | Prisma.PatientDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["classroomStudent"]>;
export type ClassroomStudentSelectScalar = {
    id?: boolean;
    classroomId?: boolean;
    patientId?: boolean;
    enrolledAt?: boolean;
};
export type ClassroomStudentOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "classroomId" | "patientId" | "enrolledAt", ExtArgs["result"]["classroomStudent"]>;
export type ClassroomStudentInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    classroom?: boolean | Prisma.ClassroomDefaultArgs<ExtArgs>;
    patient?: boolean | Prisma.PatientDefaultArgs<ExtArgs>;
};
export type ClassroomStudentIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    classroom?: boolean | Prisma.ClassroomDefaultArgs<ExtArgs>;
    patient?: boolean | Prisma.PatientDefaultArgs<ExtArgs>;
};
export type ClassroomStudentIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    classroom?: boolean | Prisma.ClassroomDefaultArgs<ExtArgs>;
    patient?: boolean | Prisma.PatientDefaultArgs<ExtArgs>;
};
export type $ClassroomStudentPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "ClassroomStudent";
    objects: {
        classroom: Prisma.$ClassroomPayload<ExtArgs>;
        patient: Prisma.$PatientPayload<ExtArgs>;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        classroomId: string;
        patientId: string;
        enrolledAt: Date;
    }, ExtArgs["result"]["classroomStudent"]>;
    composites: {};
};
export type ClassroomStudentGetPayload<S extends boolean | null | undefined | ClassroomStudentDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$ClassroomStudentPayload, S>;
export type ClassroomStudentCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<ClassroomStudentFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: ClassroomStudentCountAggregateInputType | true;
};
export interface ClassroomStudentDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['ClassroomStudent'];
        meta: {
            name: 'ClassroomStudent';
        };
    };
    /**
     * Find zero or one ClassroomStudent that matches the filter.
     * @param {ClassroomStudentFindUniqueArgs} args - Arguments to find a ClassroomStudent
     * @example
     * // Get one ClassroomStudent
     * const classroomStudent = await prisma.classroomStudent.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ClassroomStudentFindUniqueArgs>(args: Prisma.SelectSubset<T, ClassroomStudentFindUniqueArgs<ExtArgs>>): Prisma.Prisma__ClassroomStudentClient<runtime.Types.Result.GetResult<Prisma.$ClassroomStudentPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    /**
     * Find one ClassroomStudent that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ClassroomStudentFindUniqueOrThrowArgs} args - Arguments to find a ClassroomStudent
     * @example
     * // Get one ClassroomStudent
     * const classroomStudent = await prisma.classroomStudent.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ClassroomStudentFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, ClassroomStudentFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__ClassroomStudentClient<runtime.Types.Result.GetResult<Prisma.$ClassroomStudentPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Find the first ClassroomStudent that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ClassroomStudentFindFirstArgs} args - Arguments to find a ClassroomStudent
     * @example
     * // Get one ClassroomStudent
     * const classroomStudent = await prisma.classroomStudent.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ClassroomStudentFindFirstArgs>(args?: Prisma.SelectSubset<T, ClassroomStudentFindFirstArgs<ExtArgs>>): Prisma.Prisma__ClassroomStudentClient<runtime.Types.Result.GetResult<Prisma.$ClassroomStudentPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    /**
     * Find the first ClassroomStudent that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ClassroomStudentFindFirstOrThrowArgs} args - Arguments to find a ClassroomStudent
     * @example
     * // Get one ClassroomStudent
     * const classroomStudent = await prisma.classroomStudent.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ClassroomStudentFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, ClassroomStudentFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__ClassroomStudentClient<runtime.Types.Result.GetResult<Prisma.$ClassroomStudentPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Find zero or more ClassroomStudents that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ClassroomStudentFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ClassroomStudents
     * const classroomStudents = await prisma.classroomStudent.findMany()
     *
     * // Get first 10 ClassroomStudents
     * const classroomStudents = await prisma.classroomStudent.findMany({ take: 10 })
     *
     * // Only select the `id`
     * const classroomStudentWithIdOnly = await prisma.classroomStudent.findMany({ select: { id: true } })
     *
     */
    findMany<T extends ClassroomStudentFindManyArgs>(args?: Prisma.SelectSubset<T, ClassroomStudentFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ClassroomStudentPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    /**
     * Create a ClassroomStudent.
     * @param {ClassroomStudentCreateArgs} args - Arguments to create a ClassroomStudent.
     * @example
     * // Create one ClassroomStudent
     * const ClassroomStudent = await prisma.classroomStudent.create({
     *   data: {
     *     // ... data to create a ClassroomStudent
     *   }
     * })
     *
     */
    create<T extends ClassroomStudentCreateArgs>(args: Prisma.SelectSubset<T, ClassroomStudentCreateArgs<ExtArgs>>): Prisma.Prisma__ClassroomStudentClient<runtime.Types.Result.GetResult<Prisma.$ClassroomStudentPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Create many ClassroomStudents.
     * @param {ClassroomStudentCreateManyArgs} args - Arguments to create many ClassroomStudents.
     * @example
     * // Create many ClassroomStudents
     * const classroomStudent = await prisma.classroomStudent.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     */
    createMany<T extends ClassroomStudentCreateManyArgs>(args?: Prisma.SelectSubset<T, ClassroomStudentCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Create many ClassroomStudents and returns the data saved in the database.
     * @param {ClassroomStudentCreateManyAndReturnArgs} args - Arguments to create many ClassroomStudents.
     * @example
     * // Create many ClassroomStudents
     * const classroomStudent = await prisma.classroomStudent.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Create many ClassroomStudents and only return the `id`
     * const classroomStudentWithIdOnly = await prisma.classroomStudent.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    createManyAndReturn<T extends ClassroomStudentCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, ClassroomStudentCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ClassroomStudentPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    /**
     * Delete a ClassroomStudent.
     * @param {ClassroomStudentDeleteArgs} args - Arguments to delete one ClassroomStudent.
     * @example
     * // Delete one ClassroomStudent
     * const ClassroomStudent = await prisma.classroomStudent.delete({
     *   where: {
     *     // ... filter to delete one ClassroomStudent
     *   }
     * })
     *
     */
    delete<T extends ClassroomStudentDeleteArgs>(args: Prisma.SelectSubset<T, ClassroomStudentDeleteArgs<ExtArgs>>): Prisma.Prisma__ClassroomStudentClient<runtime.Types.Result.GetResult<Prisma.$ClassroomStudentPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Update one ClassroomStudent.
     * @param {ClassroomStudentUpdateArgs} args - Arguments to update one ClassroomStudent.
     * @example
     * // Update one ClassroomStudent
     * const classroomStudent = await prisma.classroomStudent.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    update<T extends ClassroomStudentUpdateArgs>(args: Prisma.SelectSubset<T, ClassroomStudentUpdateArgs<ExtArgs>>): Prisma.Prisma__ClassroomStudentClient<runtime.Types.Result.GetResult<Prisma.$ClassroomStudentPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Delete zero or more ClassroomStudents.
     * @param {ClassroomStudentDeleteManyArgs} args - Arguments to filter ClassroomStudents to delete.
     * @example
     * // Delete a few ClassroomStudents
     * const { count } = await prisma.classroomStudent.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     */
    deleteMany<T extends ClassroomStudentDeleteManyArgs>(args?: Prisma.SelectSubset<T, ClassroomStudentDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Update zero or more ClassroomStudents.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ClassroomStudentUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ClassroomStudents
     * const classroomStudent = await prisma.classroomStudent.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    updateMany<T extends ClassroomStudentUpdateManyArgs>(args: Prisma.SelectSubset<T, ClassroomStudentUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Update zero or more ClassroomStudents and returns the data updated in the database.
     * @param {ClassroomStudentUpdateManyAndReturnArgs} args - Arguments to update many ClassroomStudents.
     * @example
     * // Update many ClassroomStudents
     * const classroomStudent = await prisma.classroomStudent.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Update zero or more ClassroomStudents and only return the `id`
     * const classroomStudentWithIdOnly = await prisma.classroomStudent.updateManyAndReturn({
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
    updateManyAndReturn<T extends ClassroomStudentUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, ClassroomStudentUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ClassroomStudentPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    /**
     * Create or update one ClassroomStudent.
     * @param {ClassroomStudentUpsertArgs} args - Arguments to update or create a ClassroomStudent.
     * @example
     * // Update or create a ClassroomStudent
     * const classroomStudent = await prisma.classroomStudent.upsert({
     *   create: {
     *     // ... data to create a ClassroomStudent
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ClassroomStudent we want to update
     *   }
     * })
     */
    upsert<T extends ClassroomStudentUpsertArgs>(args: Prisma.SelectSubset<T, ClassroomStudentUpsertArgs<ExtArgs>>): Prisma.Prisma__ClassroomStudentClient<runtime.Types.Result.GetResult<Prisma.$ClassroomStudentPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Count the number of ClassroomStudents.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ClassroomStudentCountArgs} args - Arguments to filter ClassroomStudents to count.
     * @example
     * // Count the number of ClassroomStudents
     * const count = await prisma.classroomStudent.count({
     *   where: {
     *     // ... the filter for the ClassroomStudents we want to count
     *   }
     * })
    **/
    count<T extends ClassroomStudentCountArgs>(args?: Prisma.Subset<T, ClassroomStudentCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], ClassroomStudentCountAggregateOutputType> : number>;
    /**
     * Allows you to perform aggregations operations on a ClassroomStudent.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ClassroomStudentAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends ClassroomStudentAggregateArgs>(args: Prisma.Subset<T, ClassroomStudentAggregateArgs>): Prisma.PrismaPromise<GetClassroomStudentAggregateType<T>>;
    /**
     * Group by ClassroomStudent.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ClassroomStudentGroupByArgs} args - Group by arguments.
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
    groupBy<T extends ClassroomStudentGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: ClassroomStudentGroupByArgs['orderBy'];
    } : {
        orderBy?: ClassroomStudentGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, ClassroomStudentGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetClassroomStudentGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    /**
     * Fields of the ClassroomStudent model
     */
    readonly fields: ClassroomStudentFieldRefs;
}
/**
 * The delegate class that acts as a "Promise-like" for ClassroomStudent.
 * Why is this prefixed with `Prisma__`?
 * Because we want to prevent naming conflicts as mentioned in
 * https://github.com/prisma/prisma-client-js/issues/707
 */
export interface Prisma__ClassroomStudentClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    classroom<T extends Prisma.ClassroomDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.ClassroomDefaultArgs<ExtArgs>>): Prisma.Prisma__ClassroomClient<runtime.Types.Result.GetResult<Prisma.$ClassroomPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    patient<T extends Prisma.PatientDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.PatientDefaultArgs<ExtArgs>>): Prisma.Prisma__PatientClient<runtime.Types.Result.GetResult<Prisma.$PatientPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
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
 * Fields of the ClassroomStudent model
 */
export interface ClassroomStudentFieldRefs {
    readonly id: Prisma.FieldRef<"ClassroomStudent", 'String'>;
    readonly classroomId: Prisma.FieldRef<"ClassroomStudent", 'String'>;
    readonly patientId: Prisma.FieldRef<"ClassroomStudent", 'String'>;
    readonly enrolledAt: Prisma.FieldRef<"ClassroomStudent", 'DateTime'>;
}
/**
 * ClassroomStudent findUnique
 */
export type ClassroomStudentFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ClassroomStudent
     */
    select?: Prisma.ClassroomStudentSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the ClassroomStudent
     */
    omit?: Prisma.ClassroomStudentOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.ClassroomStudentInclude<ExtArgs> | null;
    /**
     * Filter, which ClassroomStudent to fetch.
     */
    where: Prisma.ClassroomStudentWhereUniqueInput;
};
/**
 * ClassroomStudent findUniqueOrThrow
 */
export type ClassroomStudentFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ClassroomStudent
     */
    select?: Prisma.ClassroomStudentSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the ClassroomStudent
     */
    omit?: Prisma.ClassroomStudentOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.ClassroomStudentInclude<ExtArgs> | null;
    /**
     * Filter, which ClassroomStudent to fetch.
     */
    where: Prisma.ClassroomStudentWhereUniqueInput;
};
/**
 * ClassroomStudent findFirst
 */
export type ClassroomStudentFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ClassroomStudent
     */
    select?: Prisma.ClassroomStudentSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the ClassroomStudent
     */
    omit?: Prisma.ClassroomStudentOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.ClassroomStudentInclude<ExtArgs> | null;
    /**
     * Filter, which ClassroomStudent to fetch.
     */
    where?: Prisma.ClassroomStudentWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of ClassroomStudents to fetch.
     */
    orderBy?: Prisma.ClassroomStudentOrderByWithRelationInput | Prisma.ClassroomStudentOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for ClassroomStudents.
     */
    cursor?: Prisma.ClassroomStudentWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` ClassroomStudents from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` ClassroomStudents.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of ClassroomStudents.
     */
    distinct?: Prisma.ClassroomStudentScalarFieldEnum | Prisma.ClassroomStudentScalarFieldEnum[];
};
/**
 * ClassroomStudent findFirstOrThrow
 */
export type ClassroomStudentFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ClassroomStudent
     */
    select?: Prisma.ClassroomStudentSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the ClassroomStudent
     */
    omit?: Prisma.ClassroomStudentOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.ClassroomStudentInclude<ExtArgs> | null;
    /**
     * Filter, which ClassroomStudent to fetch.
     */
    where?: Prisma.ClassroomStudentWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of ClassroomStudents to fetch.
     */
    orderBy?: Prisma.ClassroomStudentOrderByWithRelationInput | Prisma.ClassroomStudentOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for ClassroomStudents.
     */
    cursor?: Prisma.ClassroomStudentWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` ClassroomStudents from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` ClassroomStudents.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of ClassroomStudents.
     */
    distinct?: Prisma.ClassroomStudentScalarFieldEnum | Prisma.ClassroomStudentScalarFieldEnum[];
};
/**
 * ClassroomStudent findMany
 */
export type ClassroomStudentFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ClassroomStudent
     */
    select?: Prisma.ClassroomStudentSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the ClassroomStudent
     */
    omit?: Prisma.ClassroomStudentOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.ClassroomStudentInclude<ExtArgs> | null;
    /**
     * Filter, which ClassroomStudents to fetch.
     */
    where?: Prisma.ClassroomStudentWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of ClassroomStudents to fetch.
     */
    orderBy?: Prisma.ClassroomStudentOrderByWithRelationInput | Prisma.ClassroomStudentOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing ClassroomStudents.
     */
    cursor?: Prisma.ClassroomStudentWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` ClassroomStudents from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` ClassroomStudents.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of ClassroomStudents.
     */
    distinct?: Prisma.ClassroomStudentScalarFieldEnum | Prisma.ClassroomStudentScalarFieldEnum[];
};
/**
 * ClassroomStudent create
 */
export type ClassroomStudentCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ClassroomStudent
     */
    select?: Prisma.ClassroomStudentSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the ClassroomStudent
     */
    omit?: Prisma.ClassroomStudentOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.ClassroomStudentInclude<ExtArgs> | null;
    /**
     * The data needed to create a ClassroomStudent.
     */
    data: Prisma.XOR<Prisma.ClassroomStudentCreateInput, Prisma.ClassroomStudentUncheckedCreateInput>;
};
/**
 * ClassroomStudent createMany
 */
export type ClassroomStudentCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * The data used to create many ClassroomStudents.
     */
    data: Prisma.ClassroomStudentCreateManyInput | Prisma.ClassroomStudentCreateManyInput[];
    skipDuplicates?: boolean;
};
/**
 * ClassroomStudent createManyAndReturn
 */
export type ClassroomStudentCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ClassroomStudent
     */
    select?: Prisma.ClassroomStudentSelectCreateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the ClassroomStudent
     */
    omit?: Prisma.ClassroomStudentOmit<ExtArgs> | null;
    /**
     * The data used to create many ClassroomStudents.
     */
    data: Prisma.ClassroomStudentCreateManyInput | Prisma.ClassroomStudentCreateManyInput[];
    skipDuplicates?: boolean;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.ClassroomStudentIncludeCreateManyAndReturn<ExtArgs> | null;
};
/**
 * ClassroomStudent update
 */
export type ClassroomStudentUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ClassroomStudent
     */
    select?: Prisma.ClassroomStudentSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the ClassroomStudent
     */
    omit?: Prisma.ClassroomStudentOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.ClassroomStudentInclude<ExtArgs> | null;
    /**
     * The data needed to update a ClassroomStudent.
     */
    data: Prisma.XOR<Prisma.ClassroomStudentUpdateInput, Prisma.ClassroomStudentUncheckedUpdateInput>;
    /**
     * Choose, which ClassroomStudent to update.
     */
    where: Prisma.ClassroomStudentWhereUniqueInput;
};
/**
 * ClassroomStudent updateMany
 */
export type ClassroomStudentUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * The data used to update ClassroomStudents.
     */
    data: Prisma.XOR<Prisma.ClassroomStudentUpdateManyMutationInput, Prisma.ClassroomStudentUncheckedUpdateManyInput>;
    /**
     * Filter which ClassroomStudents to update
     */
    where?: Prisma.ClassroomStudentWhereInput;
    /**
     * Limit how many ClassroomStudents to update.
     */
    limit?: number;
};
/**
 * ClassroomStudent updateManyAndReturn
 */
export type ClassroomStudentUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ClassroomStudent
     */
    select?: Prisma.ClassroomStudentSelectUpdateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the ClassroomStudent
     */
    omit?: Prisma.ClassroomStudentOmit<ExtArgs> | null;
    /**
     * The data used to update ClassroomStudents.
     */
    data: Prisma.XOR<Prisma.ClassroomStudentUpdateManyMutationInput, Prisma.ClassroomStudentUncheckedUpdateManyInput>;
    /**
     * Filter which ClassroomStudents to update
     */
    where?: Prisma.ClassroomStudentWhereInput;
    /**
     * Limit how many ClassroomStudents to update.
     */
    limit?: number;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.ClassroomStudentIncludeUpdateManyAndReturn<ExtArgs> | null;
};
/**
 * ClassroomStudent upsert
 */
export type ClassroomStudentUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ClassroomStudent
     */
    select?: Prisma.ClassroomStudentSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the ClassroomStudent
     */
    omit?: Prisma.ClassroomStudentOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.ClassroomStudentInclude<ExtArgs> | null;
    /**
     * The filter to search for the ClassroomStudent to update in case it exists.
     */
    where: Prisma.ClassroomStudentWhereUniqueInput;
    /**
     * In case the ClassroomStudent found by the `where` argument doesn't exist, create a new ClassroomStudent with this data.
     */
    create: Prisma.XOR<Prisma.ClassroomStudentCreateInput, Prisma.ClassroomStudentUncheckedCreateInput>;
    /**
     * In case the ClassroomStudent was found with the provided `where` argument, update it with this data.
     */
    update: Prisma.XOR<Prisma.ClassroomStudentUpdateInput, Prisma.ClassroomStudentUncheckedUpdateInput>;
};
/**
 * ClassroomStudent delete
 */
export type ClassroomStudentDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ClassroomStudent
     */
    select?: Prisma.ClassroomStudentSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the ClassroomStudent
     */
    omit?: Prisma.ClassroomStudentOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.ClassroomStudentInclude<ExtArgs> | null;
    /**
     * Filter which ClassroomStudent to delete.
     */
    where: Prisma.ClassroomStudentWhereUniqueInput;
};
/**
 * ClassroomStudent deleteMany
 */
export type ClassroomStudentDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Filter which ClassroomStudents to delete
     */
    where?: Prisma.ClassroomStudentWhereInput;
    /**
     * Limit how many ClassroomStudents to delete.
     */
    limit?: number;
};
/**
 * ClassroomStudent without action
 */
export type ClassroomStudentDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ClassroomStudent
     */
    select?: Prisma.ClassroomStudentSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the ClassroomStudent
     */
    omit?: Prisma.ClassroomStudentOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.ClassroomStudentInclude<ExtArgs> | null;
};
