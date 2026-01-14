import { Model } from 'mongoose';
import { StaffDocument } from './schemas/staff.schema';
export declare class StaffService {
    private staffModel;
    constructor(staffModel: Model<StaffDocument>);
    private seedStaffUsers;
    login(email: string, password: string): Promise<{
        success: boolean;
        message: string;
        staff: {
            id: import("mongoose").Types.ObjectId;
            name: string;
            email: string;
            role: string;
        };
    }>;
}
