import React from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
export default function ToastProvider() {
  return (
    <ToastContainer
      position='top-center'
      limit={2}
      autoClose={3000}
      hideProgressBar
      closeButton={false}
      newestOnTop
      pauseOnFocusLoss={false}
      pauseOnHover={false}
    />
  );
}
