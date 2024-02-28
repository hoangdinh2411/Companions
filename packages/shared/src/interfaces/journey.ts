import { JourneyStatusEnum } from '../enums/journey';

export interface JourneyDocument {
  message?: string;
  startDate: string;
  endDate: string;
  from: string;
  to: string;
  time: string;
  price: number;
  places: number;
  created_by?: {
    _id: string;
    email: string;
    id_number?: string;
    phone?: string;
  };
  created_at?: string;
  updated_at?: string;
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
