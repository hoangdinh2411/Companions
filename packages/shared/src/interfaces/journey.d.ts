import { JourneyStatusEnum } from '../enums/journey';
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
    title: string;
    be_in_touch?: boolean;
}
export interface JourneyDocument extends Omit<JourneyFormData, 'id_number' | 'phone'> {
    created_by: UserDocument;
    slug: string;
    created_at?: Date;
    updated_at?: Date;
    _id: string;
    status: JourneyStatusEnum;
    companions: UserDocument[];
}
//# sourceMappingURL=journey.d.ts.map