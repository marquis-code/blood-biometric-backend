export declare class UpdateAvailabilityDto {
    availability?: Array<{
        day: string;
        slots: Array<{
            startTime: string;
            endTime: string;
            isAvailable?: boolean;
        }>;
    }>;
    blackoutDates?: Date[];
}
