import { JourneyStatusEnum } from '../enums/journey';
import { UserDocument } from './user';

export interface JourneyFormData {
  startDate: Date;
  endDate: Date;
  from: string;
  to: string;
  time: string;
  price: number;
  seats: number;
  message: string;
  id_number?: string;
  phone?: string;
}

export interface JourneyDocument
  extends Omit<JourneyFormData, 'id_number' | 'phone'> {
  created_by?: {
    _id: string;
    email: string;
    id_number?: string;
    phone?: string;
  };
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
    },
  ];
}
