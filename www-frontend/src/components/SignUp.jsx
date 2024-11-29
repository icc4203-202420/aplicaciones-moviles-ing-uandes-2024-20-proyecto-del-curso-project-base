import React from 'react';
import * as yup from 'yup';
import axiosInstance from '../api/axios';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { Link } from 'react-router-dom';
import CustomInput from '../assets/Button'

import './Form.css'
import './SignUp.css'

  const waveBack = (
    <svg className='bg-back' id='signup-wave-back' xmlns="http://www.w3.org/2000/svg" width="390" height="744" viewBox="0 0 390 744" fill="none" preserveAspectRatio='none'>
      <path d="M0 24.3354C0 24.3354 21.1986 14.1689 45.5 6.97812C59.4521 2.84969 74.4269 -0.29789 87 0.0224434C127.346 1.05037 147.164 37.131 187.5 38.9232C226.328 40.6485 246.678 9.29526 285.5 11.3685C307 12.5167 318.555 27.0809 340 24.3354C360.323 21.7336 390 0.0224434 390 0.0224434V744H0V24.3354Z" fill="#EDB854"/>
    </svg>
  )

  const waveFront = (
    <svg className='bg-back' id='signup-wave-front' xmlns="http://www.w3.org/2000/svg" width="390" height="744" viewBox="0 -40 390 744" fill="none" preserveAspectRatio='none'>
      <path d="M0 24.3354C0 24.3354 21.1986 14.1689 45.5 6.97812C59.4521 2.84969 74.4269 -0.29789 87 0.0224434C127.346 1.05037 147.164 37.131 187.5 38.9232C226.328 40.6485 246.678 9.29526 285.5 11.3685C307 12.5167 318.555 27.0809 340 24.3354C360.323 21.7336 390 0.0224434 390 0.0224434V744H0V24.3354Z" fill="#C58100"/>
    </svg>
  )

const validationSchema = yup.object({
    //REQUERIDOS
    first_name: yup.string().required('* First name is required'),
    last_name: yup.string().required('* Last name is required'),
    email: yup.string().email('Invalid email').required('* Email is required'),
    handle: yup.string().required('* Handle is required'),
    password: yup.string().min(6, 'Password too short').required('* Password is required'),
    password_confirmation: yup.string().oneOf([yup.ref('password'), null], 'Passwords must match').required('* Password is rquired'),
    //OPCIONALES
    line1: yup.string(),
    line2: yup.string(),
    city: yup.string(),
});

const initialValues = {
    first_name: '',
    last_name: '',
    email: '',
    handle: '',
    password: '',
    password_confirmation: '',
    line1: '',
    line2: '',
    city: ''
};

function SignUp({ signUpHandler }) {

    return(
        <>  
            <div className='form-title' id='signup-title'>Tapp</div>
            <div className='form-container' id='signup-container'>
                <div className='form-header' id='signup-header'>
                    Sign Up
                </div>
                <div id='signup-body'>
                  Tell us more about you <br />
                  Put yor profile information down below
                </div>
                <div className="form-content" id='signup-form-content'>
                    <Formik
                        initialValues={initialValues}
                        validationSchema={validationSchema}
                        onSubmit={(values, {validateForm}) => {
                            validateForm().then(errors => {
                                if(Object.keys(errors).length) {
                                    alert("Please fill out all required fields")
                                } else {
                                    axiosInstance.post('/signup', {"user": values})
                                    .then((res) => {
                                        console.log(res);
                                        alert("User created successfully")
                                        signUpHandler();
                                    })
                                    .catch((error) => {
                                        console.error(error);
                                    })
                                }

                            }) 
                        }}
                    >
                        {({ isSubmitting }) => (
                            <Form className='form-fields' id='signup-fields'>
                                <div className="form-input-fields" id='signup-input-fields'>
                                        <Field className='login-form-field' id="signup-first_name" name="first_name" placeholder='First Name *' as={CustomInput} />
                                        <ErrorMessage className='signup-error-message' name="first_name" component="div" />

                                        <Field className='login-form-field' id="signup-last_name" name="last_name" placeholder='Last Name *' as={CustomInput} />
                                        <ErrorMessage className='signup-error-message' name="last_name" component="div" />

                                        <Field className='login-form-field' id="signup-email" name="email" type="email" placeholder='Email *' as={CustomInput} />
                                        <ErrorMessage className='signup-error-message' name="email" component="div" />

                                        <Field className='login-form-field' id="signup-handle" name="handle" placeholder='@handle *' as={CustomInput} />
                                        <ErrorMessage className='signup-error-message' name="handle" component="div" />

                                        <Field className='login-form-field' id="signup-password" name="password" type="password" placeholder='Password *' as={CustomInput} />
                                        <ErrorMessage className='signup-error-message' name="password" component="div" />

                                        <Field className='login-form-field' id="signup-password_confirmation" name="password_confirmation" type="password" placeholder='Confirm Password *' as={CustomInput} />
                                        <ErrorMessage className='signup-error-message' name="password_confirmation" component="div" />

                                        <Field className='login-form-field' id="signup-line1" name="line1" placeholder='Address ine 1' as={CustomInput} />
                                        <ErrorMessage className='signup-error-message' name="line1" component="div" />

                                        <Field className='login-form-field' id="signup-line2" name="line2" placeholder='Address ine 2' as={CustomInput} />
                                        <ErrorMessage className='signup-error-message' name="line2" component="div" />

                                        <Field className='login-form-field' id="signup-city" name="city" placeholder='City' as={CustomInput} />
                                        <ErrorMessage className='signup-error-message' name="city" component="div" />
                                </div>

                                <button className='form-submit-button' id='signup-submit-button' type="submit" disabled={isSubmitting}>
                                    Sign Up
                                </button>
                            </Form>
                        )}
                    </Formik>
                </div>
                <div className="form-redirect" id='login-redirect'>
                    Already have an account? <Link className='form-redirect-link' onClick={signUpHandler} >Log in</Link>
                </div>
            </div>
            <svg className='form-bg' id='signup-bg' viewBox='0 0 390 744' preserveAspectRatio='none'>
                {waveBack}
                {waveFront}
            </svg>
        </>
    );
}

export default SignUp;