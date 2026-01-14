import { StaffService } from './staff.service';
export declare class StaffController {
    private readonly staffService;
    constructor(staffService: StaffService);
    login(body: {
        email: string;
        password: string;
    }): Promise<{
        success: boolean;
        message: string;
        staff: {
            id: unknown;
            name: string;
            email: string;
            role: string;
        };
    }>;
}
