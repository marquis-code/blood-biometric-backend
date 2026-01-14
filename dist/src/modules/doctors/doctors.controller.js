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
exports.DoctorsController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const roles_guard_1 = require("../../common/guards/roles.guard");
const roles_decorator_1 = require("../../common/decorators/roles.decorator");
const doctors_service_1 = require("./doctors.service");
const create_doctor_profile_dto_1 = require("./dto/create-doctor-profile.dto");
const update_doctor_profile_dto_1 = require("./dto/update-doctor-profile.dto");
const update_availability_dto_1 = require("./dto/update-availability.dto");
let DoctorsController = class DoctorsController {
    constructor(doctorsService) {
        this.doctorsService = doctorsService;
    }
    async createProfile(req, createDoctorProfileDto) {
        return this.doctorsService.createProfile(req.user.sub, createDoctorProfileDto);
    }
    async updateProfile(req, updateDoctorProfileDto) {
        return this.doctorsService.updateProfile(req.user.sub, updateDoctorProfileDto);
    }
    async updateConsultationFees(req, body) {
        return this.doctorsService.updateConsultationFees(req.user.sub, body.consultationFees);
    }
    async getConsultationFee(req, consultationType) {
        return this.doctorsService.getConsultationFee(req.user.sub, consultationType);
    }
    async getActiveConsultationTypes(req) {
        return this.doctorsService.getActiveConsultationTypes(req.user.sub);
    }
    async toggleConsultationType(req, consultationType, body) {
        return this.doctorsService.toggleConsultationType(req.user.sub, consultationType, body.isActive);
    }
    async getConsultationFeesByCurrency(req, currency = 'NGN') {
        return this.doctorsService.getConsultationFeesByCurrency(req.user.sub, currency);
    }
    async getDoctorForBooking(doctorId) {
        return this.doctorsService.getDoctorForBooking(doctorId);
    }
    async findAll(specialty, language, minRating) {
        const filters = { specialty, language, minRating };
        return this.doctorsService.findAll(filters);
    }
    async getMyProfile(req) {
        return this.doctorsService.findByUserId(req.user.sub);
    }
    async findOne(id) {
        return this.doctorsService.findOne(id);
    }
    async updateAvailability(req, updateAvailabilityDto) {
        return this.doctorsService.updateAvailability(req.user.sub, updateAvailabilityDto);
    }
    async getAvailableSlots(doctorId, date) {
        return this.doctorsService.getAvailableSlots(doctorId, date);
    }
    async verifyDoctor(id, body) {
        return this.doctorsService.verifyDoctor(id, body.status, body.rejectionReason);
    }
    async deactivateDoctor(id) {
        return this.doctorsService.deactivateDoctor(id);
    }
};
__decorate([
    (0, common_1.Post)('profile'),
    (0, roles_decorator_1.Roles)(roles_decorator_1.Role.DOCTOR),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_doctor_profile_dto_1.CreateDoctorProfileDto]),
    __metadata("design:returntype", Promise)
], DoctorsController.prototype, "createProfile", null);
__decorate([
    (0, common_1.Put)('profile'),
    (0, roles_decorator_1.Roles)(roles_decorator_1.Role.DOCTOR),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, update_doctor_profile_dto_1.UpdateDoctorProfileDto]),
    __metadata("design:returntype", Promise)
], DoctorsController.prototype, "updateProfile", null);
__decorate([
    (0, common_1.Put)('consultation-fees'),
    (0, roles_decorator_1.Roles)(roles_decorator_1.Role.DOCTOR),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], DoctorsController.prototype, "updateConsultationFees", null);
__decorate([
    (0, common_1.Get)('consultation-fee/:type'),
    (0, roles_decorator_1.Roles)(roles_decorator_1.Role.DOCTOR),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('type')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], DoctorsController.prototype, "getConsultationFee", null);
__decorate([
    (0, common_1.Get)('consultation-types'),
    (0, roles_decorator_1.Roles)(roles_decorator_1.Role.DOCTOR),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DoctorsController.prototype, "getActiveConsultationTypes", null);
__decorate([
    (0, common_1.Patch)('consultation-type/:type/toggle'),
    (0, roles_decorator_1.Roles)(roles_decorator_1.Role.DOCTOR),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('type')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], DoctorsController.prototype, "toggleConsultationType", null);
__decorate([
    (0, common_1.Get)('consultation-fees'),
    (0, roles_decorator_1.Roles)(roles_decorator_1.Role.DOCTOR),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)('currency')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], DoctorsController.prototype, "getConsultationFeesByCurrency", null);
__decorate([
    (0, common_1.Get)(':id/booking-info'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], DoctorsController.prototype, "getDoctorForBooking", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('specialty')),
    __param(1, (0, common_1.Query)('language')),
    __param(2, (0, common_1.Query)('minRating')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Number]),
    __metadata("design:returntype", Promise)
], DoctorsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('profile'),
    (0, roles_decorator_1.Roles)(roles_decorator_1.Role.DOCTOR),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DoctorsController.prototype, "getMyProfile", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], DoctorsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Put)('availability'),
    (0, roles_decorator_1.Roles)(roles_decorator_1.Role.DOCTOR),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, update_availability_dto_1.UpdateAvailabilityDto]),
    __metadata("design:returntype", Promise)
], DoctorsController.prototype, "updateAvailability", null);
__decorate([
    (0, common_1.Get)(':id/available-slots'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Query)('date')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], DoctorsController.prototype, "getAvailableSlots", null);
__decorate([
    (0, common_1.Post)(':id/verify'),
    (0, roles_decorator_1.Roles)(roles_decorator_1.Role.ADMIN),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], DoctorsController.prototype, "verifyDoctor", null);
__decorate([
    (0, common_1.Patch)(':id/deactivate'),
    (0, roles_decorator_1.Roles)(roles_decorator_1.Role.ADMIN),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], DoctorsController.prototype, "deactivateDoctor", null);
DoctorsController = __decorate([
    (0, common_1.Controller)('doctors'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [doctors_service_1.DoctorsService])
], DoctorsController);
exports.DoctorsController = DoctorsController;
//# sourceMappingURL=doctors.controller.js.map