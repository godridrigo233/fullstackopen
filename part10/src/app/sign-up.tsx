import { useMutation } from '@apollo/client/react';
import { router } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import AppText from '../components/AppText';
import Screen from '../components/Screen';
import SignUpForm, { SignUpValues } from '../components/SignUpForm';
import { CREATE_USER } from '../graphql/mutations';
import { colors, spacing } from '../theme';

type CreateUserData = {
  createUser: { id: string; username: string };
};

const errorMessage = (error: unknown): string =>
  error instanceof Error ? error.message : 'Unable to create the account.';

const SignUp = () => {
  const [serverError, setServerError] = useState<string | null>(null);
  const [createUser, { loading }] = useMutation<CreateUserData>(CREATE_USER);

  const onSubmit = async ({
    username,
    password,
  }: SignUpValues): Promise<void> => {
    setServerError(null);
    try {
      const result = await createUser({
        variables: { user: { username, password } },
      });
      if (!result.data?.createUser) {
        throw new Error('The server did not create the account.');
      }
      router.replace({ pathname: '/sign-in', params: { registered: '1' } });
    } catch (error: unknown) {
      setServerError(errorMessage(error));
    }
  };

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.content}>
          <AppText bold style={styles.title}>
            Create an account
          </AppText>
          <SignUpForm
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
});

export default SignUp;
