import { useField } from 'formik';
import {
  StyleSheet,
  TextInput,
  TextInputProps,
  View,
} from 'react-native';

import AppText from './AppText';
import { colors, spacing } from '../theme';

type FormikTextInputProps = TextInputProps & {
  name: string;
  label: string;
  testID: string;
};

const FormikTextInput = ({
  name,
  label,
  testID,
  ...props
}: FormikTextInputProps) => {
  const [field, meta, helpers] = useField<string>(name);

  return (
    <View style={styles.field}>
      <AppText bold style={styles.label}>
        {label}
      </AppText>
      <TextInput
        accessibilityLabel={label}
        autoCapitalize="none"
        onBlur={() => helpers.setTouched(true)}
        onChangeText={field.onChange(name)}
        testID={testID}
        value={field.value}
        {...props}
        style={[styles.input, meta.touched && meta.error ? styles.invalid : null, props.style]}
      />
      {meta.touched && meta.error ? (
        <AppText accessibilityRole="alert" style={styles.error}>
          {meta.error}
        </AppText>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  field: {
    marginBottom: spacing.md,
  },
  label: {
    fontSize: 14,
    marginBottom: spacing.xs,
  },
  input: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 6,
    borderWidth: 1,
    color: colors.text,
    fontSize: 16,
    minHeight: 46,
    paddingHorizontal: spacing.md,
  },
  invalid: {
    borderColor: colors.error,
  },
  error: {
    color: colors.error,
    marginTop: spacing.xs,
  },
});

export default FormikTextInput;
