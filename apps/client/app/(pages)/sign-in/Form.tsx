'use client';
import TextField from '../../components/UI/TextField';
import Button from '../../components/UI/Button';
import { useFormik } from 'formik';
import { useEffect, useRef, useTransition } from 'react';
import Link from 'next/link';
import APP_ROUTER from '../../lib/config/router';
import { SignInFormData } from '@repo/shared';
import { signIn } from '../../actions/userApi';
import { useRouter } from 'next/navigation';
import { saveToken } from '../../actions/tokens';
import { toast } from 'react-toastify';
import { signInValidation } from '../../lib/validation/userValidation';

export default function Form(): JSX.Element {
  const firstTextFieldRef = useRef<HTMLInputElement>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validateOnBlur: false,
    validationSchema: signInValidation,
    onSubmit: (values: SignInFormData, { resetForm }) => {
      startTransition(async () => {
        const res = await signIn(values);
        if (!res.success) {
          toast.error(res.message);
          resetForm();
          return;
        }

        if (res.data) {
          toast.success('You have successfully signed in');
          await saveToken(res.data.token, res.data.maxAge);
          router.back();
        }
      });
    },
  });

  const { handleSubmit, handleBlur, handleChange, values, errors, touched } =
    formik;

  useEffect(() => {
    firstTextFieldRef.current?.focus();

    return () => {
      firstTextFieldRef.current?.blur();
    };
  }, []);
  return (
    <form onSubmit={handleSubmit} className='sign-in-form'>
      <h2>Sign in </h2>
      <TextField
        label='Email'
        required
        autoFocus
        value={values.email}
        name='email'
        ref={firstTextFieldRef}
        onChange={handleChange}
        placeholder='Please enter your email'
        error={Boolean(errors.email && touched.email)}
        onBlur={handleBlur}
        message={touched.email && errors.email ? errors.email : ''}
      />
      <TextField
        label='Password'
        type='password'
        required
        value={values.password}
        name='password'
        placeholder='Please enter your password'
        onChange={handleChange}
        error={Boolean(errors.password && touched.password)}
        onBlur={handleBlur}
        message={touched.password && errors.password ? errors.password : ''}
      />

      <article>
        <p>
          Don't you have account? <Link href={APP_ROUTER.SIGN_UP}>Sign up</Link>
        </p>
      </article>
      <Button fullWidth variant='green' type='submit' loading={isPending}>
        Sign in
      </Button>
    </form>
  );
}
