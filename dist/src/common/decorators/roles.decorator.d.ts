export declare enum Role {
    PATIENT = "patient",
    DOCTOR = "doctor",
    ADMIN = "admin"
}
export declare const ROLES_KEY = "roles";
export declare const Roles: (...roles: Role[]) => import("@nestjs/common").CustomDecorator<string>;
