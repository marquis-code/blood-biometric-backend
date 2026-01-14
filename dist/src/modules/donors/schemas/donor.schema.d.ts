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
import { HydratedDocument } from 'mongoose';
export declare class Donor {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    dateOfBirth: string;
    bloodType: string;
    gender: string;
    address: string;
    credentialId: string;
    publicKey: string;
    medicalNotes?: string;
    lastDonationDate?: string;
    donationHistory: string[];
    registrationDate: Date;
}
export declare const DonorSchema: import("mongoose").Schema<Donor, import("mongoose").Model<Donor, any, any, any, (import("mongoose").Document<unknown, any, Donor, any, import("mongoose").DefaultSchemaOptions> & Donor & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
} & {
    id: string;
}) | (import("mongoose").Document<unknown, any, Donor, any, import("mongoose").DefaultSchemaOptions> & Donor & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}), any, Donor>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Donor, import("mongoose").Document<unknown, {}, Donor, {
    id: string;
}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Donor & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    firstName?: import("mongoose").SchemaDefinitionProperty<string, Donor, import("mongoose").Document<unknown, {}, Donor, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Donor & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    lastName?: import("mongoose").SchemaDefinitionProperty<string, Donor, import("mongoose").Document<unknown, {}, Donor, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Donor & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    email?: import("mongoose").SchemaDefinitionProperty<string, Donor, import("mongoose").Document<unknown, {}, Donor, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Donor & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    phone?: import("mongoose").SchemaDefinitionProperty<string, Donor, import("mongoose").Document<unknown, {}, Donor, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Donor & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    dateOfBirth?: import("mongoose").SchemaDefinitionProperty<string, Donor, import("mongoose").Document<unknown, {}, Donor, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Donor & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    bloodType?: import("mongoose").SchemaDefinitionProperty<string, Donor, import("mongoose").Document<unknown, {}, Donor, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Donor & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    gender?: import("mongoose").SchemaDefinitionProperty<string, Donor, import("mongoose").Document<unknown, {}, Donor, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Donor & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    address?: import("mongoose").SchemaDefinitionProperty<string, Donor, import("mongoose").Document<unknown, {}, Donor, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Donor & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    credentialId?: import("mongoose").SchemaDefinitionProperty<string, Donor, import("mongoose").Document<unknown, {}, Donor, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Donor & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    publicKey?: import("mongoose").SchemaDefinitionProperty<string, Donor, import("mongoose").Document<unknown, {}, Donor, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Donor & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    medicalNotes?: import("mongoose").SchemaDefinitionProperty<string, Donor, import("mongoose").Document<unknown, {}, Donor, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Donor & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    lastDonationDate?: import("mongoose").SchemaDefinitionProperty<string, Donor, import("mongoose").Document<unknown, {}, Donor, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Donor & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    donationHistory?: import("mongoose").SchemaDefinitionProperty<string[], Donor, import("mongoose").Document<unknown, {}, Donor, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Donor & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    registrationDate?: import("mongoose").SchemaDefinitionProperty<Date, Donor, import("mongoose").Document<unknown, {}, Donor, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Donor & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
}, Donor>;
export type DonorDocument = HydratedDocument<Donor>;
