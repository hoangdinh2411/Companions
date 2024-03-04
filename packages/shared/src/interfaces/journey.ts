import { JourneyStatusEnum } from '../enums/journey';
import { CompanionStatusEnum } from '../enums/user';
import { UserDocument } from './user';

export interface JourneyFormData {
  start_date: string;
  end_date: string;
  from: string;
  to: string;
  time: string;
  price: number;
  seats: number;
  message: string;
  phone: string;
  title: string;
}

export interface JourneyDocument
  extends Omit<JourneyFormData, 'id_number' | 'phone'> {
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
  status: JourneyStatusEnum;
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

export interface JourneyResponse {
  items: JourneyDocument[];
  pagination?: {
    total: number;
    pages: number;
  };
}
