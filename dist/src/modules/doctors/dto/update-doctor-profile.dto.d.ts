import { CreateDoctorProfileDto, ConsultationFeeDto } from './create-doctor-profile.dto';
declare const UpdateDoctorProfileDto_base: import("@nestjs/mapped-types").MappedType<Partial<CreateDoctorProfileDto>>;
export declare class UpdateDoctorProfileDto extends UpdateDoctorProfileDto_base {
    consultationFees?: ConsultationFeeDto[];
    bio?: string;
    isAvailable?: boolean;
    verificationStatus?: string;
    rejectionReason?: string;
    stripeConnectId?: string;
}
export {};
