import { useMutation } from '@apollo/client/react';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import AppText from '../components/AppText';
import Screen from '../components/Screen';
import SignInForm, { SignInValues } from '../components/SignInForm';
import { useAuth } from '../contexts/AuthContext';
import { AUTHENTICATE } from '../graphql/mutations';
import { colors, spacing } from '../theme';

type AuthenticateData = {
  authenticate: { accessToken: string };
};

const errorMessage = (error: unknown): string =>
  error instanceof Error ? error.message : 'Unable to sign in.';

const SignIn = () => {
  const { signIn } = useAuth();
  const params = useLocalSearchParams<{ registered?: string }>();
  const [serverError, setServerError] = useState<string | null>(null);
  const [authenticate, { loading }] = useMutation<AuthenticateData>(AUTHENTICATE);

  const onSubmit = async ({ username, password }: SignInValues) => {
    setServerError(null);
    try {
      const result = await authenticate({
        variables: { credentials: { username, password } },
      });
      const token = result.data?.authenticate.accessToken;
      if (!token) throw new Error('The server did not return an access token.');
      await signIn(token);
      router.replace('/');
    } catch (error: unknown) {
      setServerError(errorMessage(error));
    }
  };

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.content}>
          <AppText bold style={styles.title}>
            Sign in
          </AppText>
          {params.registered ? (
            <AppText style={styles.success}>
              Your account was created. Sign in to continue.
            </AppText>
          ) : null}
          <SignInForm
            loading={loading}
            onSubmit={onSubmit}
            serverError={serverError}
          />
        </View>
      </ScrollView>
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: spacing.md,
  },
  content: {
    alignSelf: 'center',
    maxWidth: 520,
    width: '100%',
  },
  title: {
    color: colors.primaryDark,
    fontSize: 24,
    marginBottom: spacing.md,
  },
  success: {
    color: colors.primaryDark,
    marginBottom: spacing.md,
  },
});

export default SignIn;
