import { Model } from 'mongoose';
import { DoctorProfile, DoctorProfileDocument } from './schemas/doctor-profile.schema';
import { CreateDoctorProfileDto, ConsultationFeeDto } from './dto/create-doctor-profile.dto';
import { UpdateDoctorProfileDto } from './dto/update-doctor-profile.dto';
import { UpdateAvailabilityDto } from './dto/update-availability.dto';
export declare class DoctorsService {
    private doctorProfileModel;
    constructor(doctorProfileModel: Model<DoctorProfileDocument>);
    createProfile(userId: string, createDoctorProfileDto: CreateDoctorProfileDto): Promise<DoctorProfile>;
    findAll(filters?: {
        specialty?: string;
        language?: string;
        minRating?: number;
    }): Promise<DoctorProfile[]>;
    findOne(id: string): Promise<DoctorProfile>;
    findByUserId(userId: string): Promise<DoctorProfile | null>;
    updateProfile(userId: string, updateDoctorProfileDto: UpdateDoctorProfileDto): Promise<DoctorProfile>;
    updateConsultationFees(userId: string, consultationFees: ConsultationFeeDto[]): Promise<DoctorProfile>;
    getConsultationFee(userId: string, consultationType: string): Promise<any>;
    getActiveConsultationTypes(userId: string): Promise<any[]>;
    toggleConsultationType(userId: string, consultationType: string, isActive: boolean): Promise<DoctorProfile>;
    getConsultationFeesByCurrency(userId: string, currency?: string): Promise<any[]>;
    updateStripeConnectId(userId: string, stripeConnectId: string): Promise<void>;
    updateAvailability(userId: string, updateAvailabilityDto: UpdateAvailabilityDto): Promise<DoctorProfile>;
    verifyDoctor(id: string, status: 'approved' | 'rejected', rejectionReason?: string): Promise<DoctorProfile>;
    updateRating(doctorId: string, newRating: number): Promise<void>;
    incrementConsultations(doctorId: string): Promise<void>;
    getAvailableSlots(doctorId: string, date: string): Promise<any[]>;
    deactivateDoctor(id: string): Promise<void>;
    getDoctorForBooking(doctorId: string): Promise<DoctorProfile>;
}
