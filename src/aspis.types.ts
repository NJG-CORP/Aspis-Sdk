export interface WhereComplexOption<FieldType> {
    /** More than */
    mt?: FieldType;
    /** More than or equal */
    mte?: FieldType;
    /** Less than or equal */
    lt?: FieldType;
    /** Less than or equal */
    lte?: FieldType;
    /** Between two values */
    btwn?: [FieldType, FieldType];
    /** Not value */
    not?: FieldType;
}

export type WhereOptions<Entity> = {
    [Field in keyof Entity]?: Entity[Field] | WhereComplexOption<Entity[Field]>;
}

export type OrderOptions<Entity> = {
    [Field in keyof Entity]?: 'DESC' | 'ASC';
}

export interface Query<Entity> {
    select?: Array<keyof Entity>;
    where?: WhereOptions<Entity>;
    order?: OrderOptions<Entity>;
    page?: number;
    /** No more than 1_000 */
    resultsPerPage?: number;
    relations?: QueryRelation<Entity>
}

export type QueryRelation<Entity> =  {
    [K in keyof Entity]?: boolean | QueryRelation<Entity[K]>
}

export interface PaginatedData<Entity> {
    data: Entity[];
    pagination: {
        page: number;
        resultsPerPage: number;
    };
}
