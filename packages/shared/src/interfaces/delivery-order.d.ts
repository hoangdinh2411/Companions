import { DeliveryOrderStatusEnum, TypeOfCommodityEnum } from '../enums/delivery-order';
import { UserDocument } from './user';
export interface DeliveryOrderFormData {
    start_date: string;
    end_date: string;
    from: string;
    to: string;
    price: number;
    message: string;
    weight: number;
    size: string;
    title: string;
    be_in_touch?: boolean;
    type_of_commodity: TypeOfCommodityEnum;
}
export interface DeliveryOrderDocument extends Omit<DeliveryOrderFormData, 'id_number' | 'phone'> {
    created_by: UserDocument;
    slug: string;
    created_at?: Date;
    updated_at?: Date;
    _id: string;
    status: DeliveryOrderStatusEnum;
    companions: UserDocument[];
}
//# sourceMappingURL=delivery-order.d.ts.map