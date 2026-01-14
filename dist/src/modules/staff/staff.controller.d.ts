import { StaffService } from './staff.service';
import { StaffLoginDto } from './dto/staff-login.dto';
export declare class StaffController {
    private readonly staffService;
    constructor(staffService: StaffService);
    login(staffLoginDto: StaffLoginDto): Promise<{
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
