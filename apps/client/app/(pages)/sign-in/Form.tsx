'use client';
import TextField from '../../components/UI/TextField';
import Button from '../../components/UI/Button';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import APP_ROUTER from '../../lib/config/router';

const validationSchema = Yup.object().shape({
  account: Yup.string().required('Required email or phone number'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .max(20, 'Password must be at most 20 characters')
    .required('Required password'),
});
export default function Form(): JSX.Element {
  const firstTextFieldRef = useRef<HTMLInputElement>(null);

  const formik = useFormik({
    initialValues: {
      account: '',
      password: '',
    },
    validationSchema,
    onSubmit: (values) => {
      console.log(values);
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
    <form onSubmit={handleSubmit} autoComplete='off'>
      <h2>Sign in </h2>
      <TextField
        label='Email / Phone'
        required
        autoFocus
        value={values.account}
        name='text'
        ref={firstTextFieldRef}
        onChange={handleChange}
        placeholder='Please enter your email or phone number'
        error={Boolean(errors.account && touched.account)}
        onBlur={handleBlur}
        message={touched.account && errors.account ? errors.account : ''}
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
      <Button fullWidth variant='green' type='submit'>
        Sign in
      </Button>
    </form>
  );
}
