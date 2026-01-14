export declare class CreateUserDto {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phone?: string;
    dateOfBirth?: Date;
    gender?: string;
    role?: string;
    profileImage?: string;
    address?: {
        street: string;
        city: string;
        state: string;
        country: string;
        zipCode: string;
    };
    medicalHistory?: string[];
    googleId?: string;
}
