import { ActivityIndicator, Pressable, StyleSheet, ViewStyle } from 'react-native';

import AppText from './AppText';
import { colors, spacing } from '../theme';

type AppButtonProps = {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  secondary?: boolean;
  testID?: string;
  style?: ViewStyle;
};

const AppButton = ({
  title,
  onPress,
  disabled = false,
  loading = false,
  secondary = false,
  testID,
  style,
}: AppButtonProps) => (
  <Pressable
    accessibilityRole="button"
    accessibilityState={{ disabled: disabled || loading }}
    disabled={disabled || loading}
    onPress={onPress}
    testID={testID}
    style={[
      styles.button,
      secondary && styles.secondary,
      (disabled || loading) && styles.disabled,
      style,
    ]}
  >
    {loading ? (
      <ActivityIndicator color={secondary ? colors.primary : '#ffffff'} />
    ) : (
      <AppText bold style={[styles.label, secondary && styles.secondaryLabel]}>
        {title}
      </AppText>
    )}
  </Pressable>
);

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: 6,
    justifyContent: 'center',
    minHeight: 44,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  secondary: {
    backgroundColor: '#e5f0ed',
    borderColor: colors.primary,
    borderWidth: 1,
  },
  disabled: {
    opacity: 0.55,
  },
  label: {
    color: '#ffffff',
    fontSize: 15,
  },
  secondaryLabel: {
    color: colors.primaryDark,
  },
});

export default AppButton;
