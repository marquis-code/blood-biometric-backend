import { DoctorsService } from './doctors.service';
import { CreateDoctorProfileDto, ConsultationFeeDto } from './dto/create-doctor-profile.dto';
import { UpdateDoctorProfileDto } from './dto/update-doctor-profile.dto';
import { UpdateAvailabilityDto } from './dto/update-availability.dto';
export declare class DoctorsController {
    private readonly doctorsService;
    constructor(doctorsService: DoctorsService);
    createProfile(req: any, createDoctorProfileDto: CreateDoctorProfileDto): Promise<import("./schemas/doctor-profile.schema").DoctorProfile>;
    updateProfile(req: any, updateDoctorProfileDto: UpdateDoctorProfileDto): Promise<import("./schemas/doctor-profile.schema").DoctorProfile>;
    updateConsultationFees(req: any, body: {
        consultationFees: ConsultationFeeDto[];
    }): Promise<import("./schemas/doctor-profile.schema").DoctorProfile>;
    getConsultationFee(req: any, consultationType: string): Promise<any>;
    getActiveConsultationTypes(req: any): Promise<any[]>;
    toggleConsultationType(req: any, consultationType: string, body: {
        isActive: boolean;
    }): Promise<import("./schemas/doctor-profile.schema").DoctorProfile>;
    getConsultationFeesByCurrency(req: any, currency?: string): Promise<any[]>;
    getDoctorForBooking(doctorId: string): Promise<import("./schemas/doctor-profile.schema").DoctorProfile>;
    findAll(specialty?: string, language?: string, minRating?: number): Promise<import("./schemas/doctor-profile.schema").DoctorProfile[]>;
    getMyProfile(req: any): Promise<import("./schemas/doctor-profile.schema").DoctorProfile>;
    findOne(id: string): Promise<import("./schemas/doctor-profile.schema").DoctorProfile>;
    updateAvailability(req: any, updateAvailabilityDto: UpdateAvailabilityDto): Promise<import("./schemas/doctor-profile.schema").DoctorProfile>;
    getAvailableSlots(doctorId: string, date: string): Promise<any[]>;
    verifyDoctor(id: string, body: {
        status: 'approved' | 'rejected';
        rejectionReason?: string;
    }): Promise<import("./schemas/doctor-profile.schema").DoctorProfile>;
    deactivateDoctor(id: string): Promise<void>;
}
