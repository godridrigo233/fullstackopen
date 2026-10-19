import { Formik } from 'formik';
import * as yup from 'yup';
import { StyleSheet, View } from 'react-native';

import { colors, spacing } from '../theme';
import AppButton from './AppButton';
import AppText from './AppText';
import FormikTextInput from './FormikTextInput';

export type SignUpValues = {
  username: string;
  password: string;
  passwordConfirmation: string;
};

type SignUpFormProps = {
  onSubmit: (values: SignUpValues) => void | Promise<void>;
  loading?: boolean;
  serverError?: string | null;
};

const validationSchema = yup.object({
  username: yup
    .string()
    .required('Username is required')
    .min(1, 'Username must be at least 1 character')
    .max(30, 'Username must be at most 30 characters'),
  password: yup
    .string()
    .required('Password is required')
    .min(5, 'Password must be at least 5 characters')
    .max(50, 'Password must be at most 50 characters'),
  passwordConfirmation: yup
    .string()
    .required('Password confirmation is required')
    .oneOf([yup.ref('password')], 'Passwords must match'),
});

const SignUpForm = ({
  onSubmit,
  loading = false,
  serverError,
}: SignUpFormProps) => (
  <Formik<SignUpValues>
    initialValues={{ username: '', password: '', passwordConfirmation: '' }}
    onSubmit={onSubmit}
    validationSchema={validationSchema}
  >
    {({ handleSubmit, isValid }) => (
      <View style={styles.form}>
        <FormikTextInput
          label="Username"
          name="username"
          placeholder="Choose a username"
          testID="username"
        />
        <FormikTextInput
          label="Password"
          name="password"
          placeholder="Choose a password"
          secureTextEntry
          testID="password"
        />
        <FormikTextInput
          label="Confirm password"
          name="passwordConfirmation"
          placeholder="Confirm your password"
          secureTextEntry
          testID="password-confirmation"
        />
        {serverError ? (
          <AppText accessibilityRole="alert" style={styles.error}>
            {serverError}
          </AppText>
        ) : null}
        <AppButton
          disabled={!isValid}
          loading={loading}
          onPress={() => handleSubmit()}
          testID="sign-up-submit"
          title="Create account"
        />
      </View>
    )}
  </Formik>
);

const styles = StyleSheet.create({
  form: {
    backgroundColor: colors.surface,
    borderRadius: 8,
    padding: spacing.md,
  },
  error: {
    color: colors.error,
    marginBottom: spacing.md,
  },
});

export default SignUpForm;
