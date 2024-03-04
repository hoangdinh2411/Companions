'use client';
import TextField from '../../../components/UI/TextField';
import Button from '../../../components/UI/Button';
import { useFormik } from 'formik';
import { useEffect, useRef, useTransition } from 'react';
import APP_ROUTER from '../../../lib/config/router';
import Link from 'next/link';
import { SignUpFormData, signUpValidation } from '@repo/shared';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { signUp } from '../../../actions/userApi';

export default function Form(): JSX.Element {
  const firstTextFieldRef = useRef<HTMLInputElement>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
      confirm_password: '',
    },
    validationSchema: signUpValidation,
    validateOnBlur: false,
    onSubmit: (values: SignUpFormData, { resetForm }) => {
      startTransition(async () => {
        const res = await signUp(values);
        if (!res.success) {
          toast.error(res.message);
          resetForm();
          return;
        }
        toast.success('You have successfully signed up');
        router.push(APP_ROUTER.SIGN_IN);
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
    <form onSubmit={handleSubmit} autoComplete='off' className='sign-up-form'>
      <h2>Sign up </h2>
      <TextField
        label='Email'
        required
        autoFocus
        value={values.email}
        name='email'
        ref={firstTextFieldRef}
        onChange={handleChange}
        placeholder='Please enter email'
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
        placeholder='Please enter password'
        onChange={handleChange}
        error={Boolean(errors.password && touched.password)}
        onBlur={handleBlur}
        message={touched.password && errors.password ? errors.password : ''}
      />
      <TextField
        label='Confirm Password'
        type='password'
        required
        value={values.confirm_password}
        name='confirm_password'
        placeholder='Please enter password again'
        onChange={handleChange}
        error={Boolean(errors.confirm_password && touched.confirm_password)}
        onBlur={handleBlur}
        message={
          touched.confirm_password && errors.confirm_password
            ? errors.confirm_password
            : ''
        }
      />
      <article>
        <p>
          Have you ready account? <Link href={APP_ROUTER.SIGN_IN}>Sign In</Link>
        </p>
      </article>
      <Button fullWidth variant='green' type='submit' loading={isPending}>
        Sign in
      </Button>
    </form>
  );
}
