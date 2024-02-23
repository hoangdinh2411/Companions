import { User } from "@repo/shared";

export default function Page(): JSX.Element {
  const user:User ={
    id: 1,
    name: 'John Doe',
    email: '',
    password: ''
  }
  return <main>{user.name}</main>;
}
