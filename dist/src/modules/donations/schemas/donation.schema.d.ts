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
/// <reference types="mongoose/types/schematypes" />
/// <reference types="mongoose/types/inferschematype" />
/// <reference types="mongoose/types/inferhydrateddoctype" />
/// <reference types="mongoose/types/inferrawdoctype" />
import { HydratedDocument, Types } from 'mongoose';
export declare class Donation {
    donorId: Types.ObjectId;
    donationDate: Date;
    bloodType: string;
    quantity: string;
    location: string;
    staffId: Types.ObjectId;
    notes?: string;
}
export declare const DonationSchema: import("mongoose").Schema<Donation, import("mongoose").Model<Donation, any, any, any, (import("mongoose").Document<unknown, any, Donation, any, import("mongoose").DefaultSchemaOptions> & Donation & {
    _id: Types.ObjectId;
} & {
    __v: number;
} & {
    id: string;
}) | (import("mongoose").Document<unknown, any, Donation, any, import("mongoose").DefaultSchemaOptions> & Donation & {
    _id: Types.ObjectId;
} & {
    __v: number;
}), any, Donation>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Donation, import("mongoose").Document<unknown, {}, Donation, {
    id: string;
}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Donation & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    donorId?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, Donation, import("mongoose").Document<unknown, {}, Donation, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Donation & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    donationDate?: import("mongoose").SchemaDefinitionProperty<Date, Donation, import("mongoose").Document<unknown, {}, Donation, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Donation & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    bloodType?: import("mongoose").SchemaDefinitionProperty<string, Donation, import("mongoose").Document<unknown, {}, Donation, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Donation & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    quantity?: import("mongoose").SchemaDefinitionProperty<string, Donation, import("mongoose").Document<unknown, {}, Donation, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Donation & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    location?: import("mongoose").SchemaDefinitionProperty<string, Donation, import("mongoose").Document<unknown, {}, Donation, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Donation & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    staffId?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, Donation, import("mongoose").Document<unknown, {}, Donation, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Donation & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    notes?: import("mongoose").SchemaDefinitionProperty<string, Donation, import("mongoose").Document<unknown, {}, Donation, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Donation & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
}, Donation>;
export type DonationDocument = HydratedDocument<Donation>;
