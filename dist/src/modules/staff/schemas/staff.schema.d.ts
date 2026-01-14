/// <reference types="mongoose/types/aggregate" />
/// <reference types="mongoose/types/callback" />
/// <reference types="mongoose/types/collection" />
/// <reference types="mongoose/types/connection" />
/// <reference types="mongoose/types/cursor" />
/// <reference types="mongoose/types/document" />
/// <reference types="mongoose/types/error" />
/// <reference types="mongoose/types/expressions" />
/// <reference types="mongoose/types/helpers" />
/// <reference types="mongoose/types/middlewares" />
/// <reference types="mongoose/types/indexes" />
/// <reference types="mongoose/types/models" />
/// <reference types="mongoose/types/mongooseoptions" />
/// <reference types="mongoose/types/pipelinestage" />
/// <reference types="mongoose/types/populate" />
/// <reference types="mongoose/types/query" />
/// <reference types="mongoose/types/schemaoptions" />
/// <reference types="mongoose/types/session" />
/// <reference types="mongoose/types/types" />
/// <reference types="mongoose/types/utility" />
/// <reference types="mongoose/types/validation" />
/// <reference types="mongoose/types/virtuals" />
/// <reference types="mongoose" />
/// <reference types="mongoose/types/schematypes" />
/// <reference types="mongoose/types/inferschematype" />
/// <reference types="mongoose/types/inferhydrateddoctype" />
/// <reference types="mongoose/types/inferrawdoctype" />
export declare class Staff {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    role?: string;
    department?: string;
    isActive: boolean;
    password?: string;
}
export declare const StaffSchema: import("mongoose").Schema<Staff, import("mongoose").Model<Staff, any, any, any, (import("mongoose").Document<unknown, any, Staff, any, import("mongoose").DefaultSchemaOptions> & Staff & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
} & {
    id: string;
}) | (import("mongoose").Document<unknown, any, Staff, any, import("mongoose").DefaultSchemaOptions> & Staff & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}), any, Staff>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Staff, import("mongoose").Document<unknown, {}, Staff, {
    id: string;
}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Staff & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    firstName?: import("mongoose").SchemaDefinitionProperty<string, Staff, import("mongoose").Document<unknown, {}, Staff, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Staff & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    lastName?: import("mongoose").SchemaDefinitionProperty<string, Staff, import("mongoose").Document<unknown, {}, Staff, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Staff & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    email?: import("mongoose").SchemaDefinitionProperty<string, Staff, import("mongoose").Document<unknown, {}, Staff, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Staff & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    phone?: import("mongoose").SchemaDefinitionProperty<string, Staff, import("mongoose").Document<unknown, {}, Staff, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Staff & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    role?: import("mongoose").SchemaDefinitionProperty<string, Staff, import("mongoose").Document<unknown, {}, Staff, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Staff & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    department?: import("mongoose").SchemaDefinitionProperty<string, Staff, import("mongoose").Document<unknown, {}, Staff, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Staff & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    isActive?: import("mongoose").SchemaDefinitionProperty<boolean, Staff, import("mongoose").Document<unknown, {}, Staff, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Staff & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    password?: import("mongoose").SchemaDefinitionProperty<string, Staff, import("mongoose").Document<unknown, {}, Staff, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Staff & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
}, Staff>;
export type StaffDocument = any;
