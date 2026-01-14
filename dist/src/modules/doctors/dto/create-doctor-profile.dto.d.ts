export declare class ConsultationFeeDto {
    type: string;
    amount: number;
    currency?: string;
    isActive?: boolean;
}
export declare class BankDetailsDto {
    accountName: string;
    accountNumber: string;
    bankName: string;
    routingNumber: string;
}
export declare class AvailabilitySlotDto {
    startTime: string;
    endTime: string;
    isAvailable?: boolean;
}
export declare class DailyAvailabilityDto {
    day: string;
    slots: AvailabilitySlotDto[];
}
export declare class CreateDoctorProfileDto {
    licenseNumber: string;
    licenseDocument?: string;
    specialties: string[];
    qualifications: string;
    experience: number;
    languages: string[];
    consultationFees: ConsultationFeeDto[];
    about?: string;
    availability?: DailyAvailabilityDto[];
    bankDetails?: BankDetailsDto;
}
