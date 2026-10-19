import { router, usePathname } from 'expo-router';
import { Alert, ScrollView, StyleSheet, View } from 'react-native';

import { useAuth } from '../contexts/AuthContext';
import { colors, spacing } from '../theme';
import AppText from './AppText';

const AppBar = () => {
  const { accessToken, signOut } = useAuth();
  const pathname = usePathname();

  const navigate = (path: '/' | '/sign-in' | '/sign-up' | '/my-reviews') => {
    router.push(path);
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      router.replace('/');
    } catch (error: unknown) {
      Alert.alert(
        'Unable to sign out',
        error instanceof Error ? error.message : 'Please try again.',
      );
    }
  };

  const tab = (title: string, path: '/' | '/sign-in' | '/sign-up' | '/my-reviews') => (
    <AppText
      accessibilityRole="link"
      accessibilityState={{ selected: pathname === path }}
      key={path}
      onPress={() => navigate(path)}
      style={[styles.tab, pathname === path && styles.activeTab]}
    >
      {title}
    </AppText>
  );

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.tabs}
        horizontal
        showsHorizontalScrollIndicator={false}
      >
        {tab('Repositories', '/')}
        {accessToken ? (
          tab('My reviews', '/my-reviews')
        ) : (
          <>
            {tab('Sign in', '/sign-in')}
            {tab('Sign up', '/sign-up')}
          </>
        )}
        {accessToken ? (
          <AppText
            accessibilityRole="button"
            onPress={() => void handleSignOut()}
            style={styles.tab}
          >
            Sign out
          </AppText>
        ) : null}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.primaryDark,
    minHeight: 54,
  },
  tabs: {
    alignItems: 'center',
    minHeight: 54,
    paddingHorizontal: spacing.sm,
  },
  tab: {
    color: '#e5efec',
    fontSize: 15,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  activeTab: {
    color: '#ffffff',
    fontWeight: '700',
  },
});

export default AppBar;
