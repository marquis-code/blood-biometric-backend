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
exports.StaffService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const staff_schema_1 = require("./schemas/staff.schema");
let StaffService = class StaffService {
    constructor(staffModel) {
        this.staffModel = staffModel;
        this.seedStaffUsers();
    }
    async seedStaffUsers() {
        const count = await this.staffModel.countDocuments();
        if (count === 0) {
            const defaultStaff = [
                { name: 'Nurse Jane', email: 'nurse@hospital.com', password: 'nurse123', role: 'nurse' },
                { name: 'Dr. Smith', email: 'doctor@hospital.com', password: 'doctor123', role: 'doctor' },
            ];
            await this.staffModel.insertMany(defaultStaff);
            console.log('Default staff users created');
        }
    }
    async login(email, password) {
        const staff = await this.staffModel.findOne({ email, password });
        if (!staff) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        return {
            success: true,
            message: 'Login successful',
            staff: {
                id: staff._id,
                name: staff.name,
                email: staff.email,
                role: staff.role,
            },
        };
    }
};
StaffService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(staff_schema_1.Staff.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], StaffService);
exports.StaffService = StaffService;
//# sourceMappingURL=staff.service.js.map