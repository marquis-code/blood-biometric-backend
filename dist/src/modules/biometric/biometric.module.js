"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BiometricModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const biometric_controller_1 = require("./biometric.controller");
const biometric_service_1 = require("./biometric.service");
const donor_schema_1 = require("../donors/schemas/donor.schema");
let BiometricModule = class BiometricModule {
};
BiometricModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([{ name: donor_schema_1.Donor.name, schema: donor_schema_1.DonorSchema }]),
        ],
        controllers: [biometric_controller_1.BiometricController],
        providers: [biometric_service_1.BiometricService],
        exports: [biometric_service_1.BiometricService],
    })
], BiometricModule);
exports.BiometricModule = BiometricModule;
//# sourceMappingURL=biometric.module.js.map