import { ApolloProvider } from '@apollo/client/react';
import { Ubuntu_400Regular, Ubuntu_700Bold } from '@expo-google-fonts/ubuntu';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { AuthProvider, useAuth } from '../contexts/AuthContext';
import { apolloClient } from '../graphql/client';
import { colors } from '../theme';

const AppNavigator = () => {
  const { isLoading, storageError } = useAuth();

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }

  if (storageError) {
    return (
      <View style={styles.center}>
        <Text>Unable to restore your saved session: {storageError}</Text>
      </View>
    );
  }

  return <Stack screenOptions={{ headerShown: false }} />;
};

const RootLayout = () => {
  const [fontsLoaded, fontError] = useFonts({
    Ubuntu_400Regular,
    Ubuntu_700Bold,
  });

  if (fontError) {
    return (
      <View style={styles.center}>
        <Text>Unable to load the application fonts: {fontError.message}</Text>
      </View>
    );
  }

  if (!fontsLoaded) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }

  return (
    <ApolloProvider client={apolloClient}>
      <AuthProvider>
        <AppNavigator />
      </AuthProvider>
    </ApolloProvider>
  );
};

const styles = StyleSheet.create({
  center: {
    alignItems: 'center',
    backgroundColor: colors.background,
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },
});

export default RootLayout;
