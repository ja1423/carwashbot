import { Model } from "sequelize-typescript";
interface IOtpCreationAttr {
    id: string;
    otp: string;
    expiration_time: Date;
    varified: boolean;
    check: string;
}
export declare class Otp extends Model<Otp, IOtpCreationAttr> {
    id: string;
    otp: string;
    expiration_time: Date;
    varified: boolean;
    check: string;
}
export {};
