import { Metadata } from 'next';
import './NewOrder.scss';
import Form from './components/Form';

export default function NewOrderPage() {
  return (
    <section className='new-order'>
      <div className='new-order__container'>
        <h3>Create new order</h3>
        <Form />
      </div>
    </section>
  );
}

export const metadata: Metadata = {
  title: 'Add New Deliver Order Page',
  description: 'Add New Deliver Order Page',
};
