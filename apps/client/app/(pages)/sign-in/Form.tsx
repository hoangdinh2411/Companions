'use client';
import TextField from '../../components/UI/TextField';
import Button from '../../components/UI/Button';
import { useFormik } from 'formik';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import APP_ROUTER from '../../lib/config/router';
import { signInValidation } from '@repo/shared';

export default function Form(): JSX.Element {
  const firstTextFieldRef = useRef<HTMLInputElement>(null);

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: signInValidation,
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
      <Button fullWidth variant='green' type='submit'>
        Sign in
      </Button>
    </form>
  );
}
