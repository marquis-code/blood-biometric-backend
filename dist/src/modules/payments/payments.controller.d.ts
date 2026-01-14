import { RawBodyRequest } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
export declare class PaymentsController {
    private readonly paymentsService;
    constructor(paymentsService: PaymentsService);
    createPaymentIntent(req: any, createPaymentDto: CreatePaymentDto): Promise<{
        clientSecret: string;
        transactionId: string;
    }>;
    confirmPayment(transactionId: string): Promise<void>;
    handleWebhook(signature: string, req: RawBodyRequest<Request>): Promise<{
        received: boolean;
    }>;
    getDoctorEarnings(req: any): Promise<{
        total: number;
        pending: number;
        paid: number;
    }>;
    processPayout(req: any): Promise<void>;
    getTransactionHistory(req: any): Promise<import("./schemas/transaction.schema").Transaction[]>;
    getPlatformRevenue(): Promise<{
        total: number;
        thisMonth: number;
        lastMonth: number;
    }>;
}
