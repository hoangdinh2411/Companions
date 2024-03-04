import {
  DeliveryOrderStatusEnum,
  TypeOfCommodityEnum,
} from '../enums/delivery-order';
import { CompanionStatusEnum } from '../enums/user';

export interface DeliveryOrderFormData {
  start_date: string;
  end_date: string;
  from: string;
  to: string;
  price: number;
  message: string;
  weight: number;
  size: string;
  phone: string;
  title: string;
  type_of_commodity: TypeOfCommodityEnum;
}

export interface DeliverOrderDocument
  extends Omit<DeliveryOrderFormData, 'id_number' | 'phone'> {
  created_by?: {
    _id: string;
    email: string;
    id_number?: string;
    phone?: string;
    full_name: string;
  };
  slug: string;
  created_at?: Date;
  updated_at?: Date;
  _id: string;
  status: DeliveryOrderStatusEnum;
  companions: [
    {
      _id: string;
      email: string;
      id_number?: string;
      phone?: string;
      status?: CompanionStatusEnum;
      full_name: string;
    },
  ];
}

export interface DeliverOrderResponse {
  items: DeliverOrderDocument[];
  pagination?: {
    total: number;
    pages: number;
  };
}
