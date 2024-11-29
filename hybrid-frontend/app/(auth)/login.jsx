import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ActivityIndicator, TouchableWithoutFeedback, Keyboard } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useRouter } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import { Formik } from 'formik';
import * as yup from 'yup';
import { API_URL } from '@env';

const api = API_URL;

// Validation schema using Yup
const loginValidationSchema = yup.object().shape({
  email: yup
    .string()
    .email('Please enter a valid email')
    .required('Email is required'),
  password: yup
    .string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
});

export default function Login() {
  const { login } = useAuth();
  const router = useRouter();

  // Handler for signup navigation
  const handleSignup = () => {
    router.push('/signup');
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        {/* Background Waves */}
        <Svg
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
        </Svg>

        {/* Formik Form */}
        <Formik
          initialValues={{ email: '', password: '' }}
          validationSchema={loginValidationSchema}
          onSubmit={(values, { setSubmitting }) => {
            console.log('API URL:', api);
            fetch(`${api}/login`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
              },
              body: JSON.stringify({
                user: {
                  email: values.email,
                  password: values.password,
                },
              }),
            })
              .then(async (response) => {
                const text = await response.text();
                console.log('Response text:', text);

                if (!response.ok) {
                  throw new Error(`HTTP Error: ${response.status} - ${text}`);
                }

                try {
                  const data = JSON.parse(text);
                  return { data, headers: response.headers, status: response.status };
                } catch (error) {
                  throw new Error(`Error parsing JSON: ${error.message}`);
                }
              })
              .then(({ data, headers }) => {
                const token = headers.get('authorization');
                const user = data?.status?.data?.user;

                if (token && user) {
                  login(token, user);
                } else {
                  console.error('Token or user data missing in response:', data);
                }

                setSubmitting(false);
              })
              .catch((error) => {
                console.error('Error:', error.message);
                setSubmitting(false);
              });
          }}
        >
          {({ handleChange, handleBlur, handleSubmit, values, errors, touched, isSubmitting }) => (
            <View style={styles.formContainer}>
              <Text style={styles.loginText}>LOGIN</Text>

              <TextInput
                name="email"
                placeholder="Email"
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
                name="password"
                placeholder="Password"
                style={styles.input}
                onChangeText={handleChange('password')}
                onBlur={handleBlur('password')}
                value={values.password}
                secureTextEntry
              />
              {touched.password && errors.password && (
                <Text style={styles.errorText}>{errors.password}</Text>
              )}

              {isSubmitting ? (
                <ActivityIndicator size="large" color="#C58100" />
              ) : (
                <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                  <Text style={styles.buttonText}>Login</Text>
                </TouchableOpacity>
              )}

              <TouchableOpacity style={styles.signupButton} onPress={handleSignup}>
                <Text style={styles.signupText}>Signup</Text>
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
    backgroundColor: '#fff',
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
  loginText: {
    fontSize: 32,
    fontWeight: 'bold',
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
  signupButton: {
    marginTop: 15,
  },
  signupText: {
    color: '#EDB854',
    fontSize: 16,
  },
});