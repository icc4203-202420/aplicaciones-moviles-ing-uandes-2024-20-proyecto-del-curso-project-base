import React from 'react';
import * as yup from 'yup';
import axiosInstance from '../api/axios';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { useNavigate, Link } from 'react-router-dom';

import './Form.css'
import './Login.css'
import CustomInput from '../assets/Button'
import { useEffect, useState } from 'react';


const waveBack = (
  <svg className='bg-back' id='login-wave-back' xmlns="http://www.w3.org/2000/svg" width="390" height="588" viewBox="0 0 390 588" preserveAspectRatio='none'>
    <path d="M0 19.2328C0 19.2328 21.1986 11.198 45.5 5.51497C59.4521 2.25218 74.4269 -0.235429 87 0.0177375C127.346 0.830135 147.164 29.3455 187.5 30.7619C226.328 32.1254 246.678 7.34625 285.5 8.98479C307 9.89223 318.555 21.4027 340 19.2328C360.323 17.1765 390 0.0177375 390 0.0177375V588H0V19.2328Z" fill="#EDB854"/>
  </svg>
)

const waveFront = (
  <svg className='bg-front' id='login-wave-front' xmlns="http://www.w3.org/2000/svg" width="390" height="588" viewBox="0 -40 390 588" preserveAspectRatio='none'>
    <path d="M0 18.1862C0 18.1862 21.1986 10.5886 45.5 5.21483C59.4521 2.12961 74.4269 -0.222617 87 0.0167722C127.346 0.784957 147.164 27.7484 187.5 29.0878C226.328 30.3771 246.678 6.94646 285.5 8.49582C307 9.35387 318.555 20.2379 340 18.1862C360.323 16.2418 390 0.0167722 390 0.0167722V556H0V18.1862Z" fill="#C58100"/>
  </svg>
)

const validationSchema = yup.object({
    //REQUERIDOS
    email: yup.string().email('Invalid email').required('* Email is required'),
    password: yup.string().min(6, 'Password too short').required('* Password is required'),
});

const initialValues = {
    email: '',
    password: '',
};

function Login({ signUpHandler, tokenHandler, currentUserHandler }) {
  const navigation = useNavigate();
  
  return(
    <>
      <div className='form-title' id='login-title'>Tapp</div>
      <div className='form-container' id='login-container'>
        <div className='form-header' id='login-header'>
          LOGIN
        </div>
        <div className="form-content" id='login-form-content'>
          <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={(values, {validateForm}) => {
                  validateForm().then(errors => {
                      if(Object.keys(errors).length) {
                          alert("Please fill out all required fields")
                      } else {
                        axiosInstance.post('/login', {"user": values})
                        .then((res) => {
                          tokenHandler(res.headers.authorization);
                          console.log(res.data.status.data.user);
                          const currentUser = res.data.status.data.user;
                          console.log(currentUser);
                          currentUserHandler(currentUser);
                          navigation('/');
                        })
                        .catch((error) => {
                          console.error(error);
                          if (err.response && err.response.status === 401) {
                            setServerError('Invalid email or password.');
                          } else {
                            setServerError('Server error. Try again later.');
                          }
                          console.error('Form submition error:', err);
                          navigation('/login');
                        })
                      }
                  }) 
              }}
          >
              {({ isSubmitting }) => (
                  <Form className='form-fields' id='login-fields'>
                      <div className='form-input-fields' id='login-input-fields'>
                        <Field className='form-field login-form-field' id="login-email-button" name="email" type='text' placeholder='* Email' as={CustomInput} />
                        <ErrorMessage className='form-error-message login-error-message' name="email" component="div" />

                        <Field className='form-field login-form-field' id="login-password-button" name="password" type="password" placeholder='* Password' as={CustomInput} />
                        <ErrorMessage className='form-error-message login-error-message' name="password" component="div" />
                      </div>
                      <br />
                      <button className='form-submit-button' id='login-submit-button' type="submit" disabled={isSubmitting}>
                          Log in
                      </button>
                  </Form>
              )}
          </Formik>
        </div>
        <div className="form-redirect" id='signup-redirect'>
          Don't have an account? <Link className='form-redirect-link' onClick={signUpHandler} >Sign up</Link>
        </div>
      </div>
      <svg className='form-bg' id='login-bg' viewBox='0 0 390 588' preserveAspectRatio='none'>
        {waveBack}
        {waveFront}
      </svg>
    </>
  );
}

export default Login;