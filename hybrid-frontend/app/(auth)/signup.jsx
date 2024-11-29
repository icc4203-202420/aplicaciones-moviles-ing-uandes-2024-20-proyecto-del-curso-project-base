import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ActivityIndicator, TouchableWithoutFeedback, Keyboard } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useRouter } from 'expo-router';
import { Formik } from 'formik';
import * as yup from 'yup';
import {API_URL} from '@env';

const api = API_URL;

// Esquema de validación con Yup
const signUpValidationSchema = yup.object({
  first_name: yup.string().required('* First name is required'),
  last_name: yup.string().required('* Last name is required'),
  email: yup.string().email('Invalid email').required('* Email is required'),
  handle: yup.string().min(3, 'Handle too short').required('* Handle is required'),
  password: yup.string().min(6, 'Password too short').required('* Password is required'),
  password_confirmation: yup.string().oneOf([yup.ref('password'), null], 'Passwords must match').required('* Password confirmation is required'),
});

export default function Signup() {

  const router = useRouter();

  const handleLogin = () => {
    router.replace('/login');
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        {/* Background Waves */}
        {/* <Svg
          style={styles.waveBack}
          viewBox="0 -100 390 588"
          preserveAspectRatio="none"
        >
          <Path 
            d='M0 19.2328C0 19.2328 21.1986 11.198 45.5 5.51497C59.4521 2.25218 74.4269 -0.235429 87 0.0177375C127.346 0.830135 147.164 29.3455 187.5 30.7619C226.328 32.1254 246.678 7.34625 285.5 8.98479C307 9.89223 318.555 21.4027 340 19.2328C360.323 17.1765 390 0.0177375 390 0.0177375V588H0V19.2328Z'
            fill='#EDB854'
          />
        </Svg>
        <Svg
          style={styles.waveFront}
          viewBox="0 -140 390 588"
          preserveAspectRatio="none"
        >
          <Path
            d='M0 18.1862C0 18.1862 21.1986 10.5886 45.5 5.21483C59.4521 2.12961 74.4269 -0.222617 87 0.0167722C127.346 0.784957 147.164 27.7484 187.5 29.0878C226.328 30.3771 246.678 6.94646 285.5 8.49582C307 9.35387 318.555 20.2379 340 18.1862C360.323 16.2418 390 0.0167722 390 0.0167722V556H0V18.1862Z'
            fill='#C58100'
          />
        </Svg> */}

        {/* Formik Form */}
        <Formik
          initialValues={{
            first_name: '',
            last_name: '',
            email: '',
            handle: '',
            password: '',
            password_confirmation: '',
          }}
          validationSchema={signUpValidationSchema}
          onSubmit={(values, { setSubmitting }) => {
            fetch(`${api}/signup`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ user: values }),
            })
            .then(response => response.json())
            .then(data => {
              setSubmitting(false);
              router.replace('/login');
            })
            .catch(error => {
              console.error('Error:', error);
              setSubmitting(false);
            });
          }}
        >
          {({ handleChange, handleBlur, handleSubmit, values, errors, touched, isSubmitting }) => (
            <View style={styles.formContainer}>
              <Text style={styles.formTitle}>Tapp</Text>
              <Text style={styles.formHeader}>Sign Up</Text>
              <Text style={styles.formBody}>Tell us more about you. Put your profile information down below:</Text>

              <TextInput
                name="first_name"
                placeholder="First Name *"
                style={styles.input}
                onChangeText={handleChange('first_name')}
                onBlur={handleBlur('first_name')}
                value={values.first_name}
              />
              {touched.first_name && errors.first_name && (
                <Text style={styles.errorText}>{errors.first_name}</Text>
              )}

              <TextInput
                name="last_name"
                placeholder="Last Name *"
                style={styles.input}
                onChangeText={handleChange('last_name')}
                onBlur={handleBlur('last_name')}
                value={values.last_name}
              />
              {touched.last_name && errors.last_name && (
                <Text style={styles.errorText}>{errors.last_name}</Text>
              )}

              <TextInput
                name="email"
                placeholder="Email *"
                style={styles.input}
                onChangeText={handleChange('email')}
                onBlur={handleBlur('email')}
                value={values.email}
                keyboardType="email-address"
              />
              {touched.email && errors.email && (
                <Text style={styles.errorText}>{errors.email}</Text>
              )}

              <TextInput
                name="handle"
                placeholder="@handle *"
                style={styles.input}
                onChangeText={handleChange('handle')}
                onBlur={handleBlur('handle')}
                value={values.handle}
              />
              {touched.handle && errors.handle && (
                <Text style={styles.errorText}>{errors.handle}</Text>
              )}

              <TextInput
                name="password"
                placeholder="Password *"
                style={styles.input}
                onChangeText={handleChange('password')}
                onBlur={handleBlur('password')}
                value={values.password}
                secureTextEntry
              />
              {touched.password && errors.password && (
                <Text style={styles.errorText}>{errors.password}</Text>
              )}

              <TextInput
                name="password_confirmation"
                placeholder="Confirm Password *"
                style={styles.input}
                onChangeText={handleChange('password_confirmation')}
                onBlur={handleBlur('password_confirmation')}
                value={values.password_confirmation}
                secureTextEntry
              />
              {touched.password_confirmation && errors.password_confirmation && (
                <Text style={styles.errorText}>{errors.password_confirmation}</Text>
              )}


              {isSubmitting ? (
                <ActivityIndicator size="large" color="#C58100" />
              ) : (
                <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                  <Text style={styles.buttonText}>Sign Up</Text>
                </TouchableOpacity>
              )}

              <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
                <Text style={styles.loginButtonText}>Log In</Text>
              </TouchableOpacity>
            </View>
          )}
        </Formik>

        <StatusBar style="auto" />
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EDB854',
    alignItems: 'center',
    justifyContent: 'center',
  },
  waveBack: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    zIndex: -2,
  },
  waveFront: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    zIndex: -1,
  },
  formTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#564c3d',
    marginBottom: 20,
  },
  formHeader: {
    fontSize: 24,
    color: '#564c3d',
    marginBottom: 10,
  },
  formBody: {
    fontSize: 16,
    color: '#564c3d',
    marginBottom: 20,
  },
  formContainer: {
    width: '85%',
    alignItems: 'center',
  },
  input: {
    width: '100%',
    height: 50,
    borderColor: '#C58100',
    borderWidth: 1.5,
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 15,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 2,
  },
  errorText: {
    fontSize: 14,
    color: 'red',
    marginBottom: 10,
    textAlign: 'left',
    width: '100%',
  },
  button: {
    backgroundColor: '#C58100',
    width: '100%',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 2,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  },
  loginButton: {
    marginTop: 15,
  },
  loginButtonText: {
    color: '#C58100',
    fontSize: 16,
  },
});
