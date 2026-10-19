import { Formik } from 'formik';
import * as yup from 'yup';
import { StyleSheet, View } from 'react-native';

import { colors, spacing } from '../theme';
import AppButton from './AppButton';
import AppText from './AppText';
import FormikTextInput from './FormikTextInput';

export type ReviewValues = {
  ownerName: string;
  repositoryName: string;
  rating: string;
  text: string;
};

type ReviewFormProps = {
  onSubmit: (values: ReviewValues) => void | Promise<void>;
  initialValues?: Partial<ReviewValues>;
  loading?: boolean;
  serverError?: string | null;
};

const validationSchema = yup.object({
  ownerName: yup
    .string()
    .trim()
    .required('Repository owner is required'),
  repositoryName: yup
    .string()
    .trim()
    .required('Repository name is required'),
  rating: yup
    .number()
    .typeError('Rating must be a number')
    .integer('Rating must be a whole number')
    .min(0, 'Rating must be at least 0')
    .max(100, 'Rating must be at most 100')
    .required('Rating is required'),
  text: yup.string().max(2000, 'Review must be at most 2000 characters'),
});

const ReviewForm = ({
  onSubmit,
  initialValues,
  loading = false,
  serverError,
}: ReviewFormProps) => (
  <Formik<ReviewValues>
    initialValues={{
      ownerName: initialValues?.ownerName ?? '',
      repositoryName: initialValues?.repositoryName ?? '',
      rating: initialValues?.rating ?? '',
      text: initialValues?.text ?? '',
    }}
    onSubmit={onSubmit}
    validationSchema={validationSchema}
  >
    {({ handleSubmit, isValid }) => (
      <View style={styles.form}>
        <FormikTextInput
          label="Repository owner"
          name="ownerName"
          placeholder="For example: jaredpalmer"
          testID="owner-name"
        />
        <FormikTextInput
          label="Repository name"
          name="repositoryName"
          placeholder="For example: formik"
          testID="repository-name"
        />
        <FormikTextInput
          keyboardType="number-pad"
          label="Rating (0–100)"
          name="rating"
          placeholder="80"
          testID="rating"
        />
        <FormikTextInput
          label="Review"
          multiline
          name="text"
          placeholder="Write your review"
          testID="review-text"
          style={styles.multiline}
          textAlignVertical="top"
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
          testID="create-review-submit"
          title="Create review"
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
  multiline: {
    minHeight: 112,
    paddingTop: spacing.md,
  },
});

export default ReviewForm;
