import { User } from '@repo/shared';

export default function Page(): JSX.Element {
  const user: User = {
    id: 1,
    name: 'John Doe',
    email: '',
    password: '',
  };
  return <h1 className='icon'>{user.name}</h1>;
}
