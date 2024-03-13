import { Metadata } from 'next';
import DeliverOrderForm from '../../components/shared/Forms/deliveryOrder/DeliverOrderForm';

export default function NewOrderPage() {
  return <DeliverOrderForm heading='New delivery order' />;
}

export const metadata: Metadata = {
  title: 'Add New Deliver Order Page',
  description: 'Add New Deliver Order Page',
};
