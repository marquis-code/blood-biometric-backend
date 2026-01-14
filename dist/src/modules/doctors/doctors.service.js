"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DoctorsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const doctor_profile_schema_1 = require("./schemas/doctor-profile.schema");
let DoctorsService = class DoctorsService {
    constructor(doctorProfileModel) {
        this.doctorProfileModel = doctorProfileModel;
    }
    async createProfile(userId, createDoctorProfileDto) {
        var _a;
        const existingProfile = await this.doctorProfileModel.findOne({ userId });
        if (existingProfile) {
            throw new common_1.ConflictException('Doctor profile already exists');
        }
        const defaultConsultationFees = [
            { type: 'video', amount: 0, currency: 'NGN', isActive: true },
            { type: 'audio', amount: 0, currency: 'NGN', isActive: true },
            { type: 'chat', amount: 0, currency: 'NGN', isActive: true },
            { type: 'in-person', amount: 0, currency: 'NGN', isActive: false }
        ];
        const consultationFees = ((_a = createDoctorProfileDto.consultationFees) === null || _a === void 0 ? void 0 : _a.length) > 0
            ? createDoctorProfileDto.consultationFees.map(fee => {
                var _a;
                return (Object.assign(Object.assign({}, fee), { currency: fee.currency || 'NGN', isActive: (_a = fee.isActive) !== null && _a !== void 0 ? _a : true }));
            })
            : defaultConsultationFees;
        const doctorProfile = new this.doctorProfileModel(Object.assign(Object.assign({ userId }, createDoctorProfileDto), { consultationFees }));
        return doctorProfile.save();
    }
    async findAll(filters) {
        const query = { verificationStatus: 'approved', isActive: true };
        if (filters === null || filters === void 0 ? void 0 : filters.specialty) {
            query.specialties = { $in: [filters.specialty] };
        }
        if (filters === null || filters === void 0 ? void 0 : filters.language) {
            query.languages = { $in: [filters.language] };
        }
        if (filters === null || filters === void 0 ? void 0 : filters.minRating) {
            query.averageRating = { $gte: filters.minRating };
        }
        return this.doctorProfileModel
            .find(query)
            .populate('userId', 'firstName lastName email profileImage')
            .sort({ averageRating: -1 })
            .exec();
    }
    async findOne(id) {
        if (!mongoose_2.Types.ObjectId.isValid(id)) {
            throw new common_1.BadRequestException('Invalid doctor ID format');
        }
        const doctor = await this.doctorProfileModel
            .findById(id)
            .populate('userId', 'firstName lastName email profileImage phone')
            .exec();
        if (!doctor) {
            throw new common_1.NotFoundException('Doctor profile not found');
        }
        return doctor;
    }
    async findByUserId(userId) {
        const doctorProfile = await this.doctorProfileModel
            .findOne({ userId })
            .populate('userId', 'firstName lastName email')
            .exec();
        return doctorProfile;
    }
    async updateProfile(userId, updateDoctorProfileDto) {
        const doctorProfile = await this.doctorProfileModel.findOne({ userId });
        if (!doctorProfile) {
            throw new common_1.NotFoundException('Doctor profile not found');
        }
        const updatedProfile = await this.doctorProfileModel
            .findByIdAndUpdate(doctorProfile._id, updateDoctorProfileDto, { new: true })
            .populate('userId', 'firstName lastName email profileImage')
            .exec();
        return updatedProfile;
    }
    async updateConsultationFees(userId, consultationFees) {
        var _a;
        const profile = await this.doctorProfileModel.findOne({ userId });
        if (!profile) {
            throw new common_1.NotFoundException('Doctor profile not found');
        }
        const validTypes = ['video', 'audio', 'chat', 'in-person'];
        const invalidTypes = consultationFees.filter(fee => !validTypes.includes(fee.type));
        if (invalidTypes.length > 0) {
            throw new common_1.BadRequestException(`Invalid consultation types: ${invalidTypes.map(f => f.type).join(', ')}`);
        }
        for (const newFee of consultationFees) {
            const existingFeeIndex = profile.consultationFees.findIndex(fee => fee.type === newFee.type);
            const feeData = {
                type: newFee.type,
                amount: newFee.amount,
                currency: newFee.currency || 'NGN',
                isActive: (_a = newFee.isActive) !== null && _a !== void 0 ? _a : true
            };
            if (existingFeeIndex >= 0) {
                profile.consultationFees[existingFeeIndex] = feeData;
            }
            else {
                profile.consultationFees.push(feeData);
            }
        }
        return await profile.save();
    }
    async getConsultationFee(userId, consultationType) {
        const profile = await this.doctorProfileModel.findOne({ userId });
        if (!profile) {
            throw new common_1.NotFoundException('Doctor profile not found');
        }
        const consultationFee = profile.consultationFees.find(fee => fee.type === consultationType && fee.isActive);
        if (!consultationFee) {
            throw new common_1.NotFoundException(`Consultation fee not found for type: ${consultationType}`);
        }
        return consultationFee;
    }
    async getActiveConsultationTypes(userId) {
        const profile = await this.doctorProfileModel.findOne({ userId });
        if (!profile) {
            throw new common_1.NotFoundException('Doctor profile not found');
        }
        return profile.consultationFees.filter(fee => fee.isActive);
    }
    async toggleConsultationType(userId, consultationType, isActive) {
        const profile = await this.doctorProfileModel.findOne({ userId });
        if (!profile) {
            throw new common_1.NotFoundException('Doctor profile not found');
        }
        const consultationFee = profile.consultationFees.find(fee => fee.type === consultationType);
        if (!consultationFee) {
            throw new common_1.NotFoundException(`Consultation type not found: ${consultationType}`);
        }
        consultationFee.isActive = isActive;
        return await profile.save();
    }
    async getConsultationFeesByCurrency(userId, currency = 'NGN') {
        const profile = await this.doctorProfileModel.findOne({ userId });
        if (!profile) {
            throw new common_1.NotFoundException('Doctor profile not found');
        }
        return profile.consultationFees.filter(fee => fee.currency === currency && fee.isActive);
    }
    async updateStripeConnectId(userId, stripeConnectId) {
        const result = await this.doctorProfileModel.findOneAndUpdate({ userId }, { stripeConnectId }, { new: true });
        if (!result) {
            throw new common_1.NotFoundException('Doctor profile not found');
        }
    }
    async updateAvailability(userId, updateAvailabilityDto) {
        const doctorProfile = await this.doctorProfileModel.findOne({ userId });
        if (!doctorProfile) {
            throw new common_1.NotFoundException('Doctor profile not found');
        }
        const updatedProfile = await this.doctorProfileModel
            .findByIdAndUpdate(doctorProfile._id, updateAvailabilityDto, { new: true })
            .populate('userId', 'firstName lastName email profileImage')
            .exec();
        return updatedProfile;
    }
    async verifyDoctor(id, status, rejectionReason) {
        if (!mongoose_2.Types.ObjectId.isValid(id)) {
            throw new common_1.BadRequestException('Invalid doctor ID format');
        }
        const updateData = { verificationStatus: status };
        if (status === 'rejected' && rejectionReason) {
            updateData.rejectionReason = rejectionReason;
        }
        const updatedDoctor = await this.doctorProfileModel
            .findByIdAndUpdate(id, updateData, { new: true })
            .populate('userId', 'firstName lastName email')
            .exec();
        if (!updatedDoctor) {
            throw new common_1.NotFoundException('Doctor profile not found');
        }
        return updatedDoctor;
    }
    async updateRating(doctorId, newRating) {
        if (!mongoose_2.Types.ObjectId.isValid(doctorId)) {
            throw new common_1.BadRequestException('Invalid doctor ID format');
        }
        const doctor = await this.doctorProfileModel.findById(doctorId);
        if (!doctor) {
            throw new common_1.NotFoundException('Doctor not found');
        }
        const totalRatings = doctor.averageRating * doctor.totalReviews;
        const newTotalReviews = doctor.totalReviews + 1;
        const newAverageRating = (totalRatings + newRating) / newTotalReviews;
        await this.doctorProfileModel.findByIdAndUpdate(doctorId, {
            averageRating: Number(newAverageRating.toFixed(2)),
            totalReviews: newTotalReviews,
        });
    }
    async incrementConsultations(doctorId) {
        if (!mongoose_2.Types.ObjectId.isValid(doctorId)) {
            throw new common_1.BadRequestException('Invalid doctor ID format');
        }
        await this.doctorProfileModel.findByIdAndUpdate(doctorId, {
            $inc: { totalConsultations: 1 },
        });
    }
    async getAvailableSlots(doctorId, date) {
        if (!mongoose_2.Types.ObjectId.isValid(doctorId)) {
            throw new common_1.BadRequestException('Invalid doctor ID format');
        }
        const doctor = await this.doctorProfileModel.findById(doctorId);
        if (!doctor) {
            throw new common_1.NotFoundException('Doctor not found');
        }
        const requestedDate = new Date(date);
        const dayOfWeek = requestedDate
            .toLocaleString('en-US', { weekday: 'short' })
            .toLowerCase()
            .substring(0, 3);
        const dayMapping = {
            sun: 'sunday',
            mon: 'monday',
            tue: 'tuesday',
            wed: 'wednesday',
            thu: 'thursday',
            fri: 'friday',
            sat: 'saturday'
        };
        const dayName = dayMapping[dayOfWeek];
        const dayAvailability = doctor.availability.find(avail => avail.day === dayName);
        if (!dayAvailability) {
            return [];
        }
        const isBlackoutDate = doctor.blackoutDates.some(blackoutDate => blackoutDate.toDateString() === requestedDate.toDateString());
        if (isBlackoutDate) {
            return [];
        }
        return dayAvailability.slots.filter(slot => slot.isAvailable);
    }
    async deactivateDoctor(id) {
        if (!mongoose_2.Types.ObjectId.isValid(id)) {
            throw new common_1.BadRequestException('Invalid doctor ID format');
        }
        const result = await this.doctorProfileModel.findByIdAndUpdate(id, { isActive: false }, { new: true });
        if (!result) {
            throw new common_1.NotFoundException('Doctor profile not found');
        }
    }
    async getDoctorForBooking(doctorId) {
        if (!mongoose_2.Types.ObjectId.isValid(doctorId)) {
            throw new common_1.BadRequestException('Invalid doctor ID format');
        }
        const doctor = await this.doctorProfileModel
            .findById(doctorId)
            .populate('userId', 'firstName lastName email profileImage')
            .exec();
        if (!doctor) {
            throw new common_1.NotFoundException('Doctor profile not found');
        }
        if (doctor.verificationStatus !== 'approved' || !doctor.isActive) {
            throw new common_1.ForbiddenException('Doctor is not available for bookings');
        }
        return doctor;
    }
};
DoctorsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(doctor_profile_schema_1.DoctorProfile.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], DoctorsService);
exports.DoctorsService = DoctorsService;
//# sourceMappingURL=doctors.service.js.map