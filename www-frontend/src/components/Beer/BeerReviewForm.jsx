// import React from "react";
// import { Formik, Form, Field } from "formik";
// import * as Yup from "yup";
// import { TextField, Button, Dialog, DialogActions, DialogContent, DialogTitle, Slider} from "@mui/material";

// const reviewValidation = Yup.object({
//   rating: Yup.number()
//     .required("Rating is required to submit your review")
//     .min(1, "Please provide a rating between 1 and 5")
//     .max(5, "Please provide a rating between 1 and 5"),
//   text: Yup.string()
//     .required("Please add a review to share your thoughts")
//     .min(15, "Your review must be at least 15 characters long")
//     .max(255, "Your review cannot exceed 255 characters"),
// });

// const initialValues = {
//   text: '',
//   rating: '',
// };

// const BeerReviewForm = ({ beer, open, onClose, onSubmit }) => {
//   return (
//     <Dialog open={open} onClose={onClose}>
//       <DialogTitle>{beer.name} Review</DialogTitle>
//       <Formik
//         initialValues={initialValues}
//         validationSchema={reviewValidation}
//         onSubmit={(values) => {
//           onSubmit(values);
//           onClose();
//         }}
//       >
//         {({ errors, touched, isSubmitting }) => (
//           <Form>
//             <DialogContent>
//               <Field
//                 as={TextField}
//                 fullWidth
//                 id="text"
//                 name="text"
//                 label="Review"
//                 type="text"
//                 error={touched.text && Boolean(errors.text)}
//                 helperText={touched.text && errors.text}
//               />
//               <div style={{ marginTop: '20px', marginBottom: '10px' }}>
//                 <label htmlFor="rating">Rating</label>
//                 <Field name="rating">
//                   {({ field, form }) => (
//                     <Slider
//                       {...field}
//                       value={form.values.rating}
//                       onChange={(_, value) => form.setFieldValue('rating', value)}
//                       aria-labelledby="rating"
//                       valueLabelDisplay="auto"
//                       step={0.1}
//                       marks
//                       min={1}
//                       max={5}
//                     />
//                   )}
//                 </Field>
//                 {touched.rating && errors.rating && (
//                   <div style={{ color: 'red', fontSize: '12px' }}>{errors.rating}</div>
//                 )}
//               </div>
//             </DialogContent>
//             <DialogActions>
//               <Button onClick={onClose} color="primary">
//                 Cancel
//               </Button>
//               <Button type="submit" color="primary" disabled={isSubmitting}>
//                 Submit
//               </Button>
//             </DialogActions>
//           </Form>
//         )}
//       </Formik>
//     </Dialog>
//   );
// };

// export default BeerReviewForm;


import React from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { TextField, Button, Dialog, DialogActions, DialogContent, DialogTitle, Slider } from '@mui/material';

const reviewValidation = Yup.object({
  rating: Yup.number()
    .required('Rating is required to submit your review')
    .min(1, 'Please provide a rating between 1 and 5')
    .max(5, 'Please provide a rating between 1 and 5'),
  text: Yup.string()
    .required('Please add a review to share your thoughts')
    .min(15, 'Your review must be at least 15 characters long')
    .max(255, 'Your review cannot exceed 255 characters'),
});

const initialValues = {
  text: '',
  rating: '',
};

const BeerReviewForm = ({ beer, open, onClose, onSuccess }) => {
  const handleReviewSubmit = async (values, { setSubmitting, setErrors }) => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      console.error('User is not authenticated');
      // Maneja la falta de autenticación, como redirigir al usuario o mostrar un mensaje
      setErrors({ text: 'User is not authenticated' });
      setSubmitting(false);
      return;
    }

    try {
      await axios.post(
        `http://localhost:3001/api/v1/beers/${beer.id}/reviews`,
        {
          review: {
            rating: values.rating,
            text: values.text
          }
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      onSuccess(); // Llama a onSuccess si la revisión se envía correctamente
      onClose(); // Cierra el formulario después de enviar
    } catch (error) {
      console.error('Error submitting review:', error);
      setErrors({ text: 'Error submitting review. Please try again.' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{beer.name} Review</DialogTitle>
      <Formik
        initialValues={initialValues}
        validationSchema={reviewValidation}
        onSubmit={handleReviewSubmit}
      >
        {({ errors, touched, isSubmitting }) => (
          <Form>
            <DialogContent>
              <Field
                as={TextField}
                fullWidth
                id="text"
                name="text"
                label="Review"
                type="text"
                error={touched.text && Boolean(errors.text)}
                helperText={touched.text && errors.text}
              />
              <div style={{ marginTop: '20px', marginBottom: '10px' }}>
                <label htmlFor="rating">Rating</label>
                <Field name="rating">
                  {({ field, form }) => (
                    <Slider
                      {...field}
                      value={form.values.rating}
                      onChange={(_, value) => form.setFieldValue('rating', value)}
                      aria-labelledby="rating"
                      valueLabelDisplay="auto"
                      step={0.1}
                      marks
                      min={1}
                      max={5}
                    />
                  )}
                </Field>
                {touched.rating && errors.rating && (
                  <div style={{ color: 'red', fontSize: '12px' }}>{errors.rating}</div>
                )}
              </div>
            </DialogContent>
            <DialogActions>
              <Button onClick={onClose} color="primary">
                Cancel
              </Button>
              <Button type="submit" color="primary" disabled={isSubmitting}>
                Submit
              </Button>
            </DialogActions>
          </Form>
        )}
      </Formik>
    </Dialog>
  );
};

export default BeerReviewForm;

