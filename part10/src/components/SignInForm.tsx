import { Formik } from 'formik';
import * as yup from 'yup';
import { StyleSheet, View } from 'react-native';

import { colors, spacing } from '../theme';
import AppButton from './AppButton';
import AppText from './AppText';
import FormikTextInput from './FormikTextInput';

export type SignInValues = {
  username: string;
  password: string;
};

type SignInFormProps = {
  onSubmit: (values: SignInValues) => void | Promise<void>;
  loading?: boolean;
  serverError?: string | null;
};

const validationSchema = yup.object({
  username: yup.string().required('Username is required'),
  password: yup.string().required('Password is required'),
});

const SignInForm = ({
  onSubmit,
  loading = false,
  serverError,
}: SignInFormProps) => (
  <Formik<SignInValues>
    initialValues={{ username: '', password: '' }}
    onSubmit={onSubmit}
    validationSchema={validationSchema}
  >
    {({ handleSubmit, isValid }) => (
      <View style={styles.form}>
        <FormikTextInput
          autoComplete="username"
          label="Username"
          name="username"
          placeholder="Your username"
          testID="username"
          textContentType="username"
        />
        <FormikTextInput
          autoComplete="current-password"
          label="Password"
          name="password"
          placeholder="Your password"
          secureTextEntry
          testID="password"
          textContentType="password"
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
          testID="sign-in-submit"
          title="Sign in"
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

export default SignInForm;
