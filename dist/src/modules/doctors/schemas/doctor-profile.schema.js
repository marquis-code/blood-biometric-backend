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
Object.defineProperty(exports, "__esModule", { value: true });
exports.DoctorProfileSchema = exports.DoctorProfile = exports.ConsultationFee = exports.BankDetails = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let BankDetails = class BankDetails {
};
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], BankDetails.prototype, "accountName", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], BankDetails.prototype, "accountNumber", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], BankDetails.prototype, "bankName", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], BankDetails.prototype, "routingNumber", void 0);
BankDetails = __decorate([
    (0, mongoose_1.Schema)({ _id: false })
], BankDetails);
exports.BankDetails = BankDetails;
const BankDetailsSchema = mongoose_1.SchemaFactory.createForClass(BankDetails);
let ConsultationFee = class ConsultationFee {
};
__decorate([
    (0, mongoose_1.Prop)({ required: true, enum: ['video', 'audio', 'chat', 'in-person'] }),
    __metadata("design:type", String)
], ConsultationFee.prototype, "type", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], ConsultationFee.prototype, "amount", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 'NGN', enum: ['NGN', 'USD', 'EUR', 'GBP'] }),
    __metadata("design:type", String)
], ConsultationFee.prototype, "currency", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: true }),
    __metadata("design:type", Boolean)
], ConsultationFee.prototype, "isActive", void 0);
ConsultationFee = __decorate([
    (0, mongoose_1.Schema)({ _id: false })
], ConsultationFee);
exports.ConsultationFee = ConsultationFee;
const ConsultationFeeSchema = mongoose_1.SchemaFactory.createForClass(ConsultationFee);
let DoctorProfile = class DoctorProfile {
};
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'User', required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], DoctorProfile.prototype, "userId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], DoctorProfile.prototype, "licenseNumber", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], DoctorProfile.prototype, "licenseDocument", void 0);
__decorate([
    (0, mongoose_1.Prop)([String]),
    __metadata("design:type", Array)
], DoctorProfile.prototype, "specialties", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], DoctorProfile.prototype, "qualifications", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], DoctorProfile.prototype, "experience", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], DoctorProfile.prototype, "bio", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: true }),
    __metadata("design:type", Boolean)
], DoctorProfile.prototype, "isAvailable", void 0);
__decorate([
    (0, mongoose_1.Prop)([String]),
    __metadata("design:type", Array)
], DoctorProfile.prototype, "languages", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: [ConsultationFeeSchema],
        default: [
            { type: 'video', amount: 0, currency: 'NGN', isActive: true },
            { type: 'audio', amount: 0, currency: 'NGN', isActive: true },
            { type: 'chat', amount: 0, currency: 'NGN', isActive: true },
            { type: 'in-person', amount: 0, currency: 'NGN', isActive: false }
        ]
    }),
    __metadata("design:type", Array)
], DoctorProfile.prototype, "consultationFees", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], DoctorProfile.prototype, "about", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: [{
                day: { type: String, enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] },
                startTime: String,
                endTime: String,
                isAvailable: { type: Boolean, default: true }
            }]
    }),
    __metadata("design:type", Array)
], DoctorProfile.prototype, "weeklySchedule", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], DoctorProfile.prototype, "stripeConnectId", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: [{
                day: { type: String, enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] },
                slots: [{ startTime: String, endTime: String, isAvailable: { type: Boolean, default: true } }]
            }],
        default: []
    }),
    __metadata("design:type", Array)
], DoctorProfile.prototype, "availability", void 0);
__decorate([
    (0, mongoose_1.Prop)([Date]),
    __metadata("design:type", Array)
], DoctorProfile.prototype, "blackoutDates", void 0);
__decorate([
    (0, mongoose_1.Prop)({ enum: ['pending', 'approved', 'rejected'], default: 'pending' }),
    __metadata("design:type", String)
], DoctorProfile.prototype, "verificationStatus", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], DoctorProfile.prototype, "verifiedAt", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'User' }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], DoctorProfile.prototype, "verifiedBy", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], DoctorProfile.prototype, "rejectionReason", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], DoctorProfile.prototype, "averageRating", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], DoctorProfile.prototype, "totalReviews", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], DoctorProfile.prototype, "totalConsultations", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: true }),
    __metadata("design:type", Boolean)
], DoctorProfile.prototype, "isActive", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: BankDetailsSchema }),
    __metadata("design:type", BankDetails)
], DoctorProfile.prototype, "bankDetails", void 0);
DoctorProfile = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], DoctorProfile);
exports.DoctorProfile = DoctorProfile;
exports.DoctorProfileSchema = mongoose_1.SchemaFactory.createForClass(DoctorProfile);
exports.DoctorProfileSchema.index({ userId: 1 });
exports.DoctorProfileSchema.index({ specialties: 1 });
exports.DoctorProfileSchema.index({ verificationStatus: 1 });
exports.DoctorProfileSchema.index({ isActive: 1 });
exports.DoctorProfileSchema.index({ averageRating: -1 });
exports.DoctorProfileSchema.index({ 'consultationFees.type': 1 });
exports.DoctorProfileSchema.index({ 'consultationFees.currency': 1 });
//# sourceMappingURL=doctor-profile.schema.js.map